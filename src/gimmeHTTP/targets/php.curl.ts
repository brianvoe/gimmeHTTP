import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Target } from '../utils/registry'

export default {
  default: true,
  language: 'php',
  client: 'curl',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('<?php')
    builder.line()
    builder.line('$ch = curl_init();')
    builder.line()

    builder.line(`curl_setopt($ch, CURLOPT_URL, "${http.url}");`)
    builder.line('curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);')
    builder.line(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${http.method.toUpperCase()}");`)

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

    if (http.cookies) {
      builder.line()
      builder.line('$cookies = [];')
      for (const [key, value] of Object.entries(http.cookies)) {
        builder.line(`$cookies[] = "${key}=${value}";`)
      }
      builder.line('curl_setopt($ch, CURLOPT_COOKIE, implode("; ", $cookies));')
    }

    if (http.body) {
      builder.line()
      builder.line(`curl_setopt($ch, CURLOPT_POSTFIELDS, '${JSON.stringify(http.body)}');`)
    }

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
} as Target
