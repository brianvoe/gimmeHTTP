import ObjectivecNsurlsession from './objectivec.nsurlsession'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('ObjectivecNsurlsession.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = ObjectivecNsurlsession.generate(config, httpRequest)
    expect(result).toBe(`
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
  @autoreleasepool {
    NSURL *url = [NSURL URLWithString:@"https://example.com"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"GET"];

    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request
      completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
          NSLog(@"Error: %@", error);
          dispatch_semaphore_signal(semaphore);
          return;
        }
        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSLog(@"%@", responseString);
        dispatch_semaphore_signal(semaphore);
      }];
    [task resume];
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  }
  return 0;
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
    const result = ObjectivecNsurlsession.generate(config, httpRequest)
    expect(result).toBe("#import <Foundation/Foundation.h>\n\nint main(int argc, const char * argv[]) {\n  @autoreleasepool {\n    NSURL *url = [NSURL URLWithString:@\"https://example.com\"];\n    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];\n    [request setHTTPMethod:@\"POST\"];\n\n    [request setValue:@\"application/json\" forHTTPHeaderField:@\"Content-Type\"];\n    [request setValue:@\"Bearer token\" forHTTPHeaderField:@\"Authorization\"];\n\n    NSString *bodyString = @\"{\\\"key1\\\":\\\"value1\\\"}\";\n    request.HTTPBody = [bodyString dataUsingEncoding:NSUTF8StringEncoding];\n\n    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);\n    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request\n      completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {\n        if (error) {\n          NSLog(@\"Error: %@\", error);\n          dispatch_semaphore_signal(semaphore);\n          return;\n        }\n        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];\n        NSLog(@\"%@\", responseString);\n        dispatch_semaphore_signal(semaphore);\n      }];\n    [task resume];\n    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);\n  }\n  return 0;\n}")
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
    const result = ObjectivecNsurlsession.generate(config, httpRequest)
    expect(result).toBe(`
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
  @autoreleasepool {
    NSURL *url = [NSURL URLWithString:@"https://example.com"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];

    [request setValue:@"key1=value1" forHTTPHeaderField:@"Cookie"];

    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request
      completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
          NSLog(@"Error: %@", error);
          dispatch_semaphore_signal(semaphore);
          return;
        }
        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSLog(@"%@", responseString);
        dispatch_semaphore_signal(semaphore);
      }];
    [task resume];
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  }
  return 0;
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
    const result = ObjectivecNsurlsession.generate(config, httpRequest)
    expect(result).toBe("#import <Foundation/Foundation.h>\n\nint main(int argc, const char * argv[]) {\n  @autoreleasepool {\n    NSURL *url = [NSURL URLWithString:@\"https://example.com\"];\n    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];\n    [request setHTTPMethod:@\"POST\"];\n\n    NSString *bodyString = @\"{\\\"key1\\\":\\\"value1\\\"}\";\n    request.HTTPBody = [bodyString dataUsingEncoding:NSUTF8StringEncoding];\n    [request setValue:@\"application/json\" forHTTPHeaderField:@\"Content-Type\"];\n\n    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);\n    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request\n      completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {\n        if (error) {\n          NSLog(@\"Error: %@\", error);\n          dispatch_semaphore_signal(semaphore);\n          return;\n        }\n        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];\n        NSLog(@\"%@\", responseString);\n        dispatch_semaphore_signal(semaphore);\n      }];\n    [task resume];\n    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);\n  }\n  return 0;\n}")
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
    const result = ObjectivecNsurlsession.generate(config, httpRequest)
    expect(result).toBe("#import <Foundation/Foundation.h>\n\nint main(int argc, const char * argv[]) {\n  @autoreleasepool {\n    NSURL *url = [NSURL URLWithString:@\"https://example.com\"];\n    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];\n    [request setHTTPMethod:@\"POST\"];\n\n    NSString *bodyString = @\"{\\\"key1\\\":\\\"value1\\\",\\\"key2\\\":{\\\"key3\\\":\\\"value3\\\"},\\\"key4\\\":[\\\"value4\\\",\\\"value5\\\"],\\\"empty\\\":null}\";\n    request.HTTPBody = [bodyString dataUsingEncoding:NSUTF8StringEncoding];\n    [request setValue:@\"application/json\" forHTTPHeaderField:@\"Content-Type\"];\n\n    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);\n    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request\n      completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {\n        if (error) {\n          NSLog(@\"Error: %@\", error);\n          dispatch_semaphore_signal(semaphore);\n          return;\n        }\n        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];\n        NSLog(@\"%@\", responseString);\n        dispatch_semaphore_signal(semaphore);\n      }];\n    [task resume];\n    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);\n  }\n  return 0;\n}")
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
    const result = ObjectivecNsurlsession.generate(config, httpRequest)
    expect(result).toBe(`
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
  @autoreleasepool {
    NSURL *url = [NSURL URLWithString:@"https://example.com"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];

    [request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];

    NSString *bodyString = @"username=user123&email=user%40example.com";
    request.HTTPBody = [bodyString dataUsingEncoding:NSUTF8StringEncoding];

    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request
      completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
          NSLog(@"Error: %@", error);
          dispatch_semaphore_signal(semaphore);
          return;
        }
        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSLog(@"%@", responseString);
        dispatch_semaphore_signal(semaphore);
      }];
    [task resume];
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  }
  return 0;
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
    const result = ObjectivecNsurlsession.generate(config, httpRequest)
    expect(result).toBe(`
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
  @autoreleasepool {
    NSURL *url = [NSURL URLWithString:@"https://example.com"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];

    [request setValue:@"text/plain" forHTTPHeaderField:@"Content-Type"];

    NSString *bodyString = @"Simple plain text message";
    request.HTTPBody = [bodyString dataUsingEncoding:NSUTF8StringEncoding];

    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request
      completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
          NSLog(@"Error: %@", error);
          dispatch_semaphore_signal(semaphore);
          return;
        }
        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSLog(@"%@", responseString);
        dispatch_semaphore_signal(semaphore);
      }];
    [task resume];
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  }
  return 0;
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
    const result = ObjectivecNsurlsession.generate(config, httpRequest)
    expect(result).toBe("#import <Foundation/Foundation.h>\n\nint main(int argc, const char * argv[]) {\n  @autoreleasepool {\n    NSURL *url = [NSURL URLWithString:@\"https://example.com\"];\n    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];\n    [request setHTTPMethod:@\"POST\"];\n\n    [request setValue:@\"application/json\" forHTTPHeaderField:@\"Content-Type\"];\n\n    NSString *bodyString = @\"{\\\"name\\\":\\\"test\\\"}\";\n    request.HTTPBody = [bodyString dataUsingEncoding:NSUTF8StringEncoding];\n\n    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);\n    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request\n      completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {\n        if (error) {\n          NSLog(@\"Error: %@\", error);\n          dispatch_semaphore_signal(semaphore);\n          return;\n        }\n        NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;\n        if (httpResponse.statusCode < 200 || httpResponse.statusCode >= 300) {\n          NSLog(@\"Request failed with status code: %ld\", (long)httpResponse.statusCode);\n          dispatch_semaphore_signal(semaphore);\n          return;\n        }\n        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];\n        NSLog(@\"%@\", responseString);\n        dispatch_semaphore_signal(semaphore);\n      }];\n    [task resume];\n    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);\n  }\n  return 0;\n}")
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
    const result = ObjectivecNsurlsession.generate(config, httpRequest)
    expect(result).toBe(`
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
  @autoreleasepool {
    NSURLComponents *urlComponents = [NSURLComponents componentsWithString:@"https://example.com"];
    NSMutableArray<NSURLQueryItem *> *queryItems = [NSMutableArray array];
    [queryItems addObject:[NSURLQueryItem queryItemWithName:@"address.zip" value:@"66031"]];
    [queryItems addObject:[NSURLQueryItem queryItemWithName:@"address.country" value:@"Wallis"]];
    urlComponents.queryItems = queryItems;
    NSURL *url = urlComponents.URL;
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"GET"];

    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request
      completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
          NSLog(@"Error: %@", error);
          dispatch_semaphore_signal(semaphore);
          return;
        }
        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSLog(@"%@", responseString);
        dispatch_semaphore_signal(semaphore);
      }];
    [task resume];
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  }
  return 0;
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
    const result = ObjectivecNsurlsession.generate(config, httpRequest)
    expect(result).toBe(`
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
  @autoreleasepool {
    NSURLComponents *urlComponents = [NSURLComponents componentsWithString:@"https://example.com"];
    NSMutableArray<NSURLQueryItem *> *queryItems = [NSMutableArray array];
    [queryItems addObject:[NSURLQueryItem queryItemWithName:@"tags" value:@"alpha"]];
    [queryItems addObject:[NSURLQueryItem queryItemWithName:@"tags" value:@"beta"]];
    [queryItems addObject:[NSURLQueryItem queryItemWithName:@"category" value:@"backend"]];
    urlComponents.queryItems = queryItems;
    NSURL *url = urlComponents.URL;
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"GET"];

    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request
      completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
          NSLog(@"Error: %@", error);
          dispatch_semaphore_signal(semaphore);
          return;
        }
        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSLog(@"%@", responseString);
        dispatch_semaphore_signal(semaphore);
      }];
    [task resume];
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  }
  return 0;
}
`.trim())
  })

})
