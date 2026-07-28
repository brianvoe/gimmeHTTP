<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHttp } from '@/gimmehttp/vue'
  import HighlightStyle from '@/docs/components/highlight_style.vue'
  import type { Settings } from '@/gimmehttp'
  import type { Http } from '@/gimmehttp/core'

  export default defineComponent({
    name: 'VueUsagePage',
    components: { GimmeHttp, HighlightStyle },
    data() {
      const demoHttp: Http = {
        method: 'GET',
        url: 'https://api.example.com/users?limit=5',
        headers: { Accept: 'application/json' }
      }

      return {
        demoHttp,
        theme: 'light' as 'light' | 'dark'
      }
    },
    computed: {
      demoSettings(): Settings {
        return {
          theme: this.theme,
          http: this.demoHttp
        }
      }
    },
    methods: {
      toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light'
      }
    }
  })
</script>

<style lang="scss">
  .vue-usage {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
  }
</style>

<template>
  <div class="section vue-usage">
    <header>
      <h2>Use as a Vue Component</h2>
      <p>
        You can consume GimmeHTTP as a Vue component and let it handle syntax highlighting and rendering for you.
        Install the package, then either register it globally as a plugin or import the component locally.
      </p>
    </header>

    <h3>Register clients at startup</h3>
    <p>
      No clients are registered by default. Register the languages you want once at app startup (only what you
      register ends up in your bundle).
    </p>
    <HighlightStyle language="typescript">
      <pre>
        import { createApp } from 'vue'
        import App from './App.vue'
        import GimmeHttpVue from 'gimmehttp/vue'

        import { Register } from 'gimmehttp/core'
        import { allClients } from 'gimmehttp/clients' // or import individual clients

        Register(allClients)

        createApp(App)
          .use(GimmeHttpVue) // optional global registration
          .mount('#app')
      </pre>
    </HighlightStyle>

    <h3>Local registration (single file component)</h3>
    <HighlightStyle language="vue">
      <pre>
        &lt;script setup lang="ts"&gt;
          import { GimmeHttp } from 'gimmehttp/vue'
          import type { Settings } from 'gimmehttp'

          const settings: Settings = {
            language: 'go',
            client: 'http',
            theme: 'light',
            http: {
              method: 'GET',
              url: 'https://api.example.com/users?limit=10',
              headers: { Accept: 'application/json' }
            }
          }
        &lt;/script&gt;

        &lt;style&gt;
          @use 'gimmehttp/vue/css';
        &lt;/style&gt;

        &lt;template&gt;
          &lt;GimmeHttp :settings="settings" /&gt;
        &lt;/template&gt;
      </pre>
    </HighlightStyle>

    <h3>Theme</h3>
    <HighlightStyle language="vue">
      <pre>
        &lt;script lang="ts"&gt;
          import { GimmeHttp } from 'gimmehttp/vue'
        &lt;/script&gt;

        &lt;template&gt;
          &lt;GimmeHttp
            :settings="{
              theme: 'light', // 'light' | 'dark'
              http: {
                method: 'GET',
                url: 'https://example.com',
              }
            }"
          /&gt;
        &lt;/template&gt;
      </pre>
    </HighlightStyle>
    <button @click="toggleTheme()">Toggle Theme ({{ theme }})</button>
    <GimmeHttp :settings="demoSettings" />
  </div>
</template>
