import ShellCurl from './shell.curl'
import { Http } from '../utils/generate'
import { describe, expect, test } from '@jest/globals'

describe('shell.curl', () => {
  test('GET - simple', () => {
    const config = {}
    const http: Http = {
      method: 'GET',
      url: 'https://example.com'
    }

    const result = ShellCurl.generate(config, http)
    expect(result).toBe(`curl -X GET "https://example.com"`)
  })

  test('GET - no trailing slash with no headers, no cookies, no body', () => {
    const config = {}
    const http: Http = {
      method: 'GET',
      url: 'http://example.com'
    }

    const result = ShellCurl.generate(config, http)
    expect(result).toBe('curl -X GET "http://example.com"')
  })

  test('POST - headers', () => {
    const config = {}
    const http: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      }
    }

    const result = ShellCurl.generate(config, http)
    expect(result).toBe(
      `
curl -X POST "https://example.com" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token"
      `.trim()
    )
  })

  test('POST - headers, data (JSON)', () => {
    const config = {}
    const http: Http = {
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

    const result = ShellCurl.generate(config, http)
    expect(result).toBe(
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

  test('POST - cookies', () => {
    const config = {}
    const http: Http = {
      method: 'POST',
      url: 'http://example.com',
      cookies: {
        foo: 'bar',
        bar: 'baz'
      }
    }

    const result = ShellCurl.generate(config, http)
    expect(result).toBe(
      `
curl -X POST "http://example.com" \\
  -b "foo=bar; bar=baz"
      `.trim()
    )
  })

  test('POST - headers, cookies, and form-data', () => {
    const config = {}
    const http: Http = {
      method: 'POST',
      url: 'http://example.com?foo=bar&foo=baz&baz=abc&key=value',
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
curl -X POST "http://example.com?foo=bar&foo=baz&baz=abc&key=value" \\
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
      url: 'http://example.com',
      headers: {
        accept: 'application/json',
        'quoted-value': `"quoted" 'string'`,
        'x-foo': 'Bar'
      }
    }

    const result = ShellCurl.generate(config, http)
    expect(result).toBe(
      `
curl -X GET "http://example.com" \\
  -H "accept: application/json" \\
  -H "quoted-value: \\"quoted\\" 'string'" \\
  -H "x-foo: Bar"
      `.trim()
    )
  })

  test('POST - advanced json body', () => {
    const config = {}
    const http: Http = {
      method: 'POST',
      url: 'http://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        key1: 'value1',
        key2: 4325,
        key3: {
          key4: 'value4',
          key5: 'value5'
        },
        key6: {
          key7: {
            key8: 'value8'
          }
        },
        key7: ['value1', 'value2', 'value3'],
        empty: null
      }
    }

    const result = ShellCurl.generate(config, http)
    expect(result).toBe(
      `
curl -X POST "http://example.com" \\
  -H "Content-Type: application/json" \\
  -d $'{ \\
    "key1": "value1", \\
    "key2": 4325, \\
    "key3": { \\
      "key4": "value4", \\
      "key5": "value5" \\
    }, \\
    "key6": { \\
      "key7": { \\
        "key8": "value8" \\
      } \\
    }, \\
    "key7": [ \\
      "value1", \\
      "value2", \\
      "value3" \\
    ], \\
    "empty": null \\
  }'
      `.trim()
    )
  })
})
