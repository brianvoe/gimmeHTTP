import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GimmeHttp from './gimmehttp.vue'
import { ClearRegistry, Register } from '../core'
import { goHttp, jsFetch, pythonRequests, shellCurl } from '../clients/index'
import type { Http } from '../utils/generate'

/**
 * The Vue component is a thin wrapper around the vanilla GimmeHTTP UI class,
 * which has its own test suite. These tests cover prop mapping and lifecycle.
 */
describe('GimmeHttp Vue Component', () => {
  const basicHttp: Http = {
    method: 'GET',
    url: 'https://example.com'
  }

  beforeEach(() => {
    ClearRegistry()
    Register([shellCurl, goHttp, jsFetch, pythonRequests])
    localStorage.clear()
  })

  describe('Component Mounting', () => {
    it('should mount and render the UI class output', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          settings: {
            http: basicHttp,
            language: 'javascript',
            client: 'fetch'
          }
        },
        attachTo: document.body
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.element.querySelector('.gimmehttp')).not.toBeNull()
      expect(wrapper.element.querySelector('.gh-output')?.textContent).toContain('fetch(')

      wrapper.unmount()
    })

    it('should use the language setting for initial selection', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          settings: {
            http: basicHttp,
            language: 'python'
          }
        },
        attachTo: document.body
      })

      expect(wrapper.element.querySelector('.gh-output')?.textContent).toContain('requests')

      wrapper.unmount()
    })
  })

  describe('Emits', () => {
    it('should emit update:language and update:client after render', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          settings: {
            http: basicHttp,
            language: 'go'
          }
        },
        attachTo: document.body
      })

      expect(wrapper.emitted('update:language')?.[0]).toEqual(['go'])
      expect(wrapper.emitted('update:client')?.[0]).toEqual(['http'])

      wrapper.unmount()
    })
  })

  describe('Prop Updates', () => {
    it('should re-render when http changes', async () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          settings: {
            http: basicHttp,
            language: 'shell'
          }
        },
        attachTo: document.body
      })

      await wrapper.setProps({
        settings: {
          http: { method: 'GET', url: 'https://other.com' },
          language: 'shell'
        }
      })
      expect(wrapper.element.querySelector('.gh-output')?.textContent).toContain('https://other.com')

      wrapper.unmount()
    })

    it('should switch language when the language setting changes', async () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          settings: {
            http: basicHttp,
            language: 'shell'
          }
        },
        attachTo: document.body
      })

      await wrapper.setProps({
        settings: {
          http: basicHttp,
          language: 'go'
        }
      })
      expect(wrapper.element.querySelector('.gh-output')?.textContent).toContain('package main')

      wrapper.unmount()
    })
  })

  describe('Theme Support', () => {
    it('should apply the light theme class', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          settings: {
            http: basicHttp,
            theme: 'light'
          }
        },
        attachTo: document.body
      })

      expect(wrapper.element.querySelector('.gimmehttp')?.classList.contains('light')).toBe(true)

      wrapper.unmount()
    })

    it('should switch themes reactively', async () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          settings: {
            http: basicHttp,
            theme: 'dark'
          }
        },
        attachTo: document.body
      })

      await wrapper.setProps({
        settings: {
          http: basicHttp,
          theme: 'light'
        }
      })
      expect(wrapper.element.querySelector('.gimmehttp')?.classList.contains('light')).toBe(true)

      wrapper.unmount()
    })
  })

  describe('Component Lifecycle', () => {
    it('should clean up on unmount', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          settings: {
            http: basicHttp,
            language: 'javascript'
          }
        },
        attachTo: document.body
      })

      expect(() => wrapper.unmount()).not.toThrow()
      expect(document.body.querySelector('.gimmehttp')).toBeNull()
    })
  })
})
