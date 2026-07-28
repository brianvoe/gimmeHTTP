<script lang="ts">
  import { defineComponent } from 'vue'
  import HighlightStyle from '@/docs/components/highlight_style.vue'

  export default defineComponent({
    components: {
      HighlightStyle
    },
    name: 'Install'
  })
</script>

<style lang="scss">
  .install {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
  }
</style>

<template>
  <div class="section install">
    <h2>Installation</h2>
    <p>
      Install gimmehttp with npm, pnpm, or yarn. The package ships the styled UI component, the core code generation
      engine, individual client generators, and a Vue wrapper — all from a single dependency.
    </p>

    <HighlightStyle language="shell">
      <pre>
        npm install gimmehttp
      </pre>
    </HighlightStyle>

    <h3>UI component</h3>
    <p>
      The default import is the styled widget with built-in syntax highlighting. Register the clients you need, then
      mount it on a container.
    </p>

    <HighlightStyle language="typescript">
      <pre>
        import { GimmeHTTP } from 'gimmehttp'
        import 'gimmehttp/css'
        import { goHttp, shellCurl } from 'gimmehttp/clients'

        new GimmeHTTP({
          container: '#code',
          http: { method: 'GET', url: 'https://example.com' },
          clients: [goHttp, shellCurl]
        })
      </pre>
    </HighlightStyle>

    <h3>Engine only</h3>
    <p>
      No clients are registered by default. Import only the languages you need from
      <code>gimmehttp/clients</code> and register them — everything else gets tree-shaken out of your bundle. Use
      <code>gimmehttp/core</code> when you only need generated text.
    </p>

    <HighlightStyle language="typescript">
      <pre>
        import { Register, Generate } from 'gimmehttp/core'
        import { goHttp, shellCurl } from 'gimmehttp/clients'

        Register([goHttp, shellCurl])

        const { code, error } = Generate({
          language: 'go',
          http: {
            method: 'GET',
            url: 'https://example.com'
          }
        })
      </pre>
    </HighlightStyle>

    <p>Or register everything at once:</p>

    <HighlightStyle language="typescript">
      <pre>
        import { Register } from 'gimmehttp/core'
        import { allClients } from 'gimmehttp/clients'

        Register(allClients)
      </pre>
    </HighlightStyle>

    <h3>CDN / script tag</h3>
    <p>
      The CDN build comes with every client pre-registered and the global <code>GimmeHTTP</code> is the styled UI
      component, so you can drop it straight into a page.
    </p>

    <HighlightStyle language="html">
      <pre>
        &lt;link rel="stylesheet" href="https://unpkg.com/gimmehttp/dist/gimmehttp.css" /&gt;
        &lt;script src="https://unpkg.com/gimmehttp/dist/gimmehttp.js"&gt;&lt;/script&gt;

        &lt;div id="code"&gt;&lt;/div&gt;

        &lt;script&gt;
          new GimmeHTTP({
            container: '#code',
            http: { method: 'GET', url: 'https://example.com' }
          })

          // The engine is available as statics too
          const { code } = GimmeHTTP.Generate({
            language: 'shell',
            http: { method: 'GET', url: 'https://example.com' }
          })
        &lt;/script&gt;
      </pre>
    </HighlightStyle>
  </div>
</template>
