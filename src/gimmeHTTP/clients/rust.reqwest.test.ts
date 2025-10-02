import RustReqwest from './rust.reqwest'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('RustReqwest.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = RustReqwest.generate(config, httpRequest)
    expect(result).toBe(
      `
use reqwest::blocking::Client;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
  let client = Client::new();

  let res = client.request(reqwest::Method::GET, "https://example.com")
    .send()?;

  println!("{}", res.text()?);
  Ok(())
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
    const result = RustReqwest.generate(config, httpRequest)
    expect(result).toBe(
      `
use reqwest::blocking::Client;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
  let client = Client::new();

  let res = client.request(reqwest::Method::POST, "https://example.com")
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer token")
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })

  test('should build a POST request with cookies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      cookies: {
        cookie1: 'value1',
        cookie2: 'value2'
      }
    }
    const config: Config = {}
    const result = RustReqwest.generate(config, httpRequest)
    expect(result).toBe(
      `
use reqwest::blocking::Client;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
  let client = Client::new();

  let res = client.request(reqwest::Method::POST, "https://example.com")
    .cookie("cookie1", "value1")
    .cookie("cookie2", "value2")
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })

  test('should build a POST request with error handling', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        key1: 'value1'
      }
    }
    const config: Config = { handleErrors: true }
    const result = RustReqwest.generate(config, httpRequest)
    expect(result).toBe(
      `
use reqwest::blocking::Client;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
  let client = Client::new();

  let res = client.request(reqwest::Method::POST, "https://example.com")
    .header("Content-Type", "application/json")
    .body({
      "key1": "value1"
    })
    .send()?;

  if res.status().is_success() {
    println!("{}", res.text()?);
  } else {
    eprintln!("Request failed with status: {}", res.status());
  }
  Ok(())
}
    `.trim()
    )
  })

  test('should build a POST request with advanced json body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        key1: 'value1',
        key2: 2,
        key3: [1, 2, 3],
        key4: { nested: 'value' },
        empty: null
      }
    }
    const config: Config = {}
    const result = RustReqwest.generate(config, httpRequest)
    expect(result).toBe(
      `
use reqwest::blocking::Client;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
  let client = Client::new();

  let res = client.request(reqwest::Method::POST, "https://example.com")
    .body({
      "key1": "value1",
      "key2": 2,
      "key3": [
        1,
        2,
        3
      ],
      "key4": {
        "nested": "value"
      },
      "empty": null
    })
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })
})
