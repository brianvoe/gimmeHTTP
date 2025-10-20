import {
  IsJsonRequest,
  ParseUrl,
  GetContentType,
  HasBody,
  IsStringBody,
  IsObjectBody,
  ContentTypeIncludes,
  InferContentType,
  GetEffectiveContentType
} from './utils'
import { describe, expect, test } from 'vitest'

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

describe('GetContentType', () => {
  test('should return Content-Type header (case-insensitive)', () => {
    expect(GetContentType({ 'Content-Type': 'application/json' })).toBe('application/json')
    expect(GetContentType({ 'content-type': 'text/html' })).toBe('text/html')
    expect(GetContentType({ 'CONTENT-TYPE': 'application/xml' })).toBe('application/xml')
  })

  test('should fallback to Accept header', () => {
    expect(GetContentType({ Accept: 'application/json' })).toBe('application/json')
    expect(GetContentType({ accept: 'text/plain' })).toBe('text/plain')
  })

  test('should return empty string if no headers', () => {
    expect(GetContentType()).toBe('')
    expect(GetContentType({})).toBe('')
  })

  test('should prefer Content-Type over Accept', () => {
    expect(GetContentType({ 'Content-Type': 'application/json', Accept: 'text/html' })).toBe('application/json')
  })
})

describe('HasBody', () => {
  test('should return true for non-empty object', () => {
    expect(HasBody({ key: 'value' })).toBe(true)
  })

  test('should return false for empty object', () => {
    expect(HasBody({})).toBe(false)
  })

  test('should return true for non-empty string', () => {
    expect(HasBody('hello')).toBe(true)
  })

  test('should return false for empty string', () => {
    expect(HasBody('')).toBe(false)
  })

  test('should return false for null/undefined', () => {
    expect(HasBody(null)).toBe(false)
    expect(HasBody(undefined)).toBe(false)
  })
})

describe('IsStringBody', () => {
  test('should return true for strings', () => {
    expect(IsStringBody('hello')).toBe(true)
    expect(IsStringBody('')).toBe(true)
  })

  test('should return false for non-strings', () => {
    expect(IsStringBody({})).toBe(false)
    expect(IsStringBody(123)).toBe(false)
    expect(IsStringBody(null)).toBe(false)
  })
})

describe('IsObjectBody', () => {
  test('should return true for objects', () => {
    expect(IsObjectBody({ key: 'value' })).toBe(true)
    expect(IsObjectBody({})).toBe(true)
  })

  test('should return false for non-objects', () => {
    expect(IsObjectBody('string')).toBe(false)
    expect(IsObjectBody(123)).toBe(false)
    expect(IsObjectBody(null)).toBe(false)
    expect(IsObjectBody(undefined)).toBe(false)
  })
})

describe('ContentTypeIncludes', () => {
  test('should detect json content-type', () => {
    expect(ContentTypeIncludes('application/json', 'json')).toBe(true)
    expect(ContentTypeIncludes('application/json; charset=utf-8', 'json')).toBe(true)
    expect(ContentTypeIncludes('Application/JSON', 'json')).toBe(true)
  })

  test('should detect xml content-type', () => {
    expect(ContentTypeIncludes('application/xml', 'xml')).toBe(true)
    expect(ContentTypeIncludes('text/xml', 'xml')).toBe(true)
    expect(ContentTypeIncludes('application/xml; charset=utf-8', 'xml')).toBe(true)
  })

  test('should detect form content-type', () => {
    expect(ContentTypeIncludes('application/x-www-form-urlencoded', 'form')).toBe(true)
    expect(ContentTypeIncludes('application/x-www-form-urlencoded; charset=utf-8', 'form')).toBe(true)
  })

  test('should detect text content-type', () => {
    expect(ContentTypeIncludes('text/plain', 'text')).toBe(true)
    expect(ContentTypeIncludes('text/html', 'text')).toBe(true)
    expect(ContentTypeIncludes('text/css', 'text')).toBe(true)
  })

  test('should detect blob content-type', () => {
    expect(ContentTypeIncludes('application/octet-stream', 'blob')).toBe(true)
    expect(ContentTypeIncludes('image/png', 'blob')).toBe(true)
    expect(ContentTypeIncludes('image/jpeg', 'blob')).toBe(true)
  })

  test('should return false for non-matching types', () => {
    expect(ContentTypeIncludes('application/json', 'xml')).toBe(false)
    expect(ContentTypeIncludes('text/plain', 'json')).toBe(false)
    expect(ContentTypeIncludes('', 'json')).toBe(false)
  })
})

describe('InferContentType', () => {
  test('should infer JSON for objects', () => {
    expect(InferContentType({ key: 'value' })).toBe('application/json')
    expect(InferContentType({})).toBe('application/json')
    expect(InferContentType({ nested: { data: 'value' } })).toBe('application/json')
  })

  test('should infer JSON for JSON-like strings', () => {
    expect(InferContentType('{"key": "value"}')).toBe('application/json')
    expect(InferContentType('[1, 2, 3]')).toBe('application/json')
    expect(InferContentType('  { "key": "value" }  ')).toBe('application/json')
  })

  test('should infer text/plain for regular strings', () => {
    expect(InferContentType('hello world')).toBe('text/plain; charset=utf-8')
    expect(InferContentType('some plain text')).toBe('text/plain; charset=utf-8')
  })

  test('should default to octet-stream for null/undefined/empty', () => {
    expect(InferContentType(null)).toBe('application/octet-stream')
    expect(InferContentType(undefined)).toBe('application/octet-stream')
    expect(InferContentType('')).toBe('application/octet-stream')
    expect(InferContentType('   ')).toBe('application/octet-stream')
  })
})

describe('GetEffectiveContentType', () => {
  test('should return explicit Content-Type when present', () => {
    const result = GetEffectiveContentType({ 'Content-Type': 'application/xml' }, { key: 'value' })
    expect(result.contentType).toBe('application/xml')
    expect(result.wasInferred).toBe(false)
  })

  test('should infer content-type when not present', () => {
    const result = GetEffectiveContentType({}, { key: 'value' })
    expect(result.contentType).toBe('application/json')
    expect(result.wasInferred).toBe(true)
  })

  test('should infer from string body', () => {
    const result = GetEffectiveContentType({}, 'hello world')
    expect(result.contentType).toBe('text/plain; charset=utf-8')
    expect(result.wasInferred).toBe(true)
  })

  test('should infer JSON from JSON string', () => {
    const result = GetEffectiveContentType({}, '{"key": "value"}')
    expect(result.contentType).toBe('application/json')
    expect(result.wasInferred).toBe(true)
  })

  test('should handle no headers and no body', () => {
    const result = GetEffectiveContentType()
    expect(result.contentType).toBe('application/octet-stream')
    expect(result.wasInferred).toBe(true)
  })
})
