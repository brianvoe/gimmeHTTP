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

function escapeSingleQuoted(value: string): string {
  return value.replace(/'/g, "'\\''")
}

export default {
  language: 'shell',
  client: 'wget',
  generate(config: Config, http: Http): string {
    const indent = config.indent || '  '
    const builder = new Builder({ indent, join: config.join || ' \\\n' })
    const method = http.method.toUpperCase()
    const contentType = GetContentType(http.headers)
    const url = BuildUrlWithParams(http.url, http.params)

    builder.line('wget --method=%r', method)
    builder.indent()

    if (http.headers) {
      for (const [key, value] of Object.entries(http.headers)) {
        const values = Array.isArray(value) ? value : [value]
        values.forEach((headerValue) => builder.line("--header='%r'", escapeSingleQuoted(`${key}: ${headerValue}`)))
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line("--header='%r'", escapeSingleQuoted(`Cookie: ${FormatCookieHeader(http.cookies)}`))
    }

    if (HasBody(http.body)) {
      if (ContentTypeIncludes(contentType, 'form') && IsObjectBody(http.body)) {
        const form = new URLSearchParams()
        for (const [key, value] of Object.entries(http.body)) form.append(key, String(value))
        builder.line("--body-data='%r'", escapeSingleQuoted(form.toString()))
      } else if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        builder.line("--body-data='%r'", escapeSingleQuoted(JSON.stringify(http.body, null, indent)))
      } else if (IsStringBody(http.body)) {
        builder.line("--body-data='%r'", escapeSingleQuoted(http.body))
      }
    }

    builder.line('-O -')
    builder.line("'%r'", escapeSingleQuoted(url))

    return builder.output().replace(/\\\s*$/, '').trim()
  }
} as Client
