import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  GetEffectiveContentType,
  ContentTypeIncludes,
  GetContentType,
  IsObjectBody,
  IsStringBody,
  EscapeDoubleQuoted
} from '../utils/utils'

export default {
  default: true,
  language: 'javascript',
  client: 'fetch',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    // Build URL with parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('const url = new URL("' + http.url + '");')
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`url.searchParams.append("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(val)}");`)
          }
        } else {
          builder.line(`url.searchParams.append("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(value)}");`)
        }
      }
      builder.line()
      builder.line('fetch(url.toString(), {')
    } else {
      builder.line('fetch("' + http.url + '", {')
    }
    builder.indent()
    builder.line(`method: "${http.method.toUpperCase()}",`)

    // Headers
    if (http.headers) {
      builder.line('headers: {')
      builder.indent()
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          builder.line(`"${key}": "${value.join(', ')}",`)
        } else {
          builder.line(`"${key}": "${value}",`)
        }
      }
      builder.outdent()
      builder.line('},')
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line('// Same-origin cookies are sent automatically by the browser.')
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
        builder.line(`body: "${EscapeDoubleQuoted(http.body)}",`)
      } else {
        builder.line('body: ')
        builder.json(http.body)
        builder.append(',')
      }
    }

    builder.outdent()
    builder.line('})')

    // Determine response parsing method based on content-type or accept headers
    // For responses, only use explicit headers (don't infer from request body)
    const { contentType: responseType, wasInferred } = GetEffectiveContentType(http.headers)
    let parseMethod = 'text()' // Default to text() for safety when no Content-Type

    // Only change from default if we have an explicit header (not inferred octet-stream)
    if (!wasInferred || responseType !== 'application/octet-stream') {
      if (ContentTypeIncludes(responseType, 'json')) {
        parseMethod = 'json()'
      } else if (ContentTypeIncludes(responseType, 'xml')) {
        parseMethod = 'text()' // XML is typically parsed as text, then processed with DOMParser
      } else if (ContentTypeIncludes(responseType, 'text')) {
        parseMethod = 'text()'
      } else if (ContentTypeIncludes(responseType, 'blob')) {
        parseMethod = 'blob()'
      }
    }

    // Add comment if content-type was inferred for non-default responses
    if (wasInferred && parseMethod === 'json()') {
      builder.line(`// Response Content-Type inferred as: ${responseType}`)
    }

    if (config.handleErrors) {
      builder.line('.then(response => {')
      builder.indent()
      builder.line('if (!response.ok) {')
      builder.indent()
      builder.line('throw new Error("Network response was not ok");')
      builder.outdent()
      builder.line('}')
      builder.line(`return response.${parseMethod};`)
      builder.outdent()
      builder.line('})')
      builder.line('.then(data => console.log(data))')
      builder.line('.catch(error => console.error("There was a problem with the fetch operation:", error));')
    } else {
      builder.line(`.then(response => response.${parseMethod})`)
      builder.line('.then(data => console.log(data));')
    }

    return builder.output()
  }
} as Client
