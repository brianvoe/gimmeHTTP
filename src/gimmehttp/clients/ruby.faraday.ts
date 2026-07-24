import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  ContentTypeIncludes,
  EscapeDoubleQuoted,
  GetContentType,
  HasBody,
  IsObjectBody,
  IsStringBody
} from '../utils/utils'

export default {
  language: 'ruby',
  client: 'faraday',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n',
      json: { nullLiteral: 'nil', escapeString: EscapeDoubleQuoted }
    })
    const rubyString = EscapeDoubleQuoted
    const contentType = GetContentType(http.headers)
    const needsJson =
      HasBody(http.body) && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))

    builder.line('require "faraday"')
    if (needsJson) builder.line('require "json"')
    if (HasBody(http.body) && ContentTypeIncludes(contentType, 'form')) builder.line('require "uri"')
    builder.line()

    if (config.handleErrors) {
      builder.line('begin')
      builder.indent()
    }

    builder.line(`conn = Faraday.new(url: "${rubyString(http.url)}") do |f|`)
    builder.indent()
    if (config.handleErrors) builder.line('f.response :raise_error')
    builder.line('f.adapter Faraday.default_adapter')
    builder.outdent()
    builder.line('end')
    builder.line()
    builder.line(`response = conn.run_request(:${http.method.toLowerCase()}, "${rubyString(http.url)}", nil) do |req|`)
    builder.indent()

    // URL Parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          builder.line(`req.params["${rubyString(key)}"] = [${value.map((val) => `"${rubyString(val)}"`).join(', ')}]`)
        } else {
          builder.line(`req.params["${rubyString(key)}"] = "${rubyString(value)}"`)
        }
      }
    }

    if (http.headers) {
      builder.line()
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`req.headers.add("${rubyString(key)}", "${rubyString(val)}")`))
        } else {
          builder.line(`req.headers["${rubyString(key)}"] = "${rubyString(value)}"`)
        }
      }
    }

    if (http.cookies) {
      builder.line()
      const cookieString = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`req.headers["Cookie"] = "${rubyString(cookieString)}"`)
    }

    if (HasBody(http.body)) {
      builder.line()

      if (needsJson) {
        builder.line('req.body = ')
        builder.json(http.body)
        builder.append('.to_json')
      } else if (ContentTypeIncludes(contentType, 'form')) {
        builder.line('req.body = URI.encode_www_form(')
        builder.json(http.body)
        builder.append(')')
      } else if (IsStringBody(http.body)) {
        builder.line(`req.body = "${rubyString(http.body)}"`)
      } else {
        builder.line(`req.body = "${rubyString(JSON.stringify(http.body))}"`)
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
