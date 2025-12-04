<script lang="ts">
  import { defineComponent } from 'vue'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/github-dark.css'

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
      }
    },
    data() {
      return {
        highlightedCode: ''
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

    pre.hljs {
      min-width: 0;
      width: 100%;
      padding: var(--spacing);
      margin: 0;
      border-radius: var(--border-radius);
      overflow-x: auto;
      overflow-y: hidden;
    }
  }
</style>

<template>
  <div class="highlight-style" v-html="highlightedCode"></div>
</template>
