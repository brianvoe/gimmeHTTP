<script lang="ts">
  import { defineComponent } from 'vue'
  import VueShiki from '../components/vue_shiki.vue'
  import { Codes } from '../../gimmehttp'

  import type { Http } from '../../gimmehttp'
  import { languages } from 'prismjs'

  const logoUrl = 'https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmeHTTP/logos/'

  export default defineComponent({
    name: 'Intro',
    components: {
      VueShiki
    },
    data() {
      // Need to set a random language
      const uniqueLangs = Codes().map((c) => c.language)
      const language = uniqueLangs[Math.floor(Math.random() * uniqueLangs.length)]

      // Simple Get request
      const httpGet: Http = {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        headers: {
          'Content-Type': 'application/json'
        }
      }

      // Simple Post request
      const httpPost: Http = {
        method: 'POST',
        url: 'https://jsonplaceholder.typicode.com/posts',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          first_name: 'Billy',
          email: 'billyboy@gmail.com',
          userId: 8675309
        }
      }

      return {
        logoUrl: logoUrl,
        language: language,
        // Randomly select an http request
        http: httpGet,

        https: {
          simple_get: httpGet,
          simple_post: httpPost
        } as Record<string, Http>
      }
    },
    computed: {
      languages(): string[] {
        return Codes().map((c) => c.language)
      }
    },
    methods: {
      setExample(httpType: string) {
        this.http = this.https[httpType]
      }
    }
  })
</script>

<style lang="scss">
  .intro {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);

    .available_languages {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-half);

      .text {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: bold;

        small {
          font-weight: normal;
          font-size: calc(var(--font-size) * 0.7);
        }
      }

      .separator {
        width: 80%;
        max-width: 400px;
      }

      .langs {
        display: flex;
        flex-direction: row;
        gap: var(--spacing-half);

        .lang {
          cursor: pointer;
          border: solid 1px var(--border-color);
          border-radius: var(--border-radius);
          padding: var(--spacing-quarter);

          img {
            width: 50px;
            height: 50px;
          }
        }
      }
    }

    .select_example {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-half);
    }
  }
</style>

<template>
  <div class="intro section">
    <p>Easily output http request in many languages</p>
    <div class="available_languages">
      <div class="text">Available Languages: <small>click to see</small></div>
      <div class="separator" />
      <div class="langs">
        <div class="lang" v-for="lang in languages" :key="lang" @click="language = lang">
          <img :src="logoUrl + lang + '.svg'" />
        </div>
      </div>
    </div>
    <div class="select_example">
      <button @click="setExample('simple_get')">Simple GET</button>
      <button @click="setExample('simple_post')">Simple POST</button>
    </div>
    <VueShiki :language="language" :http="http" />
  </div>
</template>
