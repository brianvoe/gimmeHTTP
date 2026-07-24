import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  ContentTypeIncludes,
  EscapeDoubleQuoted,
  FormatCookieHeader,
  GetContentType,
  HasBody,
  IsObjectBody,
  IsStringBody
} from '../utils/utils'

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
    builder.line('import io.ktor.http.*')
    builder.line()

    builder.line('suspend fun main() {')
    builder.indent()

    if (config.handleErrors) {
      builder.line('try {')
      builder.indent()
    }

    builder.line(
      config.handleErrors
        ? 'HttpClient(CIO) { expectSuccess = true }.use { client ->'
        : 'HttpClient(CIO).use { client ->'
    )
    builder.indent()
    builder.line('val response: HttpResponse = client.request {')
    builder.indent()
    builder.line(`method = HttpMethod.parse("${EscapeDoubleQuoted(http.method.toUpperCase())}")`)
    builder.line(`url("${EscapeDoubleQuoted(http.url)}")`)

    // URL Parameters
    if (http.params && Object.keys(http.params).length > 0) {
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`parameter("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(val)}")`)
          }
        } else {
          builder.line(`parameter("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(value)}")`)
        }
      }
    }

    if (http.headers && Object.keys(http.headers).length > 0) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`header("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(val)}")`))
        } else {
          builder.line(`header("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(value)}")`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line(`header("Cookie", "${EscapeDoubleQuoted(FormatCookieHeader(http.cookies))}")`)
    }

    if (hasBody) {
      if (ContentTypeIncludes(contentType, 'form')) {
        builder.line('setBody(')
        builder.indent()
        builder.line('FormDataContent(Parameters.build {')
        builder.indent()
        for (const [key, value] of Object.entries(http.body)) {
          builder.line(`append("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(String(value))}")`)
        }
        builder.outdent()
        builder.line('})')
        builder.outdent()
        builder.line(')')
      } else if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        builder.line('contentType(ContentType.Application.Json)')
        const json = JSON.stringify(http.body).replace(/\$/g, '\\$').replace(/"""/g, '\\"\\"\\"')
        builder.line(`setBody("""${json}""")`)
      } else if (IsStringBody(http.body)) {
        builder.line(`setBody("${EscapeDoubleQuoted(http.body)}")`)
      }
    }

    builder.outdent()
    builder.line('}')
    builder.line()
    builder.line('println(response.bodyAsText())')
    builder.outdent()
    builder.line('}')

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
