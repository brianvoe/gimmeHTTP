import ShellWget from './shell.wget'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('ShellWget.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = ShellWget.generate(config, httpRequest)
    expect(result).toBe("wget --method=GET \\\n  -O - \\\n  'https://example.com'")
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
    const result = ShellWget.generate(config, httpRequest)
    expect(result).toBe("wget --method=POST \\\n  --header='Content-Type: application/json' \\\n  --header='Authorization: Bearer token' \\\n  --body-data='{\n  \"key1\": \"value1\"\n}' \\\n  -O - \\\n  'https://example.com'")
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
    const result = ShellWget.generate(config, httpRequest)
    expect(result).toBe("wget --method=POST \\\n  --header='Cookie: key1=value1' \\\n  -O - \\\n  'https://example.com'")
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
    const result = ShellWget.generate(config, httpRequest)
    expect(result).toBe("wget --method=POST \\\n  --body-data='{\n  \"key1\": \"value1\"\n}' \\\n  -O - \\\n  'https://example.com'")
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
    const result = ShellWget.generate(config, httpRequest)
    expect(result).toBe("wget --method=POST \\\n  --body-data='{\n  \"key1\": \"value1\",\n  \"key2\": {\n    \"key3\": \"value3\"\n  },\n  \"key4\": [\n    \"value4\",\n    \"value5\"\n  ],\n  \"empty\": null\n}' \\\n  -O - \\\n  'https://example.com'")
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
    const result = ShellWget.generate(config, httpRequest)
    expect(result).toBe("wget --method=POST \\\n  --header='Content-Type: application/x-www-form-urlencoded' \\\n  --body-data='username=user123&email=user%40example.com' \\\n  -O - \\\n  'https://example.com'")
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
    const result = ShellWget.generate(config, httpRequest)
    expect(result).toBe("wget --method=POST \\\n  --header='Content-Type: text/plain' \\\n  --body-data='Simple plain text message' \\\n  -O - \\\n  'https://example.com'")
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
    const result = ShellWget.generate(config, httpRequest)
    expect(result).toBe("wget --method=POST \\\n  --header='Content-Type: application/json' \\\n  --body-data='{\n  \"name\": \"test\"\n}' \\\n  -O - \\\n  'https://example.com'")
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
    const result = ShellWget.generate(config, httpRequest)
    expect(result).toBe("wget --method=GET \\\n  -O - \\\n  'https://example.com/?address.zip=66031&address.country=Wallis'")
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
    const result = ShellWget.generate(config, httpRequest)
    expect(result).toBe("wget --method=GET \\\n  -O - \\\n  'https://example.com/?tags=alpha&tags=beta&category=backend'")
  })

})
