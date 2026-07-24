<script lang="ts">
  import type { PropType } from 'vue'
  import { defineComponent } from 'vue'
  import hljs from 'highlight.js'

  // Register languages
  import c from 'highlight.js/lib/languages/c'
  import csharp from 'highlight.js/lib/languages/csharp'
  import go from 'highlight.js/lib/languages/go'
  import java from 'highlight.js/lib/languages/java'
  import javascript from 'highlight.js/lib/languages/javascript'
  import typescript from 'highlight.js/lib/languages/typescript'
  import vue from 'highlight.js/lib/languages/xml' // Vue uses XML highlighting
  import php from 'highlight.js/lib/languages/php'
  import python from 'highlight.js/lib/languages/python'
  import r from 'highlight.js/lib/languages/r'
  import ruby from 'highlight.js/lib/languages/ruby'
  import rust from 'highlight.js/lib/languages/rust'
  import bash from 'highlight.js/lib/languages/bash'
  import swift from 'highlight.js/lib/languages/swift'
  import css from 'highlight.js/lib/languages/css'
  import html from 'highlight.js/lib/languages/xml'

  // Register all languages
  hljs.registerLanguage('c', c)
  hljs.registerLanguage('csharp', csharp)
  hljs.registerLanguage('go', go)
  hljs.registerLanguage('java', java)
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('typescript', typescript)
  hljs.registerLanguage('vue', vue)
  hljs.registerLanguage('php', php)
  hljs.registerLanguage('python', python)
  hljs.registerLanguage('r', r)
  hljs.registerLanguage('ruby', ruby)
  hljs.registerLanguage('rust', rust)
  hljs.registerLanguage('bash', bash)
  hljs.registerLanguage('shell', bash)
  hljs.registerLanguage('swift', swift)
  hljs.registerLanguage('css', css)
  hljs.registerLanguage('html', html)

  export default defineComponent({
    name: 'HighlightStyle',
    props: {
      language: {
        type: String,
        default: 'javascript'
      },
      theme: {
        type: String as PropType<'light' | 'dark'>,
        required: false
      }
    },
    data() {
      // Docs site is dark-only, default to dark unless explicitly overridden
      const initialTheme = this.theme ? this.theme : 'dark'

      return {
        highlightedCode: '',
        themeMode: initialTheme
      }
    },
    created() {
      this.highlightCode()

      this.$watch(
        () => this.$slots.default?.()[0]?.children?.toString(),
        (newVal, oldVal) => {
          if (newVal !== oldVal) {
            this.highlightCode()
          }
        }
      )
    },
    watch: {
      language() {
        this.highlightCode()
      },
      theme(newTheme) {
        this.themeMode = newTheme === 'light' ? 'light' : 'dark'
      }
    },
    methods: {
      highlightCode() {
        let code = this.$slots.default?.()[0]?.children?.toString() || ''

        // Remove leading/trailing <pre> tags
        code = code.replace(/^<pre>/, '').replace(/<\/pre>$/, '')

        // Normalize indentation
        code = this.normalizeIndentation(code)

        try {
          const highlighted = hljs.highlight(code, {
            language: this.language,
            ignoreIllegals: true
          })
          this.highlightedCode = `<pre class="hljs"><code class="language-${this.language}">${highlighted.value}</code></pre>`
        } catch (error) {
          // Fallback: escape HTML and wrap in pre/code tags
          const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          this.highlightedCode = `<pre class="hljs"><code>${escaped}</code></pre>`
        }
      },
      normalizeIndentation(code: string): string {
        const lines = code.split('\n')
        const minIndent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)![0].length))
        return lines.map((line) => line.slice(minIndent)).join('\n')
      }
    }
  })
</script>

<style lang="scss">
  .highlight-style {
    display: flex;
    width: 100%;

    // Warm retro dark code theme (default), gruvbox-inspired
    --gh-hljs-bg-color: #191512;
    --gh-hljs-color: #e0d4bc;
    --gh-hljs-keyword: #f0603f;
    --gh-hljs-entity: #f5c14e;
    --gh-hljs-constant: #d3869b;
    --gh-hljs-string: #b8b344;
    --gh-hljs-variable: #fe8019;
    --gh-hljs-comment: #8f7f6a;
    --gh-hljs-tag: #a9b665;
    --gh-hljs-subst: #e0d4bc;
    --gh-hljs-section: #f28534;
    --gh-hljs-bullet: #f5c14e;
    --gh-hljs-emphasis: #e0d4bc;
    --gh-hljs-strong: #f1e5cd;
    --gh-hljs-addition-color: #a9b665;
    --gh-hljs-addition-bg: #2a2d1e;
    --gh-hljs-deletion-color: #f0603f;
    --gh-hljs-deletion-bg: #3a1f18;

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

    pre.hljs {
      min-width: 0;
      width: 100%;
      padding: var(--spacing);
      margin: 0;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      overflow-x: auto;
      overflow-y: hidden;
      background-color: var(--gh-hljs-bg-color);
      box-sizing: border-box;
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
</style>

<template>
  <div class="highlight-style" :class="{ light: themeMode === 'light' }" v-html="highlightedCode"></div>
</template>
