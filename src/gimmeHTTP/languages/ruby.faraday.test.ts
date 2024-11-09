import RubyFaraday from './ruby.faraday'
import { Config, Http } from '../types'
import { describe, expect, test } from '@jest/globals'

describe('RubyFaraday.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://gofakeit.com/api'
    }
    const config: Config = {}
    const result = RubyFaraday.generate(config, httpRequest)
    expect(result).toBe(
      `
require "faraday"

conn = Faraday.new(url: "https://gofakeit.com/api") do |f|
  f.adapter Faraday.default_adapter
end

response = conn.get do |req|
  req.url "https://gofakeit.com/api"
end

puts response.body
    `.trim()
    )
  })

  test('should build a POST request with headers', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://gofakeit.com/api',
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

conn = Faraday.new(url: "https://gofakeit.com/api") do |f|
  f.adapter Faraday.default_adapter
end

response = conn.post do |req|
  req.url "https://gofakeit.com/api"
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
      url: 'https://gofakeit.com/api',
      cookies: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = RubyFaraday.generate(config, httpRequest)
    expect(result).toBe(
      `
require "faraday"

conn = Faraday.new(url: "https://gofakeit.com/api") do |f|
  f.adapter Faraday.default_adapter
end

response = conn.post do |req|
  req.url "https://gofakeit.com/api"
  req.headers["Cookie"] = "key1=value1"
end

puts response.body
    `.trim()
    )
  })

  test('should build a POST request with body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://gofakeit.com/api',
      body: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = RubyFaraday.generate(config, httpRequest)
    expect(result).toBe(
      `
require "faraday"

conn = Faraday.new(url: "https://gofakeit.com/api") do |f|
  f.adapter Faraday.default_adapter
end

response = conn.post do |req|
  req.url "https://gofakeit.com/api"
  req.body = {"key1":"value1"}
end

puts response.body
    `.trim()
    )
  })
})
