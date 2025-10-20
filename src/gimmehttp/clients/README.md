# HTTP Client Implementations

This directory contains HTTP client code generators for 21 different programming languages and libraries.

## Supported Languages & Clients

| Language   | Client            | Default | Status      |
| ---------- | ----------------- | ------- | ----------- |
| C          | libcurl           | ✓       | ✅ Complete |
| C#         | HttpClient        | ✓       | ✅ Complete |
| C#         | RestSharp         |         | ✅ Complete |
| Dart       | http              | ✓       | ✅ Complete |
| Go         | net/http          | ✓       | ✅ Complete |
| Java       | HttpURLConnection | ✓       | ✅ Complete |
| Java       | OkHttp            |         | ✅ Complete |
| JavaScript | axios             |         | ✅ Complete |
| JavaScript | fetch             | ✓       | ✅ Complete |
| JavaScript | jQuery            |         | ✅ Complete |
| Kotlin     | Ktor              | ✓       | ✅ Complete |
| Node.js    | fetch             |         | ✅ Complete |
| Node.js    | http              | ✓       | ✅ Complete |
| PHP        | cURL              | ✓       | ✅ Complete |
| PHP        | Guzzle            |         | ✅ Complete |
| Python     | http.client       | ✓       | ✅ Complete |
| Python     | requests          |         | ✅ Complete |
| Ruby       | Net::HTTP         | ✓       | ✅ Complete |
| Ruby       | Faraday           |         | ✅ Complete |
| Rust       | reqwest           | ✓       | ✅ Complete |
| Shell      | cURL              | ✓       | ✅ Complete |
| Swift      | URLSession        | ✓       | ✅ Complete |

## Feature Support

| Client                       | HTTP Methods                     | Headers | Cookies | Array Headers | JSON Body | Form Body | Text Body | XML Body | Response Parsing | Error Handling | Comments |
| ---------------------------- | -------------------------------- | ------- | ------- | ------------- | --------- | --------- | --------- | -------- | ---------------- | -------------- | -------- |
| **C (libcurl)**              | ✅ GET, POST, PUT, DELETE        | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅ Always      |          |
| **C# (HttpClient)**          | ✅ GET, POST, PUT, DELETE, PATCH | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅ Always      |          |
| **C# (RestSharp)**           | ✅ GET, POST, PUT, DELETE, PATCH | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **Dart (http)**              | ✅ GET, POST, PUT, DELETE, PATCH | ✅      | ❌      | ✅            | ✅        | ❌        | ✅        | ✅       | ✅               | ✅             |          |
| **Go (net/http)**            | ✅ GET, POST, PUT, DELETE, PATCH | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **Java (HttpURLConnection)** | ✅ GET, POST, PUT, DELETE        | ✅      | ✅      | ✅            | ✅        | ❌        | ✅        | ✅       | ✅               | ✅             |          |
| **Java (OkHttp)**            | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **JS (axios)**               | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Auto          | ✅             |          |
| **JS (fetch)**               | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Dynamic       | ✅             |          |
| **JS (jQuery)**              | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Auto          | ✅             |          |
| **Kotlin (Ktor)**            | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **Node (fetch)**             | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Dynamic       | ✅             |          |
| **Node (http)**              | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **PHP (cURL)**               | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **PHP (Guzzle)**             | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **Python (http.client)**     | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **Python (requests)**        | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **Ruby (Net::HTTP)**         | ✅ GET, POST, PUT, DELETE, PATCH | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **Ruby (Faraday)**           | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **Rust (reqwest)**           | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| **Shell (cURL)**             | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅ Always      |          |
| **Swift (URLSession)**       | ✅ All methods                   | ✅      | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅ Always      |          |

**Legend:**

- ✅ = Fully implemented
- ✅ Always = Error handling always present (not configurable)
- ✅ Auto = Automatic content-type detection and parsing
- ✅ Dynamic = Dynamic response parsing based on Content-Type headers
- ❌ = Not implemented (optional feature)

## Implementation Checklist

Use this checklist when adding a new language/client or auditing existing implementations:

### Required Features

- [ ] **HTTP Methods**
  - [ ] GET
  - [ ] POST
  - [ ] PUT
  - [ ] DELETE
  - [ ] PATCH (if supported by language/library)
  - [ ] Other methods (HEAD, OPTIONS, etc.)

- [ ] **Headers**
  - [ ] Single header values
  - [ ] Array header values (multiple values for same key)
  - [ ] Case handling (some libraries are case-sensitive)

- [ ] **Cookies**
  - [ ] Cookie header generation
  - [ ] Multiple cookies in single header

- [ ] **Request Body Types**
  - [ ] JSON (objects)
  - [ ] Form-urlencoded (objects with appropriate content-type)
  - [ ] Plain text (strings)
  - [ ] XML (strings with XML content)
  - [ ] Empty body handling (don't send body for GET, etc.)

- [ ] **Content-Type Handling**
  - [ ] Use `GetContentType()` utility for header detection
  - [ ] Use `ContentTypeIncludes()` for type checking
  - [ ] Support `application/json`
  - [ ] Support `application/x-www-form-urlencoded`
  - [ ] Support `text/plain`
  - [ ] Support `application/xml`
  - [ ] Smart inference when no content-type specified (via `InferContentType()`)

- [ ] **Body Utilities**
  - [ ] Use `HasBody()` to check for non-empty bodies
  - [ ] Use `IsStringBody()` to detect string bodies
  - [ ] Use `IsObjectBody()` to detect object bodies

### Optional Features

- [ ] **Error Handling**
  - [ ] Try-catch blocks (if language supports)
  - [ ] Error callbacks/handling
  - [ ] Configurable via `config.handleErrors` flag

- [ ] **Response Parsing**
  - [ ] JSON response parsing
  - [ ] Text response parsing
  - [ ] Binary/blob response parsing
  - [ ] XML response parsing
  - [ ] Dynamic parsing based on response Content-Type

### Code Quality

- [ ] **Tests**
  - [ ] Basic GET request
  - [ ] POST with headers
  - [ ] POST with cookies
  - [ ] POST with JSON body
  - [ ] POST with form-urlencoded body
  - [ ] POST with text/plain body
  - [ ] POST with XML body
  - [ ] Advanced/nested JSON body
  - [ ] Array header values test
  - [ ] Additional HTTP methods (PUT, DELETE, PATCH)
  - [ ] Empty body scenarios

- [ ] **Code Generation**
  - [ ] Uses `Builder` utility correctly
  - [ ] Proper indentation handling
  - [ ] Clean, idiomatic code for target language
  - [ ] Comments where helpful (especially for inferred types)

- [ ] **Coverage**
  - [ ] Aim for 90%+ statement coverage
  - [ ] All major code paths tested
  - [ ] Edge cases covered
