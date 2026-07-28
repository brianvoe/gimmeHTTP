# GimmeHttp

## [gimmehttp.com](https://gimmehttp.com)

HTTP request code snippet generator

[![NPM Downloads](https://img.shields.io/npm/dt/gimmehttp.svg)](https://www.npmjs.com/package/gimmehttp)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/brianvoe/gimmehttp/vitest.yml?logo=vitest&label=unit%20tests)
[![gimmehttp](https://snyk.io/advisor/npm-package/gimmehttp/badge.svg)](https://snyk.io/advisor/npm-package/gimmehttp)

See the [changelog](./CHANGELOG.md) for version history.

GimmeHttp is a library for generating HTTP request code snippets in various languages based on a simple configuration.
Quickly output API requests.

Using Vue 3? See the [Vue (v3) Usage](#vue-v3-usage) section.

## Features

- Generate HTTP request code snippets in various languages
- Dead simple configuration(help me keep it that way)
- Import only the languages you need — everything else is tree-shaken out of your bundle
- Framework-agnostic UI component with language/client options bar, copy button, theming, and built-in syntax highlighting
- Add Custom Languages and Clients
- Engine-only entry (`gimmehttp/core`) when you just want generated text

## Supported Languages and Clients

| Language                                                                                                                                 | Clients                   | Language                                                                                                                                     | Clients              | Language                                                                                                                                | Clients          |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/c.svg" width="50" height="50">      | libcurl                   | <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/javascript.svg" width="50" height="50"> | fetch, axios, jQuery | <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/ruby.svg" width="50" height="50">  | nethttp, faraday |
| <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/csharp.svg" width="50" height="50"> | http, restsharp           | <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/node.svg" width="50" height="50">       | http, node-fetch     | <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/rust.svg" width="50" height="50">  | reqwest          |
| <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/dart.svg" width="50" height="50">   | http                      | <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/php.svg" width="50" height="50">        | curl, guzzle         | <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/swift.svg" width="50" height="50"> | nsurlsession     |
| <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/go.svg" width="50" height="50">     | http                      | <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/python.svg" width="50" height="50">     | requests, http       | <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/shell.svg" width="50" height="50"> | curl             |
| <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/java.svg" width="50" height="50">   | httpurlconnection, okhttp | <img src="https://raw.githubusercontent.com/brianvoe/gimmeHTTP/refs/heads/master/src/gimmehttp/logos/kotlin.svg" width="50" height="50">     | ktor                 |                                                                                                                                         |                  |

## Installation

To install GimmeHttp, simply use npm:

```sh
npm install gimmehttp
```

## Register Clients

No clients are registered by default. Import the clients you want from `gimmehttp/clients` and register them once at
startup — bundlers tree-shake the rest, so importing two clients only bundles those two.

```typescript
import { Register } from 'gimmehttp/core'
import { goHttp, shellCurl } from 'gimmehttp/clients'

Register([goHttp, shellCurl])
```

Or register everything:

```typescript
import { Register } from 'gimmehttp/core'
import { allClients } from 'gimmehttp/clients'

Register(allClients)
```

## Simple Example

Here is a quick example of generating a simple GET request in Go using the engine:

```javascript
import { Register, Generate } from 'gimmehttp/core'
import { goHttp } from 'gimmehttp/clients'

// Register the clients you want available
Register([goHttp])

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

The core functionality of GimmeHttp is its `Generate` function. This function takes in a request object and returns the
generated code snippet as a string. The request object should have the following structure:

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

The `Generate` function returns an `Outcome` object. If the object contains an `error` property, an error occurred
during code generation.

```typescript
import { Generate } from 'gimmehttp/core'

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
import { Register, Generate } from 'gimmehttp/core'
import type { Config, Http } from 'gimmehttp/core'

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
fetch('https://example.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ key1: 'value1' })
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.text()
  })
  .then((data) => console.log(data))
```

---

Feel free to contribute to the project, suggest improvements, or report issues on our GitHub page!

---

## JavaScript UI Component

The default `gimmehttp` import is a framework-agnostic UI component: styled code output with a flush options bar
(language modal, client dropdown, labeled Copy button, light/dark toggle), and built-in highlight.js syntax highlighting.
Point it at a container, give it a request, and it handles the rest.

```ts
import { GimmeHTTP } from 'gimmehttp'
import 'gimmehttp/css'
import { goHttp, jsFetch, shellCurl } from 'gimmehttp/clients'

const gh = new GimmeHTTP({
  // Required
  container: '#code', // selector or HTMLElement
  http: {
    method: 'POST',
    url: 'https://example.com/api/users',
    headers: { 'Content-Type': 'application/json' },
    body: { first_name: 'Billy' }
  },

  // Optional
  clients: [goHttp, jsFetch, shellCurl], // registers + limits the picker
  language: 'go', // initial language
  client: 'http', // initial client
  config: { indent: '  ' }, // engine config passthrough
  settings: {
    theme: 'dark', // 'dark' | 'light'
    copy: true, // show copy button
    picker: true // show language/client picker
  },
  events: {
    afterChange: (language, client, code) => {}
  }
})

// Methods
gh.setHttp({ method: 'GET', url: 'https://example.com' })
gh.setLanguage('python')
gh.setClient('requests')
gh.setTheme('light')
gh.getCode()
gh.destroy()
```

If you only need generated text (no UI), use `gimmehttp/core` and call `Generate` yourself.

### Styling

Theme the widget by overriding CSS variables on `.gimmehttp` (or a parent with higher specificity). Only set what you
want to change:

```css
.my-theme .gimmehttp {
  --gh-bg: #0b1220;
  --gh-fg: #d7e3f4;
  --gh-accent: #3dd6c6;
  --gh-surface: #122033;
  --gh-border: #243447;
  --gh-kw: #7aa2f7;
  --gh-str: #9ece6a;
}
```

Chrome: `--gh-bg`, `--gh-fg`, `--gh-muted`, `--gh-border`, `--gh-accent`, `--gh-surface`, `--gh-hover`,
`--gh-overlay`, `--gh-radius`, `--gh-shadow`.

Syntax: `--gh-kw`, `--gh-fn`, `--gh-const`, `--gh-str`, `--gh-var`, `--gh-cmt`, `--gh-tag`.

### CDN / script tag

The CDN build pre-registers every client and exposes the UI component as the global `GimmeHTTP`, with the engine
attached as statics (`GimmeHTTP.Generate`, `GimmeHTTP.Register`, ...).

```html
<link rel="stylesheet" href="https://unpkg.com/gimmehttp/dist/gimmehttp.css" />
<script src="https://unpkg.com/gimmehttp/dist/gimmehttp.js"></script>

<div id="code"></div>

<script>
  new GimmeHTTP({
    container: '#code',
    http: { method: 'GET', url: 'https://example.com' }
  })
</script>
```

---

## Vue (v3) Usage

The Vue component is a thin wrapper around the JavaScript UI component.

### Install styles

Add the package CSS once (e.g., in `main.ts`).

```ts
import 'gimmehttp/vue/css'
```

### Register clients at startup

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import GimmeHttpVue from 'gimmehttp/vue'

import { Register } from 'gimmehttp/core'
import { allClients } from 'gimmehttp/clients' // or import individual clients

Register(allClients)

const app = createApp(App)
app.use(GimmeHttpVue) // optional global registration
app.mount('#app')
```

### Local usage (component)

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { GimmeHttp } from 'gimmehttp/vue'
  import type { Http } from 'gimmehttp/core'

  const http = ref<Http>({
    method: 'GET',
    url: 'https://example.com'
  })
</script>

<template>
  <GimmeHttp :http="http" theme="dark" />
</template>
```

Props overview:

- `http` (required): request definition
- `language` (optional): language key; auto-selected if omitted
- `client` (optional): client key; auto-selected if omitted
- `theme` (optional): 'light' | 'dark' (default 'dark')
- `config` (optional): generator `Config`
- `copy` (optional): show the copy button (default true)
- `picker` (optional): show the language/client picker (default true)

---

## Contributing

GimmeHttp is an open-source project that welcomes contributions from the community. If you would like to contribute,
please follow these steps:

1. Fork the repository
2. npm install
3. npm run dev
4. open http://localhost:1111
5. Make your changes
6. Write tests
7. Git commit and push your changes
8. Submit a pull request
