import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GimmeHttp from './gimmehttp.vue'
import type { Http } from '../utils/generate'

// Mock Highlight.js to avoid issues in tests
vi.mock('highlight.js', () => ({
  default: {
    highlight: vi.fn((code: string) => ({
      value: code
    })),
    registerLanguage: vi.fn()
  }
}))

/**
 * Note: These are basic smoke tests for the Vue component.
 * Full integration testing would require mocking Highlight.js and browser APIs.
 * The component is primarily tested through manual QA and E2E tests.
 */
describe('GimmeHttp Vue Component', () => {
  const basicHttp: Http = {
    method: 'GET',
    url: 'https://example.com'
  }

  describe('Component Mounting', () => {
    it('should mount without errors', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: basicHttp,
          language: 'javascript',
          client: 'fetch'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should accept http prop as required', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: basicHttp
        }
      })

      expect(wrapper.vm.http).toBeDefined()
    })

    it('should accept optional language prop', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: basicHttp,
          language: 'python'
        }
      })

      expect(wrapper.vm.language).toBe('python')
    })

    it('should accept optional client prop', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: basicHttp,
          client: 'requests'
        }
      })

      expect(wrapper.vm.client).toBe('requests')
    })

    it('should accept optional theme prop', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: basicHttp,
          theme: 'dark'
        }
      })

      expect(wrapper.vm.theme).toBe('dark')
    })
  })

  describe('Props Validation', () => {
    it('should handle complex http objects', () => {
      const complexHttp: Http = {
        method: 'POST',
        url: 'https://api.example.com/data',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123'
        },
        cookies: {
          session: 'abc123'
        },
        body: {
          name: 'test',
          nested: {
            value: 'deep'
          }
        }
      }

      const wrapper = mount(GimmeHttp, {
        props: {
          http: complexHttp,
          language: 'python',
          client: 'requests'
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.http).toEqual(complexHttp)
    })

    it('should handle all HTTP methods', () => {
      const methods: Array<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'> = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

      methods.forEach((method) => {
        const wrapper = mount(GimmeHttp, {
          props: {
            http: {
              method,
              url: 'https://example.com'
            }
          }
        })

        expect(wrapper.exists()).toBe(true)
      })
    })
  })

  describe('Data Initialization', () => {
    it('should initialize with correct default data', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: basicHttp
        }
      })

      // Check that data properties are initialized
      expect(wrapper.vm.openModal).toBe(false)
      expect(wrapper.vm.openModalContent).toBe(false)
      expect(wrapper.vm.clientsList).toBeInstanceOf(Array)
    })
  })

  describe('Emits', () => {
    it('should declare update:language emit', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: basicHttp
        }
      })

      // Component should have the emit defined
      expect(wrapper.vm.$options.emits).toContain('update:language')
    })

    it('should declare update:client emit', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: basicHttp
        }
      })

      expect(wrapper.vm.$options.emits).toContain('update:client')
    })
  })

  describe('Component Lifecycle', () => {
    it('should not throw errors on unmount', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: basicHttp,
          language: 'javascript'
        }
      })

      expect(() => wrapper.unmount()).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle http object with only method and url', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: {
            method: 'GET',
            url: 'https://example.com'
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle http object with headers only', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: {
            method: 'POST',
            url: 'https://example.com',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle http object with body only', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: {
            method: 'POST',
            url: 'https://example.com',
            body: { test: 'data' }
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle http object with cookies only', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: {
            method: 'GET',
            url: 'https://example.com',
            cookies: { session: 'value' }
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Multiple Language Support', () => {
    const languages = ['c', 'csharp', 'go', 'javascript', 'python', 'ruby', 'rust', 'php', 'shell', 'swift']

    languages.forEach((language) => {
      it(`should mount with ${language} language`, () => {
        const wrapper = mount(GimmeHttp, {
          props: {
            http: basicHttp,
            language
          }
        })

        expect(wrapper.exists()).toBe(true)
      })
    })
  })

  describe('Theme Support', () => {
    it('should accept light theme', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: basicHttp,
          theme: 'light'
        }
      })

      expect(wrapper.vm.theme).toBe('light')
    })

    it('should accept dark theme', () => {
      const wrapper = mount(GimmeHttp, {
        props: {
          http: basicHttp,
          theme: 'dark'
        }
      })

      expect(wrapper.vm.theme).toBe('dark')
    })
  })
})
