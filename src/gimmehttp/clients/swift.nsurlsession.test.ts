import SwiftNSURLSession from './swift.nsurlsession'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('SwiftNSURLSession.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

let url = URL(string: "https://example.com")!
var request = URLRequest(url: url)
request.httpMethod = "GET"

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
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
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

let url = URL(string: "https://example.com")!
var request = URLRequest(url: url)
request.httpMethod = "POST"

request.addValue("application/json", forHTTPHeaderField: "Content-Type")
request.addValue("Bearer token", forHTTPHeaderField: "Authorization")

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      cookies: {
        key1: 'value1',
        key2: 'value2'
      }
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

let url = URL(string: "https://example.com")!
var request = URLRequest(url: url)
request.httpMethod = "POST"

request.addValue("key1=value1; key2=value2", forHTTPHeaderField: "Cookie")

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
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
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

let url = URL(string: "https://example.com")!
var request = URLRequest(url: url)
request.httpMethod = "POST"

let json = "{\\"key1\\":\\"value1\\"}"
request.httpBody = json.data(using: .utf8)

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })

  test('should build a POST request with advanced json body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      },
      body: {
        key1: 'value1',
        key2: 4235,
        key3: true,
        key4: [1, 2, 3],
        key5: {
          subkey: 'subvalue'
        }
      }
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

let url = URL(string: "https://example.com")!
var request = URLRequest(url: url)
request.httpMethod = "POST"

request.addValue("application/json", forHTTPHeaderField: "Content-Type")
request.addValue("Bearer token", forHTTPHeaderField: "Authorization")

let json = "{\\"key1\\":\\"value1\\",\\"key2\\":4235,\\"key3\\":true,\\"key4\\":[1,2,3],\\"key5\\":{\\"subkey\\":\\"subvalue\\"}}"
request.httpBody = json.data(using: .utf8)

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })

  test('should build a POST request with text/plain body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Plain text message'
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

let url = URL(string: "https://example.com")!
var request = URLRequest(url: url)
request.httpMethod = "POST"

request.addValue("text/plain", forHTTPHeaderField: "Content-Type")

let bodyString = "Plain text message"
request.httpBody = bodyString.data(using: .utf8)

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })

  test('should build a POST request with XML body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: '<data><item>value</item></data>'
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

let url = URL(string: "https://example.com")!
var request = URLRequest(url: url)
request.httpMethod = "POST"

request.addValue("application/xml", forHTTPHeaderField: "Content-Type")

let bodyString = "<data><item>value</item></data>"
request.httpBody = bodyString.data(using: .utf8)

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
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
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

var urlComponents = URLComponents(string: "https://example.com")!
var queryItems: [URLQueryItem] = []
queryItems.append(URLQueryItem(name: "address.zip", value: "66031"))
queryItems.append(URLQueryItem(name: "address.country", value: "Wallis"))
urlComponents.queryItems = queryItems
let url = urlComponents.url!
var request = URLRequest(url: url)
request.httpMethod = "GET"

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['swift', 'urlsession'],
        category: 'backend'
      }
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

var urlComponents = URLComponents(string: "https://example.com")!
var queryItems: [URLQueryItem] = []
queryItems.append(URLQueryItem(name: "tags", value: "swift"))
queryItems.append(URLQueryItem(name: "tags", value: "urlsession"))
queryItems.append(URLQueryItem(name: "category", value: "backend"))
urlComponents.queryItems = queryItems
let url = urlComponents.url!
var request = URLRequest(url: url)
request.httpMethod = "GET"

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
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
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

var urlComponents = URLComponents(string: "https://example.com")!
var queryItems: [URLQueryItem] = []
queryItems.append(URLQueryItem(name: "version", value: "1.0"))
urlComponents.queryItems = queryItems
let url = urlComponents.url!
var request = URLRequest(url: url)
request.httpMethod = "POST"

request.addValue("application/json", forHTTPHeaderField: "Content-Type")

let json = "{\\"name\\":\\"John\\"}"
request.httpBody = json.data(using: .utf8)

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })

  test('uses async URLSession and accepts all successful responses', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

let url = URL(string: "https://example.com")!
var request = URLRequest(url: url)
request.httpMethod = "GET"

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })

  test('creates a single escaped Cookie header', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      cookies: {
        session: 'abc',
        user: 'jane'
      }
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

let url = URL(string: "https://example.com")!
var request = URLRequest(url: url)
request.httpMethod = "POST"

request.addValue("session=abc; user=jane", forHTTPHeaderField: "Cookie")

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })

  test('serializes JSON safely as UTF-8 data', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        nested: {
          quote: 'a"b'
        },
        empty: null
      }
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

let url = URL(string: "https://example.com")!
var request = URLRequest(url: url)
request.httpMethod = "POST"

let json = "{\\"nested\\":{\\"quote\\":\\"a\\\\\\"b\\"},\\"empty\\":null}"
request.httpBody = json.data(using: .utf8)

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })

  test('escapes URL, query parameters, and header values', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/"quoted"',
      params: {
        search: 'a"b'
      },
      headers: {
        'X-Name': 'a"b'
      }
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

var urlComponents = URLComponents(string: "https://example.com/\\"quoted\\"")!
var queryItems: [URLQueryItem] = []
queryItems.append(URLQueryItem(name: "search", value: "a\\"b"))
urlComponents.queryItems = queryItems
let url = urlComponents.url!
var request = URLRequest(url: url)
request.httpMethod = "GET"

request.addValue("a\\"b", forHTTPHeaderField: "X-Name")

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })

  test('should escape URL, query parameters, and header values', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/"quoted"',
      params: {
        search: 'a"b'
      },
      headers: {
        'X-Name': 'a"b'
      }
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

var urlComponents = URLComponents(string: "https://example.com/\\"quoted\\"")!
var queryItems: [URLQueryItem] = []
queryItems.append(URLQueryItem(name: "search", value: "a\\"b"))
urlComponents.queryItems = queryItems
let url = urlComponents.url!
var request = URLRequest(url: url)
request.httpMethod = "GET"

request.addValue("a\\"b", forHTTPHeaderField: "X-Name")

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })

  test('should serialize JSON safely as UTF-8 data', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        nested: {
          quote: 'a"b'
        },
        empty: null
      }
    }
    const config: Config = {}
    const result = SwiftNSURLSession.generate(config, httpRequest)
    expect(result).toBe(
      `
import Foundation

let url = URL(string: "https://example.com")!
var request = URLRequest(url: url)
request.httpMethod = "POST"

let json = "{\\"nested\\":{\\"quote\\":\\"a\\\\\\"b\\"},\\"empty\\":null}"
request.httpBody = json.data(using: .utf8)

do {
  let (data, response) = try await URLSession.shared.data(for: request)
  guard let httpResponse = response as? HTTPURLResponse else {
    print("Invalid response")
    return
  }

  guard (200..<300).contains(httpResponse.statusCode) else {
    print("Request failed with status code: \\(httpResponse.statusCode)")
    return
  }
  let responseString = String(data: data, encoding: .utf8)
  print(responseString ?? "No response data")
} catch {

  print("Error: \\(error)")
}
    `.trim()
    )
  })
})
