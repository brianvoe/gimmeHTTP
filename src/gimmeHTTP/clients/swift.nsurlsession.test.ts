import SwiftNSURLSession from './swift.nsurlsession'
import { Config, Http } from '../utils/generate'
import { describe, test, expect } from '@jest/globals'

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

let body = {
  "key1": "value1"
}
request.httpBody = body

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
})
