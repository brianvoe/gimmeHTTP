import { Generate, Register, Clients } from '../core'
import { getLogo } from '../logos/index'
import { highlightCode, highlightLanguage } from './highlight'

import type { Client, Config, Http } from '../core'

/** Widget settings: selection → appearance → controls → config → http. */
export interface Settings {
  // Selection
  language?: string
  client?: string

  // Appearance
  // 'dark' (default) or 'light'
  theme?: 'dark' | 'light'

  // Controls
  // Show the copy button (default: true)
  copy?: boolean
  // Show the language/client picker (default: true)
  picker?: boolean

  // Code generation
  config?: Config

  // Request
  http: Http
}

export interface Events {
  afterChange?: (language: string, client: string, code: string) => void
}

export interface Options {
  // CSS selector or element the widget renders into
  container: string | HTMLElement

  // Clients to register and show in the picker. When omitted, all registered clients are available.
  clients?: Client[]

  // Selection → Appearance → Controls → config → http
  settings: Settings

  events?: Events
}

type Controls = Required<Pick<Settings, 'theme' | 'copy' | 'picker'>>

const STORAGE_LANG = 'gimmeLang'
const STORAGE_CLIENT = 'gimmeClient'

// All live instances, so language/client changes stay in sync across a page
const instances = new Set<GimmeHTTP>()

const COPY_ICON = `<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>`

const ARROW_ICON = `<svg class="gh-arrows" viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z"/></svg>`

const SUN_ICON = `<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><circle cx="8" cy="8" r="2.6"/><rect x="7.15" y="0.75" width="1.7" height="2.75" rx="0.85"/><rect x="7.15" y="12.5" width="1.7" height="2.75" rx="0.85"/><rect x="0.75" y="7.15" width="2.75" height="1.7" rx="0.85"/><rect x="12.5" y="7.15" width="2.75" height="1.7" rx="0.85"/><g transform="rotate(45 8 8)"><rect x="7.15" y="0.75" width="1.7" height="2.75" rx="0.85"/><rect x="7.15" y="12.5" width="1.7" height="2.75" rx="0.85"/><rect x="0.75" y="7.15" width="2.75" height="1.7" rx="0.85"/><rect x="12.5" y="7.15" width="2.75" height="1.7" rx="0.85"/></g></svg>`

