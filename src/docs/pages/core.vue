<script lang="ts">
  import { defineComponent } from 'vue'
  import HighlightStyle from '@/docs/components/highlight_style.vue'
  import { Generate } from '@/gimmehttp/core'
  import type { Http, Method } from '@/gimmehttp/core'

  type NavLeaf = { id: string; label: string }
  type NavGroup = { label: string; children: NavLeaf[] }

  type SettingDoc = {
    id: string
    title: string
    typeLabel: string
    defaultLabel: string
    description: string
    demo: string
  }

  /** Pretty-print a value as a TypeScript object literal for docs samples. */
  function toTsLiteral(value: unknown, depth = 0): string {
    const pad = '  '.repeat(depth)
    const padIn = '  '.repeat(depth + 1)
    if (value === null) {
      return 'null'
    }
    if (typeof value === 'string') {
      return `'${value
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')}'`
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value)
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return '[]'
      }
      return `[\n${value.map((v) => `${padIn}${toTsLiteral(v, depth + 1)}`).join(',\n')}\n${pad}]`
    }
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>)
      if (entries.length === 0) {
        return '{}'
      }
      const lines = entries.map(([k, v]) => {
        const key = /^[a-zA-Z_$][\w$]*$/.test(k) ? k : `'${k}'`
        return `${padIn}${key}: ${toTsLiteral(v, depth + 1)}`
      })
      return `{\n${lines.join(',\n')}\n${pad}}`
    }
    return String(value)
  }

  /** Format `key: value` at depth; when disabled, comment every line so layout stays stable. */
  function formatOptionalProp(key: string, value: unknown, enabled: boolean, depth: number): string {
    const pad = '  '.repeat(depth)
    const prop = `${pad}${key}: ${toTsLiteral(value, depth)}`
    if (enabled) {
      return prop
    }
    return prop
      .split('\n')
      .map((line) => line.replace(/^(\s*)/, '$1// '))
      .join('\n')
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
      demo: 'language'
    },
    {
      id: 'core-client',
      title: 'client',
      typeLabel: 'string',
      defaultLabel: 'language default',
      description: 'Client library for Generate(). Uses the language default when omitted.',
      demo: 'client'
    },
    {
      id: 'core-config-indent',
      title: 'config.indent',
      typeLabel: 'string',
      defaultLabel: `'  '`,
      description: 'Indentation characters in engine-generated code.',
      demo: 'indent'
    },
    {
      id: 'core-config-join',
      title: 'config.join',
      typeLabel: 'string',
      defaultLabel: `'\\n'`,
      description: 'Line join string for engine output.',
      demo: 'join'
    },
    {
      id: 'core-config-handleErrors',
      title: 'config.handleErrors',
      typeLabel: 'boolean',
      defaultLabel: 'false',
      description: 'Include error-handling patterns in Generate() output when supported.',
      demo: 'handleErrors'
    },
    {
      id: 'core-http-method',
      title: 'http.method',
      typeLabel: `'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'`,
      defaultLabel: 'required',
      description: 'HTTP method for Generate(). Required with url.',
      demo: 'method'
    },
    {
      id: 'core-http-url',
      title: 'http.url',
      typeLabel: 'string',
      defaultLabel: 'required',
      description: 'Request URL for Generate().',
      demo: 'url'
    },
    {
      id: 'core-http-params',
      title: 'http.params',
      typeLabel: 'Record<string, string | string[]>',
      defaultLabel: 'undefined',
      description: 'Query parameters included in Generate() output.',
      demo: 'params'
    },
    {
      id: 'core-http-headers',
      title: 'http.headers',
      typeLabel: 'Record<string, string | string[]>',
      defaultLabel: 'undefined',
      description: 'Headers included in Generate() output.',
      demo: 'headers'
    },
    {
      id: 'core-http-cookies',
      title: 'http.cookies',
      typeLabel: 'Record<string, string>',
      defaultLabel: 'undefined',
      description: 'Cookies included in Generate() output.',
      demo: 'cookies'
    },
    {
      id: 'core-http-body',
      title: 'http.body',
      typeLabel: 'string | object | any',
      defaultLabel: 'undefined',
      description: 'Body included in Generate() output.',
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

      /** Scenario-specific request used by both Generate() and the sample. */
      httpForDemo(demo: string): Http {
        const simpleGet: Http = {
          method: 'GET',
          url: 'https://example.com/api/users'
        }

        switch (demo) {
          case 'language':
          case 'client':
          case 'handleErrors':
            return simpleGet
          case 'indent':
          case 'join':
            return {
              method: 'POST',
              url: 'https://example.com/api/users',
              headers: { 'Content-Type': 'application/json' },
              body: { name: 'Billy' }
            }
          case 'method':
            return {
              method: this.demo.method,
              url: 'https://example.com/api/users'
            }
          case 'url':
            return {
              method: 'GET',
              url: this.demo.url
            }
          case 'params': {
            const http: Http = { ...simpleGet }
            if (this.demo.withParams) {
              http.params = { limit: '10' }
            }
            return http
          }
          case 'headers': {
            const http: Http = { ...simpleGet }
            if (this.demo.withHeaders) {
              http.headers = { Authorization: 'Bearer token' }
            }
            return http
          }
          case 'cookies': {
            const http: Http = { ...simpleGet }
            if (this.demo.withCookies) {
              http.cookies = { session_id: 'abc123' }
            }
            return http
          }
          case 'body': {
            const http: Http = {
              method: 'POST',
              url: 'https://example.com/api/users'
            }
            if (this.demo.withBody) {
              http.headers = { 'Content-Type': 'application/json' }
              http.body = { name: 'Billy' }
            }
            return http
          }
          default:
            return simpleGet
        }
      },

      languageForDemo(demo: string): string {
        if (demo === 'language') {
          return this.demo.language
        }
        if (demo === 'client') {
          return 'javascript'
        }
        return 'go'
      },

      clientForDemo(demo: string): string {
        if (demo === 'client') {
          return this.demo.jsClient
        }
        if (demo === 'language') {
          if (this.demo.language === 'go') {
            return 'http'
          }
          if (this.demo.language === 'python') {
            return 'requests'
          }
          return 'curl'
        }
        return 'http'
      },

      configForDemo(demo: string) {
        switch (demo) {
          case 'indent':
            return { indent: this.indentValue, join: '\n', handleErrors: false }
          case 'join':
            return { indent: '  ', join: this.joinValue, handleErrors: false }
          case 'handleErrors':
            return { indent: '  ', join: '\n', handleErrors: this.demo.handleErrors }
          default:
            return { indent: '  ', join: '\n', handleErrors: false }
        }
      },

      /** Focused Generate() args shown in the code sample (matches the live demo). */
      sampleArgsFor(demo: string): Record<string, unknown> {
        const http = this.httpForDemo(demo)
        switch (demo) {
          case 'language':
            return {
              language: this.demo.language,
              http
            }
          case 'client':
            return {
              language: 'javascript',
              client: this.demo.jsClient,
              http
            }
          case 'indent':
            return {
              config: { indent: this.indentValue },
              http
            }
          case 'join':
            return {
              config: { join: this.joinValue },
              http
            }
          case 'handleErrors':
            return {
              config: { handleErrors: this.demo.handleErrors },
              http
            }
          case 'method':
          case 'url':
          case 'params':
          case 'headers':
          case 'cookies':
          case 'body':
            return { http }
          default:
            return { http }
        }
      },

      sampleFor(doc: SettingDoc): string {
        const demo = doc.demo

        if (demo === 'params' || demo === 'headers' || demo === 'cookies' || demo === 'body') {
          return this.sampleGenerateWithOptional(demo)
        }

        return `const { code } = Generate(${toTsLiteral(this.sampleArgsFor(demo))})`
      },

      sampleGenerateWithOptional(demo: 'params' | 'headers' | 'cookies' | 'body'): string {
        const optionals: { key: string; value: unknown; enabled: boolean }[] =
          demo === 'params'
            ? [{ key: 'params', value: { limit: '10' }, enabled: this.demo.withParams }]
            : demo === 'headers'
              ? [
                  {
                    key: 'headers',
                    value: { Authorization: 'Bearer token' },
                    enabled: this.demo.withHeaders
                  }
                ]
              : demo === 'cookies'
                ? [
                    {
                      key: 'cookies',
                      value: { session_id: 'abc123' },
                      enabled: this.demo.withCookies
                    }
                  ]
                : [
                    {
                      key: 'headers',
                      value: { 'Content-Type': 'application/json' },
                      enabled: this.demo.withBody
                    },
                    {
                      key: 'body',
                      value: { name: 'Billy' },
                      enabled: this.demo.withBody
                    }
                  ]

        const method = demo === 'body' ? 'POST' : 'GET'
        const url = 'https://example.com/api/users'
        const optionalBlock = optionals
          .map((opt, i) => {
            let block = formatOptionalProp(opt.key, opt.value, opt.enabled, 2)
            if (i < optionals.length - 1) {
              const lines = block.split('\n')
              lines[lines.length - 1] += ','
              block = lines.join('\n')
            }
            return block
          })
          .join('\n')

        return [
          'const { code } = Generate({',
          '  http: {',
          `    method: '${method}',`,
          `    url: '${url}',`,
          optionalBlock,
          '  }',
          '})'
        ].join('\n')
      },

      coreSettings(demo: string) {
        return {
          language: this.languageForDemo(demo),
          client: this.clientForDemo(demo),
          config: this.configForDemo(demo),
          http: this.httpForDemo(demo)
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
          Use <code>Generate()</code> from <code>gimmehttp/core</code> when you want HTTP snippets as plain strings —
          in scripts, backends, or docs pipelines — with no widget to mount. This page covers the options that shape
          that output. Prefer the visual picker and chrome? See
          <router-link to="/settings">Settings</router-link>.
        </p>
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
          <pre>{{ sampleFor(doc) }}</pre>
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
