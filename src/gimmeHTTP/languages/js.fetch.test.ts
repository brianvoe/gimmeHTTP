import JSFetch from './js.fetch'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from '@jest/globals'

describe('JSFetch.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://gofakeit.com/api'
    }
    const config: Config = {}
    const result = JSFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://gofakeit.com/api", {
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
      url: 'https://gofakeit.com/api',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      }
    }
    const config: Config = {}
    const result = JSFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://gofakeit.com/api", {
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
      url: 'https://gofakeit.com/api',
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
fetch("https://gofakeit.com/api", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({"key1":"value1"}),
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
})
