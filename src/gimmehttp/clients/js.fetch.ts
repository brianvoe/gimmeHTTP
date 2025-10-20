import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetEffectiveContentType, ContentTypeIncludes } from '../utils/utils'

export default {
  default: true,
  language: 'javascript',
  client: 'fetch',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('fetch("' + http.url + '", {')
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

    // Note: Cookies are not supported in the fetch API
    // Cookies
    // if (http.cookies) {
    // }

    if (http.body) {
      builder.line('body: ')
      builder.json(http.body)
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
