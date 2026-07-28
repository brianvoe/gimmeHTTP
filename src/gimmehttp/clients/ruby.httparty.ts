import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ContentTypeIncludes, GetContentType, HasBody, IsObjectBody, IsStringBody } from '../utils/utils'

export default {
  language: 'ruby',
  client: 'httparty',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n',
      json: { nullLiteral: 'nil' }
    })
    const options: string[] = []
    const contentType = GetContentType(http.headers)
    const needsJson = HasBody(http.body) && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))

    builder.line('require "httparty"')
    if (needsJson) builder.line('require "json"')
    builder.line()

    if (config.handleErrors) {
      builder.line('begin')
      builder.indent()
    }

    if (http.headers && Object.keys(http.headers).length > 0) {
      builder.line('headers = ')
      builder.json(http.headers)
      options.push('headers: headers')
    }

    if (http.params && Object.keys(http.params).length > 0) {
      if (options.length > 0) builder.line()
      builder.line('query = ')
      builder.json(http.params)
      options.push('query: query')
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      if (options.length > 0) builder.line()
      builder.line('cookies = ')
      builder.json(http.cookies)
      options.push('cookies: cookies')
    }

    if (HasBody(http.body)) {
      if (options.length > 0) builder.line()
      if (needsJson) {
        builder.line('body = ')
        builder.json(http.body)
        builder.append('.to_json')
      } else if (ContentTypeIncludes(contentType, 'form') && IsObjectBody(http.body)) {
        builder.line('body = ')
        builder.json(http.body)
      } else if (IsStringBody(http.body)) {
        builder.line('body = "%s"', http.body)
      } else {
        builder.line('body = "%s"', JSON.stringify(http.body))
      }
      options.push('body: body')
    }

    if (options.length > 0) builder.line()
    builder.line(
      'response = HTTParty.%r("%s"%r)',
      http.method.toLowerCase(),
      http.url,
      options.length > 0 ? `, ${options.join(', ')}` : ''
    )
    builder.line('puts response.body')

    if (config.handleErrors) {
      builder.outdent()
      builder.line('rescue HTTParty::Error => e')
      builder.indent()
      builder.line('puts "Error: #{e.message}"')
      builder.outdent()
      builder.line('end')
    }

    return builder.output()
  }
} as Client
