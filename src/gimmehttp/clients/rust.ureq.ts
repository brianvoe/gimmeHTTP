import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ContentTypeIncludes, FormatCookieHeader, GetContentType, HasBody, IsObjectBody } from '../utils/utils'

export default {
  language: 'rust',
  client: 'ureq',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })
    const contentType = GetContentType(http.headers)
    const isJsonBody = HasBody(http.body) && (ContentTypeIncludes(contentType, 'json') || (!contentType && IsObjectBody(http.body)))
    const isFormBody = HasBody(http.body) && ContentTypeIncludes(contentType, 'form')

    builder.line('fn main() -> Result<(), ureq::Error> {')
    builder.indent()
    builder.line('let resp = ureq::request("%s", "%s")', http.method.toUpperCase(), http.url)
    builder.indent()
    for (const [key, value] of Object.entries(http.headers || {})) {
      if (Array.isArray(value)) value.forEach((item) => builder.line('.set("%s", "%s")', key, item))
      else builder.line('.set("%s", "%s")', key, value)
    }
    if (isJsonBody && !contentType) builder.line('.set("Content-Type", "application/json")')
    if (http.cookies && Object.keys(http.cookies).length > 0) builder.line('.set("Cookie", "%s")', FormatCookieHeader(http.cookies))
    for (const [key, value] of Object.entries(http.params || {})) {
      if (Array.isArray(value)) value.forEach((item) => builder.line('.query("%s", "%s")', key, item))
      else builder.line('.query("%s", "%s")', key, value)
    }
    if (isJsonBody) {
      builder.line('.send_json(ureq::json!(')
      builder.indent()
      builder.json(http.body)
      builder.outdent()
      builder.append('))?;')
    } else if (isFormBody) {
      const pairs = Object.entries(http.body)
        .map(([key, value]) => builder.format('("%s", "%s")', key, String(value)))
        .join(', ')
      builder.line('.send_form(&[%r])?;', pairs)
    } else if (HasBody(http.body)) {
      builder.line('.send_string("%s")?;', typeof http.body === 'string' ? http.body : JSON.stringify(http.body))
    } else {
      builder.line('.call()?;')
    }
    builder.outdent()
    builder.line()
    builder.line('println!("{}", resp.into_string()?);')
    builder.line('Ok(())')
    builder.outdent()
    builder.line('}')
    return builder.output()
  }
} as Client
