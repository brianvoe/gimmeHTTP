import NodeAxios from './node.axios'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('NodeAxios.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = NodeAxios.generate(config, httpRequest)
    expect(result).toBe(`
import axios from "axios";

axios({
  method: "get",
  url: "https://example.com",
})
.then(response => console.log(response.data));
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
    const result = NodeAxios.generate(config, httpRequest)
    expect(result).toBe(`
import axios from "axios";

axios({
  method: "post",
  url: "https://example.com",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
  data: {
    "key1": "value1"
  }
})
.then(response => console.log(response.data));
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
    const result = NodeAxios.generate(config, httpRequest)
    expect(result).toBe(`
import axios from "axios";

axios({
  method: "post",
  url: "https://example.com",
  headers: {
    "Cookie": "key1=value1",
  },
})
.then(response => console.log(response.data));
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
    const result = NodeAxios.generate(config, httpRequest)
    expect(result).toBe(`
import axios from "axios";

axios({
  method: "post",
  url: "https://example.com",
  data: {
    "key1": "value1"
  }
})
.then(response => console.log(response.data));
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
    const result = NodeAxios.generate(config, httpRequest)
    expect(result).toBe(`
import axios from "axios";

axios({
  method: "post",
  url: "https://example.com",
  data: {
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
})
.then(response => console.log(response.data));
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
    const result = NodeAxios.generate(config, httpRequest)
    expect(result).toBe(`
import axios from "axios";

axios({
  method: "post",
  url: "https://example.com",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: {
    "username": "user123",
    "email": "user@example.com"
  }
})
.then(response => console.log(response.data));
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
    const result = NodeAxios.generate(config, httpRequest)
    expect(result).toBe(`
import axios from "axios";

axios({
  method: "post",
  url: "https://example.com",
  headers: {
    "Content-Type": "text/plain",
  },
  data: "Simple plain text message"
})
.then(response => console.log(response.data));
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
    const result = NodeAxios.generate(config, httpRequest)
    expect(result).toBe(`
import axios from "axios";

axios({
  method: "post",
  url: "https://example.com",
  headers: {
    "Content-Type": "application/json",
  },
  data: {
    "name": "test"
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error("There was an error:", error);
});
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
    const result = NodeAxios.generate(config, httpRequest)
    expect(result).toBe(`
import axios from "axios";

axios({
  method: "get",
  url: "https://example.com",
  params: {
    "address.zip": "66031",
    "address.country": "Wallis",
  },
})
.then(response => console.log(response.data));
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
    const result = NodeAxios.generate(config, httpRequest)
    expect(result).toBe(`
import axios from "axios";

axios({
  method: "get",
  url: "https://example.com",
  params: {
    "tags": ["alpha", "beta"],
    "category": "backend",
  },
})
.then(response => console.log(response.data));
`.trim())
  })

})
