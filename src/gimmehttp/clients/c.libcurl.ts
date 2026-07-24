import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  ContentTypeIncludes,
  EscapeDoubleQuoted,
  FormatCookieHeader,
  GetContentType,
  IsObjectBody,
  IsStringBody
} from '../utils/utils'

const EscapeCString = (value: string): string => EscapeDoubleQuoted(value).replace(/\?/g, '\\?')

export default {
  default: true,
  language: 'c',
  client: 'libcurl',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n',
      json: { escapeString: EscapeCString }
    })

    builder.line('#include <stdio.h>')
    builder.line('#include <curl/curl.h>')
    builder.line()
    builder.line('int main(void) {')
    builder.indent()
    builder.line('CURL *curl;')
    builder.line('CURLcode res;')
    builder.line()
    builder.line('curl_global_init(CURL_GLOBAL_DEFAULT);')
    builder.line('curl = curl_easy_init();')
    builder.line('if(curl) {')
    builder.indent()

    // Build URL with parameters using multi-line string concatenation
    if (http.params && Object.keys(http.params).length > 0) {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            params.append(key, val)
          }
        } else {
          params.append(key, value)
        }
      }
      const paramString = params.toString()
      if (paramString) {
        const separator = http.url.includes('?') ? '&' : '?'
        const paramParts = paramString.split('&')

        builder.line('curl_easy_setopt(curl, CURLOPT_URL,')
        builder.indent()
        builder.line('"%s"', http.url)
        builder.line('"%s"', separator + paramParts[0])
        for (let i = 1; i < paramParts.length; i++) {
          builder.line('"&%s"', paramParts[i])
        }
        builder.outdent()
        builder.line(');')
      } else {
        builder.line('curl_easy_setopt(curl, CURLOPT_URL, "%s");', http.url)
      }
    } else {
      builder.line('curl_easy_setopt(curl, CURLOPT_URL, "%s");', http.url)
    }

    if (http.method.toUpperCase() === 'POST') {
      builder.line('curl_easy_setopt(curl, CURLOPT_POST, 1L);')
    } else if (http.method.toUpperCase() !== 'GET') {
      builder.line('curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "%s");', http.method.toUpperCase())
    }

    const contentType = GetContentType(http.headers)
    const hasExplicitContentType = Object.keys(http.headers || {}).some((key) => key.toLowerCase() === 'content-type')
    const inferJsonContentType =
      IsObjectBody(http.body) && !hasExplicitContentType && !ContentTypeIncludes(contentType, 'form')
    const hasHeaders = (http.headers && Object.keys(http.headers).length > 0) || inferJsonContentType
    if (hasHeaders) {
      builder.line()
      builder.line('struct curl_slist *headers = NULL;')
      for (const [key, value] of Object.entries(http.headers || {})) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line('headers = curl_slist_append(headers, "%s");', `${key}: ${val}`))
        } else {
          builder.line('headers = curl_slist_append(headers, "%s");', `${key}: ${value}`)
        }
      }
      if (inferJsonContentType) {
        builder.line('headers = curl_slist_append(headers, "Content-Type: application/json");')
      }
      builder.line('curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);')
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line()
      builder.line('curl_easy_setopt(curl, CURLOPT_COOKIE, "%s");', FormatCookieHeader(http.cookies))
    }

    if (http.body) {
      builder.line()
      if (IsStringBody(http.body)) {
        const body = http.body
        builder.line('curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "%s");', body)
        builder.line('curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, %rL);', new TextEncoder().encode(body).length)
      } else if (ContentTypeIncludes(contentType, 'form')) {
        const body = new URLSearchParams(
          Object.entries(http.body).map(([key, value]) => [key, String(value)])
        ).toString()
        builder.line('curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "%s");', body)
        builder.line('curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, %rL);', new TextEncoder().encode(body).length)
      } else if (IsObjectBody(http.body)) {
        const body = JSON.stringify(http.body)
        builder.line('curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "%s");', body)
        builder.line('curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, %rL);', new TextEncoder().encode(body).length)
      }
    }

    builder.line()
    builder.line('res = curl_easy_perform(curl);')
    builder.line('if(res != CURLE_OK)')
    builder.indent()
    builder.line('fprintf(stderr, "failed: %s", curl_easy_strerror(res));')
    builder.outdent()

    if (hasHeaders) {
      builder.line('curl_slist_free_all(headers);')
    }
    builder.line('curl_easy_cleanup(curl);')
    builder.outdent()
    builder.line('}')
    builder.line()
    builder.line('curl_global_cleanup();')
    builder.line('return 0;')
    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Client
