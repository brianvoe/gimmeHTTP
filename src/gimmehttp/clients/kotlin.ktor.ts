import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetContentType, HasBody, IsStringBody, IsObjectBody, ContentTypeIncludes } from '../utils/utils'

export default {
  default: true,
  language: 'kotlin',
  client: 'ktor',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    const hasBody = HasBody(http.body)
    const contentType = GetContentType(http.headers)

    builder.line('import io.ktor.client.*')
    builder.line('import io.ktor.client.engine.cio.*')
    builder.line('import io.ktor.client.request.*')
    builder.line('import io.ktor.client.statement.*')
    if (hasBody && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))) {
      builder.line('import io.ktor.http.*')
      builder.line('import kotlinx.serialization.json.*')
    }
    if (contentType && ContentTypeIncludes(contentType, 'form')) {
      builder.line('import io.ktor.http.*')
    }
    builder.line()

    builder.line('suspend fun main() {')
    builder.indent()

    if (config.handleErrors) {
      builder.line('try {')
      builder.indent()
    }

    builder.line('val client = HttpClient(CIO)')
    builder.line()
    builder.line(`val response: HttpResponse = client.${http.method.toLowerCase()} {`)
    builder.indent()
    builder.line(`url("${http.url}")`)

    // URL Parameters
    if (http.params && Object.keys(http.params).length > 0) {
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`parameter("${key}", "${val}")`)
          }
        } else {
          builder.line(`parameter("${key}", "${value}")`)
        }
      }
    }

    if (http.headers && Object.keys(http.headers).length > 0) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`header("${key}", "${val}")`))
        } else {
          builder.line(`header("${key}", "${value}")`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      const cookieString = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`header("Cookie", "${cookieString}")`)
    }

    if (hasBody) {
      if (ContentTypeIncludes(contentType, 'form')) {
        builder.line('setBody(')
        builder.indent()
        builder.line('FormDataContent(Parameters.build {')
        builder.indent()
        for (const [key, value] of Object.entries(http.body)) {
          builder.line(`append("${key}", "${value}")`)
        }
        builder.outdent()
        builder.line('})')
        builder.outdent()
        builder.line(')')
      } else if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        builder.line('contentType(ContentType.Application.Json)')
        builder.line('setBody(')
        builder.indent()
        builder.line('buildJsonObject {')
        builder.indent()
        for (const [key, value] of Object.entries(http.body)) {
          if (typeof value === 'string') {
            builder.line(`put("${key}", "${value}")`)
          } else if (typeof value === 'number') {
            builder.line(`put("${key}", ${value})`)
          } else if (typeof value === 'boolean') {
            builder.line(`put("${key}", ${value})`)
          } else if (value === null) {
            builder.line(`put("${key}", JsonNull)`)
          } else {
            builder.line(`put("${key}", JsonPrimitive(${JSON.stringify(value)}))`)
          }
        }
        builder.outdent()
        builder.line('}')
        builder.outdent()
        builder.line(')')
      } else if (IsStringBody(http.body)) {
        builder.line(`setBody("${http.body.replace(/"/g, '\\"')}")`)
      }
    }

    builder.outdent()
    builder.line('}')
    builder.line()
    builder.line('println(response.bodyAsText())')
    builder.line('client.close()')

    if (config.handleErrors) {
      builder.outdent()
      builder.line('} catch (e: Exception) {')
      builder.indent()
      builder.line('println("Error: ${e.message}")')
      builder.outdent()
      builder.line('}')
    }

    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Client
