import PowershellRestmethod from './powershell.restmethod'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('PowershellRestmethod.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = PowershellRestmethod.generate(config, httpRequest)
    expect(result).toBe("$uri = \"https://example.com\"\n$response = Invoke-RestMethod -Uri $uri -Method GET\nWrite-Output $response")
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
    const result = PowershellRestmethod.generate(config, httpRequest)
    expect(result).toBe("$uri = \"https://example.com\"\n$headers = @{\n  \"Content-Type\" = \"application/json\"\n  \"Authorization\" = \"Bearer token\"\n}\n$body = @'\n{\n  \"key1\": \"value1\"\n}\n'@\n$response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body\nWrite-Output $response")
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
    const result = PowershellRestmethod.generate(config, httpRequest)
    expect(result).toBe("$uri = \"https://example.com\"\n$headers = @{\n  \"Cookie\" = \"key1=value1\"\n}\n$response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers\nWrite-Output $response")
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
    const result = PowershellRestmethod.generate(config, httpRequest)
    expect(result).toBe("$uri = \"https://example.com\"\n$body = @'\n{\n  \"key1\": \"value1\"\n}\n'@\n$response = Invoke-RestMethod -Uri $uri -Method POST -Body $body -ContentType \"application/json\"\nWrite-Output $response")
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
    const result = PowershellRestmethod.generate(config, httpRequest)
    expect(result).toBe("$uri = \"https://example.com\"\n$body = @'\n{\n  \"key1\": \"value1\",\n  \"key2\": {\n    \"key3\": \"value3\"\n  },\n  \"key4\": [\n    \"value4\",\n    \"value5\"\n  ],\n  \"empty\": null\n}\n'@\n$response = Invoke-RestMethod -Uri $uri -Method POST -Body $body -ContentType \"application/json\"\nWrite-Output $response")
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
    const result = PowershellRestmethod.generate(config, httpRequest)
    expect(result).toBe("$uri = \"https://example.com\"\n$headers = @{\n  \"Content-Type\" = \"application/x-www-form-urlencoded\"\n}\n$body = @{\n  username = \"user123\"\n  email = \"user@example.com\"\n}\n$response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body -ContentType \"application/x-www-form-urlencoded\"\nWrite-Output $response")
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
    const result = PowershellRestmethod.generate(config, httpRequest)
    expect(result).toBe("$uri = \"https://example.com\"\n$headers = @{\n  \"Content-Type\" = \"text/plain\"\n}\n$body = \"Simple plain text message\"\n$response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body -ContentType \"text/plain\"\nWrite-Output $response")
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
    const result = PowershellRestmethod.generate(config, httpRequest)
    expect(result).toBe("try {\n  $uri = \"https://example.com\"\n  $headers = @{\n    \"Content-Type\" = \"application/json\"\n  }\n  $body = @'\n  {\n  \"name\": \"test\"\n}\n  '@\n  $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body\n  Write-Output $response\n} catch {\n  Write-Error $_.Exception.Message\n}")
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
    const result = PowershellRestmethod.generate(config, httpRequest)
    expect(result).toBe("$uri = \"https://example.com/?address.zip=66031&address.country=Wallis\"\n$response = Invoke-RestMethod -Uri $uri -Method GET\nWrite-Output $response")
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
    const result = PowershellRestmethod.generate(config, httpRequest)
    expect(result).toBe("$uri = \"https://example.com/?tags=alpha&tags=beta&category=backend\"\n$response = Invoke-RestMethod -Uri $uri -Method GET\nWrite-Output $response")
  })

})
