const f = [];
function X() {
  return f;
}
function Y() {
  return f.map((t) => t.language).filter((t, n, e) => e.indexOf(t) === n);
}
function p(t, n) {
  if (t === "" || t === void 0)
    return new Error("Language is required");
  const e = f.filter((r) => r.language.toLowerCase() === t.toLowerCase());
  if (e.length === 0)
    return new Error("No client found for " + t);
  const i = e.find((r) => r.default) || e[0];
  if (!n)
    return i;
  const o = e.find((r) => r.client.toLowerCase() === n.toLowerCase());
  return o || i;
}
function Z(t, n) {
  const e = p(t, n);
  if (e instanceof Error)
    return e;
  e.default = !0;
}
function a(t) {
  if (!t)
    return new Error("Client is required");
  if (Array.isArray(t)) {
    t.forEach((i) => a(i));
    return;
  }
  const n = f.filter((i) => i.language.toLowerCase() === t.language.toLowerCase()), e = n.find((i) => i.client.toLowerCase() === t.client.toLowerCase());
  if (t.default === void 0 && (t.default = n.length === 0), e) {
    const i = f.indexOf(t);
    f[i] = t;
    return;
  }
  f.push(t);
}
function ee() {
  f.splice(0, f.length);
}
function ne(t) {
  let n = g(t);
  if (n)
    return { error: n.message };
  t.config = j(t.config);
  const e = p(t.language, t.client);
  if (e instanceof Error)
    return { error: e.message };
  const i = e.generate(t.config, t.http);
  return {
    language: e.language,
    client: e.client,
    code: i
  };
}
function g(t) {
  if (!t)
    return new Error("Request is required");
  if (!t.language)
    return new Error("language is required");
  if (!t.http)
    return new Error("http is required");
  if (!t.http.method)
    return new Error("http.method is required");
  if (!t.http.url)
    return new Error("http.url is required");
}
function j(t) {
  return t = t || {}, t.indent || (t.indent = "  "), t.join || (t.join = `
`), t.handleErrors === void 0 && (t.handleErrors = !1), t;
}
class d {
  constructor(n = {}) {
    this.code = [], this.currentDepth = 0, this.indentChar = n.indent || "  ", this.lineJoin = n.join || `
`;
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
    this.code.length > 0 && (this.code[this.code.length - 1].line += n);
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
function m(t, n) {
  return t.toUpperCase() === "POST" && n !== void 0 && Object.keys(n).some(
    (e) => e.toLowerCase() === "content-type" && n[e].toLowerCase() === "application/json"
  );
}
const k = {
  default: !0,
  language: "c",
  client: "libcurl",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line("#include <stdio.h>"), e.line("#include <curl/curl.h>"), e.line(), e.line("int main(void) {"), e.indent(), e.line("CURL *curl;"), e.line("CURLcode res;"), e.line(), e.line("curl_global_init(CURL_GLOBAL_DEFAULT);"), e.line("curl = curl_easy_init();"), e.line("if(curl) {"), e.indent(), e.line(`curl_easy_setopt(curl, CURLOPT_URL, "${n.url}");`), n.method.toUpperCase() === "POST" ? e.line("curl_easy_setopt(curl, CURLOPT_POST, 1L);") : n.method.toUpperCase() !== "GET" && e.line(`curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${n.method.toUpperCase()}");`), n.headers && Object.keys(n.headers).length > 0) {
      e.line("struct curl_slist *headers = NULL;");
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? o.forEach((r) => e.line(`headers = curl_slist_append(headers, "${i}: ${r}");`)) : e.line(`headers = curl_slist_append(headers, "${i}: ${o}");`);
      e.line("curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);");
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const i = Object.entries(n.cookies).map(([o, r]) => `${o}=${r}`).join("; ");
      e.line(`curl_easy_setopt(curl, CURLOPT_COOKIE, "${i}");`);
    }
    return n.body && (e.line('curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"('), O(n.body, e), e.append(')");')), e.line("res = curl_easy_perform(curl);"), e.line("if(res != CURLE_OK)"), e.indent(), e.line(`fprintf(stderr, "curl_easy_perform() failed: %s
", curl_easy_strerror(res));`), e.outdent(), n.headers && Object.keys(n.headers).length > 0 && e.line("curl_slist_free_all(headers);"), e.line("curl_easy_cleanup(curl);"), e.outdent(), e.line("}"), e.line("curl_global_cleanup();"), e.line("return 0;"), e.outdent(), e.line("}"), e.output();
  }
};
function O(t, n) {
  const e = JSON.stringify(t, null, 2).split(`
`);
  for (let i = 0; i < e.length; i++) {
    if (i === 0) {
      n.append(`${e[i]}`);
      continue;
    }
    n.line(`${e[i]}`);
  }
}
const C = {
  default: !0,
  language: "csharp",
  client: "http",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line("using System;"), e.line("using System.Net.Http;"), e.line("using System.Threading.Tasks;"), e.line(), e.line("namespace HttpClientExample"), e.line("{"), e.indent(), e.line("class Program"), e.line("{"), e.indent(), e.line("static async Task Main(string[] args)"), e.line("{"), e.indent(), e.line("using (HttpClient client = new HttpClient())"), e.line("{"), e.indent(), e.line(
      `HttpRequestMessage request = new HttpRequestMessage(HttpMethod.${n.method.toUpperCase()}, "${n.url}");`
    ), n.headers && Object.keys(n.headers).length > 0)
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? o.forEach((r) => e.line(`request.Headers.Add("${i}", "${r}");`)) : e.line(`request.Headers.Add("${i}", "${o}");`);
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const i = Object.entries(n.cookies).map(([o, r]) => `${o}=${r}`).join("; ");
      e.line(`request.Headers.Add("Cookie", "${i}");`);
    }
    return n.body && e.line(
      `request.Content = new StringContent("${JSON.stringify(n.body).replace(
        /"/g,
        '"'
      )}", System.Text.Encoding.UTF8, "application/json");`
    ), e.line("HttpResponseMessage response = await client.SendAsync(request);"), e.line("response.EnsureSuccessStatusCode();"), e.line("string responseBody = await response.Content.ReadAsStringAsync();"), e.line("Console.WriteLine(responseBody);"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, w = {
  language: "csharp",
  client: "restsharp",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line("using RestSharp;"), e.line(), e.line("namespace RestSharpExample"), e.line("{"), e.indent(), e.line("class Program"), e.line("{"), e.indent(), e.line("static void Main(string[] args)"), e.line("{"), e.indent(), e.line(`var client = new RestClient("${n.url}");`), e.line(`var request = new RestRequest(Method.${n.method.toUpperCase()});`), n.headers && Object.keys(n.headers).length > 0)
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? o.forEach((r) => e.line(`request.AddHeader("${i}", "${r}");`)) : e.line(`request.AddHeader("${i}", "${o}");`);
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const i = Object.entries(n.cookies).map(([o, r]) => `${o}=${r}`).join("; ");
      e.line(`request.AddHeader("Cookie", "${i}");`);
    }
    return n.body && e.line(`request.AddJsonBody(${JSON.stringify(n.body)});`), e.line("IRestResponse response = client.Execute(request);"), e.line("Console.WriteLine(response.Content);"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, b = {
  default: !0,
  language: "go",
  client: "http",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    }), i = m(n.method, n.headers) && n.body;
    e.line("package main"), e.line(), e.line("import ("), e.indent(), e.line('"fmt"'), e.line('"net/http"'), e.line('"io"'), i && (e.line('"bytes"'), e.line('"encoding/json"')), t.handleErrors && e.line('"log"'), e.outdent(), e.line(")"), e.line(), e.line("func main() {"), e.indent(), e.line(`url := "${n.url}"`), e.line();
    let o = "nil";
    if (i) {
      e.line("jsonBodyMap := map[string]any{"), e.indent();
      for (const [r, l] of Object.entries(n.body))
        e.line(`"${r}": ${JSON.stringify(l)},`);
      e.outdent(), e.line("}"), t.handleErrors ? (e.line("jsonBodyBytes, err := json.Marshal(jsonBodyMap)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("jsonBodyBytes, _ := json.Marshal(jsonBodyMap)"), o = "bytes.NewBuffer(jsonBodyBytes)", e.line();
    }
    if (t.handleErrors ? (e.line(`req, err := http.NewRequest("${n.method.toUpperCase()}", url, ${o})`), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}"), e.line()) : (e.line(`req, _ := http.NewRequest("${n.method.toUpperCase()}", url, ${o})`), e.line()), n.headers) {
      for (const [r, l] of Object.entries(n.headers))
        if (Array.isArray(l))
          for (const s of l)
            e.line(`req.Header.Add("${r}", "${s}")`);
        else
          e.line(`req.Header.Set("${r}", "${l}")`);
      e.line();
    }
    if (n.cookies) {
      for (const [r, l] of Object.entries(n.cookies))
        if (Array.isArray(l))
          for (const s of l)
            e.line(`req.AddCookie(&http.Cookie{Name: "${r}", Value: "${s}"})`);
        else
          e.line(`req.AddCookie(&http.Cookie{Name: "${r}", Value: "${l}"})`);
      e.line();
    }
    return t.handleErrors ? (e.line("resp, err := http.DefaultClient.Do(req)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("resp, _ := http.DefaultClient.Do(req)"), e.line("defer resp.Body.Close()"), e.line(), t.handleErrors ? (e.line("body, err := io.ReadAll(resp.Body)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("body, _ := io.ReadAll(resp.Body)"), e.line(), e.line("fmt.Println(string(body))"), e.outdent(), e.line("}"), e.output();
  }
}, q = {
  default: !0,
  language: "javascript",
  client: "fetch",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line('fetch("' + n.url + '", {'), e.indent(), e.line(`method: "${n.method.toUpperCase()}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? e.line(`"${i}": "${o.join(", ")}",`) : e.line(`"${i}": "${o}",`);
      e.outdent(), e.line("},");
    }
    return n.body && (e.line("body: "), e.indent(), R(n.body, e), e.append(",")), e.outdent(), e.line("})"), t.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("if (!response.ok) {"), e.indent(), e.line('throw new Error("Network response was not ok");'), e.outdent(), e.line("}"), e.line("return response.text();"), e.outdent(), e.line("})"), e.line(".then(data => console.log(data))"), e.line('.catch(error => console.error("There was a problem with the fetch operation:", error));')) : (e.line(".then(response => response.text())"), e.line(".then(data => console.log(data));")), e.output();
  }
};
function R(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`);
  for (let i = 0; i < e.length; i++) {
    const o = e[i].trim();
    if (i === 0) {
      n.append(o);
      continue;
    }
    i === e.length - 1 && n.outdent(), n.line(o);
  }
}
const A = {
  language: "javascript",
  client: "axios",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line("axios({"), e.indent(), e.line(`method: "${n.method.toLowerCase()}",`), e.line(`url: "${n.url}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? e.line(`"${i}": "${o.join(", ")}",`) : e.line(`"${i}": "${o}",`);
      e.outdent(), e.line("},");
    }
    if (n.cookies) {
      e.line("cookies: {"), e.indent();
      for (const [i, o] of Object.entries(n.cookies))
        e.line(`"${i}": "${o}",`);
      e.outdent(), e.line("},");
    }
    return n.body && (e.line("data: "), e.indent(), E(n.body, e), e.append(",")), e.outdent(), e.line("})"), t.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("console.log(response.data);"), e.outdent(), e.line("})"), e.line(".catch(error => {"), e.indent(), e.line('console.error("There was an error:", error);'), e.outdent(), e.line("});")) : e.line(".then(response => console.log(response.data));"), e.output();
  }
};
function E(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`);
  for (let i = 0; i < e.length; i++) {
    const o = e[i].trim();
    if (i === 0) {
      n.append(o);
      continue;
    }
    i === e.length - 1 && n.outdent(), n.line(o);
  }
}
const S = {
  language: "javascript",
  client: "jquery",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line("$.ajax({"), e.indent(), e.line(`url: "${n.url}",`), e.line(`type: "${n.method.toUpperCase()}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? e.line(`"${i}": "${o.join(", ")}",`) : e.line(`"${i}": "${o}",`);
      e.outdent(), e.line("},");
    }
    return n.body && (e.line("data: "), e.indent(), T(n.body, e), e.append(","), e.line('contentType: "application/json",')), e.line("success: function(data) {"), e.indent(), e.line("console.log(data);"), e.outdent(), e.line("},"), t.handleErrors && (e.line("error: function(jqXHR, textStatus, errorThrown) {"), e.indent(), e.line('console.error("Request failed:", textStatus, errorThrown);'), e.outdent(), e.line("},")), e.outdent(), e.line("});"), e.output();
  }
};
function T(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`);
  for (let i = 0; i < e.length; i++) {
    const o = e[i].trim();
    if (i === 0) {
      n.append(o);
      continue;
    }
    i === e.length - 1 && n.outdent(), n.line(o);
  }
}
const _ = {
  language: "node",
  client: "http",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line('const http = require("http");'), e.line(), e.line("const options = {"), e.indent(), e.line(`method: "${n.method.toUpperCase()}",`), e.line(`hostname: "${new URL(n.url).hostname}",`), e.line(`path: "${new URL(n.url).pathname}${new URL(n.url).search}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? e.line(`"${i}": "${o.join(", ")}",`) : e.line(`"${i}": "${o}",`);
      e.outdent(), e.line("},");
    }
    return e.outdent(), e.line("};"), e.line(), e.line("const req = http.request(options, (res) => {"), e.indent(), e.line('let data = "";'), e.line(), e.line('res.on("data", (chunk) => {'), e.indent(), e.line("data += chunk;"), e.outdent(), e.line("});"), e.line(), e.line('res.on("end", () => {'), e.indent(), e.line("console.log(data);"), e.outdent(), e.line("});"), e.outdent(), e.line("});"), t.handleErrors && (e.line(), e.line('req.on("error", (error) => {'), e.indent(), e.line("console.error(error);"), e.outdent(), e.line("});")), e.line(), n.body && (e.line("req.write("), e.indent(), U(n.body, e), e.append(");")), e.line("req.end();"), e.output();
  }
};
function U(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`);
  for (let i = 0; i < e.length; i++) {
    const o = e[i].trim();
    if (i === 0) {
      n.append(o);
      continue;
    }
    i === e.length - 1 && n.outdent(), n.line(o);
  }
}
const L = {
  language: "node",
  client: "fetch",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line('const fetch = require("node-fetch");'), e.line(), e.line('fetch("' + n.url + '", {'), e.indent(), e.line('method: "' + n.method.toUpperCase() + '",'), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? e.line(`"${i}": "${o.join(", ")}",`) : e.line(`"${i}": "${o}",`);
      e.outdent(), e.line("},");
    }
    return n.body && (e.line("body: "), e.indent(), J(n.body, e), e.append(",")), e.outdent(), e.line("})"), t.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("if (!response.ok) {"), e.indent(), e.line('throw new Error("response not ok");'), e.outdent(), e.line("}"), e.line("return response.text();"), e.outdent(), e.line("})"), e.line(".then(data => console.log(data))"), e.line('.catch(error => console.error("error:", error));')) : (e.line(".then(response => response.text())"), e.line(".then(data => console.log(data))")), e.output();
  }
};
function J(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`);
  for (let i = 0; i < e.length; i++) {
    const o = e[i].trim();
    if (i === 0) {
      n.append(o);
      continue;
    }
    i === e.length - 1 && n.outdent(), n.line(o);
  }
}
const N = {
  default: !0,
  language: "php",
  client: "curl",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line("<?php"), e.line(), e.line("$ch = curl_init();"), e.line(), e.line(`curl_setopt($ch, CURLOPT_URL, "${n.url}");`), e.line("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);"), e.line(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${n.method.toUpperCase()}");`), n.headers) {
      e.line(), e.line("$headers = [];");
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? o.forEach((r) => e.line(`$headers[] = "${i}: ${r}";`)) : e.line(`$headers[] = "${i}: ${o}";`);
      e.line("curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);");
    }
    if (n.cookies) {
      e.line(), e.line("$cookies = [];");
      for (const [i, o] of Object.entries(n.cookies))
        e.line(`$cookies[] = "${i}=${o}";`);
      e.line('curl_setopt($ch, CURLOPT_COOKIE, implode("; ", $cookies));');
    }
    return n.body && (e.line(), e.line("curl_setopt($ch, CURLOPT_POSTFIELDS,"), e.line("<<<'JSON'"), $(n.body, e), e.line("JSON"), e.line(");"), e.outdent()), e.line(), e.line("$response = curl_exec($ch);"), t.handleErrors && (e.line("if (curl_errno($ch)) {"), e.indent(), e.line('echo "Error: " . curl_error($ch);'), e.outdent(), e.line("}")), e.line("curl_close($ch);"), e.line(), e.line("echo $response;"), e.output();
  }
};
function $(t, n) {
  if (typeof t == "object" && t !== null)
    if (Array.isArray(t))
      n.line("[" + t.map((e) => JSON.stringify(e)).join(", ") + "]");
    else {
      n.line("{"), n.indent();
      const e = Object.entries(t);
      e.forEach(([i, o], r) => {
        Array.isArray(o) ? n.line(`"${i}": [${o.map((l) => JSON.stringify(l)).join(", ")}]`) : typeof o == "object" && o !== null ? (n.line(`"${i}": {`), n.indent(), $(o, n), n.outdent(), n.line("}")) : n.line(`"${i}": ${JSON.stringify(o)}`), r < e.length - 1 && n.append(",");
      }), n.outdent(), n.line("}");
    }
  else
    n.line(JSON.stringify(t));
}
const P = {
  language: "php",
  client: "guzzle",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line("<?php"), e.line(), e.line("require 'vendor/autoload.php';"), e.line(), e.line("use GuzzleHttp\\Client;"), e.line(), e.line("$client = new Client();"), e.line("$response = $client->request("), e.indent(), e.line('"' + n.method.toUpperCase() + '",'), e.line('"' + n.url + '",'), n.headers || n.cookies || n.body) {
      if (e.line("["), n.headers) {
        e.indent(), e.line('"headers" => ['), e.indent();
        for (const [i, o] of Object.entries(n.headers))
          Array.isArray(o) ? o.forEach((r) => e.line(`"${i}" => "${r}",`)) : e.line(`"${i}" => "${o}",`);
        e.outdent(), e.line("],"), e.outdent();
      }
      if (n.cookies) {
        e.indent(), e.line('"cookies" => ['), e.indent();
        for (const [i, o] of Object.entries(n.cookies))
          e.line(`"${i}" => "${o}",`);
        e.outdent(), e.line("],"), e.outdent();
      }
      n.body && (e.indent(), e.line('"json" => {'), e.indent(), h(n.body, e, !0), e.outdent(), e.line("}"), e.outdent()), e.line("],");
    }
    return e.outdent(), e.line(");"), e.line(), e.line("echo $response->getBody();"), e.output();
  }
};
function h(t, n, e = !1) {
  if (typeof t == "object" && t !== null)
    if (Array.isArray(t))
      n.line("[" + t.map((i) => JSON.stringify(i)).join(", ") + "]");
    else {
      e || (n.line("{"), n.indent());
      const i = Object.entries(t);
      i.forEach(([o, r], l) => {
        Array.isArray(r) ? n.line(`"${o}": [${r.map((s) => JSON.stringify(s)).join(", ")}]`) : typeof r == "object" && r !== null ? (n.line(`"${o}": {`), n.indent(), h(r, n, !0), n.outdent(), n.line("}")) : n.line(`"${o}": ${JSON.stringify(r)}`), l < i.length - 1 && n.append(",");
      }), e || (n.outdent(), n.line("}"));
    }
  else
    n.line(JSON.stringify(t));
}
const H = {
  default: !0,
  language: "python",
  client: "http",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    }), i = n.method.toUpperCase(), o = i !== "GET" && n.body, r = n.headers && Object.keys(n.headers).length > 0, l = n.cookies && Object.keys(n.cookies).length > 0;
    let s = [];
    e.line("import http.client"), e.line("import json"), e.line();
    const u = new URL(n.url);
    if (e.line(
      `conn = http.client.HTTPSConnection("${u.hostname}", ${u.port || (u.protocol === "https:" ? 443 : 80)})`
    ), e.line(), o && (s.push("payload"), e.line("payload = "), e.indent(), v(n.body, e), e.line()), r) {
      s.push("headers"), e.line("headers = {"), e.indent();
      for (const [c, y] of Object.entries(n.headers))
        Array.isArray(y) ? e.line(`"${c}": "${y.join(", ")}",`) : e.line(`"${c}": "${y}",`);
      e.outdent(), e.line("}"), e.line();
    }
    if (l) {
      s.push("cookies"), e.line("cookies = {"), e.indent();
      for (const [c, y] of Object.entries(n.cookies))
        e.line(`"${c}": "${y}",`);
      e.outdent(), e.line("}"), e.line();
    }
    return e.line(
      `conn.request("${i}", "${u.pathname + u.search}"` + (s.length > 0 ? `, ${s.join(", ")}` : "") + ")"
    ), e.line("res = conn.getresponse()"), e.line("data = res.read()"), e.line(), e.line('print(data.decode("utf-8"))'), e.output();
  }
};
function v(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`);
  for (let i = 0; i < e.length; i++) {
    const o = e[i].trim();
    if (i === 0) {
      n.append(o);
      continue;
    }
    i === e.length - 1 && n.outdent(), n.line(o);
  }
}
const B = {
  language: "python",
  client: "requests",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    }), o = n.method.toUpperCase() !== "GET" && n.body, r = n.headers && Object.keys(n.headers).length > 0, l = n.cookies && Object.keys(n.cookies).length > 0;
    let s = [];
    if (e.line("import requests"), e.line(), e.line('url = "' + n.url + '"'), r) {
      s.push("headers=headers"), e.line("headers = {"), e.indent();
      for (const [u, c] of Object.entries(n.headers))
        Array.isArray(c) ? e.line(`"${u}": "${c.join(", ")}",`) : e.line(`"${u}": "${c}",`);
      e.outdent(), e.line("}");
    }
    if (l) {
      s.push("cookies=cookies"), e.line("cookies = {"), e.indent();
      for (const [u, c] of Object.entries(n.cookies))
        e.line(`"${u}": "${c}",`);
      e.outdent(), e.line("}");
    }
    return o && (s.push("data=data"), e.line("data = "), e.indent(), x(n.body, e)), e.line(), e.line(
      "response = requests." + n.method.toLowerCase() + "(url" + (s.length > 0 ? `, ${s.join(", ")}` : "") + ")"
    ), e.line("print(response.text)"), e.output();
  }
};
function x(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`);
  for (let i = 0; i < e.length; i++) {
    const o = e[i].trim();
    if (i === 0) {
      n.append(o);
      continue;
    }
    i === e.length - 1 && n.outdent(), n.line(o);
  }
}
const I = {
  default: !0,
  language: "ruby",
  client: "nethttp",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line('require "net/http"'), e.line('require "uri"'), e.line(), e.line('uri = URI.parse("' + n.url + '")'), n.method.toUpperCase() === "GET" ? e.line("request = Net::HTTP::Get.new(uri)") : n.method.toUpperCase() === "POST" ? e.line("request = Net::HTTP::Post.new(uri)") : n.method.toUpperCase() === "PUT" ? e.line("request = Net::HTTP::Put.new(uri)") : n.method.toUpperCase() === "DELETE" ? e.line("request = Net::HTTP::Delete.new(uri)") : e.line('request = Net::HTTP::GenericRequest.new("' + n.method.toUpperCase() + '", uri.path, nil, nil)'), n.headers && Object.keys(n.headers).length > 0)
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? o.forEach((r) => e.line(`request["${i}"] = "${r}"`)) : e.line(`request["${i}"] = "${o}"`);
    if (n.cookies && Object.keys(n.cookies).length > 0)
      for (const [i, o] of Object.entries(n.cookies))
        e.line(`request["Cookie"] = "${i}=${o}"`);
    return n.body && (e.line("request.body = "), e.indent(), D(n.body, e)), e.line(), e.line('response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|'), e.indent(), e.line("http.request(request)"), e.outdent(), e.line("end"), e.line(), e.line("puts response.body"), e.output();
  }
};
function D(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`);
  for (let i = 0; i < e.length; i++) {
    const o = e[i].trim();
    if (i === 0) {
      n.append(o);
      continue;
    }
    i === e.length - 1 && n.outdent(), n.line(o);
  }
}
const F = {
  language: "ruby",
  client: "faraday",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line('require "faraday"'), e.line(), e.line('conn = Faraday.new(url: "' + n.url + '") do |f|'), e.indent(), e.line("f.adapter Faraday.default_adapter"), e.outdent(), e.line("end"), e.line(), e.line("response = conn." + n.method.toLowerCase() + " do |req|"), e.indent(), e.line('req.url "' + n.url + '"'), n.headers)
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? o.forEach((r) => e.line(`req.headers["${i}"] = "${r}"`)) : e.line(`req.headers["${i}"] = "${o}"`);
    if (n.cookies)
      for (const [i, o] of Object.entries(n.cookies))
        e.line(`req.headers["Cookie"] = "${i}=${o}"`);
    return n.body && (e.line("req.body = "), e.indent(), M(n.body, e)), e.outdent(), e.line("end"), e.line(), e.line("puts response.body"), e.output();
  }
};
function M(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`);
  for (let i = 0; i < e.length; i++) {
    const o = e[i].trim();
    if (i === 0) {
      n.append(o);
      continue;
    }
    i === e.length - 1 && n.outdent(), n.line(o);
  }
}
const G = {
  language: "rust",
  client: "reqwest",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line("use reqwest::blocking::Client;"), e.line("use std::error::Error;"), e.line(), e.line("fn main() -> Result<(), Box<dyn Error>> {"), e.indent(), e.line("let client = Client::new();"), e.line(), e.line("let res = client.request(reqwest::Method::" + n.method.toUpperCase() + ', "' + n.url + '")'), e.indent(), n.headers)
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? o.forEach((r) => e.line(`.header("${i}", "${r}")`)) : e.line(`.header("${i}", "${o}")`);
    if (n.cookies)
      for (const [i, o] of Object.entries(n.cookies))
        Array.isArray(o) ? o.forEach((r) => e.line(`.cookie("${i}", "${r}")`)) : e.line(`.cookie("${i}", "${o}")`);
    return n.body && (e.line(".body("), e.indent(), z(n.body, e), e.append(")")), e.line(".send()?;"), e.outdent(), e.line(), t.handleErrors ? (e.line("if res.status().is_success() {"), e.indent(), e.line('println!("{}", res.text()?);'), e.outdent(), e.line("} else {"), e.indent(), e.line('eprintln!("Request failed with status: {}", res.status());'), e.outdent(), e.line("}")) : e.line('println!("{}", res.text()?);'), e.line("Ok(())"), e.outdent(), e.line("}"), e.output();
  }
};
function z(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`);
  for (let i = 0; i < e.length; i++) {
    const o = e[i].trim();
    if (i === 0) {
      n.append(o);
      continue;
    }
    i === e.length - 1 && n.outdent(), n.line(o);
  }
}
const V = {
  default: !0,
  language: "shell",
  client: "curl",
  generate(t, n) {
    var o, r;
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line(`curl -X ${n.method} "${n.url}" \\`), n.headers) {
      e.indent();
      for (const [l, s] of Object.entries(n.headers))
        if (Array.isArray(s))
          for (const u of s)
            e.line(`-H "${l}: ${u.replace(/"/g, '\\"')}" \\`);
        else
          e.line(`-H "${l}: ${s.replace(/"/g, '\\"')}" \\`);
      e.outdent();
    }
    if (n.cookies) {
      e.indent();
      const l = Object.entries(n.cookies).flatMap(([s, u]) => Array.isArray(u) ? u.map((c) => `${s}=${c}`) : `${s}=${u}`).join("; ");
      e.line(`-b "${l}" \\`), e.outdent();
    }
    if (n.body) {
      const l = ((o = n.headers) == null ? void 0 : o["content-type"]) || ((r = n.headers) == null ? void 0 : r["Content-Type"]) || "application/json";
      if (e.indent(), l.includes("application/json"))
        e.line("-d $'"), e.indent(), K(n.body, e), e.append("'"), e.outdent();
      else if (l === "application/x-www-form-urlencoded") {
        const s = new URLSearchParams(n.body).toString().replace(/'/g, "'\\''");
        e.line(`-d '${s}'`);
      } else if (typeof n.body == "string") {
        const s = n.body.replace(/'/g, "'\\''");
        e.line(`-d '${s}'`);
      }
      e.outdent();
    }
    let i = e.output();
    return i = i.replace(/\\\s*$/, "").trim(), i;
  }
};
function K(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`), i = "\\";
  for (let o = 0; o < e.length; o++) {
    const r = e[o].trim();
    if (o === 0) {
      n.append(r + " " + i);
      continue;
    }
    o === e.length - 1 && n.outdent(), n.line(r + (o === e.length - 1 ? "" : " " + i));
  }
}
const Q = {
  default: !0,
  language: "swift",
  client: "nsurlsession",
  generate(t, n) {
    const e = new d({
      indent: t.indent || "  ",
      join: t.join || `
`
    });
    if (e.line("import Foundation"), e.line(), e.line('let url = URL(string: "' + n.url + '")!'), e.line("var request = URLRequest(url: url)"), e.line('request.httpMethod = "' + n.method.toUpperCase() + '"'), e.line(), n.headers && Object.keys(n.headers).length > 0) {
      for (const [i, o] of Object.entries(n.headers))
        Array.isArray(o) ? o.forEach((r) => e.line(`request.addValue("${r}", forHTTPHeaderField: "${i}")`)) : e.line(`request.addValue("${o}", forHTTPHeaderField: "${i}")`);
      e.line();
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      for (const [i, o] of Object.entries(n.cookies))
        e.line(`request.addValue("${i}=${o}", forHTTPHeaderField: "Cookie")`);
      e.line();
    }
    return n.body && (e.line("let body = "), e.indent(), W(n.body, e), e.line("request.httpBody = body"), e.line()), e.line("let task = URLSession.shared.dataTask(with: request) { data, response, error in"), e.indent(), e.line("if let error = error {"), e.indent(), e.line('print("Error: \\(error)")'), e.line("return"), e.outdent(), e.line("}"), e.line(), e.line("if let httpResponse = response as? HTTPURLResponse {"), e.indent(), e.line("if httpResponse.statusCode == 200, let data = data {"), e.indent(), e.line("let responseString = String(data: data, encoding: .utf8)"), e.line('print(responseString ?? "No response data")'), e.outdent(), e.line("} else {"), e.indent(), e.line('print("Request failed with status code: \\(httpResponse.statusCode)")'), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.line(), e.line("task.resume()"), e.output();
  }
};
function W(t, n) {
  const e = JSON.stringify(t, null, n.getIndent()).split(`
`);
  for (let i = 0; i < e.length; i++) {
    const o = e[i].trim();
    if (i === 0) {
      n.append(o);
      continue;
    }
    i === e.length - 1 && n.outdent(), n.line(o);
  }
}
a(k);
a(C);
a(w);
a(b);
a(q);
a(A);
a(S);
a(_);
a(L);
a(N);
a(P);
a(H);
a(B);
a(I);
a(F);
a(G);
a(V);
a(Q);
export {
  d as Builder,
  ee as ClearRegistry,
  X as Codes,
  ne as Generate,
  m as IsJsonRequest,
  Y as Languages,
  a as Register,
  p as Search,
  Z as SetDefault
};
