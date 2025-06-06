function LoadJSCodeBlob(e, t) {
	var n = document.createElement("script");
	(n.src = URL.createObjectURL(e)),
		(n.onload = t),
		document.body.appendChild(n);
}
function LoadJSCode(e, t) {
	if (!Math.fround) {
		console.log("optimizing out Math.fround calls");
		for (
			var n = {
					LOOKING_FOR_MODULE: 0,
					SCANNING_MODULE_VARIABLES: 1,
					SCANNING_MODULE_FUNCTIONS: 2,
				},
				o = [
					"EMSCRIPTEN_START_ASM",
					"EMSCRIPTEN_START_FUNCS",
					"EMSCRIPTEN_END_FUNCS",
				],
				i = "var",
				a = "global.Math.fround;",
				r = 0,
				s = n.LOOKING_FOR_MODULE,
				d = 0,
				l = 0;
			s <= n.SCANNING_MODULE_FUNCTIONS && r < e.length;
			r++
		)
			if (
				47 == e[r] &&
				47 == e[r + 1] &&
				32 == e[r + 2] &&
				String.fromCharCode.apply(
					null,
					e.subarray(r + 3, r + 3 + o[s].length),
				) === o[s]
			)
				s++;
			else if (
				s != n.SCANNING_MODULE_VARIABLES ||
				l ||
				61 != e[r] ||
				String.fromCharCode.apply(null, e.subarray(r + 1, r + 1 + a.length)) !==
					a
			) {
				if (l && 40 == e[r]) {
					for (var u = 0; l > u && e[r - 1 - u] == e[d - u]; ) u++;
					if (u == l) {
						var c = e[r - 1 - u];
						if (
							36 > c ||
							(c > 36 && 48 > c) ||
							(c > 57 && 65 > c) ||
							(c > 90 && 95 > c) ||
							(c > 95 && 97 > c) ||
							c > 122
						)
							for (; u; u--) e[r - u] = 32;
					}
				}
			} else {
				for (d = r - 1; 32 != e[d - l]; ) l++;
				(l &&
					String.fromCharCode.apply(
						null,
						e.subarray(d - l - i.length, d - l),
					) === i) ||
					(d = l = 0);
			}
	}
	LoadJSCodeBlob(new Blob([e], { type: "text/javascript" }), t);
}
function DecompressAndLoadFile(e, t, n) {
	e += "gz";
	var o = new XMLHttpRequest();
	o.open("GET", e, !0),
		(o.onprogress = n),
		(o.responseType = "arraybuffer"),
		(o.onload = () => {
			var n = new Uint8Array(o.response),
				i = new Date().getTime(),
				a = pako.inflate(n),
				r = new Date().getTime();
			console.log(
				"Decompressed " +
					e +
					" in " +
					(r - i) +
					"ms. You can remove this delay if you configure your web server to host files using gzip compression.",
			),
				t(a);
		}),
		(o.onerror = () => {
			console.log("Could not download " + e),
				didShowErrorMessage ||
					0 != document.URL.indexOf("file:") ||
					(alert(
						"It seems your browser does not support running Unity WebGL content from file:// urls. Please upload it to an http server, or try a different browser.",
					),
					(didShowErrorMessage = !0));
		}),
		o.send(null);
}
function LoadCompressedFile(e, t, n) {
	if (CompressionState.current == CompressionState.Unsupported)
		return void DecompressAndLoadFile(e, t);
	if (CompressionState.current == CompressionState.Pending)
		return void CompressionState.pendingServerRequests.push(() => {
			LoadCompressedFile(e, t, n);
		});
	CompressionState.current == CompressionState.Uninitialized &&
		(CompressionState.current = CompressionState.Pending);
	var o = new XMLHttpRequest();
	o.open("GET", e, !0),
		(o.responseType = "arraybuffer"),
		(o.onprogress = (e) => {
			n && n(e),
				CompressionState.current == CompressionState.Pending &&
					(0 == o.status || 200 == o.status
						? CompressionState.Set(CompressionState.Supported)
						: CompressionState.Set(CompressionState.Unsupported));
		}),
		(o.onload = () => {
			if (0 == o.status || 200 == o.status) {
				CompressionState.Set(CompressionState.Supported);
				var i = new Uint8Array(o.response);
				t(i);
			} else
				CompressionState.Set(CompressionState.Unsupported),
					DecompressAndLoadFile(e, t, n);
		}),
		(o.onerror = () => {
			CompressionState.Set(CompressionState.Unsupported),
				DecompressAndLoadFile(e, t, n);
		});
	try {
		o.send(null);
	} catch (i) {
		CompressionState.Set(CompressionState.Unsupported),
			DecompressAndLoadFile(e, t, n);
	}
}
function LoadCompressedJS(e, t) {
	LoadCompressedFile(e, (e) => {
		LoadJSCode(e, t);
	});
}
function fetchRemotePackageWrapper(e, t, n, o) {
	LoadCompressedFile(e, n, (n) => {
		var o = e,
			i = t;
		if ((n.total && (i = n.total), n.loaded)) {
			Module.dataFileDownloads || (Module.dataFileDownloads = {}),
				(Module.dataFileDownloads[o] = { loaded: n.loaded, total: i });
			var a = 0,
				r = 0,
				s = 0;
			for (var d in Module.dataFileDownloads) {
				var l = Module.dataFileDownloads[d];
				(a += l.total), (r += l.loaded), s++;
			}
			(a = Math.ceil((a * Module.expectedDataFileDownloads) / s)),
				Module.setStatus &&
					Module.setStatus("Downloading data... (" + r + "/" + a + ")");
		} else
			Module.dataFileDownloads ||
				(Module.setStatus && Module.setStatus("Downloading data..."));
	});
}
function SetIndexedDBAndLoadCompressedJS(e) {
	SetIndexedDBAndLoadCompressedJS.called ||
		((SetIndexedDBAndLoadCompressedJS.called = !0),
		(Module.indexedDB = e),
		LoadCompressedJS(Module.codeUrl));
}
function CompatibilityCheck() {
	hasWebGL
		? mobile
			? confirm(
					"Please note that Unity WebGL is not currently supported on mobiles. Press Ok if you wish to continue anyway.",
				) || window.history.back()
			: -1 == browser.indexOf("Firefox") &&
				-1 == browser.indexOf("Chrome") &&
				-1 == browser.indexOf("Safari") &&
				(confirm(
					"Please note that your browser is not currently supported for this Unity WebGL content. Try installing Firefox, or press Ok if you wish to continue anyway.",
				) ||
					window.history.back())
		: (alert(
				"You need a browser which supports WebGL to run this content. Try installing Firefox.",
			),
			window.history.back());
}
function SetFullscreen(e) {
	if ("undefined" == typeof JSEvents)
		return void console.log("Player not loaded yet.");
	var t = JSEvents.canPerformEventHandlerRequests;
	(JSEvents.canPerformEventHandlerRequests = () => 1),
		Module.cwrap("SetFullscreen", "void", ["number"])(e),
		(JSEvents.canPerformEventHandlerRequests = t);
}
var CompressionState = {
	Uninitialized: 0,
	Pending: 1,
	Unsupported: 2,
	Supported: 3,
	current: 0,
	pendingServerRequests: [],
	Set: (e) => {
		if (CompressionState.current == CompressionState.Pending) {
			CompressionState.current = e;
			for (var t = 0; t < CompressionState.pendingServerRequests.length; t++)
				CompressionState.pendingServerRequests[t]();
		}
	},
};
Module.memoryInitializerRequest = {
	response: null,
	callback: null,
	addEventListener: function (e, t) {
		if ("load" != e) throw "Unexpected type " + e;
		this.callback = t;
	},
};
try {
	var idb =
			window.indexedDB ||
			window.mozIndexedDB ||
			window.webkitIndexedDB ||
			window.msIndexedDB,
		testRequest = idb.open("/idbfs-test");
	(testRequest.onerror = (e) => {
		e.preventDefault(), SetIndexedDBAndLoadCompressedJS();
	}),
		(testRequest.onsuccess = () => {
			testRequest.result.close(), SetIndexedDBAndLoadCompressedJS(idb);
		}),
		setTimeout(() => {
			SetIndexedDBAndLoadCompressedJS();
		}, 1e3);
} catch (e) {
	SetIndexedDBAndLoadCompressedJS();
}
LoadCompressedFile(Module.memUrl, (e) => {
	(Module.memoryInitializerRequest.response = e),
		Module.memoryInitializerRequest.callback &&
			Module.memoryInitializerRequest.callback();
}),
	(function (e) {
		if ("object" == typeof exports && "undefined" != typeof module)
			module.exports = e();
		else if ("function" == typeof define && define.amd) define([], e);
		else {
			var t;
			(t =
				"undefined" != typeof window
					? window
					: "undefined" != typeof global
						? global
						: "undefined" != typeof self
							? self
							: this),
				(t.pako = e());
		}
	})(() =>
		(function e(t, n, o) {
			function i(r, s) {
				if (!n[r]) {
					if (!t[r]) {
						var d = "function" == typeof require && require;
						if (!s && d) return d(r, !0);
						if (a) return a(r, !0);
						var l = new Error("Cannot find module '" + r + "'");
						throw ((l.code = "MODULE_NOT_FOUND"), l);
					}
					var u = (n[r] = { exports: {} });
					t[r][0].call(
						u.exports,
						(e) => {
							var n = t[r][1][e];
							return i(n ? n : e);
						},
						u,
						u.exports,
						e,
						t,
						n,
						o,
					);
				}
				return n[r].exports;
			}
			for (
				var a = "function" == typeof require && require, r = 0;
				r < o.length;
				r++
			)
				i(o[r]);
			return i;
		})(
			{
				1: [
					(e, t, n) => {
						var o =
							"undefined" != typeof Uint8Array &&
							"undefined" != typeof Uint16Array &&
							"undefined" != typeof Int32Array;
						(n.assign = (e) => {
							for (
								var t = Array.prototype.slice.call(arguments, 1);
								t.length;
							) {
								var n = t.shift();
								if (n) {
									if ("object" != typeof n)
										throw new TypeError(n + "must be non-object");
									for (var o in n) n.hasOwnProperty(o) && (e[o] = n[o]);
								}
							}
							return e;
						}),
							(n.shrinkBuf = (e, t) =>
								e.length === t
									? e
									: e.subarray
										? e.subarray(0, t)
										: ((e.length = t), e));
						var i = {
								arraySet: (e, t, n, o, i) => {
									if (t.subarray && e.subarray)
										return void e.set(t.subarray(n, n + o), i);
									for (var a = 0; o > a; a++) e[i + a] = t[n + a];
								},
								flattenChunks: (e) => {
									var t, n, o, i, a, r;
									for (o = 0, t = 0, n = e.length; n > t; t++) o += e[t].length;
									for (
										r = new Uint8Array(o), i = 0, t = 0, n = e.length;
										n > t;
										t++
									)
										(a = e[t]), r.set(a, i), (i += a.length);
									return r;
								},
							},
							a = {
								arraySet: (e, t, n, o, i) => {
									for (var a = 0; o > a; a++) e[i + a] = t[n + a];
								},
								flattenChunks: (e) => [].concat.apply([], e),
							};
						(n.setTyped = (e) => {
							e
								? ((n.Buf8 = Uint8Array),
									(n.Buf16 = Uint16Array),
									(n.Buf32 = Int32Array),
									n.assign(n, i))
								: ((n.Buf8 = Array),
									(n.Buf16 = Array),
									(n.Buf32 = Array),
									n.assign(n, a));
						}),
							n.setTyped(o);
					},
					{},
				],
				2: [
					(e, t, n) => {
						function o(e, t) {
							if (65537 > t && ((e.subarray && r) || (!e.subarray && a)))
								return String.fromCharCode.apply(null, i.shrinkBuf(e, t));
							for (var n = "", o = 0; t > o; o++)
								n += String.fromCharCode(e[o]);
							return n;
						}
						var i = e("./common"),
							a = !0,
							r = !0;
						try {
							String.fromCharCode.apply(null, [0]);
						} catch (s) {
							a = !1;
						}
						try {
							String.fromCharCode.apply(null, new Uint8Array(1));
						} catch (s) {
							r = !1;
						}
						for (var d = new i.Buf8(256), l = 0; 256 > l; l++)
							d[l] =
								l >= 252
									? 6
									: l >= 248
										? 5
										: l >= 240
											? 4
											: l >= 224
												? 3
												: l >= 192
													? 2
													: 1;
						(d[254] = d[254] = 1),
							(n.string2buf = (e) => {
								var t,
									n,
									o,
									a,
									r,
									s = e.length,
									d = 0;
								for (a = 0; s > a; a++)
									(n = e.charCodeAt(a)),
										55296 === (64512 & n) &&
											s > a + 1 &&
											((o = e.charCodeAt(a + 1)),
											56320 === (64512 & o) &&
												((n = 65536 + ((n - 55296) << 10) + (o - 56320)), a++)),
										(d += 128 > n ? 1 : 2048 > n ? 2 : 65536 > n ? 3 : 4);
								for (t = new i.Buf8(d), r = 0, a = 0; d > r; a++)
									(n = e.charCodeAt(a)),
										55296 === (64512 & n) &&
											s > a + 1 &&
											((o = e.charCodeAt(a + 1)),
											56320 === (64512 & o) &&
												((n = 65536 + ((n - 55296) << 10) + (o - 56320)), a++)),
										128 > n
											? (t[r++] = n)
											: 2048 > n
												? ((t[r++] = 192 | (n >>> 6)),
													(t[r++] = 128 | (63 & n)))
												: 65536 > n
													? ((t[r++] = 224 | (n >>> 12)),
														(t[r++] = 128 | ((n >>> 6) & 63)),
														(t[r++] = 128 | (63 & n)))
													: ((t[r++] = 240 | (n >>> 18)),
														(t[r++] = 128 | ((n >>> 12) & 63)),
														(t[r++] = 128 | ((n >>> 6) & 63)),
														(t[r++] = 128 | (63 & n)));
								return t;
							}),
							(n.buf2binstring = (e) => o(e, e.length)),
							(n.binstring2buf = (e) => {
								for (
									var t = new i.Buf8(e.length), n = 0, o = t.length;
									o > n;
									n++
								)
									t[n] = e.charCodeAt(n);
								return t;
							}),
							(n.buf2string = (e, t) => {
								var n,
									i,
									a,
									r,
									s = t || e.length,
									l = new Array(2 * s);
								for (i = 0, n = 0; s > n; )
									if (((a = e[n++]), 128 > a)) l[i++] = a;
									else if (((r = d[a]), r > 4)) (l[i++] = 65533), (n += r - 1);
									else {
										for (a &= 2 === r ? 31 : 3 === r ? 15 : 7; r > 1 && s > n; )
											(a = (a << 6) | (63 & e[n++])), r--;
										r > 1
											? (l[i++] = 65533)
											: 65536 > a
												? (l[i++] = a)
												: ((a -= 65536),
													(l[i++] = 55296 | ((a >> 10) & 1023)),
													(l[i++] = 56320 | (1023 & a)));
									}
								return o(l, i);
							}),
							(n.utf8border = (e, t) => {
								var n;
								for (
									t = t || e.length, t > e.length && (t = e.length), n = t - 1;
									n >= 0 && 128 === (192 & e[n]);
								)
									n--;
								return 0 > n ? t : 0 === n ? t : n + d[e[n]] > t ? n : t;
							});
					},
					{ "./common": 1 },
				],
				3: [
					(e, t, n) => {
						function o(e, t, n, o) {
							for (
								var i = (65535 & e) | 0, a = ((e >>> 16) & 65535) | 0, r = 0;
								0 !== n;
							) {
								(r = n > 2e3 ? 2e3 : n), (n -= r);
								do (i = (i + t[o++]) | 0), (a = (a + i) | 0);
								while (--r);
								(i %= 65521), (a %= 65521);
							}
							return i | (a << 16) | 0;
						}
						t.exports = o;
					},
					{},
				],
				4: [
					(e, t, n) => {
						t.exports = {
							Z_NO_FLUSH: 0,
							Z_PARTIAL_FLUSH: 1,
							Z_SYNC_FLUSH: 2,
							Z_FULL_FLUSH: 3,
							Z_FINISH: 4,
							Z_BLOCK: 5,
							Z_TREES: 6,
							Z_OK: 0,
							Z_STREAM_END: 1,
							Z_NEED_DICT: 2,
							Z_ERRNO: -1,
							Z_STREAM_ERROR: -2,
							Z_DATA_ERROR: -3,
							Z_BUF_ERROR: -5,
							Z_NO_COMPRESSION: 0,
							Z_BEST_SPEED: 1,
							Z_BEST_COMPRESSION: 9,
							Z_DEFAULT_COMPRESSION: -1,
							Z_FILTERED: 1,
							Z_HUFFMAN_ONLY: 2,
							Z_RLE: 3,
							Z_FIXED: 4,
							Z_DEFAULT_STRATEGY: 0,
							Z_BINARY: 0,
							Z_TEXT: 1,
							Z_UNKNOWN: 2,
							Z_DEFLATED: 8,
						};
					},
					{},
				],
				5: [
					(e, t, n) => {
						function o() {
							for (var e, t = [], n = 0; 256 > n; n++) {
								e = n;
								for (var o = 0; 8 > o; o++)
									e = 1 & e ? 3988292384 ^ (e >>> 1) : e >>> 1;
								t[n] = e;
							}
							return t;
						}
						function i(e, t, n, o) {
							var i = a,
								r = o + n;
							e = -1 ^ e;
							for (var s = o; r > s; s++) e = (e >>> 8) ^ i[255 & (e ^ t[s])];
							return -1 ^ e;
						}
						var a = o();
						t.exports = i;
					},
					{},
				],
				6: [
					(e, t, n) => {
						function o() {
							(this.text = 0),
								(this.time = 0),
								(this.xflags = 0),
								(this.os = 0),
								(this.extra = null),
								(this.extra_len = 0),
								(this.name = ""),
								(this.comment = ""),
								(this.hcrc = 0),
								(this.done = !1);
						}
						t.exports = o;
					},
					{},
				],
				7: [
					(e, t, n) => {
						var o = 30,
							i = 12;
						t.exports = (e, t) => {
							var n,
								a,
								r,
								s,
								d,
								l,
								u,
								c,
								f,
								h,
								p,
								m,
								w,
								b,
								g,
								v,
								k,
								y,
								_,
								S,
								x,
								M,
								C,
								E,
								D;
							(n = e.state),
								(a = e.next_in),
								(E = e.input),
								(r = a + (e.avail_in - 5)),
								(s = e.next_out),
								(D = e.output),
								(d = s - (t - e.avail_out)),
								(l = s + (e.avail_out - 257)),
								(u = n.dmax),
								(c = n.wsize),
								(f = n.whave),
								(h = n.wnext),
								(p = n.window),
								(m = n.hold),
								(w = n.bits),
								(b = n.lencode),
								(g = n.distcode),
								(v = (1 << n.lenbits) - 1),
								(k = (1 << n.distbits) - 1);
							e: do {
								15 > w &&
									((m += E[a++] << w), (w += 8), (m += E[a++] << w), (w += 8)),
									(y = b[m & v]);
								for (;;) {
									if (
										((_ = y >>> 24),
										(m >>>= _),
										(w -= _),
										(_ = (y >>> 16) & 255),
										0 === _)
									)
										D[s++] = 65535 & y;
									else {
										if (!(16 & _)) {
											if (0 === (64 & _)) {
												y = b[(65535 & y) + (m & ((1 << _) - 1))];
												continue;
											}
											if (32 & _) {
												n.mode = i;
												break e;
											}
											(e.msg = "invalid literal/length code"), (n.mode = o);
											break e;
										}
										(S = 65535 & y),
											(_ &= 15),
											_ &&
												(_ > w && ((m += E[a++] << w), (w += 8)),
												(S += m & ((1 << _) - 1)),
												(m >>>= _),
												(w -= _)),
											15 > w &&
												((m += E[a++] << w),
												(w += 8),
												(m += E[a++] << w),
												(w += 8)),
											(y = g[m & k]);
										for (;;) {
											if (
												((_ = y >>> 24),
												(m >>>= _),
												(w -= _),
												(_ = (y >>> 16) & 255),
												!(16 & _))
											) {
												if (0 === (64 & _)) {
													y = g[(65535 & y) + (m & ((1 << _) - 1))];
													continue;
												}
												(e.msg = "invalid distance code"), (n.mode = o);
												break e;
											}
											if (
												((x = 65535 & y),
												(_ &= 15),
												_ > w &&
													((m += E[a++] << w),
													(w += 8),
													_ > w && ((m += E[a++] << w), (w += 8))),
												(x += m & ((1 << _) - 1)),
												x > u)
											) {
												(e.msg = "invalid distance too far back"), (n.mode = o);
												break e;
											}
											if (((m >>>= _), (w -= _), (_ = s - d), x > _)) {
												if (((_ = x - _), _ > f && n.sane)) {
													(e.msg = "invalid distance too far back"),
														(n.mode = o);
													break e;
												}
												if (((M = 0), (C = p), 0 === h)) {
													if (((M += c - _), S > _)) {
														S -= _;
														do D[s++] = p[M++];
														while (--_);
														(M = s - x), (C = D);
													}
												} else if (_ > h) {
													if (((M += c + h - _), (_ -= h), S > _)) {
														S -= _;
														do D[s++] = p[M++];
														while (--_);
														if (((M = 0), S > h)) {
															(_ = h), (S -= _);
															do D[s++] = p[M++];
															while (--_);
															(M = s - x), (C = D);
														}
													}
												} else if (((M += h - _), S > _)) {
													S -= _;
													do D[s++] = p[M++];
													while (--_);
													(M = s - x), (C = D);
												}
												while (S > 2)
													(D[s++] = C[M++]),
														(D[s++] = C[M++]),
														(D[s++] = C[M++]),
														(S -= 3);
												S && ((D[s++] = C[M++]), S > 1 && (D[s++] = C[M++]));
											} else {
												M = s - x;
												do
													(D[s++] = D[M++]),
														(D[s++] = D[M++]),
														(D[s++] = D[M++]),
														(S -= 3);
												while (S > 2);
												S && ((D[s++] = D[M++]), S > 1 && (D[s++] = D[M++]));
											}
											break;
										}
									}
									break;
								}
							} while (r > a && l > s);
							(S = w >> 3),
								(a -= S),
								(w -= S << 3),
								(m &= (1 << w) - 1),
								(e.next_in = a),
								(e.next_out = s),
								(e.avail_in = r > a ? 5 + (r - a) : 5 - (a - r)),
								(e.avail_out = l > s ? 257 + (l - s) : 257 - (s - l)),
								(n.hold = m),
								(n.bits = w);
						};
					},
					{},
				],
				8: [
					(e, t, n) => {
						function o(e) {
							return (
								((e >>> 24) & 255) +
								((e >>> 8) & 65280) +
								((65280 & e) << 8) +
								((255 & e) << 24)
							);
						}
						function i() {
							(this.mode = 0),
								(this.last = !1),
								(this.wrap = 0),
								(this.havedict = !1),
								(this.flags = 0),
								(this.dmax = 0),
								(this.check = 0),
								(this.total = 0),
								(this.head = null),
								(this.wbits = 0),
								(this.wsize = 0),
								(this.whave = 0),
								(this.wnext = 0),
								(this.window = null),
								(this.hold = 0),
								(this.bits = 0),
								(this.length = 0),
								(this.offset = 0),
								(this.extra = 0),
								(this.lencode = null),
								(this.distcode = null),
								(this.lenbits = 0),
								(this.distbits = 0),
								(this.ncode = 0),
								(this.nlen = 0),
								(this.ndist = 0),
								(this.have = 0),
								(this.next = null),
								(this.lens = new b.Buf16(320)),
								(this.work = new b.Buf16(288)),
								(this.lendyn = null),
								(this.distdyn = null),
								(this.sane = 0),
								(this.back = 0),
								(this.was = 0);
						}
						function a(e) {
							var t;
							return e && e.state
								? ((t = e.state),
									(e.total_in = e.total_out = t.total = 0),
									(e.msg = ""),
									t.wrap && (e.adler = 1 & t.wrap),
									(t.mode = U),
									(t.last = 0),
									(t.havedict = 0),
									(t.dmax = 32768),
									(t.head = null),
									(t.hold = 0),
									(t.bits = 0),
									(t.lencode = t.lendyn = new b.Buf32(pe)),
									(t.distcode = t.distdyn = new b.Buf32(me)),
									(t.sane = 1),
									(t.back = -1),
									D)
								: F;
						}
						function r(e) {
							var t;
							return e && e.state
								? ((t = e.state),
									(t.wsize = 0),
									(t.whave = 0),
									(t.wnext = 0),
									a(e))
								: F;
						}
						function s(e, t) {
							var n, o;
							return e && e.state
								? ((o = e.state),
									0 > t
										? ((n = 0), (t = -t))
										: ((n = (t >> 4) + 1), 48 > t && (t &= 15)),
									t && (8 > t || t > 15)
										? F
										: (null !== o.window && o.wbits !== t && (o.window = null),
											(o.wrap = n),
											(o.wbits = t),
											r(e)))
								: F;
						}
						function d(e, t) {
							var n, o;
							return e
								? ((o = new i()),
									(e.state = o),
									(o.window = null),
									(n = s(e, t)),
									n !== D && (e.state = null),
									n)
								: F;
						}
						function l(e) {
							return d(e, be);
						}
						function u(e) {
							if (ge) {
								var t;
								for (
									m = new b.Buf32(512), w = new b.Buf32(32), t = 0;
									144 > t;
								)
									e.lens[t++] = 8;
								while (256 > t) e.lens[t++] = 9;
								while (280 > t) e.lens[t++] = 7;
								while (288 > t) e.lens[t++] = 8;
								for (
									y(S, e.lens, 0, 288, m, 0, e.work, { bits: 9 }), t = 0;
									32 > t;
								)
									e.lens[t++] = 5;
								y(x, e.lens, 0, 32, w, 0, e.work, { bits: 5 }), (ge = !1);
							}
							(e.lencode = m),
								(e.lenbits = 9),
								(e.distcode = w),
								(e.distbits = 5);
						}
						function c(e, t, n, o) {
							var i,
								a = e.state;
							return (
								null === a.window &&
									((a.wsize = 1 << a.wbits),
									(a.wnext = 0),
									(a.whave = 0),
									(a.window = new b.Buf8(a.wsize))),
								o >= a.wsize
									? (b.arraySet(a.window, t, n - a.wsize, a.wsize, 0),
										(a.wnext = 0),
										(a.whave = a.wsize))
									: ((i = a.wsize - a.wnext),
										i > o && (i = o),
										b.arraySet(a.window, t, n - o, i, a.wnext),
										(o -= i),
										o
											? (b.arraySet(a.window, t, n - o, o, 0),
												(a.wnext = o),
												(a.whave = a.wsize))
											: ((a.wnext += i),
												a.wnext === a.wsize && (a.wnext = 0),
												a.whave < a.wsize && (a.whave += i))),
								0
							);
						}
						function f(e, t) {
							var n,
								i,
								a,
								r,
								s,
								d,
								l,
								f,
								h,
								p,
								m,
								w,
								pe,
								me,
								we,
								be,
								ge,
								ve,
								ke,
								ye,
								_e,
								Se,
								xe,
								Me,
								Ce = 0,
								Ee = new b.Buf8(4),
								De = [
									16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1,
									15,
								];
							if (!e || !e.state || !e.output || (!e.input && 0 !== e.avail_in))
								return F;
							(n = e.state),
								n.mode === W && (n.mode = K),
								(s = e.next_out),
								(a = e.output),
								(l = e.avail_out),
								(r = e.next_in),
								(i = e.input),
								(d = e.avail_in),
								(f = n.hold),
								(h = n.bits),
								(p = d),
								(m = l),
								(Se = D);
							e: for (;;)
								switch (n.mode) {
									case U:
										if (0 === n.wrap) {
											n.mode = K;
											break;
										}
										while (16 > h) {
											if (0 === d) break e;
											d--, (f += i[r++] << h), (h += 8);
										}
										if (2 & n.wrap && 35615 === f) {
											(n.check = 0),
												(Ee[0] = 255 & f),
												(Ee[1] = (f >>> 8) & 255),
												(n.check = v(n.check, Ee, 2, 0)),
												(f = 0),
												(h = 0),
												(n.mode = N);
											break;
										}
										if (
											((n.flags = 0),
											n.head && (n.head.done = !1),
											!(1 & n.wrap) || (((255 & f) << 8) + (f >> 8)) % 31)
										) {
											(e.msg = "incorrect header check"), (n.mode = ce);
											break;
										}
										if ((15 & f) !== O) {
											(e.msg = "unknown compression method"), (n.mode = ce);
											break;
										}
										if (
											((f >>>= 4), (h -= 4), (_e = (15 & f) + 8), 0 === n.wbits)
										)
											n.wbits = _e;
										else if (_e > n.wbits) {
											(e.msg = "invalid window size"), (n.mode = ce);
											break;
										}
										(n.dmax = 1 << _e),
											(e.adler = n.check = 1),
											(n.mode = 512 & f ? j : W),
											(f = 0),
											(h = 0);
										break;
									case N:
										while (16 > h) {
											if (0 === d) break e;
											d--, (f += i[r++] << h), (h += 8);
										}
										if (((n.flags = f), (255 & n.flags) !== O)) {
											(e.msg = "unknown compression method"), (n.mode = ce);
											break;
										}
										if (57344 & n.flags) {
											(e.msg = "unknown header flags set"), (n.mode = ce);
											break;
										}
										n.head && (n.head.text = (f >> 8) & 1),
											512 & n.flags &&
												((Ee[0] = 255 & f),
												(Ee[1] = (f >>> 8) & 255),
												(n.check = v(n.check, Ee, 2, 0))),
											(f = 0),
											(h = 0),
											(n.mode = z);
									case z:
										while (32 > h) {
											if (0 === d) break e;
											d--, (f += i[r++] << h), (h += 8);
										}
										n.head && (n.head.time = f),
											512 & n.flags &&
												((Ee[0] = 255 & f),
												(Ee[1] = (f >>> 8) & 255),
												(Ee[2] = (f >>> 16) & 255),
												(Ee[3] = (f >>> 24) & 255),
												(n.check = v(n.check, Ee, 4, 0))),
											(f = 0),
											(h = 0),
											(n.mode = T);
									case T:
										while (16 > h) {
											if (0 === d) break e;
											d--, (f += i[r++] << h), (h += 8);
										}
										n.head && ((n.head.xflags = 255 & f), (n.head.os = f >> 8)),
											512 & n.flags &&
												((Ee[0] = 255 & f),
												(Ee[1] = (f >>> 8) & 255),
												(n.check = v(n.check, Ee, 2, 0))),
											(f = 0),
											(h = 0),
											(n.mode = P);
									case P:
										if (1024 & n.flags) {
											while (16 > h) {
												if (0 === d) break e;
												d--, (f += i[r++] << h), (h += 8);
											}
											(n.length = f),
												n.head && (n.head.extra_len = f),
												512 & n.flags &&
													((Ee[0] = 255 & f),
													(Ee[1] = (f >>> 8) & 255),
													(n.check = v(n.check, Ee, 2, 0))),
												(f = 0),
												(h = 0);
										} else n.head && (n.head.extra = null);
										n.mode = Z;
									case Z:
										if (
											1024 & n.flags &&
											((w = n.length),
											w > d && (w = d),
											w &&
												(n.head &&
													((_e = n.head.extra_len - n.length),
													n.head.extra ||
														(n.head.extra = new Array(n.head.extra_len)),
													b.arraySet(n.head.extra, i, r, w, _e)),
												512 & n.flags && (n.check = v(n.check, i, w, r)),
												(d -= w),
												(r += w),
												(n.length -= w)),
											n.length)
										)
											break e;
										(n.length = 0), (n.mode = q);
									case q:
										if (2048 & n.flags) {
											if (0 === d) break e;
											w = 0;
											do
												(_e = i[r + w++]),
													n.head &&
														_e &&
														n.length < 65536 &&
														(n.head.name += String.fromCharCode(_e));
											while (_e && d > w);
											if (
												(512 & n.flags && (n.check = v(n.check, i, w, r)),
												(d -= w),
												(r += w),
												_e)
											)
												break e;
										} else n.head && (n.head.name = null);
										(n.length = 0), (n.mode = G);
									case G:
										if (4096 & n.flags) {
											if (0 === d) break e;
											w = 0;
											do
												(_e = i[r + w++]),
													n.head &&
														_e &&
														n.length < 65536 &&
														(n.head.comment += String.fromCharCode(_e));
											while (_e && d > w);
											if (
												(512 & n.flags && (n.check = v(n.check, i, w, r)),
												(d -= w),
												(r += w),
												_e)
											)
												break e;
										} else n.head && (n.head.comment = null);
										n.mode = H;
									case H:
										if (512 & n.flags) {
											while (16 > h) {
												if (0 === d) break e;
												d--, (f += i[r++] << h), (h += 8);
											}
											if (f !== (65535 & n.check)) {
												(e.msg = "header crc mismatch"), (n.mode = ce);
												break;
											}
											(f = 0), (h = 0);
										}
										n.head &&
											((n.head.hcrc = (n.flags >> 9) & 1), (n.head.done = !0)),
											(e.adler = n.check = 0),
											(n.mode = W);
										break;
									case j:
										while (32 > h) {
											if (0 === d) break e;
											d--, (f += i[r++] << h), (h += 8);
										}
										(e.adler = n.check = o(f)), (f = 0), (h = 0), (n.mode = J);
									case J:
										if (0 === n.havedict)
											return (
												(e.next_out = s),
												(e.avail_out = l),
												(e.next_in = r),
												(e.avail_in = d),
												(n.hold = f),
												(n.bits = h),
												I
											);
										(e.adler = n.check = 1), (n.mode = W);
									case W:
										if (t === C || t === E) break e;
									case K:
										if (n.last) {
											(f >>>= 7 & h), (h -= 7 & h), (n.mode = de);
											break;
										}
										while (3 > h) {
											if (0 === d) break e;
											d--, (f += i[r++] << h), (h += 8);
										}
										switch (((n.last = 1 & f), (f >>>= 1), (h -= 1), 3 & f)) {
											case 0:
												n.mode = Y;
												break;
											case 1:
												if ((u(n), (n.mode = te), t === E)) {
													(f >>>= 2), (h -= 2);
													break e;
												}
												break;
											case 2:
												n.mode = Q;
												break;
											case 3:
												(e.msg = "invalid block type"), (n.mode = ce);
										}
										(f >>>= 2), (h -= 2);
										break;
									case Y:
										for (f >>>= 7 & h, h -= 7 & h; 32 > h; ) {
											if (0 === d) break e;
											d--, (f += i[r++] << h), (h += 8);
										}
										if ((65535 & f) !== ((f >>> 16) ^ 65535)) {
											(e.msg = "invalid stored block lengths"), (n.mode = ce);
											break;
										}
										if (
											((n.length = 65535 & f),
											(f = 0),
											(h = 0),
											(n.mode = X),
											t === E)
										)
											break e;
									case X:
										n.mode = V;
									case V:
										if ((w = n.length)) {
											if ((w > d && (w = d), w > l && (w = l), 0 === w))
												break e;
											b.arraySet(a, i, r, w, s),
												(d -= w),
												(r += w),
												(l -= w),
												(s += w),
												(n.length -= w);
											break;
										}
										n.mode = W;
										break;
									case Q:
										while (14 > h) {
											if (0 === d) break e;
											d--, (f += i[r++] << h), (h += 8);
										}
										if (
											((n.nlen = (31 & f) + 257),
											(f >>>= 5),
											(h -= 5),
											(n.ndist = (31 & f) + 1),
											(f >>>= 5),
											(h -= 5),
											(n.ncode = (15 & f) + 4),
											(f >>>= 4),
											(h -= 4),
											n.nlen > 286 || n.ndist > 30)
										) {
											(e.msg = "too many length or distance symbols"),
												(n.mode = ce);
											break;
										}
										(n.have = 0), (n.mode = $);
									case $:
										while (n.have < n.ncode) {
											while (3 > h) {
												if (0 === d) break e;
												d--, (f += i[r++] << h), (h += 8);
											}
											(n.lens[De[n.have++]] = 7 & f), (f >>>= 3), (h -= 3);
										}
										while (n.have < 19) n.lens[De[n.have++]] = 0;
										if (
											((n.lencode = n.lendyn),
											(n.lenbits = 7),
											(xe = { bits: n.lenbits }),
											(Se = y(_, n.lens, 0, 19, n.lencode, 0, n.work, xe)),
											(n.lenbits = xe.bits),
											Se)
										) {
											(e.msg = "invalid code lengths set"), (n.mode = ce);
											break;
										}
										(n.have = 0), (n.mode = ee);
									case ee:
										while (n.have < n.nlen + n.ndist) {
											while (
												((Ce = n.lencode[f & ((1 << n.lenbits) - 1)]),
												(we = Ce >>> 24),
												(be = (Ce >>> 16) & 255),
												(ge = 65535 & Ce),
												!(h >= we))
											) {
												if (0 === d) break e;
												d--, (f += i[r++] << h), (h += 8);
											}
											if (16 > ge)
												(f >>>= we), (h -= we), (n.lens[n.have++] = ge);
											else {
												if (16 === ge) {
													for (Me = we + 2; Me > h; ) {
														if (0 === d) break e;
														d--, (f += i[r++] << h), (h += 8);
													}
													if (((f >>>= we), (h -= we), 0 === n.have)) {
														(e.msg = "invalid bit length repeat"),
															(n.mode = ce);
														break;
													}
													(_e = n.lens[n.have - 1]),
														(w = 3 + (3 & f)),
														(f >>>= 2),
														(h -= 2);
												} else if (17 === ge) {
													for (Me = we + 3; Me > h; ) {
														if (0 === d) break e;
														d--, (f += i[r++] << h), (h += 8);
													}
													(f >>>= we),
														(h -= we),
														(_e = 0),
														(w = 3 + (7 & f)),
														(f >>>= 3),
														(h -= 3);
												} else {
													for (Me = we + 7; Me > h; ) {
														if (0 === d) break e;
														d--, (f += i[r++] << h), (h += 8);
													}
													(f >>>= we),
														(h -= we),
														(_e = 0),
														(w = 11 + (127 & f)),
														(f >>>= 7),
														(h -= 7);
												}
												if (n.have + w > n.nlen + n.ndist) {
													(e.msg = "invalid bit length repeat"), (n.mode = ce);
													break;
												}
												while (w--) n.lens[n.have++] = _e;
											}
										}
										if (n.mode === ce) break;
										if (0 === n.lens[256]) {
											(e.msg = "invalid code -- missing end-of-block"),
												(n.mode = ce);
											break;
										}
										if (
											((n.lenbits = 9),
											(xe = { bits: n.lenbits }),
											(Se = y(S, n.lens, 0, n.nlen, n.lencode, 0, n.work, xe)),
											(n.lenbits = xe.bits),
											Se)
										) {
											(e.msg = "invalid literal/lengths set"), (n.mode = ce);
											break;
										}
										if (
											((n.distbits = 6),
											(n.distcode = n.distdyn),
											(xe = { bits: n.distbits }),
											(Se = y(
												x,
												n.lens,
												n.nlen,
												n.ndist,
												n.distcode,
												0,
												n.work,
												xe,
											)),
											(n.distbits = xe.bits),
											Se)
										) {
											(e.msg = "invalid distances set"), (n.mode = ce);
											break;
										}
										if (((n.mode = te), t === E)) break e;
									case te:
										n.mode = ne;
									case ne:
										if (d >= 6 && l >= 258) {
											(e.next_out = s),
												(e.avail_out = l),
												(e.next_in = r),
												(e.avail_in = d),
												(n.hold = f),
												(n.bits = h),
												k(e, m),
												(s = e.next_out),
												(a = e.output),
												(l = e.avail_out),
												(r = e.next_in),
												(i = e.input),
												(d = e.avail_in),
												(f = n.hold),
												(h = n.bits),
												n.mode === W && (n.back = -1);
											break;
										}
										for (
											n.back = 0;
											(Ce = n.lencode[f & ((1 << n.lenbits) - 1)]),
												(we = Ce >>> 24),
												(be = (Ce >>> 16) & 255),
												(ge = 65535 & Ce),
												!(h >= we);
										) {
											if (0 === d) break e;
											d--, (f += i[r++] << h), (h += 8);
										}
										if (be && 0 === (240 & be)) {
											for (
												ve = we, ke = be, ye = ge;
												(Ce =
													n.lencode[ye + ((f & ((1 << (ve + ke)) - 1)) >> ve)]),
													(we = Ce >>> 24),
													(be = (Ce >>> 16) & 255),
													(ge = 65535 & Ce),
													!(h >= ve + we);
											) {
												if (0 === d) break e;
												d--, (f += i[r++] << h), (h += 8);
											}
											(f >>>= ve), (h -= ve), (n.back += ve);
										}
										if (
											((f >>>= we),
											(h -= we),
											(n.back += we),
											(n.length = ge),
											0 === be)
										) {
											n.mode = se;
											break;
										}
										if (32 & be) {
											(n.back = -1), (n.mode = W);
											break;
										}
										if (64 & be) {
											(e.msg = "invalid literal/length code"), (n.mode = ce);
											break;
										}
										(n.extra = 15 & be), (n.mode = oe);
									case oe:
										if (n.extra) {
											for (Me = n.extra; Me > h; ) {
												if (0 === d) break e;
												d--, (f += i[r++] << h), (h += 8);
											}
											(n.length += f & ((1 << n.extra) - 1)),
												(f >>>= n.extra),
												(h -= n.extra),
												(n.back += n.extra);
										}
										(n.was = n.length), (n.mode = ie);
									case ie:
										while (
											((Ce = n.distcode[f & ((1 << n.distbits) - 1)]),
											(we = Ce >>> 24),
											(be = (Ce >>> 16) & 255),
											(ge = 65535 & Ce),
											!(h >= we))
										) {
											if (0 === d) break e;
											d--, (f += i[r++] << h), (h += 8);
										}
										if (0 === (240 & be)) {
											for (
												ve = we, ke = be, ye = ge;
												(Ce =
													n.distcode[
														ye + ((f & ((1 << (ve + ke)) - 1)) >> ve)
													]),
													(we = Ce >>> 24),
													(be = (Ce >>> 16) & 255),
													(ge = 65535 & Ce),
													!(h >= ve + we);
											) {
												if (0 === d) break e;
												d--, (f += i[r++] << h), (h += 8);
											}
											(f >>>= ve), (h -= ve), (n.back += ve);
										}
										if (((f >>>= we), (h -= we), (n.back += we), 64 & be)) {
											(e.msg = "invalid distance code"), (n.mode = ce);
											break;
										}
										(n.offset = ge), (n.extra = 15 & be), (n.mode = ae);
									case ae:
										if (n.extra) {
											for (Me = n.extra; Me > h; ) {
												if (0 === d) break e;
												d--, (f += i[r++] << h), (h += 8);
											}
											(n.offset += f & ((1 << n.extra) - 1)),
												(f >>>= n.extra),
												(h -= n.extra),
												(n.back += n.extra);
										}
										if (n.offset > n.dmax) {
											(e.msg = "invalid distance too far back"), (n.mode = ce);
											break;
										}
										n.mode = re;
									case re:
										if (0 === l) break e;
										if (((w = m - l), n.offset > w)) {
											if (((w = n.offset - w), w > n.whave && n.sane)) {
												(e.msg = "invalid distance too far back"),
													(n.mode = ce);
												break;
											}
											w > n.wnext
												? ((w -= n.wnext), (pe = n.wsize - w))
												: (pe = n.wnext - w),
												w > n.length && (w = n.length),
												(me = n.window);
										} else (me = a), (pe = s - n.offset), (w = n.length);
										w > l && (w = l), (l -= w), (n.length -= w);
										do a[s++] = me[pe++];
										while (--w);
										0 === n.length && (n.mode = ne);
										break;
									case se:
										if (0 === l) break e;
										(a[s++] = n.length), l--, (n.mode = ne);
										break;
									case de:
										if (n.wrap) {
											while (32 > h) {
												if (0 === d) break e;
												d--, (f |= i[r++] << h), (h += 8);
											}
											if (
												((m -= l),
												(e.total_out += m),
												(n.total += m),
												m &&
													(e.adler = n.check =
														n.flags
															? v(n.check, a, m, s - m)
															: g(n.check, a, m, s - m)),
												(m = l),
												(n.flags ? f : o(f)) !== n.check)
											) {
												(e.msg = "incorrect data check"), (n.mode = ce);
												break;
											}
											(f = 0), (h = 0);
										}
										n.mode = le;
									case le:
										if (n.wrap && n.flags) {
											while (32 > h) {
												if (0 === d) break e;
												d--, (f += i[r++] << h), (h += 8);
											}
											if (f !== (4294967295 & n.total)) {
												(e.msg = "incorrect length check"), (n.mode = ce);
												break;
											}
											(f = 0), (h = 0);
										}
										n.mode = ue;
									case ue:
										Se = R;
										break e;
									case ce:
										Se = L;
										break e;
									case fe:
										return A;
									case he:
									default:
										return F;
								}
							return (
								(e.next_out = s),
								(e.avail_out = l),
								(e.next_in = r),
								(e.avail_in = d),
								(n.hold = f),
								(n.bits = h),
								(n.wsize ||
									(m !== e.avail_out &&
										n.mode < ce &&
										(n.mode < de || t !== M))) &&
								c(e, e.output, e.next_out, m - e.avail_out)
									? ((n.mode = fe), A)
									: ((p -= e.avail_in),
										(m -= e.avail_out),
										(e.total_in += p),
										(e.total_out += m),
										(n.total += m),
										n.wrap &&
											m &&
											(e.adler = n.check =
												n.flags
													? v(n.check, a, m, e.next_out - m)
													: g(n.check, a, m, e.next_out - m)),
										(e.data_type =
											n.bits +
											(n.last ? 64 : 0) +
											(n.mode === W ? 128 : 0) +
											(n.mode === te || n.mode === X ? 256 : 0)),
										((0 === p && 0 === m) || t === M) && Se === D && (Se = B),
										Se)
							);
						}
						function h(e) {
							if (!e || !e.state) return F;
							var t = e.state;
							return t.window && (t.window = null), (e.state = null), D;
						}
						function p(e, t) {
							var n;
							return e && e.state
								? ((n = e.state),
									0 === (2 & n.wrap) ? F : ((n.head = t), (t.done = !1), D))
								: F;
						}
						var m,
							w,
							b = e("../utils/common"),
							g = e("./adler32"),
							v = e("./crc32"),
							k = e("./inffast"),
							y = e("./inftrees"),
							_ = 0,
							S = 1,
							x = 2,
							M = 4,
							C = 5,
							E = 6,
							D = 0,
							R = 1,
							I = 2,
							F = -2,
							L = -3,
							A = -4,
							B = -5,
							O = 8,
							U = 1,
							N = 2,
							z = 3,
							T = 4,
							P = 5,
							Z = 6,
							q = 7,
							G = 8,
							H = 9,
							j = 10,
							J = 11,
							W = 12,
							K = 13,
							Y = 14,
							X = 15,
							V = 16,
							Q = 17,
							$ = 18,
							ee = 19,
							te = 20,
							ne = 21,
							oe = 22,
							ie = 23,
							ae = 24,
							re = 25,
							se = 26,
							de = 27,
							le = 28,
							ue = 29,
							ce = 30,
							fe = 31,
							he = 32,
							pe = 852,
							me = 592,
							we = 15,
							be = we,
							ge = !0;
						(n.inflateReset = r),
							(n.inflateReset2 = s),
							(n.inflateResetKeep = a),
							(n.inflateInit = l),
							(n.inflateInit2 = d),
							(n.inflate = f),
							(n.inflateEnd = h),
							(n.inflateGetHeader = p),
							(n.inflateInfo = "pako inflate (from Nodeca project)");
					},
					{
						"../utils/common": 1,
						"./adler32": 3,
						"./crc32": 5,
						"./inffast": 7,
						"./inftrees": 9,
					},
				],
				9: [
					(e, t, n) => {
						var o = e("../utils/common"),
							i = 15,
							a = 852,
							r = 592,
							s = 0,
							d = 1,
							l = 2,
							u = [
								3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43,
								51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
							],
							c = [
								16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
								19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78,
							],
							f = [
								1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257,
								385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289,
								16385, 24577, 0, 0,
							],
							h = [
								16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
								23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64,
							];
						t.exports = (e, t, n, p, m, w, b, g) => {
							var v,
								k,
								y,
								_,
								S,
								x,
								M,
								C,
								E,
								D = g.bits,
								R = 0,
								I = 0,
								F = 0,
								L = 0,
								A = 0,
								B = 0,
								O = 0,
								U = 0,
								N = 0,
								z = 0,
								T = null,
								P = 0,
								Z = new o.Buf16(i + 1),
								q = new o.Buf16(i + 1),
								G = null,
								H = 0;
							for (R = 0; i >= R; R++) Z[R] = 0;
							for (I = 0; p > I; I++) Z[t[n + I]]++;
							for (A = D, L = i; L >= 1 && 0 === Z[L]; L--);
							if ((A > L && (A = L), 0 === L))
								return (
									(m[w++] = 20971520), (m[w++] = 20971520), (g.bits = 1), 0
								);
							for (F = 1; L > F && 0 === Z[F]; F++);
							for (F > A && (A = F), U = 1, R = 1; i >= R; R++)
								if (((U <<= 1), (U -= Z[R]), 0 > U)) return -1;
							if (U > 0 && (e === s || 1 !== L)) return -1;
							for (q[1] = 0, R = 1; i > R; R++) q[R + 1] = q[R] + Z[R];
							for (I = 0; p > I; I++) 0 !== t[n + I] && (b[q[t[n + I]]++] = I);
							if (
								(e === s
									? ((T = G = b), (x = 19))
									: e === d
										? ((T = u), (P -= 257), (G = c), (H -= 257), (x = 256))
										: ((T = f), (G = h), (x = -1)),
								(z = 0),
								(I = 0),
								(R = F),
								(S = w),
								(B = A),
								(O = 0),
								(y = -1),
								(N = 1 << A),
								(_ = N - 1),
								(e === d && N > a) || (e === l && N > r))
							)
								return 1;
							for (var j = 0; ; ) {
								j++,
									(M = R - O),
									b[I] < x
										? ((C = 0), (E = b[I]))
										: b[I] > x
											? ((C = G[H + b[I]]), (E = T[P + b[I]]))
											: ((C = 96), (E = 0)),
									(v = 1 << (R - O)),
									(k = 1 << B),
									(F = k);
								do
									(k -= v),
										(m[S + (z >> O) + k] = (M << 24) | (C << 16) | E | 0);
								while (0 !== k);
								for (v = 1 << (R - 1); z & v; ) v >>= 1;
								if (
									(0 !== v ? ((z &= v - 1), (z += v)) : (z = 0),
									I++,
									0 === --Z[R])
								) {
									if (R === L) break;
									R = t[n + b[I]];
								}
								if (R > A && (z & _) !== y) {
									for (
										0 === O && (O = A), S += F, B = R - O, U = 1 << B;
										L > B + O && ((U -= Z[B + O]), !(0 >= U));
									)
										B++, (U <<= 1);
									if (((N += 1 << B), (e === d && N > a) || (e === l && N > r)))
										return 1;
									(y = z & _), (m[y] = (A << 24) | (B << 16) | (S - w) | 0);
								}
							}
							return (
								0 !== z && (m[S + z] = ((R - O) << 24) | (64 << 16) | 0),
								(g.bits = A),
								0
							);
						};
					},
					{ "../utils/common": 1 },
				],
				10: [
					(e, t, n) => {
						t.exports = {
							2: "need dictionary",
							1: "stream end",
							0: "",
							"-1": "file error",
							"-2": "stream error",
							"-3": "data error",
							"-4": "insufficient memory",
							"-5": "buffer error",
							"-6": "incompatible version",
						};
					},
					{},
				],
				11: [
					(e, t, n) => {
						function o() {
							(this.input = null),
								(this.next_in = 0),
								(this.avail_in = 0),
								(this.total_in = 0),
								(this.output = null),
								(this.next_out = 0),
								(this.avail_out = 0),
								(this.total_out = 0),
								(this.msg = ""),
								(this.state = null),
								(this.data_type = 2),
								(this.adler = 0);
						}
						t.exports = o;
					},
					{},
				],
				"/lib/inflate.js": [
					(e, t, n) => {
						function o(e, t) {
							var n = new h(t);
							if ((n.push(e, !0), n.err)) throw n.msg;
							return n.result;
						}
						function i(e, t) {
							return (t = t || {}), (t.raw = !0), o(e, t);
						}
						var a = e("./zlib/inflate.js"),
							r = e("./utils/common"),
							s = e("./utils/strings"),
							d = e("./zlib/constants"),
							l = e("./zlib/messages"),
							u = e("./zlib/zstream"),
							c = e("./zlib/gzheader"),
							f = Object.prototype.toString,
							h = function (e) {
								this.options = r.assign(
									{ chunkSize: 16384, windowBits: 0, to: "" },
									e || {},
								);
								var t = this.options;
								t.raw &&
									t.windowBits >= 0 &&
									t.windowBits < 16 &&
									((t.windowBits = -t.windowBits),
									0 === t.windowBits && (t.windowBits = -15)),
									!(t.windowBits >= 0 && t.windowBits < 16) ||
										(e && e.windowBits) ||
										(t.windowBits += 32),
									t.windowBits > 15 &&
										t.windowBits < 48 &&
										0 === (15 & t.windowBits) &&
										(t.windowBits |= 15),
									(this.err = 0),
									(this.msg = ""),
									(this.ended = !1),
									(this.chunks = []),
									(this.strm = new u()),
									(this.strm.avail_out = 0);
								var n = a.inflateInit2(this.strm, t.windowBits);
								if (n !== d.Z_OK) throw new Error(l[n]);
								(this.header = new c()),
									a.inflateGetHeader(this.strm, this.header);
							};
						(h.prototype.push = function (e, t) {
							var n,
								o,
								i,
								l,
								u,
								c = this.strm,
								h = this.options.chunkSize;
							if (this.ended) return !1;
							(o = t === ~~t ? t : t === !0 ? d.Z_FINISH : d.Z_NO_FLUSH),
								"string" == typeof e
									? (c.input = s.binstring2buf(e))
									: "[object ArrayBuffer]" === f.call(e)
										? (c.input = new Uint8Array(e))
										: (c.input = e),
								(c.next_in = 0),
								(c.avail_in = c.input.length);
							do {
								if (
									(0 === c.avail_out &&
										((c.output = new r.Buf8(h)),
										(c.next_out = 0),
										(c.avail_out = h)),
									(n = a.inflate(c, d.Z_NO_FLUSH)),
									n !== d.Z_STREAM_END && n !== d.Z_OK)
								)
									return this.onEnd(n), (this.ended = !0), !1;
								c.next_out &&
									(0 === c.avail_out ||
										n === d.Z_STREAM_END ||
										(0 === c.avail_in &&
											(o === d.Z_FINISH || o === d.Z_SYNC_FLUSH))) &&
									("string" === this.options.to
										? ((i = s.utf8border(c.output, c.next_out)),
											(l = c.next_out - i),
											(u = s.buf2string(c.output, i)),
											(c.next_out = l),
											(c.avail_out = h - l),
											l && r.arraySet(c.output, c.output, i, l, 0),
											this.onData(u))
										: this.onData(r.shrinkBuf(c.output, c.next_out)));
							} while (c.avail_in > 0 && n !== d.Z_STREAM_END);
							return (
								n === d.Z_STREAM_END && (o = d.Z_FINISH),
								o === d.Z_FINISH
									? ((n = a.inflateEnd(this.strm)),
										this.onEnd(n),
										(this.ended = !0),
										n === d.Z_OK)
									: o === d.Z_SYNC_FLUSH
										? (this.onEnd(d.Z_OK), (c.avail_out = 0), !0)
										: !0
							);
						}),
							(h.prototype.onData = function (e) {
								this.chunks.push(e);
							}),
							(h.prototype.onEnd = function (e) {
								e === d.Z_OK &&
									("string" === this.options.to
										? (this.result = this.chunks.join(""))
										: (this.result = r.flattenChunks(this.chunks))),
									(this.chunks = []),
									(this.err = e),
									(this.msg = this.strm.msg);
							}),
							(n.Inflate = h),
							(n.inflate = o),
							(n.inflateRaw = i),
							(n.ungzip = o);
					},
					{
						"./utils/common": 1,
						"./utils/strings": 2,
						"./zlib/constants": 4,
						"./zlib/gzheader": 6,
						"./zlib/inflate.js": 8,
						"./zlib/messages": 10,
						"./zlib/zstream": 11,
					},
				],
			},
			{},
			[],
		)("/lib/inflate.js"),
	);
