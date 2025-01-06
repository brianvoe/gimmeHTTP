import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'

export default {
  default: true,
  language: 'c',
  client: 'libcurl',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('#include <stdio.h>')
    builder.line('#include <curl/curl.h>')
    builder.line()
    builder.line('int main(void) {')
    builder.indent()
    builder.line('CURL *curl;')
    builder.line('CURLcode res;')
    builder.line()
    builder.line('curl_global_init(CURL_GLOBAL_DEFAULT);')
    builder.line('curl = curl_easy_init();')
    builder.line('if(curl) {')
    builder.indent()
    builder.line(`curl_easy_setopt(curl, CURLOPT_URL, "${http.url}");`)

    if (http.method.toUpperCase() === 'POST') {
      builder.line('curl_easy_setopt(curl, CURLOPT_POST, 1L);')
    } else if (http.method.toUpperCase() !== 'GET') {
      builder.line(`curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${http.method.toUpperCase()}");`)
    }

    if (http.headers && Object.keys(http.headers).length > 0) {
      builder.line()
      builder.line('struct curl_slist *headers = NULL;')
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`headers = curl_slist_append(headers, "${key}: ${val}");`))
        } else {
          builder.line(`headers = curl_slist_append(headers, "${key}: ${value}");`)
        }
      }
      builder.line('curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);')
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line()
      const cookies = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`curl_easy_setopt(curl, CURLOPT_COOKIE, "${cookies}");`)
    }

    if (http.body) {
      builder.line()
      builder.line('curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"(')
      formatJsonBody(http.body, builder)
      builder.append(')");')
    }

    builder.line()
    builder.line('res = curl_easy_perform(curl);')
    builder.line('if(res != CURLE_OK)')
    builder.indent()
    builder.line('fprintf(stderr, "failed: %s", curl_easy_strerror(res));')
    builder.outdent()

    if (http.headers && Object.keys(http.headers).length > 0) {
      builder.line('curl_slist_free_all(headers);')
    }
    builder.line('curl_easy_cleanup(curl);')
    builder.outdent()
    builder.line('}')
    builder.line('curl_global_cleanup();')
    builder.line('return 0;')
    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Client

function formatJsonBody(json: any, builder: Builder): void {
  const lines = JSON.stringify(json, null, 2).split('\n')
  // for loop with indea and value
  for (let i = 0; i < lines.length; i++) {
    // if first line, append instead of line
    if (i === 0) {
      builder.append(`${lines[i]}`)
      continue
    }

    builder.line(`${lines[i]}`)
  }
}
