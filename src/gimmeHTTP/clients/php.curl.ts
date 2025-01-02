import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'

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

    // Basic cURL options
    builder.line(`curl_setopt($ch, CURLOPT_URL, "${http.url}");`)
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
      builder.line('curl_setopt($ch, CURLOPT_POSTFIELDS,')
      builder.line("<<<'JSON'")
      formatJsonRecursive(http.body, builder)
      builder.line('JSON')
      builder.line(');')
      builder.outdent()
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

function formatJsonRecursive(json: any, builder: Builder): void {
  if (typeof json === 'object' && json !== null) {
    // Handle arrays
    if (Array.isArray(json)) {
      // In the generated code, just put the array in a single line for brevity
      builder.line('[' + json.map((item) => JSON.stringify(item)).join(', ') + ']')
    } else {
      // Handle objects
      builder.line('{')
      builder.indent()
      const entries = Object.entries(json)
      entries.forEach(([key, value], index) => {
        if (Array.isArray(value)) {
          builder.line(`"${key}": [${value.map((item) => JSON.stringify(item)).join(', ')}]`)
        } else if (typeof value === 'object' && value !== null) {
          builder.line(`"${key}": {`)
          builder.indent()
          formatJsonRecursive(value, builder)
          builder.outdent()
          builder.line('}')
        } else {
          builder.line(`"${key}": ${JSON.stringify(value)}`)
        }
        if (index < entries.length - 1) {
          builder.append(',')
        }
      })
      builder.outdent()
      builder.line('}')
    }
  } else {
    // For non-object (string, number, boolean, etc.)
    builder.line(JSON.stringify(json))
  }
}
