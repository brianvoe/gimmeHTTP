<script lang="ts">
  import type { PropType } from 'vue'
  import { defineComponent } from 'vue'
  import type { Config, Http } from '@/gimmehttp/utils/generate'
  import { Generate, Clients, Search } from '@/gimmehttp/index'
  import { createHighlighterCore } from 'shiki/core'
  import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

  import C from 'shiki/langs/c.mjs'
  import Csharp from 'shiki/langs/csharp.mjs'
  import Dart from 'shiki/langs/dart.mjs'
  import Go from 'shiki/langs/go.mjs'
  import Java from 'shiki/langs/java.mjs'
  import Javascript from 'shiki/langs/javascript.mjs'
  import Kotlin from 'shiki/langs/kotlin.mjs'
  import Php from 'shiki/langs/php.mjs'
  import Python from 'shiki/langs/python.mjs'
  import R from 'shiki/langs/r.mjs'
  import Ruby from 'shiki/langs/ruby.mjs'
  import Rust from 'shiki/langs/rust.mjs'
  import Shell from 'shiki/langs/shellscript.mjs'
  import Swift from 'shiki/langs/swift.mjs'
  import Typescript from 'shiki/langs/typescript.mjs'
  import Json from 'shiki/langs/json.mjs'

  import themeGithubDark from 'shiki/themes/github-dark.mjs'
  import themeGithubLight from 'shiki/themes/github-light.mjs'

  import { getLogo } from '../logos/index'

  const defaultLang = 'javascript'

  export default defineComponent({
    name: 'GimmeHttp',
    emits: ['update:language', 'update:client'],
    props: {
      http: {
        type: Object as PropType<Http>,
        required: true
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
      theme: {
        type: String as PropType<'light' | 'dark'>,
        required: false
      }
    },
    data() {
      const isBrowser = typeof window !== 'undefined'
      const lang = this.language && this.language !== '' ? this.language : null
      const storedLanguage = lang || (isBrowser ? localStorage.getItem('gimmeLang') : null) || defaultLang
      let storedClient = this.client || (isBrowser ? localStorage.getItem('gimmeClient') : null)
      if (!storedClient || storedClient === '') {
        const client = Search(storedLanguage)
        if (client) {
          storedClient = client.client
        }
      }

      const prefersDark = isBrowser && window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme = this.theme ? this.theme : prefersDark ? 'dark' : 'light'

      return {
        highlighter: null as any,
        clientsList: Clients(),
        showCopied: false,
        openModal: false,
        openModalContent: false,
        codeStr: '',
        output: '',
        themeMode: initialTheme,
        internalLanguage: storedLanguage,
        internalClient: storedClient || '',
        checkInterval: null as number | null
      }
    },
    async created() {
      this.highlighter = await createHighlighterCore({
        themes: [themeGithubDark, themeGithubLight],
        langs: [
          C,
          Csharp,
          Dart,
          Go,
          Java,
          Javascript,
          Kotlin,
          Php,
          Python,
          R,
          Ruby,
          Rust,
          Shell,
          Swift,
          Typescript,
          Json
        ],
        langAlias: {
          ts: 'typescript',
          node: 'javascript',
          nodejs: 'javascript'
        },
        engine: createJavaScriptRegexEngine()
      })

      this.code()

      if (typeof window !== 'undefined') {
        setTimeout(() => {
          this.checkInterval = window.setInterval(this.checkLocalStorage, 1000)
        }, 1000)
      }
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
      theme(newTheme) {
        const isBrowser = typeof window !== 'undefined'
        if (newTheme === 'light' || newTheme === 'dark') {
          this.themeMode = newTheme
        } else {
          const prefersDark = isBrowser && window.matchMedia('(prefers-color-scheme: dark)').matches
          this.themeMode = prefersDark ? 'dark' : 'light'
        }
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
      },
      shikiTheme(): string {
        return this.themeMode === 'dark' ? 'github-dark' : 'github-light'
      }
    },
    methods: {
      logoSvg(name: string): string | null {
        return getLogo(name)
      },
      setLanguage(lang: string | null) {
        this.internalLanguage = lang || defaultLang
        if (typeof window !== 'undefined') {
          localStorage.setItem('gimmeLang', this.internalLanguage)
        }
        this.$emit('update:language', this.internalLanguage)
      },
      setClient(client: string | null) {
        this.internalClient = client || ''
        if (typeof window !== 'undefined') {
          localStorage.setItem('gimmeClient', this.internalClient)
        }
        this.$emit('update:client', this.internalClient)
      },
      code() {
        if (!this.highlighter) {
          return
        }

        try {
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
            theme: this.shikiTheme
          })
        } catch (error) {
          console.error('Error in code highlighting:', error)
          this.output = this.codeStr
        }
      },

      clickCopy() {
        this.showCopied = true
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(this.codeStr)
        }
        setTimeout(() => {
          this.showCopied = false
        }, 2000)
      },

      toggleModal() {
        const isOpening = !this.openModal

        if (isOpening) {
          // Opening: show modal bg first, then content
          this.openModal = true
          if (typeof document !== 'undefined') {
            document.addEventListener('click', this.clickModalBg)
          }
          setTimeout(() => {
            this.openModalContent = true
          }, 100)
        } else {
          // Closing: hide content first, then modal bg
          this.openModalContent = false
          setTimeout(() => {
            this.openModal = false
            if (typeof document !== 'undefined') {
              document.removeEventListener('click', this.clickModalBg)
            }
          }, 200)
        }
      },
      clickModalBg(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains('gh-modal')) {
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
        if (!this.highlighter || typeof window === 'undefined') {
          return
        }
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
  :root {
    // colors
    --gh-text-color: #3d2c2c;
    --gh-text-color-accent: #1f120b;
    --gh-border-color: #535353;
    --gh-accent-color: #ff9122;
    --gh-accent-foreground: #1f120b;
    --gh-shell-track-color: #2b2b2b;
    --gh-modal-bg-color: rgba(0, 0, 0, 0.4);
    --gh-modal-content-color: #2b2b2b;

    // spacing
    --gh-spacing: 16px;
    --gh-spacing-half: 8px;
    --gh-spacing-quarter: 4px;

    // misc
    --gh-border-radius: 8px;
    --gh-options-height: 40px;
    --gh-box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    --gh-timing: 0.3s;
  }

  .gimmehttp {
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: var(--gh-border-radius);
    width: 100%;
    max-width: 100%;
    height: 100%;
    min-height: 0;
    overflow: auto;
    box-shadow: var(--gh-box-shadow);

    .gh-options {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 3;
      padding: 0;
      margin: 0;
      height: var(--gh-options-height);
      max-height: var(--gh-options-height);
      border-bottom-left-radius: var(--gh-border-radius);
      border-left: solid 1px var(--gh-border-color);
      border-bottom: solid 1px var(--gh-border-color);
      color: var(--gh-text-color);
      overflow: hidden;
      cursor: pointer;

      .gh-copy {
        flex: 0 1 auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: var(--gh-spacing-half);
        margin: 0;
        gap: var(--gh-spacing-half);
        transition:
          background-color var(--gh-timing) ease,
          color var(--gh-timing) ease;

        &:hover {
          background-color: var(--gh-accent-color);
          color: var(--gh-text-color-accent);
        }

        &.gh-show-copied {
          background-color: var(--gh-accent-color);
          color: var(--gh-text-color-accent);
        }

        .gh-txt {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gh-border-color);
          font-size: 16px;
          text-align: center;
          line-height: 1;
        }

        svg {
          height: 100%;
          width: auto;
          max-height: 20px;
          max-width: 40px;
          fill: var(--gh-border-color);
        }
      }

      .gh-separator {
        flex: 0 1 1px;
        width: 1px;
        min-width: 1px;
        height: 60%;
        padding: 0;
        margin: 0;
        background-color: var(--gh-border-color);
      }

      .gh-lang {
        flex: 0 1 auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 100%;
        max-height: var(--gh-options-height);
        padding: var(--gh-spacing-half);
        margin: 0;
        gap: var(--gh-spacing-half);
        transition:
          background-color var(--gh-timing) ease,
          color var(--gh-timing) ease;

        &:hover {
          background-color: var(--gh-accent-color);
          color: var(--gh-text-color-accent);
        }

        .gh-select {
          height: 100%;
          width: auto;
          max-width: 40px;
          background-color: transparent;
          color: var(--gh-border-color);
          display: flex;
          align-items: center;
          justify-content: center;

          svg {
            width: 100%;
            height: 100%;
            max-width: 40px;
            max-height: 40px;
            display: block;
          }
        }

        .gh-lang-text {
          font-size: 12px;
          font-weight: 600;
          color: var(--gh-border-color);
          text-transform: uppercase;
          white-space: nowrap;
        }

        .gh-arrows {
          height: 100%;
          width: auto;
          max-height: 16px;
          max-width: 40px;
          fill: var(--gh-border-color);
        }
      }
    }

    .gh-output {
      flex: 1 1 auto;
      width: 100%;
      padding: 0;
      margin: 0 !important;
      overflow: auto;

      &.gh-modalOpen {
        pre.shiki {
          min-height: 300px !important;
        }
      }

      pre.shiki {
        width: 100%;
        height: auto;
        min-height: 50px;
        margin: 0;
        padding: var(--gh-spacing);
        border-radius: var(--gh-border-radius);
        overflow-x: auto;
        overflow-y: auto;
        transition: min-height var(--gh-timing) ease-in-out;

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

    .gh-modal {
      display: flex;
      position: absolute;
      justify-content: center;
      align-items: flex-start;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 4;
      overflow: auto;
      background-color: var(--gh-modal-bg-color);
      transition: opacity var(--gh-timing) ease;

      .gh-content {
        display: flex;
        flex-direction: column;
        width: 90%;
        max-width: 350px;
        margin-top: var(--gh-spacing);
        padding: var(--gh-spacing);
        gap: var(--gh-spacing);
        color: var(--gh-text-color);
        background-color: var(--gh-modal-content-color);
        border-radius: var(--gh-border-radius);
        box-shadow: var(--gh-box-shadow);
        will-change: transform, opacity;

        .gh-langs {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--gh-spacing-half);

          .gh-lang {
            display: flex;
            width: 50px;
            height: 50px;
            padding: var(--gh-spacing-half);
            border: solid 1px var(--gh-border-color);
            border-radius: var(--gh-border-radius);
            cursor: pointer;
            transition:
              transform var(--gh-timing) ease,
              box-shadow var(--gh-timing) ease,
              background-color var(--gh-timing) ease,
              border-color var(--gh-timing) ease;

            align-items: center;
            justify-content: center;

            svg {
              width: 100%;
              height: 100%;
              max-width: 40px;
              max-height: 40px;
              display: block;
            }

            &.gh-selected,
            &:hover {
              background-color: var(--gh-accent-color);
              border-color: var(--gh-border-color);
              transform: translateY(-5px);
              box-shadow: var(--gh-box-shadow);
            }

            img {
              display: flex;
              justify-self: center;
              align-self: center;
              width: 100%;
              height: 100%;
              filter: drop-shadow(0 4px 10px var(--gh-border-color));
            }

            .gh-lang-text-modal {
              display: flex;
              justify-self: center;
              align-self: center;
              font-size: 10px;
              font-weight: 700;
              color: var(--gh-border-color);
              text-transform: uppercase;
              text-align: center;
            }
          }
        }

        .gh-separator {
          width: 50%;
          height: 1px;
          margin: 0 auto;
          background: var(--gh-border-color);
        }

        .gh-clients {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--gh-spacing);

          .gh-client {
            padding: var(--gh-spacing-half);
            border: solid 1px var(--gh-border-color);
            border-radius: var(--gh-border-radius);
            color: var(--gh-border-color);
            cursor: pointer;
            transition:
              transform var(--gh-timing) ease,
              box-shadow var(--gh-timing) ease,
              background-color var(--gh-timing) ease,
              border-color var(--gh-timing) ease;

            &.gh-selected,
            &:hover {
              background-color: var(--gh-accent-color);
              border-color: var(--gh-border-color);
              color: var(--gh-text-color-accent);
              transform: translateY(-5px);
              box-shadow: var(--gh-box-shadow);
            }
          }
        }
      }
    }
  }

  /* modal background fade */
  .gimme-modal-bg-enter-active,
  .gimme-modal-bg-leave-active {
    transition: opacity var(--gh-timing) ease;
  }
  .gimme-modal-bg-enter-from,
  .gimme-modal-bg-leave-to {
    opacity: 0;
  }

  /* Modal content fade/slide in */
  .gimme-modal-content-enter-active,
  .gimme-modal-content-leave-active {
    transition:
      transform var(--gh-timing) ease,
      opacity var(--gh-timing) ease;
  }

  .gimme-modal-content-enter-from,
  .gimme-modal-content-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  .gimme-modal-content-enter-to,
  .gimme-modal-content-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
</style>

<template>
  <div class="gimmehttp">
    <div class="gh-options">
      <div :class="['gh-copy', { 'gh-show-copied': showCopied }]" @click="clickCopy()">
        <svg v-if="!showCopied" aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path
            d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
          />
          <path
            d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
          />
        </svg>
        <div v-else class="gh-txt">Copied!</div>
      </div>
      <div class="gh-separator" />
      <div class="gh-lang" @click="toggleModal()">
        <span v-if="logoSvg(internalLanguage)" v-html="logoSvg(internalLanguage)" class="gh-select"></span>
        <span v-else class="gh-lang-text">{{ internalLanguage }}</span>
        <svg class="gh-arrows" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m3.707 2.293 5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L6.586 8 2.293 3.707a1 1 0 0 1 1.414-1.414m5 0 5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L11.586 8 7.293 3.707a1 1 0 0 1 1.414-1.414"
          />
        </svg>
      </div>
    </div>
    <div :class="'gh-output language-' + internalLanguage + (openModal ? ' gh-modalOpen' : '')" v-html="output" />

    <transition name="gimme-modal-bg">
      <div v-if="openModal" class="gh-modal" @click="clickModalBg">
        <transition name="gimme-modal-content">
          <div v-if="openModalContent" class="gh-content">
            <div class="gh-langs">
              <div
                class="gh-lang"
                :class="{ 'gh-selected': internalLanguage === lang }"
                v-for="lang in languages"
                :key="lang"
                @click="clickModalLang(lang)"
              >
                <span v-if="logoSvg(lang)" v-html="logoSvg(lang)"></span>
                <span v-else class="gh-lang-text-modal">{{ lang }}</span>
              </div>
            </div>
            <div class="gh-separator"></div>
            <div class="gh-clients">
              <div class="gh-client" v-for="client in clients" :key="client" @click="clickModalClient(client)">
                {{ client }}
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>
