import { Register } from './registry'
import { Generate, Settings } from './generate'
import { beforeAll, describe, expect, test } from 'vitest'

// Target
import ShellCurl from '../clients/shell.curl'

describe('Generate', () => {
  beforeAll(() => {
    Register(ShellCurl)
  })

  test('should run simple example', () => {
    // Generate a request
    const settings = {
      language: 'shell',
      client: 'curl',
      http: {
        method: 'GET',
        url: 'https://example.com'
      }
    } as Settings

    // Generate outcome
    const { error, language, client, code } = Generate(settings)
    if (error) {
      expect(error).toBeUndefined()
    }

    expect(language).toEqual(settings.language)
    expect(client).toEqual(settings.client)

    expect(code).toEqual(`curl -X GET "https://example.com"`)
  })

  test('should run simple post example', () => {
    // Generate a request
    const settings = {
      language: 'shell',
      client: 'curl',
      http: {
        method: 'POST',
        url: 'https://example.com',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token'
        },
        body: {
          key1: 'value1',
          key2: 'value2'
        }
      }
    } as Settings

    // Generate outcome
    const { error, language, client, code } = Generate(settings)
    if (error) {
      expect(error).toBeUndefined()
    }

    expect(language).toEqual(settings.language)
    expect(client).toEqual(settings.client)

    expect(code).toEqual(
      `
curl -X POST "https://example.com" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token" \\
  -d $'{ \\
    "key1": "value1", \\
    "key2": "value2" \\
  }'
    `.trim()
    )
  })

  test('should run a simple custom registry and output', () => {
    // Add a custom code
    Register({
      language: 'custom',
      client: 'native',
      generate: () => 'custom code'
    })

    // Generate settings
    const settings = {
      language: 'custom',
      client: 'native',
      http: {
        method: 'GET',
        url: 'https://example.com'
      }
    } as Settings

    // Generate the code
    const { error, language, client, code } = Generate(settings)
    if (error) {
      expect(error).toBeUndefined()
    }

    expect(language).toEqual(settings.language)
    expect(client).toEqual(settings.client)

    expect(code).toEqual('custom code')
  })

  test('should return error when request is null', () => {
    const { error } = Generate(null as any)
    expect(error).toBe('Request is required')
  })

  test('should return error when http is missing', () => {
    const settings = {
      language: 'shell'
    } as Settings
    const { error } = Generate(settings)
    expect(error).toBe('http is required')
  })

  test('should return error when http.method is missing', () => {
    const settings = {
      language: 'shell',
      http: {
        url: 'https://example.com'
      }
    } as any
    const { error } = Generate(settings)
    expect(error).toBe('http.method is required')
  })

  test('should return error when http.url is missing', () => {
    const settings = {
      language: 'shell',
      http: {
        method: 'GET'
      }
    } as any
    const { error } = Generate(settings)
    expect(error).toBe('http.url is required')
  })

  test('should use default language (javascript) when language not specified', () => {
    // First register a javascript client
    Register({
      language: 'javascript',
      client: 'fetch',
      generate: () => 'fetch("https://example.com")'
    })

    const settings = {
      http: {
        method: 'GET',
        url: 'https://example.com'
      }
    } as Settings

    const { error, language, code } = Generate(settings)
    expect(error).toBeUndefined()
    expect(language).toBe('javascript')
    expect(code).toBeDefined()
  })

  test('should return error when client not found', () => {
    const settings = {
      language: 'nonexistent',
      client: 'fake',
      http: {
        method: 'GET',
        url: 'https://example.com'
      }
    } as Settings

    const { error } = Generate(settings)
    expect(error).toBe('Client not found')
  })

  test('should use default config values when config not provided', () => {
    Register({
      language: 'test',
      client: 'test',
      generate: (config) => {
        expect(config.handleErrors).toBe(false)
        return 'test'
      }
    })

    const settings = {
      language: 'test',
      http: {
        method: 'GET',
        url: 'https://example.com'
      }
    } as Settings

    const { error } = Generate(settings)
    expect(error).toBeUndefined()
  })

  test('should respect custom config values', () => {
    Register({
      language: 'test2',
      client: 'test2',
      generate: (config) => {
        expect(config.handleErrors).toBe(true)
        expect(config.indent).toBe('\t')
        return 'test'
      }
    })

    const settings = {
      language: 'test2',
      config: {
        handleErrors: true,
        indent: '\t'
      },
      http: {
        method: 'GET',
        url: 'https://example.com'
      }
    } as Settings

    const { error } = Generate(settings)
    expect(error).toBeUndefined()
  })
})
