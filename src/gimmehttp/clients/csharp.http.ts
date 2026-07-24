import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  GetContentType,
  ContentTypeIncludes,
  FormatCookieHeader,
  HasBody,
  IsObjectBody,
  PascalCaseMethod
} from '../utils/utils'

// HttpMethod exposes a static property for the standard verbs, anything else needs the constructor
const httpMethodProperties = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH', 'TRACE']

function httpMethod(method: string): string {
  const upper = method.toUpperCase()
  return httpMethodProperties.includes(upper) ? `HttpMethod.${PascalCaseMethod(upper)}` : `new HttpMethod("${upper}")`
}

export default {
  default: true,
  language: 'csharp',
  client: 'http',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('using System;')
    builder.line('using System.Net.Http;')
    builder.line('using System.Threading.Tasks;')
    builder.line('using System.Web;')
    if (HasBody(http.body) && ContentTypeIncludes(GetContentType(http.headers), 'form')) {
      builder.line('using System.Collections.Generic;')
    }
    builder.line()
    builder.line('namespace HttpClientExample')
    builder.line('{')
    builder.indent()
    builder.line('class Program')
    builder.line('{')
    builder.indent()
    builder.line('static async Task Main(string[] args)')
    builder.line('{')
    builder.indent()
    builder.line('using (HttpClient client = new HttpClient())')
    builder.line('{')
    builder.indent()

    // Build URL with parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('var uriBuilder = new UriBuilder("%s");', http.url)
      builder.line('var query = HttpUtility.ParseQueryString(uriBuilder.Query);')

      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line('query.Add("%s", "%s");', key, val)
          }
        } else {
          builder.line('query.Add("%s", "%s");', key, value)
        }
      }

      builder.line('uriBuilder.Query = query.ToString();')
      builder.line('HttpRequestMessage request = new HttpRequestMessage(%r, uriBuilder.ToString());', httpMethod(http.method))
    } else {
      builder.line('HttpRequestMessage request = new HttpRequestMessage(%r, "%s");', httpMethod(http.method), http.url)
    }

    // Content-Type is set by the request content, not as a request header
    const headers = Object.entries(http.headers || {}).filter(
      ([key]) => !(HasBody(http.body) && key.toLowerCase() === 'content-type')
    )
    if (headers.length > 0) {
      builder.line()
      for (const [key, value] of headers) {
        if (Array.isArray(value)) {
          value.forEach((val) =>
            builder.line('request.Headers.Add("%s", "%s");', key, val)
          )
        } else {
          builder.line('request.Headers.Add("%s", "%s");', key, value)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line()
      builder.line('request.Headers.Add("Cookie", "%s");', FormatCookieHeader(http.cookies))
    }

    if (HasBody(http.body)) {
      builder.line()
      const contentType = GetContentType(http.headers)

      if (ContentTypeIncludes(contentType, 'form')) {
        builder.line('var formContent = new FormUrlEncodedContent(new Dictionary<string, string>')
        builder.line('{')
        builder.indent()
        for (const [key, value] of Object.entries(http.body)) {
          builder.line('{ "%s", "%s" },', key, String(value))
        }
        builder.outdent()
        builder.line('});')
        builder.line('request.Content = formContent;')
      } else if (IsObjectBody(http.body)) {
        builder.line('string json = ')
        builder.jsonStringLiteral(http.body)
        builder.append(';')
        builder.line('request.Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");')
      } else {
        builder.line(
          'request.Content = new StringContent("%s", System.Text.Encoding.UTF8, "%s");',
          http.body,
          contentType || 'text/plain'
        )
      }
    }

    builder.line()
    builder.line('HttpResponseMessage response = await client.SendAsync(request);')
    builder.line('response.EnsureSuccessStatusCode();')
    builder.line('string responseBody = await response.Content.ReadAsStringAsync();')
    builder.line('Console.WriteLine(responseBody);')

    builder.outdent()
    builder.line('}')
    builder.outdent()
    builder.line('}')
    builder.outdent()
    builder.line('}')
    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Client
