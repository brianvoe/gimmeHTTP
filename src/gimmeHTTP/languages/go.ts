import { Builder } from '../utils/builder' // Adjust the import path as necessary
import { Config, Http, Generator } from '../types'

export default {
  default: true,
  language: 'go',
  target: 'http',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    builder.line('package main')
    builder.line()
    builder.line('import (')
    builder.indent()
    builder.line('"fmt"')
    builder.line('"net/http"')
    builder.line('"io"')
    if (config.handleErrors) {
      builder.line('"log"')
    }
    builder.outdent()
    builder.line(')')
    builder.line()
    builder.line('func main() {')
    builder.indent()
    builder.line(`url := "${http.url}"`)
    builder.line()

    if (config.handleErrors) {
      builder.line(`req, err := http.NewRequest("${http.method.toUpperCase()}", url, nil)`)
      builder.line(`if err != nil {`)
      builder.indent()
      builder.line('log.Fatal(err)')
      builder.outdent()
      builder.line('}')
      builder.line()
    } else {
      builder.line(`req, _ := http.NewRequest("${http.method.toUpperCase()}", url, nil)`)
      builder.line()
    }

    if (http.headers) {
      for (const [key, value] of Object.entries(http.headers)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`req.Header.Add("${key}", "${val}")`)
          }
        } else {
          builder.line(`req.Header.Set("${key}", "${value}")`)
        }
      }

      builder.line()
    }

    if (http.cookies) {
      for (const [key, value] of Object.entries(http.cookies)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line(`req.AddCookie(&http.Cookie{Name: "${key}", Value: "${val}"})`)
          }
        } else {
          builder.line(`req.AddCookie(&http.Cookie{Name: "${key}", Value: "${value}"})`)
        }
      }

      builder.line()
    }

    if (http.body) {
      builder.line(`// TODO: Add body handling logic for body type: ${typeof http.body}`)
      builder.line()
    }

    if (config.handleErrors) {
      builder.line(`resp, err := http.DefaultClient.Do(req)`)
      builder.line(`if err != nil {`)
      builder.indent()
      builder.line('log.Fatal(err)')
      builder.outdent()
      builder.line('}')
    } else {
      builder.line(`resp, _ := http.DefaultClient.Do(req)`)
    }

    builder.line(`defer resp.Body.Close()`)
    builder.line()

    if (config.handleErrors) {
      builder.line(`body, err := io.ReadAll(resp.Body)`)
      builder.line(`if err != nil {`)
      builder.indent()
      builder.line('log.Fatal(err)')
      builder.outdent()
      builder.line('}')
    } else {
      builder.line(`body, _ := io.ReadAll(resp.Body)`)
    }

    builder.line()
    builder.line(`fmt.Println(string(body))`)
    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Generator
