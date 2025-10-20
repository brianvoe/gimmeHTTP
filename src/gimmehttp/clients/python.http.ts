import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ParseUrl, GetContentType, IsStringBody, IsObjectBody, ContentTypeIncludes } from '../utils/utils'

export default {
  default: true,
  language: 'python',
  client: 'http',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })
    const method = http.method.toUpperCase()
    const hasPayload = method !== 'GET' && http.body
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

    const { hostname, path, port, protocol } = ParseUrl(http.url)
    builder.line(`conn = http.client.HTTPSConnection("${hostname}", ${port})`)

    // Headers
    if (hasHeaders) {
      builder.line()
      params.push('headers')
      builder.line('headers = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.headers!)) {
        if (Array.isArray(value)) {
          builder.line(`"${key}": "${value.join(', ')}",`)
        } else {
          builder.line(`"${key}": "${value}",`)
        }
      }
      builder.outdent()
      builder.line('}')
    }

    // Cookies
    if (hasCookies) {
      builder.line()
      params.push('cookies')
      builder.line('cookies = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.cookies!)) {
        builder.line(`"${key}": "${value}",`)
      }
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
        builder.line(`payload = "${http.body.replace(/"/g, '\\"')}"`)
      }
    }

    // Build request based upon whether headers, cookies and payload are present
    builder.line()
    if (hasPayload) {
      const otherParams = params.filter((p) => p !== 'payload')
      builder.line(
        `conn.request("${method}", "${path}", payload` +
          (otherParams.length > 0 ? `, ${otherParams.join(', ')}` : '') +
          ')'
      )
    } else {
      builder.line(`conn.request("${method}", "${path}"` + (params.length > 0 ? `, ${params.join(', ')}` : '') + ')')
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
