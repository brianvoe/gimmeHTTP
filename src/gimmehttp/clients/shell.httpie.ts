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
  client: 'httpie',
  generate(config: Config, http: Http): string {
    const indent = config.indent || '  '
    const builder = new Builder({ indent, join: config.join || ' \\\n' })
    const contentType = GetContentType(http.headers)
    const url = BuildUrlWithParams(http.url, http.params)

    builder.line('http %r "%s"', http.method.toUpperCase(), url)
    builder.indent()

    if (http.headers) {
      for (const [key, value] of Object.entries(http.headers)) {
        const values = Array.isArray(value) ? value : [value]
        values.forEach((headerValue) => builder.line("'%r'", escapeSingleQuoted(`${key}:${headerValue}`)))
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line("'%r'", escapeSingleQuoted(`Cookie:${FormatCookieHeader(http.cookies)}`))
    }

    if (HasBody(http.body)) {
      if (ContentTypeIncludes(contentType, 'form') && IsObjectBody(http.body)) {
        for (const [key, value] of Object.entries(http.body)) {
          builder.line("'%r'", escapeSingleQuoted(`${key}=${value}`))
        }
      } else if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        builder.line("<<< '%r'", escapeSingleQuoted(JSON.stringify(http.body, null, indent)))
      } else if (IsStringBody(http.body)) {
        builder.line("<<< '%r'", escapeSingleQuoted(http.body))
      }
    }

    return builder.output().replace(/\\\s*$/, '').trim()
  }
} as Client
