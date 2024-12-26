import PhpCurl from './php.curl'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from '@jest/globals'

describe('PhpCurl.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://gofakeit.com/api'
    }
    const config: Config = {}
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://gofakeit.com/api");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

$response = curl_exec($ch);
curl_close($ch);

echo $response;
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
      }
    }
    const config: Config = {}
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://gofakeit.com/api");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

$headers = [];
$headers[] = "Content-Type: application/json";
$headers[] = "Authorization: Bearer token";
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
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
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://gofakeit.com/api");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

$cookies = [];
$cookies[] = "key1=value1";
curl_setopt($ch, CURLOPT_COOKIE, implode("; ", $cookies));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
    `.trim()
    )
  })

  test('should build a POST request with error handling', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://gofakeit.com/api',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        key1: 'value1'
      }
    }
    const config: Config = { handleErrors: true }
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://gofakeit.com/api");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

$headers = [];
$headers[] = "Content-Type: application/json";
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

curl_setopt($ch, CURLOPT_POSTFIELDS,
<<<'JSON'
{
  "key1": "value1"
}
JSON
);

$response = curl_exec($ch);
if (curl_errno($ch)) {
  echo "Error: " . curl_error($ch);
}
curl_close($ch);

echo $response;
    `.trim()
    )
  })
})
