const f = [];
function F() {
  return f;
}
function D() {
  return f.map((i) => i.language).filter((i, n, e) => e.indexOf(i) === n);
}
function $(i, n) {
  if (i === "" || i === void 0)
    return null;
  const e = f.filter((t) => t.language.toLowerCase() === i.toLowerCase());
  if (e.length === 0)
    return null;
  const o = e.find((t) => t.default) || e[0];
  if (!n)
    return o;
  const r = e.find((t) => t.client.toLowerCase() === n.toLowerCase());
  return r || o;
}
function M(i, n) {
  const e = $(i, n);
  e && (e.default = !0);
}
function d(i) {
  if (!i)
    return new Error("Client is required");
  if (Array.isArray(i))
    return i.forEach((o) => d(o)), null;
  const n = f.filter((o) => o.language.toLowerCase() === i.language.toLowerCase()), e = n.find((o) => o.client.toLowerCase() === i.client.toLowerCase());
  if (i.default === void 0 && (i.default = n.length === 0), e) {
    const o = f.indexOf(i);
    return f[o] = i, null;
  }
  return f.push(i), null;
}
function J() {
  f.splice(0, f.length);
}
function G(i) {
  let n = b(i);
  if (n)
    return { error: n.message };
  i.config = g(i.config), i.language || (i.language = "javascript");
  const e = $(i.language, i.client);
  if (!e)
    return { error: "Client not found" };
  const o = e.generate(i.config, i.http);
  return {
    language: e.language,
    client: e.client,
    code: o
  };
}
function b(i) {
  if (!i)
    return new Error("Request is required");
  if (!i.http)
    return new Error("http is required");
  if (!i.http.method)
    return new Error("http.method is required");
  if (!i.http.url)
    return new Error("http.url is required");
}
function g(i) {
  return i = i || {}, i.indent || (i.indent = "  "), i.join || (i.join = `
`), i.handleErrors === void 0 && (i.handleErrors = !1), i;
}
class u {
  constructor(n = {}) {
    this.code = [], this.currentDepth = 0, this.jsonConfig = {
      objOpen: "{",
      objClose: "}",
      arrOpen: "[",
      arrClose: "]",
      separator: ": ",
      endComma: !1
    }, this.indentChar = n.indent || "  ", this.lineJoin = n.join || `
`, this.jsonConfig = n.json || this.jsonConfig;
  }
  getIndent() {
    return this.indentChar;
  }
  getJoin() {
    return this.lineJoin;
  }
  line(n = "") {
    this.code.push({ depth: n === "" ? 0 : this.currentDepth, line: n });
  }
  append(n) {
    this.code.length > 0 ? this.code[this.code.length - 1].line += n : this.line(n);
  }
  json(n, e = !1) {
    if (!n) {
      this.append("null");
      return;
    }
    switch (typeof n) {
      case "object":
        if (Array.isArray(n))
          this.append(this.jsonConfig.arrOpen), this.indent(), n.forEach((o, r) => {
            this.json(o, typeof n == "object" || Array.isArray(n)), (r < n.length - 1 || this.jsonConfig.endComma) && this.append(",");
          }), this.outdent(), this.line(this.jsonConfig.arrClose);
        else {
          this.append(this.jsonConfig.objOpen), this.indent();
          const o = Object.keys(n);
          o.forEach((r, t) => {
            this.line(`"${r}"` + this.jsonConfig.separator), this.json(n[r], typeof r == "object" || Array.isArray(r)), (t < o.length - 1 || this.jsonConfig.endComma) && this.append(",");
          }), this.outdent(), this.line(this.jsonConfig.objClose);
        }
        break;
      case "string":
        e ? this.line(`"${n}"`) : this.append(`"${n}"`);
        break;
      default:
        e ? this.line(String(n)) : this.append(String(n));
        break;
    }
  }
  indent() {
    this.currentDepth += 1;
  }
  outdent() {
    this.currentDepth > 0 && (this.currentDepth -= 1);
  }
  output() {
    return this.code.map(({ depth: n, line: e }) => `${this.indentChar.repeat(n)}${e}`).join(this.lineJoin).trimEnd();
  }
}
function j(i) {
  let n, e, o, r, t;
  try {
    const l = new URL(i);
    n = l.hostname, e = l.pathname, t = l.search, o = l.port ? parseInt(l.port) : l.protocol === "https:" ? 443 : 80, r = l.protocol;
  } catch {
    const s = i.split("/");
    n = s[0];
    const a = "/" + s.slice(1).join("/"), [c, h] = a.split("?");
    e = c, t = h ? "?" + h : "", o = 80, r = "http:";
  }
  return e.startsWith("/") || (e = "/" + e), { hostname: n, path: e, port: o, protocol: r, params: t };
}
function k(i, n) {
  return i.toUpperCase() === "POST" && n !== void 0 && Object.keys(n).some(
    (e) => e.toLowerCase() === "content-type" && n[e].toLowerCase() === "application/json"
  );
}
const C = {
  default: !0,
  language: "c",
  client: "libcurl",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("#include <stdio.h>"), e.line("#include <curl/curl.h>"), e.line(), e.line("int main(void) {"), e.indent(), e.line("CURL *curl;"), e.line("CURLcode res;"), e.line(), e.line("curl_global_init(CURL_GLOBAL_DEFAULT);"), e.line("curl = curl_easy_init();"), e.line("if(curl) {"), e.indent(), e.line(`curl_easy_setopt(curl, CURLOPT_URL, "${n.url}");`), n.method.toUpperCase() === "POST" ? e.line("curl_easy_setopt(curl, CURLOPT_POST, 1L);") : n.method.toUpperCase() !== "GET" && e.line(`curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${n.method.toUpperCase()}");`), n.headers && Object.keys(n.headers).length > 0) {
      e.line(), e.line("struct curl_slist *headers = NULL;");
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((t) => e.line(`headers = curl_slist_append(headers, "${o}: ${t}");`)) : e.line(`headers = curl_slist_append(headers, "${o}: ${r}");`);
      e.line("curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);");
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      e.line();
      const o = Object.entries(n.cookies).map(([r, t]) => `${r}=${t}`).join("; ");
      e.line(`curl_easy_setopt(curl, CURLOPT_COOKIE, "${o}");`);
    }
    return n.body && (e.line(), e.line('curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"('), e.json(n.body), e.append(')");')), e.line(), e.line("res = curl_easy_perform(curl);"), e.line("if(res != CURLE_OK)"), e.indent(), e.line('fprintf(stderr, "failed: %s", curl_easy_strerror(res));'), e.outdent(), n.headers && Object.keys(n.headers).length > 0 && e.line("curl_slist_free_all(headers);"), e.line("curl_easy_cleanup(curl);"), e.outdent(), e.line("}"), e.line(), e.line("curl_global_cleanup();"), e.line("return 0;"), e.outdent(), e.line("}"), e.output();
  }
}, m = {
  default: !0,
  language: "csharp",
  client: "http",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("using System;"), e.line("using System.Net.Http;"), e.line("using System.Threading.Tasks;"), e.line(), e.line("namespace HttpClientExample"), e.line("{"), e.indent(), e.line("class Program"), e.line("{"), e.indent(), e.line("static async Task Main(string[] args)"), e.line("{"), e.indent(), e.line("using (HttpClient client = new HttpClient())"), e.line("{"), e.indent(), e.line(
      `HttpRequestMessage request = new HttpRequestMessage(HttpMethod.${n.method.toUpperCase()}, "${n.url}");`
    ), n.headers && Object.keys(n.headers).length > 0) {
      e.line();
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((t) => e.line(`request.Headers.Add("${o}", "${t}");`)) : e.line(`request.Headers.Add("${o}", "${r}");`);
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      e.line();
      const o = Object.entries(n.cookies).map(([r, t]) => `${r}=${t}`).join("; ");
      e.line(`request.Headers.Add("Cookie", "${o}");`);
    }
    return n.body && (e.line(), e.line("request.Content = new StringContent("), e.json(n.body), e.append(', System.Text.Encoding.UTF8, "application/json");')), e.line(), e.line("HttpResponseMessage response = await client.SendAsync(request);"), e.line("response.EnsureSuccessStatusCode();"), e.line("string responseBody = await response.Content.ReadAsStringAsync();"), e.line("Console.WriteLine(responseBody);"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, O = {
  language: "csharp",
  client: "restsharp",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("using RestSharp;"), e.line(), e.line("namespace RestSharpExample"), e.line("{"), e.indent(), e.line("class Program"), e.line("{"), e.indent(), e.line("static void Main(string[] args)"), e.line("{"), e.indent(), e.line(`var client = new RestClient("${n.url}");`), e.line(`var request = new RestRequest(Method.${n.method.toUpperCase()});`), n.headers && Object.keys(n.headers).length > 0) {
      e.line();
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((t) => e.line(`request.AddHeader("${o}", "${t}");`)) : e.line(`request.AddHeader("${o}", "${r}");`);
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      e.line();
      const o = Object.entries(n.cookies).map(([r, t]) => `${r}=${t}`).join("; ");
      e.line(`request.AddHeader("Cookie", "${o}");`);
    }
    return n.body && (e.line(), e.line("request.AddJsonBody("), e.json(n.body), e.append(");")), e.line(), e.line("IRestResponse response = client.Execute(request);"), e.line("Console.WriteLine(response.Content);"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, w = {
  default: !0,
  language: "go",
  client: "http",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`,
      json: {
        objOpen: "map[string]any{",
        objClose: "}",
        arrOpen: "[]any{",
        arrClose: "}",
        separator: ": ",
        endComma: !1
      }
    }), o = k(n.method, n.headers) && n.body;
    e.line("package main"), e.line(), e.line("import ("), e.indent(), e.line('"fmt"'), e.line('"net/http"'), e.line('"io"'), o && (e.line('"bytes"'), e.line('"encoding/json"')), i.handleErrors && e.line('"log"'), e.outdent(), e.line(")"), e.line(), e.line("func main() {"), e.indent(), e.line(`url := "${n.url}"`), e.line();
    let r = "nil";
    if (o && (e.line("jsonBodyMap := "), e.json(n.body), i.handleErrors ? (e.line("jsonBodyBytes, err := json.Marshal(jsonBodyMap)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("jsonBodyBytes, _ := json.Marshal(jsonBodyMap)"), r = "bytes.NewBuffer(jsonBodyBytes)", e.line()), i.handleErrors ? (e.line(`req, err := http.NewRequest("${n.method.toUpperCase()}", url, ${r})`), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}"), e.line()) : (e.line(`req, _ := http.NewRequest("${n.method.toUpperCase()}", url, ${r})`), e.line()), n.headers) {
      for (const [t, l] of Object.entries(n.headers))
        if (Array.isArray(l))
          for (const s of l)
            e.line(`req.Header.Add("${t}", "${s}")`);
        else
          e.line(`req.Header.Set("${t}", "${l}")`);
      e.line();
    }
    if (n.cookies) {
      for (const [t, l] of Object.entries(n.cookies))
        if (Array.isArray(l))
          for (const s of l)
            e.line(`req.AddCookie(&http.Cookie{Name: "${t}", Value: "${s}"})`);
        else
          e.line(`req.AddCookie(&http.Cookie{Name: "${t}", Value: "${l}"})`);
      e.line();
    }
    return i.handleErrors ? (e.line("resp, err := http.DefaultClient.Do(req)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("resp, _ := http.DefaultClient.Do(req)"), e.line("defer resp.Body.Close()"), e.line(), i.handleErrors ? (e.line("body, err := io.ReadAll(resp.Body)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("body, _ := io.ReadAll(resp.Body)"), e.line(), e.line("fmt.Println(string(body))"), e.outdent(), e.line("}"), e.output();
  }
}, q = {
  default: !0,
  language: "javascript",
  client: "fetch",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line('fetch("' + n.url + '", {'), e.indent(), e.line(`method: "${n.method.toUpperCase()}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? e.line(`"${o}": "${r.join(", ")}",`) : e.line(`"${o}": "${r}",`);
      e.outdent(), e.line("},");
    }
    return n.body && (e.line("body: "), e.json(n.body)), e.outdent(), e.line("})"), i.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("if (!response.ok) {"), e.indent(), e.line('throw new Error("Network response was not ok");'), e.outdent(), e.line("}"), e.line("return response.text();"), e.outdent(), e.line("})"), e.line(".then(data => console.log(data))"), e.line('.catch(error => console.error("There was a problem with the fetch operation:", error));')) : (e.line(".then(response => response.text())"), e.line(".then(data => console.log(data));")), e.output();
  }
}, R = {
  language: "javascript",
  client: "axios",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("axios({"), e.indent(), e.line(`method: "${n.method.toLowerCase()}",`), e.line(`url: "${n.url}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? e.line(`"${o}": "${r.join(", ")}",`) : e.line(`"${o}": "${r}",`);
      e.outdent(), e.line("},");
    }
    if (n.cookies) {
      e.line("cookies: {"), e.indent();
      for (const [o, r] of Object.entries(n.cookies))
        e.line(`"${o}": "${r}",`);
      e.outdent(), e.line("},");
    }
    return n.body && (e.line("data: "), e.json(n.body)), e.outdent(), e.line("})"), i.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("console.log(response.data);"), e.outdent(), e.line("})"), e.line(".catch(error => {"), e.indent(), e.line('console.error("There was an error:", error);'), e.outdent(), e.line("});")) : e.line(".then(response => console.log(response.data));"), e.output();
  }
}, A = {
  language: "javascript",
  client: "jquery",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("$.ajax({"), e.indent(), e.line(`url: "${n.url}",`), e.line(`type: "${n.method.toUpperCase()}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? e.line(`"${o}": "${r.join(", ")}",`) : e.line(`"${o}": "${r}",`);
      e.outdent(), e.line("},");
    }
    return n.body && (e.line("data: "), e.json(n.body), e.append(","), e.line('contentType: "application/json",')), e.line("success: function(data) {"), e.indent(), e.line("console.log(data);"), e.outdent(), e.line("},"), i.handleErrors && (e.line("error: function(jqXHR, textStatus, errorThrown) {"), e.indent(), e.line('console.error("Request failed:", textStatus, errorThrown);'), e.outdent(), e.line("},")), e.outdent(), e.line("});"), e.output();
  }
}, T = {
  language: "node",
  client: "http",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    e.line('const http = require("http");'), e.line();
    const { hostname: o, path: r, port: t, protocol: l } = j(n.url);
    if (e.line("const options = {"), e.indent(), e.line(`method: "${n.method.toUpperCase()}",`), e.line(`hostname: "${o}",`), e.line(`path: "${r}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [s, a] of Object.entries(n.headers))
        Array.isArray(a) ? e.line(`"${s}": "${a.join(", ")}",`) : e.line(`"${s}": "${a}",`);
      e.outdent(), e.line("},");
    }
    return e.outdent(), e.line("};"), e.line(), e.line("const req = http.request(options, (res) => {"), e.indent(), e.line('let data = "";'), e.line(), e.line('res.on("data", (chunk) => {'), e.indent(), e.line("data += chunk;"), e.outdent(), e.line("});"), e.line(), e.line('res.on("end", () => {'), e.indent(), e.line("console.log(data);"), e.outdent(), e.line("});"), e.outdent(), e.line("});"), i.handleErrors && (e.line(), e.line('req.on("error", (error) => {'), e.indent(), e.line("console.error(error);"), e.outdent(), e.line("});")), e.line(), n.body && (e.line("req.write("), e.json(n.body), e.append(");")), e.line("req.end();"), e.output();
  }
}, E = {
  language: "node",
  client: "fetch",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line('const fetch = require("node-fetch");'), e.line(), e.line('fetch("' + n.url + '", {'), e.indent(), e.line('method: "' + n.method.toUpperCase() + '",'), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? e.line(`"${o}": "${r.join(", ")}",`) : e.line(`"${o}": "${r}",`);
      e.outdent(), e.line("},");
    }
    return n.body && (e.line("body: "), e.json(n.body)), e.outdent(), e.line("})"), i.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("if (!response.ok) {"), e.indent(), e.line('throw new Error("response not ok");'), e.outdent(), e.line("}"), e.line("return response.text();"), e.outdent(), e.line("})"), e.line(".then(data => console.log(data))"), e.line('.catch(error => console.error("error:", error));')) : (e.line(".then(response => response.text())"), e.line(".then(data => console.log(data))")), e.output();
  }
}, _ = {
  default: !0,
  language: "php",
  client: "curl",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("<?php"), e.line(), e.line("$ch = curl_init();"), e.line(), e.line(`curl_setopt($ch, CURLOPT_URL, "${n.url}");`), e.line("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);"), e.line(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${n.method.toUpperCase()}");`), n.headers) {
      e.line(), e.line("$headers = [];");
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((t) => e.line(`$headers[] = "${o}: ${t}";`)) : e.line(`$headers[] = "${o}: ${r}";`);
      e.line("curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);");
    }
    if (n.cookies) {
      e.line(), e.line("$cookies = [];");
      for (const [o, r] of Object.entries(n.cookies))
        e.line(`$cookies[] = "${o}=${r}";`);
      e.line('curl_setopt($ch, CURLOPT_COOKIE, implode("; ", $cookies));');
    }
    return n.body && (e.line(), e.line("curl_setopt($ch, CURLOPT_POSTFIELDS,"), e.line("<<<JSON"), e.line(), e.json(n.body), e.line("JSON"), e.line(");"), e.outdent()), e.line(), e.line("$response = curl_exec($ch);"), i.handleErrors && (e.line("if (curl_errno($ch)) {"), e.indent(), e.line('echo "Error: " . curl_error($ch);'), e.outdent(), e.line("}")), e.line("curl_close($ch);"), e.line(), e.line("echo $response;"), e.output();
  }
}, U = {
  language: "php",
  client: "guzzle",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`,
      json: {
        objOpen: "[",
        objClose: "]",
        arrOpen: "[",
        arrClose: "]",
        separator: " => ",
        endComma: !0
      }
    });
    if (e.line("<?php"), e.line(), e.line("require 'vendor/autoload.php';"), e.line(), e.line("use GuzzleHttp\\Client;"), e.line(), e.line("$client = new Client();"), e.line("$response = $client->request("), e.indent(), e.line('"' + n.method.toUpperCase() + '",'), e.line('"' + n.url + '",'), n.headers || n.cookies || n.body) {
      if (e.line("["), n.headers) {
        e.indent(), e.line('"headers" => ['), e.indent();
        for (const [o, r] of Object.entries(n.headers))
          Array.isArray(r) ? r.forEach((t) => e.line(`"${o}" => "${t}",`)) : e.line(`"${o}" => "${r}",`);
        e.outdent(), e.line("],"), e.outdent();
      }
      if (n.cookies) {
        e.indent(), e.line('"cookies" => ['), e.indent();
        for (const [o, r] of Object.entries(n.cookies))
          e.line(`"${o}" => "${r}",`);
        e.outdent(), e.line("],"), e.outdent();
      }
      n.body && (e.indent(), e.line('"json" => '), e.json(n.body), e.append(","), e.outdent()), e.line("],");
    }
    return e.outdent(), e.line(");"), e.line(), e.line("echo $response->getBody();"), e.output();
  }
}, P = {
  default: !0,
  language: "python",
  client: "http",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    }), o = n.method.toUpperCase(), r = o !== "GET" && n.body, t = n.headers && Object.keys(n.headers).length > 0, l = n.cookies && Object.keys(n.cookies).length > 0;
    let s = [];
    e.line("import http.client"), e.line("import json"), e.line();
    const { hostname: a, path: c, port: h, protocol: N } = j(n.url);
    if (e.line(`conn = http.client.HTTPSConnection("${a}", ${h})`), t) {
      e.line(), s.push("headers"), e.line("headers = {"), e.indent();
      for (const [p, y] of Object.entries(n.headers))
        Array.isArray(y) ? e.line(`"${p}": "${y.join(", ")}",`) : e.line(`"${p}": "${y}",`);
      e.outdent(), e.line("}");
    }
    if (l) {
      e.line(), s.push("cookies"), e.line("cookies = {"), e.indent();
      for (const [p, y] of Object.entries(n.cookies))
        e.line(`"${p}": "${y}",`);
      e.outdent(), e.line("}");
    }
    return r && (e.line(), s.push("payload"), e.line("payload = "), e.json(n.body)), e.line(), e.line(`conn.request("${o}", "${c}"` + (s.length > 0 ? `, ${s.join(", ")}` : "") + ")"), e.line("res = conn.getresponse()"), e.line("data = res.read()"), e.line(), e.line('print(data.decode("utf-8"))'), e.output();
  }
}, L = {
  language: "python",
  client: "requests",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    }), r = n.method.toUpperCase() !== "GET" && n.body, t = n.headers && Object.keys(n.headers).length > 0, l = n.cookies && Object.keys(n.cookies).length > 0;
    let s = [];
    if (e.line("import requests"), e.line(), e.line('url = "' + n.url + '"'), t) {
      e.line(), s.push("headers=headers"), e.line("headers = {"), e.indent();
      for (const [a, c] of Object.entries(n.headers))
        e.line(`"${a}": "${c}"`), Object.keys(n.headers).indexOf(a) !== Object.keys(n.headers).length - 1 && e.append(",");
      e.outdent(), e.line("}");
    }
    if (l) {
      e.line(), s.push("cookies=cookies"), e.line("cookies = {"), e.indent();
      for (const [a, c] of Object.entries(n.cookies))
        e.line(`"${a}": "${c}"`), Object.keys(n.cookies).indexOf(a) !== Object.keys(n.cookies).length - 1 && e.append(",");
      e.outdent(), e.line("}");
    }
    return r && (e.line(), s.push("data=data"), e.line("data = "), e.json(n.body)), e.line(), e.line(
      "response = requests." + n.method.toLowerCase() + "(url" + (s.length > 0 ? `, ${s.join(", ")}` : "") + ")"
    ), e.line("print(response.text)"), e.output();
  }
}, S = {
  default: !0,
  language: "ruby",
  client: "nethttp",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line('require "net/http"'), e.line('require "uri"'), e.line(), e.line('uri = URI.parse("' + n.url + '")'), n.method.toUpperCase() === "GET" ? e.line("request = Net::HTTP::Get.new(uri)") : n.method.toUpperCase() === "POST" ? e.line("request = Net::HTTP::Post.new(uri)") : n.method.toUpperCase() === "PUT" ? e.line("request = Net::HTTP::Put.new(uri)") : n.method.toUpperCase() === "DELETE" ? e.line("request = Net::HTTP::Delete.new(uri)") : e.line('request = Net::HTTP::GenericRequest.new("' + n.method.toUpperCase() + '", uri.path, nil, nil)'), n.headers && Object.keys(n.headers).length > 0)
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((t) => e.line(`request["${o}"] = "${t}"`)) : e.line(`request["${o}"] = "${r}"`);
    if (n.cookies && Object.keys(n.cookies).length > 0)
      for (const [o, r] of Object.entries(n.cookies))
        e.line(`request["Cookie"] = "${o}=${r}"`);
    return n.body && (e.line("request.body = "), e.json(n.body)), e.line(), e.line('response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|'), e.indent(), e.line("http.request(request)"), e.outdent(), e.line("end"), e.line(), e.line("puts response.body"), e.output();
  }
}, v = {
  language: "ruby",
  client: "faraday",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line('require "faraday"'), e.line(), e.line('conn = Faraday.new(url: "' + n.url + '") do |f|'), e.indent(), e.line("f.adapter Faraday.default_adapter"), e.outdent(), e.line("end"), e.line(), e.line("response = conn." + n.method.toLowerCase() + " do |req|"), e.indent(), e.line('req.url "' + n.url + '"'), n.headers) {
      e.line();
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((t) => e.line(`req.headers["${o}"] = "${t}"`)) : e.line(`req.headers["${o}"] = "${r}"`);
    }
    if (n.cookies) {
      e.line();
      for (const [o, r] of Object.entries(n.cookies))
        e.line(`req.headers["Cookie"] = "${o}=${r}"`);
    }
    return n.body && (e.line(), e.line("req.body = "), e.json(n.body)), e.outdent(), e.line("end"), e.line(), e.line("puts response.body"), e.output();
  }
}, H = {
  language: "rust",
  client: "reqwest",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("use reqwest::blocking::Client;"), e.line("use std::error::Error;"), e.line(), e.line("fn main() -> Result<(), Box<dyn Error>> {"), e.indent(), e.line("let client = Client::new();"), e.line(), e.line("let res = client.request(reqwest::Method::" + n.method.toUpperCase() + ', "' + n.url + '")'), e.indent(), n.headers)
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((t) => e.line(`.header("${o}", "${t}")`)) : e.line(`.header("${o}", "${r}")`);
    if (n.cookies)
      for (const [o, r] of Object.entries(n.cookies))
        Array.isArray(r) ? r.forEach((t) => e.line(`.cookie("${o}", "${t}")`)) : e.line(`.cookie("${o}", "${r}")`);
    return n.body && (e.line(".body("), e.json(n.body), e.append(")")), e.line(".send()?;"), e.outdent(), e.line(), i.handleErrors ? (e.line("if res.status().is_success() {"), e.indent(), e.line('println!("{}", res.text()?);'), e.outdent(), e.line("} else {"), e.indent(), e.line('eprintln!("Request failed with status: {}", res.status());'), e.outdent(), e.line("}")) : e.line('println!("{}", res.text()?);'), e.line("Ok(())"), e.outdent(), e.line("}"), e.output();
  }
}, x = {
  default: !0,
  language: "shell",
  client: "curl",
  generate(i, n) {
    var r, t;
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || ` \\
`
    });
    if (e.line(`curl -X ${n.method} "${n.url}"`), e.indent(), n.headers)
      for (const [l, s] of Object.entries(n.headers))
        if (Array.isArray(s))
          for (const a of s)
            e.line(`-H "${l}: ${a.replace(/"/g, '\\"')}"`);
        else
          e.line(`-H "${l}: ${s.replace(/"/g, '\\"')}"`);
    if (n.cookies) {
      const l = Object.entries(n.cookies).flatMap(([s, a]) => Array.isArray(a) ? a.map((c) => `${s}=${c}`) : `${s}=${a}`).join("; ");
      e.line(`-b "${l}"`);
    }
    if (n.body) {
      const l = ((r = n.headers) == null ? void 0 : r["content-type"]) || ((t = n.headers) == null ? void 0 : t["Content-Type"]) || "application/json";
      if (l.includes("application/json"))
        e.line("-d $'"), e.json(n.body), e.append("'");
      else if (l === "application/x-www-form-urlencoded") {
        const s = new URLSearchParams(n.body).toString().replace(/'/g, "'\\''");
        e.line(`-d '${s}'`);
      } else if (typeof n.body == "string") {
        const s = n.body.replace(/'/g, "'\\''");
        e.line(`-d '${s}'`);
      }
    }
    let o = e.output();
    return o = o.replace(/\\\s*$/, "").trim(), o;
  }
}, B = {
  default: !0,
  language: "swift",
  client: "nsurlsession",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("import Foundation"), e.line(), e.line('let url = URL(string: "' + n.url + '")!'), e.line("var request = URLRequest(url: url)"), e.line('request.httpMethod = "' + n.method.toUpperCase() + '"'), n.headers && Object.keys(n.headers).length > 0) {
      e.line();
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((t) => e.line(`request.addValue("${t}", forHTTPHeaderField: "${o}")`)) : e.line(`request.addValue("${r}", forHTTPHeaderField: "${o}")`);
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      e.line();
      for (const [o, r] of Object.entries(n.cookies))
        e.line(`request.addValue("${o}=${r}", forHTTPHeaderField: "Cookie")`);
    }
    return n.body && (e.line(), e.line("let body = "), e.json(n.body), e.line("request.httpBody = body")), e.line(), e.line("let task = URLSession.shared.dataTask(with: request) { data, response, error in"), e.indent(), e.line("if let error = error {"), e.indent(), e.line('print("Error: \\(error)")'), e.line("return"), e.outdent(), e.line("}"), e.line(), e.line("if let httpResponse = response as? HTTPURLResponse {"), e.indent(), e.line("if httpResponse.statusCode == 200, let data = data {"), e.indent(), e.line("let responseString = String(data: data, encoding: .utf8)"), e.line('print(responseString ?? "No response data")'), e.outdent(), e.line("} else {"), e.indent(), e.line('print("Request failed with status code: \\(httpResponse.statusCode)")'), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.line(), e.line("task.resume()"), e.output();
  }
};
d(C);
d(m);
d(O);
d(w);
d(q);
d(R);
d(A);
d(T);
d(E);
d(_);
d(U);
d(P);
d(L);
d(S);
d(v);
d(H);
d(x);
d(B);
export {
  u as Builder,
  J as ClearRegistry,
  F as Clients,
  G as Generate,
  k as IsJsonRequest,
  D as Languages,
  d as Register,
  $ as Search,
  M as SetDefault
};
