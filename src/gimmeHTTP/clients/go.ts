import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { IsJsonRequest } from '../utils/utils'

export default {
  default: true,
  language: 'go',
  client: 'http',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })

    const isJsonBody = IsJsonRequest(http.method, http.headers) && http.body

    builder.line('package main')
    builder.line()
    builder.line('import (')
    builder.indent()
    builder.line('"fmt"')
    builder.line('"net/http"')
    builder.line('"io"')
    if (isJsonBody) {
      builder.line('"bytes"')
      builder.line('"encoding/json"')
    }
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

    let bodyVar = 'nil'
    if (isJsonBody) {
      builder.line('jsonBodyMap := map[string]any{')
      builder.indent()
      for (const [key, value] of Object.entries(http.body)) {
        builder.line(`"${key}": ${JSON.stringify(value)},`)
      }
      builder.outdent()
      builder.line('}')
      if (config.handleErrors) {
        builder.line('jsonBodyBytes, err := json.Marshal(jsonBodyMap)')
        builder.line('if err != nil {')
        builder.indent()
        builder.line('log.Fatal(err)')
        builder.outdent()
        builder.line('}')
      } else {
        builder.line('jsonBodyBytes, _ := json.Marshal(jsonBodyMap)')
      }
      bodyVar = 'bytes.NewBuffer(jsonBodyBytes)'
      builder.line()
    }

    if (config.handleErrors) {
      builder.line(`req, err := http.NewRequest("${http.method.toUpperCase()}", url, ${bodyVar})`)
      builder.line(`if err != nil {`)
      builder.indent()
      builder.line('log.Fatal(err)')
      builder.outdent()
      builder.line('}')
      builder.line()
    } else {
      builder.line(`req, _ := http.NewRequest("${http.method.toUpperCase()}", url, ${bodyVar})`)
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
} as Client
