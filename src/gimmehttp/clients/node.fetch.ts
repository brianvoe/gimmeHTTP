import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  GetContentType,
  ContentTypeIncludes,
  FormatCookieHeader,
  IsObjectBody,
  IsStringBody
} from '../utils/utils'

export default {
  language: 'node',
  client: 'fetch',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    // Build URL with parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('const url = new URL("%s");', http.url)
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line('url.searchParams.append("%s", "%s");', key, val)
          }
        } else {
          builder.line('url.searchParams.append("%s", "%s");', key, value)
        }
      }
      builder.line()
      builder.line('fetch(url.toString(), {')
    } else {
      builder.line('fetch("%s", {', http.url)
    }
    builder.indent()
    builder.line('method: "%s",', http.method.toUpperCase())

    if (http.headers || (http.cookies && Object.keys(http.cookies).length > 0)) {
      builder.line('headers: {')
      builder.indent()
      if (http.headers) {
        for (const [key, value] of Object.entries(http.headers)) {
          if (Array.isArray(value)) {
            builder.line('"%s": "%s",', key, value.join(', '))
          } else {
            builder.line('"%s": "%s",', key, value)
          }
        }
      }
      if (http.cookies && Object.keys(http.cookies).length > 0) {
        builder.line('"Cookie": "%s",', FormatCookieHeader(http.cookies))
      }
      builder.outdent()
      builder.line('},')
    }

    if (http.body !== undefined && http.body !== null) {
      const contentType = GetContentType(http.headers)
      if (IsObjectBody(http.body) && ContentTypeIncludes(contentType, 'form')) {
        builder.line('body: new URLSearchParams(')
        builder.json(http.body)
        builder.append('),')
      } else if (IsObjectBody(http.body)) {
        builder.line('body: JSON.stringify(')
        builder.json(http.body)
        builder.append('),')
      } else if (IsStringBody(http.body)) {
        builder.line('body: "%s",', http.body)
      } else {
        builder.line('body: ')
        builder.json(http.body)
        builder.append(',')
      }
    }

    builder.outdent()
    builder.line('})')

    // Determine response parsing method based on content-type or accept headers
    const responseType = GetContentType(http.headers)
    let parseMethod = 'text()'

    if (ContentTypeIncludes(responseType, 'json')) {
      parseMethod = 'json()'
    } else if (ContentTypeIncludes(responseType, 'xml')) {
      parseMethod = 'text()'
    } else if (ContentTypeIncludes(responseType, 'text')) {
      parseMethod = 'text()'
    } else if (ContentTypeIncludes(responseType, 'blob')) {
      parseMethod = 'blob()'
    }

    if (config.handleErrors) {
      builder.line('.then(response => {')
      builder.indent()
      builder.line('if (!response.ok) {')
      builder.indent()
      builder.line('throw new Error("response not ok");')
      builder.outdent()
      builder.line('}')
      builder.line('return response.%r;', parseMethod)
      builder.outdent()
      builder.line('})')
      builder.line('.then(data => console.log(data))')
      builder.line('.catch(error => console.error("error:", error));')
    } else {
      builder.line('.then(response => response.%r)', parseMethod)
      builder.line('.then(data => console.log(data))')
    }

    return builder.output()
  }
} as Client
