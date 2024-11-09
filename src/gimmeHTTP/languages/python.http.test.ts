import PythonHttpClient from './python.http'
import { Config, Http } from '../types'
import { describe, expect, test } from '@jest/globals'

describe('PythonHttpClient.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://gofakeit.com/api'
    }
    const config: Config = {}
    const result = PythonHttpClient.generate(config, httpRequest)
    expect(result).toBe(
      `
import http.client
import json

conn = http.client.HTTPSConnection("gofakeit.com", 443)

conn.request("GET", "/api")
res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
    `.trim()
    )
  })

  test('should build a POST request with headers', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://gofakeit.com/api',
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

conn = http.client.HTTPSConnection("gofakeit.com", 443)

headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer token",
}

conn.request("POST", "/api", headers)
res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
    `.trim()
    )
  })

  test('should build a POST request with body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://gofakeit.com/api',
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

conn = http.client.HTTPSConnection("gofakeit.com", 443)

payload = json.dumps({"key1":"value1"})

conn.request("POST", "/api", payload)
res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
    `.trim()
    )
  })

  test('should build a POST request with headers and cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://gofakeit.com/api',
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

conn = http.client.HTTPSConnection("gofakeit.com", 443)

headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer token",
}

cookies = {
  "session": "1234",
}

conn.request("POST", "/api", headers, cookies)
res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
    `.trim()
    )
  })
})
