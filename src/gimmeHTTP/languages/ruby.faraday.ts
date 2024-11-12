import { Builder } from '../utils/builder'
import { Config, Http, Target } from '../index'

export default {
  language: 'ruby',
  target: 'faraday',
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
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`req.headers["${key}"] = "${val}"`))
        } else {
          builder.line(`req.headers["${key}"] = "${value}"`)
        }
      }
    }

    if (http.cookies) {
      for (const [key, value] of Object.entries(http.cookies)) {
        builder.line(`req.headers["Cookie"] = "${key}=${value}"`)
      }
    }

    if (http.body) {
      builder.line('req.body = ' + JSON.stringify(http.body))
    }

    builder.outdent()
    builder.line('end')
    builder.line()

    builder.line('puts response.body')

    return builder.output()
  }
} as Target
