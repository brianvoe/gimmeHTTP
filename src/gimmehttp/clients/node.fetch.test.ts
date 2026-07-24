import NodeFetch from './node.fetch'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

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
    const config: Config = {
      handleErrors: true
    }
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    "key1": "value1"
  }),
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
      body: {
        username: 'test',
        password: 'pass'
      }
    }
    const config: Config = {}
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    "username": "test",
    "password": "pass"
  }),
})
.then(response => response.text())
.then(data => console.log(data))
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
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
const url = new URL("https://example.com");
url.searchParams.append("address.zip", "66031");
url.searchParams.append("address.country", "Wallis");

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
    expect(result).toBe(
      `
const url = new URL("https://example.com");
url.searchParams.append("tags", "node");
url.searchParams.append("tags", "fetch");
url.searchParams.append("category", "backend");

fetch(url.toString(), {
  method: "GET",
})
.then(response => response.text())
.then(data => console.log(data))
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
    const result = NodeFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
const url = new URL("https://example.com");
url.searchParams.append("version", "1.0");

fetch(url.toString(), {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    "name": "John"
  }),
})
.then(response => response.json())
.then(data => console.log(data))
    `.trim()
    )
  })
})
