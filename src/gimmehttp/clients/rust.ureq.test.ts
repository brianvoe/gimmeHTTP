import RustUreq from './rust.ureq'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('RustUreq.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      "method": "GET",
      "url": "https://example.com"
    }
    const config: Config = {}
    const result = RustUreq.generate(config, httpRequest)
    expect(result).toBe(`
fn main() -> Result<(), ureq::Error> {
  let resp = ureq::request("GET", "https://example.com")
    .call()?;

  println!("{}", resp.into_string()?);
  Ok(())
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
    const result = RustUreq.generate(config, httpRequest)
    expect(result).toBe(`
fn main() -> Result<(), ureq::Error> {
  let resp = ureq::request("POST", "https://example.com")
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer token")
    .send_json(ureq::json!({
        "key1": "value1"
      }))?;

  println!("{}", resp.into_string()?);
  Ok(())
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
    const result = RustUreq.generate(config, httpRequest)
    expect(result).toBe(`
fn main() -> Result<(), ureq::Error> {
  let resp = ureq::request("POST", "https://example.com")
    .set("Cookie", "key1=value1")
    .call()?;

  println!("{}", resp.into_string()?);
  Ok(())
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
    const result = RustUreq.generate(config, httpRequest)
    expect(result).toBe(`
fn main() -> Result<(), ureq::Error> {
  let resp = ureq::request("POST", "https://example.com")
    .set("Content-Type", "application/json")
    .send_json(ureq::json!({
        "key1": "value1"
      }))?;

  println!("{}", resp.into_string()?);
  Ok(())
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
    const result = RustUreq.generate(config, httpRequest)
    expect(result).toBe(`
fn main() -> Result<(), ureq::Error> {
  let resp = ureq::request("POST", "https://example.com")
    .set("Content-Type", "application/json")
    .send_json(ureq::json!({
        "key1": "value1",
        "key2": {
          "key3": "value3"
        },
        "key4": [
          "value4",
          "value5"
        ],
        "empty": null
      }))?;

  println!("{}", resp.into_string()?);
  Ok(())
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
    const result = RustUreq.generate(config, httpRequest)
    expect(result).toBe(`
fn main() -> Result<(), ureq::Error> {
  let resp = ureq::request("POST", "https://example.com")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .send_form(&[("username", "user123"), ("email", "user@example.com")])?;

  println!("{}", resp.into_string()?);
  Ok(())
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
    const result = RustUreq.generate(config, httpRequest)
    expect(result).toBe(`
fn main() -> Result<(), ureq::Error> {
  let resp = ureq::request("POST", "https://example.com")
    .set("Content-Type", "text/plain")
    .send_string("Simple plain text message")?;

  println!("{}", resp.into_string()?);
  Ok(())
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
    const result = RustUreq.generate(config, httpRequest)
    expect(result).toBe(`
fn main() -> Result<(), ureq::Error> {
  let resp = ureq::request("POST", "https://example.com")
    .set("Content-Type", "application/json")
    .send_json(ureq::json!({
        "name": "test"
      }))?;

  println!("{}", resp.into_string()?);
  Ok(())
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
    const result = RustUreq.generate(config, httpRequest)
    expect(result).toBe(`
fn main() -> Result<(), ureq::Error> {
  let resp = ureq::request("GET", "https://example.com")
    .query("address.zip", "66031")
    .query("address.country", "Wallis")
    .call()?;

  println!("{}", resp.into_string()?);
  Ok(())
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
    const result = RustUreq.generate(config, httpRequest)
    expect(result).toBe(`
fn main() -> Result<(), ureq::Error> {
  let resp = ureq::request("GET", "https://example.com")
    .query("tags", "alpha")
    .query("tags", "beta")
    .query("category", "backend")
    .call()?;

  println!("{}", resp.into_string()?);
  Ok(())
}
`.trim())
  })

})
