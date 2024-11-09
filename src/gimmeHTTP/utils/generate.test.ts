import AllCodes from '../allcodes'
import Curl from '../languages/curl'
import { Generate } from './generate'
import { ClearRegistry, Register } from './registry'
import { Request } from '../types'
import { beforeEach, describe, expect, test } from '@jest/globals'

describe('Generate', () => {
  beforeEach(() => {
    ClearRegistry()
  })

  test('should run simple example', () => {
    // Add all the codes
    Register(AllCodes)

    // Generate a request
    const req = {
      language: 'curl',
      target: 'native',
      http: {
        method: 'GET',
        url: 'https://gofakeit.com'
      }
    } as Request

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual(`curl -X GET "https://gofakeit.com"`)
  })

  test('should run simple post example', () => {
    // Add all the codes
    Register(AllCodes)

    // Generate a request
    const req = {
      language: 'curl',
      target: 'native',
      http: {
        method: 'POST',
        url: 'https://gofakeit.com',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token'
        },
        body: {
          key1: 'value1',
          key2: 'value2'
        }
      }
    } as Request

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual(
      `
curl -X POST "https://gofakeit.com"
  -H "Content-Type: application/json"
  -H "Authorization: Bearer token"
  -d '{"key1":"value1","key2":"value2"}'
    `.trim()
    )
  })

  test('shold run a single code import', () => {
    // Add a single code
    Register(Curl)

    // Generate a request
    const req = {
      language: 'curl',
      target: 'native',
      http: {
        method: 'GET',
        url: 'https://gofakeit.com'
      }
    } as Request

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual(`curl -X GET "https://gofakeit.com"`)
  })

  test('should run a simple custom registry and output', () => {
    // Add a custom code
    Register({
      language: 'custom',
      target: 'native',
      generate: () => 'custom code'
    })

    // Generate a request
    const req = {
      language: 'custom',
      target: 'native',
      http: {
        method: 'GET',
        url: 'https://gofakeit.com'
      }
    } as Request

    // Generate the code
    const res = Generate(req)

    expect(res).toEqual('custom code')
  })
})
