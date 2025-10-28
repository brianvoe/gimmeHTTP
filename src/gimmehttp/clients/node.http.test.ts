import Node from './node.http'
import { Config, Http } from '../utils/generate'
import { test, describe, expect } from 'vitest'

describe('Node.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = Node.generate(config, httpRequest)
    expect(result).toBe(
      `
const http = require("http");

const options = {
  method: "GET",
  hostname: "example.com",
  path: "/",
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
      url: 'https://example.com',
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
  hostname: "example.com",
  path: "/",
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
    const result = Node.generate(config, httpRequest)
    expect(result).toBe(
      `
const http = require("http");

const options = {
  method: "POST",
  hostname: "example.com",
  path: "/",
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

req.write({
  "key1": "value1"
});
req.end();
    `.trim()
    )
  })

  test('should build a POST request with advanced json body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        key1: 'value1',
        key2: {
          nestedKey: 'nestedValue'
        },
        key3: ['value1', 'value2'],
        empty: null
      }
    }
    const config: Config = {}
    const result = Node.generate(config, httpRequest)
    expect(result).toBe(
      `
const http = require("http");

const options = {
  method: "POST",
  hostname: "example.com",
  path: "/",
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

req.write({
  "key1": "value1",
  "key2": {
    "nestedKey": "nestedValue"
  },
  "key3": [
    "value1",
    "value2"
  ],
  "empty": null
});
req.end();
    `.trim()
    )
  })

  test('should build a POST request with text/plain body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com/log',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Log message content'
    }
    const config: Config = {}
    const result = Node.generate(config, httpRequest)
    expect(result).toBe(
      `
const http = require("http");

const options = {
  method: "POST",
  hostname: "example.com",
  path: "/log",
  headers: {
    "Content-Type": "text/plain",
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

req.write("Log message content");
req.end();
    `.trim()
    )
  })

  test('should build a POST request with XML body', () => {
    const httpRequest: Http = {
      method: 'POST',
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: '<record><item>value</item></record>'
    }
    const config: Config = {}
    const result = Node.generate(config, httpRequest)
    expect(result).toBe(
      `
const http = require("http");

const options = {
  method: "POST",
  hostname: "example.com",
  path: "/",
  headers: {
    "Content-Type": "application/xml",
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

req.write("<record><item>value</item></record>");
req.end();
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
    const result = Node.generate(config, httpRequest)
    expect(result).toBe(
      `
const http = require("http");

const options = {
  method: "GET",
  hostname: "example.com",
  path: "/?address.zip=66031&address.country=Wallis",
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

  test('should build a GET request with array URL parameters', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com',
      params: {
        tags: ['node', 'http'],
        category: 'backend'
      }
    }
    const config: Config = {}
    const result = Node.generate(config, httpRequest)
    expect(result).toContain('path: "/?tags=node&tags=http&category=backend",')
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
    const result = Node.generate(config, httpRequest)
    expect(result).toContain('path: "/?version=1.0",')
    expect(result).toContain('"name": "John"')
  })
})
