<script lang="ts">
  import type { PropType } from 'vue'
  import { defineComponent } from 'vue'
  import type { Config, Http } from '@/gimmehttp/utils/generate'
  import { Generate, Clients, Search } from '@/gimmehttp/index'
  import hljs from 'highlight.js'

  // Register languages
  import c from 'highlight.js/lib/languages/c'
  import csharp from 'highlight.js/lib/languages/csharp'
  import dart from 'highlight.js/lib/languages/dart'
  import go from 'highlight.js/lib/languages/go'
  import java from 'highlight.js/lib/languages/java'
  import javascript from 'highlight.js/lib/languages/javascript'
  import kotlin from 'highlight.js/lib/languages/kotlin'
  import php from 'highlight.js/lib/languages/php'
  import python from 'highlight.js/lib/languages/python'
  import r from 'highlight.js/lib/languages/r'
  import ruby from 'highlight.js/lib/languages/ruby'
  import rust from 'highlight.js/lib/languages/rust'
  import bash from 'highlight.js/lib/languages/bash'
  import swift from 'highlight.js/lib/languages/swift'
  import typescript from 'highlight.js/lib/languages/typescript'
  import json from 'highlight.js/lib/languages/json'

  // Register all languages
  hljs.registerLanguage('c', c)
  hljs.registerLanguage('csharp', csharp)
  hljs.registerLanguage('dart', dart)
  hljs.registerLanguage('go', go)
  hljs.registerLanguage('java', java)
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('kotlin', kotlin)
  hljs.registerLanguage('php', php)
  hljs.registerLanguage('python', python)
  hljs.registerLanguage('r', r)
  hljs.registerLanguage('ruby', ruby)
  hljs.registerLanguage('rust', rust)
  hljs.registerLanguage('bash', bash)
  hljs.registerLanguage('shell', bash)
  hljs.registerLanguage('shellscript', bash)
  hljs.registerLanguage('swift', swift)
  hljs.registerLanguage('typescript', typescript)
  hljs.registerLanguage('ts', typescript)
  hljs.registerLanguage('json', json)
  hljs.registerLanguage('node', javascript)
  hljs.registerLanguage('nodejs', javascript)

  // Language name mapping from internal names to highlight.js names
  const languageMap: Record<string, string> = {
    shellscript: 'bash',
    shell: 'bash',
    ts: 'typescript',
    node: 'javascript',
    nodejs: 'javascript'
  }

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
        required: false,
        default: 'dark'
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
    created() {
      this.code()

      if (typeof window !== 'undefined') {
        setTimeout(() => {
          this.checkInterval = window.setInterval(this.checkLocalStorage, 1000)
        }, 1000)
      }
    },
    unmounted() {
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

          // Map language name to highlight.js language
          const hljsLang = languageMap[this.internalLanguage] || this.internalLanguage

          // Highlight the code
          const highlighted = hljs.highlight(this.codeStr, {
            language: hljsLang,
            ignoreIllegals: true
          })

          // Wrap in pre and code tags with appropriate classes
          this.output = `<pre class="hljs"><code class="language-${hljsLang}">${highlighted.value}</code></pre>`
        } catch (error) {
          console.error('Error in code highlighting:', error)
          // Fallback: escape HTML and wrap in pre/code tags
          const escaped = this.codeStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          this.output = `<pre class="hljs"><code>${escaped}</code></pre>`
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
        if (typeof window === 'undefined') {
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
  // Highlight.js themes are dynamically loaded via link tags in the document head

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

    // GitHub Dark Theme Colors (default)
    --gh-hljs-bg-color: #282c34;
    --gh-hljs-color: #c9d1d9;
    --gh-hljs-keyword: #ff7b72;
    --gh-hljs-entity: #d2a8ff;
    --gh-hljs-constant: #79c0ff;
    --gh-hljs-string: #a5d6ff;
    --gh-hljs-variable: #ffa657;
    --gh-hljs-comment: #8b949e;
    --gh-hljs-tag: #7ee787;
    --gh-hljs-subst: #c9d1d9;
    --gh-hljs-section: #1f6feb;
    --gh-hljs-bullet: #f2cc60;
    --gh-hljs-emphasis: #c9d1d9;
    --gh-hljs-strong: #c9d1d9;
    --gh-hljs-addition-color: #aff5b4;
    --gh-hljs-addition-bg: #033a16;
    --gh-hljs-deletion-color: #ffdcd7;
    --gh-hljs-deletion-bg: #67060c;

    &.light {
      // GitHub Light Theme Colors
      --gh-hljs-bg-color: #fafafa;
      --gh-hljs-color: #24292e;
      --gh-hljs-keyword: #d73a49;
      --gh-hljs-entity: #6f42c1;
      --gh-hljs-constant: #005cc5;
      --gh-hljs-string: #032f62;
      --gh-hljs-variable: #e36209;
      --gh-hljs-comment: #6a737d;
      --gh-hljs-tag: #22863a;
      --gh-hljs-subst: #24292e;
      --gh-hljs-section: #005cc5;
      --gh-hljs-bullet: #735c0f;
      --gh-hljs-emphasis: #24292e;
      --gh-hljs-strong: #24292e;
      --gh-hljs-addition-color: #22863a;
      --gh-hljs-addition-bg: #f0fff4;
      --gh-hljs-deletion-color: #b31d28;
      --gh-hljs-deletion-bg: #ffeef0;
    }

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
          background-color: var(--gh-border-color);

          svg {
            fill: var(--gh-accent-color);
          }
        }

        &.gh-show-copied {
          background-color: var(--gh-border-color);

          .gh-txt {
            color: var(--gh-accent-color);
          }
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
          max-height: 16px;
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
          background-color: var(--gh-border-color);

          svg {
            fill: var(--gh-accent-color);
          }
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
          max-height: 20px;
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
        pre.hljs {
          min-height: 300px !important;
        }
      }

      pre.hljs {
        width: 100%;
        height: auto;
        min-height: 50px;
        margin: 0;
        padding: var(--gh-spacing);
        border-radius: var(--gh-border-radius);
        overflow-x: auto;
        overflow-y: auto;
        background-color: var(--gh-hljs-bg-color);
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

      // Highlight.js syntax highlighting styles
      .hljs {
        color: var(--gh-hljs-color);
        background: var(--gh-hljs-bg-color);
      }

      pre code.hljs {
        display: block;
        overflow-x: auto;
        padding: 1em;
      }

      code.hljs {
        padding: 3px 5px;
      }

      .hljs-doctag,
      .hljs-keyword,
      .hljs-meta .hljs-keyword,
      .hljs-template-tag,
      .hljs-template-variable,
      .hljs-type,
      .hljs-variable.language_ {
        color: var(--gh-hljs-keyword);
      }

      .hljs-title,
      .hljs-title.class_,
      .hljs-title.class_.inherited__,
      .hljs-title.function_ {
        color: var(--gh-hljs-entity);
      }

      .hljs-attr,
      .hljs-attribute,
      .hljs-literal,
      .hljs-meta,
      .hljs-number,
      .hljs-operator,
      .hljs-variable,
      .hljs-selector-attr,
      .hljs-selector-class,
      .hljs-selector-id {
        color: var(--gh-hljs-constant);
      }

      .hljs-regexp,
      .hljs-string,
      .hljs-meta .hljs-string {
        color: var(--gh-hljs-string);
      }

      .hljs-built_in,
      .hljs-symbol {
        color: var(--gh-hljs-variable);
      }

      .hljs-comment,
      .hljs-code,
      .hljs-formula {
        color: var(--gh-hljs-comment);
      }

      .hljs-name,
      .hljs-quote,
      .hljs-selector-tag,
      .hljs-selector-pseudo {
        color: var(--gh-hljs-tag);
      }

      .hljs-subst {
        color: var(--gh-hljs-subst);
      }

      .hljs-section {
        color: var(--gh-hljs-section);
        font-weight: bold;
      }

      .hljs-bullet {
        color: var(--gh-hljs-bullet);
      }

      .hljs-emphasis {
        color: var(--gh-hljs-emphasis);
        font-style: italic;
      }

      .hljs-strong {
        color: var(--gh-hljs-strong);
        font-weight: bold;
      }

      .hljs-addition {
        color: var(--gh-hljs-addition-color);
        background-color: var(--gh-hljs-addition-bg);
      }

      .hljs-deletion {
        color: var(--gh-hljs-deletion-color);
        background-color: var(--gh-hljs-deletion-bg);
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
              background-color: var(--gh-border-color);
              border-color: var(--gh-accent-color);
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
              background-color: var(--gh-border-color);
              border-color: var(--gh-accent-color);
              color: var(--gh-accent-color);
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
  <div class="gimmehttp" :class="{ light: themeMode === 'light' }">
    <div class="gh-options">
      <div :class="['gh-copy', { 'gh-show-copied': showCopied }]" @click="clickCopy()">
        <svg v-if="!showCopied" aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path
            class="gh-copy-top"
            d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
          />
          <path
            class="gh-copy-bottom"
            d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
          />
        </svg>
        <div v-else class="gh-txt">Copied!</div>
      </div>
      <div class="gh-separator" />
      <div class="gh-lang" @click="toggleModal()">
        <span v-if="logoSvg(internalLanguage)" v-html="logoSvg(internalLanguage)" class="gh-select"></span>
        <span v-else class="gh-lang-text">{{ internalLanguage }}</span>
        <svg class="gh-arrows" viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z"
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
