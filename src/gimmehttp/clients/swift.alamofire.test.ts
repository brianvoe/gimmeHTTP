import SwiftAlamofire from './swift.alamofire'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('SwiftAlamofire.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = SwiftAlamofire.generate(config, httpRequest)
    expect(result).toBe(`
import Alamofire

AF.request("https://example.com", method: .get)
  .validate()
  .responseString { response in
    switch response.result {
    case .success(let value):
      print(value)
    case .failure(let error):
      print(error)
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
    const result = SwiftAlamofire.generate(config, httpRequest)
    expect(result).toBe(`
import Alamofire

let headers: HTTPHeaders = [
  "Content-Type": "application/json",
  "Authorization": "Bearer token",
]

let parameters: Parameters = {
  "key1": "value1"
}

AF.request("https://example.com", method: .post, parameters: parameters, encoding: JSONEncoding.default, headers: headers)
  .validate()
  .responseString { response in
    switch response.result {
    case .success(let value):
      print(value)
    case .failure(let error):
      print(error)
    }
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
    const result = SwiftAlamofire.generate(config, httpRequest)
    expect(result).toBe(`
import Alamofire

let headers: HTTPHeaders = [
  "Cookie": "key1=value1",
]

AF.request("https://example.com", method: .post, headers: headers)
  .validate()
  .responseString { response in
    switch response.result {
    case .success(let value):
      print(value)
    case .failure(let error):
      print(error)
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
    const result = SwiftAlamofire.generate(config, httpRequest)
    expect(result).toBe(`
import Alamofire

let parameters: Parameters = {
  "key1": "value1"
}

AF.request("https://example.com", method: .post, parameters: parameters, encoding: JSONEncoding.default)
  .validate()
  .responseString { response in
    switch response.result {
    case .success(let value):
      print(value)
    case .failure(let error):
      print(error)
    }
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
    const result = SwiftAlamofire.generate(config, httpRequest)
    expect(result).toBe(`
import Alamofire

let parameters: Parameters = {
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

AF.request("https://example.com", method: .post, parameters: parameters, encoding: JSONEncoding.default)
  .validate()
  .responseString { response in
    switch response.result {
    case .success(let value):
      print(value)
    case .failure(let error):
      print(error)
    }
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
    const result = SwiftAlamofire.generate(config, httpRequest)
    expect(result).toBe(`
import Alamofire

let headers: HTTPHeaders = [
  "Content-Type": "application/x-www-form-urlencoded",
]

let parameters: Parameters = {
  "username": "user123",
  "email": "user@example.com"
}

AF.request("https://example.com", method: .post, parameters: parameters, encoding: JSONEncoding.default, headers: headers)
  .validate()
  .responseString { response in
    switch response.result {
    case .success(let value):
      print(value)
    case .failure(let error):
      print(error)
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
    const result = SwiftAlamofire.generate(config, httpRequest)
    expect(result).toBe(`
import Alamofire

let headers: HTTPHeaders = [
  "Content-Type": "text/plain",
]

var urlRequest = URLRequest(url: URL(string: "https://example.com")!)
urlRequest.method = .post
urlRequest.headers = headers
urlRequest.httpBody = "Simple plain text message".data(using: .utf8)
AF.request(urlRequest)
  .validate()
  .responseString { response in
    switch response.result {
    case .success(let value):
      print(value)
    case .failure(let error):
      print(error)
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
    const result = SwiftAlamofire.generate(config, httpRequest)
    expect(result).toBe(`
import Alamofire

let headers: HTTPHeaders = [
  "Content-Type": "application/json",
]

let parameters: Parameters = {
  "name": "test"
}

AF.request("https://example.com", method: .post, parameters: parameters, encoding: JSONEncoding.default, headers: headers)
  .validate()
  .responseString { response in
    switch response.result {
    case .success(let value):
      print(value)
    case .failure(let error):
      print(error)
    }
  }
`.trim())
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
    const result = SwiftAlamofire.generate(config, httpRequest)
    expect(result).toBe(`
import Alamofire

AF.request("https://example.com/?address.zip=66031&address.country=Wallis", method: .get)
  .validate()
  .responseString { response in
    switch response.result {
    case .success(let value):
      print(value)
    case .failure(let error):
      print(error)
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
    const result = SwiftAlamofire.generate(config, httpRequest)
    expect(result).toBe(`
import Alamofire

AF.request("https://example.com/?tags=alpha&tags=beta&category=backend", method: .get)
  .validate()
  .responseString { response in
    switch response.result {
    case .success(let value):
      print(value)
    case .failure(let error):
      print(error)
    }
  }
`.trim())
  })

})
