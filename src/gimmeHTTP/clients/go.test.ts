import Go from './go'
import { Http } from '../utils/generate'
import { describe, expect, test } from '@jest/globals'

describe('Go.generate', () => {
  test('should build a basic GET request', () => {
    const config = {
      handleErrors: false
    }
    const http: Http = {
      method: 'GET',
      url: 'https://example.com'
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
  url := "https://example.com"

  req, _ := http.NewRequest("GET", url, nil)

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()

  body, _ := io.ReadAll(resp.Body)

  fmt.Println(string(body))
}
    `.trim()
    )
  })

  test('should build a basic json POST request', () => {
    const config = {
      handleErrors: false
    }
    const http: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
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
  "bytes"
  "encoding/json"
)

func main() {
  url := "https://example.com"

  jsonBodyMap := map[string]any{
    "foo": "bar",
    "bar": "baz"
  }
  jsonBodyBytes, _ := json.Marshal(jsonBodyMap)

  req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonBodyBytes))

  req.Header.Set("Content-Type", "application/json")

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
      url: 'https://example.com',
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
  url := "https://example.com"

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
      url: 'https://example.com',
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
  url := "https://example.com"

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

  test('should build a POST request with advanced json body', () => {
    const config = {}
    const http: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        foo: 'bar',
        bar: {
          baz: 'qux'
        },
        arr: ['one', 'two'],
        bool: true
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
  "bytes"
  "encoding/json"
)

func main() {
  url := "https://example.com"

  jsonBodyMap := map[string]any{
    "foo": "bar",
    "bar": map[string]any{
      "baz": "qux"
    },
    "arr": []any{
      "one",
      "two"
    },
    "bool": true
  }
  jsonBodyBytes, _ := json.Marshal(jsonBodyMap)

  req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonBodyBytes))

  req.Header.Set("Content-Type", "application/json")

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()

  body, _ := io.ReadAll(resp.Body)

  fmt.Println(string(body))
}
    `.trim()
    )
  })
})
