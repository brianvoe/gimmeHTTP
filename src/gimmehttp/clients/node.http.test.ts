import NodeHttp from './node.http'
import { Config, Http } from '../utils/generate'
import { describe, expect, test } from 'vitest'

describe('NodeHttp.generate', () => {
  test('should build a basic GET request', () => {
    const httpRequest: Http = {
      method: 'GET',
      url: 'https://example.com'
    }
    const config: Config = {}
    const result = NodeHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
const transport = require("https");

const options = {
  method: "GET",
  hostname: "example.com",
  port: 443,
  path: "/",
};

const req = transport.request(options, (res) => {
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
    const result = NodeHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
const transport = require("https");

const options = {
  method: "POST",
  hostname: "example.com",
  port: 443,
  path: "/",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token",
  },
};

const req = transport.request(options, (res) => {
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
    const config: Config = {
      handleErrors: true
    }
    const result = NodeHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
const transport = require("https");

const payload = JSON.stringify({
  "key1": "value1"
});

const options = {
  method: "POST",
  hostname: "example.com",
  port: 443,
  path: "/",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  },
};

const req = transport.request(options, (res) => {
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

req.write(payload);
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
    const result = NodeHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
const transport = require("https");

const payload = JSON.stringify({
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

const options = {
  method: "POST",
  hostname: "example.com",
  port: 443,
  path: "/",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  },
};

const req = transport.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(data);
  });
});

req.write(payload);
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
    const result = NodeHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
const transport = require("https");

const payload = "Log message content";

const options = {
  method: "POST",
  hostname: "example.com",
  port: 443,
  path: "/log",
  headers: {
    "Content-Type": "text/plain",
    "Content-Length": Buffer.byteLength(payload),
  },
};

const req = transport.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(data);
  });
});

req.write(payload);
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
    const result = NodeHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
const transport = require("https");

const payload = "<record><item>value</item></record>";

const options = {
  method: "POST",
  hostname: "example.com",
  port: 443,
  path: "/",
  headers: {
    "Content-Type": "application/xml",
    "Content-Length": Buffer.byteLength(payload),
  },
};

const req = transport.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(data);
  });
});

req.write(payload);
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
    const result = NodeHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
const transport = require("https");

const options = {
  method: "GET",
  hostname: "example.com",
  port: 443,
  path: "/?address.zip=66031&address.country=Wallis",
};

const req = transport.request(options, (res) => {
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
    const result = NodeHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
const transport = require("https");

const options = {
  method: "GET",
  hostname: "example.com",
  port: 443,
  path: "/?tags=node&tags=http&category=backend",
};

const req = transport.request(options, (res) => {
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
    const result = NodeHttp.generate(config, httpRequest)
    expect(result).toBe(
      `
const transport = require("https");

const payload = JSON.stringify({
  "name": "John"
});

const options = {
  method: "POST",
  hostname: "example.com",
  port: 443,
  path: "/?version=1.0",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  },
};

const req = transport.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(data);
  });
});

req.write(payload);
req.end();
    `.trim()
    )
  })
})
