import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Target } from '../utils/registry'

export default {
  language: 'node',
  client: 'fetch',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('const fetch = require("node-fetch");')
    builder.line()

    builder.line('fetch("' + http.url + '", {')
    builder.indent()
    builder.line('method: "' + http.method.toUpperCase() + '",')

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
      builder.line('body: ')
      builder.indent()
      formatJsonBody(http.body, builder)
      builder.append(',')
    }

    builder.outdent()
    builder.line('})')

    if (config.handleErrors) {
      builder.line('.then(response => {')
      builder.indent()
      builder.line('if (!response.ok) {')
      builder.indent()
      builder.line('throw new Error("response not ok");')
      builder.outdent()
      builder.line('}')
      builder.line('return response.text();')
      builder.outdent()
      builder.line('})')
      builder.line('.then(data => console.log(data))')
      builder.line('.catch(error => console.error("error:", error));')
    } else {
      builder.line('.then(response => response.text())')
      builder.line('.then(data => console.log(data))')
    }

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
