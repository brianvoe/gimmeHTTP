import { beforeEach, describe, expect, test } from '@jest/globals'
import { Builder } from './builder'

describe('Builder', () => {
  let builder: Builder

  beforeEach(() => {
    builder = new Builder()
  })

  test('should add a line without indentation', () => {
    builder.line('Hello, World!')
    expect(builder.output()).toBe('Hello, World!')
  })

  test('should add a line with indentation', () => {
    builder.indent()
    builder.line('Indented line')
    expect(builder.output()).toBe('  Indented line')
  })

  test('should add multiple lines with different indentation levels', () => {
    builder.line('First line')
    builder.indent()
    builder.line('Second line indented')
    builder.indent()
    builder.line('Third line double indented')
    builder.outdent()
    builder.line('Fourth line single indented')
    builder.outdent()
    builder.line('Fifth line no indentation')
    expect(builder.output()).toBe(
      'First line\n  Second line indented\n    Third line double indented\n  Fourth line single indented\nFifth line no indentation'
    )
  })

  test('should handle outdent correctly when no indentation is present', () => {
    builder.outdent()
    builder.line('No indentation')
    expect(builder.output()).toBe('No indentation')
  })

  test('should add empty lines', () => {
    builder.line('First line')
    builder.line()
    builder.line('Second line')
    expect(builder.output()).toBe('First line\n\nSecond line')
  })
})
