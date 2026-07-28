<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHTTP } from '@/gimmehttp'
  import { Clients, Languages, Client } from '@/gimmehttp/core'
  import { getLogo } from '@/gimmehttp/logos/index'

  import type { Http } from '@/gimmehttp/core'

  export default defineComponent({
    name: 'Demo',
    data() {
      // Simple Get request
      const httpGet: Http = {
        method: 'GET',
        url: 'https://example.com'
      }

      // GET with query params
      const httpGetParams: Http = {
        method: 'GET',
        url: 'https://example.com/search?q=shoes&limit=10',
        headers: {
          Accept: 'application/json'
        }
      }

      // Simple Post request
      const httpPost: Http = {
        method: 'POST',
        url: 'https://example.com/todos',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          title: 'Write better docs',
          completed: false
        }
      }

      // PUT update
      const httpPut: Http = {
        method: 'PUT',
        url: 'https://example.com/todos/123',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          title: 'Docs are awesome',
          completed: true
        }
      }

      // DELETE with auth header and cookie
      const httpDelete: Http = {
        method: 'DELETE',
        url: 'https://example.com/todos/123',
        headers: {
          Authorization: 'Bearer <token>'
        },
        cookies: {
          session_id: 'abc123'
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
        instance: null as GimmeHTTP | null,
        selectedLanguage: '',
        selectedClient: '',
        selectedHttp: 'simple_get',

        // Editable HTTP request — kept in sync with the selected example
        customUrl: httpGet.url,
        customMethod: httpGet.method,
        customHeaders: '{}',
        customCookies: '{}',
        customBody: '',
        useCustom: false,
        showHeaders: false,
        showCookies: false,

        https: {
          simple_get: httpGet,
          get_params: httpGetParams,
          simple_post: httpPost,
          put: httpPut,
          delete_auth: httpDelete,
          advanced_post: httpPostAdv
        } as Record<string, Http>
      }
    },
    mounted() {
      this.instance = new GimmeHTTP({
        container: this.$refs.output as HTMLElement,
        settings: { http: this.http },
        events: {
          // keep the page's language/client pickers in sync with the widget
          afterChange: (language, client) => {
            this.selectedLanguage = language
            this.selectedClient = client
          }
        }
      })
      this.resizeBody()
    },
    unmounted() {
      this.instance?.destroy()
      this.instance = null
    },
    watch: {
      http(newVal: Http) {
        this.instance?.setHttp(newVal)
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
        this.instance?.setLanguage(lang)
      },
      setClient(client: string) {
        this.instance?.setClient(client)
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

        // Expand headers/cookies only when the example has them
        this.showHeaders = !!(selectedHttp.headers && Object.keys(selectedHttp.headers).length > 0)
        this.showCookies = !!(selectedHttp.cookies && Object.keys(selectedHttp.cookies).length > 0)
        this.resizeBody()
      },
      exampleLabel(example: string): string {
        return example
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
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
      onBodyInput() {
        this.onInputChange()
        this.resizeBody()
      },
      resizeBody() {
        this.$nextTick(() => {
          const el = this.$refs.body as HTMLTextAreaElement | undefined
          if (!el) {
            return
          }
          el.style.height = 'auto'
          el.style.height = `${el.scrollHeight}px`
        })
      },
      logoSvg(name: string): string | null {
        return getLogo(name)
      }
    }
  })
</script>

