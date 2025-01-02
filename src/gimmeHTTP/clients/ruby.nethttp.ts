import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'

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
    builder.line('uri = URI.parse("' + http.url + '")')

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
      for (const [key, value] of Object.entries(http.cookies)) {
        builder.line(`request["Cookie"] = "${key}=${value}"`)
      }
    }

    if (http.body) {
      builder.line('request.body = ')
      builder.indent()
      formatJsonBody(http.body, builder)
    }

    builder.line()

    builder.line('response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|')
    builder.indent()
    builder.line('http.request(request)')
    builder.outdent()
    builder.line('end')
    builder.line()

    builder.line('puts response.body')

    return builder.output()
  }
} as Client

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
