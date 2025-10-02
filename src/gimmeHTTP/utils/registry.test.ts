import { ClearRegistry, Register, Search, Client } from './registry'
import { describe, expect, test, beforeEach } from 'vitest'

describe('Register', () => {
  // clear registry before each test
  beforeEach(() => {
    ClearRegistry()
  })

  test('should set default to true if only one generator is registered for a language', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'console.log("Hello World");' })
    const client = Search('javascript')
    expect(client?.default).toBe(true)
  })

  test('should set default to true if default is explicitly passed as true and unset others', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'console.log("Hello World");' })
    Register({ language: 'javascript', client: 'browser', generate: () => 'alert("Hello World");', default: true })
    const client = Search('javascript')
    expect(client?.default).toBeDefined()
  })

  test('should properly set default for multiple languages independently', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'console.log("Hello World");' })
    Register({ language: 'python', client: 'script', generate: () => 'print("Hello World")' })
    const jsClients = Search('javascript')
    expect(jsClients?.default).toBe(true)
    const pyClients = Search('python')
    expect(pyClients?.default).toBe(true)
  })

  test('should unset default from previous client when a new default is registered for the same language', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'console.log("Hello World");', default: true })
    Register({ language: 'javascript', client: 'browser', generate: () => 'alert("Hello World");', default: true })
    const client = Search('javascript')
    expect(client?.default).toBeDefined()
  })

  test('should set language with 3 clients and default should be the first added', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'console.log("Hello World");' })
    Register({ language: 'javascript', client: 'browser', generate: () => 'alert("Hello World");' })
    Register({ language: 'javascript', client: 'deno', generate: () => 'console.log("Hello World");' })
    let client = Search('javascript')
    expect(client?.client).toBe('node')
  })
})
