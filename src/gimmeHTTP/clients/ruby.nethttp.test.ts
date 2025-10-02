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
}

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
}

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(request)
end

puts response.body
    `.trim()
    )
  })
})
