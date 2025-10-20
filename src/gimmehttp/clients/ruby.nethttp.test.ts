import RubyNetHttp from './ruby.nethttp'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

describe('RubyNetHttp.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

uri = URI.parse("https://example.com")
request = Net::HTTP::Get.new(uri)

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
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
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

uri = URI.parse("https://example.com")
request = Net::HTTP::Post.new(uri)
request["Content-Type"] = "application/json"
request["Authorization"] = "Bearer token"

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
    `.trim()
    )
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      cookies: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

uri = URI.parse("https://example.com")
request = Net::HTTP::Post.new(uri)
request["Cookie"] = "key1=value1"

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
    `.trim()
    )
  })

  test('should build a POST request with body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

uri = URI.parse("https://example.com")
request = Net::HTTP::Post.new(uri)
request.body = {
  "key1": "value1"
}.to_json

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
    `.trim()
    )
  })

  test('should build a POST request with advanced json body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        key1: 'value1',
        key2: {
          key3: 'value3'
        },
        key4: ['value4'],
        key5: [{ key6: 'value6' }],
        empty: null
      }
    }
    const config: Config = {}
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

uri = URI.parse("https://example.com")
request = Net::HTTP::Post.new(uri)
request.body = {
  "key1": "value1",
  "key2": {
    "key3": "value3"
  },
  "key4": [
    "value4"
  ],
  "key5": [{
      "key6": "value6"
    }
  ],
  "empty": null
}.to_json

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
    `.trim()
    )
  })

  test('should build a POST request with text/plain body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Plain text content here'
    }
    const config: Config = {}
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

uri = URI.parse("https://example.com")
request = Net::HTTP::Post.new(uri)
request["Content-Type"] = "text/plain"
request.body = "Plain text content here"

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
    `.trim()
    )
  })

  test('should build a POST request with XML body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: '<data><item>test</item></data>'
    }
    const config: Config = {}
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

uri = URI.parse("https://example.com")
request = Net::HTTP::Post.new(uri)
request["Content-Type"] = "application/xml"
request.body = "<data><item>test</item></data>"

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
    `.trim()
    )
  })

  test('should build a PUT request', () => {
    const httpRequest: Http = {
      method: 'PUT',
      url: 'https://example.com/resource/123',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: 'updated'
      }
    }
    const config: Config = {}
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

uri = URI.parse("https://example.com/resource/123")
request = Net::HTTP::Put.new(uri)
request["Content-Type"] = "application/json"
request.body = {
  "name": "updated"
}.to_json

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
    `.trim()
    )
  })

  test('should build a DELETE request', () => {
    const httpRequest: Http = {
      method: 'DELETE',
      url: 'https://example.com/resource/123'
    }
    const config: Config = {}
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

uri = URI.parse("https://example.com/resource/123")
request = Net::HTTP::Delete.new(uri)

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
    `.trim()
    )
  })

  test('should build a PATCH request (generic method)', () => {
    const httpRequest: Http = {
      method: 'PATCH',
      url: 'https://example.com/resource/123',
      body: {
        status: 'active'
      }
    }
    const config: Config = {}
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

uri = URI.parse("https://example.com/resource/123")
request = Net::HTTP::GenericRequest.new("PATCH", uri.path, nil, nil)
request.body = {
  "status": "active"
}.to_json

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
    `.trim()
    )
  })

  test('should handle array header values', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      headers: {
        Accept: ['application/json', 'text/plain']
      }
    }
    const config: Config = {}
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

uri = URI.parse("https://example.com")
request = Net::HTTP::Get.new(uri)
request["Accept"] = "application/json"
request["Accept"] = "text/plain"

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
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
        test: 'data'
      }
    }
    const config: Config = { handleErrors: true }
    const result = RubyNetHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
require "net/http"
require "uri"

begin
  uri = URI.parse("https://example.com")
  request = Net::HTTP::Post.new(uri)
  request["Content-Type"] = "application/json"
  request.body = {
    "test": "data"
  }.to_json

  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
    http.request(request)
  end

  puts response.body
rescue StandardError => e
  puts "Error: #{e.message}"
end
    `.trim()
    )
  })
})
