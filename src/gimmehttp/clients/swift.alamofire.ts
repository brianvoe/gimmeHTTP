import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { BuildUrlWithParams, FormatCookieHeader, HasBody, IsObjectBody, IsStringBody } from '../utils/utils'

export default {
  language: 'swift',
  client: 'alamofire',
  generate(config: Config, http: Http): string {
    const builder = new Builder({ indent: config.indent || '  ', join: config.join || '\n' })
    const hasBody = HasBody(http.body)
    const headers = { ...(http.headers || {}) } as Record<string, string | string[]>
    if (http.cookies && Object.keys(http.cookies).length > 0) {
      headers.Cookie = FormatCookieHeader(http.cookies)
    }

    builder.line('import Alamofire')
    builder.line()
    if (Object.keys(headers).length > 0) {
      builder.line('let headers: HTTPHeaders = [')
      builder.indent()
      for (const [key, value] of Object.entries(headers)) {
        builder.line('"%s": "%s",', key, Array.isArray(value) ? value.join(', ') : value)
      }
      builder.outdent()
      builder.line(']')
      builder.line()
    }

    const url = BuildUrlWithParams(http.url, http.params)
    const headerArgument = Object.keys(headers).length > 0 ? ', headers: headers' : ''
    const method = `.${http.method.toLowerCase()}`
    if (hasBody && IsObjectBody(http.body)) {
      builder.line('let parameters: Parameters = ')
      builder.json(http.body)
      builder.append('')
      builder.line()
      builder.line(
        'AF.request("%s", method: %r, parameters: parameters, encoding: JSONEncoding.default%r)',
        url,
        method,
        headerArgument
      )
    } else if (hasBody && IsStringBody(http.body)) {
      builder.line('var urlRequest = URLRequest(url: URL(string: "%s")!)', url)
      builder.line('urlRequest.method = %r', method)
      if (Object.keys(headers).length > 0) {
        builder.line('urlRequest.headers = headers')
      }
      builder.line('urlRequest.httpBody = "%s".data(using: .utf8)', http.body)
      builder.line('AF.request(urlRequest)')
    } else {
      builder.line('AF.request("%s", method: %r%r)', url, method, headerArgument)
    }
    builder.indent()
    builder.line('.validate()')
    builder.line('.responseString { response in')
    builder.indent()
    builder.line('switch response.result {')
    builder.line('case .success(let value):')
    builder.indent()
    builder.line('print(value)')
    builder.outdent()
    builder.line('case .failure(let error):')
    builder.indent()
    builder.line('print(error)')
    builder.outdent()
    builder.line('}')
    builder.outdent()
    builder.line('}')
    builder.outdent()
    return builder.output()
  }
} as Client
