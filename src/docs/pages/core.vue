<script lang="ts">
  import { defineComponent } from 'vue'
  import HighlightStyle from '@/docs/components/highlight_style.vue'
  import { Generate } from '@/gimmehttp/core'
  import type { Config, Http, Method } from '@/gimmehttp/core'

  type NavLeaf = { id: string; label: string }
  type NavGroup = { label: string; children: NavLeaf[] }

  type SettingDoc = {
    id: string
    title: string
    typeLabel: string
    defaultLabel: string
    description: string
    sample: string
    demo: string
  }

  const baseHttp: Http = {
    method: 'POST',
    url: 'https://example.com/api/users',
    params: { limit: '10' },
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token'
    },
    cookies: { session_id: 'abc123' },
    body: {
      first_name: 'Billy',
      email: 'billy@example.com'
    }
  }

  const navItems: (NavLeaf | NavGroup)[] = [
    { id: 'core-language', label: 'language' },
    { id: 'core-client', label: 'client' },
    {
      label: 'config',
      children: [
        { id: 'core-config-indent', label: 'indent' },
        { id: 'core-config-join', label: 'join' },
        { id: 'core-config-handleErrors', label: 'handleErrors' }
      ]
    },
    {
      label: 'http',
      children: [
        { id: 'core-http-method', label: 'method' },
        { id: 'core-http-url', label: 'url' },
        { id: 'core-http-params', label: 'params' },
        { id: 'core-http-headers', label: 'headers' },
        { id: 'core-http-cookies', label: 'cookies' },
        { id: 'core-http-body', label: 'body' }
      ]
    }
  ]

  const settingDocs: SettingDoc[] = [
    {
      id: 'core-language',
      title: 'language',
      typeLabel: 'string',
      defaultLabel: `'javascript'`,
      description: 'Language passed to Generate(). Defaults to javascript when omitted.',
      sample: `const { code } = Generate({\n  language: 'python',\n  http: { method: 'GET', url: 'https://example.com' }\n})`,
      demo: 'language'
    },
    {
      id: 'core-client',
      title: 'client',
      typeLabel: 'string',
      defaultLabel: 'language default',
      description: 'Client library for Generate(). Uses the language default when omitted.',
      sample: `const { code } = Generate({\n  language: 'javascript',\n  client: 'axios',\n  http: { method: 'GET', url: 'https://example.com' }\n})`,
      demo: 'client'
    },
    {
      id: 'core-config-indent',
      title: 'config.indent',
      typeLabel: 'string',
      defaultLabel: `'  '`,
      description: 'Indentation characters in engine-generated code.',
      sample: `Generate({\n  config: { indent: '    ' },\n  http: { method: 'GET', url: 'https://example.com' }\n})`,
      demo: 'indent'
    },
    {
      id: 'core-config-join',
      title: 'config.join',
      typeLabel: 'string',
      defaultLabel: `'\\n'`,
      description: 'Line join string for engine output.',
      sample: `Generate({\n  config: { join: '\\n' },\n  http: { method: 'GET', url: 'https://example.com' }\n})`,
      demo: 'join'
    },
    {
      id: 'core-config-handleErrors',
      title: 'config.handleErrors',
      typeLabel: 'boolean',
      defaultLabel: 'false',
      description: 'Include error-handling patterns in Generate() output when supported.',
      sample: `Generate({\n  config: { handleErrors: true },\n  http: { method: 'GET', url: 'https://example.com' }\n})`,
      demo: 'handleErrors'
    },
    {
      id: 'core-http-method',
      title: 'http.method',
      typeLabel: `'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'`,
      defaultLabel: 'required',
      description: 'HTTP method for Generate(). Required with url.',
      sample: `Generate({\n  http: { method: 'DELETE', url: 'https://example.com/api/users/1' }\n})`,
      demo: 'method'
    },
    {
      id: 'core-http-url',
      title: 'http.url',
      typeLabel: 'string',
      defaultLabel: 'required',
      description: 'Request URL for Generate().',
      sample: `Generate({\n  http: { method: 'GET', url: 'https://api.example.com/v1/users' }\n})`,
      demo: 'url'
    },
    {
      id: 'core-http-params',
      title: 'http.params',
      typeLabel: 'Record<string, string | string[]>',
      defaultLabel: 'undefined',
      description: 'Query parameters included in Generate() output.',
      sample: `Generate({\n  http: {\n    method: 'GET',\n    url: 'https://example.com',\n    params: { limit: '10' }\n  }\n})`,
      demo: 'params'
    },
    {
      id: 'core-http-headers',
      title: 'http.headers',
      typeLabel: 'Record<string, string | string[]>',
      defaultLabel: 'undefined',
      description: 'Headers included in Generate() output.',
      sample: `Generate({\n  http: {\n    method: 'GET',\n    url: 'https://example.com',\n    headers: { Accept: 'application/json' }\n  }\n})`,
      demo: 'headers'
    },
    {
      id: 'core-http-cookies',
      title: 'http.cookies',
      typeLabel: 'Record<string, string>',
      defaultLabel: 'undefined',
      description: 'Cookies included in Generate() output.',
      sample: `Generate({\n  http: {\n    method: 'GET',\n    url: 'https://example.com',\n    cookies: { session_id: 'abc123' }\n  }\n})`,
      demo: 'cookies'
    },
    {
      id: 'core-http-body',
      title: 'http.body',
      typeLabel: 'string | object | any',
      defaultLabel: 'undefined',
      description: 'Body included in Generate() output.',
      sample: `Generate({\n  http: {\n    method: 'POST',\n    url: 'https://example.com',\n    headers: { 'Content-Type': 'application/json' },\n    body: { name: 'Ada' }\n  }\n})`,
      demo: 'body'
    }
  ]

  function isNavGroup(item: NavLeaf | NavGroup): item is NavGroup {
    return 'children' in item
  }

  export default defineComponent({
    name: 'CoreSettings',
    components: { HighlightStyle },
    data() {
      return {
        navItems,
        settingDocs,
        activeId: 'core-language',
        observer: null as IntersectionObserver | null,
        demo: {
          language: 'go',
          jsClient: 'fetch',
          indent: '2',
          joinNewline: true,
          handleErrors: false,
          method: 'POST' as Method,
          url: 'https://example.com/api/users',
          withParams: true,
          withHeaders: true,
          withCookies: true,
          withBody: true
        }
      }
    },
    computed: {
      indentValue(): string {
        return this.demo.indent === '4' ? '    ' : '  '
      },
      joinValue(): string {
        return this.demo.joinNewline ? '\n' : ' '
      },
      demoConfig(): Config {
        return {
          indent: this.indentValue,
          join: this.joinValue,
          handleErrors: this.demo.handleErrors
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.setupScrollSpy()
        this.scrollToHash()
      })
    },
    unmounted() {
      this.observer?.disconnect()
      this.observer = null
    },
    methods: {
      isNavGroup,

      scrollToHash() {
        const id = (this.$route.hash || window.location.hash).replace(/^#/, '')
        if (!id || !document.getElementById(id)) {
          return
        }
        this.activeId = id
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
        })
      },

      scrollTo(id: string, event?: Event) {
        event?.preventDefault()
        this.activeId = id
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        history.replaceState(null, '', `#${id}`)
      },

      setupScrollSpy() {
        const ids = this.settingDocs.map((d) => d.id)
        this.observer?.disconnect()
        this.observer = new IntersectionObserver(
          (entries) => {
            const visible = entries
              .filter((e) => e.isIntersecting)
              .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
            if (visible[0]?.target.id) {
              this.activeId = visible[0].target.id
            }
          },
          {
            root: document.querySelector('#app .layout'),
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
          }
        )
        for (const id of ids) {
          const el = document.getElementById(id)
          if (el) {
            this.observer.observe(el)
          }
        }
      },

      buildHttpFromBase(overrides: Partial<Http> = {}): Http {
        const http: Http = {
          method: overrides.method ?? baseHttp.method,
          url: overrides.url ?? baseHttp.url
        }
        const params = 'params' in overrides ? overrides.params : baseHttp.params
        if (params) {
          http.params = params
        }
        const headers = 'headers' in overrides ? overrides.headers : baseHttp.headers
        if (headers) {
          http.headers = headers
        }
        const cookies = 'cookies' in overrides ? overrides.cookies : baseHttp.cookies
        if (cookies) {
          http.cookies = cookies
        }
        const body = 'body' in overrides ? overrides.body : baseHttp.body
        if (body !== undefined) {
          http.body = body
        }
        return http
      },

      coreSettings(demo: string) {
        const language = demo === 'language' ? this.demo.language : demo === 'client' ? 'javascript' : 'go'
        const client =
          demo === 'client'
            ? this.demo.jsClient
            : demo === 'language'
              ? this.demo.language === 'go'
                ? 'http'
                : this.demo.language === 'python'
                  ? 'requests'
                  : 'curl'
              : 'http'

        let http = this.buildHttpFromBase()
        if (demo === 'method') {
          http = this.buildHttpFromBase({ method: this.demo.method })
        } else if (demo === 'url') {
          http = this.buildHttpFromBase({ url: this.demo.url })
        } else if (demo === 'params') {
          http = this.buildHttpFromBase({
            params: this.demo.withParams ? baseHttp.params : undefined
          })
        } else if (demo === 'headers') {
          http = this.buildHttpFromBase({
            headers: this.demo.withHeaders ? baseHttp.headers : undefined
          })
        } else if (demo === 'cookies') {
          http = this.buildHttpFromBase({
            cookies: this.demo.withCookies ? baseHttp.cookies : undefined
          })
        } else if (demo === 'body') {
          http = this.buildHttpFromBase({
            body: this.demo.withBody ? baseHttp.body : undefined
          })
        }

        return {
          language,
          client,
          config: { ...this.demoConfig },
          http
        }
      },

      coreOutput(demo: string): string {
        const { code, error } = Generate(this.coreSettings(demo))
        return error ? `// error: ${error}` : code || ''
      }
    }
  })
