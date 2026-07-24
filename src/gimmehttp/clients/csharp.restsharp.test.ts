import CSharpRestSharp from './csharp.restsharp'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('CSharpRestSharp.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest("", Method.Get);

      RestResponse response = await client.ExecuteAsync(request);
      Console.WriteLine(response.Content);
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
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest("", Method.Post);

      request.AddHeader("Content-Type", "application/json");
      request.AddHeader("Authorization", "Bearer token");

      RestResponse response = await client.ExecuteAsync(request);
      Console.WriteLine(response.Content);
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
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest("", Method.Get);

      request.AddHeader("Cookie", "session=abc123; user=testuser");

      RestResponse response = await client.ExecuteAsync(request);
      Console.WriteLine(response.Content);
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
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest("", Method.Post);

      request.AddStringBody("{\\"key1\\":\\"value1\\"}", ContentType.Json);

      RestResponse response = await client.ExecuteAsync(request);
      Console.WriteLine(response.Content);
    }
  }
}
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
        key3: ['value1', 'value2']
      }
    }
    const config: Config = {}
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest("", Method.Post);

      request.AddStringBody("{\\"key1\\":\\"value1\\",\\"key2\\":{\\"nestedKey\\":\\"nestedValue\\"},\\"key3\\":[\\"value1\\",\\"value2\\"]}", ContentType.Json);

      RestResponse response = await client.ExecuteAsync(request);
      Console.WriteLine(response.Content);
    }
  }
}
    `.trim()
    )
  })

  test('should build a POST request with text/plain body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Plain text content'
    }
    const config: Config = {}
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest("", Method.Post);

      request.AddStringBody("Plain text content", "text/plain");

      RestResponse response = await client.ExecuteAsync(request);
      Console.WriteLine(response.Content);
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
      body: '<data><node>content</node></data>'
    }
    const config: Config = {}
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest("", Method.Post);

      request.AddStringBody("<data><node>content</node></data>", "application/xml");

      RestResponse response = await client.ExecuteAsync(request);
      Console.WriteLine(response.Content);
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
        name: 'Jane'
      }
    }
    const config: Config = {}
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest("", Method.Post);

      request.AddParameter("name", "Jane");

      RestResponse response = await client.ExecuteAsync(request);
      Console.WriteLine(response.Content);
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
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest("", Method.Get);

      request.AddParameter("address.zip", "66031", ParameterType.QueryString);
      request.AddParameter("address.country", "Wallis", ParameterType.QueryString);

      RestResponse response = await client.ExecuteAsync(request);
      Console.WriteLine(response.Content);
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
        tags: ['csharp', 'restsharp'],
        category: 'backend'
      }
    }
    const config: Config = {}
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest("", Method.Get);

      request.AddParameter("tags", "csharp", ParameterType.QueryString);
      request.AddParameter("tags", "restsharp", ParameterType.QueryString);
      request.AddParameter("category", "backend", ParameterType.QueryString);

      RestResponse response = await client.ExecuteAsync(request);
      Console.WriteLine(response.Content);
    }
  }
}
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
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest("", Method.Post);

      request.AddParameter("version", "1.0", ParameterType.QueryString);

      request.AddStringBody("{\\"name\\":\\"John\\"}", ContentType.Json);

      RestResponse response = await client.ExecuteAsync(request);
      Console.WriteLine(response.Content);
    }
  }
}
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
        test: 'data'
      }
    }
    const config: Config = {
      handleErrors: true
    }
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;
using System;
using System.Threading.Tasks;

namespace RestSharpExample
{
  class Program
  {
    static async Task Main(string[] args)
    {
      try
      {
        var client = new RestClient("https://example.com");
        var request = new RestRequest("", Method.Post);

        request.AddStringBody("{\\"test\\":\\"data\\"}", ContentType.Json);

        RestResponse response = await client.ExecuteAsync(request);
        if (!response.IsSuccessful)
        {
          throw new Exception(response.ErrorMessage ?? response.StatusDescription);
        }
        Console.WriteLine(response.Content);
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error: {ex.Message}");
      }
    }
  }
}
    `.trim()
    )
  })
})
