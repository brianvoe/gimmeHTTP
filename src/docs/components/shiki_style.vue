<script lang="ts">
  import { defineComponent } from 'vue'
  import { createHighlighterCore } from 'shiki/core'
  import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

  // Themes
  import githubDark from 'shiki/themes/github-dark.mjs'
  import githubLight from 'shiki/themes/github-light.mjs'

  // Languages
  import c from 'shiki/langs/c.mjs'
  import csharp from 'shiki/langs/csharp.mjs'
  import go from 'shiki/langs/go.mjs'
  import java from 'shiki/langs/java.mjs'
  import javascript from 'shiki/langs/javascript.mjs'
  import vue from 'shiki/langs/vue.mjs'
  import php from 'shiki/langs/php.mjs'
  import python from 'shiki/langs/python.mjs'
  import r from 'shiki/langs/r.mjs'
  import ruby from 'shiki/langs/ruby.mjs'
  import rust from 'shiki/langs/rust.mjs'
  import shell from 'shiki/langs/shellscript.mjs'
  import swift from 'shiki/langs/swift.mjs'
  import typescript from 'shiki/langs/typescript.mjs'

  export default defineComponent({
    name: 'ShikiStyle',
    props: {
      language: {
        type: String,
        default: 'javascript'
      }
    },
    data() {
      return {
        highlighter: null as Awaited<ReturnType<typeof createHighlighterCore>> | null,
        highlightedCode: ''
      }
    },
    async created() {
      const highlighter = await createHighlighterCore({
        themes: [githubDark, githubLight],
        langs: [c, csharp, go, java, javascript, vue, php, python, r, ruby, rust, shell, swift, typescript],
        langAlias: {
          ts: 'typescript',
          node: 'javascript',
          nodejs: 'javascript'
        },
        engine: createJavaScriptRegexEngine()
      })

      this.highlighter = highlighter
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
    unmounted() {
      if (this.highlighter) {
        this.highlighter.dispose()
      }
    },
    watch: {
      language() {
        this.highlightCode()
      }
    },
    methods: {
      highlightCode() {
        if (!this.highlighter) {
          return
        }

        let code = this.$slots.default?.()[0]?.children?.toString() || ''

        // Remove leading/trailing <pre> tags
        code = code.replace(/^<pre>/, '').replace(/<\/pre>$/, '')

        // Normalize indentation
        code = this.normalizeIndentation(code)

        this.highlightedCode = this.highlighter.codeToHtml(code, {
          lang: this.language,
          theme: 'github-dark'
        })
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
  .shiki-style {
    pre.shiki {
      padding: var(--spacing);
      border-radius: var(--border-radius);
      overflow-x: auto;
      overflow-y: hidden;
      white-space: pre-wrap; /* Preserve whitespace and newlines */
    }
  }
</style>

<template>
  <div class="shiki-style" v-html="highlightedCode"></div>
</template>
