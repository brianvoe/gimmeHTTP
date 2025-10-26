const h = [];
function W() {
  return h;
}
function Q() {
  return h.map((i) => i.language).filter((i, n, e) => e.indexOf(i) === n);
}
function k(i, n) {
  if (i === "" || i === void 0)
    return null;
  const e = h.filter((t) => t.language.toLowerCase() === i.toLowerCase());
  if (e.length === 0)
    return null;
  const o = e.find((t) => t.default) || e[0];
  if (!n)
    return o;
  const r = e.find((t) => t.client.toLowerCase() === n.toLowerCase());
  return r || o;
}
function X(i, n) {
  const e = k(i, n);
  e && (e.default = !0);
}
function u(i) {
  if (!i)
    return new Error("Client is required");
  if (Array.isArray(i))
    return i.forEach((o) => u(o)), null;
  const n = h.filter((o) => o.language.toLowerCase() === i.language.toLowerCase()), e = n.find((o) => o.client.toLowerCase() === i.client.toLowerCase());
  if (i.default === void 0 && (i.default = n.length === 0), e) {
    const o = h.indexOf(i);
    return h[o] = i, null;
  }
  return h.push(i), null;
}
function Y() {
  h.splice(0, h.length);
}
function Z(i) {
  let n = O(i);
  if (n)
    return { error: n.message };
  i.config = w(i.config), i.language || (i.language = "javascript");
  const e = k(i.language, i.client);
  if (!e)
    return { error: "Client not found" };
  const o = e.generate(i.config, i.http);
  return {
    language: e.language,
    client: e.client,
    code: o
  };
}
function O(i) {
  if (!i)
    return new Error("Request is required");
  if (!i.http)
    return new Error("http is required");
  if (!i.http.method)
    return new Error("http.method is required");
  if (!i.http.url)
    return new Error("http.url is required");
}
function w(i) {
  return i = i || {}, i.handleErrors === void 0 && (i.handleErrors = !1), i;
}
class c {
  code = [];
  indentChar;
  lineJoin;
  currentDepth = 0;
  jsonConfig = {
    objOpen: "{",
    objClose: "}",
    arrOpen: "[",
    arrClose: "]",
    separator: ": ",
    endComma: !1
  };
  constructor(n = {}) {
    this.indentChar = n.indent || "  ", this.lineJoin = n.join || `
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
function C(i) {
  let n, e, o, r, t;
  try {
    const l = new URL(i);
    n = l.hostname, e = l.pathname, t = l.search, o = l.port ? parseInt(l.port) : l.protocol === "https:" ? 443 : 80, r = l.protocol;
  } catch {
    const s = i.split("/");
    n = s[0];
    const d = "/" + s.slice(1).join("/"), [f, y] = d.split("?");
    e = f, t = y ? "?" + y : "", o = 80, r = "http:";
  }
  return e.startsWith("/") || (e = "/" + e), { hostname: n, path: e, port: o, protocol: r, params: t };
}
function ee(i, n) {
  return i.toUpperCase() === "POST" && n !== void 0 && Object.keys(n).some(
    (e) => e.toLowerCase() === "content-type" && n[e].toLowerCase() === "application/json"
  );
}
function p(i) {
  if (!i) return "";
  for (const [n, e] of Object.entries(i))
    if (n.toLowerCase() === "content-type")
      return Array.isArray(e) ? e[0] : e;
  for (const [n, e] of Object.entries(i))
    if (n.toLowerCase() === "accept")
      return Array.isArray(e) ? e[0] : e;
  return "";
}
function m(i) {
  return i ? typeof i == "string" ? i.length > 0 : typeof i == "object" ? Object.keys(i).length > 0 : !1 : !1;
}
function j(i) {
  return typeof i == "string";
}
function $(i) {
  return i != null && typeof i == "object";
}
function a(i, n) {
  const e = i.toLowerCase();
  switch (n) {
    case "json":
      return e.includes("application/json");
    case "xml":
      return e.includes("application/xml") || e.includes("text/xml");
    case "form":
      return e.includes("application/x-www-form-urlencoded");
    case "text":
      return e.includes("text/");
    case "blob":
      return e.includes("application/octet-stream") || e.includes("image/");
    default:
      return !1;
  }
}
function E(i) {
  return "application/octet-stream";
}
function q(i, n) {
  const e = p(i);
  return e ? { contentType: e, wasInferred: !1 } : { contentType: E(), wasInferred: !0 };
}
const T = {
  default: !0,
  language: "c",
  client: "libcurl",
  generate(i, n) {
    const e = new c({
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
    return n.body && (e.line(), p(n.headers), j(n.body) ? e.line(`curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "${n.body.replace(/"/g, '\\"')}");`) : (e.line('curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"('), e.json(n.body), e.append(')");'))), e.line(), e.line("res = curl_easy_perform(curl);"), e.line("if(res != CURLE_OK)"), e.indent(), e.line('fprintf(stderr, "failed: %s", curl_easy_strerror(res));'), e.outdent(), n.headers && Object.keys(n.headers).length > 0 && e.line("curl_slist_free_all(headers);"), e.line("curl_easy_cleanup(curl);"), e.outdent(), e.line("}"), e.line(), e.line("curl_global_cleanup();"), e.line("return 0;"), e.outdent(), e.line("}"), e.output();
  }
}, R = {
  default: !0,
  language: "csharp",
  client: "http",
  generate(i, n) {
    const e = new c({
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
    if (n.body) {
      e.line();
      const o = p(n.headers);
      if (a(o, "form")) {
        e.line("var formContent = new FormUrlEncodedContent(new Dictionary<string, string>"), e.line("{"), e.indent();
        for (const [r, t] of Object.entries(n.body))
          e.line(`{ "${r}", "${t}" },`);
        e.outdent(), e.line("});"), e.line("request.Content = formContent;");
      } else
        e.line("request.Content = new StringContent("), e.json(n.body), e.append(', System.Text.Encoding.UTF8, "application/json");');
    }
    return e.line(), e.line("HttpResponseMessage response = await client.SendAsync(request);"), e.line("response.EnsureSuccessStatusCode();"), e.line("string responseBody = await response.Content.ReadAsStringAsync();"), e.line("Console.WriteLine(responseBody);"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, S = {
  language: "csharp",
  client: "restsharp",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line("using RestSharp;"), i.handleErrors && e.line("using System;"), e.line(), e.line("namespace RestSharpExample"), e.line("{"), e.indent(), e.line("class Program"), e.line("{"), e.indent(), e.line("static void Main(string[] args)"), e.line("{"), e.indent(), i.handleErrors && (e.line("try"), e.line("{"), e.indent()), e.line(`var client = new RestClient("${n.url}");`), e.line(`var request = new RestRequest(Method.${n.method.toUpperCase()});`), n.headers && Object.keys(n.headers).length > 0) {
      e.line();
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((t) => e.line(`request.AddHeader("${o}", "${t}");`)) : e.line(`request.AddHeader("${o}", "${r}");`);
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      e.line();
      const o = Object.entries(n.cookies).map(([r, t]) => `${r}=${t}`).join("; ");
      e.line(`request.AddHeader("Cookie", "${o}");`);
    }
    if (n.body) {
      e.line();
      const o = p(n.headers);
      a(o, "form") ? (e.line('request.AddParameter("application/x-www-form-urlencoded", '), e.json(n.body), e.append(", ParameterType.RequestBody);")) : j(n.body) ? e.line(
        `request.AddParameter("${o || "text/plain"}", "${n.body.replace(/"/g, '\\"')}", ParameterType.RequestBody);`
      ) : (e.line("request.AddJsonBody("), e.json(n.body), e.append(");"));
    }
    return e.line(), e.line("IRestResponse response = client.Execute(request);"), e.line("Console.WriteLine(response.Content);"), i.handleErrors && (e.outdent(), e.line("}"), e.line("catch (Exception ex)"), e.line("{"), e.indent(), e.line('Console.WriteLine($"Error: {ex.Message}");'), e.outdent(), e.line("}")), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, A = {
  default: !0,
  language: "dart",
  client: "http",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    }), o = m(n.body), r = p(n.headers), t = o && (a(r, "json") || !r && $(n.body));
    if (e.line("import 'package:http/http.dart' as http;"), t && e.line("import 'dart:convert';"), e.line(), e.line("void main() async {"), e.indent(), i.handleErrors && (e.line("try {"), e.indent()), e.line(`var url = Uri.parse('${n.url}');`), e.line(), n.headers && Object.keys(n.headers).length > 0) {
      e.line("var headers = {"), e.indent();
      for (const [f, y] of Object.entries(n.headers))
        Array.isArray(y) ? e.line(`'${f}': '${y.join(", ")}',`) : e.line(`'${f}': '${y}',`);
      e.outdent(), e.line("};"), e.line();
    }
    let l = "null";
    o && (a(r, "json") || !r && $(n.body) ? (e.line("var body = jsonEncode("), e.json(n.body), e.append(");"), l = "body", e.line()) : j(n.body) && (e.line(`var body = '${n.body.replace(/'/g, "\\'")}';`), l = "body", e.line()));
    const s = n.method.toLowerCase(), d = n.headers && Object.keys(n.headers).length > 0;
    return s === "get" ? e.line(`var response = await http.get(url${d ? ", headers: headers" : ""});`) : s === "post" ? e.line(
      `var response = await http.post(url${d ? ", headers: headers" : ""}${l !== "null" ? ", body: " + l : ""});`
    ) : s === "put" ? e.line(
      `var response = await http.put(url${d ? ", headers: headers" : ""}${l !== "null" ? ", body: " + l : ""});`
    ) : s === "delete" ? e.line(
      `var response = await http.delete(url${d ? ", headers: headers" : ""}${l !== "null" ? ", body: " + l : ""});`
    ) : s === "patch" && e.line(
      `var response = await http.patch(url${d ? ", headers: headers" : ""}${l !== "null" ? ", body: " + l : ""});`
    ), e.line(), e.line("print(response.body);"), i.handleErrors && (e.outdent(), e.line("} catch (e) {"), e.indent(), e.line('print("Error: $e");'), e.outdent(), e.line("}")), e.outdent(), e.line("}"), e.output();
  }
}, _ = {
  default: !0,
  language: "go",
  client: "http",
  generate(i, n) {
    const e = new c({
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
    }), o = p(n.headers), r = m(n.body), t = r && (a(o, "json") || !o && $(n.body)), l = r && a(o, "form"), s = t || l;
    e.line("package main"), e.line(), e.line("import ("), e.indent(), e.line('"fmt"'), e.line('"net/http"'), e.line('"io"'), s && e.line('"bytes"'), t && e.line('"encoding/json"'), l && e.line('"net/url"'), i.handleErrors && e.line('"log"'), e.outdent(), e.line(")"), e.line(), e.line("func main() {"), e.indent(), e.line(`url := "${n.url}"`), e.line();
    let d = "nil";
    if (t)
      e.line("jsonBodyMap := "), e.json(n.body), i.handleErrors ? (e.line("jsonBodyBytes, err := json.Marshal(jsonBodyMap)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("jsonBodyBytes, _ := json.Marshal(jsonBodyMap)"), d = "bytes.NewBuffer(jsonBodyBytes)", e.line();
    else if (l) {
      e.line("formData := url.Values{}");
      for (const [f, y] of Object.entries(n.body))
        e.line(`formData.Set("${f}", "${y}")`);
      e.line("formBody := formData.Encode()"), d = "bytes.NewBufferString(formBody)", e.line();
    } else r && typeof n.body == "string" && (d = `bytes.NewBufferString("${n.body.replace(/"/g, '\\"')}")`);
    if (i.handleErrors ? (e.line(`req, err := http.NewRequest("${n.method.toUpperCase()}", url, ${d})`), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}"), e.line()) : (e.line(`req, _ := http.NewRequest("${n.method.toUpperCase()}", url, ${d})`), e.line()), n.headers) {
      for (const [f, y] of Object.entries(n.headers))
        if (Array.isArray(y))
          for (const b of y)
            e.line(`req.Header.Add("${f}", "${b}")`);
        else
          e.line(`req.Header.Set("${f}", "${y}")`);
      e.line();
    }
    if (n.cookies) {
      for (const [f, y] of Object.entries(n.cookies))
        if (Array.isArray(y))
          for (const b of y)
            e.line(`req.AddCookie(&http.Cookie{Name: "${f}", Value: "${b}"})`);
        else
          e.line(`req.AddCookie(&http.Cookie{Name: "${f}", Value: "${y}"})`);
      e.line();
    }
    return i.handleErrors ? (e.line("resp, err := http.DefaultClient.Do(req)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("resp, _ := http.DefaultClient.Do(req)"), e.line("defer resp.Body.Close()"), e.line(), i.handleErrors ? (e.line("body, err := io.ReadAll(resp.Body)"), e.line("if err != nil {"), e.indent(), e.line("log.Fatal(err)"), e.outdent(), e.line("}")) : e.line("body, _ := io.ReadAll(resp.Body)"), e.line(), e.line("fmt.Println(string(body))"), e.outdent(), e.line("}"), e.output();
  }
}, v = {
  default: !0,
  language: "java",
  client: "httpurlconnection",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    }), o = m(n.body), r = p(n.headers);
    if (e.line("import java.io.*;"), e.line("import java.net.*;"), o && (a(r, "json") || !r && $(n.body)) && e.line("import org.json.JSONObject;"), e.line(), e.line("public class HttpExample {"), e.indent(), e.line("public static void main(String[] args) {"), e.indent(), i.handleErrors && (e.line("try {"), e.indent()), e.line(`URL url = new URL("${n.url}");`), e.line("HttpURLConnection conn = (HttpURLConnection) url.openConnection();"), e.line(`conn.setRequestMethod("${n.method.toUpperCase()}");`), n.headers && Object.keys(n.headers).length > 0) {
      e.line();
      for (const [t, l] of Object.entries(n.headers))
        Array.isArray(l) ? l.forEach((s) => e.line(`conn.setRequestProperty("${t}", "${s}");`)) : e.line(`conn.setRequestProperty("${t}", "${l}");`);
    }
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      e.line();
      const t = Object.entries(n.cookies).map(([l, s]) => `${l}=${s}`).join("; ");
      e.line(`conn.setRequestProperty("Cookie", "${t}");`);
    }
    if (o)
      if (e.line(), e.line("conn.setDoOutput(true);"), e.line(), a(r, "json") || !r && $(n.body)) {
        e.line("JSONObject jsonBody = new JSONObject();");
        for (const [t, l] of Object.entries(n.body))
          typeof l == "string" ? e.line(`jsonBody.put("${t}", "${l}");`) : typeof l == "number" || typeof l == "boolean" ? e.line(`jsonBody.put("${t}", ${l});`) : l === null ? e.line(`jsonBody.put("${t}", JSONObject.NULL);`) : e.line(`jsonBody.put("${t}", ${JSON.stringify(l)});`);
        e.line(), e.line("try (OutputStream os = conn.getOutputStream()) {"), e.indent(), e.line('byte[] input = jsonBody.toString().getBytes("utf-8");'), e.line("os.write(input, 0, input.length);"), e.outdent(), e.line("}");
      } else j(n.body) && (e.line("try (OutputStream os = conn.getOutputStream()) {"), e.indent(), e.line(`byte[] input = "${n.body.replace(/"/g, '\\"')}".getBytes("utf-8");`), e.line("os.write(input, 0, input.length);"), e.outdent(), e.line("}"));
    return e.line(), e.line("int responseCode = conn.getResponseCode();"), e.line("BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));"), e.line("String inputLine;"), e.line("StringBuilder response = new StringBuilder();"), e.line(), e.line("while ((inputLine = in.readLine()) != null) {"), e.indent(), e.line("response.append(inputLine);"), e.outdent(), e.line("}"), e.line("in.close();"), e.line(), e.line("System.out.println(response.toString());"), i.handleErrors && (e.outdent(), e.line("} catch (Exception e) {"), e.indent(), e.line("e.printStackTrace();"), e.outdent(), e.line("}")), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, B = {
  language: "java",
  client: "okhttp",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    }), o = m(n.body), r = p(n.headers), t = o && (a(r, "json") || !r && $(n.body));
    if (e.line("import okhttp3.*;"), t && e.line("import org.json.JSONObject;"), r && a(r, "form") && e.line("import java.util.*;"), e.line(), e.line("public class HttpExample {"), e.indent(), e.line("public static void main(String[] args) {"), e.indent(), i.handleErrors && (e.line("try {"), e.indent()), e.line("OkHttpClient client = new OkHttpClient();"), e.line(), o) {
      if (a(r, "form")) {
        e.line("FormBody.Builder formBuilder = new FormBody.Builder();");
        for (const [l, s] of Object.entries(n.body))
          e.line(`formBuilder.add("${l}", "${s}");`);
        e.line("RequestBody body = formBuilder.build();");
      } else if (t) {
        e.line("JSONObject jsonBody = new JSONObject();");
        for (const [l, s] of Object.entries(n.body))
          typeof s == "string" ? e.line(`jsonBody.put("${l}", "${s}");`) : typeof s == "number" || typeof s == "boolean" ? e.line(`jsonBody.put("${l}", ${s});`) : s === null ? e.line(`jsonBody.put("${l}", JSONObject.NULL);`) : e.line(`jsonBody.put("${l}", ${JSON.stringify(s)});`);
        e.line("RequestBody body = RequestBody.create("), e.indent(), e.line("jsonBody.toString(),"), e.line('MediaType.parse("application/json; charset=utf-8")'), e.outdent(), e.line(");");
      } else j(n.body) && (e.line("RequestBody body = RequestBody.create("), e.indent(), e.line(`"${n.body.replace(/"/g, '\\"')}",`), e.line(`MediaType.parse("${r || "text/plain"}; charset=utf-8")`), e.outdent(), e.line(");"));
      e.line();
    }
    if (e.line("Request.Builder requestBuilder = new Request.Builder()"), e.indent(), e.line(`.url("${n.url}")`), o ? e.line('.method("' + n.method.toUpperCase() + '", body)') : e.line('.method("' + n.method.toUpperCase() + '", null)'), n.headers && Object.keys(n.headers).length > 0)
      for (const [l, s] of Object.entries(n.headers))
        Array.isArray(s) ? s.forEach((d) => e.line(`.addHeader("${l}", "${d}")`)) : e.line(`.addHeader("${l}", "${s}")`);
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const l = Object.entries(n.cookies).map(([s, d]) => `${s}=${d}`).join("; ");
      e.line(`.addHeader("Cookie", "${l}")`);
    }
    return e.line(".build();"), e.outdent(), e.line(), e.line("Request request = requestBuilder;"), e.line("Response response = client.newCall(request).execute();"), e.line(), e.line("System.out.println(response.body().string());"), i.handleErrors && (e.outdent(), e.line("} catch (Exception e) {"), e.indent(), e.line("e.printStackTrace();"), e.outdent(), e.line("}")), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.output();
  }
}, L = {
  default: !0,
  language: "javascript",
  client: "fetch",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line('fetch("' + n.url + '", {'), e.indent(), e.line(`method: "${n.method.toUpperCase()}",`), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [l, s] of Object.entries(n.headers))
        Array.isArray(s) ? e.line(`"${l}": "${s.join(", ")}",`) : e.line(`"${l}": "${s}",`);
      e.outdent(), e.line("},");
    }
    n.body && (e.line("body: "), e.json(n.body)), e.outdent(), e.line("})");
    const { contentType: o, wasInferred: r } = q(n.headers);
    let t = "text()";
    return (!r || o !== "application/octet-stream") && (a(o, "json") ? t = "json()" : a(o, "xml") || a(o, "text") ? t = "text()" : a(o, "blob") && (t = "blob()")), r && t === "json()" && e.line(`// Response Content-Type inferred as: ${o}`), i.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("if (!response.ok) {"), e.indent(), e.line('throw new Error("Network response was not ok");'), e.outdent(), e.line("}"), e.line(`return response.${t};`), e.outdent(), e.line("})"), e.line(".then(data => console.log(data))"), e.line('.catch(error => console.error("There was a problem with the fetch operation:", error));')) : (e.line(`.then(response => response.${t})`), e.line(".then(data => console.log(data));")), e.output();
  }
}, U = {
  language: "javascript",
  client: "axios",
  generate(i, n) {
    const e = new c({
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
}, P = {
  language: "javascript",
  client: "jquery",
  generate(i, n) {
    const e = new c({
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
}, x = {
  default: !0,
  language: "kotlin",
  client: "ktor",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    }), o = m(n.body), r = p(n.headers);
    if (e.line("import io.ktor.client.*"), e.line("import io.ktor.client.engine.cio.*"), e.line("import io.ktor.client.request.*"), e.line("import io.ktor.client.statement.*"), o && (a(r, "json") || !r && $(n.body)) && (e.line("import io.ktor.http.*"), e.line("import kotlinx.serialization.json.*")), r && a(r, "form") && e.line("import io.ktor.http.*"), e.line(), e.line("suspend fun main() {"), e.indent(), i.handleErrors && (e.line("try {"), e.indent()), e.line("val client = HttpClient(CIO)"), e.line(), e.line(`val response: HttpResponse = client.${n.method.toLowerCase()} {`), e.indent(), e.line(`url("${n.url}")`), n.headers && Object.keys(n.headers).length > 0)
      for (const [t, l] of Object.entries(n.headers))
        Array.isArray(l) ? l.forEach((s) => e.line(`header("${t}", "${s}")`)) : e.line(`header("${t}", "${l}")`);
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const t = Object.entries(n.cookies).map(([l, s]) => `${l}=${s}`).join("; ");
      e.line(`header("Cookie", "${t}")`);
    }
    if (o)
      if (a(r, "form")) {
        e.line("setBody("), e.indent(), e.line("FormDataContent(Parameters.build {"), e.indent();
        for (const [t, l] of Object.entries(n.body))
          e.line(`append("${t}", "${l}")`);
        e.outdent(), e.line("})"), e.outdent(), e.line(")");
      } else if (a(r, "json") || !r && $(n.body)) {
        e.line("contentType(ContentType.Application.Json)"), e.line("setBody("), e.indent(), e.line("buildJsonObject {"), e.indent();
        for (const [t, l] of Object.entries(n.body))
          typeof l == "string" ? e.line(`put("${t}", "${l}")`) : typeof l == "number" ? e.line(`put("${t}", ${l})`) : typeof l == "boolean" ? e.line(`put("${t}", ${l})`) : l === null ? e.line(`put("${t}", JsonNull)`) : e.line(`put("${t}", JsonPrimitive(${JSON.stringify(l)}))`);
        e.outdent(), e.line("}"), e.outdent(), e.line(")");
      } else j(n.body) && e.line(`setBody("${n.body.replace(/"/g, '\\"')}")`);
    return e.outdent(), e.line("}"), e.line(), e.line("println(response.bodyAsText())"), e.line("client.close()"), i.handleErrors && (e.outdent(), e.line("} catch (e: Exception) {"), e.indent(), e.line('println("Error: ${e.message}")'), e.outdent(), e.line("}")), e.outdent(), e.line("}"), e.output();
  }
}, H = {
  language: "node",
  client: "http",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    e.line('const http = require("http");'), e.line();
    const { hostname: o, path: r } = C(n.url);
    if (e.line("const options = {"), e.indent(), e.line(`method: "${n.method.toUpperCase()}",`), e.line(`hostname: "${o}",`), e.line(`path: "${r}",`), n.headers || n.cookies) {
      if (e.line("headers: {"), e.indent(), n.headers)
        for (const [t, l] of Object.entries(n.headers))
          Array.isArray(l) ? e.line(`"${t}": "${l.join(", ")}",`) : e.line(`"${t}": "${l}",`);
      if (n.cookies) {
        const t = Object.entries(n.cookies).map(([l, s]) => `${l}=${s}`).join("; ");
        e.line(`"Cookie": "${t}",`);
      }
      e.outdent(), e.line("},");
    }
    return e.outdent(), e.line("};"), e.line(), e.line("const req = http.request(options, (res) => {"), e.indent(), e.line('let data = "";'), e.line(), e.line('res.on("data", (chunk) => {'), e.indent(), e.line("data += chunk;"), e.outdent(), e.line("});"), e.line(), e.line('res.on("end", () => {'), e.indent(), e.line("console.log(data);"), e.outdent(), e.line("});"), e.outdent(), e.line("});"), i.handleErrors && (e.line(), e.line('req.on("error", (error) => {'), e.indent(), e.line("console.error(error);"), e.outdent(), e.line("});")), e.line(), n.body && (e.line("req.write("), e.json(n.body), e.append(");")), e.line("req.end();"), e.output();
  }
}, N = {
  language: "node",
  client: "fetch",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line('const fetch = require("node-fetch");'), e.line(), e.line('fetch("' + n.url + '", {'), e.indent(), e.line('method: "' + n.method.toUpperCase() + '",'), n.headers) {
      e.line("headers: {"), e.indent();
      for (const [t, l] of Object.entries(n.headers))
        Array.isArray(l) ? e.line(`"${t}": "${l.join(", ")}",`) : e.line(`"${t}": "${l}",`);
      e.outdent(), e.line("},");
    }
    n.body && (e.line("body: "), e.json(n.body)), e.outdent(), e.line("})");
    const o = p(n.headers);
    let r = "text()";
    return a(o, "json") ? r = "json()" : a(o, "xml") || a(o, "text") ? r = "text()" : a(o, "blob") && (r = "blob()"), i.handleErrors ? (e.line(".then(response => {"), e.indent(), e.line("if (!response.ok) {"), e.indent(), e.line('throw new Error("response not ok");'), e.outdent(), e.line("}"), e.line(`return response.${r};`), e.outdent(), e.line("})"), e.line(".then(data => console.log(data))"), e.line('.catch(error => console.error("error:", error));')) : (e.line(`.then(response => response.${r})`), e.line(".then(data => console.log(data))")), e.output();
  }
}, J = {
  default: !0,
  language: "php",
  client: "curl",
  generate(i, n) {
    const e = new c({
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
    if (n.body) {
      e.line();
      const o = p(n.headers);
      if (a(o, "form"))
        e.line("$postData = "), e.json(n.body), e.append(";"), e.line("curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));");
      else if (a(o, "json") || !o && $(n.body))
        e.line("curl_setopt($ch, CURLOPT_POSTFIELDS,"), e.line("<<<JSON"), e.line(), e.json(n.body), e.line("JSON"), e.line(");");
      else if (j(n.body)) {
        const r = n.body.replace(/'/g, "\\'");
        e.line(`curl_setopt($ch, CURLOPT_POSTFIELDS, '${r}');`);
      }
    }
    return e.line(), e.line("$response = curl_exec($ch);"), i.handleErrors && (e.line("if (curl_errno($ch)) {"), e.indent(), e.line('echo "Error: " . curl_error($ch);'), e.outdent(), e.line("}")), e.line("curl_close($ch);"), e.line(), e.line("echo $response;"), e.output();
  }
}, D = {
  language: "php",
  client: "guzzle",
  generate(i, n) {
    const e = new c({
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
    if (e.line("<?php"), e.line(), e.line("require 'vendor/autoload.php';"), e.line(), e.line("use GuzzleHttp\\Client;"), i.handleErrors && e.line("use GuzzleHttp\\Exception\\RequestException;"), e.line(), i.handleErrors && (e.line("try {"), e.indent()), e.line("$client = new Client();"), e.line("$response = $client->request("), e.indent(), e.line('"' + n.method.toUpperCase() + '",'), e.line('"' + n.url + '",'), n.headers || n.cookies || n.body) {
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
      if (n.body) {
        e.indent();
        const o = p(n.headers);
        a(o, "form") ? (e.line('"form_params" => '), e.json(n.body), e.append(",")) : (e.line('"json" => '), e.json(n.body), e.append(",")), e.outdent();
      }
      e.line("],");
    }
    return e.outdent(), e.line(");"), e.line(), e.line("echo $response->getBody();"), i.handleErrors && (e.outdent(), e.line("} catch (RequestException $e) {"), e.indent(), e.line('echo "Error: " . $e->getMessage();'), e.outdent(), e.line("}")), e.output();
  }
}, F = {
  default: !0,
  language: "python",
  client: "http",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    }), o = n.method.toUpperCase(), r = o !== "GET" && n.body, t = n.headers && Object.keys(n.headers).length > 0, l = n.cookies && Object.keys(n.cookies).length > 0;
    let s = [];
    e.line("import http.client"), e.line("import json"), e.line(), i.handleErrors && (e.line("try:"), e.indent());
    const { hostname: d, path: f, port: y } = C(n.url);
    if (e.line(`conn = http.client.HTTPSConnection("${d}", ${y})`), t) {
      e.line(), s.push("headers"), e.line("headers = {"), e.indent();
      for (const [b, g] of Object.entries(n.headers))
        Array.isArray(g) ? e.line(`"${b}": "${g.join(", ")}",`) : e.line(`"${b}": "${g}",`);
      e.outdent(), e.line("}");
    }
    if (l) {
      e.line(), s.push("cookies"), e.line("cookies = {"), e.indent();
      for (const [b, g] of Object.entries(n.cookies))
        e.line(`"${b}": "${g}",`);
      e.outdent(), e.line("}");
    }
    if (r) {
      e.line();
      const b = p(n.headers);
      a(b, "form") ? (e.line("from urllib.parse import urlencode"), e.line("payload_dict = "), e.json(n.body), e.line("payload = urlencode(payload_dict)")) : a(b, "json") || !b && $(n.body) ? (e.line("payload_dict = "), e.json(n.body), e.line("payload = json.dumps(payload_dict)")) : j(n.body) && e.line(`payload = "${n.body.replace(/"/g, '\\"')}"`);
    }
    if (e.line(), r) {
      const b = s.filter((g) => g !== "payload");
      e.line(
        `conn.request("${o}", "${f}", payload` + (b.length > 0 ? `, ${b.join(", ")}` : "") + ")"
      );
    } else
      e.line(`conn.request("${o}", "${f}"` + (s.length > 0 ? `, ${s.join(", ")}` : "") + ")");
    return e.line("res = conn.getresponse()"), e.line("data = res.read()"), e.line(), e.line('print(data.decode("utf-8"))'), i.handleErrors && (e.outdent(), e.line("except Exception as e:"), e.indent(), e.line('print(f"Error: {e}")'), e.outdent()), e.output();
  }
}, M = {
  language: "python",
  client: "requests",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    }), r = n.method.toUpperCase() !== "GET" && n.body, t = n.headers && Object.keys(n.headers).length > 0, l = n.cookies && Object.keys(n.cookies).length > 0;
    let s = [];
    if (e.line("import requests"), e.line(), i.handleErrors && (e.line("try:"), e.indent()), e.line('url = "' + n.url + '"'), t) {
      e.line(), s.push("headers=headers"), e.line("headers = {"), e.indent();
      for (const [d, f] of Object.entries(n.headers))
        e.line(`"${d}": "${f}"`), Object.keys(n.headers).indexOf(d) !== Object.keys(n.headers).length - 1 && e.append(",");
      e.outdent(), e.line("}");
    }
    if (l) {
      e.line(), s.push("cookies=cookies"), e.line("cookies = {"), e.indent();
      for (const [d, f] of Object.entries(n.cookies))
        e.line(`"${d}": "${f}"`), Object.keys(n.cookies).indexOf(d) !== Object.keys(n.cookies).length - 1 && e.append(",");
      e.outdent(), e.line("}");
    }
    if (r) {
      e.line();
      const d = p(n.headers);
      a(d, "form") ? (s.push("data=form_data"), e.line("form_data = "), e.json(n.body)) : (s.push("json=json_data"), e.line("json_data = "), e.json(n.body));
    }
    return e.line(), e.line(
      "response = requests." + n.method.toLowerCase() + "(url" + (s.length > 0 ? `, ${s.join(", ")}` : "") + ")"
    ), e.line("print(response.text)"), i.handleErrors && (e.outdent(), e.line("except requests.exceptions.RequestException as e:"), e.indent(), e.line('print(f"Error: {e}")'), e.outdent()), e.output();
  }
}, I = {
  default: !0,
  language: "ruby",
  client: "nethttp",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line('require "net/http"'), e.line('require "uri"'), e.line(), i.handleErrors && (e.line("begin"), e.indent()), e.line('uri = URI.parse("' + n.url + '")'), n.method.toUpperCase() === "GET" ? e.line("request = Net::HTTP::Get.new(uri)") : n.method.toUpperCase() === "POST" ? e.line("request = Net::HTTP::Post.new(uri)") : n.method.toUpperCase() === "PUT" ? e.line("request = Net::HTTP::Put.new(uri)") : n.method.toUpperCase() === "DELETE" ? e.line("request = Net::HTTP::Delete.new(uri)") : e.line('request = Net::HTTP::GenericRequest.new("' + n.method.toUpperCase() + '", uri.path, nil, nil)'), n.headers && Object.keys(n.headers).length > 0)
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((t) => e.line(`request["${o}"] = "${t}"`)) : e.line(`request["${o}"] = "${r}"`);
    if (n.cookies && Object.keys(n.cookies).length > 0) {
      const o = Object.entries(n.cookies).map(([r, t]) => `${r}=${t}`).join("; ");
      e.line(`request["Cookie"] = "${o}"`);
    }
    if (n.body) {
      const o = p(n.headers);
      a(o, "json") || !o && $(n.body) ? (e.line("request.body = "), e.json(n.body), e.append(".to_json")) : j(n.body) ? e.line(`request.body = "${n.body.replace(/"/g, '\\"')}"`) : (e.line("request.body = "), e.json(n.body), e.append(".to_json"));
    }
    return e.line(), e.line('response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|'), e.indent(), e.line("http.request(request)"), e.outdent(), e.line("end"), e.line(), e.line("puts response.body"), i.handleErrors && (e.outdent(), e.line("rescue StandardError => e"), e.indent(), e.line('puts "Error: #{e.message}"'), e.outdent(), e.line("end")), e.output();
  }
}, G = {
  language: "ruby",
  client: "faraday",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || `
`
    });
    if (e.line('require "faraday"'), e.line(), i.handleErrors && (e.line("begin"), e.indent()), e.line('conn = Faraday.new(url: "' + n.url + '") do |f|'), e.indent(), e.line("f.adapter Faraday.default_adapter"), e.outdent(), e.line("end"), e.line(), e.line("response = conn." + n.method.toLowerCase() + " do |req|"), e.indent(), e.line('req.url "' + n.url + '"'), n.headers) {
      e.line();
      for (const [o, r] of Object.entries(n.headers))
        Array.isArray(r) ? r.forEach((t) => e.line(`req.headers["${o}"] = "${t}"`)) : e.line(`req.headers["${o}"] = "${r}"`);
    }
    if (n.cookies) {
      e.line();
      const o = Object.entries(n.cookies).map(([r, t]) => `${r}=${t}`).join("; ");
      e.line(`req.headers["Cookie"] = "${o}"`);
    }
    if (n.body) {
      e.line();
      const o = p(n.headers);
      a(o, "json") || !o && $(n.body) ? (e.line("req.body = "), e.json(n.body), e.append(".to_json")) : j(n.body) ? e.line(`req.body = "${n.body.replace(/"/g, '\\"')}"`) : (e.line("req.body = "), e.json(n.body), e.append(".to_json"));
    }
    return e.outdent(), e.line("end"), e.line(), e.line("puts response.body"), i.handleErrors && (e.outdent(), e.line("rescue Faraday::Error => e"), e.indent(), e.line('puts "Error: #{e.message}"'), e.outdent(), e.line("end")), e.output();
  }
}, z = {
  language: "rust",
  client: "reqwest",
  generate(i, n) {
    const e = new c({
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
    if (n.body) {
      const o = p(n.headers);
      a(o, "form") ? (e.line(".form(&"), e.json(n.body), e.append(")")) : a(o, "json") || !o && $(n.body) ? (e.line(".json(&"), e.json(n.body), e.append(")")) : j(n.body) && e.line(`.body("${n.body.replace(/"/g, '\\"')}")`);
    }
    return e.line(".send()?;"), e.outdent(), e.line(), i.handleErrors ? (e.line("if res.status().is_success() {"), e.indent(), e.line('println!("{}", res.text()?);'), e.outdent(), e.line("} else {"), e.indent(), e.line('eprintln!("Request failed with status: {}", res.status());'), e.outdent(), e.line("}")) : e.line('println!("{}", res.text()?);'), e.line("Ok(())"), e.outdent(), e.line("}"), e.output();
  }
}, V = {
  default: !0,
  language: "shell",
  client: "curl",
  generate(i, n) {
    const e = new c({
      indent: i.indent || "  ",
      join: i.join || ` \\
`
    });
    if (e.line(`curl -X ${n.method} "${n.url}"`), e.indent(), n.headers)
      for (const [t, l] of Object.entries(n.headers))
        if (Array.isArray(l))
          for (const s of l)
            e.line(`-H "${t}: ${s.replace(/"/g, '\\"')}"`);
        else
          e.line(`-H "${t}: ${l.replace(/"/g, '\\"')}"`);
    if (n.cookies) {
      const t = Object.entries(n.cookies).flatMap(([l, s]) => Array.isArray(s) ? s.map((d) => `${l}=${d}`) : `${l}=${s}`).join("; ");
      e.line(`-b "${t}"`);
    }
    if (m(n.body)) {
      const t = p(n.headers);
      if (a(t, "json") || !t && $(n.body))
        e.line("-d $'"), e.json(n.body), e.append("'");
      else if (a(t, "form")) {
        const l = new URLSearchParams(n.body).toString().replace(/'/g, "'\\''");
        e.line(`-d '${l}'`);
      } else if (typeof n.body == "string") {
        const l = n.body.replace(/'/g, "'\\''");
        e.line(`-d '${l}'`);
      }
    }
    let r = e.output();
    return r = r.replace(/\\\s*$/, "").trim(), r;
  }
}, K = {
  default: !0,
  language: "swift",
  client: "nsurlsession",
  generate(i, n) {
    const e = new c({
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
    return n.body && (e.line(), typeof n.body == "string" ? (e.line(`let bodyString = "${n.body.replace(/"/g, '\\"')}"`), e.line("request.httpBody = bodyString.data(using: .utf8)")) : (e.line("let bodyDict: [String: Any] = "), e.json(n.body), e.line("request.httpBody = try? JSONSerialization.data(withJSONObject: bodyDict)"))), e.line(), e.line("let task = URLSession.shared.dataTask(with: request) { data, response, error in"), e.indent(), e.line("if let error = error {"), e.indent(), e.line('print("Error: \\(error)")'), e.line("return"), e.outdent(), e.line("}"), e.line(), e.line("if let httpResponse = response as? HTTPURLResponse {"), e.indent(), e.line("if httpResponse.statusCode == 200, let data = data {"), e.indent(), e.line("let responseString = String(data: data, encoding: .utf8)"), e.line('print(responseString ?? "No response data")'), e.outdent(), e.line("} else {"), e.indent(), e.line('print("Request failed with status code: \\(httpResponse.statusCode)")'), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.outdent(), e.line("}"), e.line(), e.line("task.resume()"), e.output();
  }
};
u(T);
u(R);
u(S);
u(A);
u(_);
u(v);
u(B);
u(L);
u(U);
u(P);
u(x);
u(H);
u(N);
u(J);
u(D);
u(F);
u(M);
u(I);
u(G);
u(z);
u(V);
u(K);
export {
  c as Builder,
  Y as ClearRegistry,
  W as Clients,
  Z as Generate,
  ee as IsJsonRequest,
  Q as Languages,
  u as Register,
  k as Search,
  X as SetDefault
};
//# sourceMappingURL=gimmehttp.es.js.map
