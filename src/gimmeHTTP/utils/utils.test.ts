import { IsJsonRequest, ParseUrl } from './utils'
import { describe, expect, test } from '@jest/globals'

describe('IsJsonRequest', () => {
  test('should return true for POST with Content-Type application/json', () => {
    const result = IsJsonRequest('POST', { 'Content-Type': 'application/json' })
    expect(result).toBe(true)
  })

  test('should return false for GET method', () => {
    const result = IsJsonRequest('GET', { 'Content-Type': 'application/json' })
    expect(result).toBe(false)
  })

  test('should return false for missing Content-Type header', () => {
    const result = IsJsonRequest('POST', { Accept: 'application/json' })
    expect(result).toBe(false)
  })

  test('should return false for missing headers', () => {
    const result = IsJsonRequest('POST')
    expect(result).toBe(false)
  })

  test('should return false for empty headers', () => {
    const result = IsJsonRequest('POST', {})
    expect(result).toBe(false)
  })
})

describe('ParseUrl', () => {
  test('should parse a valid URL with protocol, hostname, path, and params', () => {
    const result = ParseUrl('https://example.com/path?query=1')
    expect(result).toEqual({
      hostname: 'example.com',
      path: '/path',
      port: 443,
      protocol: 'https:',
      params: '?query=1'
    })
  })

  test('should parse a valid URL with port', () => {
    const result = ParseUrl('http://example.com:8080/path')
    expect(result).toEqual({
      hostname: 'example.com',
      path: '/path',
      port: 8080,
      protocol: 'http:',
      params: ''
    })
  })

  test('should handle an invalid URL', () => {
    const result = ParseUrl('invalid-url')
    expect(result).toEqual({
      hostname: 'invalid-url',
      path: '/',
      port: 80,
      protocol: 'http:',
      params: ''
    })
  })

  test('should handle a URL without protocol', () => {
    const result = ParseUrl('example.com/path')
    expect(result).toEqual({
      hostname: 'example.com',
      path: '/path',
      port: 80,
      protocol: 'http:',
      params: ''
    })
  })

  test('should handle a URL with only hostname', () => {
    const result = ParseUrl('https://example.com')
    expect(result).toEqual({
      hostname: 'example.com',
      path: '/',
      port: 443,
      protocol: 'https:',
      params: ''
    })
  })

  test('should handle a URL with custom hostname and path', () => {
    const result = ParseUrl('{put url here}/path?query=value')
    expect(result).toEqual({
      hostname: '{put url here}',
      path: '/path',
      port: 80,
      protocol: 'http:',
      params: '?query=value'
    })
  })
})
