<script lang="ts">
  import type { PropType } from 'vue'
  import { defineComponent } from 'vue'
  import type { Config, Http } from '@/gimmehttp/index'
  import { Generate, Clients, Search } from '@/gimmehttp/index'
  import type { Highlighter } from 'shiki'
  import { createHighlighter } from 'shiki'

  const defaultLang = 'javascript'
  const logoUrl = 'https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmeHTTP/logos/'

  export default defineComponent({
    name: 'GimmeHttp',
    emits: ['update:language', 'update:client'],
    props: {
      theme: {
        type: String,
        required: false,
        default: 'github-dark'
      },
      language: {
        type: String,
        required: false,
        default: ''
      },
      client: {
        type: String,
        required: false,
        default: ''
      },
      config: {
        type: Object as PropType<Config>,
        required: false
      },
      http: {
        type: Object as PropType<Http>,
        required: true
      }
    },
    data() {
      const lang = this.language && this.language !== '' ? this.language : null
      const storedLanguage = lang || localStorage.getItem('gimmeLang') || defaultLang
      let storedClient = this.client || localStorage.getItem('gimmeClient')
      if (!storedClient || storedClient === '') {
        const client = Search(storedLanguage)
        if (client) {
          storedClient = client.client
        }
      }

      return {
        highlighter: null as Highlighter | null,
        logoUrl: logoUrl,
        clientsList: Clients(),
        showCopied: false,
        openModal: false,
        codeStr: '',
        output: '',
        internalLanguage: storedLanguage,
        internalClient: storedClient || '',
        checkInterval: null as number | null
      }
    },
    async created() {
      this.highlighter = await createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: [
          'c',
          'csharp',
          'go',
          'java',
          'javascript',
          'php',
          'python',
          'r',
          'ruby',
          'rust',
          'shellscript',
          'swift',
          'typescript'
        ],
        langAlias: {
          ts: 'typescript',
          node: 'javascript',
          nodejs: 'javascript'
        }
      })

      this.code()

      setTimeout(() => {
        this.checkInterval = window.setInterval(this.checkLocalStorage, 1000)
      }, 1000)
    },
    unmounted() {
      if (this.highlighter) {
        this.highlighter.dispose()
      }
      if (this.checkInterval) {
        clearInterval(this.checkInterval)
      }
    },
    watch: {
      theme() {
        this.code()
      },
      language(newVal) {
        this.setLanguage(newVal)
        this.code()
      },
      client(newVal) {
        this.setClient(newVal)
        this.code()
      },
      config: {
        handler() {
          this.code()
        },
        deep: true
      },
      http: {
        handler() {
          this.code()
        },
        deep: true
      }
    },
    computed: {
      languages(): string[] {
        const langs = this.clientsList.map((client) => client.language)
        return langs.filter((lang, index) => langs.indexOf(lang) === index)
      },
      clients(): string[] {
        return this.clientsList
          .filter((client) => client.language === this.internalLanguage)
          .map((client) => client.client)
      }
    },
    methods: {
      setLanguage(lang: string | null) {
        this.internalLanguage = lang || defaultLang
        localStorage.setItem('gimmeLang', this.internalLanguage)
        this.$emit('update:language', this.internalLanguage)
      },
      setClient(client: string | null) {
        this.internalClient = client || ''
        localStorage.setItem('gimmeClient', this.internalClient)
        this.$emit('update:client', this.internalClient)
      },
      code() {
        if (!this.highlighter) {
          return
        }

        const { code, language, client, error } = Generate({
          language: this.internalLanguage,
          client: this.internalClient,
          config: this.config,
          http: this.http
        })
        if (error) {
          this.output = error
          return
        }

        this.setLanguage(language!)
        this.setClient(client!)

        this.codeStr = code!
        this.output = this.highlighter.codeToHtml(this.codeStr, {
          lang: this.internalLanguage,
          theme: this.theme
        })
      },

      clickCopy() {
        this.showCopied = true

        navigator.clipboard.writeText(this.codeStr)

        setTimeout(() => {
          this.showCopied = false
        }, 2000)
      },

      // Modal
      toggleModal() {
        this.openModal = !this.openModal

        if (this.openModal) {
          document.addEventListener('click', this.clickModalBg)
        } else {
          document.removeEventListener('click', this.clickModalBg)
        }
      },
      clickModalBg(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains('modal')) {
          this.toggleModal()
        }
      },
      clickModalLang(lang: string) {
        this.setLanguage(lang)
        this.toggleModal()
        this.code()
      },
      clickModalClient(client: string) {
        this.setClient(client)
        this.toggleModal()
        this.code()
      },
      checkLocalStorage() {
        const storedLanguage = localStorage.getItem('gimmeLang')
        const storedClient = localStorage.getItem('gimmeClient')
        let didChange = false

        if (storedLanguage && storedLanguage !== this.internalLanguage) {
          this.setLanguage(storedLanguage)
          didChange = true
        }
        if (storedClient && storedClient !== this.internalClient) {
          this.setClient(storedClient)
          didChange = true
        }

        if (didChange) {
          this.code()
        }
      }
    }
  })
</script>

