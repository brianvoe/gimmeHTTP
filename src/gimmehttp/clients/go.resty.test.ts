import GoResty from './go.resty'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('GoResty.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = GoResty.generate(config, httpRequest)
    expect(result).toBe(`
package main

import (
  "fmt"
  "github.com/go-resty/resty/v2"
)

func main() {
  client := resty.New()
  resp, _ := client.R()
    .Get("https://example.com")

  fmt.Println(resp.String())
}
`.trim())
  })

  test('should build a POST request with headers', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer token"
      },
      "body": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = GoResty.generate(config, httpRequest)
    expect(result).toBe(`
package main

import (
  "fmt"
  "github.com/go-resty/resty/v2"
)

func main() {
  client := resty.New()
  resp, _ := client.R()
    .SetHeader("Content-Type", "application/json")
    .SetHeader("Authorization", "Bearer token")
    .SetBody(map[string]any{
        "key1": "value1"
      })
    .Post("https://example.com")

  fmt.Println(resp.String())
}
`.trim())
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "cookies": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = GoResty.generate(config, httpRequest)
    expect(result).toBe(`
package main

import (
  "fmt"
  "github.com/go-resty/resty/v2"
)

func main() {
  client := resty.New()
  resp, _ := client.R()
    .SetHeader("Cookie", "key1=value1")
    .Post("https://example.com")

  fmt.Println(resp.String())
}
`.trim())
  })

  test('should build a POST request with body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "body": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = GoResty.generate(config, httpRequest)
    expect(result).toBe(`
package main

import (
  "fmt"
  "github.com/go-resty/resty/v2"
)

func main() {
  client := resty.New()
  resp, _ := client.R()
    .SetHeader("Content-Type", "application/json")
    .SetBody(map[string]any{
        "key1": "value1"
      })
    .Post("https://example.com")

  fmt.Println(resp.String())
}
`.trim())
  })

  test('should build a POST request with advanced json body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "body": {
        "key1": "value1",
        "key2": {
          "key3": "value3"
        },
        "key4": [
          "value4",
          "value5"
        ],
        "empty": null
      }
    }
    const config: Config = {}
    const result = GoResty.generate(config, httpRequest)
    expect(result).toBe(`
package main

import (
  "fmt"
  "github.com/go-resty/resty/v2"
)

func main() {
  client := resty.New()
  resp, _ := client.R()
    .SetHeader("Content-Type", "application/json")
    .SetBody(map[string]any{
        "key1": "value1",
        "key2": map[string]any{
          "key3": "value3"
        },
        "key4": []any{
          "value4",
          "value5"
        },
        "empty": null
      })
    .Post("https://example.com")

  fmt.Println(resp.String())
}
`.trim())
  })

  test('should build a POST request with form-urlencoded body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "body": {
        "username": "user123",
        "email": "user@example.com"
      }
    }
    const config: Config = {}
    const result = GoResty.generate(config, httpRequest)
    expect(result).toBe("package main\n\nimport (\n  \"fmt\"\n  \"github.com/go-resty/resty/v2\"\n)\n\nfunc main() {\n  client := resty.New()\n  resp, _ := client.R()\n    .SetHeader(\"Content-Type\", \"application/x-www-form-urlencoded\")\n    .SetBody(\"\\\"{\\\\\\\"username\\\\\\\":\\\\\\\"user123\\\\\\\",\\\\\\\"email\\\\\\\":\\\\\\\"user@example.com\\\\\\\"}\\\"\")\n    .Post(\"https://example.com\")\n\n  fmt.Println(resp.String())\n}")
  })

  test('should build a POST request with text/plain body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "text/plain"
      },
      "body": "Simple plain text message"
    }
    const config: Config = {}
    const result = GoResty.generate(config, httpRequest)
    expect(result).toBe("package main\n\nimport (\n  \"fmt\"\n  \"github.com/go-resty/resty/v2\"\n)\n\nfunc main() {\n  client := resty.New()\n  resp, _ := client.R()\n    .SetHeader(\"Content-Type\", \"text/plain\")\n    .SetBody(\"\\\"Simple plain text message\\\"\")\n    .Post(\"https://example.com\")\n\n  fmt.Println(resp.String())\n}")
  })

  test('should build a POST request with error handling', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "name": "test"
      }
    }
    const config: Config = {
      "handleErrors": true
    }
    const result = GoResty.generate(config, httpRequest)
    expect(result).toBe(`
package main

import (
  "fmt"
  "log"
  "github.com/go-resty/resty/v2"
)

func main() {
  client := resty.New()
  resp, err := client.R()
    .SetHeader("Content-Type", "application/json")
    .SetBody(map[string]any{
        "name": "test"
      })
    .Post("https://example.com")

  if err != nil {
    log.Fatal(err)
  }
  fmt.Println(resp.String())
}
`.trim())
  })

  test('should build a GET request with URL parameters', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com",
      "params": {
        "address.zip": "66031",
        "address.country": "Wallis"
      }
    }
    const config: Config = {}
    const result = GoResty.generate(config, httpRequest)
    expect(result).toBe(`
package main

import (
  "fmt"
  "github.com/go-resty/resty/v2"
)

func main() {
  client := resty.New()
  resp, _ := client.R()
    .SetQueryParam("address.zip", "66031")
    .SetQueryParam("address.country", "Wallis")
    .Get("https://example.com")

  fmt.Println(resp.String())
}
`.trim())
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com",
      "params": {
        "tags": [
          "alpha",
          "beta"
        ],
        "category": "backend"
      }
    }
    const config: Config = {}
    const result = GoResty.generate(config, httpRequest)
    expect(result).toBe(`
package main

import (
  "fmt"
  "github.com/go-resty/resty/v2"
)

func main() {
  client := resty.New()
  resp, _ := client.R()
    .SetQueryString("tags=alpha&tags=beta")
    .SetQueryParam("category", "backend")
    .Get("https://example.com")

  fmt.Println(resp.String())
}
`.trim())
  })

})
