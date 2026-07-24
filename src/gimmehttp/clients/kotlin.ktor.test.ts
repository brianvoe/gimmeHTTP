import KotlinKtor from './kotlin.ktor'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

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
import io.ktor.http.*

suspend fun main() {
  HttpClient(CIO).use { client ->
    val response: HttpResponse = client.request {
      method = HttpMethod.parse("GET")
      url("https://example.com/api")
    }

    println(response.bodyAsText())
  }
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
    expect(result).toBe(
      `
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

suspend fun main() {
  HttpClient(CIO).use { client ->
    val response: HttpResponse = client.request {
      method = HttpMethod.parse("POST")
      url("https://example.com")
      header("Content-Type", "application/json")
      contentType(ContentType.Application.Json)
      setBody("""{"name":"John","age":30}""")
    }

    println(response.bodyAsText())
  }
}
    `.trim()
    )
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
    expect(result).toBe(
      `
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

suspend fun main() {
  HttpClient(CIO).use { client ->
    val response: HttpResponse = client.request {
      method = HttpMethod.parse("POST")
      url("https://example.com")
      header("Content-Type", "application/x-www-form-urlencoded")
      setBody(
        FormDataContent(Parameters.build {
          append("username", "user")
          append("password", "pass")
        })
      )
    }

    println(response.bodyAsText())
  }
}
    `.trim()
    )
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
    expect(result).toBe(
      `
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

suspend fun main() {
  HttpClient(CIO).use { client ->
    val response: HttpResponse = client.request {
      method = HttpMethod.parse("POST")
      url("https://example.com")
      header("Content-Type", "text/plain")
      setBody("Simple text")
    }

    println(response.bodyAsText())
  }
}
    `.trim()
    )
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
    expect(result).toBe(
      `
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

suspend fun main() {
  HttpClient(CIO).use { client ->
    val response: HttpResponse = client.request {
      method = HttpMethod.parse("GET")
      url("https://example.com")
      header("Authorization", "Bearer token123")
    }

    println(response.bodyAsText())
  }
}
    `.trim()
    )
  })

  test('should build a POST request with error handling', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        test: 'data'
      }
    }
    const config: Config = {
      handleErrors: true
    }
    const result = KotlinKtor.generate(config, httpRequest)
    expect(result).toBe(
      `
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

suspend fun main() {
  try {
    HttpClient(CIO) { expectSuccess = true }.use { client ->
      val response: HttpResponse = client.request {
        method = HttpMethod.parse("POST")
        url("https://example.com")
        contentType(ContentType.Application.Json)
        setBody("""{"test":"data"}""")
      }

      println(response.bodyAsText())
    }
  } catch (e: Exception) {
    println("Error: \${e.message}")
  }
}
    `.trim()
    )
  })

  test('should build a GET request with URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        'address.zip': '66031',
        'address.country': 'Wallis'
      }
    }
    const config: Config = {}
    const result = KotlinKtor.generate(config, httpRequest)
    expect(result).toBe(
      `
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

suspend fun main() {
  HttpClient(CIO).use { client ->
    val response: HttpResponse = client.request {
      method = HttpMethod.parse("GET")
      url("https://example.com")
      parameter("address.zip", "66031")
      parameter("address.country", "Wallis")
    }

    println(response.bodyAsText())
  }
}
    `.trim()
    )
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['kotlin', 'ktor'],
        category: 'backend'
      }
    }
    const config: Config = {}
    const result = KotlinKtor.generate(config, httpRequest)
    expect(result).toBe(
      `
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

suspend fun main() {
  HttpClient(CIO).use { client ->
    val response: HttpResponse = client.request {
      method = HttpMethod.parse("GET")
      url("https://example.com")
      parameter("tags", "kotlin")
      parameter("tags", "ktor")
      parameter("category", "backend")
    }

    println(response.bodyAsText())
  }
}
    `.trim()
    )
  })

  test('should build a POST request with URL parameters and body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      params: {
        version: '1.0'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: 'John'
      }
    }
    const config: Config = {}
    const result = KotlinKtor.generate(config, httpRequest)
    expect(result).toBe(
      `
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

suspend fun main() {
  HttpClient(CIO).use { client ->
    val response: HttpResponse = client.request {
      method = HttpMethod.parse("POST")
      url("https://example.com")
      parameter("version", "1.0")
      header("Content-Type", "application/json")
      contentType(ContentType.Application.Json)
      setBody("""{"name":"John"}""")
    }

    println(response.bodyAsText())
  }
}
    `.trim()
    )
  })
})
