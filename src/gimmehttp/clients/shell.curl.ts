import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'

export default {
  default: true,
  language: 'shell',
  client: 'curl',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || ' \\\n'
    })

    // Start curl command with method and URL
    builder.line(`curl -X ${http.method} "${http.url}"`)

    // Everything is indented
    builder.indent()

    // Add headers
    if (http.headers) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`-H "${key}: ${val.replace(/"/g, '\\"')}"`)
          }
        } else {
          builder.line(`-H "${key}: ${value.replace(/"/g, '\\"')}"`)
        }
      }
    }

    // Add cookies
    if (http.cookies) {
      const cookieString = Object.entries(http.cookies)
        .flatMap(([key, value]) => (Array.isArray(value) ? value.map((val) => `${key}=${val}`) : `${key}=${value}`))
        .join('; ')
      builder.line(`-b "${cookieString}"`)
    }

    // Add body
    const isStringBody = typeof http.body === 'string'
    const hasContent = isStringBody ? http.body && http.body.length > 0 : http.body && Object.keys(http.body).length > 0

    if (hasContent) {
      const contentType = http.headers?.['content-type'] || http.headers?.['Content-Type'] || 'application/json'

      if (contentType.includes('application/json')) {
        // Pretty print JSON
        builder.line("-d $'")
        // builder.indent()
        builder.json(http.body)
        builder.append("'")
      } else if (contentType === 'application/x-www-form-urlencoded') {
        const formData = new URLSearchParams(http.body).toString().replace(/'/g, "'\\''")
        builder.line(`-d '${formData}'`)
      } else if (typeof http.body === 'string') {
        const escapedBody = http.body.replace(/'/g, "'\\''")
        builder.line(`-d '${escapedBody}'`)
      }
    }

    // Output code
    let output = builder.output()

    // Remove the trailing backslash from the last line
    output = output.replace(/\\\s*$/, '').trim()

    return output
  }
} as Client
