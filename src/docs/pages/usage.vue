<script lang="ts">
  import { defineComponent } from 'vue'
  import HighlightStyle from '@/docs/components/highlight_style.vue'
  import { GimmeHTTP } from '@/gimmehttp'
  import type { Http } from '@/gimmehttp/core'
  import { Clients, Languages } from '@/gimmehttp/core'
  import { getLogo } from '@/gimmehttp/logos/index'
  import { shellCurl, goHttp, jsFetch } from '@/gimmehttp/clients'

  const sampleOutput = `curl "https://example.com" \\
  -H "Content-Type: application/json" \\
  -d '{
  "name": "Billy"
}'`

  const demoHttp: Http = {
    method: 'POST',
    url: 'https://example.com/api/users',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token'
    },
    cookies: {
      session_id: 'abc123'
    },
    body: {
      first_name: 'Billy',
      email: 'billy@example.com'
    }
  }

  export default defineComponent({
    components: {
      HighlightStyle
    },
    name: 'Usage',
    data() {
      return {
        sampleOutput,
        demoHttp,
        instance: null as GimmeHTTP | null
      }
    },
    computed: {
      languageCatalog(): { language: string; clients: string[]; logo: string | null }[] {
        return Languages().map((language) => ({
          language,
          clients: Clients()
            .filter((c) => c.language === language)
            .map((c) => c.client),
          logo: getLogo(language)
        }))
      }
    },
    mounted() {
      this.instance = new GimmeHTTP({
        container: this.$refs.uiDemo as HTMLElement,
        clients: [shellCurl, goHttp, jsFetch],
        settings: {
          language: 'shell',
          client: 'curl',
          theme: 'dark',
          http: this.demoHttp
        }
      })
      this.resizeOutput()
    },
    unmounted() {
      this.instance?.destroy()
      this.instance = null
    },
    methods: {
      resizeOutput() {
        this.$nextTick(() => {
          const el = this.$refs.engineOutput as HTMLTextAreaElement | undefined
          if (!el) {
            return
          }
          el.style.height = 'auto'
          el.style.height = `${el.scrollHeight}px`
        })
      }
    }
  })
</script>

<style lang="scss">
  .usage {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 1.5);
    width: 100%;

    .language_catalog {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--spacing);
      margin-top: var(--spacing);

      .catalog_item {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-quarter);
        padding: var(--spacing);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        background: rgba(0, 0, 0, 0.15);

        .catalog_lang {
          display: flex;
          align-items: center;
          gap: var(--spacing-half);

          .catalog_logo {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            flex-shrink: 0;

            svg {
              width: 22px;
              height: 22px;
              display: block;
            }
          }

          code {
            font-size: 14px;
            font-weight: 600;
          }
        }

        .catalog_clients {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;

          li {
            margin: 0;
          }

          code {
            display: inline-block;
            padding: 2px 8px;
            font-size: 12px;
            line-height: 1.4;
            color: var(--color-text);
            background: var(--color-surface-raised, rgba(255, 255, 255, 0.08));
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
          }
        }
      }
    }

    .ui_demo {
      margin-top: var(--spacing);
    }

    .engine_output {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-half);
      margin-top: var(--spacing);

      textarea {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        resize: none;
        min-height: 0;
        padding: var(--spacing);
      }
    }
  }
</style>

<template>
  <div class="usage">
    <div class="section">
      <h2>Usage</h2>
      <p>
        The package ships the styled UI component, the core code generation engine, individual client generators, and
        Vue / React wrappers — all from a single dependency.
      </p>
    </div>

    <div class="section">
      <h3>Languages &amp; clients</h3>
      <p>
        These are the <code>settings.language</code> and <code>settings.client</code> values you can select in the UI
        picker (or pass to <code>Generate</code>). Register the clients you want first — only registered ones appear.
      </p>

      <div class="language_catalog">
        <div class="catalog_item" v-for="entry in languageCatalog" :key="entry.language">
          <div class="catalog_lang">
            <span v-if="entry.logo" class="catalog_logo" v-html="entry.logo"></span>
            <code>{{ entry.language }}</code>
          </div>
          <ul class="catalog_clients">
            <li v-for="client in entry.clients" :key="client">
              <code>{{ client }}</code>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>UI component</h3>
      <p>
        Install the package, then use the default import for the styled widget with built-in syntax highlighting. Point
        it at a container, pass clients and settings, and it handles the rest.
      </p>

      <HighlightStyle language="shell">
        <pre>
          npm install gimmehttp
        </pre>
      </HighlightStyle>

      <HighlightStyle language="typescript">
        <pre>
          import { GimmeHTTP } from 'gimmehttp'
          import 'gimmehttp/css'
          import { shellCurl, goHttp, jsFetch } from 'gimmehttp/clients'

          new GimmeHTTP({
            container: '#code',
            clients: [shellCurl, goHttp, jsFetch],
            settings: {
              language: 'shell',
              client: 'curl',
              theme: 'dark',
              http: {
                method: 'POST',
                url: 'https://example.com/api/users',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer token'
                },
                cookies: {
                  session_id: 'abc123'
                },
                body: {
                  first_name: 'Billy',
                  email: 'billy@example.com'
                }
              }
            }
          })
        </pre>
      </HighlightStyle>

      <div ref="uiDemo" class="ui_demo"></div>
    </div>

    <div class="section">
      <h3>Engine only</h3>
      <p>
        Use <code>gimmehttp/core</code> for text-only generation — no UI. Install the package, register the clients you
        need, then call <code>Generate</code>.
      </p>

      <HighlightStyle language="shell">
        <pre>
          npm install gimmehttp
        </pre>
      </HighlightStyle>

      <HighlightStyle language="typescript">
        <pre>
          import { Register, Generate } from 'gimmehttp/core'
          import { goHttp, shellCurl } from 'gimmehttp/clients'
          // Or pull everything in: import { allClients } from 'gimmehttp/clients'

          Register([goHttp, shellCurl])
          // Register(allClients)

          const { code, error } = Generate({
            language: 'shell',
            client: 'curl',
            http: {
              method: 'POST',
              url: 'https://example.com',
              headers: { 'Content-Type': 'application/json' },
              body: { name: 'Billy' }
            }
          })

          if (error) {
            console.error(error)
          } else {
            console.log(code)
          }
        </pre>
      </HighlightStyle>

      <div class="engine_output">
        <label for="engine-output">Output</label>
        <textarea
          id="engine-output"
          ref="engineOutput"
          readonly
          :value="sampleOutput"
        ></textarea>
      </div>
    </div>

    <div class="section">
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
              settings: {
                http: { method: 'GET', url: 'https://example.com' }
              }
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
  </div>
</template>
