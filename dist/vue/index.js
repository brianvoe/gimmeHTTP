import { createElementBlock as e, defineComponent as t, openBlock as n } from "vue";
import { GimmeHTTP as r } from "gimmehttp/ui";
//#region src/gimmehttp/vue/gimmehttp.vue?vue&type=script&lang.ts
var i = t({
	name: "GimmeHttp",
	emits: ["update:language", "update:client"],
	props: { settings: {
		type: Object,
		required: !0
	} },
	data() {
		return { instance: null };
	},
	mounted() {
		this.instance = new r({
			container: this.$el,
			settings: this.settings,
			events: { afterChange: (e, t) => {
				this.$emit("update:language", e), this.$emit("update:client", t);
			} }
		});
	},
	unmounted() {
		this.instance?.destroy(), this.instance = null;
	},
	watch: { settings: {
		handler(e) {
			this.instance?.setSettings(e);
		},
		deep: !0
	} }
}), a = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, o = { class: "gimmehttp-wrap" };
function s(t, r, i, a, s, c) {
	return n(), e("div", o);
}
var c = /*#__PURE__*/ a(i, [["render", s]]), l = { install(e) {
	e.component("GimmeHttp", c);
} };
//#endregion
export { c as GimmeHttp, l as default };
