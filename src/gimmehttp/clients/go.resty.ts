import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ContentTypeIncludes, FormatCookieHeader, GetContentType, HasBody, IsObjectBody } from '../utils/utils'

export default {
  language: 'go',
  client: 'resty',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n',
      json: {
        objOpen: 'map[string]any{',
        objClose: '}',
        arrOpen: '[]any{',
        arrClose: '}',
        separator: ': '
      }
    })
    const contentType = GetContentType(http.headers)
    const isJsonBody = HasBody(http.body) && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))
    const method = http.method.toUpperCase()
    const methodName = { GET: 'Get', POST: 'Post', PUT: 'Put', DELETE: 'Delete', PATCH: 'Patch' }[method]

    builder.line('package main')
    builder.line()
    builder.line('import (')
    builder.indent()
    builder.line('"fmt"')
    if (config.handleErrors) builder.line('"log"')
    builder.line('"github.com/go-resty/resty/v2"')
    builder.outdent()
    builder.line(')')
    builder.line()
    builder.line('func main() {')
    builder.indent()
    builder.line('client := resty.New()')
    builder.line(config.handleErrors ? 'resp, err := client.R()' : 'resp, _ := client.R()')
    builder.indent()

    for (const [key, value] of Object.entries(http.headers || {})) {
      if (Array.isArray(value)) value.forEach((item) => builder.line('.SetHeader("%s", "%s")', key, item))
      else builder.line('.SetHeader("%s", "%s")', key, value)
    }
    if (isJsonBody && !contentType) builder.line('.SetHeader("Content-Type", "application/json")')
    if (http.cookies && Object.keys(http.cookies).length > 0) builder.line('.SetHeader("Cookie", "%s")', FormatCookieHeader(http.cookies))
    for (const [key, value] of Object.entries(http.params || {})) {
      if (Array.isArray(value)) {
        const query = new URLSearchParams()
        value.forEach((item) => query.append(key, item))
        builder.line('.SetQueryString("%s")', query.toString())
      }
      else builder.line('.SetQueryParam("%s", "%s")', key, value)
    }
    if (HasBody(http.body)) {
      builder.line('.SetBody(')
      builder.indent()
      if (isJsonBody) builder.json(http.body)
      else builder.jsonStringLiteral(typeof http.body === 'string' ? http.body : JSON.stringify(http.body))
      builder.outdent()
      builder.append(')')
    }
    if (methodName) builder.line('.%r("%s")', methodName, http.url)
    else builder.line('.Execute("%s", "%s")', method, http.url)
    builder.outdent()
    builder.line()
    if (config.handleErrors) {
      builder.line('if err != nil {')
      builder.indent()
      builder.line('log.Fatal(err)')
      builder.outdent()
      builder.line('}')
    }
    builder.line('fmt.Println(resp.String())')
    builder.outdent()
    builder.line('}')
    return builder.output()
  }
} as Client
