import TsFetch from './ts.fetch'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('TsFetch.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = TsFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com", {
  method: "GET",
})
.then((response: Response) => response.text())
.then((data) => console.log(data));
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
    const result = TsFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
})
.then((response: Response) => response.json())
.then((data) => console.log(data));
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
    const result = TsFetch.generate(config, httpRequest)
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
.then((response: Response) => {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
})
.then((data) => console.log(data))
.catch((error: unknown) => console.error("There was a problem with the fetch operation:", error));
    `.trim()
    )
  })

  test('should use text() for XML content-type', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/api',
      headers: {
        Accept: 'application/xml'
      }
    }
    const config: Config = {}
    const result = TsFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com/api", {
  method: "GET",
  headers: {
    "Accept": "application/xml",
  },
})
.then((response: Response) => response.text())
.then((data) => console.log(data));
    `.trim()
    )
  })

  test('should use blob() for binary content-type', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/image.png',
      headers: {
        Accept: 'image/png'
      }
    }
    const config: Config = {}
    const result = TsFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com/image.png", {
  method: "GET",
  headers: {
    "Accept": "image/png",
  },
})
.then((response: Response) => response.blob())
.then((data) => console.log(data));
    `.trim()
    )
  })

  test('should use text() for plain text content-type', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/readme.txt',
      headers: {
        Accept: 'text/plain'
      }
    }
    const config: Config = {}
    const result = TsFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com/readme.txt", {
  method: "GET",
  headers: {
    "Accept": "text/plain",
  },
})
.then((response: Response) => response.text())
.then((data) => console.log(data));
    `.trim()
    )
  })

  test('should build a POST request with blob response type', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/image.png',
      headers: {
        Accept: 'image/png'
      }
    }
    const config: Config = {}
    const result = TsFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
fetch("https://example.com/image.png", {
  method: "GET",
  headers: {
    "Accept": "image/png",
  },
})
.then((response: Response) => response.blob())
.then((data) => console.log(data));
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
    const result = TsFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
const url = new URL("https://example.com");
url.searchParams.append("address.zip", "66031");
url.searchParams.append("address.country", "Wallis");

fetch(url.toString(), {
  method: "GET",
})
.then((response: Response) => response.text())
.then((data) => console.log(data));
    `.trim()
    )
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['javascript', 'fetch'],
        category: 'frontend'
      }
    }
    const config: Config = {}
    const result = TsFetch.generate(config, httpRequest)
    expect(result).toBe(
      `
const url = new URL("https://example.com");
url.searchParams.append("tags", "javascript");
url.searchParams.append("tags", "fetch");
url.searchParams.append("category", "frontend");

fetch(url.toString(), {
  method: "GET",
})
.then((response: Response) => response.text())
.then((data) => console.log(data));
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
    const result = TsFetch.generate(config, httpRequest)
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
.then((response: Response) => response.json())
.then((data) => console.log(data));
    `.trim()
    )
  })
})
