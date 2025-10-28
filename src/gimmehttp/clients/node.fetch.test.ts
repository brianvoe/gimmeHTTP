import NodeFetch from './node.fetch'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

describe('NodeFetch.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
const fetch = require("node-fetch");

fetch("https://example.com", {
  method: "GET",
})
.then(response => response.text())
.then(data => console.log(data))
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
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
const fetch = require("node-fetch");

fetch("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
})
.then(response => response.json())
.then(data => console.log(data))
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
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
const fetch = require("node-fetch");

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
    throw new Error("response not ok");
  }
  return response.json();
})
.then(data => console.log(data))
.catch(error => console.error("error:", error));
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
        key2: ['value2', 'value3'],
        key3: { key4: 'value4' },
        empty: null
      }
    }
    const config: Config = {}
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
const fetch = require("node-fetch");

fetch("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    "key1": "value1",
    "key2": [
      "value2",
      "value3"
    ],
    "key3": {
      "key4": "value4"
    },
    "empty": null
  }
})
.then(response => response.json())
.then(data => console.log(data))
    `.trim()
    )
  })

  test('should build a GET request with XML accept header', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/api',
      headers: {
        Accept: 'application/xml'
      }
    }
    const config: Config = {}
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
const fetch = require("node-fetch");

fetch("https://example.com/api", {
  method: "GET",
  headers: {
    "Accept": "application/xml",
  },
})
.then(response => response.text())
.then(data => console.log(data))
    `.trim()
    )
  })

  test('should build a POST request with form-urlencoded (not supported by fetch, would use URLSearchParams)', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: { username: 'test', password: 'pass' }
    }
    const config: Config = {}
    const result = NodeFetch.generate(config, httpRequest)
    // Note: fetch doesn't auto-encode form data, would need URLSearchParams in real code
    expect(result).toContain('method: "POST"')
    expect(result).toContain('application/x-www-form-urlencoded')
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
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
const fetch = require("node-fetch");

const url = new URL("https://example.com");
const params = new URLSearchParams();
params.set("address.zip", "66031");
params.set("address.country", "Wallis");
url.search = params.toString();

fetch(url.toString(), {
  method: "GET",
})
.then(response => response.text())
.then(data => console.log(data))
    `.trim()
    )
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['node', 'fetch'],
        category: 'backend'
      }
    }
    const config: Config = {}
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toContain('params.append("tags", "node");')
    expect(result).toContain('params.append("tags", "fetch");')
    expect(result).toContain('params.set("category", "backend");')
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
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toContain('params.set("version", "1.0");')
    expect(result).toContain('"name": "John"')
  })
})
