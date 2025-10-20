import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetContentType, ContentTypeIncludes, IsStringBody } from '../utils/utils'

export default {
  language: 'csharp',
  client: 'restsharp',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('using RestSharp;')
    builder.line()
    builder.line('namespace RestSharpExample')
    builder.line('{')
    builder.indent()
    builder.line('class Program')
    builder.line('{')
    builder.indent()
    builder.line('static void Main(string[] args)')
    builder.line('{')
    builder.indent()
    builder.line(`var client = new RestClient("${http.url}");`)
    builder.line(`var request = new RestRequest(Method.${http.method.toUpperCase()});`)

    if (http.headers && Object.keys(http.headers).length > 0) {
      builder.line()
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`request.AddHeader("${key}", "${val}");`))
        } else {
          builder.line(`request.AddHeader("${key}", "${value}");`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line()
      const cookies = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`request.AddHeader("Cookie", "${cookies}");`)
    }

    if (http.body) {
      builder.line()
      const contentType = GetContentType(http.headers)

      if (ContentTypeIncludes(contentType, 'form')) {
        builder.line('request.AddParameter("application/x-www-form-urlencoded", ')
        builder.json(http.body)
        builder.append(', ParameterType.RequestBody);')
      } else if (IsStringBody(http.body)) {
        builder.line(
          `request.AddParameter("${contentType || 'text/plain'}", "${http.body.replace(/"/g, '\\"')}", ParameterType.RequestBody);`
        )
      } else {
        // Default to JSON
        builder.line('request.AddJsonBody(')
        builder.json(http.body)
        builder.append(');')
      }
    }

    builder.line()
    builder.line('IRestResponse response = client.Execute(request);')
    builder.line('Console.WriteLine(response.Content);')

    builder.outdent()
    builder.line('}')
    builder.outdent()
    builder.line('}')
    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Client
