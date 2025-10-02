import JSFetch from './js.fetch'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

describe('JSFetch.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = JSFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com", {
  method: "GET",
})
.then(response => response.text())
.then(data => console.log(data));
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
    const result = JSFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
})
.then(response => response.text())
.then(data => console.log(data));
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
    const result = JSFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    "key1": "value1"
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.text();
})
.then(data => console.log(data))
.catch(error => console.error("There was a problem with the fetch operation:", error));
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
        key2: { nestedKey: 'nestedValue' },
        key3: ['value1', 'value2'],
        empty: null
      }
    }
    const config: Config = {}
    const result = JSFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
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
.then(response => response.text())
.then(data => console.log(data));
    `.trim()
    )
  })
})
