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
  default: true,
  language: 'ruby',
  client: 'nethttp',
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

    builder.line('require "net/http"')
    builder.line('require "uri"')
    if (needsJson) builder.line('require "json"')
    builder.line()

    if (config.handleErrors) {
      builder.line('begin')
      builder.indent()
    }

    // Build URI with parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line(`uri = URI.parse("${rubyString(http.url)}")`)
      builder.line('params = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          builder.line(`"${rubyString(key)}" => [${value.map((v) => `"${rubyString(v)}"`).join(', ')}],`)
        } else {
          builder.line(`"${rubyString(key)}" => "${rubyString(value)}",`)
        }
      }
      builder.outdent()
      builder.line('}')
      builder.line('uri.query = URI.encode_www_form(params)')
    } else {
      builder.line(`uri = URI.parse("${rubyString(http.url)}")`)
    }

    if (http.method.toUpperCase() === 'GET') {
      builder.line('request = Net::HTTP::Get.new(uri)')
    } else if (http.method.toUpperCase() === 'POST') {
      builder.line('request = Net::HTTP::Post.new(uri)')
    } else if (http.method.toUpperCase() === 'PUT') {
      builder.line('request = Net::HTTP::Put.new(uri)')
    } else if (http.method.toUpperCase() === 'DELETE') {
      builder.line('request = Net::HTTP::Delete.new(uri)')
    } else if (http.method.toUpperCase() === 'PATCH') {
      builder.line('request = Net::HTTP::Patch.new(uri)')
    } else {
      builder.line(
        `request = Net::HTTP::GenericRequest.new("${rubyString(http.method.toUpperCase())}", ${HasBody(http.body)}, true, uri.request_uri)`
      )
    }

    if (http.headers && Object.keys(http.headers).length > 0) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`request.add_field("${rubyString(key)}", "${rubyString(val)}")`))
        } else {
          builder.line(`request["${rubyString(key)}"] = "${rubyString(value)}"`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      const cookieString = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`request["Cookie"] = "${rubyString(cookieString)}"`)
    }

    if (HasBody(http.body)) {
      if (needsJson) {
        builder.line('request.body = ')
        builder.json(http.body)
        builder.append('.to_json')
      } else if (ContentTypeIncludes(contentType, 'form')) {
        builder.line('request.body = URI.encode_www_form(')
        builder.json(http.body)
        builder.append(')')
      } else if (IsStringBody(http.body)) {
        builder.line(`request.body = "${rubyString(http.body)}"`)
      } else {
        builder.line(`request.body = "${rubyString(JSON.stringify(http.body))}"`)
      }
    }

    builder.line()
    builder.line('response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|')
    builder.indent()
    builder.line('http.request(request)')
    builder.outdent()
    builder.line('end')
    builder.line()
    builder.line('puts response.body')

    if (config.handleErrors) {
      builder.outdent()
      builder.line('rescue StandardError => e')
      builder.indent()
      builder.line('puts "Error: #{e.message}"')
      builder.outdent()
      builder.line('end')
    }

    return builder.output()
  }
} as Client
