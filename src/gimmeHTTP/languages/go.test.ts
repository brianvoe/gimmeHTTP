import Go from './go'
import { Http } from '../types'
import { describe, expect, test } from '@jest/globals'

describe('Go.generate', () => {
  test('should build a basic GET request', () => {
    const config = {
      handleErrors: false
    }
    const http: Http = {
      method: 'GET',
      url: 'https://gofakeit.com'
    }
    const result = Go.generate(config, http)
    expect(result).toBe(
      `
package main

import (
  "fmt"
  "net/http"
  "io"
)

func main() {
  url := "https://gofakeit.com"

  req, _ := http.NewRequest("GET", url, nil)

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()

  body, _ := io.ReadAll(resp.Body)

  fmt.Println(string(body))
}
    `.trim()
    )
  })

  test('should build a POST request with headers', () => {
    const config = {
      handleErrors: true
    }
    const http: Http = {
      method: 'POST',
      url: 'https://gofakeit.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      }
    }
    const result = Go.generate(config, http)
    expect(result).toBe(
      `
package main

import (
  "fmt"
  "net/http"
  "io"
  "log"
)

func main() {
  url := "https://gofakeit.com"

  req, err := http.NewRequest("POST", url, nil)
  if err != nil {
    log.Fatal(err)
  }

  req.Header.Set("Content-Type", "application/json")
  req.Header.Set("Authorization", "Bearer token")

  resp, err := http.DefaultClient.Do(req)
  if err != nil {
    log.Fatal(err)
  }
  defer resp.Body.Close()

  body, err := io.ReadAll(resp.Body)
  if err != nil {
    log.Fatal(err)
  }

  fmt.Println(string(body))
}
    `.trim()
    )
  })

  test('should build a POST request with cookies', () => {
    const config = {
      handleErrors: true
    }
    const http: Http = {
      method: 'POST',
      url: 'https://gofakeit.com',
      cookies: {
        foo: 'bar',
        bar: 'baz'
      }
    }
    const result = Go.generate(config, http)
    expect(result).toBe(
      `
package main

import (
  "fmt"
  "net/http"
  "io"
  "log"
)

func main() {
  url := "https://gofakeit.com"

  req, err := http.NewRequest("POST", url, nil)
  if err != nil {
    log.Fatal(err)
  }

  req.AddCookie(&http.Cookie{Name: "foo", Value: "bar"})
  req.AddCookie(&http.Cookie{Name: "bar", Value: "baz"})

  resp, err := http.DefaultClient.Do(req)
  if err != nil {
    log.Fatal(err)
  }
  defer resp.Body.Close()

  body, err := io.ReadAll(resp.Body)
  if err != nil {
    log.Fatal(err)
  }

  fmt.Println(string(body))
}
    `.trim()
    )
  })
})
