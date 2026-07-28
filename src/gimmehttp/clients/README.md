# HTTP Client Implementations

This directory contains HTTP client code generators for 19 programming languages (45 clients).

## Supported Languages & Clients

| Language     | Client            | Default | Status      |
| ------------ | ----------------- | ------- | ----------- |
| C            | libcurl           | ✓       | ✅ Complete |
| C#           | HttpClient        | ✓       | ✅ Complete |
| C#           | RestSharp         |         | ✅ Complete |
| C#           | Flurl             |         | ✅ Complete |
| Dart         | http              | ✓       | ✅ Complete |
| Dart         | dio               |         | ✅ Complete |
| Go           | net/http          | ✓       | ✅ Complete |
| Go           | resty             |         | ✅ Complete |
| Java         | HttpURLConnection | ✓       | ✅ Complete |
| Java         | OkHttp            |         | ✅ Complete |
| Java         | HttpClient        |         | ✅ Complete |
| JavaScript   | axios             |         | ✅ Complete |
| JavaScript   | fetch             | ✓       | ✅ Complete |
| JavaScript   | jQuery            |         | ✅ Complete |
| JavaScript   | ky                |         | ✅ Complete |
| Kotlin       | Ktor              | ✓       | ✅ Complete |
| Kotlin       | OkHttp            |         | ✅ Complete |
| Node.js      | fetch             |         | ✅ Complete |
| Node.js      | http              | ✓       | ✅ Complete |
| Node.js      | axios             |         | ✅ Complete |
| Node.js      | got               |         | ✅ Complete |
| Objective-C  | NSURLSession      | ✓       | ✅ Complete |
| PHP          | cURL              | ✓       | ✅ Complete |
| PHP          | Guzzle            |         | ✅ Complete |
| PHP          | Symfony           |         | ✅ Complete |
| PowerShell   | RestMethod        | ✓       | ✅ Complete |
| Python       | http.client       | ✓       | ✅ Complete |
| Python       | requests          |         | ✅ Complete |
| Python       | httpx             |         | ✅ Complete |
| Python       | aiohttp           |         | ✅ Complete |
| R            | httr              | ✓       | ✅ Complete |
| Ruby         | Net::HTTP         | ✓       | ✅ Complete |
| Ruby         | Faraday           |         | ✅ Complete |
| Ruby         | HTTParty          |         | ✅ Complete |
| Rust         | reqwest           | ✓       | ✅ Complete |
| Rust         | ureq              |         | ✅ Complete |
| Shell        | cURL              | ✓       | ✅ Complete |
| Shell        | HTTPie            |         | ✅ Complete |
| Shell        | wget              |         | ✅ Complete |
| Swift        | URLSession        | ✓       | ✅ Complete |
| Swift        | Alamofire         |         | ✅ Complete |
| TypeScript   | axios             |         | ✅ Complete |
| TypeScript   | fetch             | ✓       | ✅ Complete |
| TypeScript   | jQuery            |         | ✅ Complete |
| TypeScript   | ky                |         | ✅ Complete |

## Feature Support

| Language   | Client            | HTTP Methods                     | Headers | Params | Cookies | Array Headers | JSON Body | Form Body | Text Body | XML Body | Response Parsing | Error Handling | Comments |
| ---------- | ----------------- | -------------------------------- | ------- | ------ | ------- | ------------- | --------- | --------- | --------- | -------- | ---------------- | -------------- | -------- |
| C          | libcurl           | ✅ GET, POST, PUT, DELETE        | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅ Always      |          |
| C#         | HttpClient        | ✅ GET, POST, PUT, DELETE, PATCH | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅ Always      |          |
| C#         | RestSharp         | ✅ GET, POST, PUT, DELETE, PATCH | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| C#         | Flurl             | ✅ GET, POST, PUT, DELETE, PATCH | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Dart       | http              | ✅ GET, POST, PUT, DELETE, PATCH | ✅      | ✅     | ❌      | ✅            | ✅        | ❌        | ✅        | ✅       | ✅               | ✅             |          |
| Dart       | dio               | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Go         | net/http          | ✅ GET, POST, PUT, DELETE, PATCH | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Go         | resty             | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Java       | HttpURLConnection | ✅ GET, POST, PUT, DELETE        | ✅      | ✅     | ✅      | ✅            | ✅        | ❌        | ✅        | ✅       | ✅               | ✅             |          |
| Java       | OkHttp            | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Java       | HttpClient        | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| JavaScript | axios             | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Auto          | ✅             |          |
| JavaScript | fetch             | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Dynamic       | ✅             |          |
| JavaScript | jQuery            | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Auto          | ✅             |          |
| JavaScript | ky                | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Kotlin     | Ktor              | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Kotlin     | OkHttp            | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Node.js    | fetch             | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Dynamic       | ✅             |          |
| Node.js    | http              | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Node.js    | axios             | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Auto          | ✅             |          |
| Node.js    | got               | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Objective-C| NSURLSession      | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| PHP        | cURL              | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| PHP        | Guzzle            | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| PHP        | Symfony           | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| PowerShell | RestMethod        | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Python     | http.client       | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Python     | requests          | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Python     | httpx             | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Python     | aiohttp           | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| R          | httr              | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Ruby       | Net::HTTP         | ✅ GET, POST, PUT, DELETE, PATCH | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Ruby       | Faraday           | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Ruby       | HTTParty          | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Rust       | reqwest           | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Rust       | ureq              | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| Shell      | cURL              | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅ Always      |          |
| Shell      | HTTPie            | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅ Always      |          |
| Shell      | wget              | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅ Always      |          |
| Swift      | URLSession        | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅ Always      |          |
| Swift      | Alamofire         | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |
| TypeScript | axios             | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Auto          | ✅             |          |
| TypeScript | fetch             | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Dynamic       | ✅             |          |
| TypeScript | jQuery            | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅ Auto          | ✅             |          |
| TypeScript | ky                | ✅ All methods                   | ✅      | ✅     | ✅      | ✅            | ✅        | ✅        | ✅        | ✅       | ✅               | ✅             |          |

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

- [ ] **URL Parameters**
  - [ ] Query parameter support
  - [ ] Multiple parameter values for same key
  - [ ] URL parameter line breaking for long URLs

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
  - [ ] GET with URL parameters
  - [ ] POST with headers
  - [ ] POST with cookies
  - [ ] POST with JSON body
  - [ ] POST with form-urlencoded body
  - [ ] POST with text/plain body
  - [ ] POST with XML body
  - [ ] Advanced/nested JSON body
  - [ ] Array header values test
  - [ ] Array parameter values test
  - [ ] Additional HTTP methods (PUT, DELETE, PATCH)
  - [ ] Empty body scenarios
  - [ ] Long URL parameter breaking test

- [ ] **Code Generation**
  - [ ] Uses `Builder` utility correctly
  - [ ] Proper indentation handling
  - [ ] Clean, idiomatic code for target language
  - [ ] Comments where helpful (especially for inferred types)

- [ ] **Coverage**
  - [ ] Aim for 90%+ statement coverage
  - [ ] All major code paths tested
  - [ ] Edge cases covered
