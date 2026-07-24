import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { FormatCookieHeader, IsObjectBody } from '../utils/utils'

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
      builder.line('var urlComponents = URLComponents(string: "%s")!', http.url)
      builder.line('var queryItems: [URLQueryItem] = []')
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line('queryItems.append(URLQueryItem(name: "%s", value: "%s"))', key, val)
          }
        } else {
          builder.line('queryItems.append(URLQueryItem(name: "%s", value: "%s"))', key, value)
        }
      }
      builder.line('urlComponents.queryItems = queryItems')
      builder.line('let url = urlComponents.url!')
    } else {
      builder.line('let url = URL(string: "%s")!', http.url)
    }
    builder.line('var request = URLRequest(url: url)')
    builder.line('request.httpMethod = "%s"', http.method.toUpperCase())

    if (http.headers && Object.keys(http.headers).length > 0) {
      builder.line()
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line('request.addValue("%s", forHTTPHeaderField: "%s")', val, key))
        } else {
          builder.line('request.addValue("%s", forHTTPHeaderField: "%s")', value, key)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line()
      builder.line('request.addValue("%s", forHTTPHeaderField: "Cookie")', FormatCookieHeader(http.cookies))
    }

    if (http.body) {
      builder.line()
      if (typeof http.body === 'string') {
        builder.line('let bodyString = "%s"', http.body)
        builder.line('request.httpBody = bodyString.data(using: .utf8)')
      } else if (IsObjectBody(http.body)) {
        builder.line('let json = ')
        builder.jsonStringLiteral(http.body)
        builder.line('request.httpBody = json.data(using: .utf8)')
      }
    }

    builder.line()
    builder.line('do {')
    builder.indent()
    builder.line('let (data, response) = try await URLSession.shared.data(for: request)')
    builder.line('guard let httpResponse = response as? HTTPURLResponse else {')
    builder.indent()
    builder.line('print("Invalid response")')
    builder.line('return')
    builder.outdent()
    builder.line('}')
    builder.line()
    builder.line('guard (200..<300).contains(httpResponse.statusCode) else {')
    builder.indent()
    builder.line('print("Request failed with status code: \\(httpResponse.statusCode)")')
    builder.line('return')
    builder.outdent()
    builder.line('}')
    builder.line('let responseString = String(data: data, encoding: .utf8)')
    builder.line('print(responseString ?? "No response data")')
    builder.outdent()
    builder.line('} catch {')
    builder.line()
    builder.indent()
    builder.line('print("Error: \\(error)")')
    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Client
