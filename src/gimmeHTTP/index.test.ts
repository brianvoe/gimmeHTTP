import { Register, Generate, Settings, Config, Http, Builder, ClearRegistry } from './index'
import { beforeEach, describe, expect, test } from '@jest/globals'
import ShellCurl from './targets/shell.curl'

describe('Index', () => {
  beforeEach(() => {
    ClearRegistry()
    Register(ShellCurl)
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

    expect(code).toEqual(`curl -X GET "https://example.com"`)
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
          key2: 'value2'
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
curl -X POST "https://example.com" \\
  -H "Content-Type: application/json" \\
  -d $'{ \\
    "key1": "value1", \\
    "key2": "value2" \\
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
