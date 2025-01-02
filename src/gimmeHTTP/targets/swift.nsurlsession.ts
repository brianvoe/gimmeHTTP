import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Target } from '../utils/registry'

export default {
  default: true,
  language: 'swift',
  client: 'nsurlsession',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('import Foundation')
    builder.line()
    builder.line('let url = URL(string: "' + http.url + '")!')
    builder.line('var request = URLRequest(url: url)')
    builder.line('request.httpMethod = "' + http.method.toUpperCase() + '"')
    builder.line()

    if (http.headers && Object.keys(http.headers).length > 0) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`request.addValue("${val}", forHTTPHeaderField: "${key}")`))
        } else {
          builder.line(`request.addValue("${value}", forHTTPHeaderField: "${key}")`)
        }
      }

      builder.line()
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      for (const [key, value] of Object.entries(http.cookies)) {
        builder.line(`request.addValue("${key}=${value}", forHTTPHeaderField: "Cookie")`)
      }

      builder.line()
    }

    if (http.body) {
      builder.line('let body = ')
      builder.indent()
      formatJsonBody(http.body, builder)
      builder.line('request.httpBody = body')
      builder.line()
    }

    builder.line('let task = URLSession.shared.dataTask(with: request) { data, response, error in')
    builder.indent()
    builder.line('if let error = error {')
    builder.indent()
    builder.line('print("Error: \\(error)")')
    builder.line('return')
    builder.outdent()
    builder.line('}')
    builder.line()

    builder.line('if let httpResponse = response as? HTTPURLResponse {')
    builder.indent()
    builder.line('if httpResponse.statusCode == 200, let data = data {')
    builder.indent()
    builder.line('let responseString = String(data: data, encoding: .utf8)')
    builder.line('print(responseString ?? "No response data")')
    builder.outdent()
    builder.line('} else {')
    builder.indent()
    builder.line('print("Request failed with status code: \\(httpResponse.statusCode)")')
    builder.outdent()
    builder.line('}')
    builder.outdent()
    builder.line('}')
    builder.outdent()
    builder.line('}')
    builder.line()

    builder.line('task.resume()')

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