<style lang="scss">
  .demo-page {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 1.5);

    .group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-half);
    }

    .picker_row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: var(--spacing);
      align-items: start;

      @media (max-width: 700px) {
        grid-template-columns: 1fr;
      }
    }

    .picker_panel {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-half);
      padding: var(--spacing-half) var(--spacing);
      border: solid 1px var(--color-border);
      border-radius: var(--border-radius);
      background-color: rgba(0, 0, 0, 0.2);
      min-width: 0;

      > .eyebrow {
        margin: 0;
        align-self: flex-start;
      }
    }

    .languages_panel {
      .langs {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: var(--spacing-quarter);
        width: 100%;

        .lang {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 6px;
          border: solid 1px var(--color-border-strong);
          border-radius: var(--border-radius);
          background-color: var(--color-bg-0);
          cursor: pointer;
          transition:
            background-color var(--animation-timing),
            border-color var(--animation-timing);

          &.selected,
          &:hover {
            background-color: var(--color-surface-raised);
            border-color: var(--color-primary);
          }

          &.selected {
            box-shadow: inset 0 0 0 1px var(--color-primary);
          }

          svg {
            width: 36px;
            height: 36px;
            user-select: none;
            display: block;
          }

          span.lang-name {
            font-size: 0.7rem;
            text-align: center;
            text-transform: capitalize;
            line-height: 1.1;
          }
        }

        @media (max-width: 700px) {
          .lang {
            padding: 4px;

            svg {
              width: 30px;
              height: 30px;
            }
          }
        }
      }
    }

    .clients_panel {
      min-width: 8rem;

      .clients {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-quarter);

        .client {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 12px;
          border: solid 1px var(--color-border-strong);
          border-radius: var(--border-radius);
          background-color: var(--color-bg-0);
          text-align: center;
          font-weight: 600;
          font-size: 13px;
          line-height: 1.2;
          cursor: pointer;
          transition:
            background-color var(--animation-timing),
            border-color var(--animation-timing),
            color var(--animation-timing);
          user-select: none;
          white-space: nowrap;

          &.selected,
          &:hover {
            background-color: var(--color-surface-raised);
            border-color: var(--color-primary);
            color: var(--color-primary-bright);
          }

          &.selected {
            box-shadow: inset 0 0 0 1px var(--color-primary);
          }
        }
      }

      @media (max-width: 700px) {
        min-width: 0;

        .clients {
          flex-direction: row;
          flex-wrap: wrap;

          .client {
            flex: 0 0 auto;
          }
        }
      }
    }

    .select_example {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-half);
    }

    .custom_request {
      display: flex;
      flex-direction: column;
      gap: var(--spacing);
      padding: var(--spacing);
      border: solid 1px var(--color-border);
      border-radius: var(--border-radius);
      background-color: rgba(0, 0, 0, 0.2);

      .form_row {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-quarter);
        min-width: 0;

        #body {
          overflow: hidden;
          resize: none;
        }
      }

      .form_row_inline {
        display: flex;
        flex-direction: row;
        align-items: end;
        gap: var(--spacing);

        .form_row.method {
          flex: 0 0 auto;

          select {
            width: auto;
            min-width: 7.5rem;
          }
        }

        .form_row.url {
          flex: 1 1 auto;
        }

        @media (max-width: 700px) {
          flex-direction: column;
          align-items: stretch;

          .form_row.method select {
            width: 100%;
          }
        }
      }

      .form_grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing);

        @media (max-width: 700px) {
          grid-template-columns: 1fr;
        }
      }

      .form_collapse {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-quarter);
        min-width: 0;

        .form_collapse_toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing-half);
          padding: 0;
          margin: 0;
          border: none;
          background: none;
          color: var(--color-primary);
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          text-align: left;

          &:hover {
            color: var(--color-primary-bright);
          }

          .chevron {
            display: inline-block;
            width: 0.6em;
            transition: transform var(--animation-timing);
            transform: rotate(-90deg);
          }

          &.open .chevron {
            transform: rotate(0deg);
          }
        }
      }
    }
  }
</style>

<template>
  <div class="section demo-page">
    <header>
      <h2>Demo</h2>
      <p>
        Build a request and watch the code update live. Pick a language and client, start from an example, or edit the
        request yourself.
      </p>
    </header>

    <div class="picker_row">
      <div class="picker_panel languages_panel">
        <div class="eyebrow">Language</div>
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

      <div class="picker_panel clients_panel" v-if="clients.length">
        <div class="eyebrow">Client</div>
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
      </div>
    </div>

    <div class="group">
      <div class="eyebrow">Examples</div>
      <div class="select_example">
        <button
          v-for="(http, example) in https"
          :key="example"
          :class="{ selected: example === selectedHttp && !useCustom }"
          @click="setExample(example)"
        >
          {{ exampleLabel(example) }}
        </button>
      </div>
    </div>

    <div class="custom_request">
      <div class="eyebrow">Custom request</div>
      <div class="form_row_inline">
        <div class="form_row method">
          <label for="method">Method</label>
          <select id="method" v-model="customMethod" @change="onInputChange">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div class="form_row url">
          <label for="url">URL</label>
          <input
            id="url"
            type="text"
            v-model="customUrl"
            @input="onInputChange"
            placeholder="https://example.com/api"
          />
        </div>
      </div>

      <div class="form_grid">
        <div class="form_collapse">
          <button
            type="button"
            class="form_collapse_toggle"
            :class="{ open: showHeaders }"
            @click="showHeaders = !showHeaders"
          >
            <span class="chevron">▾</span>
            Headers
          </button>
          <div class="form_row" v-show="showHeaders">
            <textarea
              id="headers"
              v-model="customHeaders"
              @input="onInputChange"
              placeholder='{"Content-Type": "application/json"}'
            ></textarea>
          </div>
        </div>

        <div class="form_collapse">
          <button
            type="button"
            class="form_collapse_toggle"
            :class="{ open: showCookies }"
            @click="showCookies = !showCookies"
          >
            <span class="chevron">▾</span>
            Cookies
          </button>
          <div class="form_row" v-show="showCookies">
            <textarea
              id="cookies"
              v-model="customCookies"
              @input="onInputChange"
              placeholder='{"session": "abc123"}'
            ></textarea>
          </div>
        </div>
      </div>

      <div class="form_row">
        <label for="body">Body</label>
        <textarea
          id="body"
          ref="body"
          v-model="customBody"
          @input="onBodyInput"
          placeholder='{"key": "value"}'
        ></textarea>
      </div>
    </div>

    <div ref="output"></div>
  </div>
</template>
