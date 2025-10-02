import CSharpRestSharp from './csharp.restsharp'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

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

namespace RestSharpExample
{
  class Program
  {
    static void Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest(Method.GET);

      IRestResponse response = client.Execute(request);
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

namespace RestSharpExample
{
  class Program
  {
    static void Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest(Method.POST);

      request.AddHeader("Content-Type", "application/json");
      request.AddHeader("Authorization", "Bearer token");

      IRestResponse response = client.Execute(request);
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

namespace RestSharpExample
{
  class Program
  {
    static void Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest(Method.GET);

      request.AddHeader("Cookie", "session=abc123; user=testuser");

      IRestResponse response = client.Execute(request);
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

namespace RestSharpExample
{
  class Program
  {
    static void Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest(Method.POST);

      request.AddJsonBody({
        "key1": "value1"
      });

      IRestResponse response = client.Execute(request);
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
        key3: ['value1', 'value2'],
        key4: [{ key: 'value1' }, { key: 'value2' }]
      }
    }
    const config: Config = {}
    const result = CSharpRestSharp.generate(config, httpRequest)
    expect(result).toBe(
      `
using RestSharp;

namespace RestSharpExample
{
  class Program
  {
    static void Main(string[] args)
    {
      var client = new RestClient("https://example.com");
      var request = new RestRequest(Method.POST);

      request.AddJsonBody({
        "key1": "value1",
        "key2": {
          "nestedKey": "nestedValue"
        },
        "key3": [
          "value1",
          "value2"
        ],
        "key4": [{
            "key": "value1"
          },{
            "key": "value2"
          }
        ]
      });

      IRestResponse response = client.Execute(request);
      Console.WriteLine(response.Content);
    }
  }
}
    `.trim()
    )
  })
})
