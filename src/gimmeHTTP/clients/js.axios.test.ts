import JSAxios from './js.axios'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from '@jest/globals'

describe('JSAxios.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = JSAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
axios({
  method: "get",
  url: "https://example.com",
})
.then(response => console.log(response.data));
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
    const result = JSAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
axios({
  method: "post",
  url: "https://example.com",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
})
.then(response => console.log(response.data));
    `.trim()
    )
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      cookies: {
        key1: 'value1',
        key2: 'value2'
      }
    }
    const config: Config = {}
    const result = JSAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
axios({
  method: "post",
  url: "https://example.com",
  cookies: {
    "key1": "value1",
    "key2": "value2",
  },
})
.then(response => console.log(response.data));
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
        key1: 'value1'
      }
    }
    const config: Config = { handleErrors: true }
    const result = JSAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
axios({
  method: "post",
  url: "https://example.com",
  headers: {
    "Content-Type": "application/json",
  },
  data: {
    "key1": "value1"
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error("There was an error:", error);
});
    `.trim()
    )
  })

  test('should build a POST request with advanced json body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        key1: 'value1',
        key2: {
          nestedKey: 'nestedValue'
        },
        key3: ['value1', 'value2'],
        empty: null
      }
    }
    const config: Config = {}
    const result = JSAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
axios({
  method: "post",
  url: "https://example.com",
  headers: {
    "Content-Type": "application/json",
  },
  data: {
    "key1": "value1",
    "key2": {
      "nestedKey": "nestedValue"
    },
    "key3": [
      "value1",
      "value2"
    ],
    "empty": null
  }
})
.then(response => console.log(response.data));
    `.trim()
    )
  })
})
