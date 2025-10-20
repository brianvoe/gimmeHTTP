import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetContentType, IsStringBody, IsObjectBody, ContentTypeIncludes } from '../utils/utils'

export default {
  language: 'ruby',
  client: 'faraday',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('require "faraday"')
    builder.line()
    builder.line('conn = Faraday.new(url: "' + http.url + '") do |f|')
    builder.indent()
    builder.line('f.adapter Faraday.default_adapter')
    builder.outdent()
    builder.line('end')
    builder.line()
    builder.line('response = conn.' + http.method.toLowerCase() + ' do |req|')
    builder.indent()
    builder.line('req.url "' + http.url + '"')

    if (http.headers) {
      builder.line()
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`req.headers["${key}"] = "${val}"`))
        } else {
          builder.line(`req.headers["${key}"] = "${value}"`)
        }
      }
    }

    if (http.cookies) {
      builder.line()
      const cookieString = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`req.headers["Cookie"] = "${cookieString}"`)
    }

    if (http.body) {
      builder.line()
      const contentType = GetContentType(http.headers)

      if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        builder.line('req.body = ')
        builder.json(http.body)
        builder.append('.to_json')
      } else if (IsStringBody(http.body)) {
        builder.line(`req.body = "${http.body.replace(/"/g, '\\"')}"`)
      } else {
        // For form data or other objects, convert to JSON string
        builder.line('req.body = ')
        builder.json(http.body)
        builder.append('.to_json')
      }
    }

    builder.outdent()
    builder.line('end')
    builder.line()
    builder.line('puts response.body')

    return builder.output()
  }
} as Client
