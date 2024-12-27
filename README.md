# GimmeHttp

## [gimmehttp.com](https://gimmehttp.com)

HTTP request code snippet generator

[![NPM Downloads](https://img.shields.io/npm/dt/gimmehttp.svg)](https://www.npmjs.com/package/gimmehttp)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/brianvoe/gimmehttp/jest.yml?logo=jest&label=unit%20tests) [![gimmehttp](https://snyk.io/advisor/npm-package/gimmehttp/badge.svg)](https://snyk.io/advisor/npm-package/gimmehttp)

GimmeHttp is a library for generating HTTP request code snippets in various languages based on a simple configuration. Whether you need to quickly prototype an API request or generate example code for documentation, GimmeHttp has you covered. Just provide the request details, and let GimmeHttp generate the code.

## Features

- Generate HTTP request code snippets in various languages
- Dead simple configuration(help me keep it that way)
- Add Custom Languages and Clients
- Zero dependencies

## Supported Languages and Targets

| Language   | Targets              |
| ---------- | -------------------- |
| c          | libcurl              |
| csharp     | http, restsharp      |
| curl       | native               |
| go         | http                 |
| javascript | fetch, axios, jQuery |
| node       | http, nod-fetch      |
| php        | curl, guzzle         |
| python     | requests, http       |
| ruby       | nethttp, faraday     |
| rust       | reqwest              |
| swift      | nsurlsession         |

## Installation

To install GimmeHttp, simply use npm:

```sh
npm install gimmehttp
```

## Simple Example

Here is a quick example of generating a simple GET request in Go:

```javascript
import { Generate } from 'gimmehttp'

// Create settings
const settings = {
  language: 'go',
  target: 'native',
  http: {
    method: 'GET',
    url: 'https://example.com'
  }
}

// Generate code
const { code, error } = Generate(settings)
if (error) {
  console.error(error)
}

// Output generated code
console.log(code)
```

Output:

```go
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
```

## Generate Function

The core functionality of GimmeHttp is its `Generate` function. This function takes in a request object and returns the generated code snippet as a string. The request object should have the following structure:

```typescript
Generate(settings: Settings): Outcome
```

### Settings Object

```typescript
interface Settigns {
  language: string // go, javascript, python, etc.
  target: string // native, axios, requests, etc.

  // HTTP request details
  http: {
    method: string // 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    url: string // ex: 'https://example.com'

    // Optional request details
    headers?: { [key: string]: string }
    cookies?: { [key: string]: string }
    body?: any
  }

  // Optional - configuration for the code generation
  config?: {
      // The character(s) to use for indentation
    indent?: string // default: '  '

    // The character(s) to use for joining lines
    join?: string // default: '\n'

    // Whether or not to handle errors in the generated code
    // default: false to help keep the generated code simple by default
    handleErrors?: boolean // default: false
  }
}
```

### Outcome Object

The `Generate` function returns an `Outcome` object. If the object
contains an `error` property, an error occurred during code generation.

```typescript
import { Generate } from 'gimmehttp'

const { code, error, language, client } = Generate(request)
if (error) {
  console.error(error)
}

// Output generated code
console.log(code)
console.log(language)
console.log(client)
```

```typescript
interface Outcome {
  error?: string // An error message if an error occurred
  
  // or //

  language?: string // Language used
  client?: string // Client used, set to default if not specified
  code?: string // Generated code
}
```

### Registry Custom Example

If you want to register a custom language/client, you can do so using the `Register` function:

```typescript
interface Target {
  default?: boolean
  language: string
  target: string
  generate: (config: Config, http: Http) => string
}
```

```typescript
import { Register, Generate } from 'gimmehttp'
import type { Config, Http } from 'gimmehttp'

const myCustomTarget = {
  language: 'html',
  target: 'href',
  generate(config: Config, http: Http): string {
    // Custom code generation logic
    return `<a href="${http.url}">${http.method}</a>`
  }
}

Register(myCustomTarget)

const settings = {
  language: 'html',
  target: 'href',
  http: {
    method: 'GET',
    url: 'https://example.com'
  }
}

const { code, error } = Generate(settings)
if (error) {
  console.error(error)
}
console.log(code)
```

Output:

```html
<a href="https://example.com">GET</a>
```

## Examples

### POST Request Example

```typescript
const settings = {
  language: 'javascript',
  target: 'fetch',
  http: {
    method: 'POST',
    url: 'https://example.com',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      key1: 'value1'
    }
  }
}

const { code, error } = Generate(settings)
if (error) {
  console.error(error)
}
console.log(output)
```

Output:

```javascript
fetch("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({"key1":"value1"}),
})
.then(response => {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.text();
})
.then(data => console.log(data));
```

---

## Contributing

GimmeHttp is an open-source project that welcomes contributions from the community. If you would like to contribute, please follow these steps:

1. Fork the repository
2. npm install
3. npm run dev
4. open http://localhost:1111
5. Make your changes
6. Write tests
7. Git commit and push your changes
8. Submit a pull request

---

Feel free to contribute to the project, suggest improvements, or report issues on our GitHub page!

