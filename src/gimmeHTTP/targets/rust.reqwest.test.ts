import RustReqwest from './rust.reqwest'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from '@jest/globals'

describe('RustReqwest.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://gofakeit.com/api'
    }
    const config: Config = {}
    const result = RustReqwest.generate(config, httpRequest)
    expect(result).toBe(
      `
use reqwest::blocking::Client;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
  let client = Client::new();

  let res = client.request(reqwest::Method::GET, "https://gofakeit.com/api")
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
      url: 'https://gofakeit.com/api',
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

  let res = client.request(reqwest::Method::POST, "https://gofakeit.com/api")
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
      url: 'https://gofakeit.com/api',
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

  let res = client.request(reqwest::Method::POST, "https://gofakeit.com/api")
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
      url: 'https://gofakeit.com/api',
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

  let res = client.request(reqwest::Method::POST, "https://gofakeit.com/api")
    .header("Content-Type", "application/json")
    .body("{\"key1\":\"value1\"}")
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
})
