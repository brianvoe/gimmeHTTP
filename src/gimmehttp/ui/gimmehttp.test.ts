import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest'
import { GimmeHTTP } from './gimmehttp'
import { ClearRegistry, Register } from '../core'
import { goHttp, jsAxios, jsFetch, shellCurl } from '../clients/index'
import type { Options, Settings } from './gimmehttp'

type CreateOptions = Omit<Partial<Options>, 'settings'> & {
  settings?: Partial<Settings>
}

describe('GimmeHTTP UI class', () => {
  let container: HTMLElement
  const instances: GimmeHTTP[] = []

  function create(options: CreateOptions = {}): GimmeHTTP {
    const { settings: settingsPartial, ...rest } = options
    const gh = new GimmeHTTP({
      container,
      ...rest,
      settings: {
        http: { method: 'GET', url: 'https://example.com' },
        ...settingsPartial
      }
    })
    instances.push(gh)
    return gh
  }

  beforeEach(() => {
    ClearRegistry()
    Register([shellCurl, goHttp, jsFetch, jsAxios])
    localStorage.clear()

    document.body.innerHTML = '<div id="container"></div>'
    container = document.getElementById('container')!
  })

  afterEach(() => {
    while (instances.length) {
      instances.pop()!.destroy()
    }
  })

  test('renders code output into the container', () => {
    const gh = create({ settings: { language: 'shell' } })

    const root = container.querySelector('.gimmehttp')
    expect(root).not.toBeNull()
    expect(gh.getCode()).toEqual('curl "https://example.com"')
    expect(container.querySelector('.gh-output')?.textContent).toContain('curl "https://example.com"')
  })

  test('accepts a selector string as container', () => {
    const gh = create({ container: '#container', settings: { language: 'shell' } })

    expect(gh.getCode()).toContain('curl')
    expect(container.querySelector('.gimmehttp')).not.toBeNull()
  })

  test('throws when container is not found', () => {
    expect(() =>
      new GimmeHTTP({
        container: '#nope',
        settings: { http: { method: 'GET', url: 'https://example.com' } }
      })
    ).toThrow(/container not found/)
  })

  test('throws when settings.http is missing', () => {
    expect(() => new GimmeHTTP({ container, settings: {} as any })).toThrow(/settings\.http is required/)
  })

  test('throws when no clients are registered', () => {
    ClearRegistry()
    expect(() => create()).toThrow(/no clients registered/)
  })

  test('registers clients passed via options', () => {
    ClearRegistry()
    const gh = create({ clients: [shellCurl], settings: { language: 'shell' } })
    expect(gh.getLanguage()).toEqual('shell')
    expect(gh.getCode()).toContain('curl')
  })

  test('limits the language picker to clients passed via options', () => {
    // Global registry still has every client from beforeEach
    const gh = create({ clients: [shellCurl, goHttp], settings: { language: 'shell' } })

    const trigger = container.querySelector('.gh-options .gh-lang') as HTMLElement
    trigger.click()

    const langs = [...container.querySelectorAll('.gh-modal [data-lang]')].map((el) => el.getAttribute('data-lang'))
    expect(langs).toEqual(['shell', 'go'])

    gh.setLanguage('javascript')
    expect(gh.getLanguage()).toEqual('shell')
  })

  test('preserves language order from the clients option', () => {
    create({ clients: [shellCurl, goHttp, jsFetch], settings: { language: 'shell' } })

    const trigger = container.querySelector('.gh-options .gh-lang') as HTMLElement
    trigger.click()

    const langs = [...container.querySelectorAll('.gh-modal [data-lang]')].map((el) => el.getAttribute('data-lang'))
    expect(langs).toEqual(['shell', 'go', 'javascript'])
  })

  test('switches language and client', () => {
    const gh = create({ settings: { language: 'shell' } })

    gh.setLanguage('go')
    expect(gh.getLanguage()).toEqual('go')
    expect(gh.getCode()).toContain('package main')

    gh.setLanguage('javascript', 'fetch')
    expect(gh.getLanguage()).toEqual('javascript')
    expect(gh.getClient()).toEqual('fetch')
    expect(gh.getCode()).toContain('fetch(')
  })

  test('ignores unknown languages', () => {
    const gh = create({ settings: { language: 'shell' } })
    gh.setLanguage('brainfuck')
    expect(gh.getLanguage()).toEqual('shell')
  })

  test('updates output when http changes', () => {
    const gh = create({ settings: { language: 'shell' } })
    gh.setHttp({ method: 'GET', url: 'https://other.com' })
    expect(gh.getCode()).toContain('https://other.com')
  })

  test('setSettings merges partial updates', () => {
    const gh = create({ settings: { language: 'shell', theme: 'dark' } })

    gh.setSettings({ http: { method: 'GET', url: 'https://merged.com' }, theme: 'light' })
    expect(gh.getCode()).toContain('https://merged.com')
    expect(container.querySelector('.gimmehttp')!.classList.contains('light')).toBe(true)
    expect(gh.getLanguage()).toEqual('shell')

    gh.setSettings({ language: 'go' })
    expect(gh.getLanguage()).toEqual('go')
    expect(gh.getCode()).toContain('package main')
  })

  test('persists selection to localStorage', () => {
    const gh = create({ settings: { language: 'shell' } })
    gh.setLanguage('go')

    expect(localStorage.getItem('gimmeLang')).toEqual('go')
    expect(localStorage.getItem('gimmeClient')).toEqual('http')
  })

  test('initializes from localStorage when no language option given', () => {
    localStorage.setItem('gimmeLang', 'go')
    localStorage.setItem('gimmeClient', 'http')

    const gh = create()
    expect(gh.getLanguage()).toEqual('go')
  })

  test('syncs language across instances', () => {
    const second = document.createElement('div')
    document.body.appendChild(second)

    const a = create({ settings: { language: 'shell' } })
    const b = create({ container: second, settings: { language: 'shell' } })

    a.setLanguage('go')
    expect(b.getLanguage()).toEqual('go')
    expect(b.getCode()).toContain('package main')
  })

  test('syntax-highlights output with bundled highlight.js', () => {
    create({ settings: { language: 'shell' } })

    const html = container.querySelector('.gh-output')!.innerHTML
    expect(html).toContain('hljs')
    expect(html).toContain('language-bash')
  })

  test('copy button writes code to clipboard and shows feedback', () => {
    const writeText = vi.fn()
    Object.assign(navigator, { clipboard: { writeText } })

    const gh = create({ settings: { language: 'shell' } })

    const copy = container.querySelector('.gh-copy') as HTMLElement
    expect(copy).not.toBeNull()
    expect(copy.textContent).toContain('Copy')
    copy.click()

    expect(writeText).toHaveBeenCalledWith(gh.getCode())
    expect(copy.classList.contains('gh-show-copied')).toBe(true)
    expect(copy.textContent).toContain('Copied!')
  })

  test('hides copy button and picker when disabled', () => {
    create({ settings: { copy: false, picker: false } })

    expect(container.querySelector('.gh-copy')).toBeNull()
    expect(container.querySelector('.gh-options .gh-lang')).toBeNull()
    expect(container.querySelector('.gh-client-dd')).toBeNull()
    expect(container.querySelector('.gh-theme')).not.toBeNull()
  })

  test('opens the language modal and selects a language', () => {
    const gh = create({ settings: { language: 'shell' } })

    const trigger = container.querySelector('.gh-options .gh-lang') as HTMLElement
    trigger.click()

    const modal = container.querySelector('.gh-modal')
    expect(modal).not.toBeNull()
    expect(modal!.querySelectorAll('.gh-langs .gh-lang').length).toBeGreaterThan(1)
    expect(modal!.querySelector('.gh-clients')).toBeNull()

    const goOption = modal!.querySelector('[data-lang="go"]') as HTMLElement
    goOption.click()

    expect(gh.getLanguage()).toEqual('go')
  })

  test('opens the client dropdown and selects a client', () => {
    const gh = create({ settings: { language: 'javascript', client: 'fetch' } })

    const trigger = container.querySelector('.gh-client-trigger') as HTMLElement
    trigger.click()

    const menu = container.querySelector('.gh-client-menu') as HTMLElement
    expect(menu.hidden).toBe(false)

    const axiosOption = container.querySelector('[data-client="axios"]') as HTMLElement
    expect(axiosOption).not.toBeNull()
    axiosOption.click()

    expect(gh.getClient()).toEqual('axios')
  })

  test('toggles theme from the options bar', () => {
    create({ settings: { theme: 'dark' } })

    const theme = container.querySelector('.gh-theme') as HTMLElement
    expect(container.querySelector('.gimmehttp')!.classList.contains('light')).toBe(false)

    theme.click()
    expect(container.querySelector('.gimmehttp')!.classList.contains('light')).toBe(true)
  })

  test('applies light theme class', () => {
    const gh = create({ settings: { theme: 'light' } })

    expect(container.querySelector('.gimmehttp')!.classList.contains('light')).toBe(true)

    gh.setTheme('dark')
    expect(container.querySelector('.gimmehttp')!.classList.contains('light')).toBe(false)
  })

  test('fires afterChange event', () => {
    const afterChange = vi.fn()
    create({ settings: { language: 'shell' }, events: { afterChange } })

    expect(afterChange).toHaveBeenCalledWith('shell', 'curl', 'curl "https://example.com"')
  })

  test('destroy removes the rendered element', () => {
    const gh = create()
    expect(container.querySelector('.gimmehttp')).not.toBeNull()

    gh.destroy()
    expect(container.querySelector('.gimmehttp')).toBeNull()
  })
})
