import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ContentTypeIncludes, FormatCookieHeader, GetContentType, HasBody, IsObjectBody, PascalCaseMethod } from '../utils/utils'

export default {
  language: 'csharp',
  client: 'flurl',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n',
      json: { quoteKeys: false, separator: ' = ' }
    })
    const contentType = GetContentType(http.headers)
    const hasBody = HasBody(http.body)
    const isJsonBody = hasBody && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))
    const isFormBody = hasBody && ContentTypeIncludes(contentType, 'form')
    const method = PascalCaseMethod(http.method)

    builder.line('using System;')
    builder.line('using System.Threading.Tasks;')
    builder.line('using Flurl;')
    builder.line('using Flurl.Http;')
    builder.line()
    builder.line('class Program')
    builder.line('{')
    builder.indent()
    builder.line('static async Task Main(string[] args)')
    builder.line('{')
    builder.indent()
    if (config.handleErrors) {
      builder.line('try')
      builder.line('{')
      builder.indent()
    }
    builder.line('var response = await "%s"', http.url)
    builder.indent()
    for (const [key, value] of Object.entries(http.params || {})) {
      if (Array.isArray(value)) value.forEach((item) => builder.line('.SetQueryParam("%s", "%s")', key, item))
      else builder.line('.SetQueryParam("%s", "%s")', key, value)
    }
    for (const [key, value] of Object.entries(http.headers || {})) {
      if (Array.isArray(value)) value.forEach((item) => builder.line('.WithHeader("%s", "%s")', key, item))
      else builder.line('.WithHeader("%s", "%s")', key, value)
    }
    if (http.cookies && Object.keys(http.cookies).length > 0) builder.line('.WithHeader("Cookie", "%s")', FormatCookieHeader(http.cookies))

    if (isJsonBody) {
      builder.line('.%rJsonAsync(new ', method)
      builder.json(http.body)
      builder.append(')')
      builder.line('.ReceiveString();')
    } else if (isFormBody) {
      builder.line('.%rUrlEncodedAsync(new ', method)
      builder.json(http.body)
      builder.append(')')
      builder.line('.ReceiveString();')
    } else if (method === 'Get') {
      builder.line('.GetStringAsync();')
    } else if (method === 'Delete') {
      builder.line('.DeleteAsync()')
      builder.line('.ReceiveString();')
    } else {
      builder.line('.%rAsync(null)', method)
      builder.line('.ReceiveString();')
    }
    builder.outdent()
    builder.line('Console.WriteLine(response);')
    if (config.handleErrors) {
      builder.outdent()
      builder.line('}')
      builder.line('catch (FlurlHttpException ex)')
      builder.line('{')
      builder.indent()
      builder.line('Console.WriteLine($"Error: {ex.Message}");')
      builder.outdent()
      builder.line('}')
    }
    builder.outdent()
    builder.line('}')
    builder.outdent()
    builder.line('}')
    return builder.output()
  }
} as Client
