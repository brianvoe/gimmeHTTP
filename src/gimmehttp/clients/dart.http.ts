import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  ContentTypeIncludes,
  EscapeDoubleQuoted,
  GetContentType,
  HasBody,
  IsObjectBody,
  IsStringBody
} from '../utils/utils'

export default {
  default: true,
  language: 'dart',
  client: 'http',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    const hasBody = HasBody(http.body)
    const contentType = GetContentType(http.headers)
    const needsJsonEncode =
      hasBody && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))
    const dartString = (value: string) => EscapeDoubleQuoted(value).replace(/\$/g, '\\$')
    const hasExplicitContentType = Object.keys(http.headers || {}).some((key) => key.toLowerCase() === 'content-type')

    builder.line("import 'package:http/http.dart' as http;")
    if (needsJsonEncode) {
      builder.line("import 'dart:convert';")
    }
    builder.line()

    builder.line('void main() async {')
    builder.indent()

    if (config.handleErrors) {
      builder.line('try {')
      builder.indent()
    }

    // Build URL with parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line(`var url = Uri.parse("${dartString(http.url)}");`)
      builder.line('url = url.replace(queryParameters: {')
      builder.indent()
      builder.line('...url.queryParametersAll,')
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          builder.line(`"${dartString(key)}": [${value.map((v) => `"${dartString(v)}"`).join(', ')}],`)
        } else {
          builder.line(`"${dartString(key)}": "${dartString(value)}",`)
        }
      }
      builder.outdent()
      builder.line('});')
    } else {
      builder.line(`var url = Uri.parse("${dartString(http.url)}");`)
    }
    builder.line()

    // Build headers map
    if ((http.headers && Object.keys(http.headers).length > 0) || (needsJsonEncode && !hasExplicitContentType)) {
      builder.line('var headers = {')
      builder.indent()
      for (const [key, value] of Object.entries(http.headers || {})) {
        if (Array.isArray(value)) {
          builder.line(`"${dartString(key)}": "${dartString(value.join(', '))}",`)
        } else {
          builder.line(`"${dartString(key)}": "${dartString(value)}",`)
        }
      }
      if (needsJsonEncode && !hasExplicitContentType) {
        builder.line('"Content-Type": "application/json",')
      }
      builder.outdent()
      builder.line('};')
      builder.line()
    }

    // Build body
    let bodyVar = 'null'
    if (hasBody) {
      if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        builder.line('var body = jsonEncode(')
        builder.json(http.body)
        builder.append(');')
        bodyVar = 'body'
        builder.line()
      } else if (IsStringBody(http.body)) {
        builder.line(`var body = "${dartString(http.body)}";`)
        bodyVar = 'body'
        builder.line()
      }
    }

    // Make request
    const method = http.method.toLowerCase()
    const hasHeaders =
      (http.headers && Object.keys(http.headers).length > 0) || (needsJsonEncode && !hasExplicitContentType)

    if (method === 'get') {
      builder.line(`var response = await http.get(url${hasHeaders ? ', headers: headers' : ''});`)
    } else if (method === 'post') {
      builder.line(
        `var response = await http.post(url${hasHeaders ? ', headers: headers' : ''}${bodyVar !== 'null' ? ', body: ' + bodyVar : ''});`
      )
    } else if (method === 'put') {
      builder.line(
        `var response = await http.put(url${hasHeaders ? ', headers: headers' : ''}${bodyVar !== 'null' ? ', body: ' + bodyVar : ''});`
      )
    } else if (method === 'delete') {
      builder.line(
        `var response = await http.delete(url${hasHeaders ? ', headers: headers' : ''}${bodyVar !== 'null' ? ', body: ' + bodyVar : ''});`
      )
    } else if (method === 'patch') {
      builder.line(
        `var response = await http.patch(url${hasHeaders ? ', headers: headers' : ''}${bodyVar !== 'null' ? ', body: ' + bodyVar : ''});`
      )
    } else {
      builder.line(`var request = http.Request("${dartString(http.method.toUpperCase())}", url);`)
      if (hasHeaders) builder.line('request.headers.addAll(headers);')
      if (bodyVar !== 'null') builder.line('request.body = body;')
      builder.line('var streamedResponse = await request.send();')
      builder.line('var response = await http.Response.fromStream(streamedResponse);')
    }

    builder.line()
    if (config.handleErrors) {
      builder.line('if (response.statusCode < 200 || response.statusCode >= 300) {')
      builder.indent()
      builder.line('throw http.ClientException("HTTP ${response.statusCode}", url);')
      builder.outdent()
      builder.line('}')
      builder.line()
    }
    builder.line('print(response.body);')

    if (config.handleErrors) {
      builder.outdent()
      builder.line('} catch (e) {')
      builder.indent()
      builder.line('print("Error: $e");')
      builder.outdent()
      builder.line('}')
    }

    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Client
