import { describe, expect, test, beforeEach } from '@jest/globals'
import { ClearRegistry, Register, CodesByLanguage, SetDefault } from './registry'

describe('Register', () => {
  // clear registry before each test
  beforeEach(() => {
    ClearRegistry()
  })

  test('should set default to true if only one generator is registered for a language', () => {
    Register({ language: 'javascript', target: 'node', generate: () => 'console.log("Hello World");' })
    const generators = CodesByLanguage('javascript')
    expect(generators.length).toBe(1)
    expect(generators[0].default).toBe(true)
  })

  test('should set default to true if default is explicitly passed as true and unset others', () => {
    Register({ language: 'javascript', target: 'node', generate: () => 'console.log("Hello World");' })
    Register({ language: 'javascript', target: 'browser', generate: () => 'alert("Hello World");', default: true })
    const generators = CodesByLanguage('javascript')
    expect(generators.length).toBe(2)
    expect(generators.find((c) => c.target === 'browser')?.default).toBe(true)
    expect(generators.find((c) => c.target === 'node')?.default).toBe(false)
  })

  test('should properly set default for multiple languages independently', () => {
    Register({ language: 'javascript', target: 'node', generate: () => 'console.log("Hello World");' })
    Register({ language: 'python', target: 'script', generate: () => 'print("Hello World")' })
    const jsGenerators = CodesByLanguage('javascript')
    const pyGenerators = CodesByLanguage('python')
    expect(jsGenerators.length).toBe(1)
    expect(jsGenerators[0].default).toBe(true)
    expect(pyGenerators.length).toBe(1)
    expect(pyGenerators[0].default).toBe(true)
  })

  test('should unset default from previous generators when a new default is registered for the same language', () => {
    Register({ language: 'javascript', target: 'node', generate: () => 'console.log("Hello World");', default: true })
    Register({ language: 'javascript', target: 'browser', generate: () => 'alert("Hello World");', default: true })
    const generators = CodesByLanguage('javascript')
    expect(generators.length).toBe(2)
    expect(generators.find((c) => c.target === 'browser')?.default).toBe(true)
    expect(generators.find((c) => c.target === 'node')?.default).toBe(false)
  })

  test('should set language with 3 targets and run default on the last one', () => {
    Register({ language: 'javascript', target: 'node', generate: () => 'console.log("Hello World");' })
    Register({ language: 'javascript', target: 'browser', generate: () => 'alert("Hello World");' })
    Register({ language: 'javascript', target: 'deno', generate: () => 'console.log("Hello World");' })
    const generators = CodesByLanguage('javascript')
    expect(generators.length).toBe(3)
    // test first is default
    expect(generators.find((c) => c.target === 'node')?.default).toBe(true)
    SetDefault('javascript', 'deno')
    expect(generators.find((c) => c.target === 'deno')?.default).toBe(true)
    // test the others are false
    expect(generators.find((c) => c.target === 'node')?.default).toBe(false)
    expect(generators.find((c) => c.target === 'browser')?.default).toBe(false)
  })
})
