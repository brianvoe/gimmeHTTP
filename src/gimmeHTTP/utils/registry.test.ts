import { ClearRegistry, Register, Search, Client } from './registry'
import { describe, expect, test, beforeEach } from '@jest/globals'

describe('Register', () => {
  // clear registry before each test
  beforeEach(() => {
    ClearRegistry()
  })

  test('should set default to true if only one generator is registered for a language', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'console.log("Hello World");' })
    const target = Search('javascript') as Client

    expect(target.default).toBe(true)
  })

  test('should set default to true if default is explicitly passed as true and unset others', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'console.log("Hello World");' })
    Register({ language: 'javascript', client: 'browser', generate: () => 'alert("Hello World");', default: true })
    const target = Search('javascript') as Client
    expect(target).toBeDefined()
  })

  test('should properly set default for multiple languages independently', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'console.log("Hello World");' })
    Register({ language: 'python', client: 'script', generate: () => 'print("Hello World")' })
    const jsTargets = Search('javascript') as Client
    expect(jsTargets.default).toBe(true)
    const pyTargets = Search('python') as Client
    expect(pyTargets.default).toBe(true)
  })

  test('should unset default from previous target when a new default is registered for the same language', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'console.log("Hello World");', default: true })
    Register({ language: 'javascript', client: 'browser', generate: () => 'alert("Hello World");', default: true })
    const target = Search('javascript') as Client
    expect(target).toBeDefined()
  })

  test('should set language with 3 targets and default should be the first added', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'console.log("Hello World");' })
    Register({ language: 'javascript', client: 'browser', generate: () => 'alert("Hello World");' })
    Register({ language: 'javascript', client: 'deno', generate: () => 'console.log("Hello World");' })
    let target = Search('javascript') as Client
    expect(target.client).toBe('node')
  })
})
