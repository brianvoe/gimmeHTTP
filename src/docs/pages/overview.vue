<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHttp } from '@/gimmehttp/vue'
  import { Clients, Languages, Client } from '../../gimmehttp'
  import { getLogo } from '@/gimmehttp/logos/index'

  import type { Http } from '../../gimmehttp'

  export default defineComponent({
    name: 'Overview',
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
        selectedLanguage: '',
        selectedClient: '',
        selectedHttp: 'advanced_post',

        // Editable HTTP request
        customUrl: 'https://example.com',
        customMethod: 'POST' as Http['method'],
        customHeaders: '{\n  "Content-Type": "application/json"\n}',
        customCookies: '{}',
        customBody: '{\n  "name": "value"\n}',
        useCustom: false,

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
      http(): Http {
        if (this.useCustom) {
          return this.buildCustomHttp()
        }
        return this.https[this.selectedHttp]
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
        this.useCustom = false

        // Populate fields with selected example
        const selectedHttp = this.https[example]
        this.customUrl = selectedHttp.url
        this.customMethod = selectedHttp.method
        this.customHeaders = selectedHttp.headers ? JSON.stringify(selectedHttp.headers, null, 2) : '{}'
        this.customCookies = selectedHttp.cookies ? JSON.stringify(selectedHttp.cookies, null, 2) : '{}'
        this.customBody = selectedHttp.body ? JSON.stringify(selectedHttp.body, null, 2) : ''
      },
      buildCustomHttp(): Http {
        try {
          const http: Http = {
            method: this.customMethod,
            url: this.customUrl
          }

          const headers = JSON.parse(this.customHeaders || '{}')
          if (Object.keys(headers).length > 0) {
            http.headers = headers
          }

          const cookies = JSON.parse(this.customCookies || '{}')
          if (Object.keys(cookies).length > 0) {
            http.cookies = cookies
          }

          if (this.customBody && this.customBody.trim()) {
            try {
              http.body = JSON.parse(this.customBody)
            } catch {
              http.body = this.customBody
            }
          }

          return http
        } catch (error) {
          // Return safe default on parse error
          return {
            method: this.customMethod,
            url: this.customUrl
          }
        }
      },
      onInputChange() {
        this.useCustom = true
      },
      logoSvg(name: string): string | null {
        return getLogo(name)
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
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
        max-width: 800px;
        justify-content: center;
        gap: var(--spacing-half);
        width: 100%;

        @media (max-width: 768px) {
          grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
        }

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

          svg {
            width: 40px;
            height: 40px;
            user-select: none;
            display: block;
          }

          span.lang-name {
            font-size: 0.9rem;
            text-align: center;
            text-transform: capitalize;
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

    .custom_request {
      display: flex;
      flex-direction: column;
      gap: var(--spacing);
      padding: var(--spacing);
      border: solid 1px var(--border-color);
      border-radius: var(--border-radius);

      .form_row {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-quarter);
      }

      .form_grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing);

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
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
          <span v-if="logoSvg(lang)" v-html="logoSvg(lang)"></span>
          <span v-else class="lang-name">{{ lang }}</span>
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
        :class="{ selected: example === selectedHttp && !useCustom }"
        @click="setExample(example)"
      >
        {{ example }}
      </button>
    </div>

    <div class="custom_request">
      <div class="form_row">
        <label for="method">HTTP Method</label>
        <select id="method" v-model="customMethod" @change="onInputChange">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div class="form_row">
        <label for="url">URL</label>
        <input id="url" type="text" v-model="customUrl" @input="onInputChange" placeholder="https://example.com/api" />
      </div>

      <div class="form_grid">
        <div class="form_row">
          <label for="headers">Headers (JSON)</label>
          <textarea
            id="headers"
            v-model="customHeaders"
            @input="onInputChange"
            placeholder='{"Content-Type": "application/json"}'
          ></textarea>
        </div>

        <div class="form_row">
          <label for="cookies">Cookies (JSON)</label>
          <textarea
            id="cookies"
            v-model="customCookies"
            @input="onInputChange"
            placeholder='{"session": "abc123"}'
          ></textarea>
        </div>
      </div>

      <div class="form_row">
        <label for="body">Body (JSON or text)</label>
        <textarea id="body" v-model="customBody" @input="onInputChange" placeholder='{"key": "value"}'></textarea>
      </div>
    </div>

    <GimmeHttp v-model:language="selectedLanguage" v-model:client="selectedClient" :http="http" />
  </div>
</template>
