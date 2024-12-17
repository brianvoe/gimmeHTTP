import ShellCurl from './shell.curl'
import { Http } from '../utils/generate'
import { describe, expect, test } from '@jest/globals'

describe('Curl.generate', () => {
  test('Basic GET', () => {
    const config = {}
    const http: Http = {
      method: 'GET',
      url: 'https://gofakeit.com'
    }
    const result = ShellCurl.generate(config, http)
    expect(result).toBe(`curl -X GET "https://gofakeit.com"`)
  })

  test('POST - headers', () => {
    const config = {}
    const http: Http = {
      method: 'POST',
      url: 'https://gofakeit.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      }
    }
    const result = ShellCurl.generate(config, http)
    expect(result).toBe(
      `
curl -X POST "https://gofakeit.com" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token"
      `.trim()
    )
  })

  test('POST - headers, data (JSON)', () => {
    const config = {}
    const http: Http = {
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
    const result = ShellCurl.generate(config, http)
    // The JSON should be multiline and indented:
    // -d $'{
    //   "key1": "value1",
    //   "key2": "value2"
    // }'
    expect(result).toBe(
      `
curl -X POST "https://gofakeit.com" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token" \\
  -d $'{ \\
    "key1": "value1", \\
    "key2": "value2" \\
  }'
      `.trim()
    )
  })

  test('POST - cookies', () => {
    const config = {}
    const http: Http = {
      method: 'POST',
      url: 'http://gofakeit.com',
      cookies: {
        foo: 'bar',
        bar: 'baz'
      }
    }
    const result = ShellCurl.generate(config, http)
    expect(result).toBe(
      `
curl -X POST "http://gofakeit.com" \\
  -b "foo=bar; bar=baz"
      `.trim()
    )
  })

  test('POST - headers, cookies, and form-data', () => {
    const config = {}
    const http: Http = {
      method: 'POST',
      url: 'http://gofakeit.com?foo=bar&foo=baz&baz=abc&key=value',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      cookies: {
        foo: 'bar',
        bar: 'baz'
      },
      body: {
        foo: 'bar'
      }
    }
    const result = ShellCurl.generate(config, http)
    expect(result).toBe(
      `
curl -X POST "http://gofakeit.com?foo=bar&foo=baz&baz=abc&key=value" \\
  -H "accept: application/json" \\
  -H "content-type: application/x-www-form-urlencoded" \\
  -b "foo=bar; bar=baz" \\
  -d 'foo=bar'
      `.trim()
    )
  })

  test('GET - complex headers', () => {
    const config = {}
    const http: Http = {
      method: 'GET',
      url: 'http://gofakeit.com',
      headers: {
        accept: 'application/json',
        'quoted-value': `"quoted" 'string'`,
        'x-foo': 'Bar'
      }
    }
    const result = ShellCurl.generate(config, http)
    expect(result).toBe(
      `
curl -X GET "http://gofakeit.com" \\
  -H "accept: application/json" \\
  -H "quoted-value: \\"quoted\\" 'string'" \\
  -H "x-foo: Bar"
      `.trim()
    )
  })

  test('Multiline JSON body with nested objects', () => {
    const config = {}
    const http: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: { 'Content-Type': 'application/json' },
      body: {
        foo: 'bar',
        nested: {
          key: 'value'
        },
        list: [1, 2, 3]
      }
    }
    const result = ShellCurl.generate(config, http)
    // Expect a nicely indented JSON:
    // {
    //   "foo": "bar",
    //   "nested": {
    //     "key": "value"
    //   },
    //   "list": [
    //     1,
    //     2,
    //     3
    //   ]
    // }
    expect(result).toContain("-d $'{")
    expect(result).toContain('"foo": "bar"')
    expect(result).toContain('"nested": {')
    expect(result).toContain('"list": [')
    // Ensure no trailing backslash after the last line
    expect(result.endsWith("}'")).toBe(true)
  })

  test('GET - no trailing slash with no headers, no cookies, no body', () => {
    const config = {}
    const http: Http = {
      method: 'GET',
      url: 'http://example.com'
    }
    const result = ShellCurl.generate(config, http)
    // Should be a single line with no trailing slash
    expect(result).toBe('curl -X GET "http://example.com"')
  })
})
