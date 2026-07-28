import DartDio from './dart.dio'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('DartDio.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = DartDio.generate(config, httpRequest)
    expect(result).toBe(`
import 'package:dio/dio.dart';

void main() async {
  final dio = Dio();

  final response = await dio.get("https://example.com");
  print(response.data);
}
`.trim())
  })

  test('should build a POST request with headers', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer token"
      },
      "body": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = DartDio.generate(config, httpRequest)
    expect(result).toBe(`
import 'package:dio/dio.dart';

void main() async {
  final dio = Dio();

  final headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  };

  final data = {
    "key1": "value1"
  };


  final response = await dio.post("https://example.com", options: Options(headers: headers), data: data);
  print(response.data);
}
`.trim())
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "cookies": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = DartDio.generate(config, httpRequest)
    expect(result).toBe(`
import 'package:dio/dio.dart';

void main() async {
  final dio = Dio();

  final headers = {
    "Cookie": "key1=value1",
  };

  final response = await dio.post("https://example.com", options: Options(headers: headers));
  print(response.data);
}
`.trim())
  })

  test('should build a POST request with body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "body": {
        "key1": "value1"
      }
    }
    const config: Config = {}
    const result = DartDio.generate(config, httpRequest)
    expect(result).toBe(`
import 'package:dio/dio.dart';

void main() async {
  final dio = Dio();

  final data = {
    "key1": "value1"
  };


  final response = await dio.post("https://example.com", data: data);
  print(response.data);
}
`.trim())
  })

  test('should build a POST request with advanced json body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "body": {
        "key1": "value1",
        "key2": {
          "key3": "value3"
        },
        "key4": [
          "value4",
          "value5"
        ],
        "empty": null
      }
    }
    const config: Config = {}
    const result = DartDio.generate(config, httpRequest)
    expect(result).toBe(`
import 'package:dio/dio.dart';

void main() async {
  final dio = Dio();

  final data = {
    "key1": "value1",
    "key2": {
      "key3": "value3"
    },
    "key4": [
      "value4",
      "value5"
    ],
    "empty": null
  };


  final response = await dio.post("https://example.com", data: data);
  print(response.data);
}
`.trim())
  })

  test('should build a POST request with form-urlencoded body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "body": {
        "username": "user123",
        "email": "user@example.com"
      }
    }
    const config: Config = {}
    const result = DartDio.generate(config, httpRequest)
    expect(result).toBe(`
import 'package:dio/dio.dart';

void main() async {
  final dio = Dio();

  final headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  final data = {
    "username": "user123",
    "email": "user@example.com"
  };


  final response = await dio.post("https://example.com", options: Options(headers: headers), data: data);
  print(response.data);
}
`.trim())
  })

  test('should build a POST request with text/plain body', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "text/plain"
      },
      "body": "Simple plain text message"
    }
    const config: Config = {}
    const result = DartDio.generate(config, httpRequest)
    expect(result).toBe(`
import 'package:dio/dio.dart';

void main() async {
  final dio = Dio();

  final headers = {
    "Content-Type": "text/plain",
  };

  final data = "Simple plain text message";

  final response = await dio.post("https://example.com", options: Options(headers: headers), data: data);
  print(response.data);
}
`.trim())
  })

  test('should build a POST request with error handling', () => {
    const httpRequest: Http = {
      "method": "POST",
      "url": "https://example.com",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "name": "test"
      }
    }
    const config: Config = {
      "handleErrors": true
    }
    const result = DartDio.generate(config, httpRequest)
    expect(result).toBe("import 'package:dio/dio.dart';\n\nvoid main() async {\n  try {\n    final dio = Dio();\n\n    final headers = {\n      \"Content-Type\": \"application/json\",\n    };\n\n    final data = {\n      \"name\": \"test\"\n    };\n\n\n    final response = await dio.post(\"https://example.com\", options: Options(headers: headers), data: data);\n    print(response.data);\n  } on DioException catch (e) {\n    print(\"Error: ${e.message}\");\n  }\n}")
  })

  test('should build a GET request with URL parameters', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com",
      "params": {
        "address.zip": "66031",
        "address.country": "Wallis"
      }
    }
    const config: Config = {}
    const result = DartDio.generate(config, httpRequest)
    expect(result).toBe(`
import 'package:dio/dio.dart';

void main() async {
  final dio = Dio();

  final queryParameters = {
    "address.zip": "66031",
    "address.country": "Wallis",
  };

  final response = await dio.get("https://example.com", queryParameters: queryParameters);
  print(response.data);
}
`.trim())
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com",
      "params": {
        "tags": [
          "alpha",
          "beta"
        ],
        "category": "backend"
      }
    }
    const config: Config = {}
    const result = DartDio.generate(config, httpRequest)
    expect(result).toBe(`
import 'package:dio/dio.dart';

void main() async {
  final dio = Dio();

  final queryParameters = {
    "tags": ["alpha", "beta"],
    "category": "backend",
  };

  final response = await dio.get("https://example.com", queryParameters: queryParameters);
  print(response.data);
}
`.trim())
  })

})
