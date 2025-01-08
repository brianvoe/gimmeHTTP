import NodeFetch from './node.fetch'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from '@jest/globals'

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
.then(response => response.text())
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
  return response.text();
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
.then(response => response.text())
.then(data => console.log(data))
    `.trim()
    )
  })
})
