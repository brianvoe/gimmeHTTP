import { IsJsonRequest } from './utils'
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
