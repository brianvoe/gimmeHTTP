import { Builder } from '../utils/builder'
import { Config, Http, Generator } from '../types'

export default {
  language: 'rust',
  target: 'reqwest',
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
    builder.line('let res = client.request(reqwest::Method::' + http.method.toUpperCase() + ', "' + http.url + '")')
    builder.indent()

    if (http.headers) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`.header("${key}", "${val}")`))
        } else {
          builder.line(`.header("${key}", "${value}")`)
        }
      }
    }

    if (http.cookies) {
      for (const [key, value] of Object.entries(http.cookies)) {
        if (Array.isArray(value)) {
          value.forEach((val) => builder.line(`.cookie("${key}", "${val}")`))
        } else {
          builder.line(`.cookie("${key}", "${value}")`)
        }
      }
    }

    if (http.body) {
      builder.line('.body("' + JSON.stringify(http.body).replace(/"/g, '"') + '")')
    }

    builder.line('.send()?;')
    builder.outdent()

    builder.line()
    if (config.handleErrors) {
      builder.line('if res.status().is_success() {')
      builder.indent()
      builder.line('println!("{}", res.text()?);')
      builder.outdent()
      builder.line('} else {')
      builder.indent()
      builder.line('eprintln!("Request failed with status: {}", res.status());')
      builder.outdent()
      builder.line('}')
    } else {
      builder.line('println!("{}", res.text()?);')
    }

    builder.line('Ok(())')
    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Generator
