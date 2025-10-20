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
})
