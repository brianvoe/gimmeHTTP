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
  language: 'java',
  client: 'httpclient',
  generate(config: Config, http: Http): string {
    const builder = new Builder({ indent: config.indent || '  ', join: config.join || '\n' })
    const hasBody = HasBody(http.body)
    const contentType = GetContentType(http.headers)
    const isForm = hasBody && ContentTypeIncludes(contentType, 'form')
    const isJson = hasBody && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))

    builder.line('import java.net.URI;')
    builder.line('import java.net.http.HttpClient;')
    builder.line('import java.net.http.HttpRequest;')
    builder.line('import java.net.http.HttpResponse;')
    if (isForm) {
      builder.line('import java.net.URLEncoder;')
      builder.line('import java.nio.charset.StandardCharsets;')
    }
    builder.line()
    builder.line('public class HttpExample {')
    builder.indent()
    builder.line('public static void main(String[] args)%r {', config.handleErrors ? '' : ' throws Exception')
    builder.indent()
    if (config.handleErrors) {
      builder.line('try {')
      builder.indent()
    }
    builder.line('HttpClient client = HttpClient.newHttpClient();')
    builder.line()

    let body = 'HttpRequest.BodyPublishers.noBody()'
    if (isForm) {
      const pairs: string[] = []
      for (const [key, value] of Object.entries(http.body)) {
        pairs.push(
          builder.format(
            '"%s=" + URLEncoder.encode("%s", StandardCharsets.UTF_8)',
            key,
            String(value)
          )
        )
      }
      builder.line('String form = %r;', pairs.join(' + "&" + '))
      body = 'HttpRequest.BodyPublishers.ofString(form)'
      builder.line()
    } else if (isJson) {
      builder.line('String json = ')
      builder.jsonStringLiteral(http.body)
      builder.append(';')
      body = 'HttpRequest.BodyPublishers.ofString(json)'
      builder.line()
    } else if (hasBody && IsStringBody(http.body)) {
      builder.line('String body = "%s";', http.body)
      body = 'HttpRequest.BodyPublishers.ofString(body)'
      builder.line()
    }

    const url = BuildUrlWithParams(http.url, http.params)
    builder.line('HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()')
    builder.indent()
    builder.line('.uri(URI.create("%s"))', url)
    builder.line('.method("%s", %r);', http.method.toUpperCase(), body)
    builder.outdent()

    for (const [key, value] of Object.entries(http.headers || {})) {
      for (const headerValue of Array.isArray(value) ? value : [value]) {
        builder.line('requestBuilder.header("%s", "%s");', key, headerValue)
      }
    }
    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line('requestBuilder.header("Cookie", "%s");', FormatCookieHeader(http.cookies))
    }
    builder.line('HttpRequest request = requestBuilder.build();')
    builder.line('HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());')
    builder.line('System.out.println(response.body());')
    if (config.handleErrors) {
      builder.outdent()
      builder.line('} catch (Exception e) {')
      builder.indent()
      builder.line('e.printStackTrace();')
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
