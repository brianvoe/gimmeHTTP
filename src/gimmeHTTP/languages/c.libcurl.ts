import { Target, Config, Http, Builder } from '../index'

export default {
  default: true,
  language: 'c',
  target: 'libcurl',
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
      const cookies = Object.entries(http.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
      builder.line(`curl_easy_setopt(curl, CURLOPT_COOKIE, "${cookies}");`)
    }

    if (http.body) {
      builder.line(`curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"(${JSON.stringify(http.body)})");`)
    }

    builder.line('res = curl_easy_perform(curl);')
    builder.line('if(res != CURLE_OK)')
    builder.indent()
    builder.line('fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));')
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
} as Target
