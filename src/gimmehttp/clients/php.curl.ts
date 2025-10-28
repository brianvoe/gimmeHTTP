import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetContentType, IsStringBody, IsObjectBody, ContentTypeIncludes } from '../utils/utils'

export default {
  default: true,
  language: 'php',
  client: 'curl',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    // Start our PHP file
    builder.line('<?php')
    builder.line()

    // Initialize cURL
    builder.line('$ch = curl_init();')
    builder.line()

    // Build URL with parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('$url = "' + http.url + '";')
      builder.line('$params = [];')
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`$params[] = "${key}=" . urlencode("${val}");`)
          }
        } else {
          builder.line(`$params[] = "${key}=" . urlencode("${value}");`)
        }
      }
      builder.line('$url .= (strpos($url, "?") !== false ? "&" : "?") . implode("&", $params);')
      builder.line()
      builder.line('curl_setopt($ch, CURLOPT_URL, $url);')
    } else {
      builder.line(`curl_setopt($ch, CURLOPT_URL, "${http.url}");`)
    }
    builder.line('curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);')
    builder.line(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${http.method.toUpperCase()}");`)

    // Headers
    if (http.headers) {
      builder.line()
      builder.line('$headers = [];')
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`$headers[] = "${key}: ${val}";`))
        } else {
          builder.line(`$headers[] = "${key}: ${value}";`)
        }
      }
      builder.line('curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);')
    }

    // Cookies
    if (http.cookies) {
      builder.line()
      builder.line('$cookies = [];')
      for (const [key, value] of Object.entries(http.cookies)) {
        builder.line(`$cookies[] = "${key}=${value}";`)
      }
      builder.line('curl_setopt($ch, CURLOPT_COOKIE, implode("; ", $cookies));')
    }

    // Body
    if (http.body) {
      builder.line()
      const contentType = GetContentType(http.headers)

      if (ContentTypeIncludes(contentType, 'form')) {
        builder.line('$postData = ')
        builder.json(http.body)
        builder.append(';')
        builder.line('curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));')
      } else if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        builder.line('curl_setopt($ch, CURLOPT_POSTFIELDS,')
        builder.line('<<<JSON')
        builder.line()
        builder.json(http.body)
        builder.line('JSON')
        builder.line(');')
      } else if (IsStringBody(http.body)) {
        const escapedBody = http.body.replace(/'/g, "\\'")
        builder.line(`curl_setopt($ch, CURLOPT_POSTFIELDS, '${escapedBody}');`)
      }
    }

    // Execute and handle response
    builder.line()
    builder.line('$response = curl_exec($ch);')

    if (config.handleErrors) {
      builder.line('if (curl_errno($ch)) {')
      builder.indent()
      builder.line('echo "Error: " . curl_error($ch);')
      builder.outdent()
      builder.line('}')
    }

    builder.line('curl_close($ch);')
    builder.line()
    builder.line('echo $response;')

    return builder.output()
  }
} as Client
