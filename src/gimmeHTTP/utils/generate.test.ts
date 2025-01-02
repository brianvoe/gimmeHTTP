import { Register } from './registry'
import { Generate, Settings } from './generate'
import { beforeAll, describe, expect, test } from '@jest/globals'

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
})
