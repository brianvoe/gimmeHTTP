import NodeGot from './node.got'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('NodeGot.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = NodeGot.generate(config, httpRequest)
    expect(result).toBe(`
import got from "got";

const response = await got("https://example.com", {
  method: "GET",
});
console.log(response.body);
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
    const result = NodeGot.generate(config, httpRequest)
    expect(result).toBe(`
import got from "got";

const response = await got("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
  json: {
    "key1": "value1"
  },
});
console.log(response.body);
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
    const result = NodeGot.generate(config, httpRequest)
    expect(result).toBe(`
import got from "got";

const response = await got("https://example.com", {
  method: "POST",
  headers: {
    "Cookie": "key1=value1",
  },
});
console.log(response.body);
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
    const result = NodeGot.generate(config, httpRequest)
    expect(result).toBe(`
import got from "got";

const response = await got("https://example.com", {
  method: "POST",
  json: {
    "key1": "value1"
  },
});
console.log(response.body);
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
    const result = NodeGot.generate(config, httpRequest)
    expect(result).toBe(`
import got from "got";

const response = await got("https://example.com", {
  method: "POST",
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
});
console.log(response.body);
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
    const result = NodeGot.generate(config, httpRequest)
    expect(result).toBe(`
import got from "got";

const response = await got("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  form: {
    "username": "user123",
    "email": "user@example.com"
  },
});
console.log(response.body);
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
    const result = NodeGot.generate(config, httpRequest)
    expect(result).toBe(`
import got from "got";

const response = await got("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "text/plain",
  },
  body: "Simple plain text message",
});
console.log(response.body);
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
    const result = NodeGot.generate(config, httpRequest)
    expect(result).toBe(`
import got from "got";

try {
  const response = await got("https://example.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    json: {
      "name": "test"
    },
  });
  console.log(response.body);
} catch (error) {
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
    const result = NodeGot.generate(config, httpRequest)
    expect(result).toBe(`
import got from "got";

const response = await got("https://example.com", {
  method: "GET",
  searchParams: {
    "address.zip": "66031",
    "address.country": "Wallis"
  },
});
console.log(response.body);
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
    const result = NodeGot.generate(config, httpRequest)
    expect(result).toBe(`
import got from "got";

const response = await got("https://example.com", {
  method: "GET",
  searchParams: {
    "tags": [
      "alpha",
      "beta"
    ],
    "category": "backend"
  },
});
console.log(response.body);
`.trim())
  })

})
