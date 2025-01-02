import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'

export default {
  language: 'javascript',
  client: 'jquery',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('$.ajax({')
    builder.indent()
    builder.line(`url: "${http.url}",`)
    builder.line(`type: "${http.method.toUpperCase()}",`)

    if (http.headers) {
      builder.line('headers: {')
      builder.indent()
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          builder.line(`"${key}": "${value.join(', ')}",`)
        } else {
          builder.line(`"${key}": "${value}",`)
        }
      }
      builder.outdent()
      builder.line('},')
    }

    if (http.body) {
      builder.line('data: ')
      builder.indent()
      formatJsonBody(http.body, builder)
      builder.append(',')
      builder.line('contentType: "application/json",')
    }

    // Note: Cookies are not supported in jQuery

    builder.line('success: function(data) {')
    builder.indent()
    builder.line('console.log(data);')
    builder.outdent()
    builder.line('},')

    if (config.handleErrors) {
      builder.line('error: function(jqXHR, textStatus, errorThrown) {')
      builder.indent()
      builder.line('console.error("Request failed:", textStatus, errorThrown);')
      builder.outdent()
      builder.line('},')
    }

    builder.outdent()
    builder.line('});')

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
