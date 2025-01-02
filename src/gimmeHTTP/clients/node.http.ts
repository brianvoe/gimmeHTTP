import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Target } from '../utils/registry'

export default {
  language: 'node',
  client: 'http',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('const http = require("http");')
    builder.line()

    builder.line('const options = {')
    builder.indent()
    builder.line(`method: "${http.method.toUpperCase()}",`)
    builder.line(`hostname: "${new URL(http.url).hostname}",`)
    builder.line(`path: "${new URL(http.url).pathname}${new URL(http.url).search}",`)

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
    builder.outdent()
    builder.line('};')
    builder.line()

    builder.line('const req = http.request(options, (res) => {')
    builder.indent()
    builder.line('let data = "";')
    builder.line()
    builder.line('res.on("data", (chunk) => {')
    builder.indent()
    builder.line('data += chunk;')
    builder.outdent()
    builder.line('});')
    builder.line()
    builder.line('res.on("end", () => {')
    builder.indent()
    builder.line('console.log(data);')
    builder.outdent()
    builder.line('});')
    builder.outdent()
    builder.line('});')

    if (config.handleErrors) {
      builder.line()
      builder.line('req.on("error", (error) => {')
      builder.indent()
      builder.line('console.error(error);')
      builder.outdent()
      builder.line('});')
    }

    builder.line()

    if (http.body) {
      builder.line('req.write(')
      builder.indent()
      formatJsonBody(http.body, builder)
      builder.append(');')
    }
    builder.line('req.end();')

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
