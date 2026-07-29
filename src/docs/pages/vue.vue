<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHttp } from '@/gimmehttp/vue'
  import HighlightStyle from '@/docs/components/highlight_style.vue'
  import type { Settings } from '@/gimmehttp'
  import type { Http } from '@/gimmehttp/core'

  type Preset = {
    id: string
    label: string
    http: Http
  }

  const presets: Preset[] = [
    {
      id: 'get',
      label: 'GET',
      http: {
        method: 'GET',
        url: 'https://api.example.com/users?limit=5',
        headers: { Accept: 'application/json' }
      }
    },
    {
      id: 'post',
      label: 'POST',
      http: {
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: { 'Content-Type': 'application/json' },
        body: { first_name: 'Ada', role: 'admin' }
      }
    },
    {
      id: 'delete',
      label: 'DELETE',
      http: {
        method: 'DELETE',
        url: 'https://api.example.com/users/42',
        headers: { Authorization: 'Bearer <token>' },
        cookies: { session_id: 'abc123' }
      }
    }
  ]

  export default defineComponent({
    name: 'VueUsagePage',
    components: { GimmeHttp, HighlightStyle },
    data() {
      return {
        presets,
        presetId: 'get',
        language: 'go',
        client: 'http'
      }
    },
    computed: {
      demoSettings(): Settings {
        const preset = this.presets.find((p) => p.id === this.presetId) ?? this.presets[0]
        return {
          language: this.language,
          client: this.client,
          theme: 'dark',
          http: preset.http
        }
      }
    },
    methods: {
      setPreset(id: string) {
        this.presetId = id
      },
      onLanguage(language: string) {
        this.language = language
      },
      onClient(client: string) {
        this.client = client
      }
    }
  })
</script>

<style lang="scss">
  .vue-usage {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 1.5);
    width: 100%;

    .live {
      display: flex;
      flex-direction: column;
      gap: var(--spacing);
      margin-top: var(--spacing);

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

      .live_widget {
        min-height: 16rem;
      }
    }
  }
</style>

<template>
  <div class="vue-usage">
    <div class="section">
      <h2>Vue</h2>
      <p>
        <code>GimmeHttp</code> is a thin Vue 3 wrapper around the same UI widget from Usage. Pass
        <code>settings</code>, keep clients registered at app startup, and the component handles mount, updates, and
        teardown. Full field details live on the Settings page.
      </p>
    </div>

    <div class="section">
      <h3>Setup</h3>
      <p>
        Import the shared styles once (<code>gimmehttp/css</code>), register the clients you need (tree-shaken), then
        optionally install the plugin for global <code>&lt;GimmeHttp&gt;</code> registration.
      </p>

      <HighlightStyle language="typescript">
        <pre>
          // main.ts
          import { createApp } from 'vue'
          import App from './App.vue'
          import 'gimmehttp/css'

          import GimmeHttpVue from 'gimmehttp/vue'
          import { Register } from 'gimmehttp/core'
          import { goHttp, jsFetch, shellCurl } from 'gimmehttp/clients'
          // Or: import { allClients } from 'gimmehttp/clients'

          Register([goHttp, jsFetch, shellCurl])

          createApp(App)
            .use(GimmeHttpVue) // optional — or import GimmeHttp locally
            .mount('#app')
        </pre>
      </HighlightStyle>
    </div>

    <div class="section">
      <h3>Component usage</h3>
      <p>
        Bind a <code>settings</code> object. Deep changes (language, client, http, theme, …) update the widget live.
        The picker emits <code>update:language</code> and <code>update:client</code> when the user changes selection.
      </p>

      <HighlightStyle language="vue">
        <pre>
          &lt;script lang="ts"&gt;
            import { defineComponent } from 'vue'
            import { GimmeHttp } from 'gimmehttp/vue'
            import type { Settings } from 'gimmehttp'

            export default defineComponent({
              components: { GimmeHttp },
              data() {
                return {
                  settings: {
                    language: 'go',
                    client: 'http',
                    theme: 'dark',
                    http: {
                      method: 'POST',
                      url: 'https://api.example.com/users',
                      headers: { 'Content-Type': 'application/json' },
                      body: { first_name: 'Ada', role: 'admin' }
                    }
                  } as Settings
                }
              },
              methods: {
                onLanguage(language: string) {
                  this.settings.language = language
                },
                onClient(client: string) {
                  this.settings.client = client
                }
              }
            })
          &lt;/script&gt;

          &lt;template&gt;
            &lt;GimmeHttp
              :settings="settings"
              @update:language="onLanguage"
              @update:client="onClient"
            /&gt;
          &lt;/template&gt;
        </pre>
      </HighlightStyle>

      <div class="alert info">
        <strong>Info:</strong> Unlike the vanilla constructor, the Vue wrapper does not take a
        <code>clients</code> list — register generators with <code>Register</code> (or
        <code>Register(allClients)</code>) before mounting. Everything registered is available in the picker.
      </div>
    </div>

    <div class="section">
      <h3>Props &amp; events</h3>
      <ul>
        <li>
          <code>settings</code> (required) — same UI <code>Settings</code> shape as vanilla:
          <code>language</code>, <code>client</code>, <code>theme</code>, <code>toolbarShow</code>, <code>pickerShow</code>, <code>copyShow</code>, <code>themeShow</code>,
          <code>config</code>, <code>http</code>
        </li>
        <li><code>update:language</code> — fired when the language changes</li>
        <li><code>update:client</code> — fired when the client changes</li>
      </ul>
    </div>

    <div class="section">
      <h3>Live example</h3>
      <p>
        Switch the request to see reactive <code>settings.http</code> updates. Change language/client in the widget to
        see the emitted selection.
      </p>

      <div class="live">
        <div class="live_controls" role="group" aria-label="Request preset">
          <button
            v-for="p in presets"
            :key="p.id"
            type="button"
            :class="{ active: presetId === p.id }"
            @click="setPreset(p.id)"
          >
            {{ p.label }}
          </button>
        </div>
        <p class="live_meta">
          Selection: <code>{{ language }}</code> / <code>{{ client }}</code>
        </p>
        <div class="live_widget">
          <GimmeHttp
            :settings="demoSettings"
            @update:language="onLanguage"
            @update:client="onClient"
          />
        </div>
      </div>
    </div>
  </div>
</template>
