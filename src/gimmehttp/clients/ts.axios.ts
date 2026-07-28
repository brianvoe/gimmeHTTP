import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { FormatCookieHeader } from '../utils/utils'

export default {
  language: 'typescript',
  client: 'axios',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('import axios from "axios";')
    builder.line()
    builder.line('axios({')
    builder.indent()
    builder.line('method: "%s",', http.method.toLowerCase())
    builder.line('url: "%s",', http.url)

    // URL Parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('params: {')
      builder.indent()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          const values = value.map((v) => builder.format('"%s"', v)).join(', ')
          builder.line('"%s": [%r],', key, values)
        } else {
          builder.line('"%s": "%s",', key, value)
        }
      }
      builder.outdent()
      builder.line('},')
    }

    // Headers
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

    if (http.body) {
      builder.line('data: ')
      builder.json(http.body)
    }

    builder.outdent()
    builder.line('})')

    if (config.handleErrors) {
      builder.line('.then((response) => {')
      builder.indent()
      builder.line('console.log(response.data);')
      builder.outdent()
      builder.line('})')
      builder.line('.catch((error: unknown) => {')
      builder.indent()
      builder.line('console.error("There was an error:", error);')
      builder.outdent()
      builder.line('});')
    } else {
      builder.line('.then((response) => console.log(response.data));')
    }

    return builder.output()
  }
} as Client
