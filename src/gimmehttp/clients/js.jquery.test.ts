import JSJQuery from './js.jquery'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

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

  test('should handle XML content-type (jQuery auto-parses)', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/api',
      headers: {
        Accept: 'application/xml'
      }
    }
    const config: Config = {}
    const result = JSJQuery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com/api",
  type: "GET",
  headers: {
    "Accept": "application/xml",
  },
  success: function(data) {
    console.log(data);
  },
});
    `.trim()
    )
  })

  test('should handle text content-type (jQuery auto-parses)', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/readme.txt',
      headers: {
        Accept: 'text/plain'
      }
    }
    const config: Config = {}
    const result = JSJQuery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com/readme.txt",
  type: "GET",
  headers: {
    "Accept": "text/plain",
  },
  success: function(data) {
    console.log(data);
  },
});
    `.trim()
    )
  })

  test('should handle blob/binary content-type (jQuery auto-handles)', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/image.jpg',
      headers: {
        Accept: 'image/jpeg'
      }
    }
    const config: Config = {}
    const result = JSJQuery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com/image.jpg",
  type: "GET",
  headers: {
    "Accept": "image/jpeg",
  },
  success: function(data) {
    console.log(data);
  },
});
    `.trim()
    )
  })

  test('should build a GET request with URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        'address.zip': '66031',
        'address.country': 'Wallis'
      }
    }
    const config: Config = {}
    const result = JSJQuery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com",
  type: "GET",
  data: {
    "address.zip": "66031",
    "address.country": "Wallis",
  },
  success: function(data) {
    console.log(data);
  },
});
    `.trim()
    )
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['javascript', 'jquery'],
        category: 'frontend'
      }
    }
    const config: Config = {}
    const result = JSJQuery.generate(config, httpRequest)
    expect(result).toContain('"tags": ["javascript", "jquery"],')
    expect(result).toContain('"category": "frontend",')
  })

  test('should build a POST request with URL parameters and body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      params: {
        version: '1.0'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: 'John'
      }
    }
    const config: Config = {}
    const result = JSJQuery.generate(config, httpRequest)
    expect(result).toContain('"version": "1.0",')
    expect(result).toContain('"name": "John"')
  })
})
