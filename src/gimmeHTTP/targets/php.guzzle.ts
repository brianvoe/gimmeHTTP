import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Target } from '../utils/registry'

export default {
  language: 'php',
  client: 'guzzle',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
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
        builder.line('"json" => {')
        builder.indent()
        formatJsonRecursive(http.body, builder, true)
        builder.outdent()
        builder.line('}')
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
} as Target

function formatJsonRecursive(json: any, builder: Builder, isRoot: boolean = false): void {
  if (typeof json === 'object' && json !== null) {
    if (Array.isArray(json)) {
      builder.line('[' + json.map((item) => JSON.stringify(item)).join(', ') + ']')
    } else {
      if (!isRoot) {
        builder.line('{')
        builder.indent()
      }
      const entries = Object.entries(json)
      entries.forEach(([key, value], index) => {
        if (Array.isArray(value)) {
          builder.line(`"${key}": [${value.map((item) => JSON.stringify(item)).join(', ')}]`)
        } else if (typeof value === 'object' && value !== null) {
          builder.line(`"${key}": {`)
          builder.indent()
          formatJsonRecursive(value, builder, true)
          builder.outdent()
          builder.line('}')
        } else {
          builder.line(`"${key}": ${JSON.stringify(value)}`)
        }
        if (index < entries.length - 1) {
          builder.append(',')
        }
      })
      if (!isRoot) {
        builder.outdent()
        builder.line('}')
      }
    }
  } else {
    builder.line(JSON.stringify(json))
  }
}
