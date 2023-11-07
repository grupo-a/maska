/*! maska v2.1.10 | (c) Alexander Shabunevich | Released under the MIT license */
var j = Object.defineProperty;
var y = Object.getOwnPropertySymbols;
var V = Object.prototype.hasOwnProperty, C = Object.prototype.propertyIsEnumerable;
var A = (n, t, s) => t in n ? j(n, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[t] = s, m = (n, t) => {
  for (var s in t || (t = {}))
    V.call(t, s) && A(n, s, t[s]);
  if (y)
    for (var s of y(t))
      C.call(t, s) && A(n, s, t[s]);
  return n;
};
var S = (n, t) => {
  var s = {};
  for (var e in n)
    V.call(n, e) && t.indexOf(e) < 0 && (s[e] = n[e]);
  if (n != null && y)
    for (var e of y(n))
      t.indexOf(e) < 0 && C.call(n, e) && (s[e] = n[e]);
  return s;
};
var d = (n, t, s) => (A(n, typeof t != "symbol" ? t + "" : t, s), s);
const P = {
  "#": { pattern: /[0-9]/ },
  "@": { pattern: /[a-zA-Z]/ },
  "*": { pattern: /[a-zA-Z0-9]/ }
};
class W {
  constructor(t = {}) {
    d(this, "opts", {});
    d(this, "memo", /* @__PURE__ */ new Map());
    var e;
    const s = m({}, t);
    if (s.tokens != null) {
      s.tokens = s.tokensReplace ? m({}, s.tokens) : m(m({}, P), s.tokens);
      for (const a of Object.values(s.tokens))
        typeof a.pattern == "string" && (a.pattern = new RegExp(a.pattern));
    } else
      s.tokens = P;
    Array.isArray(s.mask) && (s.mask.length > 1 ? s.mask = [...s.mask].sort((a, i) => a.length - i.length) : s.mask = (e = s.mask[0]) != null ? e : ""), s.mask === "" && (s.mask = null), this.opts = s;
  }
  masked(t) {
    return this.process(t, this.findMask(t));
  }
  unmasked(t) {
    return this.process(t, this.findMask(t), !1);
  }
  isEager() {
    return this.opts.eager === !0;
  }
  isReversed() {
    return this.opts.reversed === !0;
  }
  completed(t) {
    const s = this.findMask(t);
    if (this.opts.mask == null || s == null)
      return !1;
    const e = this.process(t, s).length;
    return typeof this.opts.mask == "string" ? e >= this.opts.mask.length : typeof this.opts.mask == "function" ? e >= s.length : this.opts.mask.filter((a) => e >= a.length).length === this.opts.mask.length;
  }
  findMask(t) {
    var a, i;
    const s = this.opts.mask;
    if (s == null)
      return null;
    if (typeof s == "string")
      return s;
    if (typeof s == "function")
      return s(t);
    const e = this.process(t, (a = s.slice(-1).pop()) != null ? a : "", !1);
    return (i = s.find((c) => this.process(t, c, !1).length >= e.length)) != null ? i : "";
  }
  escapeMask(t) {
    const s = [], e = [];
    return t.split("").forEach((a, i) => {
      a === "!" && t[i - 1] !== "!" ? e.push(i - e.length) : s.push(a);
    }), { mask: s.join(""), escaped: e };
  }
  process(t, s, e = !0) {
    var w;
    if (s == null)
      return t;
    const a = `value=${t},mask=${s},masked=${e ? 1 : 0}`;
    if (this.memo.has(a))
      return this.memo.get(a);
    const { mask: i, escaped: c } = this.escapeMask(s), r = [], k = this.opts.tokens != null ? this.opts.tokens : {}, l = this.isReversed() ? -1 : 1, g = this.isReversed() ? "unshift" : "push", M = this.isReversed() ? 0 : i.length - 1, x = this.isReversed() ? () => o > -1 && p > -1 : () => o < i.length && p < t.length, J = (f) => !this.isReversed() && f <= M || this.isReversed() && f >= M;
    let v, u = -1, o = this.isReversed() ? i.length - 1 : 0, p = this.isReversed() ? t.length - 1 : 0;
    for (; x(); ) {
      const f = i.charAt(o), h = k[f], E = (h == null ? void 0 : h.transform) != null ? h.transform(t.charAt(p)) : t.charAt(p);
      if (!c.includes(o) && h != null) {
        if (E.match(h.pattern) != null)
          r[g](E), h.repeated ? (u === -1 ? u = o : o === M && o !== u && (o = u - l), M === u && (o -= l)) : h.multiple && (o -= l), o += l;
        else if (h.multiple) {
          const N = ((w = r[p - l]) == null ? void 0 : w.match(h.pattern)) != null, T = i.charAt(o + l);
          N && T !== "" && k[T] == null ? (o += l, p -= l) : r[g]("");
        } else
          E === v ? v = void 0 : h.optional && (o += l, p -= l);
        p += l;
      } else
        e && !this.isEager() && r[g](f), E === f && !this.isEager() ? p += l : v = f, this.isEager() || (o += l);
      if (this.isEager())
        for (; J(o) && (k[i.charAt(o)] == null || c.includes(o)); )
          e ? r[g](i.charAt(o)) : i.charAt(o) === t.charAt(p) && (p += l), o += l;
    }
    return this.memo.set(a, r.join("")), this.memo.get(a);
  }
}
const L = (n) => JSON.parse(n.replaceAll("'", '"')), b = (n, t = {}) => {
  const s = m({}, t);
  return n.dataset.maska != null && n.dataset.maska !== "" && (s.mask = U(n.dataset.maska)), n.dataset.maskaEager != null && (s.eager = R(n.dataset.maskaEager)), n.dataset.maskaReversed != null && (s.reversed = R(n.dataset.maskaReversed)), n.dataset.maskaTokensReplace != null && (s.tokensReplace = R(n.dataset.maskaTokensReplace)), n.dataset.maskaTokens != null && (s.tokens = I(n.dataset.maskaTokens)), s;
}, R = (n) => n !== "" ? !!JSON.parse(n) : !0, U = (n) => n.startsWith("[") && n.endsWith("]") ? L(n) : n, I = (n) => {
  if (n.startsWith("{") && n.endsWith("}"))
    return L(n);
  const t = {};
  return n.split("|").forEach((s) => {
    const e = s.split(":");
    t[e[0]] = {
      pattern: new RegExp(e[1]),
      optional: e[2] === "optional",
      multiple: e[2] === "multiple",
      repeated: e[2] === "repeated"
    };
  }), t;
};
class $ {
  constructor(t, s = {}) {
    d(this, "items", /* @__PURE__ */ new Map());
    d(this, "beforeinputEvent", (t) => {
      const s = t.target, e = this.items.get(s);
      e.isEager() && "inputType" in t && t.inputType.startsWith("delete") && e.unmasked(s.value).length <= 1 && this.setMaskedValue(s, "");
    });
    d(this, "inputEvent", (t) => {
      if (t instanceof CustomEvent && t.type === "input" && t.detail != null && typeof t.detail == "object" && "masked" in t.detail)
        return;
      const s = t.target, e = this.items.get(s), a = s.value, i = s.selectionStart, c = s.selectionEnd;
      let r = a;
      if (e.isEager()) {
        const k = e.masked(a), l = e.unmasked(a);
        l === "" && "data" in t && t.data != null ? r = t.data : l !== e.unmasked(k) && (r = l);
      }
      if (this.setMaskedValue(s, r), "inputType" in t && (t.inputType.startsWith("delete") || i != null && i < a.length))
        try {
          s.setSelectionRange(i, c);
        } catch (k) {
        }
    });
    this.options = s, typeof t == "string" ? this.init(
      Array.from(document.querySelectorAll(t)),
      this.getMaskOpts(s)
    ) : this.init(
      "length" in t ? Array.from(t) : [t],
      this.getMaskOpts(s)
    );
  }
  destroy() {
    for (const t of this.items.keys())
      t.removeEventListener("input", this.inputEvent), t.removeEventListener("beforeinput", this.beforeinputEvent);
    this.items.clear();
  }
  needUpdateOptions(t, s) {
    const e = this.items.get(t), a = new W(b(t, this.getMaskOpts(s)));
    return JSON.stringify(e.opts) !== JSON.stringify(a.opts);
  }
  needUpdateValue(t) {
    const s = t.dataset.maskaValue;
    return s == null && t.value !== "" || s != null && s !== t.value;
  }
  getMaskOpts(t) {
    const c = t, { onMaska: s, preProcess: e, postProcess: a } = c;
    return S(c, ["onMaska", "preProcess", "postProcess"]);
  }
  init(t, s) {
    for (const e of t) {
      const a = new W(b(e, s));
      this.items.set(e, a), e.value !== "" && this.setMaskedValue(e, e.value), e.addEventListener("input", this.inputEvent), e.addEventListener("beforeinput", this.beforeinputEvent);
    }
  }
  setMaskedValue(t, s) {
    const e = this.items.get(t);
    this.options.preProcess != null && (s = this.options.preProcess(s));
    const a = e.masked(s), i = e.unmasked(e.isEager() ? a : s), c = e.completed(s), r = { masked: a, unmasked: i, completed: c };
    s = a, this.options.postProcess != null && (s = this.options.postProcess(s)), t.value = s, t.dataset.maskaValue = s, this.options.onMaska != null && (Array.isArray(this.options.onMaska) ? this.options.onMaska.forEach((k) => k(r)) : this.options.onMaska(r)), t.dispatchEvent(new CustomEvent("maska", { detail: r })), t.dispatchEvent(new CustomEvent("input", { detail: r }));
  }
}
const O = /* @__PURE__ */ new WeakMap(), q = (n) => {
  setTimeout(() => {
    var t;
    ((t = O.get(n)) == null ? void 0 : t.needUpdateValue(n)) === !0 && n.dispatchEvent(new CustomEvent("input"));
  });
}, Z = (n, t) => {
  const s = n instanceof HTMLInputElement ? n : n.querySelector("input"), e = m({}, t.arg);
  if (s == null || (s == null ? void 0 : s.type) === "file")
    return;
  q(s);
  const a = O.get(s);
  if (a != null) {
    if (!a.needUpdateOptions(s, e))
      return;
    a.destroy();
  }
  if (t.value != null) {
    const i = t.value, c = (r) => {
      i.masked = r.masked, i.unmasked = r.unmasked, i.completed = r.completed;
    };
    e.onMaska = e.onMaska == null ? c : Array.isArray(e.onMaska) ? [...e.onMaska, c] : [e.onMaska, c];
  }
  O.set(s, new $(s, e));
};
export {
  W as Mask,
  $ as MaskInput,
  P as tokens,
  Z as vMaska
};
