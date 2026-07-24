import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ContentTypeIncludes, GetContentType, HasBody, IsObjectBody, IsStringBody } from '../utils/utils'

const EscapePhpString = (value: string): string =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\$/g, '\\$')

export default {
  default: true,
  language: 'php',
  client: 'curl',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n',
      json: {
        objOpen: '[',
        objClose: ']',
        arrOpen: '[',
        arrClose: ']',
        separator: ' => ',
        endComma: true,
        nullLiteral: 'null',
        escapeString: EscapePhpString
      }
    })
    const contentType = GetContentType(http.headers)
    const needsJsonContentType = HasBody(http.body) && IsObjectBody(http.body) && !contentType

    // Start our PHP file
    builder.line('<?php')
    builder.line()

    // Initialize cURL
    builder.line('$ch = curl_init();')
    builder.line()

    // Build URL with parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('$url = "%s";', http.url)
      builder.line('$params = [];')
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line('$params[] = "%s=" . urlencode("%s");', key, val)
          }
        } else {
          builder.line('$params[] = "%s=" . urlencode("%s");', key, value)
        }
      }
      builder.line('$url .= (strpos($url, "?") !== false ? "&" : "?") . implode("&", $params);')
      builder.line()
      builder.line('curl_setopt($ch, CURLOPT_URL, $url);')
    } else {
      builder.line('curl_setopt($ch, CURLOPT_URL, "%s");', http.url)
    }
    builder.line('curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);')
    builder.line('curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "%s");', http.method.toUpperCase())

    // Headers
    if (http.headers || needsJsonContentType) {
      builder.line()
      builder.line('$headers = [];')
      for (const [key, value] of Object.entries(http.headers || {})) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line('$headers[] = "%s: %s";', key, val))
        } else {
          builder.line('$headers[] = "%s: %s";', key, value)
        }
      }
      if (needsJsonContentType) builder.line('$headers[] = "Content-Type: application/json";')
      builder.line('curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);')
    }

    // Cookies
    if (http.cookies) {
      builder.line()
      builder.line('$cookies = [];')
      for (const [key, value] of Object.entries(http.cookies)) {
        builder.line('$cookies[] = "%s=%s";', key, value)
      }
      builder.line('curl_setopt($ch, CURLOPT_COOKIE, implode("; ", $cookies));')
    }

    // Body
    if (HasBody(http.body)) {
      builder.line()

      if (ContentTypeIncludes(contentType, 'form')) {
        builder.line('$postData = ')
        builder.json(http.body)
        builder.append(';')
        builder.line('curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));')
      } else if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        builder.line('$body = "%s";', JSON.stringify(http.body))
        builder.line('curl_setopt($ch, CURLOPT_POSTFIELDS, $body);')
      } else if (IsStringBody(http.body)) {
        builder.line('curl_setopt($ch, CURLOPT_POSTFIELDS, "%s");', http.body)
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
