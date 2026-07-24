import JsAxios from './js.axios'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('JsAxios.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = JsAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
import axios from "axios";

axios({
  method: "get",
  url: "https://example.com",
})
.then(response => console.log(response.data));
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
    const result = JsAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
import axios from "axios";

axios({
  method: "post",
  url: "https://example.com",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
})
.then(response => console.log(response.data));
    `.trim()
    )
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      cookies: {
        key1: 'value1',
        key2: 'value2'
      }
    }
    const config: Config = {}
    const result = JsAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
import axios from "axios";

axios({
  method: "post",
  url: "https://example.com",
  headers: {
    "Cookie": "key1=value1; key2=value2",
  },
})
.then(response => console.log(response.data));
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
    const result = JsAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
import axios from "axios";

axios({
  method: "post",
  url: "https://example.com",
  headers: {
    "Content-Type": "application/json",
  },
  data: {
    "key1": "value1"
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error("There was an error:", error);
});
    `.trim()
    )
  })

  test('should handle XML content-type (axios auto-parses)', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/api',
      headers: {
        Accept: 'application/xml'
      }
    }
    const config: Config = {}
    const result = JsAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
import axios from "axios";

axios({
  method: "get",
  url: "https://example.com/api",
  headers: {
    "Accept": "application/xml",
  },
})
.then(response => console.log(response.data));
    `.trim()
    )
  })

  test('should handle text content-type (axios auto-parses)', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/readme.txt',
      headers: {
        Accept: 'text/plain'
      }
    }
    const config: Config = {}
    const result = JsAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
import axios from "axios";

axios({
  method: "get",
  url: "https://example.com/readme.txt",
  headers: {
    "Accept": "text/plain",
  },
})
.then(response => console.log(response.data));
    `.trim()
    )
  })

  test('should handle blob/binary content-type (axios auto-handles)', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/file.pdf',
      headers: {
        Accept: 'application/pdf'
      }
    }
    const config: Config = {}
    const result = JsAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
import axios from "axios";

axios({
  method: "get",
  url: "https://example.com/file.pdf",
  headers: {
    "Accept": "application/pdf",
  },
})
.then(response => console.log(response.data));
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
    const result = JsAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
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
    `.trim()
    )
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['javascript', 'axios'],
        category: 'frontend'
      }
    }
    const config: Config = {}
    const result = JsAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
import axios from "axios";

axios({
  method: "get",
  url: "https://example.com",
  params: {
    "tags": ["javascript", "axios"],
    "category": "frontend",
  },
})
.then(response => console.log(response.data));
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
    const result = JsAxios.generate(config, httpRequest)
    expect(result).toBe(
      `
import axios from "axios";

axios({
  method: "post",
  url: "https://example.com",
  params: {
    "version": "1.0",
  },
  headers: {
    "Content-Type": "application/json",
  },
  data: {
    "name": "John"
  }
})
.then(response => console.log(response.data));
    `.trim()
    )
  })
})
