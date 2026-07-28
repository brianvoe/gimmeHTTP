import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  BuildUrlWithParams,
  ContentTypeIncludes,
  FormatCookieHeader,
  GetContentType,
  HasBody,
  IsObjectBody,
  IsStringBody
} from '../utils/utils'

export default {
  default: true,
  language: 'powershell',
  client: 'restmethod',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })
    const contentType = GetContentType(http.headers)
    const url = BuildUrlWithParams(http.url, http.params)
    const hasHeaders = http.headers && Object.keys(http.headers).length > 0
    const hasCookies = http.cookies && Object.keys(http.cookies).length > 0
    const isForm = ContentTypeIncludes(contentType, 'form') && IsObjectBody(http.body)
    const isJson =
      HasBody(http.body) &&
      !isForm &&
      (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))

    if (config.handleErrors) {
      builder.line('try {')
      builder.indent()
    }

    builder.line('$uri = "%s"', url)

    if (hasHeaders || hasCookies) {
      builder.line('$headers = @{')
      builder.indent()
      for (const [key, value] of Object.entries(http.headers || {})) {
        const values = Array.isArray(value) ? value : [value]
        for (const headerValue of values) {
          builder.line('"%s" = "%s"', key, headerValue)
        }
      }
      if (hasCookies) {
        builder.line('"Cookie" = "%s"', FormatCookieHeader(http.cookies!))
      }
      builder.outdent()
      builder.line('}')
    }

    if (HasBody(http.body)) {
      if (isForm) {
        builder.line('$body = @{')
        builder.indent()
        for (const [key, value] of Object.entries(http.body)) {
          builder.line('%r = "%s"', key, String(value))
        }
        builder.outdent()
        builder.line('}')
      } else if (isJson) {
        builder.line('$body = @\'')
        builder.line('%r', JSON.stringify(http.body, null, builder.getIndent()))
        builder.line('\'@')
      } else if (IsStringBody(http.body)) {
        builder.line('$body = "%s"', http.body)
      } else {
        builder.line('$body = @\'')
        builder.line('%r', typeof http.body === 'string' ? http.body : JSON.stringify(http.body, null, builder.getIndent()))
        builder.line('\'@')
      }
    }

    const args = ['-Uri $uri', `-Method ${http.method.toUpperCase()}`]
    if (hasHeaders || hasCookies) args.push('-Headers $headers')
    if (HasBody(http.body)) {
      args.push('-Body $body')
      if (isJson && !contentType) args.push('-ContentType "application/json"')
      else if (isForm) args.push('-ContentType "application/x-www-form-urlencoded"')
      else if (contentType && IsStringBody(http.body)) args.push(`-ContentType "${contentType}"`)
    }

    builder.line('$response = Invoke-RestMethod %r', args.join(' '))
    builder.line('Write-Output $response')

    if (config.handleErrors) {
      builder.outdent()
      builder.line('} catch {')
      builder.indent()
      builder.line('Write-Error $_.Exception.Message')
      builder.outdent()
      builder.line('}')
    }

    return builder.output()
  }
} as Client