var browser = (() => {
		var e,
			t = navigator.userAgent,
			n =
				t.match(
					/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i,
				) || [];
		return /trident/i.test(n[1])
			? ((e = /\brv[ :]+(\d+)/g.exec(t) || []), "IE " + (e[1] || ""))
			: "Chrome" === n[1] && ((e = t.match(/\bOPR\/(\d+)/)), null != e)
				? "Opera " + e[1]
				: ((n = n[2]
						? [n[1], n[2]]
						: [navigator.appName, navigator.appVersion, "-?"]),
					null != (e = t.match(/version\/(\d+)/i)) && n.splice(1, 1, e[1]),
					n.join(" "));
	})(),
	hasWebGL = (() => {
		if (!window.WebGLRenderingContext) return 0;
		var e = document.createElement("canvas"),
			t = e.getContext("webgl");
		return t || (t = e.getContext("experimental-webgl")) ? 1 : 0;
	})(),
	mobile = ((e) =>
		/(android|bb\d+|meego).+mobile|avantgo|bada\/|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
			e,
		) ||
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
			e.substr(0, 4),
		))(navigator.userAgent || navigator.vendor || window.opera);
Module.compatibilitycheck ? Module.compatibilitycheck() : CompatibilityCheck();
var didShowErrorMessage = !1;
"function" != typeof window.onerror &&
	(window.onerror = (e, t, n) =>
		(Module.errorhandler && Module.errorhandler(e, t, n)) ||
		(console.log("Invoking error handler due to\n" + e),
		"function" == typeof dump && dump("Invoking error handler due to\n" + e),
		didShowErrorMessage ||
			-1 != e.indexOf("UnknownError") ||
			-1 != e.indexOf("Program terminated with exit(0)"))
			? void 0
			: ((didShowErrorMessage = !0),
				-1 != e.indexOf("DISABLE_EXCEPTION_CATCHING")
					? void alert(
							"An exception has occured, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project's WebGL player settings to be able to catch the exception or see the stack trace.",
						)
					: -1 != e.indexOf("Cannot enlarge memory arrays")
						? void alert(
								"Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings.",
							)
						: -1 != e.indexOf("Invalid array buffer length") ||
								-1 != e.indexOf("Invalid typed array length") ||
								-1 != e.indexOf("out of memory")
							? void alert(
									"The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings.",
								)
							: void alert(
									"An error occured running the Unity content on this page. See your browser's JavaScript console for more info. The error was:\n" +
										e,
								))),
	(Module.locateFile = (e) => Module.dataUrl),
	(Module.preRun = []),
	(Module.postRun = []),
	(Module.print = (() => (e) => {
		console.log(e);
	})()),
	(Module.printErr = (e) => {
		console.error(e);
	}),
	(Module.canvas = document.getElementById("canvas")),
	(Module.progress = null),
	(Module.setStatus = function (e) {
		if (null == this.progress) {
			if ("function" != typeof UnityProgress) return;
			this.progress = new UnityProgress(canvas);
		}
		if (
			(Module.setStatus.last ||
				(Module.setStatus.last = { time: Date.now(), text: "" }),
			e !== Module.setStatus.text)
		) {
			this.progress.SetMessage(e);
			var t = e.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
			t &&
				this.progress.SetProgress(
					Number.parseInt(t[2]) / Number.parseInt(t[4]),
				),
				"" === e && this.progress.Clear();
		}
	}),
	(Module.totalDependencies = 0),
	(Module.monitorRunDependencies = function (e) {
		(this.totalDependencies = Math.max(this.totalDependencies, e)),
			Module.setStatus(
				e
					? "Preparing... (" +
							(this.totalDependencies - e) +
							"/" +
							this.totalDependencies +
							")"
					: "All downloads complete.",
			);
	}),
	Module.setStatus("Downloading (0.0/1)");
