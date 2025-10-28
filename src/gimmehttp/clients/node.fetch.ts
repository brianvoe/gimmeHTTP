import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetContentType, ContentTypeIncludes } from '../utils/utils'

export default {
  language: 'node',
  client: 'fetch',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('const fetch = require("node-fetch");')
    builder.line()

    // Build URL with parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('const url = new URL("' + http.url + '");')
      builder.line('const params = new URLSearchParams();')
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`params.append("${key}", "${val}");`)
          }
        } else {
          builder.line(`params.set("${key}", "${value}");`)
        }
      }
      builder.line('url.search = params.toString();')
      builder.line()
      builder.line('fetch(url.toString(), {')
    } else {
      builder.line('fetch("' + http.url + '", {')
    }
    builder.indent()
    builder.line('method: "' + http.method.toUpperCase() + '",')

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

    if (http.body) {
      builder.line('body: ')
      builder.json(http.body)
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
      builder.line(`return response.${parseMethod};`)
      builder.outdent()
      builder.line('})')
      builder.line('.then(data => console.log(data))')
      builder.line('.catch(error => console.error("error:", error));')
    } else {
      builder.line(`.then(response => response.${parseMethod})`)
      builder.line('.then(data => console.log(data))')
    }

    return builder.output()
  }
} as Client
