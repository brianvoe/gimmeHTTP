# GimmeHttp

GimmeHttp is a library for generating HTTP request code snippets in various languages based on a simple configuration. Whether you need to quickly prototype an API request or generate example code for documentation, GimmeHttp has you covered. Just provide the request details, and let GimmeHttp generate code in your desired language.

## Quick Example

Here is a quick example of generating a simple GET request in Go:

```javascript
import { Generate, AllCodes } from 'gimmehttp';

// Register all codes
Register(AllCodes);

// Create request
const request = {
  language: 'go',
  target: 'native',
  http: {
    method: 'GET',
    url: 'https://gofakeit.com'
  }
};

// Generate output with request
const output = Generate(request);
console.log(output);
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
  url := "https://gofakeit.com"

  req, _ := http.NewRequest("GET", url, nil)

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()

  body, _ := io.ReadAll(resp.Body)

  fmt.Println(string(body))
}
```

## Installation

To install GimmeHttp, simply use npm:

```sh
npm install gimmehttp
```

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

## Generate Function

The core functionality of GimmeHttp is its `Generate` function. This function takes in a request object and returns the generated code snippet as a string. The request object should have the following structure:

### Registry Custom Example

If you want to register a custom language or target, you can do so using the `Register` function:

```javascript
import { Generate, Register, Config, Http } from 'gimmehttp';

const myCustomTarget = {
  language: 'ruby',
  target: 'myCustomLibrary',
  generate(config: Config, http: Http): string {
    // Custom code generation logic
    return `puts "Custom HTTP request for ${http.url}"`;
  }
};

Register(myCustomTarget);

const request = {
  language: 'ruby',
  target: 'myCustomLibrary',
  http: {
    method: 'GET',
    url: 'https://gofakeit.com'
  }
};

const output = Generate(request);
console.log(output);
```

### Request Object

```typescript
interface Request {
  language: string // go, javascript, python, etc.
  target: string // native, axios, requests, etc.

  // HTTP request details
  http: {
    method: string // 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    url: string // ex: 'https://gofakeit.com'

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

### POST Request Example

```javascript
const request = {
  language: 'javascript',
  target: 'fetch',
  http: {
    method: 'POST',
    url: 'https://gofakeit.com',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      key1: 'value1'
    }
  }
};

const output = Generate(request);
console.log(output);
```

Output:

```javascript
fetch("https://gofakeit.com", {
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

