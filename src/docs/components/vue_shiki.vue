<script lang="ts">
  import { defineComponent, PropType } from 'vue'
  import { Generate, Config, Http } from '../../gimmehttp/index'
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
  import javascript from 'shiki/langs/javascript.mjs'
  import php from 'shiki/langs/php.mjs'
  import python from 'shiki/langs/python.mjs'
  import ruby from 'shiki/langs/ruby.mjs'
  import rust from 'shiki/langs/rust.mjs'
  import shell from 'shiki/langs/shell.mjs'
  import swift from 'shiki/langs/swift.mjs'

  export default defineComponent({
    name: 'GimmeHttp',
    props: {
      theme: {
        type: String,
        required: false,
        default: 'github-dark'
      },
      language: {
        type: String,
        required: false,
        default: 'javascript'
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

        output: 'fdsafsda'
      }
    },
    async created() {
      const highlighter = await createHighlighterCore({
        themes: [githubDark, githubLight],
        langs: [c, csharp, go, javascript, php, python, ruby, rust, shell, swift],
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
      language() {
        this.code()
      },
      client() {
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
    methods: {
      code() {
        if (!this.highlighter) {
          return
        }

        const { code, error } = Generate({
          language: this.language,
          client: this.client,
          config: this.config,
          http: this.http
        })
        if (error) {
          this.output = error
          return
        }

        this.output = this.highlighter.codeToHtml(code!, {
          lang: this.language,
          theme: this.theme
          // transformers: [
          //   {
          //     name: 'vitepress:add-class',
          //     pre(node) {
          //       this.addClassToHast(node, 'vp-code')
          //       this.addClassToHast(node, 'shiki-themes')
          //     }
          //   }
          // ]
        })
      }
    }
  })
</script>

<style lang="scss">
  .gimmehttp {
  }
</style>

<template>
  <div class="gimmehttp" :class="'language-' + language" v-html="output" />
</template>