var Module;
"undefined" == typeof Module &&
	(Module = eval(
		"(function() { try { return Module || {} } catch(e) { return {} } })()",
	)),
	Module.expectedDataFileDownloads ||
		((Module.expectedDataFileDownloads = 0),
		(Module.finishedDataFileDownloads = 0)),
	Module.expectedDataFileDownloads++,
	(() => {
		var e = (e) => {
			function t(e) {
				console.error("package error:", e);
			}
			function n() {
				function e(e, t) {
					if (!e) throw t + new Error().stack;
				}
				function t(e, t, n, o) {
					(this.start = e),
						(this.end = t),
						(this.crunched = n),
						(this.audio = o);
				}
				function n(n) {
					Module.finishedDataFileDownloads++, e(n, "Loading data file failed.");
					var o = new Uint8Array(n);
					(t.prototype.byteArray = o),
						t.prototype.requests["/data.unity3d"].onload(),
						t.prototype.requests["/methods_pointedto_by_uievents.xml"].onload(),
						t.prototype.requests["/preserved_derived_types.xml"].onload(),
						t.prototype.requests[
							"/Il2CppData/Metadata/global-metadata.dat"
						].onload(),
						t.prototype.requests["/Resources/unity_default_resources"].onload(),
						t.prototype.requests["/Managed/mono/2.0/machine.config"].onload(),
						Module.removeRunDependency("datafile_webgl.data");
				}
				Module.FS_createPath("/", "Il2CppData", !0, !0),
					Module.FS_createPath("/Il2CppData", "Metadata", !0, !0),
					Module.FS_createPath("/", "Resources", !0, !0),
					Module.FS_createPath("/", "Managed", !0, !0),
					Module.FS_createPath("/Managed", "mono", !0, !0),
					Module.FS_createPath("/Managed/mono", "2.0", !0, !0),
					(t.prototype = {
						requests: {},
						open: function (e, t) {
							(this.name = t),
								(this.requests[t] = this),
								Module.addRunDependency("fp " + this.name);
						},
						send: () => {},
						onload: function () {
							var e = this.byteArray.subarray(this.start, this.end);
							this.finish(e);
						},
						finish: function (e) {
							Module.FS_createPreloadedFile(
								this.name,
								null,
								e,
								!0,
								!0,
								() => {
									Module.removeRunDependency("fp " + this.name);
								},
								() => {
									this.audio
										? Module.removeRunDependency("fp " + this.name)
										: Module.printErr(
												"Preloading file " + this.name + " failed",
											);
								},
								!1,
								!0,
							),
								(this.requests[this.name] = null);
						},
					}),
					new t(0, 17514381, 0, 0).open("GET", "/data.unity3d"),
					new t(17514381, 17514402, 0, 0).open(
						"GET",
						"/methods_pointedto_by_uievents.xml",
					),
					new t(17514402, 17520199, 0, 0).open(
						"GET",
						"/preserved_derived_types.xml",
					),
					new t(17520199, 19340847, 0, 0).open(
						"GET",
						"/Il2CppData/Metadata/global-metadata.dat",
					),
					new t(19340847, 20215819, 0, 0).open(
						"GET",
						"/Resources/unity_default_resources",
					),
					new t(20215819, 20243444, 0, 0).open(
						"GET",
						"/Managed/mono/2.0/machine.config",
					),
					Module.addRunDependency("datafile_webgl.data"),
					Module.preloadResults || (Module.preloadResults = {}),
					(Module.preloadResults[i] = { fromCache: !1 }),
					d ? (n(d), (d = null)) : (l = n);
			}
			var o;
			if ("object" == typeof window)
				o = window.encodeURIComponent(
					window.location.pathname
						.toString()
						.substring(
							0,
							window.location.pathname.toString().lastIndexOf("/"),
						) + "/",
				);
			else {
				if ("undefined" == typeof location)
					throw "using preloaded data can only be done on a web page or in a web worker";
				o = encodeURIComponent(
					location.pathname
						.toString()
						.substring(0, location.pathname.toString().lastIndexOf("/")) + "/",
				);
			}
			var i = "webgl.data",
				a = "webgl.data";
			"function" != typeof Module.locateFilePackage ||
				Module.locateFile ||
				((Module.locateFile = Module.locateFilePackage),
				Module.printErr(
					"warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)",
				));
			var r =
					"function" == typeof Module.locateFile
						? Module.locateFile(a)
						: (Module.filePackagePrefixURL || "") + a,
				s = 20243444,
				d = null,
				l = null;
			fetchRemotePackageWrapper(
				r,
				s,
				(e) => {
					l ? (l(e), (l = null)) : (d = e);
				},
				t,
			),
				Module.calledRun
					? n()
					: (Module.preRun || (Module.preRun = []), Module.preRun.push(n));
		};
		e();
	})();
