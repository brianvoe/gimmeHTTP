import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ParseUrl } from '../utils/utils'

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

    const { hostname, path, port, protocol } = ParseUrl(http.url)
    builder.line(`conn = http.client.HTTPSConnection("${hostname}", ${port})`)
    builder.line()

    // Payload
    if (hasPayload) {
      params.push('payload')
      builder.line('payload = ')
      builder.indent()
      formatJsonBody(http.body, builder)
      builder.line()
    }

    // Headers
    if (hasHeaders) {
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
      builder.line()
    }

    // Cookies
    if (hasCookies) {
      params.push('cookies')
      builder.line('cookies = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.cookies!)) {
        builder.line(`"${key}": "${value}",`)
      }
      builder.outdent()
      builder.line('}')
      builder.line()
    }

    // Build request based upon whether headers, cookies and payload are present
    builder.line(`conn.request("${method}", "${path}"` + (params.length > 0 ? `, ${params.join(', ')}` : '') + ')')

    builder.line('res = conn.getresponse()')
    builder.line('data = res.read()')
    builder.line()
    builder.line('print(data.decode("utf-8"))')

    return builder.output()
  }
} as Client

function formatJsonBody(body: any, builder: Builder): void {
  const lines = JSON.stringify(body, null, builder.getIndent()).split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (i === 0) {
      builder.append(line)
      continue
    }

    // If last line, outdent
    if (i === lines.length - 1) {
      builder.outdent()
    }

    builder.line(line)
  }
}
