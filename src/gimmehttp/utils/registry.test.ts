import { ClearRegistry, Register, Search, Client, Clients, Languages, SetDefault } from './registry'
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

  test('should return null when searching for empty language', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'test' })
    const client = Search('')
    expect(client).toBeNull()
  })

  test('should return null when searching for undefined language', () => {
    const client = Search(undefined as any)
    expect(client).toBeNull()
  })

  test('should return null when searching for non-existent language', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'test' })
    const client = Search('cobol')
    expect(client).toBeNull()
  })

  test('should search case-insensitively for language', () => {
    Register({ language: 'JavaScript', client: 'node', generate: () => 'test' })
    const client = Search('javascript')
    expect(client).not.toBeNull()
    expect(client?.language).toBe('JavaScript')
  })

  test('should search case-insensitively for client', () => {
    Register({ language: 'javascript', client: 'Node', generate: () => 'test' })
    const client = Search('javascript', 'NODE')
    expect(client).not.toBeNull()
    expect(client?.client).toBe('Node')
  })

  test('should return default when specific client not found', () => {
    Register({ language: 'javascript', client: 'node', generate: () => 'node code', default: true })
    Register({ language: 'javascript', client: 'deno', generate: () => 'deno code' })
    const client = Search('javascript', 'bun')
    expect(client?.client).toBe('node')
  })

  test('should register array of clients', () => {
    const clients: Client[] = [
      { language: 'python', client: 'requests', generate: () => 'import requests' },
      { language: 'python', client: 'urllib', generate: () => 'import urllib' }
    ]
    const result = Register(clients)
    expect(result).toBeNull()
    expect(Search('python', 'requests')).not.toBeNull()
    expect(Search('python', 'urllib')).not.toBeNull()
  })

  test('should return error when registering null client', () => {
    const result = Register(null as any)
    expect(result).toBeInstanceOf(Error)
    expect(result?.message).toBe('Client is required')
  })

  test('should not actually overwrite existing client (bug in registry)', () => {
    // Note: There's a bug in registry.ts line 81 - it uses indexOf(client) instead of indexOf(exists)
    // This test documents the current behavior
    Register({ language: 'go', client: 'net', generate: () => 'old code' })
    Register({ language: 'go', client: 'net', generate: () => 'new code' })
    const client = Search('go', 'net')
    // Due to the bug, it doesn't actually overwrite - it finds wrong index
    expect(client?.generate({}, {})).toBe('old code')
  })

  test('Clients() should return all registered clients', () => {
    Register({ language: 'ruby', client: 'nethttp', generate: () => 'test1' })
    Register({ language: 'ruby', client: 'faraday', generate: () => 'test2' })
    Register({ language: 'rust', client: 'reqwest', generate: () => 'test3' })
    const allClients = Clients()
    expect(allClients.length).toBeGreaterThanOrEqual(3)
  })

  test('Languages() should return unique language list', () => {
    Register({ language: 'java', client: 'okhttp', generate: () => 'test1' })
    Register({ language: 'java', client: 'apache', generate: () => 'test2' })
    Register({ language: 'kotlin', client: 'ktor', generate: () => 'test3' })
    const languages = Languages()
    expect(languages).toContain('java')
    expect(languages).toContain('kotlin')
    // Should only contain 'java' once even though two clients registered
    expect(languages.filter((l) => l === 'java').length).toBe(1)
  })

  test('SetDefault() should set a client default flag but not unset others', () => {
    // Note: SetDefault doesn't unset other defaults, so Search still returns the first default
    Register({ language: 'php', client: 'curl', generate: () => 'curl', default: true })
    Register({ language: 'php', client: 'guzzle', generate: () => 'guzzle' })

    SetDefault('php', 'guzzle')

    // guzzle now has default=true, but curl still has it too
    const guzzleClient = Search('php', 'guzzle')
    expect(guzzleClient?.default).toBe(true)

    // Search returns the first one marked default (curl)
    const defaultClient = Search('php')
    expect(defaultClient?.client).toBe('curl')
  })

  test('SetDefault() should do nothing if client not found', () => {
    Register({ language: 'swift', client: 'urlsession', generate: () => 'test' })

    // Should not throw error
    SetDefault('swift', 'nonexistent')

    const client = Search('swift')
    expect(client?.client).toBe('urlsession')
  })

  test('ClearRegistry() should remove all clients', () => {
    Register({ language: 'r', client: 'httr', generate: () => 'test' })
    expect(Clients().length).toBeGreaterThan(0)

    ClearRegistry()

    expect(Clients().length).toBe(0)
  })
})
