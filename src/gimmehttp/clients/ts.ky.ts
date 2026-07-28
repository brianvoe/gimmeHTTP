import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ContentTypeIncludes, FormatCookieHeader, GetContentType, IsObjectBody, IsStringBody } from '../utils/utils'

export default {
  language: 'typescript',
  client: 'ky',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })
    const responseMethod = ContentTypeIncludes(GetContentType(http.headers), 'json') ? 'json()' : 'text()'

    builder.line('import ky from "ky";')
    builder.line()

    if (config.handleErrors) {
      builder.line('try {')
      builder.indent()
    }

    builder.line('const data = await ky("%s", {', http.url)
    builder.indent()
    builder.line('method: "%s",', http.method.toLowerCase())

    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('searchParams: ')
      builder.json(http.params)
      builder.append(',')
    }

    if (http.headers || (http.cookies && Object.keys(http.cookies).length > 0)) {
      builder.line('headers: {')
      builder.indent()
      if (http.headers) {
        for (const [key, value] of Object.entries(http.headers)) {
          builder.line('"%s": "%s",', key, Array.isArray(value) ? value.join(', ') : value)
        }
      }
      if (http.cookies && Object.keys(http.cookies).length > 0) {
        builder.line('"Cookie": "%s",', FormatCookieHeader(http.cookies))
      }
      builder.outdent()
      builder.line('},')
    }

    if (http.body !== undefined && http.body !== null) {
      if (IsObjectBody(http.body) && ContentTypeIncludes(GetContentType(http.headers), 'form')) {
        builder.line('body: new URLSearchParams(')
        builder.json(http.body)
        builder.append('),')
      } else if (IsObjectBody(http.body)) {
        builder.line('json: ')
        builder.json(http.body)
        builder.append(',')
      } else if (IsStringBody(http.body)) {
        builder.line('body: "%s",', http.body)
      } else {
        builder.line('body: ')
        builder.json(http.body)
        builder.append(',')
      }
    }

    builder.outdent()
    builder.line('}).%r;', responseMethod)
    builder.line('console.log(data);')

    if (config.handleErrors) {
      builder.outdent()
      builder.line('} catch (error: unknown) {')
      builder.indent()
      builder.line('console.error("There was an error:", error);')
      builder.outdent()
      builder.line('}')
    }

    return builder.output()
  }
} as Client
