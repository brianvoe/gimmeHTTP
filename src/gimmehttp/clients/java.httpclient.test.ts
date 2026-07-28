import JavaHttpClient from './java.httpclient'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('JavaHttpClient.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = JavaHttpClient.generate(config, httpRequest)
    expect(result).toBe(`
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();

    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
      .uri(URI.create("https://example.com"))
      .method("GET", HttpRequest.BodyPublishers.noBody());
    HttpRequest request = requestBuilder.build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println(response.body());
  }
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
    const result = JavaHttpClient.generate(config, httpRequest)
    expect(result).toBe("import java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\n\npublic class HttpExample {\n  public static void main(String[] args) throws Exception {\n    HttpClient client = HttpClient.newHttpClient();\n\n    String json = \"{\\\"key1\\\":\\\"value1\\\"}\";\n\n    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()\n      .uri(URI.create(\"https://example.com\"))\n      .method(\"POST\", HttpRequest.BodyPublishers.ofString(json));\n    requestBuilder.header(\"Content-Type\", \"application/json\");\n    requestBuilder.header(\"Authorization\", \"Bearer token\");\n    HttpRequest request = requestBuilder.build();\n    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\n    System.out.println(response.body());\n  }\n}")
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
    const result = JavaHttpClient.generate(config, httpRequest)
    expect(result).toBe(`
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();

    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
      .uri(URI.create("https://example.com"))
      .method("POST", HttpRequest.BodyPublishers.noBody());
    requestBuilder.header("Cookie", "key1=value1");
    HttpRequest request = requestBuilder.build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println(response.body());
  }
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
    const result = JavaHttpClient.generate(config, httpRequest)
    expect(result).toBe("import java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\n\npublic class HttpExample {\n  public static void main(String[] args) throws Exception {\n    HttpClient client = HttpClient.newHttpClient();\n\n    String json = \"{\\\"key1\\\":\\\"value1\\\"}\";\n\n    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()\n      .uri(URI.create(\"https://example.com\"))\n      .method(\"POST\", HttpRequest.BodyPublishers.ofString(json));\n    HttpRequest request = requestBuilder.build();\n    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\n    System.out.println(response.body());\n  }\n}")
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
    const result = JavaHttpClient.generate(config, httpRequest)
    expect(result).toBe("import java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\n\npublic class HttpExample {\n  public static void main(String[] args) throws Exception {\n    HttpClient client = HttpClient.newHttpClient();\n\n    String json = \"{\\\"key1\\\":\\\"value1\\\",\\\"key2\\\":{\\\"key3\\\":\\\"value3\\\"},\\\"key4\\\":[\\\"value4\\\",\\\"value5\\\"],\\\"empty\\\":null}\";\n\n    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()\n      .uri(URI.create(\"https://example.com\"))\n      .method(\"POST\", HttpRequest.BodyPublishers.ofString(json));\n    HttpRequest request = requestBuilder.build();\n    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\n    System.out.println(response.body());\n  }\n}")
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
    const result = JavaHttpClient.generate(config, httpRequest)
    expect(result).toBe(`
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();

    String form = "username=" + URLEncoder.encode("user123", StandardCharsets.UTF_8) + "&" + "email=" + URLEncoder.encode("user@example.com", StandardCharsets.UTF_8);

    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
      .uri(URI.create("https://example.com"))
      .method("POST", HttpRequest.BodyPublishers.ofString(form));
    requestBuilder.header("Content-Type", "application/x-www-form-urlencoded");
    HttpRequest request = requestBuilder.build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println(response.body());
  }
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
    const result = JavaHttpClient.generate(config, httpRequest)
    expect(result).toBe(`
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();

    String body = "Simple plain text message";

    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
      .uri(URI.create("https://example.com"))
      .method("POST", HttpRequest.BodyPublishers.ofString(body));
    requestBuilder.header("Content-Type", "text/plain");
    HttpRequest request = requestBuilder.build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println(response.body());
  }
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
    const result = JavaHttpClient.generate(config, httpRequest)
    expect(result).toBe("import java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\n\npublic class HttpExample {\n  public static void main(String[] args) {\n    try {\n      HttpClient client = HttpClient.newHttpClient();\n\n      String json = \"{\\\"name\\\":\\\"test\\\"}\";\n\n      HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()\n        .uri(URI.create(\"https://example.com\"))\n        .method(\"POST\", HttpRequest.BodyPublishers.ofString(json));\n      requestBuilder.header(\"Content-Type\", \"application/json\");\n      HttpRequest request = requestBuilder.build();\n      HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\n      System.out.println(response.body());\n    } catch (Exception e) {\n      e.printStackTrace();\n    }\n  }\n}")
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
    const result = JavaHttpClient.generate(config, httpRequest)
    expect(result).toBe(`
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();

    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
      .uri(URI.create("https://example.com/?address.zip=66031&address.country=Wallis"))
      .method("GET", HttpRequest.BodyPublishers.noBody());
    HttpRequest request = requestBuilder.build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println(response.body());
  }
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
    const result = JavaHttpClient.generate(config, httpRequest)
    expect(result).toBe(`
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();

    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
      .uri(URI.create("https://example.com/?tags=alpha&tags=beta&category=backend"))
      .method("GET", HttpRequest.BodyPublishers.noBody());
    HttpRequest request = requestBuilder.build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println(response.body());
  }
}
`.trim())
  })

})
