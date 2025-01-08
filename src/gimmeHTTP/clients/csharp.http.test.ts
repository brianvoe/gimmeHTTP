import CSharpHttp from './csharp.http'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from '@jest/globals'

describe('CSharpHttp.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = CSharpHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace HttpClientExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      using (HttpClient client = new HttpClient())
      {
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.GET, "https://example.com");

        HttpResponseMessage response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        string responseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine(responseBody);
      }
    }
  }
}
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
    const result = CSharpHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace HttpClientExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      using (HttpClient client = new HttpClient())
      {
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.POST, "https://example.com");

        request.Headers.Add("Content-Type", "application/json");
        request.Headers.Add("Authorization", "Bearer token");

        HttpResponseMessage response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        string responseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine(responseBody);
      }
    }
  }
}
    `.trim()
    )
  })

  test('should build a GET request with cookies', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      cookies: {
        session: 'abc123',
        user: 'testuser'
      }
    }
    const config: Config = {}
    const result = CSharpHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace HttpClientExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      using (HttpClient client = new HttpClient())
      {
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.GET, "https://example.com");

        request.Headers.Add("Cookie", "session=abc123; user=testuser");

        HttpResponseMessage response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        string responseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine(responseBody);
      }
    }
  }
}
    `.trim()
    )
  })

  test('should build a POST request with body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        key1: 'value1'
      }
    }
    const config: Config = {}
    const result = CSharpHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace HttpClientExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      using (HttpClient client = new HttpClient())
      {
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.POST, "https://example.com");

        request.Content = new StringContent({
          "key1": "value1"
        }, System.Text.Encoding.UTF8, "application/json");

        HttpResponseMessage response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        string responseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine(responseBody);
      }
    }
  }
}
      `.trim()
    )
  })

  test('should build a POST with advanced request json body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        key1: 'value1',
        key2: 123,
        key3: true,
        key4: ['value1', 'value2'],
        key5: { nestedKey: 'nestedValue' }
      }
    }
    const config: Config = {}
    const result = CSharpHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace HttpClientExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      using (HttpClient client = new HttpClient())
      {
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.POST, "https://example.com");

        request.Content = new StringContent({
          "key1": "value1",
          "key2": 123,
          "key3": true,
          "key4": [
            "value1",
            "value2"
          ],
          "key5": {
            "nestedKey": "nestedValue"
          }
        }, System.Text.Encoding.UTF8, "application/json");

        HttpResponseMessage response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        string responseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine(responseBody);
      }
    }
  }
}
      `.trim()
    )
  })
})
