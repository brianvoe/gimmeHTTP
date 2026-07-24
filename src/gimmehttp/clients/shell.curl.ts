import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  BuildUrlWithParams,
  ContentTypeIncludes,
  FormatCookieHeader,
  GetContentType,
  HasBody,
  IsObjectBody
} from '../utils/utils'

function escapeSingleQuoted(value: string): string {
  return value.replace(/'/g, "'\\''")
}

export default {
  default: true,
  language: 'shell',
  client: 'curl',
  generate(config: Config, http: Http): string {
    const indent = config.indent || '  '
    const builder = new Builder({
      indent,
      join: config.join || ' \\\n'
    })

    const hasContent = HasBody(http.body)
    const method = http.method.toUpperCase()
    const url = BuildUrlWithParams(http.url, http.params)

    // curl defaults to GET, and defaults to POST when -d is present.
    builder.line('curl "%s"', url)

    // Everything is indented
    builder.indent()

    if ((hasContent && method !== 'POST') || (!hasContent && method !== 'GET')) {
      builder.line('--request %r', method)
    }

    // Add headers
    if (http.headers) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line('-H "%s"', `${key}: ${val}`)
          }
        } else {
          builder.line('-H "%s"', `${key}: ${value}`)
        }
      }
    }

    // Add cookies
    if (http.cookies) {
      builder.line('-b "%s"', FormatCookieHeader(http.cookies))
    }

    // Add body
    if (hasContent) {
      const contentType = GetContentType(http.headers)

      if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        // Pretty-print JSON inside a multi-line single-quoted string for readability.
        // Embedded newlines stay in one builder line so curl line-continuations aren't injected into the JSON.
        const pretty = JSON.stringify(http.body, null, indent)
        builder.line("-d '%r'", escapeSingleQuoted(pretty))
      } else if (ContentTypeIncludes(contentType, 'form') && IsObjectBody(http.body)) {
        // One -d per field keeps form payloads easy to scan
        for (const [key, value] of Object.entries(http.body)) {
          const encoded = `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
          builder.line("-d '%r'", escapeSingleQuoted(encoded))
        }
      } else if (typeof http.body === 'string') {
        builder.line("-d '%r'", escapeSingleQuoted(http.body))
      }
    }

    // Output code
    let output = builder.output()

    // Remove the trailing backslash from the last line
    output = output.replace(/\\\s*$/, '').trim()

    return output
  }
} as Client
