const f = [];
function v() {
  return f;
}
function x() {
  return f.map((i) => i.language).filter((i, n, e) => e.indexOf(i) === n);
}
function $(i, n) {
  if (i === "" || i === void 0)
    return new Error("Language is required");
  const e = f.filter((o) => o.language.toLowerCase() === i.toLowerCase());
  if (e.length === 0)
    return new Error("No targets found of language: " + i);
  const t = e.find((o) => o.default) || e[0];
  if (!n)
    return t;
  const r = e.find((o) => o.client.toLowerCase() === n.toLowerCase());
  return r || t;
}
function B(i, n) {
  const e = $(i, n);
  if (e instanceof Error)
    return e;
  e.default = !0;
}
function d(i) {
  if (!i)
    return new Error("Target is required");
  if (Array.isArray(i)) {
    i.forEach((t) => d(t));
    return;
  }
  const n = f.filter((t) => t.language.toLowerCase() === i.language.toLowerCase()), e = n.find((t) => t.client.toLowerCase() === i.client.toLowerCase());
  if (i.default === void 0 && (i.default = n.length === 0), e) {
    const t = f.indexOf(i);
    f[t] = i;
    return;
  }
  f.push(i);
}
function D() {
  f.splice(0, f.length);
}
function F(i) {
  let n = g(i);
  if (n)
    return { error: n.message };
  i.config = j(i.config);
  const e = $(i.language, i.client);
  if (e instanceof Error)
    return { error: e.message };
  const t = e.generate(i.config, i.http);
  return {
    language: e.language,
    client: e.client,
    code: t
  };
}
function g(i) {
  if (!i)
    return new Error("Request is required");
  if (!i.language)
    return new Error("language is required");
  if (!i.http)
    return new Error("http is required");
  if (!i.http.method)
    return new Error("http.method is required");
  if (!i.http.url)
    return new Error("http.url is required");
}
function j(i) {
  return i = i || {}, i.indent || (i.indent = "  "), i.join || (i.join = `
`), i.handleErrors === void 0 && (i.handleErrors = !1), i;
}
class u {
  constructor(n = {}) {
    this.code = [], this.currentDepth = 0, this.indentChar = n.indent || "  ", this.lineJoin = n.join || `
`;
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
function k(i, n) {
  return i.toUpperCase() === "POST" && n !== void 0 && Object.keys(n).some(
    (e) => e.toLowerCase() === "content-type" && n[e].toLowerCase() === "application/json"
  );
}
const b = {
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
      e.line("struct curl_slist *headers = NULL;");
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((o) => e.line(`headers = curl_slist_append(headers, "${t}: ${o}");`)) : e.line(`headers = curl_slist_append(headers, "${t}: ${r}");`);
      e.line("curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);");
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const t = Object.entries(n.cookies).map(([r, o]) => `${r}=${o}`).join("; ");
      e.line(`curl_easy_setopt(curl, CURLOPT_COOKIE, "${t}");`);
    }
    return n.body && e.line(`curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"(${JSON.stringify(n.body)})");`), e.line("res = curl_easy_perform(curl);"), e.line("if(res != CURLE_OK)"), e.indent(), e.line(`fprintf(stderr, "curl_easy_perform() failed: %s
", curl_easy_strerror(res));`), e.outdent(), n.headers && Object.keys(n.headers).length > 0 && e.line("curl_slist_free_all(headers);"), e.line("curl_easy_cleanup(curl);"), e.outdent(), e.line("}"), e.line("curl_global_cleanup();"), e.line("return 0;"), e.outdent(), e.line("}"), e.output();
  }
}, O = {
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
    ), n.headers && Object.keys(n.headers).length > 0)
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((o) => e.line(`request.Headers.Add("${t}", "${o}");`)) : e.line(`request.Headers.Add("${t}", "${r}");`);
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const t = Object.entries(n.cookies).map(([r, o]) => `${r}=${o}`).join("; ");
      e.line(`request.Headers.Add("Cookie", "${t}");`);
    }
    return n.body && e.line(
      `request.Content = new StringContent("${JSON.stringify(n.body).replace(
        /"/g,
        '"'
      )}", System.Text.Encoding.UTF8, "application/json");`
    ), e.line("HttpResponseMessage response = await client.SendAsync(request);"), e.line("response.EnsureSuccessStatusCode();"), e.line("string responseBody = await response.Content.ReadAsStringAsync();"), e.line("Console.WriteLine(responseBody);"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, C = {
  language: "csharp",
  client: "restsharp",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("using RestSharp;"), e.line(), e.line("namespace RestSharpExample"), e.line("{"), e.indent(), e.line("class Program"), e.line("{"), e.indent(), e.line("static void Main(string[] args)"), e.line("{"), e.indent(), e.line(`var client = new RestClient("${n.url}");`), e.line(`var request = new RestRequest(Method.${n.method.toUpperCase()});`), n.headers && Object.keys(n.headers).length > 0)
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((o) => e.line(`request.AddHeader("${t}", "${o}");`)) : e.line(`request.AddHeader("${t}", "${r}");`);
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const t = Object.entries(n.cookies).map(([r, o]) => `${r}=${o}`).join("; ");
      e.line(`request.AddHeader("Cookie", "${t}");`);
    }
    return n.body && e.line(`request.AddJsonBody(${JSON.stringify(n.body)});`), e.line("IRestResponse response = client.Execute(request);"), e.line("Console.WriteLine(response.Content);"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, m = {
  default: !0,
  language: "go",
  client: "http",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    }), t = k(n.method, n.headers) && n.body;
    e.line("package main"), e.line(), e.line("import ("), e.indent(), e.line('"fmt"'), e.line('"net/http"'), e.line('"io"'), t && (e.line('"bytes"'), e.line('"encoding/json"')), i.handleErrors && e.line('"log"'), e.outdent(), e.line(")"), e.line(), e.line("func main() {"), e.indent(), e.line(`url := "${n.url}"`), e.line();
    let r = "nil";
    if (t) {
      e.line("jsonBodyMap := map[string]any{"), e.indent();
      for (const [o, l] of Object.entries(n.body))
        e.line(`"${o}": ${JSON.stringify(l)},`);
      e.outdent(), e.line("}"), i.handleErrors ? (e.line("jsonBodyBytes, err := json.Marshal(jsonBodyMap)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("jsonBodyBytes, _ := json.Marshal(jsonBodyMap)"), r = "bytes.NewBuffer(jsonBodyBytes)", e.line();
    }
    if (i.handleErrors ? (e.line(`req, err := http.NewRequest("${n.method.toUpperCase()}", url, ${r})`), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}"), e.line()) : (e.line(`req, _ := http.NewRequest("${n.method.toUpperCase()}", url, ${r})`), e.line()), n.headers) {
      for (const [o, l] of Object.entries(n.headers))
        if (Array.isArray(l))
          for (const s of l)
            e.line(`req.Header.Add("${o}", "${s}")`);
        else
          e.line(`req.Header.Set("${o}", "${l}")`);
      e.line();
    }
    if (n.cookies) {
      for (const [o, l] of Object.entries(n.cookies))
        if (Array.isArray(l))
          for (const s of l)
            e.line(`req.AddCookie(&http.Cookie{Name: "${o}", Value: "${s}"})`);
        else
          e.line(`req.AddCookie(&http.Cookie{Name: "${o}", Value: "${l}"})`);
      e.line();
    }
    return i.handleErrors ? (e.line("resp, err := http.DefaultClient.Do(req)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("resp, _ := http.DefaultClient.Do(req)"), e.line("defer resp.Body.Close()"), e.line(), i.handleErrors ? (e.line("body, err := io.ReadAll(resp.Body)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("body, _ := io.ReadAll(resp.Body)"), e.line(), e.line("fmt.Println(string(body))"), e.outdent(), e.line("}"), e.output();
  }
}, w = {
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
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? e.line(`"${t}": "${r.join(", ")}",`) : e.line(`"${t}": "${r}",`);
      e.outdent(), e.line("},");
    }
    return n.body && e.line(`body: JSON.stringify(${JSON.stringify(n.body)}),`), e.outdent(), e.line("})"), i.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("if (!response.ok) {"), e.indent(), e.line('throw new Error("Network response was not ok");'), e.outdent(), e.line("}"), e.line("return response.text();"), e.outdent(), e.line("})"), e.line(".then(data => console.log(data))"), e.line('.catch(error => console.error("There was a problem with the fetch operation:", error));')) : (e.line(".then(response => response.text())"), e.line(".then(data => console.log(data));")), e.output();
  }
}, q = {
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
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? e.line(`"${t}": "${r.join(", ")}",`) : e.line(`"${t}": "${r}",`);
      e.outdent(), e.line("},");
    }
    if (n.cookies) {
      e.line("cookies: {"), e.indent();
      for (const [t, r] of Object.entries(n.cookies))
        e.line(`"${t}": "${r}",`);
      e.outdent(), e.line("},");
    }
    return n.body && e.line(`data: ${JSON.stringify(n.body)},`), e.outdent(), e.line("})"), i.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("console.log(response.data);"), e.outdent(), e.line("})"), e.line(".catch(error => {"), e.indent(), e.line('console.error("There was an error:", error);'), e.outdent(), e.line("});")) : e.line(".then(response => console.log(response.data));"), e.output();
  }
}, S = {
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
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? e.line(`"${t}": "${r.join(", ")}",`) : e.line(`"${t}": "${r}",`);
      e.outdent(), e.line("},");
    }
    return n.body && (e.line(`data: JSON.stringify(${JSON.stringify(n.body)}),`), e.line('contentType: "application/json",')), e.line("success: function(data) {"), e.indent(), e.line("console.log(data);"), e.outdent(), e.line("},"), i.handleErrors && (e.line("error: function(jqXHR, textStatus, errorThrown) {"), e.indent(), e.line('console.error("Request failed:", textStatus, errorThrown);'), e.outdent(), e.line("},")), e.outdent(), e.line("});"), e.output();
  }
}, R = {
  language: "node",
  client: "http",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line('const http = require("http");'), e.line(), e.line("const options = {"), e.indent(), e.line(`method: "${n.method.toUpperCase()}",`), e.line(`hostname: "${new URL(n.url).hostname}",`), e.line(`path: "${new URL(n.url).pathname}${new URL(n.url).search}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? e.line(`"${t}": "${r.join(", ")}",`) : e.line(`"${t}": "${r}",`);
      e.outdent(), e.line("},");
    }
    return e.outdent(), e.line("};"), e.line(), e.line("const req = http.request(options, (res) => {"), e.indent(), e.line('let data = "";'), e.line(), e.line('res.on("data", (chunk) => {'), e.indent(), e.line("data += chunk;"), e.outdent(), e.line("});"), e.line(), e.line('res.on("end", () => {'), e.indent(), e.line("console.log(data);"), e.outdent(), e.line("});"), e.outdent(), e.line("});"), i.handleErrors && (e.line(), e.line('req.on("error", (error) => {'), e.indent(), e.line("console.error(error);"), e.outdent(), e.line("});")), e.line(), n.body && e.line(`req.write(JSON.stringify(${JSON.stringify(n.body)}));`), e.line("req.end();"), e.output();
  }
}, T = {
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
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? e.line(`"${t}": "${r.join(", ")}",`) : e.line(`"${t}": "${r}",`);
      e.outdent(), e.line("},");
    }
    return n.body && e.line("body: JSON.stringify(" + JSON.stringify(n.body) + "),"), e.outdent(), e.line("})"), i.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("if (!response.ok) {"), e.indent(), e.line('throw new Error("response not ok");'), e.outdent(), e.line("}"), e.line("return response.text();"), e.outdent(), e.line("})"), e.line(".then(data => console.log(data))"), e.line('.catch(error => console.error("error:", error));')) : (e.line(".then(response => response.text())"), e.line(".then(data => console.log(data))")), e.output();
  }
}, A = {
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
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((o) => e.line(`$headers[] = "${t}: ${o}";`)) : e.line(`$headers[] = "${t}: ${r}";`);
      e.line("curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);");
    }
    if (n.cookies) {
      e.line(), e.line("$cookies = [];");
      for (const [t, r] of Object.entries(n.cookies))
        e.line(`$cookies[] = "${t}=${r}";`);
      e.line('curl_setopt($ch, CURLOPT_COOKIE, implode("; ", $cookies));');
    }
    return n.body && (e.line(), e.line("curl_setopt($ch, CURLOPT_POSTFIELDS,"), e.line("<<<'JSON'"), h(n.body, e), e.line("JSON"), e.line(");"), e.outdent()), e.line(), e.line("$response = curl_exec($ch);"), i.handleErrors && (e.line("if (curl_errno($ch)) {"), e.indent(), e.line('echo "Error: " . curl_error($ch);'), e.outdent(), e.line("}")), e.line("curl_close($ch);"), e.line(), e.line("echo $response;"), e.output();
  }
};
function h(i, n) {
  if (typeof i == "object" && i !== null)
    if (Array.isArray(i))
      n.line("[" + i.map((e) => JSON.stringify(e)).join(", ") + "]");
    else {
      n.line("{"), n.indent();
      const e = Object.entries(i);
      e.forEach(([t, r], o) => {
        Array.isArray(r) ? n.line(`"${t}": [${r.map((l) => JSON.stringify(l)).join(", ")}]`) : typeof r == "object" && r !== null ? (n.line(`"${t}": {`), n.indent(), h(r, n), n.outdent(), n.line("}")) : n.line(`"${t}": ${JSON.stringify(r)}`), o < e.length - 1 && n.append(",");
      }), n.outdent(), n.line("}");
    }
  else
    n.line(JSON.stringify(i));
}
const E = {
  language: "php",
  client: "guzzle",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("<?php"), e.line(), e.line("require 'vendor/autoload.php';"), e.line(), e.line("use GuzzleHttp\\Client;"), e.line(), e.line("$client = new Client();"), e.line("$response = $client->request("), e.indent(), e.line('"' + n.method.toUpperCase() + '",'), e.line('"' + n.url + '",'), n.headers || n.cookies || n.body) {
      if (e.line("["), n.headers) {
        e.indent(), e.line('"headers" => ['), e.indent();
        for (const [t, r] of Object.entries(n.headers))
          Array.isArray(r) ? r.forEach((o) => e.line(`"${t}" => "${o}",`)) : e.line(`"${t}" => "${r}",`);
        e.outdent(), e.line("],"), e.outdent();
      }
      if (n.cookies) {
        e.indent(), e.line('"cookies" => ['), e.indent();
        for (const [t, r] of Object.entries(n.cookies))
          e.line(`"${t}" => "${r}",`);
        e.outdent(), e.line("],"), e.outdent();
      }
      n.body && (e.indent(), e.line('"json" => {'), e.indent(), p(n.body, e, !0), e.outdent(), e.line("}"), e.outdent()), e.line("],");
    }
    return e.outdent(), e.line(");"), e.line(), e.line("echo $response->getBody();"), e.output();
  }
};
function p(i, n, e = !1) {
  if (typeof i == "object" && i !== null)
    if (Array.isArray(i))
      n.line("[" + i.map((t) => JSON.stringify(t)).join(", ") + "]");
    else {
      e || (n.line("{"), n.indent());
      const t = Object.entries(i);
      t.forEach(([r, o], l) => {
        Array.isArray(o) ? n.line(`"${r}": [${o.map((s) => JSON.stringify(s)).join(", ")}]`) : typeof o == "object" && o !== null ? (n.line(`"${r}": {`), n.indent(), p(o, n, !0), n.outdent(), n.line("}")) : n.line(`"${r}": ${JSON.stringify(o)}`), l < t.length - 1 && n.append(",");
      }), e || (n.outdent(), n.line("}"));
    }
  else
    n.line(JSON.stringify(i));
}
const _ = {
  default: !0,
  language: "python",
  client: "http",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    }), t = n.method.toUpperCase(), r = t !== "GET" && n.body, o = n.headers && Object.keys(n.headers).length > 0, l = n.cookies && Object.keys(n.cookies).length > 0;
    let s = [];
    e.line("import http.client"), e.line("import json"), e.line();
    const a = new URL(n.url);
    if (e.line(
      `conn = http.client.HTTPSConnection("${a.hostname}", ${a.port || (a.protocol === "https:" ? 443 : 80)})`
    ), e.line(), r && (s.push("payload"), e.line(`payload = json.dumps(${JSON.stringify(n.body)})`), e.line()), o) {
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
      `conn.request("${t}", "${a.pathname + a.search}"` + (s.length > 0 ? `, ${s.join(", ")}` : "") + ")"
    ), e.line("res = conn.getresponse()"), e.line("data = res.read()"), e.line(), e.line('print(data.decode("utf-8"))'), e.output();
  }
}, U = {
  language: "python",
  client: "requests",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    }), r = n.method.toUpperCase() !== "GET" && n.body, o = n.headers && Object.keys(n.headers).length > 0, l = n.cookies && Object.keys(n.cookies).length > 0;
    let s = [];
    if (e.line("import requests"), e.line(), e.line('url = "' + n.url + '"'), o) {
      s.push("headers=headers"), e.line("headers = {"), e.indent();
      for (const [a, c] of Object.entries(n.headers))
        Array.isArray(c) ? e.line(`"${a}": "${c.join(", ")}",`) : e.line(`"${a}": "${c}",`);
      e.outdent(), e.line("}");
    }
    if (l) {
      s.push("cookies=cookies"), e.line("cookies = {"), e.indent();
      for (const [a, c] of Object.entries(n.cookies))
        e.line(`"${a}": "${c}",`);
      e.outdent(), e.line("}");
    }
    return r && (s.push("data=data"), e.line("data = " + JSON.stringify(n.body))), e.line(), e.line(
      "response = requests." + n.method.toLowerCase() + "(url" + (s.length > 0 ? `, ${s.join(", ")}` : "") + ")"
    ), e.line("print(response.text)"), e.output();
  }
}, L = {
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
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((o) => e.line(`request["${t}"] = "${o}"`)) : e.line(`request["${t}"] = "${r}"`);
    if (n.cookies && Object.keys(n.cookies).length > 0)
      for (const [t, r] of Object.entries(n.cookies))
        e.line(`request["Cookie"] = "${t}=${r}"`);
    return n.body && e.line("request.body = " + JSON.stringify(n.body)), e.line(), e.line('response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|'), e.indent(), e.line("http.request(request)"), e.outdent(), e.line("end"), e.line(), e.line("puts response.body"), e.output();
  }
}, N = {
  language: "ruby",
  client: "faraday",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line('require "faraday"'), e.line(), e.line('conn = Faraday.new(url: "' + n.url + '") do |f|'), e.indent(), e.line("f.adapter Faraday.default_adapter"), e.outdent(), e.line("end"), e.line(), e.line("response = conn." + n.method.toLowerCase() + " do |req|"), e.indent(), e.line('req.url "' + n.url + '"'), n.headers)
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((o) => e.line(`req.headers["${t}"] = "${o}"`)) : e.line(`req.headers["${t}"] = "${r}"`);
    if (n.cookies)
      for (const [t, r] of Object.entries(n.cookies))
        e.line(`req.headers["Cookie"] = "${t}=${r}"`);
    return n.body && e.line("req.body = " + JSON.stringify(n.body)), e.outdent(), e.line("end"), e.line(), e.line("puts response.body"), e.output();
  }
}, P = {
  language: "rust",
  client: "reqwest",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("use reqwest::blocking::Client;"), e.line("use std::error::Error;"), e.line(), e.line("fn main() -> Result<(), Box<dyn Error>> {"), e.indent(), e.line("let client = Client::new();"), e.line(), e.line("let res = client.request(reqwest::Method::" + n.method.toUpperCase() + ', "' + n.url + '")'), e.indent(), n.headers)
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((o) => e.line(`.header("${t}", "${o}")`)) : e.line(`.header("${t}", "${r}")`);
    if (n.cookies)
      for (const [t, r] of Object.entries(n.cookies))
        Array.isArray(r) ? r.forEach((o) => e.line(`.cookie("${t}", "${o}")`)) : e.line(`.cookie("${t}", "${r}")`);
    return n.body && e.line('.body("' + JSON.stringify(n.body).replace(/"/g, '"') + '")'), e.line(".send()?;"), e.outdent(), e.line(), i.handleErrors ? (e.line("if res.status().is_success() {"), e.indent(), e.line('println!("{}", res.text()?);'), e.outdent(), e.line("} else {"), e.indent(), e.line('eprintln!("Request failed with status: {}", res.status());'), e.outdent(), e.line("}")) : e.line('println!("{}", res.text()?);'), e.line("Ok(())"), e.outdent(), e.line("}"), e.output();
  }
}, H = {
  default: !0,
  language: "shell",
  client: "curl",
  generate(i, n) {
    var r, o;
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line(`curl -X ${n.method} "${n.url}" \\`), n.headers) {
      e.indent();
      for (const [l, s] of Object.entries(n.headers))
        if (Array.isArray(s))
          for (const a of s)
            e.line(`-H "${l}: ${a.replace(/"/g, '\\"')}" \\`);
        else
          e.line(`-H "${l}: ${s.replace(/"/g, '\\"')}" \\`);
      e.outdent();
    }
    if (n.cookies) {
      e.indent();
      const l = Object.entries(n.cookies).flatMap(([s, a]) => Array.isArray(a) ? a.map((c) => `${s}=${c}`) : `${s}=${a}`).join("; ");
      e.line(`-b "${l}" \\`), e.outdent();
    }
    if (n.body) {
      const l = ((r = n.headers) == null ? void 0 : r["content-type"]) || ((o = n.headers) == null ? void 0 : o["Content-Type"]) || "application/json";
      if (e.indent(), l.includes("application/json")) {
        const a = JSON.stringify(n.body, null, 2).replace(/'/g, "'\\''").split(`
`);
        e.line(`-d $'${a[0]} \\`);
        for (let c = 1; c < a.length - 1; c++)
          e.line(`${a[c]} \\`);
        e.line(`${a[a.length - 1]}'`);
      } else if (l === "application/x-www-form-urlencoded") {
        const s = new URLSearchParams(n.body).toString().replace(/'/g, "'\\''");
        e.line(`-d '${s}'`);
      } else if (typeof n.body == "string") {
        const s = n.body.replace(/'/g, "'\\''");
        e.line(`-d '${s}'`);
      }
      e.outdent();
    }
    let t = e.output();
    return t = t.replace(/\\\s*$/, "").trim(), t;
  }
}, J = {
  default: !0,
  language: "swift",
  client: "nsurlsession",
  generate(i, n) {
    const e = new u({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("import Foundation"), e.line(), e.line('let url = URL(string: "' + n.url + '")!'), e.line("var request = URLRequest(url: url)"), e.line('request.httpMethod = "' + n.method.toUpperCase() + '"'), e.line(), n.headers && Object.keys(n.headers).length > 0) {
      for (const [t, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((o) => e.line(`request.addValue("${o}", forHTTPHeaderField: "${t}")`)) : e.line(`request.addValue("${r}", forHTTPHeaderField: "${t}")`);
      e.line();
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      for (const [t, r] of Object.entries(n.cookies))
        e.line(`request.addValue("${t}=${r}", forHTTPHeaderField: "Cookie")`);
      e.line();
    }
    return n.body && (e.line(
      "let body = try! JSONSerialization.data(withJSONObject: " + JSON.stringify(n.body) + ", options: [])"
    ), e.line("request.httpBody = body"), e.line()), e.line("let task = URLSession.shared.dataTask(with: request) { data, response, error in"), e.indent(), e.line("if let error = error {"), e.indent(), e.line('print("Error: (error)")'), e.line("return"), e.outdent(), e.line("}"), e.line(), e.line("if let httpResponse = response as? HTTPURLResponse {"), e.indent(), e.line("if httpResponse.statusCode == 200, let data = data {"), e.indent(), e.line("let responseString = String(data: data, encoding: .utf8)"), e.line('print(responseString ?? "No response data")'), e.outdent(), e.line("} else {"), e.indent(), e.line('print("Request failed with status code: (httpResponse.statusCode)")'), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.line(), e.line("task.resume()"), e.output();
  }
};
d(b);
d(O);
d(C);
d(m);
d(w);
d(q);
d(S);
d(R);
d(T);
d(A);
d(E);
d(_);
d(U);
d(L);
d(N);
d(P);
d(H);
d(J);
export {
  u as Builder,
  D as ClearRegistry,
  v as Codes,
  F as Generate,
  k as IsJsonRequest,
  x as Languages,
  d as Register,
  $ as SearchTarget,
  B as SetDefault
};
