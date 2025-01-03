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
      builder.indent()
      formatJsonBody(http.body, builder)
      builder.append(',')
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
