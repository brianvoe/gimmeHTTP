import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetContentType, IsStringBody, IsObjectBody, ContentTypeIncludes } from '../utils/utils'

export default {
  default: true,
  language: 'ruby',
  client: 'nethttp',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('require "net/http"')
    builder.line('require "uri"')
    builder.line()

    if (config.handleErrors) {
      builder.line('begin')
      builder.indent()
    }

    // Build URI with parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('uri = URI.parse("' + http.url + '")')
      builder.line('params = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          builder.line(`"${key}" => [${value.map((v) => `"${v}"`).join(', ')}],`)
        } else {
          builder.line(`"${key}" => "${value}",`)
        }
      }
      builder.outdent()
      builder.line('}')
      builder.line('uri.query = URI.encode_www_form(params)')
    } else {
      builder.line('uri = URI.parse("' + http.url + '")')
    }

    if (http.method.toUpperCase() === 'GET') {
      builder.line('request = Net::HTTP::Get.new(uri)')
    } else if (http.method.toUpperCase() === 'POST') {
      builder.line('request = Net::HTTP::Post.new(uri)')
    } else if (http.method.toUpperCase() === 'PUT') {
      builder.line('request = Net::HTTP::Put.new(uri)')
    } else if (http.method.toUpperCase() === 'DELETE') {
      builder.line('request = Net::HTTP::Delete.new(uri)')
    } else {
      builder.line('request = Net::HTTP::GenericRequest.new("' + http.method.toUpperCase() + '", uri.path, nil, nil)')
    }

    if (http.headers && Object.keys(http.headers).length > 0) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`request["${key}"] = "${val}"`))
        } else {
          builder.line(`request["${key}"] = "${value}"`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      const cookieString = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`request["Cookie"] = "${cookieString}"`)
    }

    if (http.body) {
      const contentType = GetContentType(http.headers)

      if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        builder.line('request.body = ')
        builder.json(http.body)
        builder.append('.to_json')
      } else if (IsStringBody(http.body)) {
        builder.line(`request.body = "${http.body.replace(/"/g, '\\"')}"`)
      } else {
        // For form data or other objects, convert to JSON string
        builder.line('request.body = ')
        builder.json(http.body)
        builder.append('.to_json')
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
