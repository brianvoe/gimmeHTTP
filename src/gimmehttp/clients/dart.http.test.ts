import DartHttp from './dart.http'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

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
  var url = Uri.parse("https://example.com/api");

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
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() async {
  var url = Uri.parse("https://example.com");

  var headers = {
    "Content-Type": "application/json",
  };

  var body = jsonEncode({
    "name": "John",
    "active": true
  });

  var response = await http.post(url, headers: headers, body: body);

  print(response.body);
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
        Authorization: 'Bearer token123'
      },
      body: {
        test: 'data'
      }
    }
    const config: Config = {}
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() async {
  var url = Uri.parse("https://example.com");

  var headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer token123",
  };

  var body = jsonEncode({
    "test": "data"
  });

  var response = await http.post(url, headers: headers, body: body);

  print(response.body);
}
    `.trim()
    )
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
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;

void main() async {
  var url = Uri.parse("https://example.com");

  var headers = {
    "Content-Type": "text/plain",
  };

  var body = "Plain text message";

  var response = await http.post(url, headers: headers, body: body);

  print(response.body);
}
    `.trim()
    )
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
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() async {
  var url = Uri.parse("https://example.com/resource/1");

  var headers = {
    "Content-Type": "application/json",
  };

  var body = jsonEncode({
    "status": "updated"
  });

  var response = await http.put(url, headers: headers, body: body);

  print(response.body);
}
    `.trim()
    )
  })

  test('should build a DELETE request', () => {
    const httpRequest: Http = {
      method: 'DELETE',
      url: 'https://example.com/resource/1'
    }
    const config: Config = {}
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;

void main() async {
  var url = Uri.parse("https://example.com/resource/1");

  var response = await http.delete(url);

  print(response.body);
}
    `.trim()
    )
  })

  test('should build a request with error handling', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        test: 'data'
      }
    }
    const config: Config = {
      handleErrors: true
    }
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() async {
  try {
    var url = Uri.parse("https://example.com");

    var headers = {
      "Content-Type": "application/json",
    };

    var body = jsonEncode({
      "test": "data"
    });

    var response = await http.post(url, headers: headers, body: body);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw http.ClientException("HTTP \${response.statusCode}", url);
    }

    print(response.body);
  } catch (e) {
    print("Error: $e");
  }
}
    `.trim()
    )
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
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;

void main() async {
  var url = Uri.parse("https://example.com");

  var headers = {
    "Accept": "application/json, text/plain",
  };

  var response = await http.get(url, headers: headers);

  print(response.body);
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
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;

void main() async {
  var url = Uri.parse("https://example.com");
  url = url.replace(queryParameters: {
    ...url.queryParametersAll,
    "address.zip": "66031",
    "address.country": "Wallis",
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
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;

void main() async {
  var url = Uri.parse("https://example.com");
  url = url.replace(queryParameters: {
    ...url.queryParametersAll,
    "tags": ["dart", "flutter"],
    "category": "mobile",
  });

  var response = await http.get(url);

  print(response.body);
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
    const result = DartHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() async {
  var url = Uri.parse("https://example.com");
  url = url.replace(queryParameters: {
    ...url.queryParametersAll,
    "version": "1.0",
  });

  var headers = {
    "Content-Type": "application/json",
  };

  var body = jsonEncode({
    "name": "John"
  });

  var response = await http.post(url, headers: headers, body: body);

  print(response.body);
}
    `.trim()
    )
  })
})
