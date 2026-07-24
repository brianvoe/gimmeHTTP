import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ContentTypeIncludes, GetContentType, HasBody, IsObjectBody } from '../utils/utils'

const EscapePhpString = (value: string): string =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\$/g, '\\$')

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
        endComma: true,
        nullLiteral: 'null',
        escapeString: EscapePhpString
      }
    })

    builder.line('<?php')
    builder.line()
    builder.line("require 'vendor/autoload.php';")
    builder.line()
    builder.line('use GuzzleHttp\\Client;')
    if (config.handleErrors) {
      builder.line('use GuzzleHttp\\Exception\\GuzzleException;')
    }
    builder.line()

    if (config.handleErrors) {
      builder.line('try {')
      builder.indent()
    }

    builder.line('$client = new Client();')
    builder.line('$response = $client->request(')
    builder.indent()
    builder.line('"%s",', http.method.toUpperCase())
    builder.line('"%s",', http.url)

    // Headers, query params, and body
    if (http.headers || http.cookies || HasBody(http.body) || http.params) {
      builder.line('[')

      // Query parameters
      if (http.params && Object.keys(http.params).length > 0) {
        builder.indent()
        builder.line('"query" => [')
        builder.indent()
        for (const [key, value] of Object.entries(http.params)) {
          if (Array.isArray(value)) {
            builder.line('"%s" => [%r],', key, value.map((val) => builder.format('"%s"', val)).join(', '))
          } else {
            builder.line('"%s" => "%s",', key, value)
          }
        }
        builder.outdent()
        builder.line('],')
        builder.outdent()
      }

      if (http.headers || http.cookies) {
        builder.indent()
        builder.line('"headers" => [')
        builder.indent()

        for (const [key, value] of Object.entries(http.headers || {})) {
          if (Array.isArray(value)) {
            builder.line('"%s" => [%r],', key, value.map((val) => builder.format('"%s"', val)).join(', '))
          } else {
            builder.line('"%s" => "%s",', key, value)
          }
        }
        if (http.cookies) {
          const cookieHeader = Object.entries(http.cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ')
          builder.line('"Cookie" => "%s",', cookieHeader)
        }

        builder.outdent()
        builder.line('],')
        builder.outdent()
      }

      if (HasBody(http.body)) {
        builder.indent()
        const contentType = GetContentType(http.headers)

        if (ContentTypeIncludes(contentType, 'form')) {
          builder.line('"form_params" => ')
          builder.json(http.body)
          builder.append(',')
        } else if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
          builder.line('"json" => ')
          builder.json(http.body)
          builder.append(',')
        } else {
          builder.line('"body" => "%s",', typeof http.body === 'string' ? http.body : JSON.stringify(http.body))
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

    if (config.handleErrors) {
      builder.outdent()
      builder.line('} catch (GuzzleException $e) {')
      builder.indent()
      builder.line('echo "Error: " . $e->getMessage();')
      builder.outdent()
      builder.line('}')
    }

    return builder.output()
  }
} as Client
