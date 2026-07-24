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
    .header("Cookie", "cookie1=value1; cookie2=value2")
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
    const config: Config = {
      handleErrors: true
    }
    const result = RustReqwest.generate(config, httpRequest)
    expect(result).toBe(
      `
use reqwest::blocking::Client;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
  let client = Client::new();

  let res = client.request(reqwest::Method::POST, "https://example.com")
    .header("Content-Type", "application/json")
    .body("{\\"key1\\":\\"value1\\"}")
    .send()?.error_for_status()?;

  println!("{}", res.text()?);
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
        key4: {
          nested: 'value'
        },
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
    .header("Content-Type", "application/json")
    .body("{\\"key1\\":\\"value1\\",\\"key2\\":2,\\"key3\\":[1,2,3],\\"key4\\":{\\"nested\\":\\"value\\"},\\"empty\\":null}")
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })

  test('should build a POST request with form-urlencoded body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        username: 'testuser',
        password: 'testpass'
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
    .header("Content-Type", "application/x-www-form-urlencoded")
    .form(&[("username", "testuser"), ("password", "testpass")])
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
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
      body: 'Plain text content'
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
    .header("Content-Type", "text/plain")
    .body("Plain text content")
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
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
    const result = RustReqwest.generate(config, httpRequest)
    expect(result).toBe(
      `
use reqwest::blocking::Client;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
  let client = Client::new();

  let res = client.request(reqwest::Method::GET, "https://example.com")
    .query(&[
      ("address.zip", "66031"),
      ("address.country", "Wallis"),
    ])
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['rust', 'reqwest'],
        category: 'backend'
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

  let res = client.request(reqwest::Method::GET, "https://example.com")
    .query(&[
      ("tags", "rust"),
      ("tags", "reqwest"),
      ("category", "backend"),
    ])
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
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
    const result = RustReqwest.generate(config, httpRequest)
    expect(result).toBe(
      `
use reqwest::blocking::Client;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
  let client = Client::new();

  let res = client.request(reqwest::Method::POST, "https://example.com")
    .query(&[
      ("version", "1.0"),
    ])
    .header("Content-Type", "application/json")
    .body("{\\"name\\":\\"John\\"}")
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })

  test('generates an escaped request URL and headers', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/"quoted"',
      headers: {
        'X-Name': 'a"b'
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

  let res = client.request(reqwest::Method::GET, "https://example.com/\\"quoted\\"")
    .header("X-Name", "a\\"b")
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })

  test('uses one Cookie header and error_for_status', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      cookies: {
        session: 'abc',
        user: 'jane'
      }
    }
    const config: Config = {
      handleErrors: true
    }
    const result = RustReqwest.generate(config, httpRequest)
    expect(result).toBe(
      `
use reqwest::blocking::Client;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
  let client = Client::new();

  let res = client.request(reqwest::Method::POST, "https://example.com")
    .header("Cookie", "session=abc; user=jane")
    .send()?.error_for_status()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })

  test('sends JSON bodies as escaped JSON strings', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        nested: {
          quote: 'a"b'
        },
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
    .header("Content-Type", "application/json")
    .body("{\\"nested\\":{\\"quote\\":\\"a\\\\\\"b\\"},\\"empty\\":null}")
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })

  test('uses form pairs for form bodies', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        username: 'testuser',
        password: 'testpass'
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
    .header("Content-Type", "application/x-www-form-urlencoded")
    .form(&[("username", "testuser"), ("password", "testpass")])
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })

  test('should escape URL and headers', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com/"quoted"',
      headers: {
        'X-Name': 'a"b'
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

  let res = client.request(reqwest::Method::GET, "https://example.com/\\"quoted\\"")
    .header("X-Name", "a\\"b")
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })

  test('should send JSON bodies as escaped JSON strings', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      body: {
        nested: {
          quote: 'a"b'
        },
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
    .header("Content-Type", "application/json")
    .body("{\\"nested\\":{\\"quote\\":\\"a\\\\\\"b\\"},\\"empty\\":null}")
    .send()?;

  println!("{}", res.text()?);
  Ok(())
}
    `.trim()
    )
  })
})
