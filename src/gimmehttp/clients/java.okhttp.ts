import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  GetContentType,
  HasBody,
  IsStringBody,
  IsObjectBody,
  ContentTypeIncludes,
  EscapeDoubleQuoted,
  FormatCookieHeader
} from '../utils/utils'

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
    builder.line()

    builder.line('public class HttpExample {')
    builder.indent()
    builder.line(`public static void main(String[] args)${config.handleErrors ? '' : ' throws Exception'} {`)
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
          builder.line(`formBuilder.add("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(String(value))}");`)
        }
        builder.line('RequestBody body = formBuilder.build();')
      } else if (needsJson) {
        builder.line('RequestBody body = RequestBody.create(')
        builder.indent()
        builder.jsonStringLiteral(http.body)
        builder.append(',')
        builder.line('MediaType.parse("application/json; charset=utf-8")')
        builder.outdent()
        builder.line(');')
      } else if (IsStringBody(http.body)) {
        builder.line('RequestBody body = RequestBody.create(')
        builder.indent()
        builder.line(`"${EscapeDoubleQuoted(http.body)}",`)
        builder.line(`MediaType.parse("${EscapeDoubleQuoted(contentType || 'text/plain')}; charset=utf-8")`)
        builder.outdent()
        builder.line(');')
      }
      builder.line()
    }

    // Build request
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('HttpUrl.Builder urlBuilder = HttpUrl.parse("' + EscapeDoubleQuoted(http.url) + '").newBuilder();')
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`urlBuilder.addQueryParameter("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(val)}");`)
          }
        } else {
          builder.line(`urlBuilder.addQueryParameter("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(value)}");`)
        }
      }
      builder.line('HttpUrl url = urlBuilder.build();')
      builder.line()
    }

    builder.line('Request request = new Request.Builder()')
    builder.indent()
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('.url(url)')
    } else {
      builder.line(`.url("${EscapeDoubleQuoted(http.url)}")`)
    }

    if (hasBody) {
      builder.line('.method("' + http.method.toUpperCase() + '", body)')
    } else {
      builder.line('.method("' + http.method.toUpperCase() + '", null)')
    }

    if (http.headers && Object.keys(http.headers).length > 0) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`.addHeader("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(val)}")`))
        } else {
          builder.line(`.addHeader("${EscapeDoubleQuoted(key)}", "${EscapeDoubleQuoted(value)}")`)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line(`.addHeader("Cookie", "${EscapeDoubleQuoted(FormatCookieHeader(http.cookies))}")`)
    }

    builder.line('.build();')
    builder.outdent()
    builder.line()
    builder.line('try (Response response = client.newCall(request).execute()) {')
    builder.indent()
    builder.line('System.out.println(response.body().string());')
    builder.outdent()
    builder.line('}')

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
