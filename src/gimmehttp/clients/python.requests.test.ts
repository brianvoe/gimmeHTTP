import PythonRequests from './python.requests'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

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
  "Authorization": "Bearer token"
}

json_data = {
  "key1": "value1"
}

response = requests.post(url, headers=headers, json=json_data)
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
  "key1": "value1"
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

json_data = {
  "key1": "value1"
}

response = requests.post(url, json=json_data)
print(response.text)
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
    const result = PythonRequests.generate(config, httpRequest)
    expect(result).toBe(
      `
import requests

url = "https://example.com"

json_data = {
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

response = requests.post(url, json=json_data)
print(response.text)
    `.trim()
    )
  })

  test('should build a POST request with form-urlencoded body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        username: 'user123',
        email: 'user@example.com'
      }
    }
    const config: Config = {}
    const result = PythonRequests.generate(config, httpRequest)
    expect(result).toBe(
      `
import requests

url = "https://example.com"

headers = {
  "Content-Type": "application/x-www-form-urlencoded"
}

form_data = {
  "username": "user123",
  "email": "user@example.com"
}

response = requests.post(url, headers=headers, data=form_data)
print(response.text)
    `.trim()
    )
  })

  test('should build a POST request with text/plain body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Simple plain text message'
    }
    const config: Config = {}
    const result = PythonRequests.generate(config, httpRequest)
    expect(result).toBe(
      `
import requests

url = "https://example.com"

headers = {
  "Content-Type": "text/plain"
}

json_data = "Simple plain text message"

response = requests.post(url, headers=headers, json=json_data)
print(response.text)
    `.trim()
    )
  })

  test('should build a POST request with error handling', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: 'test'
      }
    }
    const config: Config = { handleErrors: true }
    const result = PythonRequests.generate(config, httpRequest)
    expect(result).toBe(
      `
import requests

try:
  url = "https://example.com"

  headers = {
    "Content-Type": "application/json"
  }

  json_data = {
    "name": "test"
  }

  response = requests.post(url, headers=headers, json=json_data)
  print(response.text)
except requests.exceptions.RequestException as e:
  print(f"Error: {e}")
    `.trim()
    )
  })
})
