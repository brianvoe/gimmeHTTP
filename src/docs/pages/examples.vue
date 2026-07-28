<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHTTP } from '@/gimmehttp'
  import type { Http } from '@/gimmehttp/core'

  export default defineComponent({
    name: 'ExamplesPage',
    data() {
      return {
        // Language/client selections stay in sync across instances automatically
        instances: [] as GimmeHTTP[],

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
    },
    mounted() {
      const examples: Array<[HTMLElement, Http]> = [
        [this.$refs.exampleGet as HTMLElement, this.httpGet],
        [this.$refs.examplePostJson as HTMLElement, this.httpPostJson],
        [this.$refs.examplePut as HTMLElement, this.httpPut],
        [this.$refs.exampleDeleteAuth as HTMLElement, this.httpDeleteAuth]
      ]

      this.instances = examples.map(
        ([container, http]) =>
          new GimmeHTTP({
            container,
            http
          })
      )
    },
    unmounted() {
      this.instances.forEach((instance) => instance.destroy())
      this.instances = []
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
      <div ref="exampleGet"></div>
    </div>

    <div class="example">
      <h3>POST JSON</h3>
      <div ref="examplePostJson"></div>
    </div>

    <div class="example">
      <h3>PUT update</h3>
      <div ref="examplePut"></div>
    </div>

    <div class="example">
      <h3>DELETE with auth + cookie</h3>
      <div ref="exampleDeleteAuth"></div>
    </div>
  </div>
</template>
