import { B as a, I as f } from "./utils-BZc82ZcG.mjs";
const y = {
  default: !0,
  language: "c",
  target: "libcurl",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line("#include <stdio.h>"), e.line("#include <curl/curl.h>"), e.line(), e.line("int main(void) {"), e.indent(), e.line("CURL *curl;"), e.line("CURLcode res;"), e.line(), e.line("curl_global_init(CURL_GLOBAL_DEFAULT);"), e.line("curl = curl_easy_init();"), e.line("if(curl) {"), e.indent(), e.line(`curl_easy_setopt(curl, CURLOPT_URL, "${n.url}");`), n.method.toUpperCase() === "POST" ? e.line("curl_easy_setopt(curl, CURLOPT_POST, 1L);") : n.method.toUpperCase() !== "GET" && e.line(`curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${n.method.toUpperCase()}");`), n.headers && Object.keys(n.headers).length > 0) {
      e.line("struct curl_slist *headers = NULL;");
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? i.forEach((s) => e.line(`headers = curl_slist_append(headers, "${r}: ${s}");`)) : e.line(`headers = curl_slist_append(headers, "${r}: ${i}");`);
      e.line("curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);");
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const r = Object.entries(n.cookies).map(([i, s]) => `${i}=${s}`).join("; ");
      e.line(`curl_easy_setopt(curl, CURLOPT_COOKIE, "${r}");`);
    }
    return n.body && e.line(`curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"(${JSON.stringify(n.body)})");`), e.line("res = curl_easy_perform(curl);"), e.line("if(res != CURLE_OK)"), e.indent(), e.line(`fprintf(stderr, "curl_easy_perform() failed: %s
", curl_easy_strerror(res));`), e.outdent(), n.headers && Object.keys(n.headers).length > 0 && e.line("curl_slist_free_all(headers);"), e.line("curl_easy_cleanup(curl);"), e.outdent(), e.line("}"), e.line("curl_global_cleanup();"), e.line("return 0;"), e.outdent(), e.line("}"), e.output();
  }
}, $ = {
  default: !0,
  language: "csharp",
  target: "http",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line("using System;"), e.line("using System.Net.Http;"), e.line("using System.Threading.Tasks;"), e.line(), e.line("namespace HttpClientExample"), e.line("{"), e.indent(), e.line("class Program"), e.line("{"), e.indent(), e.line("static async Task Main(string[] args)"), e.line("{"), e.indent(), e.line("using (HttpClient client = new HttpClient())"), e.line("{"), e.indent(), e.line(
      `HttpRequestMessage request = new HttpRequestMessage(HttpMethod.${n.method.toUpperCase()}, "${n.url}");`
    ), n.headers && Object.keys(n.headers).length > 0)
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? i.forEach((s) => e.line(`request.Headers.Add("${r}", "${s}");`)) : e.line(`request.Headers.Add("${r}", "${i}");`);
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const r = Object.entries(n.cookies).map(([i, s]) => `${i}=${s}`).join("; ");
      e.line(`request.Headers.Add("Cookie", "${r}");`);
    }
    return n.body && e.line(
      `request.Content = new StringContent("${JSON.stringify(n.body).replace(
        /"/g,
        '"'
      )}", System.Text.Encoding.UTF8, "application/json");`
    ), e.line("HttpResponseMessage response = await client.SendAsync(request);"), e.line("response.EnsureSuccessStatusCode();"), e.line("string responseBody = await response.Content.ReadAsStringAsync();"), e.line("Console.WriteLine(responseBody);"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, g = {
  language: "csharp",
  target: "restsharp",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line("using RestSharp;"), e.line(), e.line("namespace RestSharpExample"), e.line("{"), e.indent(), e.line("class Program"), e.line("{"), e.indent(), e.line("static void Main(string[] args)"), e.line("{"), e.indent(), e.line(`var client = new RestClient("${n.url}");`), e.line(`var request = new RestRequest(Method.${n.method.toUpperCase()});`), n.headers && Object.keys(n.headers).length > 0)
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? i.forEach((s) => e.line(`request.AddHeader("${r}", "${s}");`)) : e.line(`request.AddHeader("${r}", "${i}");`);
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const r = Object.entries(n.cookies).map(([i, s]) => `${i}=${s}`).join("; ");
      e.line(`request.AddHeader("Cookie", "${r}");`);
    }
    return n.body && e.line(`request.AddJsonBody(${JSON.stringify(n.body)});`), e.line("IRestResponse response = client.Execute(request);"), e.line("Console.WriteLine(response.Content);"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, b = {
  default: !0,
  language: "curl",
  target: "native",
  generate(o, n) {
    var r, i;
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line(`curl -X ${n.method} "${n.url}"`), e.indent(), n.headers)
      for (const [s, t] of Object.entries(n.headers))
        if (Array.isArray(t))
          for (const l of t)
            e.line(`-H "${s}: ${l}"`);
        else
          e.line(`-H "${s}: ${t}"`);
    if (n.cookies) {
      const s = Object.entries(n.cookies).map(
        ([t, l]) => Array.isArray(l) ? l.map((d) => `${t}=${d}`).join("; ") : `${t}=${l}`
      ).join("; ");
      e.line(`-b "${s}"`);
    }
    if (n.body) {
      const s = ((r = n.headers) == null ? void 0 : r["content-type"]) || ((i = n.headers) == null ? void 0 : i["Content-Type"]) || "application/json";
      if (s === "application/json") {
        const t = JSON.stringify(n.body);
        e.line(`-d '${t}'`);
      } else if (s === "application/x-www-form-urlencoded") {
        const t = new URLSearchParams(n.body).toString();
        e.line(`-d '${t}'`);
      } else typeof n.body == "string" && e.line(`-d '${n.body}'`);
    }
    return e.output();
  }
}, j = {
  default: !0,
  language: "go",
  target: "http",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    }), r = f(n.method, n.headers) && n.body;
    e.line("package main"), e.line(), e.line("import ("), e.indent(), e.line('"fmt"'), e.line('"net/http"'), e.line('"io"'), r && (e.line('"bytes"'), e.line('"encoding/json"')), o.handleErrors && e.line('"log"'), e.outdent(), e.line(")"), e.line(), e.line("func main() {"), e.indent(), e.line(`url := "${n.url}"`), e.line();
    let i = "nil";
    if (r) {
      e.line("jsonBodyMap := map[string]any{"), e.indent();
      for (const [s, t] of Object.entries(n.body))
        e.line(`"${s}": ${JSON.stringify(t)},`);
      e.outdent(), e.line("}"), o.handleErrors ? (e.line("jsonBodyBytes, err := json.Marshal(jsonBodyMap)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("jsonBodyBytes, _ := json.Marshal(jsonBodyMap)"), i = "bytes.NewBuffer(jsonBodyBytes)", e.line();
    }
    if (o.handleErrors ? (e.line(`req, err := http.NewRequest("${n.method.toUpperCase()}", url, ${i})`), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}"), e.line()) : (e.line(`req, _ := http.NewRequest("${n.method.toUpperCase()}", url, ${i})`), e.line()), n.headers) {
      for (const [s, t] of Object.entries(n.headers))
        if (Array.isArray(t))
          for (const l of t)
            e.line(`req.Header.Add("${s}", "${l}")`);
        else
          e.line(`req.Header.Set("${s}", "${t}")`);
      e.line();
    }
    if (n.cookies) {
      for (const [s, t] of Object.entries(n.cookies))
        if (Array.isArray(t))
          for (const l of t)
            e.line(`req.AddCookie(&http.Cookie{Name: "${s}", Value: "${l}"})`);
        else
          e.line(`req.AddCookie(&http.Cookie{Name: "${s}", Value: "${t}"})`);
      e.line();
    }
    return o.handleErrors ? (e.line("resp, err := http.DefaultClient.Do(req)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("resp, _ := http.DefaultClient.Do(req)"), e.line("defer resp.Body.Close()"), e.line(), o.handleErrors ? (e.line("body, err := io.ReadAll(resp.Body)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("body, _ := io.ReadAll(resp.Body)"), e.line(), e.line("fmt.Println(string(body))"), e.outdent(), e.line("}"), e.output();
  }
}, h = {
  default: !0,
  language: "javascript",
  target: "fetch",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line('fetch("' + n.url + '", {'), e.indent(), e.line(`method: "${n.method.toUpperCase()}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? e.line(`"${r}": "${i.join(", ")}",`) : e.line(`"${r}": "${i}",`);
      e.outdent(), e.line("},");
    }
    return n.body && e.line(`body: JSON.stringify(${JSON.stringify(n.body)}),`), e.outdent(), e.line("})"), o.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("if (!response.ok) {"), e.indent(), e.line('throw new Error("Network response was not ok");'), e.outdent(), e.line("}"), e.line("return response.text();"), e.outdent(), e.line("})"), e.line(".then(data => console.log(data))"), e.line('.catch(error => console.error("There was a problem with the fetch operation:", error));')) : (e.line(".then(response => response.text())"), e.line(".then(data => console.log(data));")), e.output();
  }
}, k = {
  language: "javascript",
  target: "axios",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line("axios({"), e.indent(), e.line(`method: "${n.method.toLowerCase()}",`), e.line(`url: "${n.url}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? e.line(`"${r}": "${i.join(", ")}",`) : e.line(`"${r}": "${i}",`);
      e.outdent(), e.line("},");
    }
    if (n.cookies) {
      e.line("cookies: {"), e.indent();
      for (const [r, i] of Object.entries(n.cookies))
        e.line(`"${r}": "${i}",`);
      e.outdent(), e.line("},");
    }
    return n.body && e.line(`data: ${JSON.stringify(n.body)},`), e.outdent(), e.line("})"), o.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("console.log(response.data);"), e.outdent(), e.line("})"), e.line(".catch(error => {"), e.indent(), e.line('console.error("There was an error:", error);'), e.outdent(), e.line("});")) : e.line(".then(response => console.log(response.data));"), e.output();
  }
}, p = {
  language: "javascript",
  target: "jquery",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line("$.ajax({"), e.indent(), e.line(`url: "${n.url}",`), e.line(`type: "${n.method.toUpperCase()}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? e.line(`"${r}": "${i.join(", ")}",`) : e.line(`"${r}": "${i}",`);
      e.outdent(), e.line("},");
    }
    return n.body && (e.line(`data: JSON.stringify(${JSON.stringify(n.body)}),`), e.line('contentType: "application/json",')), e.line("success: function(data) {"), e.indent(), e.line("console.log(data);"), e.outdent(), e.line("},"), o.handleErrors && (e.line("error: function(jqXHR, textStatus, errorThrown) {"), e.indent(), e.line('console.error("Request failed:", textStatus, errorThrown);'), e.outdent(), e.line("},")), e.outdent(), e.line("});"), e.output();
  }
}, O = {
  language: "node",
  target: "http",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line('const http = require("http");'), e.line(), e.line("const options = {"), e.indent(), e.line(`method: "${n.method.toUpperCase()}",`), e.line(`hostname: "${new URL(n.url).hostname}",`), e.line(`path: "${new URL(n.url).pathname}${new URL(n.url).search}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? e.line(`"${r}": "${i.join(", ")}",`) : e.line(`"${r}": "${i}",`);
      e.outdent(), e.line("},");
    }
    return e.outdent(), e.line("};"), e.line(), e.line("const req = http.request(options, (res) => {"), e.indent(), e.line('let data = "";'), e.line(), e.line('res.on("data", (chunk) => {'), e.indent(), e.line("data += chunk;"), e.outdent(), e.line("});"), e.line(), e.line('res.on("end", () => {'), e.indent(), e.line("console.log(data);"), e.outdent(), e.line("});"), e.outdent(), e.line("});"), o.handleErrors && (e.line(), e.line('req.on("error", (error) => {'), e.indent(), e.line("console.error(error);"), e.outdent(), e.line("});")), e.line(), n.body && e.line(`req.write(JSON.stringify(${JSON.stringify(n.body)}));`), e.line("req.end();"), e.output();
  }
}, C = {
  language: "node",
  target: "node-fetch",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line('const fetch = require("node-fetch");'), e.line(), e.line('fetch("' + n.url + '", {'), e.indent(), e.line('method: "' + n.method.toUpperCase() + '",'), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? e.line(`"${r}": "${i.join(", ")}",`) : e.line(`"${r}": "${i}",`);
      e.outdent(), e.line("},");
    }
    return n.body && e.line("body: JSON.stringify(" + JSON.stringify(n.body) + "),"), e.outdent(), e.line("})"), o.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("if (!response.ok) {"), e.indent(), e.line('throw new Error("response not ok");'), e.outdent(), e.line("}"), e.line("return response.text();"), e.outdent(), e.line("})"), e.line(".then(data => console.log(data))"), e.line('.catch(error => console.error("error:", error));')) : (e.line(".then(response => response.text())"), e.line(".then(data => console.log(data))")), e.output();
  }
}, m = {
  default: !0,
  language: "php",
  target: "curl",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line("<?php"), e.line(), e.line("$ch = curl_init();"), e.line(), e.line(`curl_setopt($ch, CURLOPT_URL, "${n.url}");`), e.line("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);"), e.line(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${n.method.toUpperCase()}");`), n.headers) {
      e.line(), e.line("$headers = [];");
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? i.forEach((s) => e.line(`$headers[] = "${r}: ${s}";`)) : e.line(`$headers[] = "${r}: ${i}";`);
      e.line("curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);");
    }
    if (n.cookies) {
      e.line(), e.line("$cookies = [];");
      for (const [r, i] of Object.entries(n.cookies))
        e.line(`$cookies[] = "${r}=${i}";`);
      e.line('curl_setopt($ch, CURLOPT_COOKIE, implode("; ", $cookies));');
    }
    return n.body && (e.line(), e.line(`curl_setopt($ch, CURLOPT_POSTFIELDS, '${JSON.stringify(n.body)}');`)), e.line(), e.line("$response = curl_exec($ch);"), o.handleErrors && (e.line("if (curl_errno($ch)) {"), e.indent(), e.line('echo "Error: " . curl_error($ch);'), e.outdent(), e.line("}")), e.line("curl_close($ch);"), e.line(), e.line("echo $response;"), e.output();
  }
}, q = {
  language: "php",
  target: "guzzle",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line("<?php"), e.line(), e.line("require 'vendor/autoload.php';"), e.line(), e.line("use GuzzleHttp\\Client;"), e.line(), e.line("$client = new Client();"), e.line("$response = $client->request("), e.indent(), e.line('"' + n.method.toUpperCase() + '",'), e.line('"' + n.url + '",'), n.headers || n.cookies || n.body) {
      if (e.line("["), n.headers) {
        e.indent(), e.line('"headers" => ['), e.indent();
        for (const [r, i] of Object.entries(n.headers))
          Array.isArray(i) ? i.forEach((s) => e.line(`"${r}" => "${s}",`)) : e.line(`"${r}" => "${i}",`);
        e.outdent(), e.line("],"), e.outdent();
      }
      if (n.cookies) {
        e.indent(), e.line('"cookies" => ['), e.indent();
        for (const [r, i] of Object.entries(n.cookies))
          e.line(`"${r}" => "${i}",`);
        e.outdent(), e.line("],"), e.outdent();
      }
      n.body && (e.indent(), e.line('"json" => ' + JSON.stringify(n.body) + ","), e.outdent()), e.line("],");
    }
    return e.outdent(), e.line(");"), e.line(), e.line("echo $response->getBody();"), e.output();
  }
}, R = {
  default: !0,
  language: "python",
  target: "http",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    }), r = n.method.toUpperCase(), i = r !== "GET" && n.body, s = n.headers && Object.keys(n.headers).length > 0, t = n.cookies && Object.keys(n.cookies).length > 0;
    let l = [];
    e.line("import http.client"), e.line("import json"), e.line();
    const d = new URL(n.url);
    if (e.line(
      `conn = http.client.HTTPSConnection("${d.hostname}", ${d.port || (d.protocol === "https:" ? 443 : 80)})`
    ), e.line(), i && (l.push("payload"), e.line(`payload = json.dumps(${JSON.stringify(n.body)})`), e.line()), s) {
      l.push("headers"), e.line("headers = {"), e.indent();
      for (const [u, c] of Object.entries(n.headers))
        Array.isArray(c) ? e.line(`"${u}": "${c.join(", ")}",`) : e.line(`"${u}": "${c}",`);
      e.outdent(), e.line("}"), e.line();
    }
    if (t) {
      l.push("cookies"), e.line("cookies = {"), e.indent();
      for (const [u, c] of Object.entries(n.cookies))
        e.line(`"${u}": "${c}",`);
      e.outdent(), e.line("}"), e.line();
    }
    return e.line(
      `conn.request("${r}", "${d.pathname + d.search}"` + (l.length > 0 ? `, ${l.join(", ")}` : "") + ")"
    ), e.line("res = conn.getresponse()"), e.line("data = res.read()"), e.line(), e.line('print(data.decode("utf-8"))'), e.output();
  }
}, w = {
  language: "python",
  target: "requests",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    }), i = n.method.toUpperCase() !== "GET" && n.body, s = n.headers && Object.keys(n.headers).length > 0, t = n.cookies && Object.keys(n.cookies).length > 0;
    let l = [];
    if (e.line("import requests"), e.line(), e.line('url = "' + n.url + '"'), s) {
      l.push("headers=headers"), e.line("headers = {"), e.indent();
      for (const [d, u] of Object.entries(n.headers))
        Array.isArray(u) ? e.line(`"${d}": "${u.join(", ")}",`) : e.line(`"${d}": "${u}",`);
      e.outdent(), e.line("}");
    }
    if (t) {
      l.push("cookies=cookies"), e.line("cookies = {"), e.indent();
      for (const [d, u] of Object.entries(n.cookies))
        e.line(`"${d}": "${u}",`);
      e.outdent(), e.line("}");
    }
    return i && (l.push("data=data"), e.line("data = " + JSON.stringify(n.body))), e.line(), e.line(
      "response = requests." + n.method.toLowerCase() + "(url" + (l.length > 0 ? `, ${l.join(", ")}` : "") + ")"
    ), e.line("print(response.text)"), e.output();
  }
}, T = {
  default: !0,
  language: "ruby",
  target: "nethttp",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line('require "net/http"'), e.line('require "uri"'), e.line(), e.line('uri = URI.parse("' + n.url + '")'), n.method.toUpperCase() === "GET" ? e.line("request = Net::HTTP::Get.new(uri)") : n.method.toUpperCase() === "POST" ? e.line("request = Net::HTTP::Post.new(uri)") : n.method.toUpperCase() === "PUT" ? e.line("request = Net::HTTP::Put.new(uri)") : n.method.toUpperCase() === "DELETE" ? e.line("request = Net::HTTP::Delete.new(uri)") : e.line('request = Net::HTTP::GenericRequest.new("' + n.method.toUpperCase() + '", uri.path, nil, nil)'), n.headers && Object.keys(n.headers).length > 0)
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? i.forEach((s) => e.line(`request["${r}"] = "${s}"`)) : e.line(`request["${r}"] = "${i}"`);
    if (n.cookies && Object.keys(n.cookies).length > 0)
      for (const [r, i] of Object.entries(n.cookies))
        e.line(`request["Cookie"] = "${r}=${i}"`);
    return n.body && e.line("request.body = " + JSON.stringify(n.body)), e.line(), e.line('response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|'), e.indent(), e.line("http.request(request)"), e.outdent(), e.line("end"), e.line(), e.line("puts response.body"), e.output();
  }
}, _ = {
  language: "ruby",
  target: "faraday",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line('require "faraday"'), e.line(), e.line('conn = Faraday.new(url: "' + n.url + '") do |f|'), e.indent(), e.line("f.adapter Faraday.default_adapter"), e.outdent(), e.line("end"), e.line(), e.line("response = conn." + n.method.toLowerCase() + " do |req|"), e.indent(), e.line('req.url "' + n.url + '"'), n.headers)
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? i.forEach((s) => e.line(`req.headers["${r}"] = "${s}"`)) : e.line(`req.headers["${r}"] = "${i}"`);
    if (n.cookies)
      for (const [r, i] of Object.entries(n.cookies))
        e.line(`req.headers["Cookie"] = "${r}=${i}"`);
    return n.body && e.line("req.body = " + JSON.stringify(n.body)), e.outdent(), e.line("end"), e.line(), e.line("puts response.body"), e.output();
  }
}, S = {
  language: "rust",
  target: "reqwest",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line("use reqwest::blocking::Client;"), e.line("use std::error::Error;"), e.line(), e.line("fn main() -> Result<(), Box<dyn Error>> {"), e.indent(), e.line("let client = Client::new();"), e.line(), e.line("let res = client.request(reqwest::Method::" + n.method.toUpperCase() + ', "' + n.url + '")'), e.indent(), n.headers)
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? i.forEach((s) => e.line(`.header("${r}", "${s}")`)) : e.line(`.header("${r}", "${i}")`);
    if (n.cookies)
      for (const [r, i] of Object.entries(n.cookies))
        Array.isArray(i) ? i.forEach((s) => e.line(`.cookie("${r}", "${s}")`)) : e.line(`.cookie("${r}", "${i}")`);
    return n.body && e.line('.body("' + JSON.stringify(n.body).replace(/"/g, '"') + '")'), e.line(".send()?;"), e.outdent(), e.line(), o.handleErrors ? (e.line("if res.status().is_success() {"), e.indent(), e.line('println!("{}", res.text()?);'), e.outdent(), e.line("} else {"), e.indent(), e.line('eprintln!("Request failed with status: {}", res.status());'), e.outdent(), e.line("}")) : e.line('println!("{}", res.text()?);'), e.line("Ok(())"), e.outdent(), e.line("}"), e.output();
  }
}, A = {
  default: !0,
  language: "swift",
  target: "nsurlsession",
  generate(o, n) {
    const e = new a({
      indent: o.indent || "  ",
      join: o.join || `
`
    });
    if (e.line("import Foundation"), e.line(), e.line('let url = URL(string: "' + n.url + '")!'), e.line("var request = URLRequest(url: url)"), e.line('request.httpMethod = "' + n.method.toUpperCase() + '"'), e.line(), n.headers && Object.keys(n.headers).length > 0) {
      for (const [r, i] of Object.entries(n.headers))
        Array.isArray(i) ? i.forEach((s) => e.line(`request.addValue("${s}", forHTTPHeaderField: "${r}")`)) : e.line(`request.addValue("${i}", forHTTPHeaderField: "${r}")`);
      e.line();
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      for (const [r, i] of Object.entries(n.cookies))
        e.line(`request.addValue("${r}=${i}", forHTTPHeaderField: "Cookie")`);
      e.line();
    }
    return n.body && (e.line(
      "let body = try! JSONSerialization.data(withJSONObject: " + JSON.stringify(n.body) + ", options: [])"
    ), e.line("request.httpBody = body"), e.line()), e.line("let task = URLSession.shared.dataTask(with: request) { data, response, error in"), e.indent(), e.line("if let error = error {"), e.indent(), e.line('print("Error: (error)")'), e.line("return"), e.outdent(), e.line("}"), e.line(), e.line("if let httpResponse = response as? HTTPURLResponse {"), e.indent(), e.line("if httpResponse.statusCode == 200, let data = data {"), e.indent(), e.line("let responseString = String(data: data, encoding: .utf8)"), e.line('print(responseString ?? "No response data")'), e.outdent(), e.line("} else {"), e.indent(), e.line('print("Request failed with status code: (httpResponse.statusCode)")'), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.line(), e.line("task.resume()"), e.output();
  }
}, E = [
  y,
  $,
  g,
  b,
  j,
  h,
  k,
  p,
  O,
  C,
  m,
  q,
  R,
  w,
  T,
  _,
  S,
  A
];
export {
  E as default
};
