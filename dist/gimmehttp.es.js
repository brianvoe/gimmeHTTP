import { B as p, I as L } from "./utils-BZc82ZcG.mjs";
const r = [];
function d() {
  return r;
}
function f(e) {
  return r.filter((n) => n.language === e);
}
function h(e, n) {
  const a = r.find((t) => t.language === e && t.target === n);
  if (!a)
    return new Error(`Target '${n}' not found`);
  r.forEach((t) => {
    t.language === e && (t.default = t === a);
  });
}
function s(e) {
  if (!e)
    throw new Error("Target is required");
  if (Array.isArray(e)) {
    e.forEach((t) => s(t));
    return;
  }
  e.default === void 0 && (e.default = !1);
  const n = r.find((t) => t.language === e.language && t.target === e.target);
  n && r.splice(r.indexOf(n), 1), r.filter((t) => t.language === e.language).length === 0 && (e.default = !0), e.default && r.forEach((t) => {
    t.language === e.language && (t.default = !1);
  }), r.push(e);
}
function w() {
  r.splice(0, r.length);
}
function c(e) {
  var i;
  let n = g(e);
  if (n)
    return n.message;
  e.config = l(e.config);
  const a = f(e.language.toLowerCase());
  if (a.length === 0)
    return "Language not found";
  const t = e.target ? e.target.toLowerCase() : ((i = a.find((o) => o.language.toLowerCase() === e.language.toLowerCase() && o.default)) == null ? void 0 : i.target.toLowerCase()) || "";
  if (!t)
    return "Target not found";
  const u = a.find((o) => o.language.toLowerCase() === e.language.toLowerCase() && o.target.toLowerCase() === t);
  return u ? u.generate(e.config, e.http) : "Code not found for language and target";
}
function g(e) {
  if (!e)
    return new Error("Request is required");
  if (!e.language)
    return new Error("language is required");
  if (f(e.language).length === 0)
    return new Error(`Language '${e.language}' not found`);
  if (!e.http)
    return new Error("http is required");
  if (!e.http.method)
    return new Error("http.method is required");
  if (!e.http.url)
    return new Error("http.url is required");
}
function l(e) {
  return e = e || {}, e.indent || (e.indent = "  "), e.join || (e.join = `
`), e.handleErrors === void 0 && (e.handleErrors = !1), e;
}
export {
  p as Builder,
  w as ClearRegistry,
  d as Codes,
  f as CodesByLanguage,
  c as Generate,
  L as IsJsonRequest,
  s as Register,
  h as SetDefault
};
