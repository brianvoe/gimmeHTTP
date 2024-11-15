import { Register } from './registry'
import { Generate, Settings } from './generate'
import { beforeAll, describe, expect, test } from '@jest/globals'

// Target
import ShellCurl from '../languages/shell.curl'

describe('Generate', () => {
  beforeAll(() => {
    Register(ShellCurl)
  })

  test('should run simple example', () => {
    // Generate a request
    const req = {
      language: 'shell',
      target: 'curl',
      http: {
        method: 'GET',
        url: 'https://gofakeit.com'
      }
    } as Settings

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual(`curl -X GET "https://gofakeit.com"`)
  })

  test('should run simple post example', () => {
    // Generate a request
    const req = {
      language: 'shell',
      target: 'curl',
      http: {
        method: 'POST',
        url: 'https://gofakeit.com',
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

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual(
      `
curl -X POST "https://gofakeit.com"
  -H "Content-Type: application/json"
  -H "Authorization: Bearer token"
  -d '{"key1":"value1","key2":"value2"}'
    `.trim()
    )
  })

  test('should run a simple custom registry and output', () => {
    // Add a custom code
    Register({
      language: 'custom',
      target: 'native',
      generate: () => 'custom code'
    })

    // Generate a request
    const req = {
      language: 'custom',
      target: 'native',
      http: {
        method: 'GET',
        url: 'https://gofakeit.com'
      }
    } as Settings

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual('custom code')
  })
})
