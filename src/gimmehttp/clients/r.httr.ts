import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  ContentTypeIncludes,
  FormatCookieHeader,
  GetContentType,
  HasBody,
  IsObjectBody,
  IsStringBody
} from '../utils/utils'

const verbMap: Record<string, string> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'VERB'
}

export default {
  default: true,
  language: 'r',
  client: 'httr',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n',
      json: {
        objOpen: 'list(',
        objClose: ')',
        arrOpen: 'c(',
        arrClose: ')',
        nullLiteral: 'NULL',
        trueLiteral: 'TRUE',
        falseLiteral: 'FALSE',
        quoteKeys: false,
        separator: ' = '
      }
    })
    const method = http.method.toUpperCase()
    const verb = verbMap[method] || 'VERB'
    const contentType = GetContentType(http.headers)
    const isForm = ContentTypeIncludes(contentType, 'form') && IsObjectBody(http.body)
    const isJson =
      HasBody(http.body) &&
      !isForm &&
      (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))
    const hasHeaders = http.headers && Object.keys(http.headers).length > 0
    const hasCookies = http.cookies && Object.keys(http.cookies).length > 0
    const hasParams = http.params && Object.keys(http.params).length > 0

    builder.line('library(httr)')
    builder.line()

    if (config.handleErrors) {
      builder.line('tryCatch({')
      builder.indent()
    }

    const callArgs: string[] = ['url']
    if (verb === 'VERB') callArgs.unshift(`"${method}"`)

    builder.line('url <- "%s"', http.url)

    if (hasParams) {
      builder.line('query <- list(')
      builder.indent()
      const paramEntries = Object.entries(http.params!)
      paramEntries.forEach(([key, value], index) => {
        const comma = index < paramEntries.length - 1 ? ',' : ''
        if (Array.isArray(value)) {
          builder.line('`%r` = c(%r)%r', key, value.map((v) => `"${v}"`).join(', '), comma)
        } else {
          builder.line('`%r` = "%s"%r', key, value, comma)
        }
      })
      builder.outdent()
      builder.line(')')
      callArgs.push('query = query')
    }

    if (hasHeaders) {
      builder.line('headers <- add_headers(')
      builder.indent()
      const headerEntries = Object.entries(http.headers!)
      headerEntries.forEach(([key, value], index) => {
        const values = Array.isArray(value) ? value : [value]
        values.forEach((headerValue, valueIndex) => {
          const isLast = index === headerEntries.length - 1 && valueIndex === values.length - 1
          builder.line('`%r` = "%s"%r', key, headerValue, isLast ? '' : ',')
        })
      })
      builder.outdent()
      builder.line(')')
      callArgs.push('headers')
    }

    if (hasCookies) {
      builder.line('cookies <- set_cookies(')
      builder.indent()
      const cookieEntries = Object.entries(http.cookies!)
      cookieEntries.forEach(([key, value], index) => {
        builder.line('`%r` = "%s"%r', key, value, index < cookieEntries.length - 1 ? ',' : '')
      })
      builder.outdent()
      builder.line(')')
      callArgs.push('cookies')
    }

    if (HasBody(http.body)) {
      if (IsStringBody(http.body)) {
        builder.line('body <- "%s"', http.body)
        callArgs.push('body = body')
        callArgs.push('encode = "raw"')
      } else if (isForm) {
        builder.line('body <- list(')
        builder.indent()
        const bodyEntries = Object.entries(http.body)
        bodyEntries.forEach(([key, value], index) => {
          builder.line('`%r` = "%s"%r', key, String(value), index < bodyEntries.length - 1 ? ',' : '')
        })
        builder.outdent()
        builder.line(')')
        callArgs.push('body = body')
        callArgs.push('encode = "form"')
      } else if (isJson) {
        builder.line('body <- ')
        builder.json(http.body)
        callArgs.push('body = body')
        callArgs.push('encode = "json"')
      } else {
        builder.line('body <- ')
        builder.json(http.body)
        callArgs.push('body = body')
      }
    }

    builder.line()
    builder.line('response <- %r(', verb)
    builder.indent()
    callArgs.forEach((arg, index) => {
      builder.line('%r%r', arg, index < callArgs.length - 1 ? ',' : '')
    })
    builder.outdent()
    builder.line(')')
    if (config.handleErrors) builder.line('stop_for_status(response)')
    builder.line('cat(content(response, "text"))')

    if (config.handleErrors) {
      builder.outdent()
      builder.line('}, error = function(e) {')
      builder.indent()
      builder.line('cat("Error:", conditionMessage(e), "\\n")')
      builder.outdent()
      builder.line('})')
    }

    return builder.output()
  }
} as Client