<style lang="scss">
  .gimmehttp {
    // variables
    --text-color: #e0e0e0;
    --spacing: 16px;
    --spacing-half: 8px;
    --spacing-quarter: 4px;
    --border-radius: 8px;
    --border-color: #636363;
    --options-height: 40px;
    --modal-bg-color: rgba(0, 0, 0, 0.4);
    --modal-content-color: #2b2b2b;
    --timing: 0.3s;

    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: var(--border-radius);
    border: solid 1px var(--border-color);
    overflow: hidden;

    .options {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 3;
      padding: 0;
      margin: 0;
      height: var(--options-height);
      max-height: var(--options-height);
      border-bottom-left-radius: var(--border-radius);
      border-left: solid 1px var(--border-color);
      border-bottom: solid 1px var(--border-color);
      color: var(--text-color);
      overflow: hidden;
      cursor: pointer;
      transition:
        height var(--timing),
        width var(--timing);

      .copy {
        flex: 0 1 auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: var(--spacing-half);
        margin: 0;
        gap: var(--spacing-half);

        &:hover:not(.show-copied) {
          background-color: var(--border-color);
          color: var(--text-color);
        }

        .txt {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--border-color);
          font-size: 16px;
          text-align: center;
          line-height: 1;
          background-color: var(---c);
        }

        svg {
          height: 100%;
          width: auto;
          max-height: 20px;
          max-width: 40px;
          fill: var(--border-color);
        }
      }

      .separator {
        flex: 0 1 1px;
        width: 1px;
        min-width: 1px;
        height: 60%;
        padding: 0;
        margin: 0;
        background-color: var(--border-color);
      }

      .lang {
        flex: 0 1 auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 100%;
        max-height: var(--options-height);
        padding: var(--spacing-half);
        margin: 0;
        gap: var(--spacing-half);

        &:hover {
          background-color: var(--border-color);
          color: var(--text-color);
        }

        .select {
          height: 100%;
          width: auto; // Adjust width to auto to respect padding
          max-width: 40px;
          background-color: transparent;
          color: var(--border-color);
        }

        .arrows {
          height: 100%;
          width: auto; // Adjust width to auto to respect padding
          max-height: 16px;
          max-width: 40px;
          fill: var(--border-color);
        }
      }
    }

    .output {
      width: auto;
      padding: 0;
      margin: 0 !important;
      overflow: hidden;

      &.modalOpen {
        pre.shiki {
          min-height: 300px !important;
        }
      }

      pre.shiki {
        height: auto;
        min-height: 50px; // Set a default min-height for smooth transition
        margin: 0;
        padding: var(--spacing);
        border-radius: var(--border-radius);
        overflow-x: auto;
        overflow-y: hidden;
        transition: min-height var(--timing) ease-in-out;

        &::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 4px;
        }
        &::-webkit-scrollbar-thumb:hover {
          background-color: #777;
        }
        &::-webkit-scrollbar-track {
          background-color: #2b2b2b;
        }

        code {
          padding: 0;
          margin: 0;
        }
      }
    }

    .modal {
      display: flex;
      position: absolute;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 4;
      overflow: auto;
      background-color: var(--modal-bg-color);

      .content {
        display: flex;
        flex-direction: column;
        width: 90%;
        max-width: 350px;
        padding: var(--spacing);
        gap: var(--spacing);
        color: var(--text-color);
        background-color: var(--modal-content-color);
        border-radius: var(--border-radius);

        .langs {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--spacing-half);

          .lang {
            display: flex;
            width: 50px;
            height: 50px;
            padding: var(--spacing-half);
            border: solid 1px var(--border-color);
            border-radius: var(--border-radius);
            cursor: pointer;

            &.selected {
              background-color: var(--border-color);
            }

            img {
              display: flex;
              justify-self: center;
              align-self: center;
              width: 100%;
              height: 100%;
            }
          }
        }

        .separator {
          width: 50%;
          height: 1px;
          margin: 0 auto;
          background-color: var(--border-color);
        }

        .clients {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--spacing);

          .client {
            padding: var(--spacing-half);
            border: solid 1px var(--border-color);
            border-radius: var(--border-radius);
            cursor: pointer;
          }
        }
      }
    }
  }
</style>

<style></style>

<template>
  <div class="gimmehttp">
    <div class="options">
      <div :class="['copy', { 'show-copied': showCopied }]" @click="clickCopy()">
        <svg v-if="!showCopied" aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path
            d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
          />
          <path
            d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
          />
        </svg>
        <div v-else class="txt">Copied!</div>
      </div>
      <div class="separator" />
      <div class="lang" @click="toggleModal()">
        <img :src="logoUrl + internalLanguage + '.svg'" class="select" />
        <svg class="arrows" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m3.707 2.293 5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L6.586 8 2.293 3.707a1 1 0 0 1 1.414-1.414m5 0 5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L11.586 8 7.293 3.707a1 1 0 0 1 1.414-1.414"
          />
        </svg>
      </div>
    </div>
    <div :class="'output language-' + internalLanguage + (openModal ? ' modalOpen' : '')" v-html="output" />

    <!-- modal -->
    <div v-show="openModal" class="modal" @click="clickModalBg">
      <div class="content">
        <div class="langs">
          <div
            class="lang"
            :class="{ selected: internalLanguage === lang }"
            v-for="lang in languages"
            :key="lang"
            @click="clickModalLang(lang)"
          >
            <img :alt="lang" :src="logoUrl + lang + '.svg'" />
          </div>
        </div>
        <div class="separator"></div>
        <div class="clients">
          <div class="client" v-for="client in clients" :key="client" @click="clickModalClient(client)">
            {{ client }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
