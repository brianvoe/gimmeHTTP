import TsKy from './ts.ky'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('TsKy.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = TsKy.generate(config, httpRequest)
    expect(result).toBe(`
import ky from "ky";

const data = await ky("https://example.com", {
  method: "get",
}).text();
console.log(data);
`.trim())
  })

  test('should build a POST request with headers', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer token"
      },
      "body": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = TsKy.generate(config, httpRequest)
    expect(result).toBe(`
import ky from "ky";

const data = await ky("https://example.com", {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
  json: {
    "key1": "value1"
  },
}).json();
console.log(data);
`.trim())
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "cookies": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = TsKy.generate(config, httpRequest)
    expect(result).toBe(`
import ky from "ky";

const data = await ky("https://example.com", {
  method: "post",
  headers: {
    "Cookie": "key1=value1",
  },
}).text();
console.log(data);
`.trim())
  })

  test('should build a POST request with body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "body": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = TsKy.generate(config, httpRequest)
    expect(result).toBe(`
import ky from "ky";

const data = await ky("https://example.com", {
  method: "post",
  json: {
    "key1": "value1"
  },
}).text();
console.log(data);
`.trim())
  })

  test('should build a POST request with advanced json body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "body": {
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
    }
    const config: Config = {}
    const result = TsKy.generate(config, httpRequest)
    expect(result).toBe(`
import ky from "ky";

const data = await ky("https://example.com", {
  method: "post",
  json: {
    "key1": "value1",
    "key2": {
      "key3": "value3"
    },
    "key4": [
      "value4",
      "value5"
    ],
    "empty": null
  },
}).text();
console.log(data);
`.trim())
  })

  test('should build a POST request with form-urlencoded body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "body": {
        "username": "user123",
        "email": "user@example.com"
      }
    }
    const config: Config = {}
    const result = TsKy.generate(config, httpRequest)
    expect(result).toBe(`
import ky from "ky";

const data = await ky("https://example.com", {
  method: "post",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    "username": "user123",
    "email": "user@example.com"
  }),
}).text();
console.log(data);
`.trim())
  })

  test('should build a POST request with text/plain body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "text/plain"
      },
      "body": "Simple plain text message"
    }
    const config: Config = {}
    const result = TsKy.generate(config, httpRequest)
    expect(result).toBe(`
import ky from "ky";

const data = await ky("https://example.com", {
  method: "post",
  headers: {
    "Content-Type": "text/plain",
  },
  body: "Simple plain text message",
}).text();
console.log(data);
`.trim())
  })

  test('should build a POST request with error handling', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "name": "test"
      }
    }
    const config: Config = {
      "handleErrors": true
    }
    const result = TsKy.generate(config, httpRequest)
    expect(result).toBe(`
import ky from "ky";

try {
  const data = await ky("https://example.com", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    json: {
      "name": "test"
    },
  }).json();
  console.log(data);
} catch (error: unknown) {
  console.error("There was an error:", error);
}
`.trim())
  })

  test('should build a GET request with URL parameters', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com",
      "params": {
        "address.zip": "66031",
        "address.country": "Wallis"
      }
    }
    const config: Config = {}
    const result = TsKy.generate(config, httpRequest)
    expect(result).toBe(`
import ky from "ky";

const data = await ky("https://example.com", {
  method: "get",
  searchParams: {
    "address.zip": "66031",
    "address.country": "Wallis"
  },
}).text();
console.log(data);
`.trim())
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com",
      "params": {
        "tags": [
          "alpha",
          "beta"
        ],
        "category": "backend"
      }
    }
    const config: Config = {}
    const result = TsKy.generate(config, httpRequest)
    expect(result).toBe(`
import ky from "ky";

const data = await ky("https://example.com", {
  method: "get",
  searchParams: {
    "tags": [
      "alpha",
      "beta"
    ],
    "category": "backend"
  },
}).text();
console.log(data);
`.trim())
  })

})
