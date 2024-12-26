import PhpGuzzle from './php.guzzle'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from '@jest/globals'

describe('PhpGuzzle.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://gofakeit.com/api'
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
  "https://gofakeit.com/api",
);

echo $response->getBody();
    `.trim()
    )
  })

  test('should build a POST request with headers', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://gofakeit.com/api',
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
  "https://gofakeit.com/api",
  [
    "headers" => [
      "Content-Type" => "application/json",
      "Authorization" => "Bearer token",
    ],
    "json" => {
      "key1": "value1"
    }
  ],
);

echo $response->getBody();
    `.trim()
    )
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://gofakeit.com/api',
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
  "https://gofakeit.com/api",
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
      url: 'https://gofakeit.com/api',
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
  "https://gofakeit.com/api",
  [
    "headers" => [
      "Content-Type" => "application/json",
    ],
    "json" => {
      "key1": "value1",
      "key2": {
        "subKey1": "subValue1",
        "subKey2": [1, 2, 3],
        "subKey3": {
          "subSubKey1": "subSubValue1"
        }
      },
      "key3": [4, 5, 6]
    }
  ],
);

echo $response->getBody();
      `.trim()
    )
  })
})
