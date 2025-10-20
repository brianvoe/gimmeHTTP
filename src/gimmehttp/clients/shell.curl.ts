import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { GetContentType, HasBody, IsObjectBody, ContentTypeIncludes } from '../utils/utils'

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
    const hasContent = HasBody(http.body)

    if (hasContent) {
      const contentType = GetContentType(http.headers)

      if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        // Pretty print JSON
        builder.line("-d $'")
        // builder.indent()
        builder.json(http.body)
        builder.append("'")
      } else if (ContentTypeIncludes(contentType, 'form')) {
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