</script>

<template>
  <div class="grid">
    <nav class="sidebar" aria-label="Core settings">
      <div class="group">
        <h3 class="group_title">Core</h3>
        <ul class="list">
          <template v-for="item in navItems" :key="isNavGroup(item) ? item.label : item.id">
            <li v-if="!isNavGroup(item)">
              <a
                :href="`#${item.id}`"
                :class="{ active: activeId === item.id }"
                @click="scrollTo(item.id, $event)"
              >
                {{ item.label }}
              </a>
            </li>
            <li v-else class="subgroup">
              <span class="subgroup_label">{{ item.label }}</span>
              <ul class="list">
                <li v-for="child in item.children" :key="child.id">
                  <a
                    :href="`#${child.id}`"
                    :class="{ active: activeId === child.id }"
                    @click="scrollTo(child.id, $event)"
                  >
                    {{ child.label }}
                  </a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </nav>

    <div class="main">
      <div id="core-overview" class="section panel">
        <h2>Core</h2>
        <p class="desc">
          Engine settings for <code>Generate()</code> from <code>gimmehttp/core</code>. These fields also appear under
          the widget’s <code>settings</code> object — see
          <router-link to="/settings">Settings</router-link> for UI-only controls like theme and copy.
        </p>
        <div class="alert info">
          <strong>Info:</strong> The only required fields are <code>http.method</code> and <code>http.url</code>.
          Language defaults to <code>javascript</code> when omitted. Register clients before calling
          <code>Generate</code>.
        </div>
      </div>

        <div v-for="doc in settingDocs" :id="doc.id" :key="doc.id" class="section panel">
          <h3>
            <code>{{ doc.title }}</code>
          </h3>
          <p class="meta">
            <span>Type: <code>{{ doc.typeLabel }}</code></span>
            <span>Default: <code>{{ doc.defaultLabel }}</code></span>
          </p>
          <p class="desc">{{ doc.description }}</p>

          <HighlightStyle language="typescript">
            <pre>{{ doc.sample }}</pre>
          </HighlightStyle>

          <div class="demo">
            <p class="demo_label">Live demo (Generate)</p>

            <div v-if="doc.demo === 'language'" class="demo_controls">
              <label>
                language
                <select v-model="demo.language">
                  <option value="go">go</option>
                  <option value="python">python</option>
                  <option value="shell">shell</option>
                </select>
              </label>
            </div>

            <div v-else-if="doc.demo === 'client'" class="demo_controls">
              <label>
                client
                <select v-model="demo.jsClient">
                  <option value="fetch">fetch</option>
                  <option value="axios">axios</option>
                  <option value="jquery">jquery</option>
                  <option value="ky">ky</option>
                </select>
              </label>
            </div>

            <div v-else-if="doc.demo === 'indent'" class="demo_controls">
              <label>
                indent
                <select v-model="demo.indent">
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </label>
            </div>

            <div v-else-if="doc.demo === 'join'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.joinNewline" type="checkbox" />
                Join with newlines (off = spaces)
              </label>
            </div>

            <div v-else-if="doc.demo === 'handleErrors'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.handleErrors" type="checkbox" />
                handleErrors
              </label>
            </div>

            <div v-else-if="doc.demo === 'method'" class="demo_controls">
              <label>
                method
                <select v-model="demo.method">
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>PATCH</option>
                  <option>DELETE</option>
                </select>
              </label>
            </div>

            <div v-else-if="doc.demo === 'url'" class="demo_controls">
              <label>
                url
                <input v-model="demo.url" type="text" />
              </label>
            </div>

            <div v-else-if="doc.demo === 'params'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.withParams" type="checkbox" />
                Include params
              </label>
            </div>

            <div v-else-if="doc.demo === 'headers'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.withHeaders" type="checkbox" />
                Include headers
              </label>
            </div>

            <div v-else-if="doc.demo === 'cookies'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.withCookies" type="checkbox" />
                Include cookies
              </label>
            </div>

            <div v-else-if="doc.demo === 'body'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.withBody" type="checkbox" />
                Include body
              </label>
            </div>

            <pre class="demo_output">{{ coreOutput(doc.demo) }}</pre>
          </div>
        </div>
      </div>
    </div>
</template>
