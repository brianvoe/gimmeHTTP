import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'

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

    // Build URL with parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('var urlComponents = URLComponents(string: "' + http.url + '")!')
      builder.line('var queryItems: [URLQueryItem] = []')
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`queryItems.append(URLQueryItem(name: "${key}", value: "${val}"))`)
          }
        } else {
          builder.line(`queryItems.append(URLQueryItem(name: "${key}", value: "${value}"))`)
        }
      }
      builder.line('urlComponents.queryItems = queryItems')
      builder.line('let url = urlComponents.url!')
    } else {
      builder.line('let url = URL(string: "' + http.url + '")!')
    }
    builder.line('var request = URLRequest(url: url)')
    builder.line('request.httpMethod = "' + http.method.toUpperCase() + '"')

    if (http.headers && Object.keys(http.headers).length > 0) {
      builder.line()
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`request.addValue("${val}", forHTTPHeaderField: "${key}")`))
        } else {
          builder.line(`request.addValue("${value}", forHTTPHeaderField: "${key}")`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line()
      for (const [key, value] of Object.entries(http.cookies)) {
        builder.line(`request.addValue("${key}=${value}", forHTTPHeaderField: "Cookie")`)
      }
    }

    if (http.body) {
      builder.line()
      if (typeof http.body === 'string') {
        builder.line(`let bodyString = "${http.body.replace(/"/g, '\\"')}"`)
        builder.line('request.httpBody = bodyString.data(using: .utf8)')
      } else {
        builder.line('let bodyDict: [String: Any] = ')
        builder.json(http.body)
        builder.line('request.httpBody = try? JSONSerialization.data(withJSONObject: bodyDict)')
      }
    }

    builder.line()
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
} as Client
