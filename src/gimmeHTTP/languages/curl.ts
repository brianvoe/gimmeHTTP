import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Target } from '../utils/registry'

export default {
  default: true,
  language: 'curl',
  target: 'native',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line(`curl -X ${http.method} "${http.url}"`)
    builder.indent()

    if (http.headers) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`-H "${key}: ${val}"`)
          }
        } else {
          builder.line(`-H "${key}: ${value}"`)
        }
      }
    }

    if (http.cookies) {
      const cookieString = Object.entries(http.cookies)
        .map(([key, value]) =>
          Array.isArray(value) ? value.map((val) => `${key}=${val}`).join('; ') : `${key}=${value}`
        )
        .join('; ')
      builder.line(`-b "${cookieString}"`)
    }

    if (http.body) {
      const contentType = http.headers?.['content-type'] || http.headers?.['Content-Type'] || 'application/json'
      if (contentType === 'application/json') {
        const jsonData = JSON.stringify(http.body)
        builder.line(`-d '${jsonData}'`)
      } else if (contentType === 'application/x-www-form-urlencoded') {
        const formData = new URLSearchParams(http.body).toString()
        builder.line(`-d '${formData}'`)
      } else if (typeof http.body === 'string') {
        builder.line(`-d '${http.body}'`)
      }
    }

    return builder.output()
  }
} as Target
