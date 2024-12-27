<script lang="ts">
  import { defineComponent, PropType } from 'vue'
  import { Generate, Config, Http, Codes } from '../../gimmehttp/index'
  import { createHighlighterCore, HighlighterCore } from 'shiki/core'
  import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
  import shikiWasm from 'shiki/wasm'

  // Themes
  import githubDark from 'shiki/themes/github-dark.mjs'
  import githubLight from 'shiki/themes/github-light.mjs'

  // Languages
  import c from 'shiki/langs/c.mjs'
  import csharp from 'shiki/langs/csharp.mjs'
  import go from 'shiki/langs/go.mjs'
  import java from 'shiki/langs/java.mjs'
  import javascript from 'shiki/langs/javascript.mjs'
  import php from 'shiki/langs/php.mjs'
  import python from 'shiki/langs/python.mjs'
  import r from 'shiki/langs/r.mjs'
  import ruby from 'shiki/langs/ruby.mjs'
  import rust from 'shiki/langs/rust.mjs'
  import shell from 'shiki/langs/shell.mjs'
  import swift from 'shiki/langs/swift.mjs'
  import typescript from 'shiki/langs/typescript.mjs'

  const defaultLang = 'php'
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
        default: defaultLang
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
      return {
        highlighter: null as HighlighterCore | null,
        logoUrl: logoUrl,
        codes: Codes(),
        openModal: false,
        output: '',
        internalLanguage: this.language,
        internalClient: this.client
      }
    },
    async created() {
      const highlighter = await createHighlighterCore({
        themes: [githubDark, githubLight],
        langs: [c, csharp, go, java, javascript, php, python, r, ruby, rust, shell, swift, typescript],
        langAlias: {
          ts: 'typescript',
          node: 'javascript',
          nodejs: 'javascript'
        },
        engine: createOnigurumaEngine(shikiWasm)
      })

      this.highlighter = highlighter

      this.code()
    },
    unmounted() {
      if (this.highlighter) {
        this.highlighter.dispose()
      }
    },
    watch: {
      theme() {
        this.code()
      },
      language(newVal) {
        this.internalLanguage = newVal || defaultLang
        this.code()
      },
      client(newVal) {
        this.internalClient = newVal || ''
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
        const langs = this.codes.map((code) => code.language)

        // Remove duplicates
        const unique = langs.filter((lang, index) => langs.indexOf(lang) === index)

        return unique
      },
      clients(): string[] {
        // Filter only client of the selected language
        return this.codes.filter((code) => code.language === this.internalLanguage).map((code) => code.client)
      }
    },
    methods: {
      code() {
        if (!this.highlighter) {
          return
        }

        const { code, error } = Generate({
          language: this.internalLanguage,
          client: this.internalClient,
          config: this.config,
          http: this.http
        })
        if (error) {
          this.output = error
          return
        }

        this.output = this.highlighter.codeToHtml(code!, {
          lang: this.internalLanguage,
          theme: this.theme
        })
      },

      // Modal
      toggleModal() {
        this.openModal = !this.openModal

        // If open add click event listener to modal
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
        this.internalLanguage = lang
        this.$emit('update:language', lang)

        this.toggleModal()

        this.code()
      },
      clickModalClient(client: string) {
        this.internalClient = client
        this.$emit('update:client', client)

        this.toggleModal()

        this.code()
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
    --modal-bg-color: rgba(0, 0, 0, 0.4);
    --modal-content-color: #2b2b2b;
    --timing: 0.3s;

    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: var(--border-radius);
    overflow: hidden;

    .selector {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1000;
      gap: var(--spacing-half);
      border-bottom-left-radius: var(--border-radius);
      border-left: solid 1px var(--border-color);
      border-bottom: solid 1px var(--border-color);
      padding: var(--spacing-half);
      color: var(--text-color);
      cursor: pointer;
      transition:
        height var(--timing),
        width var(--timing);

      &:hover {
        background-color: var(--border-color);
        color: var(--text-color);
      }

      .select {
        height: 100%;
        width: 100%;
        max-height: 28px;
        max-width: 40px;
        background-color: transparent;
        color: var(--border-color);
      }

      .arrows {
        height: 100%;
        width: 100%;
        max-height: 20px;
        max-width: 40px;
        fill: var(--border-color);
      }
    }

    .output {
      width: auto;
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
      z-index: 1000;
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

    .fade-enter-active,
    .fade-leave-active {
      transition: all var(--timing) ease;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
</style>

<style></style>

<template>
  <div class="gimmehttp">
    <div @click="toggleModal()" class="selector">
      <img :src="logoUrl + internalLanguage + '.svg'" class="select" />
      <svg class="arrows" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m3.707 2.293 5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L6.586 8 2.293 3.707a1 1 0 0 1 1.414-1.414m5 0 5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L11.586 8 7.293 3.707a1 1 0 0 1 1.414-1.414"
        />
      </svg>
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
        <transition-group name="fade" tag="div" class="clients">
          <div class="client" v-for="client in clients" :key="client" @click="clickModalClient(client)">
            {{ client }}
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>
