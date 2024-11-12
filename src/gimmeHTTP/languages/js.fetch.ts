import { Builder } from '../utils/builder'
import { Config, Http, Target } from '../index'

export default {
  default: true,
  language: 'javascript',
  target: 'fetch',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('fetch("' + http.url + '", {')
    builder.indent()
    builder.line(`method: "${http.method.toUpperCase()}",`)

    // Headers
    if (http.headers) {
      builder.line('headers: {')
      builder.indent()
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          builder.line(`"${key}": "${value.join(', ')}",`)
        } else {
          builder.line(`"${key}": "${value}",`)
        }
      }
      builder.outdent()
      builder.line('},')
    }

    // Note: Cookies are not supported in the fetch API
    // Cookies
    // if (http.cookies) {
    // }

    if (http.body) {
      builder.line(`body: JSON.stringify(${JSON.stringify(http.body)}),`)
    }

    builder.outdent()
    builder.line('})')

    if (config.handleErrors) {
      builder.line('.then(response => {')
      builder.indent()
      builder.line('if (!response.ok) {')
      builder.indent()
      builder.line('throw new Error("Network response was not ok");')
      builder.outdent()
      builder.line('}')
      builder.line('return response.text();')
      builder.outdent()
      builder.line('})')
      builder.line('.then(data => console.log(data))')
      builder.line('.catch(error => console.error("There was a problem with the fetch operation:", error));')
    } else {
      builder.line('.then(response => response.text())')
      builder.line('.then(data => console.log(data));')
    }

    return builder.output()
  }
} as Target
