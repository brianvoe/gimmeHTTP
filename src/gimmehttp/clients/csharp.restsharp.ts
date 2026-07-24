import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  GetContentType,
  ContentTypeIncludes,
  IsStringBody,
  EscapeDoubleQuoted,
  FormatCookieHeader,
  HasBody,
  IsObjectBody,
  PascalCaseMethod
} from '../utils/utils'

export default {
  language: 'csharp',
  client: 'restsharp',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('using RestSharp;')
    builder.line('using System;')
    builder.line('using System.Threading.Tasks;')
    builder.line()
    builder.line('namespace RestSharpExample')
    builder.line('{')
    builder.indent()
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

    builder.line(`var client = new RestClient("${EscapeDoubleQuoted(http.url)}");`)
    builder.line(`var request = new RestRequest("", Method.${PascalCaseMethod(http.method)});`)

    // Add URL parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(
              `request.AddParameter("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(val)}", ParameterType.QueryString);`
            )
          }
        } else {
          builder.line(
            `request.AddParameter("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(value)}", ParameterType.QueryString);`
          )
        }
      }
    }

    // Content-Type comes from the body helper, not as a request header
    const headers = Object.entries(http.headers || {}).filter(
      ([key]) => !(HasBody(http.body) && key.toLowerCase() === 'content-type')
    )
    if (headers.length > 0) {
      builder.line()
      for (const [key, value] of headers) {
        if (Array.isArray(value)) {
          value.forEach((val) =>
            builder.line(`request.AddHeader("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(val)}");`)
          )
        } else {
          builder.line(`request.AddHeader("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(value)}");`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line()
      builder.line(`request.AddHeader("Cookie", "${EscapeDoubleQuoted(FormatCookieHeader(http.cookies))}");`)
    }

    if (HasBody(http.body)) {
      builder.line()
      const contentType = GetContentType(http.headers)

      if (ContentTypeIncludes(contentType, 'form')) {
        for (const [key, value] of Object.entries(http.body)) {
          builder.line(`request.AddParameter("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(String(value))}");`)
        }
      } else if (IsStringBody(http.body)) {
        builder.line(
          `request.AddStringBody("${EscapeDoubleQuoted(http.body)}", "${EscapeDoubleQuoted(contentType || 'text/plain')}");`
        )
      } else if (IsObjectBody(http.body)) {
        builder.line('request.AddStringBody(')
        builder.jsonStringLiteral(http.body)
        builder.append(', ContentType.Json);')
      }
    }

    builder.line()
    builder.line('RestResponse response = await client.ExecuteAsync(request);')
    if (config.handleErrors) {
      builder.line('if (!response.IsSuccessful)')
      builder.line('{')
      builder.indent()
      builder.line('throw new Exception(response.ErrorMessage ?? response.StatusDescription);')
      builder.outdent()
      builder.line('}')
    }
    builder.line('Console.WriteLine(response.Content);')

    if (config.handleErrors) {
      builder.outdent()
      builder.line('}')
      builder.line('catch (Exception ex)')
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
    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Client
