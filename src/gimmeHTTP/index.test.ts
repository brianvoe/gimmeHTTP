import { Register, Generate, Settings, Config, Http, Builder } from './index'
import { beforeAll, describe, expect, test } from '@jest/globals'
import ShellCurl from './languages/shell.curl'

describe('Index', () => {
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
          'Content-Type': 'application/json'
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
    } as Settings

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
    } as Settings

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual('url: https://gofakeit.com\nmethod: GET')
  })
})
