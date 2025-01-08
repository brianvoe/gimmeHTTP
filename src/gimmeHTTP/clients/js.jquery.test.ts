import JSJQuery from './js.jquery'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from '@jest/globals'

describe('JSJQuery.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = JSJQuery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com",
  type: "GET",
  success: function(data) {
    console.log(data);
  },
});
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
    const result = JSJQuery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com",
  type: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
  success: function(data) {
    console.log(data);
  },
});
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
    const result = JSJQuery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com",
  type: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  data: {
    "key1": "value1"
  },
  contentType: "application/json",
  success: function(data) {
    console.log(data);
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.error("Request failed:", textStatus, errorThrown);
  },
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
    const result = JSJQuery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com",
  type: "POST",
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
  },
  contentType: "application/json",
  success: function(data) {
    console.log(data);
  },
});
    `.trim()
    )
  })
})
