import Node from './node.http'
import { Config, Http } from '../utils/generate'
import { test, describe, expect } from '@jest/globals'

describe('Node.generate', () => {
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
    const result = Node.generate(config, httpRequest)
    expect(result).toBe(
      `
const http = require("http");

const options = {
  method: "POST",
  hostname: "gofakeit.com",
  path: "/api",
  headers: {
    "Content-Type": "application/json",
  },
};

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(data);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(JSON.stringify({"key1":"value1"}));
req.end();
    `.trim()
    )
  })
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://gofakeit.com/api'
    }
    const config: Config = {}
    const result = Node.generate(config, httpRequest)
    expect(result).toBe(
      `
const http = require("http");

const options = {
  method: "GET",
  hostname: "gofakeit.com",
  path: "/api",
};

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(data);
  });
});

req.end();
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
    const result = Node.generate(config, httpRequest)
    expect(result).toBe(
      `
const http = require("http");

const options = {
  method: "POST",
  hostname: "gofakeit.com",
  path: "/api",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
};

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(data);
  });
});

req.end();
    `.trim()
    )
  })
})
