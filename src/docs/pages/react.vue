<script lang="ts">
  import { defineComponent } from 'vue'
  import { createRoot, type Root } from 'react-dom/client'
  import { createElement } from 'react'
  import HighlightStyle from '@/docs/components/highlight_style.vue'
  import { ReactLiveDemo } from '@/docs/react_live_demo'

  export default defineComponent({
    name: 'ReactUsagePage',
    components: { HighlightStyle },
    data() {
      return {
        reactRoot: null as Root | null
      }
    },
    mounted() {
      const el = this.$refs.reactDemo as HTMLElement | undefined
      if (!el) {
        return
      }
      this.reactRoot = createRoot(el)
      this.reactRoot.render(createElement(ReactLiveDemo))
    },
    unmounted() {
      this.reactRoot?.unmount()
      this.reactRoot = null
    }
  })
</script>

<style lang="scss">
  .react-usage {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 1.5);
    width: 100%;

    .live_widget {
      margin-top: var(--spacing);
      min-height: 16rem;
    }

    .react-live-demo {
      display: flex;
      flex-direction: column;
      gap: var(--spacing);

      .live_controls {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--spacing-half);
      }

      .live_meta {
        margin: 0;
        font-size: 0.9rem;
        color: var(--color-text-muted);

        code {
          color: var(--color-primary-bright);
        }
      }
    }
  }
</style>

<template>
  <div class="react-usage">
    <div class="section">
      <h2>React</h2>
      <p>
        <code>GimmeHttp</code> is a thin React wrapper around the same UI widget from Usage. Pass
        <code>settings</code>, register clients at app startup, and the component handles mount, updates, and teardown.
        Full field details live on the Settings page.
      </p>
    </div>

    <div class="section">
      <h3>Setup</h3>
      <p>
        Import the shared styles once (<code>gimmehttp/css</code>) and register the clients you need (tree-shaken).
        React and ReactDOM are peer dependencies.
      </p>

      <HighlightStyle language="typescript">
        <pre>
          // main.tsx
          import { createRoot } from 'react-dom/client'
          import App from './App'
          import 'gimmehttp/css'

          import { Register } from 'gimmehttp/core'
          import { goHttp, jsFetch, shellCurl } from 'gimmehttp/clients'
          // Or: import { allClients } from 'gimmehttp/clients'

          Register([goHttp, jsFetch, shellCurl])

          createRoot(document.getElementById('root')!).render(&lt;App /&gt;)
        </pre>
      </HighlightStyle>
    </div>

    <div class="section">
      <h3>Component usage</h3>
      <p>
        Pass a <code>settings</code> object. Deep changes update the widget live. Selection changes call
        <code>onLanguageChange</code> and <code>onClientChange</code>.
      </p>

      <HighlightStyle language="tsx">
        <pre>
          import { useState } from 'react'
          import { GimmeHttp } from 'gimmehttp/react'
          import type { Settings } from 'gimmehttp'

          export function Example() {
            const [settings, setSettings] = useState&lt;Settings&gt;({
              language: 'go',
              client: 'http',
              theme: 'dark',
              http: {
                method: 'POST',
                url: 'https://api.example.com/users',
                headers: { 'Content-Type': 'application/json' },
                body: { first_name: 'Ada', role: 'admin' }
              }
            })

            return (
              &lt;GimmeHttp
                settings={settings}
                onLanguageChange={(language) =&gt;
                  setSettings((s) =&gt; ({ ...s, language }))
                }
                onClientChange={(client) =&gt;
                  setSettings((s) =&gt; ({ ...s, client }))
                }
              /&gt;
            )
          }
        </pre>
      </HighlightStyle>

      <div class="alert info">
        <strong>Info:</strong> Unlike the vanilla constructor, the React wrapper does not take a
        <code>clients</code> list — register generators with <code>Register</code> (or
        <code>Register(allClients)</code>) before mounting. Everything registered is available in the picker.
      </div>
    </div>

    <div class="section">
      <h3>Props, callbacks &amp; ref</h3>
      <ul>
        <li>
          <code>settings</code> (required) — same UI <code>Settings</code> shape as vanilla:
          <code>language</code>, <code>client</code>, <code>theme</code>, <code>toolbarShow</code>, <code>pickerShow</code>, <code>copyShow</code>, <code>themeShow</code>,
          <code>config</code>, <code>http</code>
        </li>
        <li><code>onLanguageChange</code> — called when the language changes</li>
        <li><code>onClientChange</code> — called when the client changes</li>
        <li>
          <code>ref</code> — <code>GimmeHttpRef</code> with <code>gimmeHttp</code> for direct access to the underlying
          instance
        </li>
      </ul>

      <HighlightStyle language="tsx">
        <pre>
          import { useRef } from 'react'
          import { GimmeHttp } from 'gimmehttp/react'
          import type { GimmeHttpRef } from 'gimmehttp/react'

          const ref = useRef&lt;GimmeHttpRef&gt;(null)
          ref.current?.gimmeHttp?.getCode()
        </pre>
      </HighlightStyle>
    </div>

    <div class="section">
      <h3>Live example</h3>
      <p>
        Same widget via the React wrapper — switch the request to see reactive <code>settings.http</code> updates.
      </p>
      <div ref="reactDemo" class="live_widget"></div>
    </div>
  </div>
</template>
