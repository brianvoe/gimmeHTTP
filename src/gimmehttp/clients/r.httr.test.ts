import RHttr from './r.httr'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('RHttr.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = RHttr.generate(config, httpRequest)
    expect(result).toBe(`
library(httr)

url <- "https://example.com"

response <- GET(
  url
)
cat(content(response, "text"))
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
    const result = RHttr.generate(config, httpRequest)
    expect(result).toBe("library(httr)\n\nurl <- \"https://example.com\"\nheaders <- add_headers(\n  `Content-Type` = \"application/json\",\n  `Authorization` = \"Bearer token\"\n)\nbody <- list(\n  key1 = \"value1\"\n)\n\nresponse <- POST(\n  url,\n  headers,\n  body = body,\n  encode = \"json\"\n)\ncat(content(response, \"text\"))")
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
    const result = RHttr.generate(config, httpRequest)
    expect(result).toBe("library(httr)\n\nurl <- \"https://example.com\"\ncookies <- set_cookies(\n  `key1` = \"value1\"\n)\n\nresponse <- POST(\n  url,\n  cookies\n)\ncat(content(response, \"text\"))")
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
    const result = RHttr.generate(config, httpRequest)
    expect(result).toBe(`
library(httr)

url <- "https://example.com"
body <- list(
  key1 = "value1"
)

response <- POST(
  url,
  body = body,
  encode = "json"
)
cat(content(response, "text"))
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
    const result = RHttr.generate(config, httpRequest)
    expect(result).toBe(`
library(httr)

url <- "https://example.com"
body <- list(
  key1 = "value1",
  key2 = list(
    key3 = "value3"
  ),
  key4 = c(
    "value4",
    "value5"
  ),
  empty = NULL
)

response <- POST(
  url,
  body = body,
  encode = "json"
)
cat(content(response, "text"))
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
    const result = RHttr.generate(config, httpRequest)
    expect(result).toBe("library(httr)\n\nurl <- \"https://example.com\"\nheaders <- add_headers(\n  `Content-Type` = \"application/x-www-form-urlencoded\"\n)\nbody <- list(\n  `username` = \"user123\",\n  `email` = \"user@example.com\"\n)\n\nresponse <- POST(\n  url,\n  headers,\n  body = body,\n  encode = \"form\"\n)\ncat(content(response, \"text\"))")
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
    const result = RHttr.generate(config, httpRequest)
    expect(result).toBe("library(httr)\n\nurl <- \"https://example.com\"\nheaders <- add_headers(\n  `Content-Type` = \"text/plain\"\n)\nbody <- \"Simple plain text message\"\n\nresponse <- POST(\n  url,\n  headers,\n  body = body,\n  encode = \"raw\"\n)\ncat(content(response, \"text\"))")
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
    const result = RHttr.generate(config, httpRequest)
    expect(result).toBe("library(httr)\n\ntryCatch({\n  url <- \"https://example.com\"\n  headers <- add_headers(\n    `Content-Type` = \"application/json\"\n  )\n  body <- list(\n    name = \"test\"\n  )\n\n  response <- POST(\n    url,\n    headers,\n    body = body,\n    encode = \"json\"\n  )\n  stop_for_status(response)\n  cat(content(response, \"text\"))\n}, error = function(e) {\n  cat(\"Error:\", conditionMessage(e), \"\\n\")\n})")
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
    const result = RHttr.generate(config, httpRequest)
    expect(result).toBe("library(httr)\n\nurl <- \"https://example.com\"\nquery <- list(\n  `address.zip` = \"66031\",\n  `address.country` = \"Wallis\"\n)\n\nresponse <- GET(\n  url,\n  query = query\n)\ncat(content(response, \"text\"))")
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
    const result = RHttr.generate(config, httpRequest)
    expect(result).toBe("library(httr)\n\nurl <- \"https://example.com\"\nquery <- list(\n  `tags` = c(\"alpha\", \"beta\"),\n  `category` = \"backend\"\n)\n\nresponse <- GET(\n  url,\n  query = query\n)\ncat(content(response, \"text\"))")
  })

})
