import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { BuildUrlWithParams, FormatCookieHeader, HasBody, IsObjectBody, IsStringBody } from '../utils/utils'

const EscapeDartString = (value: string): string =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\$/g, '\\$')

export default {
  language: 'dart',
  client: 'dio',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n',
      json: { escapeString: EscapeDartString }
    })
    const hasBody = HasBody(http.body)
    const headers = { ...(http.headers || {}) } as Record<string, string | string[]>
    if (http.cookies && Object.keys(http.cookies).length > 0) {
      headers.Cookie = FormatCookieHeader(http.cookies)
    }

    builder.line("import 'package:dio/dio.dart';")
    builder.line()
    builder.line('void main() async {')
    builder.indent()
    if (config.handleErrors) {
      builder.line('try {')
      builder.indent()
    }
    builder.line('final dio = Dio();')
    builder.line()
    if (Object.keys(headers).length > 0) {
      builder.line('final headers = {')
      builder.indent()
      for (const [key, value] of Object.entries(headers)) {
        builder.line('"%s": "%s",', key, Array.isArray(value) ? value.join(', ') : value)
      }
      builder.outdent()
      builder.line('};')
      builder.line()
    }

    const options = Object.keys(headers).length > 0 ? ', options: Options(headers: headers)' : ''
    const query = http.params && Object.keys(http.params).length > 0 ? ', queryParameters: ' : ''
    let queryValue = ''
    if (query) {
      builder.line('final queryParameters = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.params || {})) {
        if (Array.isArray(value)) {
          builder.line('"%s": [%r],', key, value.map((item) => builder.format('"%s"', item)).join(', '))
        } else {
          builder.line('"%s": "%s",', key, value)
        }
      }
      builder.outdent()
      builder.line('};')
      builder.line()
      queryValue = 'queryParameters'
    }

    let data = ''
    if (hasBody && IsObjectBody(http.body)) {
      builder.line('final data = ')
      builder.json(http.body)
      builder.append(';')
      builder.line()
      builder.line()
      data = ', data: data'
    } else if (hasBody && IsStringBody(http.body)) {
      builder.line('final data = "%s";', http.body)
      builder.line()
      data = ', data: data'
    }
    const method = http.method.toLowerCase()
    const requestArgs = `${query}${queryValue}${options}${data}`
    if (['get', 'post', 'put', 'delete', 'patch', 'head'].includes(method)) {
      builder.line('final response = await dio.%r("%s"%r);', method, BuildUrlWithParams(http.url), requestArgs)
    } else {
      builder.line(
        'final response = await dio.request("%s", options: Options(method: "%s"%r)%r%r);',
        BuildUrlWithParams(http.url),
        http.method.toUpperCase(),
        Object.keys(headers).length > 0 ? ', headers: headers' : '',
        query ? ', queryParameters: queryParameters' : '',
        data
      )
    }
    builder.line('print(response.data);')
    if (config.handleErrors) {
      builder.outdent()
      builder.line('} on DioException catch (e) {')
      builder.indent()
      builder.line('print("Error: ${e.message}");')
      builder.outdent()
      builder.line('}')
    }
    builder.outdent()
    builder.line('}')
    return builder.output()
  }
} as Client
