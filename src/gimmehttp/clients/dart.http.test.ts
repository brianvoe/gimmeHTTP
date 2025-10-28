import DartHttp from './dart.http'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

describe('DartHttp.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/api'
    }
    const config: Config = {}
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;

void main() async {
  var url = Uri.parse('https://example.com/api');

  var response = await http.get(url);

  print(response.body);
}
      `.trim()
    )
  })

  test('should build a POST request with JSON body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: 'John',
        active: true
      }
    }
    const config: Config = {}
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toContain("import 'dart:convert';")
    expect(result).toContain('var body = jsonEncode(')
    expect(result).toContain('"name": "John"')
    expect(result).toContain('"active": true')
    expect(result).toContain('await http.post(url, headers: headers, body: body);')
  })

  test('should build a POST request with headers', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123'
      },
      body: {
        test: 'data'
      }
    }
    const config: Config = {}
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toContain("'Content-Type': 'application/json',")
    expect(result).toContain("'Authorization': 'Bearer token123',")
  })

  test('should build a POST request with text body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Plain text message'
    }
    const config: Config = {}
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toContain("var body = 'Plain text message';")
    expect(result).toContain('await http.post(url, headers: headers, body: body);')
  })

  test('should build a PUT request', () => {
    const httpRequest: Http = {
      method: 'PUT',
      url: 'https://example.com/resource/1',
      body: {
        status: 'updated'
      }
    }
    const config: Config = {}
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toContain('await http.put(url, body: body);')
  })

  test('should build a DELETE request', () => {
    const httpRequest: Http = {
      method: 'DELETE',
      url: 'https://example.com/resource/1'
    }
    const config: Config = {}
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toContain('await http.delete(url);')
  })

  test('should build a request with error handling', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        test: 'data'
      }
    }
    const config: Config = { handleErrors: true }
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toContain('try {')
    expect(result).toContain('} catch (e) {')
    expect(result).toContain('print("Error: $e");')
  })

  test('should handle array header values', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      headers: {
        Accept: ['application/json', 'text/plain']
      }
    }
    const config: Config = {}
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toContain("'Accept': 'application/json, text/plain',")
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
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;

void main() async {
  var url = Uri.parse('https://example.com').replace(queryParameters: {
    'address.zip': '66031',
    'address.country': 'Wallis',
  });

  var response = await http.get(url);

  print(response.body);
}
      `.trim()
    )
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['dart', 'flutter'],
        category: 'mobile'
      }
    }
    const config: Config = {}
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toContain("'tags': ['dart', 'flutter'],")
    expect(result).toContain("'category': 'mobile',")
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
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toContain("'version': '1.0',")
    expect(result).toContain('await http.post(url, headers: headers, body: body);')
  })
})
