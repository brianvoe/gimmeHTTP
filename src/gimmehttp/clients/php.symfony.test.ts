import PhpSymfony from './php.symfony'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('PhpSymfony.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = PhpSymfony.generate(config, httpRequest)
    expect(result).toBe("<?php\n\nrequire 'vendor/autoload.php';\n\nuse Symfony\\Component\\HttpClient\\HttpClient;\n\n$client = HttpClient::create();\n$response = $client->request(\n  \"GET\",\n  \"https://example.com\",\n);\n\necho $response->getContent();")
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
    const result = PhpSymfony.generate(config, httpRequest)
    expect(result).toBe("<?php\n\nrequire 'vendor/autoload.php';\n\nuse Symfony\\Component\\HttpClient\\HttpClient;\n\n$client = HttpClient::create();\n$response = $client->request(\n  \"POST\",\n  \"https://example.com\",\n  [\n    'headers' => [\n      'Content-Type' => 'application/json',\n      'Authorization' => 'Bearer token',\n    ],\n    'json' => [\n      \"key1\" => \"value1\",\n    ],\n  ],\n);\n\necho $response->getContent();")
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
    const result = PhpSymfony.generate(config, httpRequest)
    expect(result).toBe("<?php\n\nrequire 'vendor/autoload.php';\n\nuse Symfony\\Component\\HttpClient\\HttpClient;\n\n$client = HttpClient::create();\n$response = $client->request(\n  \"POST\",\n  \"https://example.com\",\n  [\n    'headers' => [\n      'Cookie' => 'key1=value1',\n    ],\n  ],\n);\n\necho $response->getContent();")
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
    const result = PhpSymfony.generate(config, httpRequest)
    expect(result).toBe("<?php\n\nrequire 'vendor/autoload.php';\n\nuse Symfony\\Component\\HttpClient\\HttpClient;\n\n$client = HttpClient::create();\n$response = $client->request(\n  \"POST\",\n  \"https://example.com\",\n  [\n    'json' => [\n      \"key1\" => \"value1\",\n    ],\n  ],\n);\n\necho $response->getContent();")
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
    const result = PhpSymfony.generate(config, httpRequest)
    expect(result).toBe("<?php\n\nrequire 'vendor/autoload.php';\n\nuse Symfony\\Component\\HttpClient\\HttpClient;\n\n$client = HttpClient::create();\n$response = $client->request(\n  \"POST\",\n  \"https://example.com\",\n  [\n    'json' => [\n      \"key1\" => \"value1\",\n      \"key2\" => [\n        \"key3\" => \"value3\",\n      ],\n      \"key4\" => [\n        \"value4\",\n        \"value5\",\n      ],\n      \"empty\" => null,\n    ],\n  ],\n);\n\necho $response->getContent();")
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
    const result = PhpSymfony.generate(config, httpRequest)
    expect(result).toBe("<?php\n\nrequire 'vendor/autoload.php';\n\nuse Symfony\\Component\\HttpClient\\HttpClient;\n\n$client = HttpClient::create();\n$response = $client->request(\n  \"POST\",\n  \"https://example.com\",\n  [\n    'headers' => [\n      'Content-Type' => 'application/x-www-form-urlencoded',\n    ],\n    'body' => http_build_query([\n        \"username\" => \"user123\",\n        \"email\" => \"user@example.com\",\n      ]),\n  ],\n);\n\necho $response->getContent();")
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
    const result = PhpSymfony.generate(config, httpRequest)
    expect(result).toBe("<?php\n\nrequire 'vendor/autoload.php';\n\nuse Symfony\\Component\\HttpClient\\HttpClient;\n\n$client = HttpClient::create();\n$response = $client->request(\n  \"POST\",\n  \"https://example.com\",\n  [\n    'headers' => [\n      'Content-Type' => 'text/plain',\n    ],\n    'body' => 'Simple plain text message',\n  ],\n);\n\necho $response->getContent();")
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
    const result = PhpSymfony.generate(config, httpRequest)
    expect(result).toBe("<?php\n\nrequire 'vendor/autoload.php';\n\nuse Symfony\\Component\\HttpClient\\HttpClient;\nuse Symfony\\Contracts\\HttpClient\\Exception\\TransportExceptionInterface;\n\ntry {\n  $client = HttpClient::create();\n  $response = $client->request(\n    \"POST\",\n    \"https://example.com\",\n    [\n      'headers' => [\n        'Content-Type' => 'application/json',\n      ],\n      'json' => [\n        \"name\" => \"test\",\n      ],\n    ],\n  );\n\n  echo $response->getContent();\n} catch (TransportExceptionInterface $e) {\n  echo \"Error: \" . $e->getMessage();\n}")
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
    const result = PhpSymfony.generate(config, httpRequest)
    expect(result).toBe("<?php\n\nrequire 'vendor/autoload.php';\n\nuse Symfony\\Component\\HttpClient\\HttpClient;\n\n$client = HttpClient::create();\n$response = $client->request(\n  \"GET\",\n  \"https://example.com\",\n  [\n    'query' => [\n      \"address.zip\" => \"66031\",\n      \"address.country\" => \"Wallis\",\n    ],\n  ],\n);\n\necho $response->getContent();")
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
    const result = PhpSymfony.generate(config, httpRequest)
    expect(result).toBe("<?php\n\nrequire 'vendor/autoload.php';\n\nuse Symfony\\Component\\HttpClient\\HttpClient;\n\n$client = HttpClient::create();\n$response = $client->request(\n  \"GET\",\n  \"https://example.com\",\n  [\n    'query' => [\n      \"tags\" => [\n        \"alpha\",\n        \"beta\",\n      ],\n      \"category\" => \"backend\",\n    ],\n  ],\n);\n\necho $response->getContent();")
  })

})