const MOON_ICON = `<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M9.598 1.591a.75.75 0 0 1 .785-.175 7 7 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Zm1.616 1.945a7 7 0 0 1-7.678 7.678 5.5 5.5 0 1 0 7.678-7.678Z"/></svg>`

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export class GimmeHTTP {
  private container: HTMLElement
  private root: HTMLElement | null = null

  private http: Http
  private config?: Config
  private controls: Controls
  private events: Events

  // When set, the picker is limited to these clients (still registered globally for Generate)
  private scopedClients: Client[] | null = null

  private language: string
  private client: string
  private code = ''

  private modalOpen = false
  private clientMenuOpen = false
  private copiedTimeout: number | null = null
  private onDocClick: ((event: MouseEvent) => void) | null = null

  constructor(options: Options) {
    if (!options || !options.container) {
      throw new Error('GimmeHTTP: container is required')
    }
    if (!options.settings?.http) {
      throw new Error('GimmeHTTP: settings.http is required')
    }

    const el =
      typeof options.container === 'string'
        ? (document.querySelector(options.container) as HTMLElement | null)
        : options.container
    if (!el) {
      throw new Error(`GimmeHTTP: container not found: ${options.container}`)
    }
    this.container = el

    if (options.clients && options.clients.length > 0) {
      Register(options.clients)
      this.scopedClients = options.clients
    }
    if (this.clientsPool().length === 0) {
      throw new Error(
        'GimmeHTTP: no clients registered. Import clients from gimmehttp/clients and pass them via the clients option or Register().'
      )
    }

    const s = options.settings
    this.http = s.http
    this.config = s.config
    this.events = options.events || {}
    this.controls = {
      theme: s.theme || 'dark',
      copy: s.copy !== false,
      picker: s.picker !== false
    }

    // Initial selection: explicit option > localStorage > first available
    const isBrowser = typeof window !== 'undefined'
    const storedLang = isBrowser ? localStorage.getItem(STORAGE_LANG) : null
    const storedClient = isBrowser ? localStorage.getItem(STORAGE_CLIENT) : null
    const pool = this.clientsPool()

    this.language = s.language || storedLang || pool[0].language
    if (!this.findClient(this.language)) {
      this.language = pool[0].language
    }

    const found = this.findClient(this.language, s.client || storedClient || undefined)
    this.client = found ? found.client : ''

    instances.add(this)
    this.render()
  }

  // ----- Public API -----

  setSettings(partial: Partial<Settings>): void {
    if (partial.http !== undefined) {
      this.http = partial.http
    }
    if (partial.config !== undefined) {
      this.config = partial.config
    }
    if (partial.theme !== undefined) {
      this.controls.theme = partial.theme
    }
    if (partial.copy !== undefined) {
      this.controls.copy = partial.copy
    }
    if (partial.picker !== undefined) {
      this.controls.picker = partial.picker
    }

    if (partial.language !== undefined || partial.client !== undefined) {
      const language = partial.language ?? this.language
      const client = partial.client ?? this.client
      const found = this.findClient(language, client)
      if (found) {
        this.language = found.language
        this.client = found.client
        this.persist()
        this.syncOthers()
      }
    }

    this.render()
  }

  setHttp(http: Http): void {
    this.http = http
    this.render()
  }

  setConfig(config: Config): void {
    this.config = config
    this.render()
  }

  setLanguage(language: string, client?: string): void {
    const found = this.findClient(language, client)
    if (!found) {
      return
    }
    this.language = found.language
    this.client = found.client
    this.persist()
    this.render()
    this.syncOthers()
  }

  setClient(client: string): void {
    const found = this.findClient(this.language, client)
    if (!found) {
      return
    }
    this.client = found.client
    this.persist()
    this.render()
    this.syncOthers()
  }

  setTheme(theme: 'dark' | 'light'): void {
    this.controls.theme = theme
    this.render()
  }

  getLanguage(): string {
    return this.language
  }

  getClient(): string {
    return this.client
  }

  getCode(): string {
    return this.code
  }

  destroy(): void {
    instances.delete(this)
    if (this.copiedTimeout) {
      clearTimeout(this.copiedTimeout)
    }
    this.unbindDocClick()
    if (this.root && this.root.parentNode) {
      this.root.parentNode.removeChild(this.root)
    }
    this.root = null
  }

  // ----- Internal -----

  private persist(): void {
    if (typeof window === 'undefined') {
      return
    }
    localStorage.setItem(STORAGE_LANG, this.language)
    localStorage.setItem(STORAGE_CLIENT, this.client)
  }

  private syncOthers(): void {
    for (const instance of instances) {
      if (instance === this) {
        continue
      }
      if (instance.language !== this.language || instance.client !== this.client) {
        const found = instance.findClient(this.language, this.client)
        if (!found) {
          continue
        }
        instance.language = found.language
        instance.client = found.client
        instance.render()
      }
    }
  }

  private clientsPool(): Client[] {
    return this.scopedClients ?? Clients()
  }

  private languages(): string[] {
    return this.clientsPool()
      .map((c) => c.language)
      .filter((v, i, a) => a.indexOf(v) === i)
  }

  private findClient(language: string, client?: string): Client | null {
    if (!language) {
      return null
    }
    const matches = this.clientsPool().filter((c) => c.language.toLowerCase() === language.toLowerCase())
    if (matches.length === 0) {
      return null
    }
    const defaultClient = matches.find((c) => c.default) || matches[0]
    if (!client) {
      return defaultClient
    }
    return matches.find((c) => c.client.toLowerCase() === client.toLowerCase()) || defaultClient
  }

  private clientsForLanguage(): string[] {
    return this.clientsPool()
      .filter((c) => c.language === this.language)
      .map((c) => c.client)
  }

  private generate(): void {
    const { code, error } = Generate({
      language: this.language,
      client: this.client,
      http: this.http,
      config: this.config
    })

    if (error) {
      this.code = ''
      this.renderOutputHtml(`<pre class="hljs"><code>${escapeHtml(error)}</code></pre>`)
      return
    }

    this.code = code!

    this.renderOutputHtml(this.highlightedOutput())
    this.events.afterChange?.(this.language, this.client, this.code)
  }

  private highlightedOutput(): string {
    const hljsLang = highlightLanguage(this.language)
    const html = highlightCode(this.code, this.language)
    return `<pre class="hljs"><code class="language-${hljsLang}">${html}</code></pre>`
  }

  private renderOutputHtml(html: string): void {
    const output = this.root?.querySelector('.gh-output')
    if (output) {
      output.innerHTML = html
    }
  }

  private render(): void {
    this.unbindDocClick()
    this.modalOpen = false
    this.clientMenuOpen = false

    if (!this.root) {
      this.root = document.createElement('div')
      this.container.appendChild(this.root)
    }

    this.root.className = `gimmehttp${this.controls.theme === 'light' ? ' light' : ''}`
    this.root.innerHTML = `
      <div class="gh-options">
        <div class="gh-options-left">
          ${this.controls.picker ? this.langControl() : ''}
          ${this.controls.picker ? this.clientControl() : ''}
        </div>
        <div class="gh-options-right">
          ${this.controls.copy ? this.copyControl() : ''}
          ${this.themeControl()}
        </div>
      </div>
      <div class="gh-output language-${this.language}"></div>
    `

    this.wireEvents()
    this.generate()
  }

  private langControl(): string {
    const logo = getLogo(this.language)
    const badge = logo
      ? `<span class="gh-lang-logo">${logo}</span>`
      : `<span class="gh-lang-text">${escapeHtml(this.language)}</span>`

    return `
      <button type="button" class="gh-lang" aria-label="Select language">
        ${badge}
        <span class="gh-lang-name">${escapeHtml(this.language)}</span>
        ${ARROW_ICON}
      </button>
    `
  }

  private clientControl(): string {
    const clients = this.clientsForLanguage()
    return `
      <div class="gh-client-dd">
        <button type="button" class="gh-client-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Select client">
          <span class="gh-client-label">${escapeHtml(this.client)}</span>
          ${ARROW_ICON}
        </button>
        <div class="gh-client-menu" role="listbox" hidden>
          ${clients
            .map(
              (client) =>
                `<button type="button" class="gh-client-option${client === this.client ? ' gh-selected' : ''}" role="option" data-client="${escapeHtml(client)}" aria-selected="${client === this.client}">${escapeHtml(client)}</button>`
            )
            .join('')}
        </div>
      </div>
    `
  }

  private copyControl(): string {
    return `
      <button type="button" class="gh-copy" aria-label="Copy code">
        ${COPY_ICON}
        <span class="gh-txt">Copy</span>
      </button>
    `
  }

  private themeControl(): string {
    const isLight = this.controls.theme === 'light'
    const label = isLight ? 'Switch to dark theme' : 'Switch to light theme'
    const icon = isLight ? MOON_ICON : SUN_ICON
    return `<button type="button" class="gh-theme" aria-label="${label}">${icon}</button>`
  }

  private wireEvents(): void {
    this.root?.querySelector('.gh-copy')?.addEventListener('click', () => this.copy())
    this.root?.querySelector('.gh-lang')?.addEventListener('click', () => this.toggleModal())
    this.root?.querySelector('.gh-client-trigger')?.addEventListener('click', (event) => {
      event.stopPropagation()
      this.toggleClientMenu()
    })
    this.root?.querySelector('.gh-theme')?.addEventListener('click', () => {
      this.setTheme(this.controls.theme === 'light' ? 'dark' : 'light')
    })

    this.root?.querySelectorAll('.gh-client-option').forEach((option) => {
      option.addEventListener('click', (event) => {
        event.stopPropagation()
        const client = (option as HTMLElement).dataset.client
        if (client) {
          this.closeClientMenu()
          this.setClient(client)
        }
      })
    })
  }

  private bindDocClick(): void {
    if (this.onDocClick || typeof document === 'undefined') {
      return
    }
    this.onDocClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (this.root?.querySelector('.gh-client-dd')?.contains(target)) {
        return
      }
      this.closeClientMenu()
    }
    document.addEventListener('click', this.onDocClick)
  }

  private unbindDocClick(): void {
    if (this.onDocClick && typeof document !== 'undefined') {
      document.removeEventListener('click', this.onDocClick)
    }
    this.onDocClick = null
  }

  private copy(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.code)
    }

    const copyEl = this.root?.querySelector('.gh-copy')
    if (!copyEl) {
      return
    }
    copyEl.classList.add('gh-show-copied')
    copyEl.innerHTML = '<span class="gh-txt">Copied!</span>'

    if (this.copiedTimeout) {
      clearTimeout(this.copiedTimeout)
    }
    this.copiedTimeout = window.setTimeout(() => {
      copyEl.classList.remove('gh-show-copied')
      copyEl.innerHTML = `${COPY_ICON}<span class="gh-txt">Copy</span>`
      this.copiedTimeout = null
    }, 2000)
  }

  private toggleClientMenu(): void {
    if (this.clientMenuOpen) {
      this.closeClientMenu()
    } else {
      this.closeModal()
      this.openClientMenu()
    }
  }

  private openClientMenu(): void {
    const menu = this.root?.querySelector('.gh-client-menu') as HTMLElement | null
    const trigger = this.root?.querySelector('.gh-client-trigger') as HTMLElement | null
    if (!menu || !trigger) {
      return
    }
    this.clientMenuOpen = true
    menu.hidden = false
    trigger.setAttribute('aria-expanded', 'true')
    trigger.classList.add('gh-open')
    this.bindDocClick()
  }

  private closeClientMenu(): void {
    this.clientMenuOpen = false
    const menu = this.root?.querySelector('.gh-client-menu') as HTMLElement | null
    const trigger = this.root?.querySelector('.gh-client-trigger') as HTMLElement | null
    if (menu) {
      menu.hidden = true
    }
    trigger?.setAttribute('aria-expanded', 'false')
    trigger?.classList.remove('gh-open')
    this.unbindDocClick()
  }

  private toggleModal(): void {
    if (this.modalOpen) {
      this.closeModal()
    } else {
      this.closeClientMenu()
      this.openModal()
    }
  }

  private openModal(): void {
    if (!this.root || this.modalOpen) {
      return
    }
    this.modalOpen = true

    const languages = this.languages()

    const modal = document.createElement('div')
    modal.className = 'gh-modal'
    modal.innerHTML = `
      <div class="gh-content">
        <div class="gh-modal-title">Select language</div>
        <div class="gh-langs">
          ${languages
            .map((lang) => {
              const logo = getLogo(lang)
              const inner = logo ? logo : `<span class="gh-lang-text-modal">${escapeHtml(lang)}</span>`
              return `<button type="button" class="gh-lang${lang === this.language ? ' gh-selected' : ''}" data-lang="${escapeHtml(lang)}">${inner}</button>`
            })
            .join('')}
        </div>
      </div>
    `

    modal.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.classList.contains('gh-modal')) {
        this.closeModal()
        return
      }

      const langEl = target.closest('[data-lang]') as HTMLElement | null
      if (langEl) {
        this.closeModal()
        this.setLanguage(langEl.dataset.lang!)
      }
    })

    this.root.appendChild(modal)
    this.root.querySelector('.gh-output')?.classList.add('gh-modalOpen')
    requestAnimationFrame(() => modal.classList.add('gh-open'))
  }

  private closeModal(): void {
    this.modalOpen = false
    this.root?.querySelector('.gh-output')?.classList.remove('gh-modalOpen')
    const modal = this.root?.querySelector('.gh-modal')
    if (!modal) {
      return
    }
    modal.classList.remove('gh-open')
    setTimeout(() => modal.remove(), 250)
  }
}
