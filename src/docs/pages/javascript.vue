<script lang="ts">
  import { defineComponent } from 'vue'
  import HighlightStyle from '@/docs/components/highlight_style.vue'
  import { GimmeHTTP } from '@/gimmehttp'

  export default defineComponent({
    name: 'JavaScriptUsagePage',
    components: { HighlightStyle },
    data() {
      return {
        instance: null as GimmeHTTP | null
      }
    },
    mounted() {
      // Live demo using the vanilla class directly (no Vue wrapper)
      this.instance = new GimmeHTTP({
        container: this.$refs.demo as HTMLElement,
        settings: {
          http: {
            method: 'POST',
            url: 'https://example.com/api/users',
            headers: { 'Content-Type': 'application/json' },
            body: { first_name: 'Billy', email: 'billyboy@gmail.com' }
          },
          theme: 'dark'
        }
      })
    },
    unmounted() {
      this.instance?.destroy()
      this.instance = null
    }
  })
</script>

<style lang="scss">
  .javascript-usage {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
  }
</style>

<template>
  <div class="section javascript-usage">
    <h2>Use as a JavaScript Component</h2>
    <p>
      GimmeHTTP ships a framework-agnostic UI component: styled code output with a flush options bar (language modal,
      client dropdown, labeled Copy button, light/dark toggle) and built-in syntax highlighting. Point it at a container, give it a request, and it handles the rest — no framework required. Syntax
      highlighting is built in via highlight.js.
    </p>

    <h3>Basic usage</h3>
    <HighlightStyle language="typescript">
      <pre>
        import { GimmeHTTP } from 'gimmehttp'
        import 'gimmehttp/css'
        import { goHttp, jsFetch, shellCurl } from 'gimmehttp/clients'

        const gh = new GimmeHTTP({
          // Required
          container: '#code', // selector or HTMLElement
          clients: [goHttp, jsFetch, shellCurl], // registers + limits the picker
          settings: {
            language: 'go',    // initial language
            client: 'http',    // initial client
            theme: 'dark',     // 'dark' | 'light'
            copy: true,        // show copy button
            picker: true,      // show language + client controls
            config: { indent: '  ' },
            http: {
              method: 'POST',
              url: 'https://example.com/api/users',
              headers: { 'Content-Type': 'application/json' },
              body: { first_name: 'Billy' }
            }
          },
          events: {
            afterChange: (language, client, code) => {
              console.log(language, client)
            }
          }
        })
      </pre>
    </HighlightStyle>

    <h3>Engine only</h3>
    <p>
      If you only need generated text and not the styled widget, import from
      <code>gimmehttp/core</code> and call <code>Generate</code> yourself.
    </p>
    <HighlightStyle language="typescript">
      <pre>
        import { Register, Generate } from 'gimmehttp/core'
        import { goHttp } from 'gimmehttp/clients'

        Register([goHttp])

        const { code, error } = Generate({
          language: 'go',
          http: { method: 'GET', url: 'https://example.com' }
        })
      </pre>
    </HighlightStyle>

    <h3>Methods</h3>
    <HighlightStyle language="typescript">
      <pre>
        gh.setSettings({ language: 'python', theme: 'light' })
        gh.setHttp({ method: 'GET', url: 'https://example.com' })
        gh.setLanguage('python')
        gh.setClient('requests')
        gh.setTheme('light')

        gh.getLanguage() // 'python'
        gh.getClient()   // 'requests'
        gh.getCode()     // generated code string

        gh.destroy() // remove from the DOM
      </pre>
    </HighlightStyle>

    <h3>Live example</h3>
    <div ref="demo"></div>
  </div>
</template>
