import CLibCurl from './c.libcurl'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from '@jest/globals'

describe('CLibCurl.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://gofakeit.com/api'
    }
    const config: Config = {}
    const result = CLibCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
#include <stdio.h>
#include <curl/curl.h>

int main(void) {
  CURL *curl;
  CURLcode res;

  curl_global_init(CURL_GLOBAL_DEFAULT);
  curl = curl_easy_init();
  if(curl) {
    curl_easy_setopt(curl, CURLOPT_URL, "https://gofakeit.com/api");
    res = curl_easy_perform(curl);
    if(res != CURLE_OK)
      fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
    curl_easy_cleanup(curl);
  }
  curl_global_cleanup();
  return 0;
}
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
    const result = CLibCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
#include <stdio.h>
#include <curl/curl.h>

int main(void) {
  CURL *curl;
  CURLcode res;

  curl_global_init(CURL_GLOBAL_DEFAULT);
  curl = curl_easy_init();
  if(curl) {
    curl_easy_setopt(curl, CURLOPT_URL, "https://gofakeit.com/api");
    curl_easy_setopt(curl, CURLOPT_POST, 1L);
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    headers = curl_slist_append(headers, "Authorization: Bearer token");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    res = curl_easy_perform(curl);
    if(res != CURLE_OK)
      fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
  }
  curl_global_cleanup();
  return 0;
}
    `.trim()
    )
  })

  test('should build a POST request with body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://gofakeit.com/api',
      body: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = CLibCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
#include <stdio.h>
#include <curl/curl.h>

int main(void) {
  CURL *curl;
  CURLcode res;

  curl_global_init(CURL_GLOBAL_DEFAULT);
  curl = curl_easy_init();
  if(curl) {
    curl_easy_setopt(curl, CURLOPT_URL, "https://gofakeit.com/api");
    curl_easy_setopt(curl, CURLOPT_POST, 1L);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"({\"key1\":\"value1\"})");
    res = curl_easy_perform(curl);
    if(res != CURLE_OK)
      fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
    curl_easy_cleanup(curl);
  }
  curl_global_cleanup();
  return 0;
}
    `.trim()
    )
  })

  test('should build a GET request with cookies', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://gofakeit.com/api',
      cookies: {
        session: 'abc123',
        user: 'testuser'
      }
    }
    const config: Config = {}
    const result = CLibCurl.generate(config, httpRequest)
    expect(result).toBe(
      `
#include <stdio.h>
#include <curl/curl.h>

int main(void) {
  CURL *curl;
  CURLcode res;

  curl_global_init(CURL_GLOBAL_DEFAULT);
  curl = curl_easy_init();
  if(curl) {
    curl_easy_setopt(curl, CURLOPT_URL, "https://gofakeit.com/api");
    curl_easy_setopt(curl, CURLOPT_COOKIE, "session=abc123; user=testuser");
    res = curl_easy_perform(curl);
    if(res != CURLE_OK)
      fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
    curl_easy_cleanup(curl);
  }
  curl_global_cleanup();
  return 0;
}
    `.trim()
    )
  })
})
