import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'

export default {
  language: 'python',
  client: 'requests',
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

    builder.line('import requests')
    builder.line()
    builder.line('url = "' + http.url + '"')

    if (hasHeaders) {
      builder.line()
      params.push('headers=headers')
      builder.line('headers = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.headers!)) {
        builder.line(`"${key}": "${value}"`)

        if (Object.keys(http.headers!).indexOf(key) !== Object.keys(http.headers!).length - 1) {
          builder.append(',')
        }
      }
      builder.outdent()
      builder.line('}')
    }

    if (hasCookies) {
      builder.line()
      params.push('cookies=cookies')
      builder.line('cookies = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.cookies!)) {
        builder.line(`"${key}": "${value}"`)

        if (Object.keys(http.cookies!).indexOf(key) !== Object.keys(http.cookies!).length - 1) {
          builder.append(',')
        }
      }
      builder.outdent()
      builder.line('}')
    }

    if (hasPayload) {
      builder.line()
      params.push('data=data')
      builder.line('data = ')
      builder.json(http.body)
    }

    builder.line()
    builder.line(
      'response = requests.' +
        http.method.toLowerCase() +
        '(url' +
        (params.length > 0 ? `, ${params.join(', ')}` : '') +
        ')'
    )
    builder.line('print(response.text)')

    return builder.output()
  }
} as Client
