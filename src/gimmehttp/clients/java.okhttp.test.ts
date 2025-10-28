import JavaOkHttp from './java.okhttp'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

describe('JavaOkHttp.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/api'
    }
    const config: Config = {}
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) {
    OkHttpClient client = new OkHttpClient();

    Request.Builder requestBuilder = new Request.Builder()
      .url("https://example.com/api")
      .method("GET", null)
      .build();

    Request request = requestBuilder;
    Response response = client.newCall(request).execute();

    System.out.println(response.body().string());
  }
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
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toContain('import org.json.JSONObject;')
    expect(result).toContain('JSONObject jsonBody = new JSONObject();')
    expect(result).toContain('jsonBody.put("name", "John");')
    expect(result).toContain('jsonBody.put("active", true);')
    expect(result).toContain('MediaType.parse("application/json; charset=utf-8")')
  })

  test('should build a POST request with form body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        username: 'test',
        password: 'pass123'
      }
    }
    const config: Config = {}
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toContain('FormBody.Builder formBuilder = new FormBody.Builder();')
    expect(result).toContain('formBuilder.add("username", "test");')
    expect(result).toContain('formBuilder.add("password", "pass123");')
  })

  test('should build a POST request with text body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Plain text content'
    }
    const config: Config = {}
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toContain('RequestBody body = RequestBody.create(')
    expect(result).toContain('"Plain text content"')
    expect(result).toContain('MediaType.parse("text/plain; charset=utf-8")')
  })

  test('should build a POST request with error handling', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        test: 'data'
      }
    }
    const config: Config = { handleErrors: true }
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toContain('try {')
    expect(result).toContain('} catch (Exception e) {')
    expect(result).toContain('e.printStackTrace();')
  })

  test('should handle array header values', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      headers: {
        Accept: ['application/json', 'application/xml']
      }
    }
    const config: Config = {}
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toContain('.addHeader("Accept", "application/json")')
    expect(result).toContain('.addHeader("Accept", "application/xml")')
  })

  test('should build a PUT request', () => {
    const httpRequest: Http = {
      method: 'PUT',
      url: 'https://example.com/resource/123',
      body: {
        status: 'updated'
      }
    }
    const config: Config = {}
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toContain('.method("PUT", body)')
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
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) {
    OkHttpClient client = new OkHttpClient();

    HttpUrl.Builder urlBuilder = HttpUrl.parse("https://example.com").newBuilder();
    urlBuilder.addQueryParameter("address.zip", "66031");
    urlBuilder.addQueryParameter("address.country", "Wallis");
    HttpUrl url = urlBuilder.build();

    Request.Builder requestBuilder = new Request.Builder()
      .url(url)
      .method("GET", null)
      .build();

    Request request = requestBuilder;
    Response response = client.newCall(request).execute();

    System.out.println(response.body().string());
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
        tags: ['java', 'okhttp'],
        category: 'backend'
      }
    }
    const config: Config = {}
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toContain('urlBuilder.addQueryParameter("tags", "java");')
    expect(result).toContain('urlBuilder.addQueryParameter("tags", "okhttp");')
    expect(result).toContain('urlBuilder.addQueryParameter("category", "backend");')
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
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toContain('urlBuilder.addQueryParameter("version", "1.0");')
    expect(result).toContain('jsonBody.put("name", "John");')
  })
})
