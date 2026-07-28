import KotlinOkHttp from './kotlin.okhttp'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('KotlinOkHttp.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = KotlinOkHttp.generate(config, httpRequest)
    expect(result).toBe(`
import okhttp3.*

fun main() {
  val client = OkHttpClient()

  val request = Request.Builder()
    .url("https://example.com")
    .method("GET", null)
    .build()

  client.newCall(request).execute().use { response ->
    println(response.body?.string())
  }
}
`.trim())
  })

  test('should build a POST request with headers', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer token"
      },
      "body": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = KotlinOkHttp.generate(config, httpRequest)
    expect(result).toBe("import okhttp3.*\n\nfun main() {\n  val client = OkHttpClient()\n\n  val body = RequestBody.create(\n    MediaType.get(\"application/json; charset=utf-8\"),\"{\\\"key1\\\":\\\"value1\\\"}\"\n  )\n\n  val request = Request.Builder()\n    .url(\"https://example.com\")\n    .method(\"POST\", body)\n    .addHeader(\"Content-Type\", \"application/json\")\n    .addHeader(\"Authorization\", \"Bearer token\")\n    .build()\n\n  client.newCall(request).execute().use { response ->\n    println(response.body?.string())\n  }\n}")
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "cookies": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = KotlinOkHttp.generate(config, httpRequest)
    expect(result).toBe(`
import okhttp3.*

fun main() {
  val client = OkHttpClient()

  val request = Request.Builder()
    .url("https://example.com")
    .method("POST", null)
    .addHeader("Cookie", "key1=value1")
    .build()

  client.newCall(request).execute().use { response ->
    println(response.body?.string())
  }
}
`.trim())
  })

  test('should build a POST request with body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "body": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = KotlinOkHttp.generate(config, httpRequest)
    expect(result).toBe("import okhttp3.*\n\nfun main() {\n  val client = OkHttpClient()\n\n  val body = RequestBody.create(\n    MediaType.get(\"application/json; charset=utf-8\"),\"{\\\"key1\\\":\\\"value1\\\"}\"\n  )\n\n  val request = Request.Builder()\n    .url(\"https://example.com\")\n    .method(\"POST\", body)\n    .build()\n\n  client.newCall(request).execute().use { response ->\n    println(response.body?.string())\n  }\n}")
  })

  test('should build a POST request with advanced json body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "body": {
        "key1": "value1",
        "key2": {
          "key3": "value3"
        },
        "key4": [
          "value4",
          "value5"
        ],
        "empty": null
      }
    }
    const config: Config = {}
    const result = KotlinOkHttp.generate(config, httpRequest)
    expect(result).toBe("import okhttp3.*\n\nfun main() {\n  val client = OkHttpClient()\n\n  val body = RequestBody.create(\n    MediaType.get(\"application/json; charset=utf-8\"),\"{\\\"key1\\\":\\\"value1\\\",\\\"key2\\\":{\\\"key3\\\":\\\"value3\\\"},\\\"key4\\\":[\\\"value4\\\",\\\"value5\\\"],\\\"empty\\\":null}\"\n  )\n\n  val request = Request.Builder()\n    .url(\"https://example.com\")\n    .method(\"POST\", body)\n    .build()\n\n  client.newCall(request).execute().use { response ->\n    println(response.body?.string())\n  }\n}")
  })

  test('should build a POST request with form-urlencoded body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "body": {
        "username": "user123",
        "email": "user@example.com"
      }
    }
    const config: Config = {}
    const result = KotlinOkHttp.generate(config, httpRequest)
    expect(result).toBe(`
import okhttp3.*

fun main() {
  val client = OkHttpClient()

  val formBuilder = FormBody.Builder()
  formBuilder.add("username", "user123")
  formBuilder.add("email", "user@example.com")
  val body = formBuilder.build()

  val request = Request.Builder()
    .url("https://example.com")
    .method("POST", body)
    .addHeader("Content-Type", "application/x-www-form-urlencoded")
    .build()

  client.newCall(request).execute().use { response ->
    println(response.body?.string())
  }
}
`.trim())
  })

  test('should build a POST request with text/plain body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "text/plain"
      },
      "body": "Simple plain text message"
    }
    const config: Config = {}
    const result = KotlinOkHttp.generate(config, httpRequest)
    expect(result).toBe(`
import okhttp3.*

fun main() {
  val client = OkHttpClient()

  val body = RequestBody.create(
    MediaType.get("text/plain; charset=utf-8"),
    "Simple plain text message"
  )

  val request = Request.Builder()
    .url("https://example.com")
    .method("POST", body)
    .addHeader("Content-Type", "text/plain")
    .build()

  client.newCall(request).execute().use { response ->
    println(response.body?.string())
  }
}
`.trim())
  })

  test('should build a POST request with error handling', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "name": "test"
      }
    }
    const config: Config = {
      "handleErrors": true
    }
    const result = KotlinOkHttp.generate(config, httpRequest)
    expect(result).toBe("import okhttp3.*\n\nfun main() {\n  try {\n    val client = OkHttpClient()\n\n    val body = RequestBody.create(\n      MediaType.get(\"application/json; charset=utf-8\"),\"{\\\"name\\\":\\\"test\\\"}\"\n    )\n\n    val request = Request.Builder()\n      .url(\"https://example.com\")\n      .method(\"POST\", body)\n      .addHeader(\"Content-Type\", \"application/json\")\n      .build()\n\n    client.newCall(request).execute().use { response ->\n      println(response.body?.string())\n    }\n  } catch (e: Exception) {\n    println(\"Error: ${e.message}\")\n  }\n}")
  })

  test('should build a GET request with URL parameters', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com",
      "params": {
        "address.zip": "66031",
        "address.country": "Wallis"
      }
    }
    const config: Config = {}
    const result = KotlinOkHttp.generate(config, httpRequest)
    expect(result).toBe(`
import okhttp3.*

fun main() {
  val client = OkHttpClient()

  val request = Request.Builder()
    .url("https://example.com/?address.zip=66031&address.country=Wallis")
    .method("GET", null)
    .build()

  client.newCall(request).execute().use { response ->
    println(response.body?.string())
  }
}
`.trim())
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com",
      "params": {
        "tags": [
          "alpha",
          "beta"
        ],
        "category": "backend"
      }
    }
    const config: Config = {}
    const result = KotlinOkHttp.generate(config, httpRequest)
    expect(result).toBe(`
import okhttp3.*

fun main() {
  val client = OkHttpClient()

  val request = Request.Builder()
    .url("https://example.com/?tags=alpha&tags=beta&category=backend")
    .method("GET", null)
    .build()

  client.newCall(request).execute().use { response ->
    println(response.body?.string())
  }
}
`.trim())
  })

})
