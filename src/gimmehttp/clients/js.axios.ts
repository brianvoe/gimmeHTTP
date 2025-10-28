import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'

export default {
  language: 'javascript',
  client: 'axios',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('axios({')
    builder.indent()
    builder.line(`method: "${http.method.toLowerCase()}",`)
    builder.line(`url: "${http.url}",`)

    // URL Parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('params: {')
      builder.indent()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          builder.line(`"${key}": [${value.map((v) => `"${v}"`).join(', ')}],`)
        } else {
          builder.line(`"${key}": "${value}",`)
        }
      }
      builder.outdent()
      builder.line('},')
    }

    // Headers
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

    // Cookies
    if (http.cookies) {
      builder.line('cookies: {')
      builder.indent()
      for (const [key, value] of Object.entries(http.cookies)) {
        builder.line(`"${key}": "${value}",`)
      }
      builder.outdent()
      builder.line('},')
    }

    if (http.body) {
      builder.line('data: ')
      builder.json(http.body)
    }

    builder.outdent()
    builder.line('})')

    if (config.handleErrors) {
      builder.line('.then(response => {')
      builder.indent()
      builder.line('console.log(response.data);')
      builder.outdent()
      builder.line('})')
      builder.line('.catch(error => {')
      builder.indent()
      builder.line('console.error("There was an error:", error);')
      builder.outdent()
      builder.line('});')
    } else {
      builder.line('.then(response => console.log(response.data));')
    }

    return builder.output()
  }
} as Client
