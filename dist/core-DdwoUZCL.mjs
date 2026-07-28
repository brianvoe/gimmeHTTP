//#region src/gimmehttp/utils/registry.ts
var e = [];
function t() {
	return e;
}
function n() {
	return e.map((e) => e.language).filter((e, t, n) => n.indexOf(e) === t);
}
function r(t, n) {
	if (t === "" || t === void 0) return null;
	let r = e.filter((e) => e.language.toLowerCase() === t.toLowerCase());
	if (r.length === 0) return null;
	let i = r.find((e) => e.default) || r[0];
	return n && r.find((e) => e.client.toLowerCase() === n.toLowerCase()) || i;
}
function i(e, t) {
	let n = r(e, t);
	n && (n.default = !0);
}
function a(t) {
	if (!t) return /* @__PURE__ */ Error("Client is required");
	if (Array.isArray(t)) return t.forEach((e) => a(e)), null;
	let n = e.filter((e) => e.language.toLowerCase() === t.language.toLowerCase()), r = n.find((e) => e.client.toLowerCase() === t.client.toLowerCase());
	if (t.default === void 0 && (t.default = n.length === 0), r) {
		let n = e.indexOf(t);
		return e[n] = t, null;
	}
	return e.push(t), null;
}
function o() {
	e.splice(0, e.length);
}
//#endregion
//#region src/gimmehttp/utils/generate.ts
function s(e) {
	let t = c(e);
	if (t) return { error: t.message };
	e.config = l(e.config), e.language ||= "javascript";
	let n = r(e.language, e.client);
	return n ? { code: n.generate(e.config, e.http) } : { error: "Client not found" };
}
function c(e) {
	if (!e) return /* @__PURE__ */ Error("Request is required");
	if (!e.http) return /* @__PURE__ */ Error("http is required");
	if (!e.http.method) return /* @__PURE__ */ Error("http.method is required");
	if (!e.http.url) return /* @__PURE__ */ Error("http.url is required");
}
function l(e) {
	return e ||= {}, e.handleErrors === void 0 && (e.handleErrors = !1), e;
}
//#endregion
export { a, n as i, o as n, r as o, t as r, i as s, s as t };

//# sourceMappingURL=core-DdwoUZCL.mjs.map