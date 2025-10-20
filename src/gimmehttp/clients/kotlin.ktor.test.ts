import KotlinKtor from './kotlin.ktor'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

describe('KotlinKtor.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/api'
    }
    const config: Config = {}
    const result = KotlinKtor.generate(config, httpRequest)
    expect(result).toBe(
      `
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*

suspend fun main() {
  val client = HttpClient(CIO)

  val response: HttpResponse = client.get {
    url("https://example.com/api")
  }

  println(response.bodyAsText())
  client.close()
}
      `.trim()
    )
  })

  test('should build a POST request with JSON body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: 'John',
        age: 30
      }
    }
    const config: Config = {}
    const result = KotlinKtor.generate(config, httpRequest)
    expect(result).toContain('import kotlinx.serialization.json.*')
    expect(result).toContain('contentType(ContentType.Application.Json)')
    expect(result).toContain('buildJsonObject {')
    expect(result).toContain('put("name", "John")')
    expect(result).toContain('put("age", 30)')
  })

  test('should build a POST request with form body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        username: 'user',
        password: 'pass'
      }
    }
    const config: Config = {}
    const result = KotlinKtor.generate(config, httpRequest)
    expect(result).toContain('FormDataContent(Parameters.build {')
    expect(result).toContain('append("username", "user")')
    expect(result).toContain('append("password", "pass")')
  })

  test('should build a POST request with text body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Simple text'
    }
    const config: Config = {}
    const result = KotlinKtor.generate(config, httpRequest)
    expect(result).toContain('setBody("Simple text")')
  })

  test('should build a request with headers', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      headers: {
        Authorization: 'Bearer token123'
      }
    }
    const config: Config = {}
    const result = KotlinKtor.generate(config, httpRequest)
    expect(result).toContain('header("Authorization", "Bearer token123")')
  })

  test('should build a POST request with error handling', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        test: 'data'
      }
    }
    const config: Config = { handleErrors: true }
    const result = KotlinKtor.generate(config, httpRequest)
    expect(result).toContain('try {')
    expect(result).toContain('} catch (e: Exception) {')
    expect(result).toContain('println("Error: ${e.message}")')
  })
})
