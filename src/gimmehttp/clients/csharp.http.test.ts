import CSharpHttp from './csharp.http'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

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
using System.Web;

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
    const result = CSharpHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace HttpClientExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      using (HttpClient client = new HttpClient())
      {
        var uriBuilder = new UriBuilder("https://example.com");
        var query = HttpUtility.ParseQueryString(uriBuilder.Query);
        query.Add("address.zip", "66031");
        query.Add("address.country", "Wallis");
        uriBuilder.Query = query.ToString();
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.GET, uriBuilder.ToString());

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

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['javascript', 'typescript'],
        category: 'programming'
      }
    }
    const config: Config = {}
    const result = CSharpHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace HttpClientExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      using (HttpClient client = new HttpClient())
      {
        var uriBuilder = new UriBuilder("https://example.com");
        var query = HttpUtility.ParseQueryString(uriBuilder.Query);
        query.Add("tags", "javascript");
        query.Add("tags", "typescript");
        query.Add("category", "programming");
        uriBuilder.Query = query.ToString();
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.GET, uriBuilder.ToString());

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

  test('should build a GET request with URL parameters containing special characters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        search: 'hello world',
        filter: 'test&value'
      }
    }
    const config: Config = {}
    const result = CSharpHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace HttpClientExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      using (HttpClient client = new HttpClient())
      {
        var uriBuilder = new UriBuilder("https://example.com");
        var query = HttpUtility.ParseQueryString(uriBuilder.Query);
        query.Add("search", "hello world");
        query.Add("filter", "test&value");
        uriBuilder.Query = query.ToString();
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.GET, uriBuilder.ToString());

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
using System.Web;

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
using System.Web;

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
using System.Web;

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
using System.Web;

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
    const config = {}
    const result = CSharpHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace HttpClientExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      using (HttpClient client = new HttpClient())
      {
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.POST, "https://example.com");

        request.Headers.Add("Content-Type", "application/x-www-form-urlencoded");

        var formContent = new FormUrlEncodedContent(new Dictionary<string, string>
        {
          { "username", "testuser" },
          { "password", "testpass" },
        });
        request.Content = formContent;

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

  test('should build a POST request with XML body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: '<root><value>test</value></root>'
    }
    const config: Config = {}
    const result = CSharpHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace HttpClientExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      using (HttpClient client = new HttpClient())
      {
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.POST, "https://example.com");

        request.Headers.Add("Content-Type", "application/xml");

        request.Content = new StringContent("<root><value>test</value></root>", System.Text.Encoding.UTF8, "application/json");

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
