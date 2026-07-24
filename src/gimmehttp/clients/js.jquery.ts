import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  BuildUrlWithParams,
  ContentTypeIncludes,
  GetContentType,
  IsObjectBody,
  IsStringBody
} from '../utils/utils'

export default {
  language: 'javascript',
  client: 'jquery',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('$.ajax({')
    builder.indent()
    builder.line('url: "%s",', BuildUrlWithParams(http.url, http.params))
    builder.line('type: "%s",', http.method.toUpperCase())

    if (http.headers) {
      builder.line('headers: {')
      builder.indent()
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          builder.line('"%s": "%s",', key, value.join(', '))
        } else {
          builder.line('"%s": "%s",', key, value)
        }
      }
      builder.outdent()
      builder.line('},')
    }

    if (http.body !== undefined && http.body !== null) {
      const contentType = GetContentType(http.headers)
      if (IsObjectBody(http.body) && ContentTypeIncludes(contentType, 'json')) {
        builder.line('data: JSON.stringify(')
        builder.json(http.body)
        builder.append('),')
        builder.line('contentType: "application/json",')
        builder.line('processData: false,')
      } else if (IsStringBody(http.body)) {
        builder.line('data: "%s",', http.body)
        if (contentType) builder.line('contentType: "%s",', contentType)
      } else {
        builder.line('data: ')
        builder.json(http.body)
        builder.append(',')
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line('// Same-origin cookies are sent automatically by the browser.')
    }

    builder.line('success: function(data) {')
    builder.indent()
    builder.line('console.log(data);')
    builder.outdent()
    builder.line('},')

    if (config.handleErrors) {
      builder.line('error: function(jqXHR, textStatus, errorThrown) {')
      builder.indent()
      builder.line('console.error("Request failed:", textStatus, errorThrown);')
      builder.outdent()
      builder.line('},')
    }

    builder.outdent()
    builder.line('});')

    return builder.output()
  }
} as Client
