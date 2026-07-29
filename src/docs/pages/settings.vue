<script lang="ts">
  import { defineComponent } from 'vue'
  import HighlightStyle from '@/docs/components/highlight_style.vue'
  import { GimmeHTTP } from '@/gimmehttp'
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
    { id: 'ui-language', label: 'language' },
    { id: 'ui-client', label: 'client' },
    { id: 'ui-theme', label: 'theme' },
    { id: 'ui-toolbarShow', label: 'toolbarShow' },
    { id: 'ui-pickerShow', label: 'pickerShow' },
    { id: 'ui-copyShow', label: 'copyShow' },
    { id: 'ui-themeShow', label: 'themeShow' },
    {
      label: 'config',
      children: [
        { id: 'ui-config-indent', label: 'indent' },
        { id: 'ui-config-join', label: 'join' },
        { id: 'ui-config-handleErrors', label: 'handleErrors' }
      ]
    },
    {
      label: 'http',
      children: [
        { id: 'ui-http-method', label: 'method' },
        { id: 'ui-http-url', label: 'url' },
        { id: 'ui-http-params', label: 'params' },
        { id: 'ui-http-headers', label: 'headers' },
        { id: 'ui-http-cookies', label: 'cookies' },
        { id: 'ui-http-body', label: 'body' }
      ]
    }
  ]

  const settingDocs: SettingDoc[] = [
    {
      id: 'ui-language',
      title: 'language',
      typeLabel: 'string',
      defaultLabel: `'javascript'`,
      description:
        'Initial programming language shown in the widget. Changing it updates the generated snippet and available clients.',
      demo: 'language'
    },
    {
      id: 'ui-client',
      title: 'client',
      typeLabel: 'string',
      defaultLabel: 'language default',
      description:
        'HTTP client library for the selected language (e.g. fetch, axios, curl). Defaults to the language’s default client when omitted.',
      demo: 'client'
    },
    {
      id: 'ui-theme',
      title: 'theme',
      typeLabel: `'dark' | 'light'`,
      defaultLabel: `'dark'`,
      description:
        'Widget color theme. Drive this from your host site (e.g. VitePress) and pair with themeShow: false when you own the toggle.',
      demo: 'theme'
    },
    {
      id: 'ui-toolbarShow',
      title: 'toolbarShow',
      typeLabel: 'boolean',
      defaultLabel: 'true',
      description: 'Show or hide the entire options toolbar above the code output.',
      demo: 'toolbarShow'
    },
    {
      id: 'ui-pickerShow',
      title: 'pickerShow',
      typeLabel: 'boolean',
      defaultLabel: 'true',
      description: 'Show or hide the language modal trigger and client dropdown.',
      demo: 'pickerShow'
    },
    {
      id: 'ui-copyShow',
      title: 'copyShow',
      typeLabel: 'boolean',
      defaultLabel: 'true',
      description: 'Show or hide the Copy button in the options bar.',
      demo: 'copyShow'
    },
    {
      id: 'ui-themeShow',
      title: 'themeShow',
      typeLabel: 'boolean',
      defaultLabel: 'true',
      description: 'Show or hide the light/dark theme button. Set false when the host page already controls theme.',
      demo: 'themeShow'
    },
    {
      id: 'ui-config-indent',
      title: 'config.indent',
      typeLabel: 'string',
      defaultLabel: `'  '`,
      description: 'Indentation characters used in generated code.',
      demo: 'indent'
    },
    {
      id: 'ui-config-join',
      title: 'config.join',
      typeLabel: 'string',
      defaultLabel: `'\\n'`,
      description: 'Line join string between generated lines (usually a newline).',
      demo: 'join'
    },
    {
      id: 'ui-config-handleErrors',
      title: 'config.handleErrors',
      typeLabel: 'boolean',
      defaultLabel: 'false',
      description: 'When true, generated snippets include error-handling patterns where the client supports them.',
      demo: 'handleErrors'
    },
    {
      id: 'ui-http-method',
      title: 'http.method',
      typeLabel: `'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'`,
      defaultLabel: 'required',
      description: 'HTTP method for the request. Required along with url.',
      demo: 'method'
    },
    {
      id: 'ui-http-url',
      title: 'http.url',
      typeLabel: 'string',
      defaultLabel: 'required',
      description: 'Request URL. Query params can live here or in http.params.',
      demo: 'url'
    },
    {
      id: 'ui-http-params',
      title: 'http.params',
      typeLabel: 'Record<string, string | string[]>',
      defaultLabel: 'undefined',
      description: 'Query string parameters. Arrays become repeated keys where the client supports them.',
      demo: 'params'
    },
    {
      id: 'ui-http-headers',
      title: 'http.headers',
      typeLabel: 'Record<string, string | string[]>',
      defaultLabel: 'undefined',
      description: 'Request headers. Content-Type influences how bodies are encoded in many clients.',
      demo: 'headers'
    },
    {
      id: 'ui-http-cookies',
      title: 'http.cookies',
      typeLabel: 'Record<string, string>',
      defaultLabel: 'undefined',
      description: 'Cookies sent with the request (as a Cookie header or client-native cookie API).',
      demo: 'cookies'
    },
    {
      id: 'ui-http-body',
      title: 'http.body',
      typeLabel: 'string | object | any',
      defaultLabel: 'undefined',
      description: 'Request body. Objects are typically JSON-encoded when Content-Type is application/json.',
      demo: 'body'
    }
  ]

  function isNavGroup(item: NavLeaf | NavGroup): item is NavGroup {
    return 'children' in item
  }

  export default defineComponent({
    name: 'Settings',
    components: { HighlightStyle },
    data() {
      return {
        navItems,
        settingDocs,
        activeId: 'ui-language',
        demoEls: {} as Record<string, HTMLElement>,
        instances: {} as Record<string, GimmeHTTP>,
        observer: null as IntersectionObserver | null,
        demo: {
          language: 'go',
          client: 'http',
          jsClient: 'fetch',
          theme: 'dark' as 'dark' | 'light',
          toolbarShow: true,
          pickerShow: true,
          copyShow: true,
          themeShow: true,
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
        this.mountAllUiDemos()
        this.setupScrollSpy()
        this.scrollToHash()
      })
    },
    unmounted() {
      this.observer?.disconnect()
      this.observer = null
      for (const id of Object.keys(this.instances)) {
        this.instances[id]?.destroy()
      }
      this.instances = {}
    },
    methods: {
      isNavGroup,

      setDemoEl(id: string, el: unknown) {
        if (el instanceof HTMLElement) {
          this.demoEls[id] = el
        } else {
          delete this.demoEls[id]
        }
      },

      scrollToHash() {
        const id = (this.$route.hash || window.location.hash).replace(/^#/, '')
        if (!id || !document.getElementById(id)) {
          return
        }
        this.activeId = id
        // Layout height settles after demos mount; wait a frame then jump
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

      baseUiSettings() {
        return {
          language: 'javascript',
          client: 'fetch',
          theme: 'dark' as const,
          toolbarShow: true,
          pickerShow: true,
          copyShow: true,
          themeShow: true,
          config: { indent: '  ', join: '\n', handleErrors: false },
          http: { method: 'GET' as Method, url: 'https://example.com/api/users' }
        }
      },

      /** Scenario-specific request used by both the live demo and the sample. */
      httpForDemo(demo: string): Http {
        const simpleGet: Http = {
          method: 'GET',
          url: 'https://example.com/api/users'
        }

        switch (demo) {
          case 'language':
          case 'client':
          case 'theme':
          case 'toolbarShow':
          case 'pickerShow':
          case 'copyShow':
          case 'themeShow':
          case 'handleErrors':
            // Selection / chrome / errors — keep the request tiny
            return simpleGet
          case 'indent':
          case 'join':
            // Just enough structure for formatting differences to show
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

      /** Focused settings object shown in the code sample (matches the live demo). */
      sampleSettingsFor(demo: string): Record<string, unknown> {
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
          case 'theme':
            return {
              theme: this.demo.theme,
              themeShow: false,
              http
            }
          case 'toolbarShow':
            return {
              toolbarShow: this.demo.toolbarShow,
              http
            }
          case 'pickerShow':
            return {
              pickerShow: this.demo.pickerShow,
              language: 'go',
              client: 'http',
              http
            }
          case 'copyShow':
            return {
              copyShow: this.demo.copyShow,
              http
            }
          case 'themeShow':
            return {
              theme: 'dark',
              themeShow: this.demo.themeShow,
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

        // Optional http fields: comment out when toggled off so the sample height stays stable
        if (demo === 'params' || demo === 'headers' || demo === 'cookies' || demo === 'body') {
          return this.sampleHttpWithOptional(demo)
        }

        return `settings: ${toTsLiteral(this.sampleSettingsFor(demo))}`
      },

      sampleHttpWithOptional(demo: 'params' | 'headers' | 'cookies' | 'body'): string {
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
          'settings: {',
          '  http: {',
          `    method: '${method}',`,
          `    url: '${url}',`,
          optionalBlock,
          '  }',
          '}'
        ].join('\n')
      },

      settingsForDemo(demo: string) {
        return {
          ...this.baseUiSettings(),
          http: this.httpForDemo(demo),
          ...this.partialForDemo(demo)
        }
      },

      /** Fields to update on an existing widget — omit language/client unless that is the demo. */
      partialForDemo(demo: string): Record<string, unknown> {
        switch (demo) {
          case 'language':
            return {
              language: this.demo.language,
              client: this.demo.language === 'go' ? 'http' : this.demo.language === 'python' ? 'requests' : 'curl',
              http: this.httpForDemo(demo)
            }
          case 'client':
            return {
              language: 'javascript',
              client: this.demo.jsClient,
              http: this.httpForDemo(demo)
            }
          case 'theme':
            return { theme: this.demo.theme, themeShow: false }
          case 'toolbarShow':
            return { toolbarShow: this.demo.toolbarShow }
          case 'pickerShow':
            return {
              pickerShow: this.demo.pickerShow,
              language: 'go',
              client: 'http'
            }
          case 'copyShow':
            return { copyShow: this.demo.copyShow }
          case 'themeShow':
            return { themeShow: this.demo.themeShow }
          case 'indent':
            return {
              config: { indent: this.indentValue, join: '\n', handleErrors: false },
              http: this.httpForDemo(demo)
            }
          case 'join':
            return {
              config: { indent: '  ', join: this.joinValue, handleErrors: false },
              http: this.httpForDemo(demo)
            }
          case 'handleErrors':
            return {
              config: { indent: '  ', join: '\n', handleErrors: this.demo.handleErrors },
              http: this.httpForDemo(demo)
            }
          case 'method':
          case 'url':
          case 'params':
          case 'headers':
          case 'cookies':
          case 'body':
            return { http: this.httpForDemo(demo) }
          default:
            return {}
        }
      },

      mountUiDemo(doc: SettingDoc) {
        const el = this.demoEls[doc.id]
        if (!el) {
          return
        }
        this.instances[doc.id]?.destroy()
        this.instances[doc.id] = new GimmeHTTP({
          container: el,
          settings: this.settingsForDemo(doc.demo)
        })
      },

      mountAllUiDemos() {
        for (const doc of this.settingDocs) {
          this.mountUiDemo(doc)
        }
      },

      refreshUiDemo(demo: string) {
        for (const doc of this.settingDocs) {
          if (doc.demo !== demo) {
            continue
          }
          const instance = this.instances[doc.id]
          if (!instance) {
            this.mountUiDemo(doc)
            continue
          }
          instance.setSettings(this.partialForDemo(demo))
        }
      },

      onLanguageChange() {
        if (this.demo.language === 'go') {
          this.demo.client = 'http'
        } else if (this.demo.language === 'python') {
          this.demo.client = 'requests'
        } else {
          this.demo.client = 'curl'
        }
        this.refreshUiDemo('language')
      },

      setTheme(theme: 'dark' | 'light') {
        this.demo.theme = theme
        this.refreshUiDemo('theme')
      }
    }
  })
</script>

<template>
  <div class="grid">
    <nav class="sidebar" aria-label="UI settings">
      <div class="group">
        <h3 class="group_title">UI</h3>
        <ul class="list">
          <template v-for="item in navItems" :key="isNavGroup(item) ? item.label : item.id">
            <li v-if="!isNavGroup(item)">
              <a :href="`#${item.id}`" :class="{ active: activeId === item.id }" @click="scrollTo(item.id, $event)">
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
      <div id="ui-overview" class="section panel">
        <h2>Settings</h2>
        <p class="desc">
          Configure how the widget looks and behaves — language, request shape, and chrome — via the
          <code>settings</code> object passed to <code>GimmeHTTP</code>. <br /><br />
          Need code-only generation? See
          <router-link to="/core">Core</router-link>.
        </p>
      </div>

        <div v-for="doc in settingDocs" :id="doc.id" :key="doc.id" class="section panel">
          <h3>
            <code>{{ doc.title }}</code>
          </h3>
          <p class="meta">
            <span
              >Type: <code>{{ doc.typeLabel }}</code></span
            >
            <span
              >Default: <code>{{ doc.defaultLabel }}</code></span
            >
          </p>
          <p class="desc">{{ doc.description }}</p>

          <HighlightStyle language="typescript">
            <pre>{{ sampleFor(doc) }}</pre>
          </HighlightStyle>

          <div class="demo">
            <p class="demo_label">Live demo</p>

            <div v-if="doc.demo === 'language'" class="demo_controls">
              <label>
                language
                <select v-model="demo.language" @change="onLanguageChange">
                  <option value="go">go</option>
                  <option value="python">python</option>
                  <option value="shell">shell</option>
                </select>
              </label>
            </div>

            <div v-else-if="doc.demo === 'client'" class="demo_controls">
              <label>
                client
                <select v-model="demo.jsClient" @change="refreshUiDemo('client')">
                  <option value="fetch">fetch</option>
                  <option value="axios">axios</option>
                  <option value="jquery">jquery</option>
                  <option value="ky">ky</option>
                </select>
              </label>
            </div>

            <div v-else-if="doc.demo === 'theme'" class="demo_controls">
              <button
                type="button"
                class="btn secondary"
                :class="{ active: demo.theme === 'dark' }"
                @click="setTheme('dark')"
              >
                dark
              </button>
              <button
                type="button"
                class="btn secondary"
                :class="{ active: demo.theme === 'light' }"
                @click="setTheme('light')"
              >
                light
              </button>
              <span class="meta"><code>themeShow: false</code> — host owns the toggle</span>
            </div>

            <div v-else-if="doc.demo === 'toolbarShow'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.toolbarShow" type="checkbox" @change="refreshUiDemo('toolbarShow')" />
                Show options toolbar
              </label>
            </div>

            <div v-else-if="doc.demo === 'pickerShow'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.pickerShow" type="checkbox" @change="refreshUiDemo('pickerShow')" />
                Show language / client picker
              </label>
            </div>

            <div v-else-if="doc.demo === 'copyShow'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.copyShow" type="checkbox" @change="refreshUiDemo('copyShow')" />
                Show copy button
              </label>
            </div>

            <div v-else-if="doc.demo === 'themeShow'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.themeShow" type="checkbox" @change="refreshUiDemo('themeShow')" />
                Show theme button
              </label>
            </div>

            <div v-else-if="doc.demo === 'indent'" class="demo_controls">
              <label>
                indent
                <select v-model="demo.indent" @change="refreshUiDemo('indent')">
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </label>
            </div>

            <div v-else-if="doc.demo === 'join'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.joinNewline" type="checkbox" @change="refreshUiDemo('join')" />
                Join with newlines (off = spaces)
              </label>
            </div>

            <div v-else-if="doc.demo === 'handleErrors'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.handleErrors" type="checkbox" @change="refreshUiDemo('handleErrors')" />
                handleErrors
              </label>
            </div>

            <div v-else-if="doc.demo === 'method'" class="demo_controls">
              <label>
                method
                <select v-model="demo.method" @change="refreshUiDemo('method')">
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
                <input v-model="demo.url" type="text" @change="refreshUiDemo('url')" />
              </label>
            </div>

            <div v-else-if="doc.demo === 'params'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.withParams" type="checkbox" @change="refreshUiDemo('params')" />
                Include params
              </label>
            </div>

            <div v-else-if="doc.demo === 'headers'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.withHeaders" type="checkbox" @change="refreshUiDemo('headers')" />
                Include headers
              </label>
            </div>

            <div v-else-if="doc.demo === 'cookies'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.withCookies" type="checkbox" @change="refreshUiDemo('cookies')" />
                Include cookies
              </label>
            </div>

            <div v-else-if="doc.demo === 'body'" class="demo_controls">
              <label class="inline">
                <input v-model="demo.withBody" type="checkbox" @change="refreshUiDemo('body')" />
                Include body
              </label>
            </div>

            <div class="demo_widget" :ref="(el) => setDemoEl(doc.id, el)"></div>
          </div>
        </div>
      </div>
    </div>
</template>