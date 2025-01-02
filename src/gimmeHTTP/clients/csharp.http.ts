import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'

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
    builder.line(
      `HttpRequestMessage request = new HttpRequestMessage(HttpMethod.${http.method.toUpperCase()}, "${http.url}");`
    )

    if (http.headers && Object.keys(http.headers).length > 0) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`request.Headers.Add("${key}", "${val}");`))
        } else {
          builder.line(`request.Headers.Add("${key}", "${value}");`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      const cookies = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`request.Headers.Add("Cookie", "${cookies}");`)
    }

    if (http.body) {
      builder.line(
        `request.Content = new StringContent("${JSON.stringify(http.body).replace(
          /"/g,
          '"'
        )}", System.Text.Encoding.UTF8, "application/json");`
      )
    }

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
