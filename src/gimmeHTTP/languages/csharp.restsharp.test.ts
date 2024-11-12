import CSharpRestSharp from './csharp.restsharp'
import { Config, Http } from '../index'
import { describe, test, expect } from '@jest/globals'

describe('CSharpRestSharp.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://gofakeit.com/api'
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
      var client = new RestClient("https://gofakeit.com/api");
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
      url: 'https://gofakeit.com/api',
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
      var client = new RestClient("https://gofakeit.com/api");
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

  test('should build a POST request with body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://gofakeit.com/api',
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
      var client = new RestClient("https://gofakeit.com/api");
      var request = new RestRequest(Method.POST);
      request.AddJsonBody({"key1":"value1"});
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
      url: 'https://gofakeit.com/api',
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
      var client = new RestClient("https://gofakeit.com/api");
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
})
