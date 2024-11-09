import { Builder } from '../utils/builder'
import { Config, Http, Generator } from '../types'

export default {
  language: 'python',
  target: 'requests',
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
      params.push('headers=headers')
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

    if (hasCookies) {
      params.push('cookies=cookies')
      builder.line('cookies = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.cookies!)) {
        builder.line(`"${key}": "${value}",`)
      }
      builder.outdent()
      builder.line('}')
    }

    if (hasPayload) {
      params.push('data=data')
      builder.line('data = ' + JSON.stringify(http.body))
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
} as Generator