import JavaOkHttp from './java.okhttp'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

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
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    Request request = new Request.Builder()
      .url("https://example.com/api")
      .method("GET", null)
      .build();

    try (Response response = client.newCall(request).execute()) {
      System.out.println(response.body().string());
    }
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
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    RequestBody body = RequestBody.create("{\\"name\\":\\"John\\",\\"active\\":true}",
      MediaType.parse("application/json; charset=utf-8")
    );

    Request request = new Request.Builder()
      .url("https://example.com")
      .method("POST", body)
      .addHeader("Content-Type", "application/json")
      .build();

    try (Response response = client.newCall(request).execute()) {
      System.out.println(response.body().string());
    }
  }
}
    `.trim()
    )
  })

  test('should build a POST request with nested JSON body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        item: {
          name: 'test'
        },
        tags: ['one', 'two']
      }
    }
    const config: Config = {}
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    RequestBody body = RequestBody.create("{\\"item\\":{\\"name\\":\\"test\\"},\\"tags\\":[\\"one\\",\\"two\\"]}",
      MediaType.parse("application/json; charset=utf-8")
    );

    Request request = new Request.Builder()
      .url("https://example.com")
      .method("POST", body)
      .build();

    try (Response response = client.newCall(request).execute()) {
      System.out.println(response.body().string());
    }
  }
}
    `.trim()
    )
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
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    FormBody.Builder formBuilder = new FormBody.Builder();
    formBuilder.add("username", "test");
    formBuilder.add("password", "pass123");
    RequestBody body = formBuilder.build();

    Request request = new Request.Builder()
      .url("https://example.com")
      .method("POST", body)
      .addHeader("Content-Type", "application/x-www-form-urlencoded")
      .build();

    try (Response response = client.newCall(request).execute()) {
      System.out.println(response.body().string());
    }
  }
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
      body: 'Plain text content'
    }
    const config: Config = {}
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    RequestBody body = RequestBody.create(
      "Plain text content",
      MediaType.parse("text/plain; charset=utf-8")
    );

    Request request = new Request.Builder()
      .url("https://example.com")
      .method("POST", body)
      .addHeader("Content-Type", "text/plain")
      .build();

    try (Response response = client.newCall(request).execute()) {
      System.out.println(response.body().string());
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
      body: {
        test: 'data'
      }
    }
    const config: Config = {
      handleErrors: true
    }
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) {
    try {
      OkHttpClient client = new OkHttpClient();

      RequestBody body = RequestBody.create("{\\"test\\":\\"data\\"}",
        MediaType.parse("application/json; charset=utf-8")
      );

      Request request = new Request.Builder()
        .url("https://example.com")
        .method("POST", body)
        .build();

      try (Response response = client.newCall(request).execute()) {
        System.out.println(response.body().string());
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
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
        Accept: ['application/json', 'application/xml']
      }
    }
    const config: Config = {}
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    Request request = new Request.Builder()
      .url("https://example.com")
      .method("GET", null)
      .addHeader("Accept", "application/json")
      .addHeader("Accept", "application/xml")
      .build();

    try (Response response = client.newCall(request).execute()) {
      System.out.println(response.body().string());
    }
  }
}
    `.trim()
    )
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
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    RequestBody body = RequestBody.create("{\\"status\\":\\"updated\\"}",
      MediaType.parse("application/json; charset=utf-8")
    );

    Request request = new Request.Builder()
      .url("https://example.com/resource/123")
      .method("PUT", body)
      .build();

    try (Response response = client.newCall(request).execute()) {
      System.out.println(response.body().string());
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
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    HttpUrl.Builder urlBuilder = HttpUrl.parse("https://example.com").newBuilder();
    urlBuilder.addQueryParameter("address.zip", "66031");
    urlBuilder.addQueryParameter("address.country", "Wallis");
    HttpUrl url = urlBuilder.build();

    Request request = new Request.Builder()
      .url(url)
      .method("GET", null)
      .build();

    try (Response response = client.newCall(request).execute()) {
      System.out.println(response.body().string());
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
        tags: ['java', 'okhttp'],
        category: 'backend'
      }
    }
    const config: Config = {}
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    HttpUrl.Builder urlBuilder = HttpUrl.parse("https://example.com").newBuilder();
    urlBuilder.addQueryParameter("tags", "java");
    urlBuilder.addQueryParameter("tags", "okhttp");
    urlBuilder.addQueryParameter("category", "backend");
    HttpUrl url = urlBuilder.build();

    Request request = new Request.Builder()
      .url(url)
      .method("GET", null)
      .build();

    try (Response response = client.newCall(request).execute()) {
      System.out.println(response.body().string());
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
    const result = JavaOkHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
import okhttp3.*;

public class HttpExample {
  public static void main(String[] args) throws Exception {
    OkHttpClient client = new OkHttpClient();

    RequestBody body = RequestBody.create("{\\"name\\":\\"John\\"}",
      MediaType.parse("application/json; charset=utf-8")
    );

    HttpUrl.Builder urlBuilder = HttpUrl.parse("https://example.com").newBuilder();
    urlBuilder.addQueryParameter("version", "1.0");
    HttpUrl url = urlBuilder.build();

    Request request = new Request.Builder()
      .url(url)
      .method("POST", body)
      .addHeader("Content-Type", "application/json")
      .build();

    try (Response response = client.newCall(request).execute()) {
      System.out.println(response.body().string());
    }
  }
}
    `.trim()
    )
  })
})
