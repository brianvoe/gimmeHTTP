import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Target } from '../utils/registry'

export default {
  default: true,
  language: 'shell',
  client: 'curl',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    // Start curl command with method and URL
    builder.line(`curl -X ${http.method} "${http.url}" \\`)

    // Add headers
    if (http.headers) {
      builder.indent()
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`-H "${key}: ${val.replace(/"/g, '\\"')}" \\`)
          }
        } else {
          builder.line(`-H "${key}: ${value.replace(/"/g, '\\"')}" \\`)
        }
      }
      builder.outdent()
    }

    // Add cookies
    if (http.cookies) {
      builder.indent()
      const cookieString = Object.entries(http.cookies)
        .flatMap(([key, value]) => (Array.isArray(value) ? value.map((val) => `${key}=${val}`) : `${key}=${value}`))
        .join('; ')
      builder.line(`-b "${cookieString}" \\`)
      builder.outdent()
    }

    let addedBody = false

    // Add body
    if (http.body) {
      const contentType = http.headers?.['content-type'] || http.headers?.['Content-Type'] || 'application/json'
      builder.indent()

      if (contentType.includes('application/json')) {
        // Pretty print JSON
        const jsonData = JSON.stringify(http.body, null, 2).replace(/'/g, "'\\''")
        const jsonLines = jsonData.split('\n')

        // Start the data with $' to support embedded newlines
        builder.line(`-d $'${jsonLines[0]} \\`)

        // Middle lines
        for (let i = 1; i < jsonLines.length - 1; i++) {
          builder.line(`${jsonLines[i]} \\`)
        }

        // Last line closes the quote
        builder.line(`${jsonLines[jsonLines.length - 1]}'`)
        addedBody = true
      } else if (contentType === 'application/x-www-form-urlencoded') {
        const formData = new URLSearchParams(http.body).toString().replace(/'/g, "'\\''")
        builder.line(`-d '${formData}'`)
        addedBody = true
      } else if (typeof http.body === 'string') {
        const escapedBody = http.body.replace(/'/g, "'\\''")
        builder.line(`-d '${escapedBody}'`)
        addedBody = true
      }

      builder.outdent()
    }

    // Output code
    let output = builder.output()

    // Remove the trailing backslash from the last line
    output = output.replace(/\\\s*$/, '').trim()

    return output
  }
} as Target
