import SwiftNSURLSession from './swift.nsurlsession'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from 'vitest'

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

let task = URLSession.shared.dataTask(with: request) { data, response, error in
  if let error = error {
    print("Error: \\(error)")
    return
  }

  if let httpResponse = response as? HTTPURLResponse {
    if httpResponse.statusCode == 200, let data = data {
      let responseString = String(data: data, encoding: .utf8)
      print(responseString ?? "No response data")
    } else {
      print("Request failed with status code: \\(httpResponse.statusCode)")
    }
  }
}

task.resume()
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

let task = URLSession.shared.dataTask(with: request) { data, response, error in
  if let error = error {
    print("Error: \\(error)")
    return
  }

  if let httpResponse = response as? HTTPURLResponse {
    if httpResponse.statusCode == 200, let data = data {
      let responseString = String(data: data, encoding: .utf8)
      print(responseString ?? "No response data")
    } else {
      print("Request failed with status code: \\(httpResponse.statusCode)")
    }
  }
}

task.resume()
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

request.addValue("key1=value1", forHTTPHeaderField: "Cookie")
request.addValue("key2=value2", forHTTPHeaderField: "Cookie")

let task = URLSession.shared.dataTask(with: request) { data, response, error in
  if let error = error {
    print("Error: \\(error)")
    return
  }

  if let httpResponse = response as? HTTPURLResponse {
    if httpResponse.statusCode == 200, let data = data {
      let responseString = String(data: data, encoding: .utf8)
      print(responseString ?? "No response data")
    } else {
      print("Request failed with status code: \\(httpResponse.statusCode)")
    }
  }
}

task.resume()
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

let bodyDict: [String: Any] = {
  "key1": "value1"
}
request.httpBody = try? JSONSerialization.data(withJSONObject: bodyDict)

let task = URLSession.shared.dataTask(with: request) { data, response, error in
  if let error = error {
    print("Error: \\(error)")
    return
  }

  if let httpResponse = response as? HTTPURLResponse {
    if httpResponse.statusCode == 200, let data = data {
      let responseString = String(data: data, encoding: .utf8)
      print(responseString ?? "No response data")
    } else {
      print("Request failed with status code: \\(httpResponse.statusCode)")
    }
  }
}

task.resume()
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
        key5: { subkey: 'subvalue' }
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

let bodyDict: [String: Any] = {
  "key1": "value1",
  "key2": 4235,
  "key3": true,
  "key4": [
    1,
    2,
    3
  ],
  "key5": {
    "subkey": "subvalue"
  }
}
request.httpBody = try? JSONSerialization.data(withJSONObject: bodyDict)

let task = URLSession.shared.dataTask(with: request) { data, response, error in
  if let error = error {
    print("Error: \\(error)")
    return
  }

  if let httpResponse = response as? HTTPURLResponse {
    if httpResponse.statusCode == 200, let data = data {
      let responseString = String(data: data, encoding: .utf8)
      print(responseString ?? "No response data")
    } else {
      print("Request failed with status code: \\(httpResponse.statusCode)")
    }
  }
}

task.resume()
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

let task = URLSession.shared.dataTask(with: request) { data, response, error in
  if let error = error {
    print("Error: \\(error)")
    return
  }

  if let httpResponse = response as? HTTPURLResponse {
    if httpResponse.statusCode == 200, let data = data {
      let responseString = String(data: data, encoding: .utf8)
      print(responseString ?? "No response data")
    } else {
      print("Request failed with status code: \\(httpResponse.statusCode)")
    }
  }
}

task.resume()
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

let task = URLSession.shared.dataTask(with: request) { data, response, error in
  if let error = error {
    print("Error: \\(error)")
    return
  }

  if let httpResponse = response as? HTTPURLResponse {
    if httpResponse.statusCode == 200, let data = data {
      let responseString = String(data: data, encoding: .utf8)
      print(responseString ?? "No response data")
    } else {
      print("Request failed with status code: \\(httpResponse.statusCode)")
    }
  }
}

task.resume()
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

let task = URLSession.shared.dataTask(with: request) { data, response, error in
  if let error = error {
    print("Error: \\(error)")
    return
  }

  if let httpResponse = response as? HTTPURLResponse {
    if httpResponse.statusCode == 200, let data = data {
      let responseString = String(data: data, encoding: .utf8)
      print(responseString ?? "No response data")
    } else {
      print("Request failed with status code: \\(httpResponse.statusCode)")
    }
  }
}

task.resume()
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
    expect(result).toContain('queryItems.append(URLQueryItem(name: "tags", value: "swift"))')
    expect(result).toContain('queryItems.append(URLQueryItem(name: "tags", value: "urlsession"))')
    expect(result).toContain('queryItems.append(URLQueryItem(name: "category", value: "backend"))')
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
    expect(result).toContain('queryItems.append(URLQueryItem(name: "version", value: "1.0"))')
    expect(result).toContain('"name": "John"')
  })
})
