import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ContentTypeIncludes, FormatCookieHeader, GetContentType, IsObjectBody, IsStringBody } from '../utils/utils'

export default {
  language: 'rust',
  client: 'reqwest',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('use reqwest::blocking::Client;')
    builder.line('use std::error::Error;')
    builder.line()
    builder.line('fn main() -> Result<(), Box<dyn Error>> {')
    builder.indent()
    builder.line('let client = Client::new();')
    builder.line()
    builder.line('let res = client.request(reqwest::Method::%r, "%s")', http.method.toUpperCase(), http.url)
    builder.indent()

    // URL Parameters
    if (http.params && Object.keys(http.params).length > 0) {
      builder.line('.query(&[')
      builder.indent()
      for (const [key, value] of Object.entries(http.params)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line('("%s", "%s"),', key, val)
          }
        } else {
          builder.line('("%s", "%s"),', key, value)
        }
      }
      builder.outdent()
      builder.line('])')
    }

    if (http.headers) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line('.header("%s", "%s")', key, val))
        } else {
          builder.line('.header("%s", "%s")', key, value)
        }
      }
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line('.header("Cookie", "%s")', FormatCookieHeader(http.cookies))
    }

    const hasExplicitContentType = Object.keys(http.headers || {}).some((key) => key.toLowerCase() === 'content-type')
    if (http.body) {
      const contentType = GetContentType(http.headers)

      if (ContentTypeIncludes(contentType, 'form')) {
        const pairs = Object.entries(http.body)
          .map(([key, value]) => builder.format('("%s", "%s")', key, String(value)))
          .join(', ')
        builder.line('.form(&[%r])', pairs)
      } else if (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body))) {
        if (!hasExplicitContentType) {
          builder.line('.header("Content-Type", "application/json")')
        }
        builder.line('.body(')
        builder.jsonStringLiteral(http.body)
        builder.append(')')
      } else if (IsStringBody(http.body)) {
        builder.line('.body("%s")', http.body)
      }
    }

    builder.line(config.handleErrors ? '.send()?.error_for_status()?;' : '.send()?;')
    builder.outdent()

    builder.line()
    builder.line('println!("{}", res.text()?);')

    builder.line('Ok(())')
    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Client
