import JavaHttpURLConnection from './java.httpurlconnection'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

describe('JavaHttpURLConnection.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = JavaHttpURLConnection.generate(config, httpRequest)
    expect(result).toBe(
      `
import java.io.*;
import java.net.*;

public class HttpExample {
  public static void main(String[] args) {
    URL url = new URL("https://example.com");
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestMethod("GET");

    int responseCode = conn.getResponseCode();
    BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
    String inputLine;
    StringBuilder response = new StringBuilder();

    while ((inputLine = in.readLine()) != null) {
      response.append(inputLine);
    }
    in.close();

    System.out.println(response.toString());
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
        Authorization: 'Bearer token123'
      }
    }
    const config: Config = {}
    const result = JavaHttpURLConnection.generate(config, httpRequest)
    expect(result).toContain('conn.setRequestProperty("Content-Type", "application/json");')
    expect(result).toContain('conn.setRequestProperty("Authorization", "Bearer token123");')
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      cookies: {
        session: 'abc123',
        user: 'john'
      }
    }
    const config: Config = {}
    const result = JavaHttpURLConnection.generate(config, httpRequest)
    expect(result).toContain('conn.setRequestProperty("Cookie", "session=abc123; user=john");')
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
        age: 30
      }
    }
    const config: Config = {}
    const result = JavaHttpURLConnection.generate(config, httpRequest)
    expect(result).toContain('import org.json.JSONObject;')
    expect(result).toContain('conn.setDoOutput(true);')
    expect(result).toContain('JSONObject jsonBody = new JSONObject();')
    expect(result).toContain('jsonBody.put("name", "John");')
    expect(result).toContain('jsonBody.put("age", 30);')
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
    const result = JavaHttpURLConnection.generate(config, httpRequest)
    expect(result).toContain('conn.setDoOutput(true);')
    expect(result).toContain('byte[] input = "Plain text message".getBytes("utf-8");')
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
    const result = JavaHttpURLConnection.generate(config, httpRequest)
    expect(result).toContain('try {')
    expect(result).toContain('} catch (Exception e) {')
    expect(result).toContain('e.printStackTrace();')
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
    const result = JavaHttpURLConnection.generate(config, httpRequest)
    expect(result).toContain('conn.setRequestProperty("Accept", "application/json");')
    expect(result).toContain('conn.setRequestProperty("Accept", "text/plain");')
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
    const result = JavaHttpURLConnection.generate(config, httpRequest)
    expect(result).toBe(
      `
import java.io.*;
import java.net.*;
import java.net.URLEncoder;

public class HttpExample {
  public static void main(String[] args) {
    String baseUrl = "https://example.com";
    StringBuilder urlBuilder = new StringBuilder(baseUrl);
    urlBuilder.append(baseUrl.contains("?") ? "&" : "?");

    String[] paramPairs = {
      "address.zip=" + URLEncoder.encode("66031", "UTF-8"),
      "address.country=" + URLEncoder.encode("Wallis", "UTF-8")
    };

    for (int i = 0; i < paramPairs.length; i++) {
      if (i > 0) urlBuilder.append("&");
      urlBuilder.append(paramPairs[i]);
    }

    URL url = new URL(urlBuilder.toString());
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestMethod("GET");

    int responseCode = conn.getResponseCode();
    BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
    String inputLine;
    StringBuilder response = new StringBuilder();

    while ((inputLine = in.readLine()) != null) {
      response.append(inputLine);
    }
    in.close();

    System.out.println(response.toString());
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
        tags: ['java', 'http'],
        category: 'backend'
      }
    }
    const config: Config = {}
    const result = JavaHttpURLConnection.generate(config, httpRequest)
    expect(result).toContain('"tags=" + URLEncoder.encode("java", "UTF-8")')
    expect(result).toContain('"tags=" + URLEncoder.encode("http", "UTF-8")')
    expect(result).toContain('"category=" + URLEncoder.encode("backend", "UTF-8")')
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
    const result = JavaHttpURLConnection.generate(config, httpRequest)
    expect(result).toContain('"version=" + URLEncoder.encode("1.0", "UTF-8")')
    expect(result).toContain('jsonBody.put("name", "John");')
  })
})
