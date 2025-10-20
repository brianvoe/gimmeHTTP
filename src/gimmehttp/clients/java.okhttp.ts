import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetContentType, HasBody, IsStringBody, IsObjectBody, ContentTypeIncludes } from '../utils/utils'

export default {
  language: 'java',
  client: 'okhttp',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    const hasBody = HasBody(http.body)
    const contentType = GetContentType(http.headers)
    const needsJson = hasBody && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))

    builder.line('import okhttp3.*;')
    if (needsJson) {
      builder.line('import org.json.JSONObject;')
    }
    if (contentType && ContentTypeIncludes(contentType, 'form')) {
      builder.line('import java.util.*;')
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

    builder.line('OkHttpClient client = new OkHttpClient();')
    builder.line()

    // Build request body if needed
    if (hasBody) {
      if (ContentTypeIncludes(contentType, 'form')) {
        builder.line('FormBody.Builder formBuilder = new FormBody.Builder();')
        for (const [key, value] of Object.entries(http.body)) {
          builder.line(`formBuilder.add("${key}", "${value}");`)
        }
        builder.line('RequestBody body = formBuilder.build();')
      } else if (needsJson) {
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
        builder.line('RequestBody body = RequestBody.create(')
        builder.indent()
        builder.line('jsonBody.toString(),')
        builder.line('MediaType.parse("application/json; charset=utf-8")')
        builder.outdent()
        builder.line(');')
      } else if (IsStringBody(http.body)) {
        builder.line('RequestBody body = RequestBody.create(')
        builder.indent()
        builder.line(`"${http.body.replace(/"/g, '\\"')}",`)
        builder.line(`MediaType.parse("${contentType || 'text/plain'}; charset=utf-8")`)
        builder.outdent()
        builder.line(');')
      }
      builder.line()
    }

    // Build request
    builder.line('Request.Builder requestBuilder = new Request.Builder()')
    builder.indent()
    builder.line(`.url("${http.url}")`)

    if (hasBody) {
      builder.line('.method("' + http.method.toUpperCase() + '", body)')
    } else {
      builder.line('.method("' + http.method.toUpperCase() + '", null)')
    }

    if (http.headers && Object.keys(http.headers).length > 0) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`.addHeader("${key}", "${val}")`))
        } else {
          builder.line(`.addHeader("${key}", "${value}")`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      const cookieString = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`.addHeader("Cookie", "${cookieString}")`)
    }

    builder.line('.build();')
    builder.outdent()
    builder.line()
    builder.line('Request request = requestBuilder;')
    builder.line('Response response = client.newCall(request).execute();')
    builder.line()
    builder.line('System.out.println(response.body().string());')

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
