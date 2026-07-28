import PythonAiohttp from './python.aiohttp'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('PythonAiohttp.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = PythonAiohttp.generate(config, httpRequest)
    expect(result).toBe(`
import aiohttp
import asyncio

async def main():
  url = "https://example.com"

  async with aiohttp.ClientSession() as session:
    async with session.get(url) as response:
      print(await response.text())

asyncio.run(main())
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
    const result = PythonAiohttp.generate(config, httpRequest)
    expect(result).toBe(`
import aiohttp
import asyncio

async def main():
  url = "https://example.com"

  headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer token"
  }

  json_data = {
    "key1": "value1"
  }

  async with aiohttp.ClientSession() as session:
    async with session.post(url, headers=headers, json=json_data) as response:
      print(await response.text())

asyncio.run(main())
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
    const result = PythonAiohttp.generate(config, httpRequest)
    expect(result).toBe(`
import aiohttp
import asyncio

async def main():
  url = "https://example.com"

  cookies = {
    "key1": "value1"
  }

  async with aiohttp.ClientSession() as session:
    async with session.post(url, cookies=cookies) as response:
      print(await response.text())

asyncio.run(main())
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
    const result = PythonAiohttp.generate(config, httpRequest)
    expect(result).toBe(`
import aiohttp
import asyncio

async def main():
  url = "https://example.com"

  json_data = {
    "key1": "value1"
  }

  async with aiohttp.ClientSession() as session:
    async with session.post(url, json=json_data) as response:
      print(await response.text())

asyncio.run(main())
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
    const result = PythonAiohttp.generate(config, httpRequest)
    expect(result).toBe(`
import aiohttp
import asyncio

async def main():
  url = "https://example.com"

  json_data = {
    "key1": "value1",
    "key2": {
      "key3": "value3"
    },
    "key4": [
      "value4",
      "value5"
    ],
    "empty": None
  }

  async with aiohttp.ClientSession() as session:
    async with session.post(url, json=json_data) as response:
      print(await response.text())

asyncio.run(main())
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
    const result = PythonAiohttp.generate(config, httpRequest)
    expect(result).toBe(`
import aiohttp
import asyncio

async def main():
  url = "https://example.com"

  headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  }

  form_data = {
    "username": "user123",
    "email": "user@example.com"
  }

  async with aiohttp.ClientSession() as session:
    async with session.post(url, headers=headers, data=form_data) as response:
      print(await response.text())

asyncio.run(main())
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
    const result = PythonAiohttp.generate(config, httpRequest)
    expect(result).toBe(`
import aiohttp
import asyncio

async def main():
  url = "https://example.com"

  headers = {
    "Content-Type": "text/plain"
  }


  async with aiohttp.ClientSession() as session:
    async with session.post(url, headers=headers, data="Simple plain text message") as response:
      print(await response.text())

asyncio.run(main())
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
    const result = PythonAiohttp.generate(config, httpRequest)
    expect(result).toBe(`
import aiohttp
import asyncio

async def main():
  try:
    url = "https://example.com"

    headers = {
      "Content-Type": "application/json"
    }

    json_data = {
      "name": "test"
    }

    async with aiohttp.ClientSession() as session:
      async with session.post(url, headers=headers, json=json_data) as response:
        response.raise_for_status()
        print(await response.text())
  except aiohttp.ClientError as e:
    print(f"Error: {e}")

asyncio.run(main())
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
    const result = PythonAiohttp.generate(config, httpRequest)
    expect(result).toBe(`
import aiohttp
import asyncio

async def main():
  url = "https://example.com"

  url_params = {
    "address.zip": "66031",
    "address.country": "Wallis"
  }

  async with aiohttp.ClientSession() as session:
    async with session.get(url, params=url_params) as response:
      print(await response.text())

asyncio.run(main())
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
    const result = PythonAiohttp.generate(config, httpRequest)
    expect(result).toBe(`
import aiohttp
import asyncio

async def main():
  url = "https://example.com"

  url_params = {
    "tags": [
      "alpha",
      "beta"
    ],
    "category": "backend"
  }

  async with aiohttp.ClientSession() as session:
    async with session.get(url, params=url_params) as response:
      print(await response.text())

asyncio.run(main())
`.trim())
  })

})
