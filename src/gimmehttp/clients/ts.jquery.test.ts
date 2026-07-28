import TsJquery from './ts.jquery'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('TsJquery.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = TsJquery.generate(config, httpRequest)
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
    const result = TsJquery.generate(config, httpRequest)
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
    const config: Config = {
      handleErrors: true
    }
    const result = TsJquery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com",
  type: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  data: JSON.stringify({
    "key1": "value1"
  }),
  contentType: "application/json",
  processData: false,
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

  test('should handle XML content-type (jQuery auto-parses)', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/api',
      headers: {
        Accept: 'application/xml'
      }
    }
    const config: Config = {}
    const result = TsJquery.generate(config, httpRequest)
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
    const result = TsJquery.generate(config, httpRequest)
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
    const result = TsJquery.generate(config, httpRequest)
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
    const result = TsJquery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com/?address.zip=66031&address.country=Wallis",
  type: "GET",
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
    const result = TsJquery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com/?tags=javascript&tags=jquery&category=frontend",
  type: "GET",
  success: function(data) {
    console.log(data);
  },
});
    `.trim()
    )
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
    const result = TsJquery.generate(config, httpRequest)
    expect(result).toBe(
      `
$.ajax({
  url: "https://example.com/?version=1.0",
  type: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  data: JSON.stringify({
    "name": "John"
  }),
  contentType: "application/json",
  processData: false,
  success: function(data) {
    console.log(data);
  },
});
    `.trim()
    )
  })
})
