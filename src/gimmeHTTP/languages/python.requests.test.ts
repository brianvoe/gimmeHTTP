import PythonRequests from './python.requests'
import { Config, Http } from '../types'
import { describe, test, expect } from '@jest/globals'

describe('PythonRequests.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://gofakeit.com/api'
    }
    const config: Config = {}
    const result = PythonRequests.generate(config, httpRequest)
    expect(result).toBe(
      `
import requests

url = "https://gofakeit.com/api"

response = requests.get(url)
print(response.text)
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
      },
      body: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = PythonRequests.generate(config, httpRequest)
    expect(result).toBe(
      `
import requests

url = "https://gofakeit.com/api"
headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer token",
}
data = {"key1":"value1"}

response = requests.post(url, headers=headers, data=data)
print(response.text)
    `.trim()
    )
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://gofakeit.com/api',
      cookies: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = PythonRequests.generate(config, httpRequest)
    expect(result).toBe(
      `
import requests

url = "https://gofakeit.com/api"
cookies = {
  "key1": "value1",
}

response = requests.post(url, cookies=cookies)
print(response.text)
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
    const result = PythonRequests.generate(config, httpRequest)
    expect(result).toBe(
      `
import requests

url = "https://gofakeit.com/api"
data = {"key1":"value1"}

response = requests.post(url, data=data)
print(response.text)
    `.trim()
    )
  })
})