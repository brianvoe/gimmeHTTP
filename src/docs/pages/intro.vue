<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHttp } from '@/gimmehttp/vue'
  import { Clients, Languages, Client } from '../../gimmehttp'

  import type { Http } from '../../gimmehttp'

  const logoUrl = 'https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmeHTTP/logos/'

  export default defineComponent({
    name: 'Intro',
    components: { GimmeHttp },
    data() {
      // Simple Get request
      const httpGet: Http = {
        method: 'GET',
        url: 'https://example.com'
      }

      // Simple Post request
      const httpPost: Http = {
        method: 'POST',
        url: 'https://example.com',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          first_name: 'Billy',
          email: 'billyboy@gmail.com',
          user_id: 8675309
        }
      }

      // Advanced Post request, with cookies, headers and json body
      const httpPostAdv: Http = {
        method: 'POST',
        url: 'https://example.com',
        headers: {
          'Content-Type': 'application/json'
        },
        cookies: {
          user_id: '1234567890'
        },
        body: {
          first_name: 'Billy',
          email: 'billyboy@gmail.com',
          user_id: 8675309,
          address: {
            street: '123 Elm St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701'
          },
          hobbies: ['fishing', 'hiking', 'camping']
        }
      }

      return {
        logoUrl: logoUrl,
        selectedLanguage: '',
        selectedClient: '',
        selectedHttp: 'advanced_post',

        https: {
          simple_get: httpGet,
          simple_post: httpPost,
          advanced_post: httpPostAdv
        } as Record<string, Http>
      }
    },
    computed: {
      languages(): string[] {
        return Languages()
      },
      clients(): Client[] {
        return Clients().filter((c) => c.language === this.selectedLanguage)
      },
      http() {
        return this.https[this.selectedHttp] // Use string reference
      }
    },
    methods: {
      setLanguage(lang: string) {
        this.selectedLanguage = lang
      },
      setClient(client: string) {
        this.selectedClient = client
      },
      setExample(example: string) {
        this.selectedHttp = example
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
      }

      .langs {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--spacing-half);

        .lang {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: var(--spacing-quarter) var(--spacing-half);
          border: solid 1px var(--border-color);
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: background-color var(--animation-timing);

          &.selected,
          &:hover {
            background-color: var(--color-quaternary);
          }

          img {
            width: 40px;
            height: 40px;
            user-select: none;
          }
        }
      }
    }

    .clients {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-half);

      .client {
        min-width: 75px;
        padding: var(--spacing-half) var(--spacing);
        border: solid 1px var(--border-color);
        border-radius: var(--border-radius);
        text-align: center;
        cursor: pointer;
        transition: background-color var(--animation-timing);
        user-select: none;

        &.selected,
        &:hover {
          background-color: var(--color-quaternary);
        }
      }
    }

    .select_example {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-half);

      button {
        &.selected,
        &:hover {
          background-color: var(--color-quaternary);
          border: solid 1px var(--border-color);
        }
      }
    }
  }
</style>

<template>
  <div class="section intro">
    <p>Easily output http request in many languages</p>
    <div class="available_languages">
      <div class="text">Available Languages: <small>click to see</small></div>
      <div class="langs">
        <div
          :class="{ lang: true, selected: lang === selectedLanguage }"
          v-for="lang in languages"
          :key="lang"
          @click="setLanguage(lang)"
        >
          <img :src="logoUrl + lang + '.svg'" />
        </div>
      </div>
    </div>
    <div class="clients">
      <div
        :class="{ client: true, selected: client.client === selectedClient }"
        v-for="client in clients"
        :key="client.client"
        @click="setClient(client.client)"
      >
        {{ client.client }}
      </div>
    </div>
    <div class="select_example">
      <button
        v-for="(http, example) in https"
        :key="example"
        :class="{ selected: example === selectedHttp }"
        @click="setExample(example)"
      >
        {{ example }}
      </button>
    </div>
    <GimmeHttp v-model:language="selectedLanguage" v-model:client="selectedClient" :http="http" />
  </div>
</template>
