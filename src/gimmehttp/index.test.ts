import { Register, Generate, Settings, Config, Http, Builder, ClearRegistry, Languages } from './core'
import { beforeEach, describe, expect, test } from 'vitest'
import { shellCurl, allClients } from './clients/index'

describe('Index', () => {
  beforeEach(() => {
    ClearRegistry()
    Register(shellCurl)
  })

  test('should not have any clients registered by default', () => {
    ClearRegistry()
    const { error } = Generate({
      language: 'shell',
      http: { method: 'GET', url: 'https://example.com' }
    } as Settings)

    expect(error).toBeDefined()
  })

  test('should register all clients via allClients', () => {
    ClearRegistry()
    Register(allClients)

    expect(allClients.length).toEqual(45)
    expect(Languages()).toContain('go')
    expect(Languages()).toContain('shell')
    expect(Languages()).toContain('javascript')
  })

  test('should run simple example', () => {
    // Generate settings
    const settings = {
      language: 'shell',
      client: 'curl',
      http: {
        method: 'GET',
        url: 'https://example.com'
      }
    } as Settings

    // Generate outcome
    const { code, error } = Generate(settings)
    if (error) {
      expect(error).toBeUndefined()
    }

    expect(code).toEqual(`curl "https://example.com"`)
  })

  test('should run simple post example', () => {
    // Generate settings
    const settings = {
      language: 'shell',
      client: 'curl',
      http: {
        method: 'POST',
        url: 'https://example.com',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          key1: 'value1',
          key2: 8675309
        }
      }
    } as Settings

    // Generate outcome
    const { code, error } = Generate(settings)
    if (error) {
      expect(error).toBeUndefined()
    }

    expect(code).toEqual(
      `
curl "https://example.com" \\
  -H "Content-Type: application/json" \\
  -d '{
  "key1": "value1",
  "key2": 8675309
}'
    `.trim()
    )
  })

  test('should run custom registry example', () => {
    // Add custom code
    Register({
      language: 'custom',
      client: 'native',
      generate(config: Config, http: Http): string {
        return 'url: ' + http.url + ' method: ' + http.method
      }
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

    // Generate outcome
    const { code, error } = Generate(settings)
    if (error) {
      expect(error).toBeUndefined()
    }

    expect(code).toEqual('url: https://example.com method: GET')
  })

  test('should run custom language client with advanced builder usage', () => {
    // Add custom code
    Register({
      language: 'custom',
      client: 'native',
      generate(config: Config, http: Http): string {
        const builder = new Builder(config)

        builder.line('url: ' + http.url)
        builder.line('method: ' + http.method)

        return builder.output()
      }
    })

    // Generate settings
    const req = {
      language: 'custom',
      client: 'native',
      http: {
        method: 'GET',
        url: 'https://example.com'
      }
    } as Settings

    // Generate outcome
    const { code, error } = Generate(req)
    if (error) {
      expect(error).toBeUndefined()
    }

    expect(code).toEqual(
      `
url: https://example.com
method: GET
`.trim()
    )
  })
})
