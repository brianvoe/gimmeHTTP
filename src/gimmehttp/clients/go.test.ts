import Go from './go'
import { Http, Config } from '../utils/generate'
import { describe, expect, test } from 'vitest'

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

  test('should build a POST request with form-urlencoded body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        username: 'user123',
        password: 'pass456'
      }
    }
    const config: Config = {}
    const result = Go.generate(config, httpRequest)
    expect(result).toBe(
      `
package main

import (
  "fmt"
  "net/http"
  "io"
  "bytes"
  "net/url"
)

func main() {
  url := "https://example.com"

  formData := url.Values{}
  formData.Set("username", "user123")
  formData.Set("password", "pass456")
  formBody := formData.Encode()

  req, _ := http.NewRequest("POST", url, bytes.NewBufferString(formBody))

  req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()

  body, _ := io.ReadAll(resp.Body)

  fmt.Println(string(body))
}
    `.trim()
    )
  })

  test('should build a POST request with text/plain body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Plain text message content'
    }
    const config: Config = {}
    const result = Go.generate(config, httpRequest)
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

  req, _ := http.NewRequest("POST", url, bytes.NewBufferString("Plain text message content"))

  req.Header.Set("Content-Type", "text/plain")

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()

  body, _ := io.ReadAll(resp.Body)

  fmt.Println(string(body))
}
    `.trim()
    )
  })

  test('should build a GET request with URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        'address.zip': '66031',
        'address.country': 'Wallis'
      }
    }
    const config: Config = {}
    const result = Go.generate(config, httpRequest)
    expect(result).toBe(
      `
package main

import (
  "fmt"
  "net/http"
  "io"
  "net/url"
)

func main() {
  baseURL := "https://example.com"
  u, err := url.Parse(baseURL)
  q := u.Query()
  q.Set("address.zip", "66031")
  q.Set("address.country", "Wallis")
  u.RawQuery = q.Encode()
  url := u.String()

  req, _ := http.NewRequest("GET", url, nil)

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()

  body, _ := io.ReadAll(resp.Body)

  fmt.Println(string(body))
}
    `.trim()
    )
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['go', 'http'],
        category: 'backend'
      }
    }
    const config: Config = {}
    const result = Go.generate(config, httpRequest)
    expect(result).toContain('q.Add("tags", "go")')
    expect(result).toContain('q.Add("tags", "http")')
    expect(result).toContain('q.Set("category", "backend")')
  })

  test('should build a POST request with URL parameters and body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      params: {
        version: '1.0'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: 'John'
      }
    }
    const config: Config = {}
    const result = Go.generate(config, httpRequest)
    expect(result).toContain('q.Set("version", "1.0")')
    expect(result).toContain('"name": "John"')
  })
})
