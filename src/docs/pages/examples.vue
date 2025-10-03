<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHttp } from '@/gimmehttp/vue'
  import type { Http } from '@/gimmehttp'

  export default defineComponent({
    name: 'ExamplesPage',
    components: {
      GimmeHttp
    },
    data() {
      return {
        // Share language/client selections across all examples
        selectedLanguage: '',
        selectedClient: '',

        // Examples
        httpGet: {
          method: 'GET',
          url: 'https://api.example.com/search?q=shoes&limit=10',
          headers: {
            Accept: 'application/json'
          }
        } as Http,

        httpPostJson: {
          method: 'POST',
          url: 'https://api.example.com/todos',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            title: 'Write better docs',
            completed: false
          }
        } as Http,

        httpPut: {
          method: 'PUT',
          url: 'https://api.example.com/todos/123',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            title: 'Docs are awesome',
            completed: true
          }
        } as Http,

        httpDeleteAuth: {
          method: 'DELETE',
          url: 'https://api.example.com/todos/123',
          headers: {
            Authorization: 'Bearer <token>'
          },
          cookies: {
            session_id: 'abc123'
          }
        } as Http
      }
    }
  })
</script>

<style lang="scss">
  .examples {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);

    .example {
      display: flex;
      flex-direction: column;
      gap: var(--spacing);
    }
  }
</style>

<template>
  <div class="section examples">
    <header>
      <h2>Interactive Examples</h2>
      <p>
        Explore how different languages and clients express the same request. Pick a language, choose a client, tweak
        the payload, and copy the generated snippet in seconds.
      </p>
    </header>

    <div class="example">
      <h3>GET with query params</h3>
      <GimmeHttp v-model:language="selectedLanguage" v-model:client="selectedClient" :http="httpGet" />
    </div>

    <div class="example">
      <h3>POST JSON</h3>
      <GimmeHttp v-model:language="selectedLanguage" v-model:client="selectedClient" :http="httpPostJson" />
    </div>

    <div class="example">
      <h3>PUT update</h3>
      <GimmeHttp v-model:language="selectedLanguage" v-model:client="selectedClient" :http="httpPut" />
    </div>

    <div class="example">
      <h3>DELETE with auth + cookie</h3>
      <GimmeHttp v-model:language="selectedLanguage" v-model:client="selectedClient" :http="httpDeleteAuth" />
    </div>
  </div>
</template>
