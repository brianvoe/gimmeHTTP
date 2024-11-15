import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Target } from '../utils/registry'

export default {
  language: 'csharp',
  target: 'restsharp',
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
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`request.AddHeader("${key}", "${val}");`))
        } else {
          builder.line(`request.AddHeader("${key}", "${value}");`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      const cookies = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`request.AddHeader("Cookie", "${cookies}");`)
    }

    if (http.body) {
      builder.line(`request.AddJsonBody(${JSON.stringify(http.body)});`)
    }

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
} as Target
