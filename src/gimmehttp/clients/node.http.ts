import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  ParseUrl,
  GetContentType,
  ContentTypeIncludes,
  IsObjectBody,
  IsStringBody,
  FormatCookieHeader
} from '../utils/utils'

export default {
  language: 'node',
  client: 'http',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    const { hostname, path, port, protocol, params: existingParams } = ParseUrl(http.url)
    builder.line('const transport = require("%s");', protocol === 'https:' ? 'https' : 'http')
    builder.line()

    // Build path with parameters
    let finalPath = path + existingParams
    if (http.params && Object.keys(http.params).length > 0) {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            params.append(key, val)
          }
        } else {
          params.append(key, value)
        }
      }
      const paramString = params.toString()
      if (paramString) {
        const separator = finalPath.includes('?') ? '&' : '?'
        finalPath = `${finalPath}${separator}${paramString}`
      }
    }

    const contentType = GetContentType(http.headers)
    const hasBody = http.body !== undefined && http.body !== null
    const isJsonBody = hasBody && IsObjectBody(http.body) && !ContentTypeIncludes(contentType, 'form')
    if (hasBody) {
      if (isJsonBody) {
        builder.line('const payload = JSON.stringify(')
        builder.json(http.body)
        builder.append(');')
      } else if (IsObjectBody(http.body)) {
        builder.line('const payload = new URLSearchParams(')
        builder.json(http.body)
        builder.append(').toString();')
      } else if (IsStringBody(http.body)) {
        builder.line('const payload = "%s";', http.body)
      } else {
        builder.line('const payload = ')
        builder.json(http.body)
        builder.append(';')
      }
      builder.line()
    }

    builder.line('const options = {')
    builder.indent()
    builder.line('method: "%s",', http.method.toUpperCase())
    builder.line('hostname: "%s",', hostname)
    builder.line('port: %r,', port)
    builder.line('path: "%s",', finalPath)

    if (http.headers || http.cookies || hasBody) {
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
      if (isJsonBody && !Object.keys(http.headers || {}).some((key) => key.toLowerCase() === 'content-type')) {
        builder.line('"Content-Type": "application/json",')
      }

      if (http.cookies) {
        builder.line('"Cookie": "%s",', FormatCookieHeader(http.cookies))
      }
      if (hasBody) builder.line('"Content-Length": Buffer.byteLength(payload),')
      builder.outdent()
      builder.line('},')
    }
    builder.outdent()
    builder.line('};')
    builder.line()

    builder.line('const req = transport.request(options, (res) => {')
    builder.indent()
    builder.line('let data = "";')
    builder.line()
    builder.line('res.on("data", (chunk) => {')
    builder.indent()
    builder.line('data += chunk;')
    builder.outdent()
    builder.line('});')
    builder.line()
    builder.line('res.on("end", () => {')
    builder.indent()
    builder.line('console.log(data);')
    builder.outdent()
    builder.line('});')
    builder.outdent()
    builder.line('});')

    if (config.handleErrors) {
      builder.line()
      builder.line('req.on("error", (error) => {')
      builder.indent()
      builder.line('console.error(error);')
      builder.outdent()
      builder.line('});')
    }

    builder.line()

    if (hasBody) builder.line('req.write(payload);')
    builder.line('req.end();')

    return builder.output()
  }
} as Client
