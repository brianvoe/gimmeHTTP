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
      params.push('payload')
      builder.line('payload = ')
      builder.json(http.body)
    }

    // Build request based upon whether headers, cookies and payload are present
    builder.line()
    builder.line(`conn.request("${method}", "${path}"` + (params.length > 0 ? `, ${params.join(', ')}` : '') + ')')
    builder.line('res = conn.getresponse()')
    builder.line('data = res.read()')
    builder.line()
    builder.line('print(data.decode("utf-8"))')

    return builder.output()
  }
} as Client
