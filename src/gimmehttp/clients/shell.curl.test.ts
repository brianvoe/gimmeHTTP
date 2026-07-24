import ShellCurl from './shell.curl'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('ShellCurl.generate', () => {
  test('GET - simple', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com"
    `.trim()
    )
  })

  test('GET - with URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        'address.zip': '66031',
        'address.country': 'Wallis'
      }
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com/?address.zip=66031&address.country=Wallis"
    `.trim()
    )
  })

  test('GET - with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['javascript', 'typescript'],
        category: 'programming'
      }
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com/?tags=javascript&tags=typescript&category=programming"
    `.trim()
    )
  })

  test('GET - with URL parameters containing quotes', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        search: 'hello "world"',
        filter: 'test'
      }
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com/?search=hello+%22world%22&filter=test"
    `.trim()
    )
  })

  test('GET - no trailing slash with no headers, no cookies, no body', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'http://example.com'
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "http://example.com"
    `.trim()
    )
  })

  test('POST - headers', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      }
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com" \\
  --request POST \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token"
    `.trim()
    )
  })

  test('POST - headers, data (JSON)', () => {
    const httpRequest: Http = {
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
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token" \\
  -d '{
  "key1": "value1",
  "key2": "value2"
}'
    `.trim()
    )
  })

  test('POST - cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'http://example.com',
      cookies: {
        foo: 'bar',
        bar: 'baz'
      }
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "http://example.com" \\
  --request POST \\
  -b "foo=bar; bar=baz"
    `.trim()
    )
  })

  test('POST - headers, cookies, and form-data', () => {
    const httpRequest: Http = {
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
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "http://example.com?foo=bar&foo=baz&baz=abc&key=value" \\
  -H "accept: application/json" \\
  -H "content-type: application/x-www-form-urlencoded" \\
  -b "foo=bar; bar=baz" \\
  -d 'foo=bar'
    `.trim()
    )
  })

  test('GET - complex headers', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'http://example.com',
      headers: {
        accept: 'application/json',
        'quoted-value': '"quoted" \'string\'',
        'x-foo': 'Bar'
      }
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "http://example.com" \\
  -H "accept: application/json" \\
  -H "quoted-value: \\"quoted\\" 'string'" \\
  -H "x-foo: Bar"
    `.trim()
    )
  })

  test('POST - advanced json body', () => {
    const httpRequest: Http = {
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
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "http://example.com" \\
  -H "Content-Type: application/json" \\
  -d '{
  "key1": "value1",
  "key2": 4325,
  "key3": {
    "key4": "value4",
    "key5": "value5"
  },
  "key6": {
    "key7": {
      "key8": "value8"
    }
  },
  "key7": [
    "value1",
    "value2",
    "value3"
  ],
  "empty": null
}'
    `.trim()
    )
  })

  test('GET - empty object body should not include -d flag', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'http://localhost:8869/funcs/countryabr',
      body: {}
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "http://localhost:8869/funcs/countryabr"
    `.trim()
    )
  })

  test('POST - empty object body should not include -d flag', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com" \\
  --request POST \\
  -H "Content-Type: application/json"
    `.trim()
    )
  })

  test('POST - empty string body should not include -d flag', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: ''
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com" \\
  --request POST \\
  -H "Content-Type: text/plain"
    `.trim()
    )
  })

  test('should build a POST request with XML body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: '<root><item>value</item></root>'
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com" \\
  -H "Content-Type: application/xml" \\
  -d '<root><item>value</item></root>'
    `.trim()
    )
  })

  test('places encoded query parameters in the URL', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com/api?existing=yes',
      params: {
        search: 'hello world',
        tag: ['one', 'two']
      },
      body: 'payload'
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com/api?existing=yes&search=hello+world&tag=one&tag=two" \\
  -d 'payload'
    `.trim()
    )
  })

  test('pretty-prints JSON bodies across multiple lines', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        quote: "it's valid",
        nested: {
          value: true
        }
      }
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com" \\
  -H "Content-Type: application/json" \\
  -d '{
  "quote": "it'\\''s valid",
  "nested": {
    "value": true
  }
}'
    `.trim()
    )
  })

  test('emits form fields on separate lines', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        username: 'testuser',
        password: 'secret'
      }
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d 'username=testuser' \\
  -d 'password=secret'
    `.trim()
    )
  })

  test('uses only necessary method flags', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com"
    `.trim()
    )
  })

  test('escapes URL, headers, and cookie strings', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com/"quoted"',
      headers: {
        'X-Name': 'a"b'
      },
      cookies: {
        session: 'a"b'
      }
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com/\\"quoted\\"" \\
  --request POST \\
  -H "X-Name: a\\"b" \\
  -b "session=a\\"b"
    `.trim()
    )
  })

  test('omits -X for POST and includes it for other methods', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: 'payload'
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com" \\
  -d 'payload'
    `.trim()
    )
  })

  test('includes -X for PATCH', () => {
    const httpRequest: Http = {
      method: 'PATCH',
      url: 'https://example.com',
      body: 'payload'
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com" \\
  --request PATCH \\
  -d 'payload'
    `.trim()
    )
  })

  test('escapes URL, headers, and cookies', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/"quoted"',
      headers: {
        'X-Name': 'a"b'
      },
      cookies: {
        session: 'a"b'
      }
    }
    const config: Config = {}
    const result = ShellCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
curl "https://example.com/\\"quoted\\"" \\
  -H "X-Name: a\\"b" \\
  -b "session=a\\"b"
    `.trim()
    )
  })
})
