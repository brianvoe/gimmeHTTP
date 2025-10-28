import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetContentType, HasBody, IsStringBody, IsObjectBody, ContentTypeIncludes } from '../utils/utils'

export default {
  default: true,
  language: 'java',
  client: 'httpurlconnection',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    const hasBody = HasBody(http.body)
    const contentType = GetContentType(http.headers)

    builder.line('import java.io.*;')
    builder.line('import java.net.*;')
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('import java.net.URLEncoder;')
    }
    if (hasBody && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))) {
      builder.line('import org.json.JSONObject;')
    }
    builder.line()

    builder.line('public class HttpExample {')
    builder.indent()
    builder.line('public static void main(String[] args) {')
    builder.indent()

    if (config.handleErrors) {
      builder.line('try {')
      builder.indent()
    }

    // Build URL with parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line(`String baseUrl = "${http.url}";`)
      builder.line('StringBuilder urlBuilder = new StringBuilder(baseUrl);')
      builder.line('urlBuilder.append(baseUrl.contains("?") ? "&" : "?");')
      builder.line()
      builder.line('String[] paramPairs = {')
      builder.indent()
      const paramPairs: string[] = []
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            paramPairs.push(`"${key}=" + URLEncoder.encode("${val}", "UTF-8")`)
          }
        } else {
          paramPairs.push(`"${key}=" + URLEncoder.encode("${value}", "UTF-8")`)
        }
      }
      for (let i = 0; i < paramPairs.length; i++) {
        if (i === paramPairs.length - 1) {
          builder.line(paramPairs[i])
        } else {
          builder.line(paramPairs[i] + ',')
        }
      }
      builder.outdent()
      builder.line('};')
      builder.line()
      builder.line('for (int i = 0; i < paramPairs.length; i++) {')
      builder.indent()
      builder.line('if (i > 0) urlBuilder.append("&");')
      builder.line('urlBuilder.append(paramPairs[i]);')
      builder.outdent()
      builder.line('}')
      builder.line()
      builder.line('URL url = new URL(urlBuilder.toString());')
    } else {
      builder.line(`URL url = new URL("${http.url}");`)
    }
    builder.line('HttpURLConnection conn = (HttpURLConnection) url.openConnection();')
    builder.line(`conn.setRequestMethod("${http.method.toUpperCase()}");`)

    if (http.headers && Object.keys(http.headers).length > 0) {
      builder.line()
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`conn.setRequestProperty("${key}", "${val}");`))
        } else {
          builder.line(`conn.setRequestProperty("${key}", "${value}");`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line()
      const cookieString = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`conn.setRequestProperty("Cookie", "${cookieString}");`)
    }

    if (hasBody) {
      builder.line()
      builder.line('conn.setDoOutput(true);')
      builder.line()

      if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        builder.line('JSONObject jsonBody = new JSONObject();')
        for (const [key, value] of Object.entries(http.body)) {
          if (typeof value === 'string') {
            builder.line(`jsonBody.put("${key}", "${value}");`)
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            builder.line(`jsonBody.put("${key}", ${value});`)
          } else if (value === null) {
            builder.line(`jsonBody.put("${key}", JSONObject.NULL);`)
          } else {
            builder.line(`jsonBody.put("${key}", ${JSON.stringify(value)});`)
          }
        }
        builder.line()
        builder.line('try (OutputStream os = conn.getOutputStream()) {')
        builder.indent()
        builder.line('byte[] input = jsonBody.toString().getBytes("utf-8");')
        builder.line('os.write(input, 0, input.length);')
        builder.outdent()
        builder.line('}')
      } else if (IsStringBody(http.body)) {
        builder.line('try (OutputStream os = conn.getOutputStream()) {')
        builder.indent()
        builder.line(`byte[] input = "${http.body.replace(/"/g, '\\"')}".getBytes("utf-8");`)
        builder.line('os.write(input, 0, input.length);')
        builder.outdent()
        builder.line('}')
      }
    }

    builder.line()
    builder.line('int responseCode = conn.getResponseCode();')
    builder.line('BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));')
    builder.line('String inputLine;')
    builder.line('StringBuilder response = new StringBuilder();')
    builder.line()
    builder.line('while ((inputLine = in.readLine()) != null) {')
    builder.indent()
    builder.line('response.append(inputLine);')
    builder.outdent()
    builder.line('}')
    builder.line('in.close();')
    builder.line()
    builder.line('System.out.println(response.toString());')

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
