import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Target } from '../utils/registry'

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
      builder.line('data = ')
      builder.indent()
      formatJsonBody(http.body, builder)
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
} as Target

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
