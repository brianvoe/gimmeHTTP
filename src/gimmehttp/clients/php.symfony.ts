import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ContentTypeIncludes, FormatCookieHeader, GetContentType, HasBody, IsObjectBody } from '../utils/utils'

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
  client: 'symfony',
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
    const contentType = GetContentType(http.headers)
    const hasBody = HasBody(http.body)
    const isJsonBody = hasBody && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))
    const isFormBody = hasBody && ContentTypeIncludes(contentType, 'form')

    builder.line('<?php')
    builder.line()
    builder.line("require 'vendor/autoload.php';")
    builder.line()
    builder.line('use Symfony\\Component\\HttpClient\\HttpClient;')
    if (config.handleErrors) builder.line('use Symfony\\Contracts\\HttpClient\\Exception\\TransportExceptionInterface;')
    builder.line()
    if (config.handleErrors) {
      builder.line('try {')
      builder.indent()
    }
    builder.line('$client = HttpClient::create();')
    builder.line('$response = $client->request(')
    builder.indent()
    builder.line('"%s",', http.method.toUpperCase())
    builder.line('"%s",', http.url)
    if (http.headers || http.cookies || http.params || hasBody) {
      builder.line('[')
      builder.indent()
      if (http.headers || http.cookies) {
        builder.line("'headers' => [")
        builder.indent()
        for (const [key, value] of Object.entries(http.headers || {})) {
          if (Array.isArray(value)) {
            builder.line("'%s' => [%r],", key, value.map((item) => builder.format("'%s'", item)).join(', '))
          } else builder.line("'%s' => '%s',", key, value)
        }
        if (http.cookies && Object.keys(http.cookies).length > 0) builder.line("'Cookie' => '%s',", FormatCookieHeader(http.cookies))
        builder.outdent()
        builder.line('],')
      }
      if (http.params && Object.keys(http.params).length > 0) {
        builder.line("'query' => ")
        builder.json(http.params)
        builder.append(',')
      }
      if (isJsonBody) {
        builder.line("'json' => ")
        builder.json(http.body)
        builder.append(',')
      } else if (isFormBody) {
        builder.line("'body' => http_build_query(")
        builder.indent()
        builder.json(http.body)
        builder.outdent()
        builder.append('),')
      } else if (hasBody) {
        builder.line("'body' => '%s',", typeof http.body === 'string' ? http.body : JSON.stringify(http.body))
      }
      builder.outdent()
      builder.line('],')
    }
    builder.outdent()
    builder.line(');')
    builder.line()
    builder.line('echo $response->getContent();')
    if (config.handleErrors) {
      builder.outdent()
      builder.line('} catch (TransportExceptionInterface $e) {')
      builder.indent()
      builder.line('echo "Error: " . $e->getMessage();')
      builder.outdent()
      builder.line('}')
    }
    return builder.output()
  }
} as Client
