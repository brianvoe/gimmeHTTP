import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  BuildUrlWithParams,
  ContentTypeIncludes,
  FormatCookieHeader,
  GetContentType,
  HasBody,
  IsObjectBody,
  IsStringBody
} from '../utils/utils'

export default {
  language: 'kotlin',
  client: 'okhttp',
  generate(config: Config, http: Http): string {
    const builder = new Builder({ indent: config.indent || '  ', join: config.join || '\n' })
    const hasBody = HasBody(http.body)
    const contentType = GetContentType(http.headers)
    const isForm = hasBody && ContentTypeIncludes(contentType, 'form')
    const isJson = hasBody && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))

    builder.line('import okhttp3.*')
    builder.line()
    builder.line('fun main() {')
    builder.indent()
    if (config.handleErrors) {
      builder.line('try {')
      builder.indent()
    }
    builder.line('val client = OkHttpClient()')
    builder.line()
    let body = 'null'
    if (isForm) {
      builder.line('val formBuilder = FormBody.Builder()')
      for (const [key, value] of Object.entries(http.body)) {
        builder.line('formBuilder.add("%s", "%s")', key, String(value))
      }
      builder.line('val body = formBuilder.build()')
      body = 'body'
      builder.line()
    } else if (isJson) {
      builder.line('val body = RequestBody.create(')
      builder.indent()
      builder.line('MediaType.get("application/json; charset=utf-8"),')
      builder.jsonStringLiteral(http.body)
      builder.outdent()
      builder.line(')')
      body = 'body'
      builder.line()
    } else if (hasBody && IsStringBody(http.body)) {
      builder.line('val body = RequestBody.create(')
      builder.indent()
      builder.line('MediaType.get("%s; charset=utf-8"),', contentType || 'text/plain')
      builder.line('"%s"', http.body)
      builder.outdent()
      builder.line(')')
      body = 'body'
      builder.line()
    }

    builder.line('val request = Request.Builder()')
    builder.indent()
    builder.line('.url("%s")', BuildUrlWithParams(http.url, http.params))
    builder.line('.method("%s", %r)', http.method.toUpperCase(), body)
    for (const [key, value] of Object.entries(http.headers || {})) {
      for (const headerValue of Array.isArray(value) ? value : [value]) {
        builder.line('.addHeader("%s", "%s")', key, headerValue)
      }
    }
    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line('.addHeader("Cookie", "%s")', FormatCookieHeader(http.cookies))
    }
    builder.line('.build()')
    builder.outdent()
    builder.line()
    builder.line('client.newCall(request).execute().use { response ->')
    builder.indent()
    builder.line('println(response.body?.string())')
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
