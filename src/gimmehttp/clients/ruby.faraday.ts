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

    if (config.handleErrors) {
      builder.line('begin')
      builder.indent()
    }

    builder.line('conn = Faraday.new(url: "' + http.url + '") do |f|')
    builder.indent()
    builder.line('f.adapter Faraday.default_adapter')
    builder.outdent()
    builder.line('end')
    builder.line()
    builder.line('response = conn.' + http.method.toLowerCase() + ' do |req|')
    builder.indent()
    builder.line('req.url "' + http.url + '"')

    // URL Parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`req.params["${key}"] = "${val}"`)
          }
        } else {
          builder.line(`req.params["${key}"] = "${value}"`)
        }
      }
    }

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

    if (config.handleErrors) {
      builder.outdent()
      builder.line('rescue Faraday::Error => e')
      builder.indent()
      builder.line('puts "Error: #{e.message}"')
      builder.outdent()
      builder.line('end')
    }

    return builder.output()
  }
} as Client
