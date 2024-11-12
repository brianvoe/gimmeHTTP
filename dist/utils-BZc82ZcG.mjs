class i {
  constructor(t = {}) {
    this.code = [], this.currentDepth = 0, this.indentChar = t.indent || "  ", this.lineJoin = t.join || `
`;
  }
  line(t = "") {
    this.code.push({ depth: t === "" ? 0 : this.currentDepth, line: t });
  }
  indent() {
    this.currentDepth += 1;
  }
  outdent() {
    this.currentDepth > 0 && (this.currentDepth -= 1);
  }
  output() {
    return this.code.map(({ depth: t, line: e }) => `${this.indentChar.repeat(t)}${e}`).join(this.lineJoin);
  }
}
function s(n, t) {
  return n.toUpperCase() === "POST" && t !== void 0 && Object.keys(t).some(
    (e) => e.toLowerCase() === "content-type" && t[e].toLowerCase() === "application/json"
  );
}
export {
  i as B,
  s as I
};
