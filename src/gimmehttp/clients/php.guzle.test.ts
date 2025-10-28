import PhpGuzzle from './php.guzzle'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

describe('PhpGuzzle.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = PhpGuzzle.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

require 'vendor/autoload.php';

use GuzzleHttp\\Client;

$client = new Client();
$response = $client->request(
  "GET",
  "https://example.com",
);

echo $response->getBody();
    `.trim()
    )
  })

  test('should build a POST request with headers', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      },
      body: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = PhpGuzzle.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

require 'vendor/autoload.php';

use GuzzleHttp\\Client;

$client = new Client();
$response = $client->request(
  "POST",
  "https://example.com",
  [
    "headers" => [
      "Content-Type" => "application/json",
      "Authorization" => "Bearer token",
    ],
    "json" => [
      "key1" => "value1",
    ],
  ],
);

echo $response->getBody();
    `.trim()
    )
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      cookies: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = PhpGuzzle.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

require 'vendor/autoload.php';

use GuzzleHttp\\Client;

$client = new Client();
$response = $client->request(
  "POST",
  "https://example.com",
  [
    "cookies" => [
      "key1" => "value1",
    ],
  ],
);

echo $response->getBody();
    `.trim()
    )
  })

  test('should build a POST request with advanced JSON body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        key1: 'value1',
        key2: {
          subKey1: 'subValue1',
          subKey2: [1, 2, 3],
          subKey3: {
            subSubKey1: 'subSubValue1'
          }
        },
        key3: [4, 5, 6]
      }
    }
    const config: Config = {}
    const result = PhpGuzzle.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

require 'vendor/autoload.php';

use GuzzleHttp\\Client;

$client = new Client();
$response = $client->request(
  "POST",
  "https://example.com",
  [
    "headers" => [
      "Content-Type" => "application/json",
    ],
    "json" => [
      "key1" => "value1",
      "key2" => [
        "subKey1" => "subValue1",
        "subKey2" => [
          1,
          2,
          3,
        ],
        "subKey3" => [
          "subSubKey1" => "subSubValue1",
        ],
      ],
      "key3" => [
        4,
        5,
        6,
      ],
    ],
  ],
);

echo $response->getBody();
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
        username: 'testuser',
        action: 'login'
      }
    }
    const config = {}
    const result = PhpGuzzle.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

require 'vendor/autoload.php';

use GuzzleHttp\\Client;

$client = new Client();
$response = $client->request(
  "POST",
  "https://example.com",
  [
    "headers" => [
      "Content-Type" => "application/x-www-form-urlencoded",
    ],
    "form_params" => [
      "username" => "testuser",
      "action" => "login",
    ],
  ],
);

echo $response->getBody();
      `.trim()
    )
  })

  test('should build a POST request with text/plain body', () => {
    const config = {}
    const http: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Plain text data for request'
    }

    const result = PhpGuzzle.generate(config, http)
    expect(result).toBe(
      `
<?php

require 'vendor/autoload.php';

use GuzzleHttp\\Client;

$client = new Client();
$response = $client->request(
  "POST",
  "https://example.com",
  [
    "headers" => [
      "Content-Type" => "text/plain",
    ],
    "json" => "Plain text data for request",
  ],
);

echo $response->getBody();
      `.trim()
    )
  })

  test('should build a POST request with error handling', () => {
    const config = { handleErrors: true }
    const http: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: 'test'
      }
    }

    const result = PhpGuzzle.generate(config, http)
    expect(result).toBe(
      `
<?php

require 'vendor/autoload.php';

use GuzzleHttp\\Client;
use GuzzleHttp\\Exception\\RequestException;

try {
  $client = new Client();
  $response = $client->request(
    "POST",
    "https://example.com",
    [
      "headers" => [
        "Content-Type" => "application/json",
      ],
      "json" => [
        "name" => "test",
      ],
    ],
  );

  echo $response->getBody();
} catch (RequestException $e) {
  echo "Error: " . $e->getMessage();
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
    const result = PhpGuzzle.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

require 'vendor/autoload.php';

use GuzzleHttp\\Client;

$client = new Client();
$response = $client->request(
  "GET",
  "https://example.com",
  [
    "query" => [
      "address.zip" => "66031",
      "address.country" => "Wallis",
    ],
  ],
);

echo $response->getBody();
    `.trim()
    )
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['php', 'guzzle'],
        category: 'backend'
      }
    }
    const config: Config = {}
    const result = PhpGuzzle.generate(config, httpRequest)
    expect(result).toContain('"tags" => "php",')
    expect(result).toContain('"tags" => "guzzle",')
    expect(result).toContain('"category" => "backend",')
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
    const result = PhpGuzzle.generate(config, httpRequest)
    expect(result).toContain('"version" => "1.0",')
    expect(result).toContain('"name" => "John"')
  })
})
