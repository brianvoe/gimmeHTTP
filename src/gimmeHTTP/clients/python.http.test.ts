import PythonHttpClient from './python.http'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from '@jest/globals'

describe('PythonHttpClient.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = PythonHttpClient.generate(config, httpRequest)
    expect(result).toBe(
      `
import http.client
import json

conn = http.client.HTTPSConnection("example.com", 443)

conn.request("GET", "/")
res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
    `.trim()
    )
  })

  test('should build a POST request with headers', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      }
    }
    const config: Config = {}
    const result = PythonHttpClient.generate(config, httpRequest)
    expect(result).toBe(
      `
import http.client
import json

conn = http.client.HTTPSConnection("example.com", 443)

headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer token",
}

conn.request("POST", "/", headers)
res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
    `.trim()
    )
  })

  test('should build a POST request with body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = PythonHttpClient.generate(config, httpRequest)
    expect(result).toBe(
      `
import http.client
import json

conn = http.client.HTTPSConnection("example.com", 443)

payload = {
  "key1": "value1"
}

conn.request("POST", "/", payload)
res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
    `.trim()
    )
  })

  test('should build a POST request with headers and cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      },
      cookies: {
        session: '1234'
      }
    }
    const config: Config = {}
    const result = PythonHttpClient.generate(config, httpRequest)
    expect(result).toBe(
      `
import http.client
import json

conn = http.client.HTTPSConnection("example.com", 443)

headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer token",
}

cookies = {
  "session": "1234",
}

conn.request("POST", "/", headers, cookies)
res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
    `.trim()
    )
  })

  test('should build a POST request with advanced json body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        key1: 'value1',
        key2: {
          key3: 'value3'
        },
        key4: ['value4', 'value5'],
        empty: null
      }
    }
    const config: Config = {}
    const result = PythonHttpClient.generate(config, httpRequest)
    expect(result).toBe(
      `
import http.client
import json

conn = http.client.HTTPSConnection("example.com", 443)

payload = {
  "key1": "value1",
  "key2": {
    "key3": "value3"
  },
  "key4": [
    "value4",
    "value5"
  ],
  "empty": null
}

conn.request("POST", "/", payload)
res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
    `.trim()
    )
  })
})
