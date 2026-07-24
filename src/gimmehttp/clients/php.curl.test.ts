import PhpCurl from './php.curl'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('PhpCurl.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://example.com");
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
      url: 'https://example.com',
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

curl_setopt($ch, CURLOPT_URL, "https://example.com");
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
      url: 'https://example.com',
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

curl_setopt($ch, CURLOPT_URL, "https://example.com");
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
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        key1: 'value1'
      }
    }
    const config: Config = {
      handleErrors: true
    }
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://example.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

$headers = [];
$headers[] = "Content-Type: application/json";
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$body = "{\\"key1\\":\\"value1\\"}";
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

$response = curl_exec($ch);
if (curl_errno($ch)) {
  echo "Error: " . curl_error($ch);
}
curl_close($ch);

echo $response;
    `.trim()
    )
  })

  test('should build a POST request with advanced json body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        key1: 'value1',
        key2: {
          nestedKey: 'nestedValue'
        },
        key3: ['value1', 'value2'],
        empty: null
      }
    }
    const config: Config = {}
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://example.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

$headers = [];
$headers[] = "Content-Type: application/json";
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$body = "{\\"key1\\":\\"value1\\",\\"key2\\":{\\"nestedKey\\":\\"nestedValue\\"},\\"key3\\":[\\"value1\\",\\"value2\\"],\\"empty\\":null}";
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
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
        password: 'testpass'
      }
    }
    const config: Config = {}
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://example.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

$headers = [];
$headers[] = "Content-Type: application/x-www-form-urlencoded";
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$postData = [
  "username" => "testuser",
  "password" => "testpass",
];
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
    `.trim()
    )
  })

  test('should build a POST request with XML body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: '<request><action>submit</action></request>'
    }
    const config: Config = {}
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://example.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

$headers = [];
$headers[] = "Content-Type: application/xml";
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

curl_setopt($ch, CURLOPT_POSTFIELDS, "<request><action>submit</action></request>");

$response = curl_exec($ch);
curl_close($ch);

echo $response;
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
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

$url = "https://example.com";
$params = [];
$params[] = "address.zip=" . urlencode("66031");
$params[] = "address.country=" . urlencode("Wallis");
$url .= (strpos($url, "?") !== false ? "&" : "?") . implode("&", $params);

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

$response = curl_exec($ch);
curl_close($ch);

echo $response;
    `.trim()
    )
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['php', 'curl'],
        category: 'backend'
      }
    }
    const config: Config = {}
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

$url = "https://example.com";
$params = [];
$params[] = "tags=" . urlencode("php");
$params[] = "tags=" . urlencode("curl");
$params[] = "category=" . urlencode("backend");
$url .= (strpos($url, "?") !== false ? "&" : "?") . implode("&", $params);

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

$response = curl_exec($ch);
curl_close($ch);

echo $response;
    `.trim()
    )
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
    const result = PhpCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
<?php

$ch = curl_init();

$url = "https://example.com";
$params = [];
$params[] = "version=" . urlencode("1.0");
$url .= (strpos($url, "?") !== false ? "&" : "?") . implode("&", $params);

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

$headers = [];
$headers[] = "Content-Type: application/json";
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$body = "{\\"name\\":\\"John\\"}";
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
    `.trim()
    )
  })
})
