import { forwardRef as e, useEffect as t, useImperativeHandle as n, useRef as r, useState as i } from "react";
import { GimmeHTTP as a } from "gimmehttp/ui";
import { jsx as o } from "react/jsx-runtime";
//#region src/gimmehttp/react/gimmehttp.tsx
var s = e(({ settings: e, onLanguageChange: s, onClientChange: c }, l) => {
	let u = r(null), d = r(null), f = r(e), p = r(s), m = r(c), [h, g] = i(!1);
	return t(() => {
		p.current = s;
	}, [s]), t(() => {
		m.current = c;
	}, [c]), n(l, () => ({ gimmeHttp: d.current }), [h]), t(() => {
		if (!u.current) return;
		let e = new a({
			container: u.current,
			settings: f.current,
			events: { afterChange: (e, t) => {
				p.current?.(e), m.current?.(t);
			} }
		});
		return d.current = e, g(!0), () => {
			g(!1), e.destroy(), d.current = null;
		};
	}, []), t(() => {
		d.current?.setSettings(e);
	}, [e]), /* @__PURE__ */ o("div", {
		className: "gimmehttp-wrap",
		ref: u
	});
});
s.displayName = "GimmeHttp";
//#endregion
//#region src/gimmehttp/react/index.ts
var c = s;
//#endregion
export { s as GimmeHttp, c as default };
