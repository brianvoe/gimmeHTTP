import RubyHttparty from './ruby.httparty'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('RubyHttparty.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = RubyHttparty.generate(config, httpRequest)
    expect(result).toBe(`
require "httparty"

response = HTTParty.get("https://example.com")
puts response.body
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
    const result = RubyHttparty.generate(config, httpRequest)
    expect(result).toBe(`
require "httparty"
require "json"

headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer token"
}

body = {
  "key1": "value1"
}.to_json

response = HTTParty.post("https://example.com", headers: headers, body: body)
puts response.body
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
    const result = RubyHttparty.generate(config, httpRequest)
    expect(result).toBe(`
require "httparty"

cookies = {
  "key1": "value1"
}

response = HTTParty.post("https://example.com", cookies: cookies)
puts response.body
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
    const result = RubyHttparty.generate(config, httpRequest)
    expect(result).toBe(`
require "httparty"
require "json"

body = {
  "key1": "value1"
}.to_json

response = HTTParty.post("https://example.com", body: body)
puts response.body
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
    const result = RubyHttparty.generate(config, httpRequest)
    expect(result).toBe(`
require "httparty"
require "json"

body = {
  "key1": "value1",
  "key2": {
    "key3": "value3"
  },
  "key4": [
    "value4",
    "value5"
  ],
  "empty": nil
}.to_json

response = HTTParty.post("https://example.com", body: body)
puts response.body
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
    const result = RubyHttparty.generate(config, httpRequest)
    expect(result).toBe(`
require "httparty"

headers = {
  "Content-Type": "application/x-www-form-urlencoded"
}

body = {
  "username": "user123",
  "email": "user@example.com"
}

response = HTTParty.post("https://example.com", headers: headers, body: body)
puts response.body
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
    const result = RubyHttparty.generate(config, httpRequest)
    expect(result).toBe(`
require "httparty"

headers = {
  "Content-Type": "text/plain"
}

body = "Simple plain text message"

response = HTTParty.post("https://example.com", headers: headers, body: body)
puts response.body
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
    const result = RubyHttparty.generate(config, httpRequest)
    expect(result).toBe(`
require "httparty"
require "json"

begin
  headers = {
    "Content-Type": "application/json"
  }

  body = {
    "name": "test"
  }.to_json

  response = HTTParty.post("https://example.com", headers: headers, body: body)
  puts response.body
rescue HTTParty::Error => e
  puts "Error: #{e.message}"
end
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
    const result = RubyHttparty.generate(config, httpRequest)
    expect(result).toBe(`
require "httparty"

query = {
  "address.zip": "66031",
  "address.country": "Wallis"
}

response = HTTParty.get("https://example.com", query: query)
puts response.body
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
    const result = RubyHttparty.generate(config, httpRequest)
    expect(result).toBe(`
require "httparty"

query = {
  "tags": [
    "alpha",
    "beta"
  ],
  "category": "backend"
}

response = HTTParty.get("https://example.com", query: query)
puts response.body
`.trim())
  })

})
