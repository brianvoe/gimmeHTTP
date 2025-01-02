import PythonRequests from './python.requests'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from '@jest/globals'

describe('PythonRequests.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = PythonRequests.generate(config, httpRequest)
    expect(result).toBe(
      `
import requests

url = "https://example.com"

response = requests.get(url)
print(response.text)
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

url = "https://example.com"
headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer token",
}
data = {
  "key1": "value1"
}

response = requests.post(url, headers=headers, data=data)
print(response.text)
    `.trim()
    )
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      cookies: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = PythonRequests.generate(config, httpRequest)
    expect(result).toBe(
      `
import requests

url = "https://example.com"
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
      url: 'https://example.com',
      body: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = PythonRequests.generate(config, httpRequest)
    expect(result).toBe(
      `
import requests

url = "https://example.com"
data = {
  "key1": "value1"
}

response = requests.post(url, data=data)
print(response.text)
    `.trim()
    )
  })
})
