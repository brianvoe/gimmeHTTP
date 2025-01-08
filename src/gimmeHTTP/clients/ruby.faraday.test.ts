import RubyFaraday from './ruby.faraday'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from '@jest/globals'

describe('RubyFaraday.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = RubyFaraday.generate(config, httpRequest)
    expect(result).toBe(
      `
require "faraday"

conn = Faraday.new(url: "https://example.com") do |f|
  f.adapter Faraday.default_adapter
end

response = conn.get do |req|
  req.url "https://example.com"
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
    const result = RubyFaraday.generate(config, httpRequest)
    expect(result).toBe(
      `
require "faraday"

conn = Faraday.new(url: "https://example.com") do |f|
  f.adapter Faraday.default_adapter
end

response = conn.post do |req|
  req.url "https://example.com"

  req.headers["Content-Type"] = "application/json"
  req.headers["Authorization"] = "Bearer token"
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
    const result = RubyFaraday.generate(config, httpRequest)
    expect(result).toBe(
      `
require "faraday"

conn = Faraday.new(url: "https://example.com") do |f|
  f.adapter Faraday.default_adapter
end

response = conn.post do |req|
  req.url "https://example.com"

  req.headers["Cookie"] = "key1=value1"
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
    const result = RubyFaraday.generate(config, httpRequest)
    expect(result).toBe(
      `
require "faraday"

conn = Faraday.new(url: "https://example.com") do |f|
  f.adapter Faraday.default_adapter
end

response = conn.post do |req|
  req.url "https://example.com"

  req.body = {
    "key1": "value1"
  }
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
        num: 123,
        key2: {
          key3: 'value3'
        },
        key4: ['value4', 'value5'],
        empty: null
      }
    }
    const config: Config = {}
    const result = RubyFaraday.generate(config, httpRequest)
    expect(result).toBe(
      `
require "faraday"

conn = Faraday.new(url: "https://example.com") do |f|
  f.adapter Faraday.default_adapter
end

response = conn.post do |req|
  req.url "https://example.com"

  req.body = {
    "key1": "value1",
    "num": 123,
    "key2": {
      "key3": "value3"
    },
    "key4": [
      "value4",
      "value5"
    ],
    "empty": null
  }
end

puts response.body
    `.trim()
    )
  })
})
