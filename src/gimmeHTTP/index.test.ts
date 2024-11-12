import AllCodes from './all'
import { Register, Generate, ClearRegistry, Request, Config, Http, Builder } from './index'
import { beforeEach, describe, expect, test } from '@jest/globals'

describe('Index', () => {
  beforeEach(() => {
    ClearRegistry()
  })

  test('should run simple example', () => {
    // Add all the codes
    Register(AllCodes)

    // Generate a request
    const req = {
      language: 'curl',
      target: 'native',
      http: {
        method: 'GET',
        url: 'https://gofakeit.com'
      }
    } as Request

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual(`curl -X GET "https://gofakeit.com"`)
  })

  test('should run simple post example', () => {
    // Add all the codes
    Register(AllCodes)

    // Generate a request
    const req = {
      language: 'curl',
      target: 'native',
      http: {
        method: 'POST',
        url: 'https://gofakeit.com',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          key1: 'value1',
          key2: 'value2'
        }
      }
    } as Request

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual(
      `
curl -X POST "https://gofakeit.com"
  -H "Content-Type: application/json"
  -d '{"key1":"value1","key2":"value2"}'
    `.trim()
    )
  })

  test('should run custom registry example', () => {
    // Add all the codes
    Register({
      language: 'custom',
      target: 'native',
      generate(config: Config, http: Http): string {
        return 'url: ' + http.url + ' method: ' + http.method
      }
    })

    // Generate a request
    const req = {
      language: 'custom',
      target: 'native',
      http: {
        method: 'GET',
        url: 'https://gofakeit.com'
      }
    } as Request

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual('url: https://gofakeit.com method: GET')
  })

  test('should run custom language target with advanced builder usage', () => {
    // Add all the codes
    Register({
      language: 'custom',
      target: 'native',
      generate(config: Config, http: Http): string {
        const builder = new Builder(config)

        builder.line('url: ' + http.url)
        builder.line('method: ' + http.method)

        return builder.output()
      }
    })

    // Generate a request
    const req = {
      language: 'custom',
      target: 'native',
      http: {
        method: 'GET',
        url: 'https://gofakeit.com'
      }
    } as Request

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual('url: https://gofakeit.com\nmethod: GET')
  })
})
