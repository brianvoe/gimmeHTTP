import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import React from 'react'
import GimmeHttp from './gimmehttp'
import { ClearRegistry, Register } from '../core'
import { goHttp, jsFetch, pythonRequests, shellCurl } from '../clients/index'
import type { Http } from '../utils/generate'

/**
 * The React component is a thin wrapper around the vanilla GimmeHTTP UI class,
 * which has its own test suite. These tests cover prop mapping and lifecycle.
 */
describe('GimmeHttp React Component', () => {
  const basicHttp: Http = {
    method: 'GET',
    url: 'https://example.com'
  }

  beforeEach(() => {
    ClearRegistry()
    Register([shellCurl, goHttp, jsFetch, pythonRequests])
    localStorage.clear()
    cleanup()
  })

  describe('Component Mounting', () => {
    it('should mount and render the UI class output', () => {
      const { container, unmount } = render(
        <GimmeHttp
          settings={{
            http: basicHttp,
            language: 'javascript',
            client: 'fetch'
          }}
        />
      )

      expect(container.querySelector('.gimmehttp')).not.toBeNull()
      expect(container.querySelector('.gh-output')?.textContent).toContain('fetch(')

      unmount()
    })

    it('should use the language setting for initial selection', () => {
      const { container, unmount } = render(
        <GimmeHttp
          settings={{
            http: basicHttp,
            language: 'python'
          }}
        />
      )

      expect(container.querySelector('.gh-output')?.textContent).toContain('requests')

      unmount()
    })
  })

  describe('Callbacks', () => {
    it('should call onLanguageChange and onClientChange after render', () => {
      const onLanguageChange = vi.fn()
      const onClientChange = vi.fn()

      const { unmount } = render(
        <GimmeHttp
          settings={{
            http: basicHttp,
            language: 'go'
          }}
          onLanguageChange={onLanguageChange}
          onClientChange={onClientChange}
        />
      )

      expect(onLanguageChange).toHaveBeenCalledWith('go')
      expect(onClientChange).toHaveBeenCalledWith('http')

      unmount()
    })
  })

  describe('Prop Updates', () => {
    it('should re-render when http changes', () => {
      const { container, rerender, unmount } = render(
        <GimmeHttp
          settings={{
            http: basicHttp,
            language: 'shell'
          }}
        />
      )

      rerender(
        <GimmeHttp
          settings={{
            http: { method: 'GET', url: 'https://other.com' },
            language: 'shell'
          }}
        />
      )
      expect(container.querySelector('.gh-output')?.textContent).toContain('https://other.com')

      unmount()
    })

    it('should switch language when the language setting changes', () => {
      const { container, rerender, unmount } = render(
        <GimmeHttp
          settings={{
            http: basicHttp,
            language: 'shell'
          }}
        />
      )

      rerender(
        <GimmeHttp
          settings={{
            http: basicHttp,
            language: 'go'
          }}
        />
      )
      expect(container.querySelector('.gh-output')?.textContent).toContain('package main')

      unmount()
    })
  })

  describe('Theme Support', () => {
    it('should apply the light theme class', () => {
      const { container, unmount } = render(
        <GimmeHttp
          settings={{
            http: basicHttp,
            theme: 'light'
          }}
        />
      )

      expect(container.querySelector('.gimmehttp')?.classList.contains('light')).toBe(true)

      unmount()
    })

    it('should switch themes reactively', () => {
      const { container, rerender, unmount } = render(
        <GimmeHttp
          settings={{
            http: basicHttp,
            theme: 'dark'
          }}
        />
      )

      rerender(
        <GimmeHttp
          settings={{
            http: basicHttp,
            theme: 'light'
          }}
        />
      )
      expect(container.querySelector('.gimmehttp')?.classList.contains('light')).toBe(true)

      unmount()
    })
  })

  describe('Component Lifecycle', () => {
    it('should clean up on unmount', () => {
      const { unmount } = render(
        <GimmeHttp
          settings={{
            http: basicHttp,
            language: 'javascript'
          }}
        />
      )

      expect(() => unmount()).not.toThrow()
      expect(document.body.querySelector('.gimmehttp')).toBeNull()
    })
  })
})
