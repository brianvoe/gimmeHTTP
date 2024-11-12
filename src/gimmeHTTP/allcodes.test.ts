import AllCodes from './allcodes'
import { ClearRegistry, Codes, Register } from './index'
import { describe, expect, test } from '@jest/globals'

describe('All', () => {
  test('should test that if loading All that it contains more than 0', () => {
    ClearRegistry()
    Register(AllCodes)

    const codes = Codes()

    expect(codes.length).toBeGreaterThan(15)
  })
})
