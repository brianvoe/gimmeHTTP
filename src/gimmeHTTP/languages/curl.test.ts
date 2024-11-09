import Curl from './curl'
import { Http } from '../types'
import { describe, expect, test } from '@jest/globals'

describe('Curl.generate', () => {
  test('Basic GET', () => {
    const config = {}
    const http: Http = {
      method: 'GET',
      url: 'https://gofakeit.com'
    }
    const result = Curl.generate(config, http)
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
    const result = Curl.generate(config, http)
    expect(result).toBe(
      `
curl -X POST "https://gofakeit.com"
  -H "Content-Type: application/json"
  -H "Authorization: Bearer token"`.trim()
    )
  })

  test('POST - headers, data', () => {
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
    const result = Curl.generate(config, http)
    expect(result).toBe(
      `
curl -X POST "https://gofakeit.com"
  -H "Content-Type: application/json"
  -H "Authorization: Bearer token"
  -d '{"key1":"value1","key2":"value2"}'
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
    const result = Curl.generate(config, http)
    expect(result).toBe(
      `
curl -X POST "http://gofakeit.com"
  -b "foo=bar; bar=baz"
    `.trim()
    )
  })

  test('POST - headers, cookies, and data', () => {
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
    const result = Curl.generate(config, http)
    expect(result).toBe(
      `
curl -X POST "http://gofakeit.com?foo=bar&foo=baz&baz=abc&key=value"
  -H "accept: application/json"
  -H "content-type: application/x-www-form-urlencoded"
  -b "foo=bar; bar=baz"
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
    const result = Curl.generate(config, http)
    expect(result).toBe(
      `
curl -X GET "http://gofakeit.com"
  -H "accept: application/json"
  -H "quoted-value: \"quoted\" 'string'"
  -H "x-foo: Bar"
    `.trim()
    )
  })
})
