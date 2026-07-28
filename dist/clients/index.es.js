import { a as e, d as t, f as n, i as r, l as i, n as a, o, p as s, r as c, s as l, t as u, u as d } from "../utils-DzWeSdpz.mjs";
//#region src/gimmehttp/clients/c.libcurl.ts
var f = (e) => c(e).replace(/\?/g, "\\?"), p = {
	default: !0,
	language: "c",
	client: "libcurl",
	generate(t, n) {
		let o = new s({
			indent: t.indent || "  ",
			join: t.join || "\n",
			json: { escapeString: f }
		});
		if (o.line("#include <stdio.h>"), o.line("#include <curl/curl.h>"), o.line(), o.line("int main(void) {"), o.indent(), o.line("CURL *curl;"), o.line("CURLcode res;"), o.line(), o.line("curl_global_init(CURL_GLOBAL_DEFAULT);"), o.line("curl = curl_easy_init();"), o.line("if(curl) {"), o.indent(), n.params && Object.keys(n.params).length > 0) {
			let e = new URLSearchParams();
			for (let [t, r] of Object.entries(n.params)) if (Array.isArray(r)) for (let n of r) e.append(t, n);
			else e.append(t, r);
			let t = e.toString();
			if (t) {
				let e = n.url.includes("?") ? "&" : "?", r = t.split("&");
				o.line("curl_easy_setopt(curl, CURLOPT_URL,"), o.indent(), o.line("\"%s\"", n.url), o.line("\"%s\"", e + r[0]);
				for (let e = 1; e < r.length; e++) o.line("\"&%s\"", r[e]);
				o.outdent(), o.line(");");
			} else o.line("curl_easy_setopt(curl, CURLOPT_URL, \"%s\");", n.url);
		} else o.line("curl_easy_setopt(curl, CURLOPT_URL, \"%s\");", n.url);
		n.method.toUpperCase() === "POST" ? o.line("curl_easy_setopt(curl, CURLOPT_POST, 1L);") : n.method.toUpperCase() !== "GET" && o.line("curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, \"%s\");", n.method.toUpperCase());
		let c = e(n.headers), l = Object.keys(n.headers || {}).some((e) => e.toLowerCase() === "content-type"), u = i(n.body) && !l && !a(c, "form"), p = n.headers && Object.keys(n.headers).length > 0 || u;
		if (p) {
			o.line(), o.line("struct curl_slist *headers = NULL;");
			for (let [e, t] of Object.entries(n.headers || {})) Array.isArray(t) ? t.forEach((t) => o.line("headers = curl_slist_append(headers, \"%s\");", `${e}: ${t}`)) : o.line("headers = curl_slist_append(headers, \"%s\");", `${e}: ${t}`);
			u && o.line("headers = curl_slist_append(headers, \"Content-Type: application/json\");"), o.line("curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);");
		}
		if (n.cookies && Object.keys(n.cookies).length > 0 && (o.line(), o.line("curl_easy_setopt(curl, CURLOPT_COOKIE, \"%s\");", r(n.cookies))), n.body) {
			if (o.line(), d(n.body)) {
				let e = n.body;
				o.line("curl_easy_setopt(curl, CURLOPT_POSTFIELDS, \"%s\");", e), o.line("curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, %rL);", new TextEncoder().encode(e).length);
			} else if (a(c, "form")) {
				let e = new URLSearchParams(Object.entries(n.body).map(([e, t]) => [e, String(t)])).toString();
				o.line("curl_easy_setopt(curl, CURLOPT_POSTFIELDS, \"%s\");", e), o.line("curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, %rL);", new TextEncoder().encode(e).length);
			} else if (i(n.body)) {
				let e = JSON.stringify(n.body);
				o.line("curl_easy_setopt(curl, CURLOPT_POSTFIELDS, \"%s\");", e), o.line("curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, %rL);", new TextEncoder().encode(e).length);
			}
		}
		return o.line(), o.line("res = curl_easy_perform(curl);"), o.line("if(res != CURLE_OK)"), o.indent(), o.line("fprintf(stderr, \"failed: %s\", curl_easy_strerror(res));"), o.outdent(), p && o.line("curl_slist_free_all(headers);"), o.line("curl_easy_cleanup(curl);"), o.outdent(), o.line("}"), o.line(), o.line("curl_global_cleanup();"), o.line("return 0;"), o.outdent(), o.line("}"), o.output();
	}
}, m = [
	"GET",
	"POST",
	"PUT",
	"DELETE",
	"HEAD",
	"OPTIONS",
	"PATCH",
	"TRACE"
];
function h(e) {
	let t = e.toUpperCase();
	return m.includes(t) ? `HttpMethod.${n(t)}` : `new HttpMethod("${t}")`;
}
var g = {
	default: !0,
	language: "csharp",
	client: "http",
	generate(t, n) {
		let o = new s({
			indent: t.indent || "  ",
			join: t.join || "\n"
		});
		if (o.line("using System;"), o.line("using System.Net.Http;"), o.line("using System.Threading.Tasks;"), o.line("using System.Web;"), l(n.body) && a(e(n.headers), "form") && o.line("using System.Collections.Generic;"), o.line(), o.line("namespace HttpClientExample"), o.line("{"), o.indent(), o.line("class Program"), o.line("{"), o.indent(), o.line("static async Task Main(string[] args)"), o.line("{"), o.indent(), o.line("using (HttpClient client = new HttpClient())"), o.line("{"), o.indent(), n.params && Object.keys(n.params).length > 0) {
			o.line("var uriBuilder = new UriBuilder(\"%s\");", n.url), o.line("var query = HttpUtility.ParseQueryString(uriBuilder.Query);");
			for (let [e, t] of Object.entries(n.params)) if (Array.isArray(t)) for (let n of t) o.line("query.Add(\"%s\", \"%s\");", e, n);
			else o.line("query.Add(\"%s\", \"%s\");", e, t);
			o.line("uriBuilder.Query = query.ToString();"), o.line("HttpRequestMessage request = new HttpRequestMessage(%r, uriBuilder.ToString());", h(n.method));
		} else o.line("HttpRequestMessage request = new HttpRequestMessage(%r, \"%s\");", h(n.method), n.url);
		let c = Object.entries(n.headers || {}).filter(([e]) => !(l(n.body) && e.toLowerCase() === "content-type"));
		if (c.length > 0) {
			o.line();
			for (let [e, t] of c) Array.isArray(t) ? t.forEach((t) => o.line("request.Headers.Add(\"%s\", \"%s\");", e, t)) : o.line("request.Headers.Add(\"%s\", \"%s\");", e, t);
		}
		if (n.cookies && Object.keys(n.cookies).length > 0 && (o.line(), o.line("request.Headers.Add(\"Cookie\", \"%s\");", r(n.cookies))), l(n.body)) {
			o.line();
			let t = e(n.headers);
			if (a(t, "form")) {
				o.line("var formContent = new FormUrlEncodedContent(new Dictionary<string, string>"), o.line("{"), o.indent();
				for (let [e, t] of Object.entries(n.body)) o.line("{ \"%s\", \"%s\" },", e, String(t));
				o.outdent(), o.line("});"), o.line("request.Content = formContent;");
			} else i(n.body) ? (o.line("string json = "), o.jsonStringLiteral(n.body), o.append(";"), o.line("request.Content = new StringContent(json, System.Text.Encoding.UTF8, \"application/json\");")) : o.line("request.Content = new StringContent(\"%s\", System.Text.Encoding.UTF8, \"%s\");", n.body, t || "text/plain");
		}
		return o.line(), o.line("HttpResponseMessage response = await client.SendAsync(request);"), o.line("response.EnsureSuccessStatusCode();"), o.line("string responseBody = await response.Content.ReadAsStringAsync();"), o.line("Console.WriteLine(responseBody);"), o.outdent(), o.line("}"), o.outdent(), o.line("}"), o.outdent(), o.line("}"), o.outdent(), o.line("}"), o.output();
	}
}, _ = {
	language: "csharp",
	client: "restsharp",
	generate(t, o) {
		let c = new s({
			indent: t.indent || "  ",
			join: t.join || "\n"
		});
		if (c.line("using RestSharp;"), c.line("using System;"), c.line("using System.Threading.Tasks;"), c.line(), c.line("namespace RestSharpExample"), c.line("{"), c.indent(), c.line("class Program"), c.line("{"), c.indent(), c.line("static async Task Main(string[] args)"), c.line("{"), c.indent(), t.handleErrors && (c.line("try"), c.line("{"), c.indent()), c.line("var client = new RestClient(\"%s\");", o.url), c.line("var request = new RestRequest(\"\", Method.%r);", n(o.method)), o.params && Object.keys(o.params).length > 0) {
			c.line();
			for (let [e, t] of Object.entries(o.params)) if (Array.isArray(t)) for (let n of t) c.line("request.AddParameter(\"%s\", \"%s\", ParameterType.QueryString);", e, n);
			else c.line("request.AddParameter(\"%s\", \"%s\", ParameterType.QueryString);", e, t);
		}
		let u = Object.entries(o.headers || {}).filter(([e]) => !(l(o.body) && e.toLowerCase() === "content-type"));
		if (u.length > 0) {
			c.line();
			for (let [e, t] of u) Array.isArray(t) ? t.forEach((t) => c.line("request.AddHeader(\"%s\", \"%s\");", e, t)) : c.line("request.AddHeader(\"%s\", \"%s\");", e, t);
		}
		if (o.cookies && Object.keys(o.cookies).length > 0 && (c.line(), c.line("request.AddHeader(\"Cookie\", \"%s\");", r(o.cookies))), l(o.body)) {
			c.line();
			let t = e(o.headers);
			if (a(t, "form")) for (let [e, t] of Object.entries(o.body)) c.line("request.AddParameter(\"%s\", \"%s\");", e, String(t));
			else d(o.body) ? c.line("request.AddStringBody(\"%s\", \"%s\");", o.body, t || "text/plain") : i(o.body) && (c.line("request.AddStringBody("), c.jsonStringLiteral(o.body), c.append(", ContentType.Json);"));
		}
		return c.line(), c.line("RestResponse response = await client.ExecuteAsync(request);"), t.handleErrors && (c.line("if (!response.IsSuccessful)"), c.line("{"), c.indent(), c.line("throw new Exception(response.ErrorMessage ?? response.StatusDescription);"), c.outdent(), c.line("}")), c.line("Console.WriteLine(response.Content);"), t.handleErrors && (c.outdent(), c.line("}"), c.line("catch (Exception ex)"), c.line("{"), c.indent(), c.line("Console.WriteLine($\"Error: {ex.Message}\");"), c.outdent(), c.line("}")), c.outdent(), c.line("}"), c.outdent(), c.line("}"), c.outdent(), c.line("}"), c.output();
	}
}, v = (e) => e.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\$/g, "\\$"), y = {
	default: !0,
	language: "dart",
	client: "http",
	generate(t, n) {
		let r = new s({
			indent: t.indent || "  ",
			join: t.join || "\n",
			json: { escapeString: v }
		}), o = l(n.body), c = e(n.headers), u = o && (a(c, "json") || !c && i(n.body)), f = Object.keys(n.headers || {}).some((e) => e.toLowerCase() === "content-type");
		if (r.line("import 'package:http/http.dart' as http;"), u && r.line("import 'dart:convert';"), r.line(), r.line("void main() async {"), r.indent(), t.handleErrors && (r.line("try {"), r.indent()), n.params && Object.keys(n.params).length > 0) {
			r.line("var url = Uri.parse(\"%s\");", n.url), r.line("url = url.replace(queryParameters: {"), r.indent(), r.line("...url.queryParametersAll,");
			for (let [e, t] of Object.entries(n.params)) Array.isArray(t) ? r.line("\"%s\": [%r],", e, t.map((e) => r.format("\"%s\"", e)).join(", ")) : r.line("\"%s\": \"%s\",", e, t);
			r.outdent(), r.line("});");
		} else r.line("var url = Uri.parse(\"%s\");", n.url);
		if (r.line(), n.headers && Object.keys(n.headers).length > 0 || u && !f) {
			r.line("var headers = {"), r.indent();
			for (let [e, t] of Object.entries(n.headers || {})) Array.isArray(t) ? r.line("\"%s\": \"%s\",", e, t.join(", ")) : r.line("\"%s\": \"%s\",", e, t);
			u && !f && r.line("\"Content-Type\": \"application/json\","), r.outdent(), r.line("};"), r.line();
		}
		let p = "null";
		o && (a(c, "json") || !c && i(n.body) ? (r.line("var body = jsonEncode("), r.json(n.body), r.append(");"), p = "body", r.line()) : d(n.body) && (r.line("var body = \"%s\";", n.body), p = "body", r.line()));
		let m = n.method.toLowerCase(), h = n.headers && Object.keys(n.headers).length > 0 || u && !f, g = `${h ? ", headers: headers" : ""}${p === "null" ? "" : ", body: " + p}`;
		return m === "get" ? r.line("var response = await http.get(url%r);", h ? ", headers: headers" : "") : m === "post" ? r.line("var response = await http.post(url%r);", g) : m === "put" ? r.line("var response = await http.put(url%r);", g) : m === "delete" ? r.line("var response = await http.delete(url%r);", g) : m === "patch" ? r.line("var response = await http.patch(url%r);", g) : (r.line("var request = http.Request(\"%s\", url);", n.method.toUpperCase()), h && r.line("request.headers.addAll(headers);"), p !== "null" && r.line("request.body = body;"), r.line("var streamedResponse = await request.send();"), r.line("var response = await http.Response.fromStream(streamedResponse);")), r.line(), t.handleErrors && (r.line("if (response.statusCode < 200 || response.statusCode >= 300) {"), r.indent(), r.line("throw http.ClientException(\"HTTP ${response.statusCode}\", url);"), r.outdent(), r.line("}"), r.line()), r.line("print(response.body);"), t.handleErrors && (r.outdent(), r.line("} catch (e) {"), r.indent(), r.line("print(\"Error: $e\");"), r.outdent(), r.line("}")), r.outdent(), r.line("}"), r.output();
	}
}, b = {
	default: !0,
	language: "go",
	client: "http",
	generate(t, n) {
		let r = new s({
			indent: t.indent || "  ",
			join: t.join || "\n",
			json: {
				objOpen: "map[string]any{",
				objClose: "}",
				arrOpen: "[]any{",
				arrClose: "}",
				separator: ": ",
				endComma: !1
			}
		}), o = e(n.headers), c = l(n.body), u = c && (a(o, "json") || !o && i(n.body)), d = c && a(o, "form"), f = u || d || c && typeof n.body == "string", p = n.method.toUpperCase();
		if (r.line("package main"), r.line(), r.line("import ("), r.indent(), r.line("\"fmt\""), r.line("\"net/http\""), r.line("\"io\""), f && r.line("\"bytes\""), u && r.line("\"encoding/json\""), (d || n.params && Object.keys(n.params).length > 0) && r.line("\"net/url\""), t.handleErrors && r.line("\"log\""), r.outdent(), r.line(")"), r.line(), r.line("func main() {"), r.indent(), n.params && Object.keys(n.params).length > 0) {
			r.line("baseURL := \"%s\"", n.url), r.line("u, err := url.Parse(baseURL)"), t.handleErrors && (r.line("if err != nil {"), r.indent(), r.line("log.Fatal(err)"), r.outdent(), r.line("}")), r.line("q := u.Query()");
			for (let [e, t] of Object.entries(n.params)) if (Array.isArray(t)) for (let n of t) r.line("q.Add(\"%s\", \"%s\")", e, n);
			else r.line("q.Set(\"%s\", \"%s\")", e, t);
			r.line("u.RawQuery = q.Encode()"), r.line("url := u.String()");
		} else r.line("url := \"%s\"", n.url);
		r.line();
		let m = "nil";
		if (u) r.line("jsonBodyMap := "), r.json(n.body), t.handleErrors ? (r.line("jsonBodyBytes, err := json.Marshal(jsonBodyMap)"), r.line("if err != nil {"), r.indent(), r.line("log.Fatal(err)"), r.outdent(), r.line("}")) : r.line("jsonBodyBytes, _ := json.Marshal(jsonBodyMap)"), m = "bytes.NewBuffer(jsonBodyBytes)", r.line();
		else if (d) {
			r.line("formData := url.Values{}");
			for (let [e, t] of Object.entries(n.body)) r.line("formData.Set(\"%s\", \"%s\")", e, String(t));
			r.line("formBody := formData.Encode()"), m = "bytes.NewBufferString(formBody)", r.line();
		} else c && typeof n.body == "string" && (m = r.format("bytes.NewBufferString(\"%s\")", n.body));
		if (t.handleErrors ? (r.line("req, err := http.NewRequest(\"%s\", url, %r)", p, m), r.line("if err != nil {"), r.indent(), r.line("log.Fatal(err)"), r.outdent(), r.line("}"), r.line()) : (r.line("req, _ := http.NewRequest(\"%s\", url, %r)", p, m), r.line()), n.headers) {
			for (let [e, t] of Object.entries(n.headers)) if (Array.isArray(t)) for (let n of t) r.line("req.Header.Add(\"%s\", \"%s\")", e, n);
			else r.line("req.Header.Set(\"%s\", \"%s\")", e, t);
			r.line();
		}
		if (u && !o && (r.line("req.Header.Set(\"Content-Type\", \"application/json\")"), r.line()), n.cookies) {
			for (let [e, t] of Object.entries(n.cookies)) if (Array.isArray(t)) for (let n of t) r.line("req.AddCookie(&http.Cookie{Name: \"%s\", Value: \"%s\"})", e, n);
			else r.line("req.AddCookie(&http.Cookie{Name: \"%s\", Value: \"%s\"})", e, t);
			r.line();
		}
		return t.handleErrors ? (r.line("resp, err := http.DefaultClient.Do(req)"), r.line("if err != nil {"), r.indent(), r.line("log.Fatal(err)"), r.outdent(), r.line("}")) : r.line("resp, _ := http.DefaultClient.Do(req)"), r.line("defer resp.Body.Close()"), r.line(), t.handleErrors ? (r.line("body, err := io.ReadAll(resp.Body)"), r.line("if err != nil {"), r.indent(), r.line("log.Fatal(err)"), r.outdent(), r.line("}")) : r.line("body, _ := io.ReadAll(resp.Body)"), r.line(), r.line("fmt.Println(string(body))"), r.outdent(), r.line("}"), r.output();
	}
}, x = {
	default: !0,
	language: "java",
	client: "httpurlconnection",
	generate(t, n) {
		let o = new s({
			indent: t.indent || "  ",
			join: t.join || "\n"
		}), c = l(n.body), u = e(n.headers);
		if (o.line("import java.io.*;"), o.line("import java.net.*;"), n.params && Object.keys(n.params).length > 0 && o.line("import java.net.URLEncoder;"), o.line(), o.line("public class HttpExample {"), o.indent(), o.line("public static void main(String[] args)%r {", t.handleErrors ? "" : " throws Exception"), o.indent(), t.handleErrors && (o.line("try {"), o.indent()), n.params && Object.keys(n.params).length > 0) {
			o.line("String baseUrl = \"%s\";", n.url), o.line("StringBuilder urlBuilder = new StringBuilder(baseUrl);"), o.line("urlBuilder.append(baseUrl.contains(\"?\") ? \"&\" : \"?\");"), o.line(), o.line("String[] paramPairs = {"), o.indent();
			let e = [];
			for (let [t, r] of Object.entries(n.params)) if (Array.isArray(r)) for (let n of r) e.push(o.format("\"%s=\" + URLEncoder.encode(\"%s\", \"UTF-8\")", t, n));
			else e.push(o.format("\"%s=\" + URLEncoder.encode(\"%s\", \"UTF-8\")", t, r));
			for (let t = 0; t < e.length; t++) t === e.length - 1 ? o.line(e[t]) : o.line(e[t] + ",");
			o.outdent(), o.line("};"), o.line(), o.line("for (int i = 0; i < paramPairs.length; i++) {"), o.indent(), o.line("if (i > 0) urlBuilder.append(\"&\");"), o.line("urlBuilder.append(paramPairs[i]);"), o.outdent(), o.line("}"), o.line(), o.line("URL url = new URL(urlBuilder.toString());");
		} else o.line("URL url = new URL(\"%s\");", n.url);
		if (o.line("HttpURLConnection conn = (HttpURLConnection) url.openConnection();"), o.line("conn.setRequestMethod(\"%s\");", n.method.toUpperCase()), n.headers && Object.keys(n.headers).length > 0) {
			o.line();
			for (let [e, t] of Object.entries(n.headers)) Array.isArray(t) ? t.forEach((t) => o.line("conn.addRequestProperty(\"%s\", \"%s\");", e, t)) : o.line("conn.setRequestProperty(\"%s\", \"%s\");", e, t);
		}
		return n.cookies && Object.keys(n.cookies).length > 0 && (o.line(), o.line("conn.setRequestProperty(\"Cookie\", \"%s\");", r(n.cookies))), c && (o.line(), o.line("conn.setDoOutput(true);"), o.line(), a(u, "json") || !u && i(n.body) ? (o.line("try (OutputStream os = conn.getOutputStream()) {"), o.indent(), o.line("byte[] input = "), o.jsonStringLiteral(n.body), o.append(".getBytes(\"utf-8\");"), o.line("os.write(input, 0, input.length);"), o.outdent(), o.line("}")) : d(n.body) && (o.line("try (OutputStream os = conn.getOutputStream()) {"), o.indent(), o.line("byte[] input = \"%s\".getBytes(\"utf-8\");", n.body), o.line("os.write(input, 0, input.length);"), o.outdent(), o.line("}"))), o.line(), o.line("int responseCode = conn.getResponseCode();"), o.line("InputStream responseStream = responseCode >= 400 ? conn.getErrorStream() : conn.getInputStream();"), o.line("BufferedReader in = new BufferedReader(new InputStreamReader(responseStream));"), o.line("String inputLine;"), o.line("StringBuilder response = new StringBuilder();"), o.line(), o.line("while ((inputLine = in.readLine()) != null) {"), o.indent(), o.line("response.append(inputLine);"), o.outdent(), o.line("}"), o.line("in.close();"), o.line(), o.line("System.out.println(response.toString());"), t.handleErrors && (o.outdent(), o.line("} catch (Exception e) {"), o.indent(), o.line("e.printStackTrace();"), o.outdent(), o.line("}")), o.outdent(), o.line("}"), o.outdent(), o.line("}"), o.output();
	}
}, S = {
	language: "java",
	client: "okhttp",
	generate(t, n) {
		let o = new s({
			indent: t.indent || "  ",
			join: t.join || "\n"
		}), c = l(n.body), u = e(n.headers), f = c && (a(u, "json") || !u && i(n.body));
		if (o.line("import okhttp3.*;"), o.line(), o.line("public class HttpExample {"), o.indent(), o.line("public static void main(String[] args)%r {", t.handleErrors ? "" : " throws Exception"), o.indent(), t.handleErrors && (o.line("try {"), o.indent()), o.line("OkHttpClient client = new OkHttpClient();"), o.line(), c) {
			if (a(u, "form")) {
				o.line("FormBody.Builder formBuilder = new FormBody.Builder();");
				for (let [e, t] of Object.entries(n.body)) o.line("formBuilder.add(\"%s\", \"%s\");", e, String(t));
				o.line("RequestBody body = formBuilder.build();");
			} else f ? (o.line("RequestBody body = RequestBody.create("), o.indent(), o.jsonStringLiteral(n.body), o.append(","), o.line("MediaType.parse(\"application/json; charset=utf-8\")"), o.outdent(), o.line(");")) : d(n.body) && (o.line("RequestBody body = RequestBody.create("), o.indent(), o.line("\"%s\",", n.body), o.line("MediaType.parse(\"%s; charset=utf-8\")", u || "text/plain"), o.outdent(), o.line(");"));
			o.line();
		}
		if (n.params && Object.keys(n.params).length > 0) {
			o.line("HttpUrl.Builder urlBuilder = HttpUrl.parse(\"%s\").newBuilder();", n.url);
			for (let [e, t] of Object.entries(n.params)) if (Array.isArray(t)) for (let n of t) o.line("urlBuilder.addQueryParameter(\"%s\", \"%s\");", e, n);
			else o.line("urlBuilder.addQueryParameter(\"%s\", \"%s\");", e, t);
			o.line("HttpUrl url = urlBuilder.build();"), o.line();
		}
		if (o.line("Request request = new Request.Builder()"), o.indent(), n.params && Object.keys(n.params).length > 0 ? o.line(".url(url)") : o.line(".url(\"%s\")", n.url), c ? o.line(".method(\"%s\", body)", n.method.toUpperCase()) : o.line(".method(\"%s\", null)", n.method.toUpperCase()), n.headers && Object.keys(n.headers).length > 0) for (let [e, t] of Object.entries(n.headers)) Array.isArray(t) ? t.forEach((t) => o.line(".addHeader(\"%s\", \"%s\")", e, t)) : o.line(".addHeader(\"%s\", \"%s\")", e, t);
		return n.cookies && Object.keys(n.cookies).length > 0 && o.line(".addHeader(\"Cookie\", \"%s\")", r(n.cookies)), o.line(".build();"), o.outdent(), o.line(), o.line("try (Response response = client.newCall(request).execute()) {"), o.indent(), o.line("System.out.println(response.body().string());"), o.outdent(), o.line("}"), t.handleErrors && (o.outdent(), o.line("} catch (Exception e) {"), o.indent(), o.line("e.printStackTrace();"), o.outdent(), o.line("}")), o.outdent(), o.line("}"), o.outdent(), o.line("}"), o.output();
	}
}, C = {
	default: !0,
	language: "javascript",
	client: "fetch",
	generate(t, n) {
		let r = new s({
			indent: t.indent || "  ",
			join: t.join || "\n"
		});
		if (n.params && Object.keys(n.params).length > 0) {
			r.line("const url = new URL(\"%s\");", n.url);
			for (let [e, t] of Object.entries(n.params)) if (Array.isArray(t)) for (let n of t) r.line("url.searchParams.append(\"%s\", \"%s\");", e, n);
			else r.line("url.searchParams.append(\"%s\", \"%s\");", e, t);
			r.line(), r.line("fetch(url.toString(), {");
		} else r.line("fetch(\"%s\", {", n.url);
		if (r.indent(), r.line("method: \"%s\",", n.method.toUpperCase()), n.headers) {
			r.line("headers: {"), r.indent();
			for (let [e, t] of Object.entries(n.headers)) Array.isArray(t) ? r.line("\"%s\": \"%s\",", e, t.join(", ")) : r.line("\"%s\": \"%s\",", e, t);
			r.outdent(), r.line("},");
		}
		if (n.cookies && Object.keys(n.cookies).length > 0 && r.line("// Same-origin cookies are sent automatically by the browser."), n.body !== void 0 && n.body !== null) {
			let t = e(n.headers);
			i(n.body) && a(t, "form") ? (r.line("body: new URLSearchParams("), r.json(n.body), r.append("),")) : i(n.body) ? (r.line("body: JSON.stringify("), r.json(n.body), r.append("),")) : d(n.body) ? r.line("body: \"%s\",", n.body) : (r.line("body: "), r.json(n.body), r.append(","));
		}
		r.outdent(), r.line("})");
		let { contentType: c, wasInferred: l } = o(n.headers), u = "text()";
		return (!l || c !== "application/octet-stream") && (a(c, "json") ? u = "json()" : a(c, "xml") || a(c, "text") ? u = "text()" : a(c, "blob") && (u = "blob()")), l && u === "json()" && r.line("// Response Content-Type inferred as: %r", c), t.handleErrors ? (r.line(".then(response => {"), r.indent(), r.line("if (!response.ok) {"), r.indent(), r.line("throw new Error(\"Network response was not ok\");"), r.outdent(), r.line("}"), r.line("return response.%r;", u), r.outdent(), r.line("})"), r.line(".then(data => console.log(data))"), r.line(".catch(error => console.error(\"There was a problem with the fetch operation:\", error));")) : (r.line(".then(response => response.%r)", u), r.line(".then(data => console.log(data));")), r.output();
	}
}, w = {
	language: "javascript",
	client: "axios",
	generate(e, t) {
		let n = new s({
			indent: e.indent || "  ",
			join: e.join || "\n"
		});
		if (n.line("import axios from \"axios\";"), n.line(), n.line("axios({"), n.indent(), n.line("method: \"%s\",", t.method.toLowerCase()), n.line("url: \"%s\",", t.url), t.params && Object.keys(t.params).length > 0) {
			n.line("params: {"), n.indent();
			for (let [e, r] of Object.entries(t.params)) if (Array.isArray(r)) {
				let t = r.map((e) => n.format("\"%s\"", e)).join(", ");
				n.line("\"%s\": [%r],", e, t);
			} else n.line("\"%s\": \"%s\",", e, r);
			n.outdent(), n.line("},");
		}
		if (t.headers || t.cookies && Object.keys(t.cookies).length > 0) {
			if (n.line("headers: {"), n.indent(), t.headers) for (let [e, r] of Object.entries(t.headers)) Array.isArray(r) ? n.line("\"%s\": \"%s\",", e, r.join(", ")) : n.line("\"%s\": \"%s\",", e, r);
			t.cookies && Object.keys(t.cookies).length > 0 && n.line("\"Cookie\": \"%s\",", r(t.cookies)), n.outdent(), n.line("},");
		}
		return t.body && (n.line("data: "), n.json(t.body)), n.outdent(), n.line("})"), e.handleErrors ? (n.line(".then(response => {"), n.indent(), n.line("console.log(response.data);"), n.outdent(), n.line("})"), n.line(".catch(error => {"), n.indent(), n.line("console.error(\"There was an error:\", error);"), n.outdent(), n.line("});")) : n.line(".then(response => console.log(response.data));"), n.output();
	}
}, T = {
	language: "javascript",
	client: "jquery",
	generate(t, n) {
		let r = new s({
			indent: t.indent || "  ",
			join: t.join || "\n"
		});
		if (r.line("$.ajax({"), r.indent(), r.line("url: \"%s\",", u(n.url, n.params)), r.line("type: \"%s\",", n.method.toUpperCase()), n.headers) {
			r.line("headers: {"), r.indent();
			for (let [e, t] of Object.entries(n.headers)) Array.isArray(t) ? r.line("\"%s\": \"%s\",", e, t.join(", ")) : r.line("\"%s\": \"%s\",", e, t);
			r.outdent(), r.line("},");
		}
		if (n.body !== void 0 && n.body !== null) {
			let t = e(n.headers);
			i(n.body) && a(t, "json") ? (r.line("data: JSON.stringify("), r.json(n.body), r.append("),"), r.line("contentType: \"application/json\","), r.line("processData: false,")) : d(n.body) ? (r.line("data: \"%s\",", n.body), t && r.line("contentType: \"%s\",", t)) : (r.line("data: "), r.json(n.body), r.append(","));
		}
		return n.cookies && Object.keys(n.cookies).length > 0 && r.line("// Same-origin cookies are sent automatically by the browser."), r.line("success: function(data) {"), r.indent(), r.line("console.log(data);"), r.outdent(), r.line("},"), t.handleErrors && (r.line("error: function(jqXHR, textStatus, errorThrown) {"), r.indent(), r.line("console.error(\"Request failed:\", textStatus, errorThrown);"), r.outdent(), r.line("},")), r.outdent(), r.line("});"), r.output();
	}
}, E = {
	default: !0,
	language: "kotlin",
	client: "ktor",
	generate(t, n) {
		let o = new s({
			indent: t.indent || "  ",
			join: t.join || "\n"
		}), c = l(n.body), u = e(n.headers);
		if (o.line("import io.ktor.client.*"), o.line("import io.ktor.client.engine.cio.*"), o.line("import io.ktor.client.request.*"), o.line("import io.ktor.client.statement.*"), o.line("import io.ktor.http.*"), o.line(), o.line("suspend fun main() {"), o.indent(), t.handleErrors && (o.line("try {"), o.indent()), o.line(t.handleErrors ? "HttpClient(CIO) { expectSuccess = true }.use { client ->" : "HttpClient(CIO).use { client ->"), o.indent(), o.line("val response: HttpResponse = client.request {"), o.indent(), o.line("method = HttpMethod.parse(\"%s\")", n.method.toUpperCase()), o.line("url(\"%s\")", n.url), n.params && Object.keys(n.params).length > 0) for (let [e, t] of Object.entries(n.params)) if (Array.isArray(t)) for (let n of t) o.line("parameter(\"%s\", \"%s\")", e, n);
		else o.line("parameter(\"%s\", \"%s\")", e, t);
		if (n.headers && Object.keys(n.headers).length > 0) for (let [e, t] of Object.entries(n.headers)) Array.isArray(t) ? t.forEach((t) => o.line("header(\"%s\", \"%s\")", e, t)) : o.line("header(\"%s\", \"%s\")", e, t);
		if (n.cookies && Object.keys(n.cookies).length > 0 && o.line("header(\"Cookie\", \"%s\")", r(n.cookies)), c) if (a(u, "form")) {
			o.line("setBody("), o.indent(), o.line("FormDataContent(Parameters.build {"), o.indent();
			for (let [e, t] of Object.entries(n.body)) o.line("append(\"%s\", \"%s\")", e, String(t));
			o.outdent(), o.line("})"), o.outdent(), o.line(")");
		} else if (a(u, "json") || !u && i(n.body)) {
			o.line("contentType(ContentType.Application.Json)");
			let e = JSON.stringify(n.body).replace(/\$/g, "\\$").replace(/"""/g, "\\\"\\\"\\\"");
			o.line("setBody(\"\"\"%r\"\"\")", e);
		} else d(n.body) && o.line("setBody(\"%s\")", n.body);
		return o.outdent(), o.line("}"), o.line(), o.line("println(response.bodyAsText())"), o.outdent(), o.line("}"), t.handleErrors && (o.outdent(), o.line("} catch (e: Exception) {"), o.indent(), o.line("println(\"Error: ${e.message}\")"), o.outdent(), o.line("}")), o.outdent(), o.line("}"), o.output();
	}
}, D = {
	language: "node",
	client: "http",
	generate(n, o) {
		let c = new s({
			indent: n.indent || "  ",
			join: n.join || "\n"
		}), { hostname: l, path: u, port: f, protocol: p, params: m } = t(o.url);
		c.line("const transport = require(\"%s\");", p === "https:" ? "https" : "http"), c.line();
		let h = u + m;
		if (o.params && Object.keys(o.params).length > 0) {
			let e = new URLSearchParams();
			for (let [t, n] of Object.entries(o.params)) if (Array.isArray(n)) for (let r of n) e.append(t, r);
			else e.append(t, n);
			let t = e.toString();
			if (t) {
				let e = h.includes("?") ? "&" : "?";
				h = `${h}${e}${t}`;
			}
		}
		let g = e(o.headers), _ = o.body !== void 0 && o.body !== null, v = _ && i(o.body) && !a(g, "form");
		if (_ && (v ? (c.line("const payload = JSON.stringify("), c.json(o.body), c.append(");")) : i(o.body) ? (c.line("const payload = new URLSearchParams("), c.json(o.body), c.append(").toString();")) : d(o.body) ? c.line("const payload = \"%s\";", o.body) : (c.line("const payload = "), c.json(o.body), c.append(";")), c.line()), c.line("const options = {"), c.indent(), c.line("method: \"%s\",", o.method.toUpperCase()), c.line("hostname: \"%s\",", l), c.line("port: %r,", f), c.line("path: \"%s\",", h), o.headers || o.cookies || _) {
			if (c.line("headers: {"), c.indent(), o.headers) for (let [e, t] of Object.entries(o.headers)) Array.isArray(t) ? c.line("\"%s\": \"%s\",", e, t.join(", ")) : c.line("\"%s\": \"%s\",", e, t);
			v && !Object.keys(o.headers || {}).some((e) => e.toLowerCase() === "content-type") && c.line("\"Content-Type\": \"application/json\","), o.cookies && c.line("\"Cookie\": \"%s\",", r(o.cookies)), _ && c.line("\"Content-Length\": Buffer.byteLength(payload),"), c.outdent(), c.line("},");
		}
		return c.outdent(), c.line("};"), c.line(), c.line("const req = transport.request(options, (res) => {"), c.indent(), c.line("let data = \"\";"), c.line(), c.line("res.on(\"data\", (chunk) => {"), c.indent(), c.line("data += chunk;"), c.outdent(), c.line("});"), c.line(), c.line("res.on(\"end\", () => {"), c.indent(), c.line("console.log(data);"), c.outdent(), c.line("});"), c.outdent(), c.line("});"), n.handleErrors && (c.line(), c.line("req.on(\"error\", (error) => {"), c.indent(), c.line("console.error(error);"), c.outdent(), c.line("});")), c.line(), _ && c.line("req.write(payload);"), c.line("req.end();"), c.output();
	}
}, O = {
	language: "node",
	client: "fetch",
	generate(t, n) {
		let o = new s({
			indent: t.indent || "  ",
			join: t.join || "\n"
		});
		if (n.params && Object.keys(n.params).length > 0) {
			o.line("const url = new URL(\"%s\");", n.url);
			for (let [e, t] of Object.entries(n.params)) if (Array.isArray(t)) for (let n of t) o.line("url.searchParams.append(\"%s\", \"%s\");", e, n);
			else o.line("url.searchParams.append(\"%s\", \"%s\");", e, t);
			o.line(), o.line("fetch(url.toString(), {");
		} else o.line("fetch(\"%s\", {", n.url);
		if (o.indent(), o.line("method: \"%s\",", n.method.toUpperCase()), n.headers || n.cookies && Object.keys(n.cookies).length > 0) {
			if (o.line("headers: {"), o.indent(), n.headers) for (let [e, t] of Object.entries(n.headers)) Array.isArray(t) ? o.line("\"%s\": \"%s\",", e, t.join(", ")) : o.line("\"%s\": \"%s\",", e, t);
			n.cookies && Object.keys(n.cookies).length > 0 && o.line("\"Cookie\": \"%s\",", r(n.cookies)), o.outdent(), o.line("},");
		}
		if (n.body !== void 0 && n.body !== null) {
			let t = e(n.headers);
			i(n.body) && a(t, "form") ? (o.line("body: new URLSearchParams("), o.json(n.body), o.append("),")) : i(n.body) ? (o.line("body: JSON.stringify("), o.json(n.body), o.append("),")) : d(n.body) ? o.line("body: \"%s\",", n.body) : (o.line("body: "), o.json(n.body), o.append(","));
		}
		o.outdent(), o.line("})");
		let c = e(n.headers), l = "text()";
		return a(c, "json") ? l = "json()" : a(c, "xml") || a(c, "text") ? l = "text()" : a(c, "blob") && (l = "blob()"), t.handleErrors ? (o.line(".then(response => {"), o.indent(), o.line("if (!response.ok) {"), o.indent(), o.line("throw new Error(\"response not ok\");"), o.outdent(), o.line("}"), o.line("return response.%r;", l), o.outdent(), o.line("})"), o.line(".then(data => console.log(data))"), o.line(".catch(error => console.error(\"error:\", error));")) : (o.line(".then(response => response.%r)", l), o.line(".then(data => console.log(data))")), o.output();
	}
}, k = (e) => e.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\$/g, "\\$"), A = {
	default: !0,
	language: "php",
	client: "curl",
	generate(t, n) {
		let r = new s({
			indent: t.indent || "  ",
			join: t.join || "\n",
			json: {
				objOpen: "[",
				objClose: "]",
				arrOpen: "[",
				arrClose: "]",
				separator: " => ",
				endComma: !0,
				nullLiteral: "null",
				escapeString: k
			}
		}), o = e(n.headers), c = l(n.body) && i(n.body) && !o;
		if (r.line("<?php"), r.line(), r.line("$ch = curl_init();"), r.line(), n.params && Object.keys(n.params).length > 0) {
			r.line("$url = \"%s\";", n.url), r.line("$params = [];");
			for (let [e, t] of Object.entries(n.params)) if (Array.isArray(t)) for (let n of t) r.line("$params[] = \"%s=\" . urlencode(\"%s\");", e, n);
			else r.line("$params[] = \"%s=\" . urlencode(\"%s\");", e, t);
			r.line("$url .= (strpos($url, \"?\") !== false ? \"&\" : \"?\") . implode(\"&\", $params);"), r.line(), r.line("curl_setopt($ch, CURLOPT_URL, $url);");
		} else r.line("curl_setopt($ch, CURLOPT_URL, \"%s\");", n.url);
		if (r.line("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);"), r.line("curl_setopt($ch, CURLOPT_CUSTOMREQUEST, \"%s\");", n.method.toUpperCase()), n.headers || c) {
			r.line(), r.line("$headers = [];");
			for (let [e, t] of Object.entries(n.headers || {})) Array.isArray(t) ? t.forEach((t) => r.line("$headers[] = \"%s: %s\";", e, t)) : r.line("$headers[] = \"%s: %s\";", e, t);
			c && r.line("$headers[] = \"Content-Type: application/json\";"), r.line("curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);");
		}
		if (n.cookies) {
			r.line(), r.line("$cookies = [];");
			for (let [e, t] of Object.entries(n.cookies)) r.line("$cookies[] = \"%s=%s\";", e, t);
			r.line("curl_setopt($ch, CURLOPT_COOKIE, implode(\"; \", $cookies));");
		}
		return l(n.body) && (r.line(), a(o, "form") ? (r.line("$postData = "), r.json(n.body), r.append(";"), r.line("curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));")) : a(o, "json") || !o && i(n.body) ? (r.line("$body = \"%s\";", JSON.stringify(n.body)), r.line("curl_setopt($ch, CURLOPT_POSTFIELDS, $body);")) : d(n.body) && r.line("curl_setopt($ch, CURLOPT_POSTFIELDS, \"%s\");", n.body)), r.line(), r.line("$response = curl_exec($ch);"), t.handleErrors && (r.line("if (curl_errno($ch)) {"), r.indent(), r.line("echo \"Error: \" . curl_error($ch);"), r.outdent(), r.line("}")), r.line("curl_close($ch);"), r.line(), r.line("echo $response;"), r.output();
	}
}, j = (e) => e.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\$/g, "\\$"), M = {
	language: "php",
	client: "guzzle",
	generate(t, n) {
		let r = new s({
			indent: t.indent || "  ",
			join: t.join || "\n",
			json: {
				objOpen: "[",
				objClose: "]",
				arrOpen: "[",
				arrClose: "]",
				separator: " => ",
				endComma: !0,
				nullLiteral: "null",
				escapeString: j
			}
		});
		if (r.line("<?php"), r.line(), r.line("require 'vendor/autoload.php';"), r.line(), r.line("use GuzzleHttp\\Client;"), t.handleErrors && r.line("use GuzzleHttp\\Exception\\GuzzleException;"), r.line(), t.handleErrors && (r.line("try {"), r.indent()), r.line("$client = new Client();"), r.line("$response = $client->request("), r.indent(), r.line("\"%s\",", n.method.toUpperCase()), r.line("\"%s\",", n.url), n.headers || n.cookies || l(n.body) || n.params) {
			if (r.line("["), n.params && Object.keys(n.params).length > 0) {
				r.indent(), r.line("\"query\" => ["), r.indent();
				for (let [e, t] of Object.entries(n.params)) Array.isArray(t) ? r.line("\"%s\" => [%r],", e, t.map((e) => r.format("\"%s\"", e)).join(", ")) : r.line("\"%s\" => \"%s\",", e, t);
				r.outdent(), r.line("],"), r.outdent();
			}
			if (n.headers || n.cookies) {
				r.indent(), r.line("\"headers\" => ["), r.indent();
				for (let [e, t] of Object.entries(n.headers || {})) Array.isArray(t) ? r.line("\"%s\" => [%r],", e, t.map((e) => r.format("\"%s\"", e)).join(", ")) : r.line("\"%s\" => \"%s\",", e, t);
				if (n.cookies) {
					let e = Object.entries(n.cookies).map(([e, t]) => `${e}=${t}`).join("; ");
					r.line("\"Cookie\" => \"%s\",", e);
				}
				r.outdent(), r.line("],"), r.outdent();
			}
			if (l(n.body)) {
				r.indent();
				let t = e(n.headers);
				a(t, "form") ? (r.line("\"form_params\" => "), r.json(n.body), r.append(",")) : a(t, "json") || !t && i(n.body) ? (r.line("\"json\" => "), r.json(n.body), r.append(",")) : r.line("\"body\" => \"%s\",", typeof n.body == "string" ? n.body : JSON.stringify(n.body)), r.outdent();
			}
			r.line("],");
		}
		return r.outdent(), r.line(");"), r.line(), r.line("echo $response->getBody();"), t.handleErrors && (r.outdent(), r.line("} catch (GuzzleException $e) {"), r.indent(), r.line("echo \"Error: \" . $e->getMessage();"), r.outdent(), r.line("}")), r.output();
	}
}, N = {
	default: !0,
	language: "python",
	client: "http",
	generate(n, o) {
		let c = new s({
			indent: n.indent || "  ",
			join: n.join || "\n",
			json: { nullLiteral: "None" }
		}), l = o.method.toUpperCase(), u = l !== "GET" && o.body !== void 0 && o.body !== null, f = o.headers && Object.keys(o.headers).length > 0, p = o.cookies && Object.keys(o.cookies).length > 0, m = [];
		c.line("import http.client"), c.line("import json"), c.line(), n.handleErrors && (c.line("try:"), c.indent());
		let { hostname: h, path: g, port: _, protocol: v, params: y } = t(o.url), b = c.format("\"%s\"", g);
		if (o.params && Object.keys(o.params).length > 0) {
			c.line("from urllib.parse import urlencode"), c.line("params = {"), c.indent();
			for (let [e, t] of Object.entries(o.params)) Array.isArray(t) ? c.line("\"%s\": [%r],", e, t.map((e) => c.format("\"%s\"", e)).join(", ")) : c.line("\"%s\": \"%s\",", e, t);
			c.outdent(), c.line("}"), c.line("query_string = urlencode(params, doseq=True)"), c.line("final_path = f\"%s{query_string}\"", `${g}${y ? `${y}&` : "?"}`), b = "final_path";
		}
		if (c.line("conn = http.client.%r(\"%s\", %r)", v === "https:" ? "HTTPSConnection" : "HTTPConnection", h, _), f || p || u && i(o.body) && !a(e(o.headers), "form")) {
			if (c.line(), m.push("headers"), c.line("headers = {"), c.indent(), o.headers) for (let [e, t] of Object.entries(o.headers)) Array.isArray(t) ? c.line("\"%s\": \"%s\",", e, t.join(", ")) : c.line("\"%s\": \"%s\",", e, t);
			u && i(o.body) && !a(e(o.headers), "form") && !Object.keys(o.headers || {}).some((e) => e.toLowerCase() === "content-type") && c.line("\"Content-Type\": \"application/json\","), p && c.line("\"Cookie\": \"%s\",", r(o.cookies)), c.outdent(), c.line("}");
		}
		if (u) {
			c.line();
			let t = e(o.headers);
			a(t, "form") ? (c.line("from urllib.parse import urlencode"), c.line("payload_dict = "), c.json(o.body), c.line("payload = urlencode(payload_dict)")) : a(t, "json") || !t && i(o.body) ? (c.line("payload_dict = "), c.json(o.body), c.line("payload = json.dumps(payload_dict)")) : d(o.body) && c.line("payload = \"%s\"", o.body);
		}
		return c.line(), u ? c.line("conn.request(\"%s\", %r, body=payload%r)", l, b, m.includes("headers") ? ", headers=headers" : "") : c.line("conn.request(\"%s\", %r%r)", l, b, m.includes("headers") ? ", headers=headers" : ""), c.line("res = conn.getresponse()"), c.line("data = res.read()"), c.line(), c.line("print(data.decode(\"utf-8\"))"), n.handleErrors && (c.outdent(), c.line("except Exception as e:"), c.indent(), c.line("print(f\"Error: {e}\")"), c.outdent()), c.output();
	}
}, P = {
	language: "python",
	client: "requests",
	generate(t, n) {
		let r = new s({
			indent: t.indent || "  ",
			join: t.join || "\n",
			json: { nullLiteral: "None" }
		}), o = n.method.toUpperCase() !== "GET" && n.body !== void 0 && n.body !== null, c = n.headers && Object.keys(n.headers).length > 0, l = n.cookies && Object.keys(n.cookies).length > 0, u = [];
		if (r.line("import requests"), r.line(), t.handleErrors && (r.line("try:"), r.indent()), r.line("url = \"%s\"", n.url), n.params && Object.keys(n.params).length > 0) {
			r.line(), u.push("params=url_params"), r.line("url_params = {"), r.indent();
			for (let [e, t] of Object.entries(n.params)) Array.isArray(t) ? r.line("\"%s\": [%r]", e, t.map((e) => r.format("\"%s\"", e)).join(", ")) : r.line("\"%s\": \"%s\"", e, t), Object.keys(n.params).indexOf(e) !== Object.keys(n.params).length - 1 && r.append(",");
			r.outdent(), r.line("}");
		}
		if (c) {
			r.line(), u.push("headers=headers"), r.line("headers = {"), r.indent();
			for (let [e, t] of Object.entries(n.headers)) r.line("\"%s\": \"%s\"", e, t), Object.keys(n.headers).indexOf(e) !== Object.keys(n.headers).length - 1 && r.append(",");
			r.outdent(), r.line("}");
		}
		if (l) {
			r.line(), u.push("cookies=cookies"), r.line("cookies = {"), r.indent();
			for (let [e, t] of Object.entries(n.cookies)) r.line("\"%s\": \"%s\"", e, t), Object.keys(n.cookies).indexOf(e) !== Object.keys(n.cookies).length - 1 && r.append(",");
			r.outdent(), r.line("}");
		}
		if (o) {
			let t = e(n.headers);
			d(n.body) ? u.push(r.format("data=\"%s\"", n.body)) : (r.line(), a(t, "form") ? (u.push("data=form_data"), r.line("form_data = ")) : i(n.body) && (a(t, "json") || !t) ? (u.push("json=json_data"), r.line("json_data = ")) : (u.push("data=payload"), r.line("payload = ")), r.json(n.body));
		}
		return r.line(), r.line("response = requests.%r(url%r)", n.method.toLowerCase(), u.length > 0 ? `, ${u.join(", ")}` : ""), t.handleErrors && r.line("response.raise_for_status()"), r.line("print(response.text)"), t.handleErrors && (r.outdent(), r.line("except requests.exceptions.RequestException as e:"), r.indent(), r.line("print(f\"Error: {e}\")"), r.outdent()), r.output();
	}
}, F = {
	default: !0,
	language: "ruby",
	client: "nethttp",
	generate(t, n) {
		let r = new s({
			indent: t.indent || "  ",
			join: t.join || "\n",
			json: { nullLiteral: "nil" }
		}), o = e(n.headers), c = l(n.body) && (a(o, "json") || !o && i(n.body));
		if (r.line("require \"net/http\""), r.line("require \"uri\""), c && r.line("require \"json\""), r.line(), t.handleErrors && (r.line("begin"), r.indent()), n.params && Object.keys(n.params).length > 0) {
			r.line("uri = URI.parse(\"%s\")", n.url), r.line("params = {"), r.indent();
			for (let [e, t] of Object.entries(n.params)) Array.isArray(t) ? r.line("\"%s\" => [%r],", e, t.map((e) => r.format("\"%s\"", e)).join(", ")) : r.line("\"%s\" => \"%s\",", e, t);
			r.outdent(), r.line("}"), r.line("uri.query = URI.encode_www_form(params)");
		} else r.line("uri = URI.parse(\"%s\")", n.url);
		if (n.method.toUpperCase() === "GET" ? r.line("request = Net::HTTP::Get.new(uri)") : n.method.toUpperCase() === "POST" ? r.line("request = Net::HTTP::Post.new(uri)") : n.method.toUpperCase() === "PUT" ? r.line("request = Net::HTTP::Put.new(uri)") : n.method.toUpperCase() === "DELETE" ? r.line("request = Net::HTTP::Delete.new(uri)") : n.method.toUpperCase() === "PATCH" ? r.line("request = Net::HTTP::Patch.new(uri)") : r.line("request = Net::HTTP::GenericRequest.new(\"%s\", %r, true, uri.request_uri)", n.method.toUpperCase(), l(n.body)), n.headers && Object.keys(n.headers).length > 0) for (let [e, t] of Object.entries(n.headers)) Array.isArray(t) ? t.forEach((t) => r.line("request.add_field(\"%s\", \"%s\")", e, t)) : r.line("request[\"%s\"] = \"%s\"", e, t);
		if (n.cookies && Object.keys(n.cookies).length > 0) {
			let e = Object.entries(n.cookies).map(([e, t]) => `${e}=${t}`).join("; ");
			r.line("request[\"Cookie\"] = \"%s\"", e);
		}
		return l(n.body) && (c ? (r.line("request.body = "), r.json(n.body), r.append(".to_json")) : a(o, "form") ? (r.line("request.body = URI.encode_www_form("), r.json(n.body), r.append(")")) : d(n.body) ? r.line("request.body = \"%s\"", n.body) : r.line("request.body = \"%s\"", JSON.stringify(n.body))), r.line(), r.line("response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == \"https\") do |http|"), r.indent(), r.line("http.request(request)"), r.outdent(), r.line("end"), r.line(), r.line("puts response.body"), t.handleErrors && (r.outdent(), r.line("rescue StandardError => e"), r.indent(), r.line("puts \"Error: #{e.message}\""), r.outdent(), r.line("end")), r.output();
	}
}, I = {
	language: "ruby",
	client: "faraday",
	generate(t, n) {
		let r = new s({
			indent: t.indent || "  ",
			join: t.join || "\n",
			json: { nullLiteral: "nil" }
		}), o = e(n.headers), c = l(n.body) && (a(o, "json") || !o && i(n.body));
		if (r.line("require \"faraday\""), c && r.line("require \"json\""), l(n.body) && a(o, "form") && r.line("require \"uri\""), r.line(), t.handleErrors && (r.line("begin"), r.indent()), r.line("conn = Faraday.new(url: \"%s\") do |f|", n.url), r.indent(), t.handleErrors && r.line("f.response :raise_error"), r.line("f.adapter Faraday.default_adapter"), r.outdent(), r.line("end"), r.line(), r.line("response = conn.run_request(:%r, \"%s\", nil) do |req|", n.method.toLowerCase(), n.url), r.indent(), n.params && Object.keys(n.params).length > 0) {
			r.line();
			for (let [e, t] of Object.entries(n.params)) Array.isArray(t) ? r.line("req.params[\"%s\"] = [%r]", e, t.map((e) => r.format("\"%s\"", e)).join(", ")) : r.line("req.params[\"%s\"] = \"%s\"", e, t);
		}
		if (n.headers) {
			r.line();
			for (let [e, t] of Object.entries(n.headers)) Array.isArray(t) ? t.forEach((t) => r.line("req.headers.add(\"%s\", \"%s\")", e, t)) : r.line("req.headers[\"%s\"] = \"%s\"", e, t);
		}
		if (n.cookies) {
			r.line();
			let e = Object.entries(n.cookies).map(([e, t]) => `${e}=${t}`).join("; ");
			r.line("req.headers[\"Cookie\"] = \"%s\"", e);
		}
		return l(n.body) && (r.line(), c ? (r.line("req.body = "), r.json(n.body), r.append(".to_json")) : a(o, "form") ? (r.line("req.body = URI.encode_www_form("), r.json(n.body), r.append(")")) : d(n.body) ? r.line("req.body = \"%s\"", n.body) : r.line("req.body = \"%s\"", JSON.stringify(n.body))), r.outdent(), r.line("end"), r.line(), r.line("puts response.body"), t.handleErrors && (r.outdent(), r.line("rescue Faraday::Error => e"), r.indent(), r.line("puts \"Error: #{e.message}\""), r.outdent(), r.line("end")), r.output();
	}
}, L = {
	language: "rust",
	client: "reqwest",
	generate(t, n) {
		let o = new s({
			indent: t.indent || "  ",
			join: t.join || "\n"
		});
		if (o.line("use reqwest::blocking::Client;"), o.line("use std::error::Error;"), o.line(), o.line("fn main() -> Result<(), Box<dyn Error>> {"), o.indent(), o.line("let client = Client::new();"), o.line(), o.line("let res = client.request(reqwest::Method::%r, \"%s\")", n.method.toUpperCase(), n.url), o.indent(), n.params && Object.keys(n.params).length > 0) {
			o.line(".query(&["), o.indent();
			for (let [e, t] of Object.entries(n.params)) if (Array.isArray(t)) for (let n of t) o.line("(\"%s\", \"%s\"),", e, n);
			else o.line("(\"%s\", \"%s\"),", e, t);
			o.outdent(), o.line("])");
		}
		if (n.headers) for (let [e, t] of Object.entries(n.headers)) Array.isArray(t) ? t.forEach((t) => o.line(".header(\"%s\", \"%s\")", e, t)) : o.line(".header(\"%s\", \"%s\")", e, t);
		n.cookies && Object.keys(n.cookies).length > 0 && o.line(".header(\"Cookie\", \"%s\")", r(n.cookies));
		let c = Object.keys(n.headers || {}).some((e) => e.toLowerCase() === "content-type");
		if (n.body) {
			let t = e(n.headers);
			if (a(t, "form")) {
				let e = Object.entries(n.body).map(([e, t]) => o.format("(\"%s\", \"%s\")", e, String(t))).join(", ");
				o.line(".form(&[%r])", e);
			} else a(t, "json") || !t && i(n.body) ? (c || o.line(".header(\"Content-Type\", \"application/json\")"), o.line(".body("), o.jsonStringLiteral(n.body), o.append(")")) : d(n.body) && o.line(".body(\"%s\")", n.body);
		}
		return o.line(t.handleErrors ? ".send()?.error_for_status()?;" : ".send()?;"), o.outdent(), o.line(), o.line("println!(\"{}\", res.text()?);"), o.line("Ok(())"), o.outdent(), o.line("}"), o.output();
	}
};
//#endregion
//#region src/gimmehttp/clients/shell.curl.ts
function R(e) {
	return e.replace(/'/g, "'\\''");
}
var z = {
	default: !0,
	language: "shell",
	client: "curl",
	generate(t, n) {
		let o = t.indent || "  ", c = new s({
			indent: o,
			join: t.join || " \\\n"
		}), d = l(n.body), f = n.method.toUpperCase(), p = u(n.url, n.params);
		if (c.line("curl \"%s\"", p), c.indent(), (d && f !== "POST" || !d && f !== "GET") && c.line("--request %r", f), n.headers) for (let [e, t] of Object.entries(n.headers)) if (Array.isArray(t)) for (let n of t) c.line("-H \"%s\"", `${e}: ${n}`);
		else c.line("-H \"%s\"", `${e}: ${t}`);
		if (n.cookies && c.line("-b \"%s\"", r(n.cookies)), d) {
			let t = e(n.headers);
			if (a(t, "json") || !t && i(n.body)) {
				let e = JSON.stringify(n.body, null, o);
				c.line("-d '%r'", R(e));
			} else if (a(t, "form") && i(n.body)) for (let [e, t] of Object.entries(n.body)) {
				let n = `${encodeURIComponent(e)}=${encodeURIComponent(String(t))}`;
				c.line("-d '%r'", R(n));
			}
			else typeof n.body == "string" && c.line("-d '%r'", R(n.body));
		}
		let m = c.output();
		return m = m.replace(/\\\s*$/, "").trim(), m;
	}
}, B = {
	default: !0,
	language: "swift",
	client: "nsurlsession",
	generate(e, t) {
		let n = new s({
			indent: e.indent || "  ",
			join: e.join || "\n"
		});
		if (n.line("import Foundation"), n.line(), t.params && Object.keys(t.params).length > 0) {
			n.line("var urlComponents = URLComponents(string: \"%s\")!", t.url), n.line("var queryItems: [URLQueryItem] = []");
			for (let [e, r] of Object.entries(t.params)) if (Array.isArray(r)) for (let t of r) n.line("queryItems.append(URLQueryItem(name: \"%s\", value: \"%s\"))", e, t);
			else n.line("queryItems.append(URLQueryItem(name: \"%s\", value: \"%s\"))", e, r);
			n.line("urlComponents.queryItems = queryItems"), n.line("let url = urlComponents.url!");
		} else n.line("let url = URL(string: \"%s\")!", t.url);
		if (n.line("var request = URLRequest(url: url)"), n.line("request.httpMethod = \"%s\"", t.method.toUpperCase()), t.headers && Object.keys(t.headers).length > 0) {
			n.line();
			for (let [e, r] of Object.entries(t.headers)) Array.isArray(r) ? r.forEach((t) => n.line("request.addValue(\"%s\", forHTTPHeaderField: \"%s\")", t, e)) : n.line("request.addValue(\"%s\", forHTTPHeaderField: \"%s\")", r, e);
		}
		return t.cookies && Object.keys(t.cookies).length > 0 && (n.line(), n.line("request.addValue(\"%s\", forHTTPHeaderField: \"Cookie\")", r(t.cookies))), t.body && (n.line(), typeof t.body == "string" ? (n.line("let bodyString = \"%s\"", t.body), n.line("request.httpBody = bodyString.data(using: .utf8)")) : i(t.body) && (n.line("let json = "), n.jsonStringLiteral(t.body), n.line("request.httpBody = json.data(using: .utf8)"))), n.line(), n.line("do {"), n.indent(), n.line("let (data, response) = try await URLSession.shared.data(for: request)"), n.line("guard let httpResponse = response as? HTTPURLResponse else {"), n.indent(), n.line("print(\"Invalid response\")"), n.line("return"), n.outdent(), n.line("}"), n.line(), n.line("guard (200..<300).contains(httpResponse.statusCode) else {"), n.indent(), n.line("print(\"Request failed with status code: \\(httpResponse.statusCode)\")"), n.line("return"), n.outdent(), n.line("}"), n.line("let responseString = String(data: data, encoding: .utf8)"), n.line("print(responseString ?? \"No response data\")"), n.outdent(), n.line("} catch {"), n.line(), n.indent(), n.line("print(\"Error: \\(error)\")"), n.outdent(), n.line("}"), n.output();
	}
}, V = [
	p,
	g,
	_,
	y,
	b,
	x,
	S,
	C,
	w,
	T,
	E,
	D,
	O,
	A,
	M,
	N,
	P,
	F,
	I,
	L,
	z,
	B
];
//#endregion
export { V as allClients, p as cLibcurl, g as csharpHttp, _ as csharpRestsharp, y as dartHttp, b as goHttp, x as javaHttpurlconnection, S as javaOkhttp, w as jsAxios, C as jsFetch, T as jsJquery, E as kotlinKtor, O as nodeFetch, D as nodeHttp, A as phpCurl, M as phpGuzzle, N as pythonHttp, P as pythonRequests, I as rubyFaraday, F as rubyNethttp, L as rustReqwest, z as shellCurl, B as swiftNsurlsession };

//# sourceMappingURL=index.es.js.map