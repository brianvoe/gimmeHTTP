<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHttp } from '@/gimmehttp/vue'
  import ShikiStyle from '@/docs/components/shiki_style.vue'
  import type { Http } from '@/gimmehttp'

  export default defineComponent({
    name: 'VueUsagePage',
    components: { GimmeHttp, ShikiStyle },
    data() {
      const demoHttp: Http = {
        method: 'GET',
        url: 'https://api.example.com/users?limit=5',
        headers: { Accept: 'application/json' }
      }

      return {
        demoHttp,
        lang: '',
        client: ''
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
        You can consume GimmeHTTP as a Vue component and let it handle Shiki and rendering for you. Install the package,
        then either register it globally as a plugin or import the component locally.
      </p>
    </header>

    <h3>Global registration (plugin)</h3>
    <ShikiStyle language="typescript">
      <pre>
import { createApp } from 'vue'
import App from './App.vue'
import GimmeHttpVue from 'gimmehttp/vue'

createApp(App)
  .use(GimmeHttpVue)
  .mount('#app')
      </pre>
    </ShikiStyle>

    <h3>Local registration (single file component)</h3>
    <ShikiStyle language="vue">
      <pre>
&lt;script setup lang="ts"&gt;
  import { GimmeHttp } from 'gimmehttp/vue'
  import type { Http } from 'gimmehttp'

  const request: Http = {
    method: 'GET',
    url: 'https://api.example.com/users?limit=10',
    headers: { Accept: 'application/json'}
  }

  const lang = 'go'
  const client = 'http'
&lt;/script&gt;

&lt;style&gt;
  @import 'gimmehttp/vue.css';
&lt;/style&gt;

&lt;template&gt;
  &lt;GimmeHttp 
    // Required
    :http="request" 
    
    // Optional
    v-model:language="lang" 
    v-model:client="client" 
    theme="light" 
  /&gt;
&lt;/template&gt;
      </pre>
    </ShikiStyle>

    <h3>Theme</h3>
    <ShikiStyle language="vue">
      <pre>
&lt;script setup lang="ts"&gt;
  import { GimmeHttp } from 'gimmehttp/vue'
&lt;/script&gt;

&lt;template&gt;
  &lt;GimmeHttp 
    :http="{
      method: 'GET',
      url: 'https://example.com',
    }" 
    theme="light" // 'light' | 'dark'
  /&gt;
&lt;/template&gt;
      </pre>
    </ShikiStyle>
    <GimmeHttp :http="demoHttp" theme="light" />
  </div>
</template>
