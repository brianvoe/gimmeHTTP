import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import {
  ContentTypeIncludes,
  FormatCookieHeader,
  GetContentType,
  HasBody,
  IsObjectBody,
  IsStringBody
} from '../utils/utils'

export default {
  default: true,
  language: 'objectivec',
  client: 'nsurlsession',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n'
    })
    const contentType = GetContentType(http.headers)
    const hasParams = http.params && Object.keys(http.params).length > 0
    const hasHeaders = http.headers && Object.keys(http.headers).length > 0
    const hasCookies = http.cookies && Object.keys(http.cookies).length > 0

    builder.line('#import <Foundation/Foundation.h>')
    builder.line()
    builder.line('int main(int argc, const char * argv[]) {')
    builder.indent()
    builder.line('@autoreleasepool {')
    builder.indent()

    if (hasParams) {
      builder.line('NSURLComponents *urlComponents = [NSURLComponents componentsWithString:@"%s"];', http.url)
      builder.line('NSMutableArray<NSURLQueryItem *> *queryItems = [NSMutableArray array];')
      for (const [key, value] of Object.entries(http.params!)) {
        if (Array.isArray(value)) {
          for (const val of value) {
            builder.line('[queryItems addObject:[NSURLQueryItem queryItemWithName:@"%s" value:@"%s"]];', key, val)
          }
        } else {
          builder.line('[queryItems addObject:[NSURLQueryItem queryItemWithName:@"%s" value:@"%s"]];', key, value)
        }
      }
      builder.line('urlComponents.queryItems = queryItems;')
      builder.line('NSURL *url = urlComponents.URL;')
    } else {
      builder.line('NSURL *url = [NSURL URLWithString:@"%s"];', http.url)
    }

    builder.line('NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];')
    builder.line('[request setHTTPMethod:@"%s"];', http.method.toUpperCase())

    if (hasHeaders) {
      builder.line()
      for (const [key, value] of Object.entries(http.headers!)) {
        const values = Array.isArray(value) ? value : [value]
        for (const headerValue of values) {
          builder.line('[request setValue:@"%s" forHTTPHeaderField:@"%s"];', headerValue, key)
        }
      }
    }

    if (hasCookies) {
      builder.line()
      builder.line('[request setValue:@"%s" forHTTPHeaderField:@"Cookie"];', FormatCookieHeader(http.cookies!))
    }

    if (HasBody(http.body)) {
      builder.line()
      if (IsStringBody(http.body)) {
        builder.line('NSString *bodyString = @"%s";', http.body)
        builder.line('request.HTTPBody = [bodyString dataUsingEncoding:NSUTF8StringEncoding];')
      } else if (IsObjectBody(http.body) && ContentTypeIncludes(contentType, 'form')) {
        const formBody = Object.entries(http.body)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&')
        builder.line('NSString *bodyString = @"%s";', formBody)
        builder.line('request.HTTPBody = [bodyString dataUsingEncoding:NSUTF8StringEncoding];')
      } else if (IsObjectBody(http.body)) {
        builder.line('NSString *bodyString = @')
        builder.jsonStringLiteral(http.body)
        builder.append(';')
        builder.line('request.HTTPBody = [bodyString dataUsingEncoding:NSUTF8StringEncoding];')
        if (!contentType) {
          builder.line('[request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];')
        }
      }
    }

    builder.line()
    builder.line('dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);')
    builder.line('NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request')
    builder.indent()
    builder.line('completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {')
    builder.indent()
    if (config.handleErrors) {
      builder.line('if (error) {')
      builder.indent()
      builder.line('NSLog(@"Error: %@", error);')
      builder.line('dispatch_semaphore_signal(semaphore);')
      builder.line('return;')
      builder.outdent()
      builder.line('}')
      builder.line('NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;')
      builder.line('if (httpResponse.statusCode < 200 || httpResponse.statusCode >= 300) {')
      builder.indent()
      builder.line('NSLog(@"Request failed with status code: %ld", (long)httpResponse.statusCode);')
      builder.line('dispatch_semaphore_signal(semaphore);')
      builder.line('return;')
      builder.outdent()
      builder.line('}')
    } else {
      builder.line('if (error) {')
      builder.indent()
      builder.line('NSLog(@"Error: %@", error);')
      builder.line('dispatch_semaphore_signal(semaphore);')
      builder.line('return;')
      builder.outdent()
      builder.line('}')
    }
    builder.line('NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];')
    builder.line('NSLog(@"%@", responseString);')
    builder.line('dispatch_semaphore_signal(semaphore);')
    builder.outdent()
    builder.line('}];')
    builder.outdent()
    builder.line('[task resume];')
    builder.line('dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);')

    builder.outdent()
    builder.line('}')
    builder.line('return 0;')
    builder.outdent()
    builder.line('}')

    return builder.output()
  }
} as Client
