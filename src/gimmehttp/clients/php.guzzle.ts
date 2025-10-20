import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetContentType, ContentTypeIncludes } from '../utils/utils'

export default {
  language: 'php',
  client: 'guzzle',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n',
      json: {
        objOpen: '[',
        objClose: ']',
        arrOpen: '[',
        arrClose: ']',
        separator: ' => ',
        endComma: true
      }
    })

    builder.line('<?php')
    builder.line()
    builder.line("require 'vendor/autoload.php';")
    builder.line()
    builder.line('use GuzzleHttp\\Client;')
    builder.line()

    builder.line('$client = new Client();')
    builder.line('$response = $client->request(')
    builder.indent()
    builder.line('"' + http.method.toUpperCase() + '",')
    builder.line('"' + http.url + '",')

    // Headers and body
    if (http.headers || http.cookies || http.body) {
      builder.line('[')

      if (http.headers) {
        builder.indent()
        builder.line('"headers" => [')
        builder.indent()

        for (const [key, value] of Object.entries(http.headers)) {
          if (Array.isArray(value)) {
            value.forEach((val) => builder.line(`"${key}" => "${val}",`))
          } else {
            builder.line(`"${key}" => "${value}",`)
          }
        }

        builder.outdent()
        builder.line('],')
        builder.outdent()
      }

      if (http.cookies) {
        builder.indent()
        builder.line('"cookies" => [')
        builder.indent()

        for (const [key, value] of Object.entries(http.cookies)) {
          builder.line(`"${key}" => "${value}",`)
        }

        builder.outdent()
        builder.line('],')
        builder.outdent()
      }

      if (http.body) {
        builder.indent()
        const contentType = GetContentType(http.headers)

        if (ContentTypeIncludes(contentType, 'form')) {
          builder.line('"form_params" => ')
          builder.json(http.body)
          builder.append(',')
        } else {
          // Default to JSON (if content-type is json or not specified)
          builder.line('"json" => ')
          builder.json(http.body)
          builder.append(',')
        }
        builder.outdent()
      }

      // End headers and body
      builder.line('],')
    }

    // End request
    builder.outdent()
    builder.line(');')
    builder.line()

    builder.line('echo $response->getBody();')

    return builder.output()
  }
} as Client
