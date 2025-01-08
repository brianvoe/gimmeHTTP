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
      builder.json(http.body)
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
