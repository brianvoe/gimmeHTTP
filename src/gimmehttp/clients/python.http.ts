import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  ParseUrl,
  GetContentType,
  IsStringBody,
  IsObjectBody,
  ContentTypeIncludes,
  FormatCookieHeader,
  EscapeDoubleQuoted
} from '../utils/utils'

export default {
  default: true,
  language: 'python',
  client: 'http',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n',
      json: { nullLiteral: 'None' }
    })
    const method = http.method.toUpperCase()
    const hasPayload = method !== 'GET' && http.body !== undefined && http.body !== null
    const hasHeaders = http.headers && Object.keys(http.headers).length > 0
    const hasCookies = http.cookies && Object.keys(http.cookies).length > 0
    let params: string[] = []

    builder.line('import http.client')
    builder.line('import json')
    builder.line()

    if (config.handleErrors) {
      builder.line('try:')
      builder.indent()
    }

    const { hostname, path, port, protocol, params: existingParams } = ParseUrl(http.url)

    // Build path with parameters
    let finalPath = `"${path}"`
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('from urllib.parse import urlencode')
      builder.line('params = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          builder.line(`"${key}": [${value.map((v) => `"${v}"`).join(', ')}],`)
        } else {
          builder.line(`"${key}": "${value}",`)
        }
      }
      builder.outdent()
      builder.line('}')
      builder.line('query_string = urlencode(params, doseq=True)')
      builder.line(`final_path = f"${path}${existingParams ? `${existingParams}&` : '?'}{query_string}"`)
      finalPath = 'final_path'
    }

    builder.line(
      `conn = http.client.${protocol === 'https:' ? 'HTTPSConnection' : 'HTTPConnection'}("${EscapeDoubleQuoted(hostname)}", ${port})`
    )

    // Headers
    if (
      hasHeaders ||
      hasCookies ||
      (hasPayload && IsObjectBody(http.body) && !ContentTypeIncludes(GetContentType(http.headers), 'form'))
    ) {
      builder.line()
      params.push('headers')
      builder.line('headers = {')
      builder.indent()
      if (http.headers) {
        for (const [key, value] of Object.entries(http.headers)) {
          if (Array.isArray(value)) {
            builder.line(`"${key}": "${value.join(', ')}",`)
          } else {
            builder.line(`"${key}": "${value}",`)
          }
        }
      }
      if (
        hasPayload &&
        IsObjectBody(http.body) &&
        !ContentTypeIncludes(GetContentType(http.headers), 'form') &&
        !Object.keys(http.headers || {}).some((key) => key.toLowerCase() === 'content-type')
      ) {
        builder.line('"Content-Type": "application/json",')
      }
      if (hasCookies) builder.line(`"Cookie": "${EscapeDoubleQuoted(FormatCookieHeader(http.cookies!))}",`)
      builder.outdent()
      builder.line('}')
    }

    // Payload
    if (hasPayload) {
      builder.line()
      const contentType = GetContentType(http.headers)

      if (ContentTypeIncludes(contentType, 'form')) {
        builder.line('from urllib.parse import urlencode')
        builder.line('payload_dict = ')
        builder.json(http.body)
        builder.line('payload = urlencode(payload_dict)')
      } else if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        builder.line('payload_dict = ')
        builder.json(http.body)
        builder.line('payload = json.dumps(payload_dict)')
      } else if (IsStringBody(http.body)) {
        builder.line(`payload = "${EscapeDoubleQuoted(http.body)}"`)
      }
    }

    builder.line()
    if (hasPayload) {
      builder.line(
        `conn.request("${method}", ${finalPath}, body=payload${params.includes('headers') ? ', headers=headers' : ''})`
      )
    } else {
      builder.line(`conn.request("${method}", ${finalPath}${params.includes('headers') ? ', headers=headers' : ''})`)
    }
    builder.line('res = conn.getresponse()')
    builder.line('data = res.read()')
    builder.line()
    builder.line('print(data.decode("utf-8"))')

    if (config.handleErrors) {
      builder.outdent()
      builder.line('except Exception as e:')
      builder.indent()
      builder.line('print(f"Error: {e}")')
      builder.outdent()
    }

    return builder.output()
  }
} as Client
