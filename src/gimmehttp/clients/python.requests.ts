import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetContentType, ContentTypeIncludes, IsObjectBody, IsStringBody, EscapeDoubleQuoted } from '../utils/utils'

export default {
  language: 'python',
  client: 'requests',
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

    builder.line('import requests')
    builder.line()

    if (config.handleErrors) {
      builder.line('try:')
      builder.indent()
    }

    builder.line('url = "' + http.url + '"')

    // URL Parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line()
      params.push('params=url_params')
      builder.line('url_params = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          builder.line(`"${key}": [${value.map((v) => `"${v}"`).join(', ')}]`)
        } else {
          builder.line(`"${key}": "${value}"`)
        }

        if (Object.keys(http.params).indexOf(key) !== Object.keys(http.params).length - 1) {
          builder.append(',')
        }
      }
      builder.outdent()
      builder.line('}')
    }

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
      const contentType = GetContentType(http.headers)

      // String bodies are passed inline, everything else gets its own variable
      if (IsStringBody(http.body)) {
        params.push(`data="${EscapeDoubleQuoted(http.body)}"`)
      } else {
        builder.line()

        if (ContentTypeIncludes(contentType, 'form')) {
          params.push('data=form_data')
          builder.line('form_data = ')
        } else if (IsObjectBody(http.body) && (ContentTypeIncludes(contentType, 'json') || !contentType)) {
          params.push('json=json_data')
          builder.line('json_data = ')
        } else {
          params.push('data=payload')
          builder.line('payload = ')
        }

        builder.json(http.body)
      }
    }

    builder.line()
    builder.line(
      'response = requests.' +
        http.method.toLowerCase() +
        '(url' +
        (params.length > 0 ? `, ${params.join(', ')}` : '') +
        ')'
    )
    if (config.handleErrors) builder.line('response.raise_for_status()')
    builder.line('print(response.text)')

    if (config.handleErrors) {
      builder.outdent()
      builder.line('except requests.exceptions.RequestException as e:')
      builder.indent()
      builder.line('print(f"Error: {e}")')
      builder.outdent()
    }

    return builder.output()
  }
} as Client
