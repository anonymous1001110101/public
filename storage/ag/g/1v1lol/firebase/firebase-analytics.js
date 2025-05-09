!((e, t) => {
	"object" == typeof exports && "undefined" != typeof module
		? t(require("@firebase/app"))
		: "function" == typeof define && define.amd
			? define(["@firebase/app"], t)
			: t((e = e || self).firebase);
})(this, function (je) {
	try {
		(() => {
			je = je && je.hasOwnProperty("default") ? je.default : je;
			var n = (e, t) =>
				(n =
					Object.setPrototypeOf ||
					({ __proto__: [] } instanceof Array &&
						((e, t) => {
							e.__proto__ = t;
						})) ||
					((e, t) => {
						for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
					}))(e, t);
			var s = function () {
				return (s =
					Object.assign ||
					((e) => {
						for (var t, n = 1, r = arguments.length; n < r; n++)
							for (var i in (t = arguments[n]))
								Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
						return e;
					})).apply(this, arguments);
			};
			function c(o, a, s, u) {
				return new (s = s || Promise)((e, t) => {
					function n(e) {
						try {
							i(u.next(e));
						} catch (e) {
							t(e);
						}
					}
					function r(e) {
						try {
							i(u.throw(e));
						} catch (e) {
							t(e);
						}
					}
					function i(t) {
						t.done
							? e(t.value)
							: new s((e) => {
									e(t.value);
								}).then(n, r);
					}
					i((u = u.apply(o, a || [])).next());
				});
			}
			function f(n, r) {
				var i,
					o,
					a,
					e,
					s = {
						label: 0,
						sent: () => {
							if (1 & a[0]) throw a[1];
							return a[1];
						},
						trys: [],
						ops: [],
					};
				return (
					(e = { next: t(0), throw: t(1), return: t(2) }),
					"function" == typeof Symbol &&
						(e[Symbol.iterator] = function () {
							return this;
						}),
					e
				);
				function t(t) {
					return (e) =>
						((t) => {
							if (i) throw new TypeError("Generator is already executing.");
							while (s)
								try {
									if (
										((i = 1),
										o &&
											(a =
												2 & t[0]
													? o.return
													: t[0]
														? o.throw || ((a = o.return) && a.call(o), 0)
														: o.next) &&
											!(a = a.call(o, t[1])).done)
									)
										return a;
									switch (((o = 0), a && (t = [2 & t[0], a.value]), t[0])) {
										case 0:
										case 1:
											a = t;
											break;
										case 4:
											return s.label++, { value: t[1], done: !1 };
										case 5:
											s.label++, (o = t[1]), (t = [0]);
											continue;
										case 7:
											(t = s.ops.pop()), s.trys.pop();
											continue;
										default:
											if (
												!(a = 0 < (a = s.trys).length && a[a.length - 1]) &&
												(6 === t[0] || 2 === t[0])
											) {
												s = 0;
												continue;
											}
											if (3 === t[0] && (!a || (t[1] > a[0] && t[1] < a[3]))) {
												s.label = t[1];
												break;
											}
											if (6 === t[0] && s.label < a[1]) {
												(s.label = a[1]), (a = t);
												break;
											}
											if (a && s.label < a[2]) {
												(s.label = a[2]), s.ops.push(t);
												break;
											}
											a[2] && s.ops.pop(), s.trys.pop();
											continue;
									}
									t = r.call(n, s);
								} catch (e) {
									(t = [6, e]), (o = 0);
								} finally {
									i = a = 0;
								}
							if (5 & t[0]) throw t[1];
							return { value: t[0] ? t[1] : void 0, done: !0 };
						})([t, e]);
				}
			}
			function r(e, t) {
				var n = "function" == typeof Symbol && e[Symbol.iterator];
				if (!n) return e;
				var r,
					i,
					o = n.call(e),
					a = [];
				try {
					while ((void 0 === t || 0 < t--) && !(r = o.next()).done)
						a.push(r.value);
				} catch (e) {
					i = { error: e };
				} finally {
					try {
						r && !r.done && (n = o.return) && n.call(o);
					} finally {
						if (i) throw i.error;
					}
				}
				return a;
			}
			var e,
				t,
				i,
				d =
					((i = Error),
					n((e = a), (t = i)),
					void (e.prototype =
						null === t
							? Object.create(t)
							: ((o.prototype = t.prototype), new o())),
					a);
			function o() {
				this.constructor = e;
			}
			function a(e, t) {
				var n = i.call(this, t) || this;
				return (
					(n.code = e),
					(n.name = "FirebaseError"),
					Object.setPrototypeOf(n, a.prototype),
					Error.captureStackTrace &&
						Error.captureStackTrace(n, u.prototype.create),
					n
				);
			}
			var u =
				((l.prototype.create = function (e) {
					for (var t = [], n = 1; n < arguments.length; n++)
						t[n - 1] = arguments[n];
					for (
						var r = t[0] || {},
							i = this.service + "/" + e,
							o = this.errors[e],
							a = o
								? ((e, r) =>
										e.replace(p, (e, t) => {
											var n = r[t];
											return null != n ? n.toString() : "<" + t + "?>";
										}))(o, r)
								: "Error",
							s = this.serviceName + ": " + a + " (" + i + ").",
							u = new d(i, s),
							c = 0,
							f = Object.keys(r);
						c < f.length;
						c++
					) {
						var l = f[c];
						"_" !== l.slice(-1) &&
							(l in u &&
								console.warn(
									'Overwriting FirebaseError base field "' +
										l +
										'" can cause unexpected behavior.',
								),
							(u[l] = r[l]));
					}
					return u;
				}),
				l);
			function l(e, t, n) {
				(this.service = e), (this.serviceName = t), (this.errors = n);
			}
			var p = /\{\$([^}]+)}/g;
			function h(n) {
				return new Promise((e, t) => {
					(n.onsuccess = () => {
						e(n.result);
					}),
						(n.onerror = () => {
							t(n.error);
						});
				});
			}
			function v(n, r, i) {
				var o,
					e = new Promise((e, t) => {
						h((o = n[r].apply(n, i))).then(e, t);
					});
				return (e.request = o), e;
			}
			function g(e, n, t) {
				t.forEach((t) => {
					Object.defineProperty(e.prototype, t, {
						get: function () {
							return this[n][t];
						},
						set: function (e) {
							this[n][t] = e;
						},
					});
				});
			}
			function y(t, n, r, e) {
				e.forEach((e) => {
					e in r.prototype &&
						(t.prototype[e] = function () {
							return v(this[n], e, arguments);
						});
				});
			}
			function w(t, n, r, e) {
				e.forEach((e) => {
					e in r.prototype &&
						(t.prototype[e] = function () {
							return this[n][e].apply(this[n], arguments);
						});
				});
			}
			function b(t, n, r, e) {
				e.forEach((e) => {
					e in r.prototype &&
						(t.prototype[e] = function () {
							return ((e, t, n) => {
								var r = v(e, t, n);
								return r.then((e) => {
									if (e) return new m(e, r.request);
								});
							})(this[n], e, arguments);
						});
				});
			}
			function _(e) {
				this._index = e;
			}
			function m(e, t) {
				(this._cursor = e), (this._request = t);
			}
			function E(e) {
				this._store = e;
			}
			function S(n) {
				(this._tx = n),
					(this.complete = new Promise((e, t) => {
						(n.oncomplete = () => {
							e();
						}),
							(n.onerror = () => {
								t(n.error);
							}),
							(n.onabort = () => {
								t(n.error);
							});
					}));
			}
			function I(e, t, n) {
				(this._db = e), (this.oldVersion = t), (this.transaction = new S(n));
			}
			function T(e) {
				this._db = e;
			}
			g(_, "_index", ["name", "keyPath", "multiEntry", "unique"]),
				y(_, "_index", IDBIndex, [
					"get",
					"getKey",
					"getAll",
					"getAllKeys",
					"count",
				]),
				b(_, "_index", IDBIndex, ["openCursor", "openKeyCursor"]),
				g(m, "_cursor", ["direction", "key", "primaryKey", "value"]),
				y(m, "_cursor", IDBCursor, ["update", "delete"]),
				["advance", "continue", "continuePrimaryKey"].forEach((n) => {
					n in IDBCursor.prototype &&
						(m.prototype[n] = function () {
							var e = arguments;
							return Promise.resolve().then(
								() => (
									this._cursor[n].apply(this._cursor, e),
									h(this._request).then((e) => {
										if (e) return new m(e, this._request);
									})
								),
							);
						});
				}),
				(E.prototype.createIndex = function () {
					return new _(this._store.createIndex.apply(this._store, arguments));
				}),
				(E.prototype.index = function () {
					return new _(this._store.index.apply(this._store, arguments));
				}),
				g(E, "_store", ["name", "keyPath", "indexNames", "autoIncrement"]),
				y(E, "_store", IDBObjectStore, [
					"put",
					"add",
					"delete",
					"clear",
					"get",
					"getAll",
					"getKey",
					"getAllKeys",
					"count",
				]),
				b(E, "_store", IDBObjectStore, ["openCursor", "openKeyCursor"]),
				w(E, "_store", IDBObjectStore, ["deleteIndex"]),
				(S.prototype.objectStore = function () {
					return new E(this._tx.objectStore.apply(this._tx, arguments));
				}),
				g(S, "_tx", ["objectStoreNames", "mode"]),
				w(S, "_tx", IDBTransaction, ["abort"]),
				(I.prototype.createObjectStore = function () {
					return new E(this._db.createObjectStore.apply(this._db, arguments));
				}),
				g(I, "_db", ["name", "version", "objectStoreNames"]),
				w(I, "_db", IDBDatabase, ["deleteObjectStore", "close"]),
				(T.prototype.transaction = function () {
					return new S(this._db.transaction.apply(this._db, arguments));
				}),
				g(T, "_db", ["name", "version", "objectStoreNames"]),
				w(T, "_db", IDBDatabase, ["close"]),
				["openCursor", "openKeyCursor"].forEach((i) => {
					[E, _].forEach((e) => {
						i in e.prototype &&
							(e.prototype[i.replace("open", "iterate")] = function () {
								var e = ((e) => Array.prototype.slice.call(e))(arguments),
									t = e[e.length - 1],
									n = this._store || this._index,
									r = n[i].apply(n, e.slice(0, -1));
								r.onsuccess = () => {
									t(r.result);
								};
							});
					});
				}),
				[_, E].forEach((e) => {
					e.prototype.getAll ||
						(e.prototype.getAll = function (e, n) {
							var i = [];
							return new Promise((t) => {
								this.iterateCursor(e, (e) => {
									e
										? (i.push(e.value),
											void 0 === n || i.length != n ? e.continue() : t(i))
										: t(i);
								});
							});
						});
				});
			var C,
				O = 1e4,
				N = "w:0.3.1",
				k = "FIS_v2",
				A = "https://firebaseinstallations.googleapis.com/v1",
				j = 36e5,
				P =
					(((C = {})["missing-app-config-values"] =
						"Missing App configuration values."),
					(C["create-installation-failed"] =
						"Could not register Firebase Installation."),
					(C["generate-token-failed"] = "Could not generate Auth Token."),
					(C["not-registered"] = "Firebase Installation is not registered."),
					(C["installation-not-found"] = "Firebase Installation not found."),
					(C["request-failed"] =
						'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"'),
					(C["app-offline"] =
						"Could not process request. Application offline."),
					(C["delete-pending-registration"] =
						"Can't delete installation while there is a pending registration request."),
					C),
				x = new u("installations", "Installations", P);
			function D(e) {
				return e instanceof d && e.code.includes("request-failed");
			}
			function q(e) {
				if (!e || !e.options) throw x.create("missing-app-config-values");
				var t = e.name,
					n = e.options,
					r = n.projectId,
					i = n.apiKey,
					o = n.appId;
				if (!(t && r && i && o)) throw x.create("missing-app-config-values");
				return { appName: t, projectId: r, apiKey: i, appId: o };
			}
			function F(e) {
				var t = e.projectId;
				return A + "/projects/" + t + "/installations";
			}
			function R(e) {
				return {
					token: e.token,
					requestStatus: 2,
					expiresIn: ((e) => Number(e.replace("s", "000")))(e.expiresIn),
					creationTime: Date.now(),
				};
			}
			function G(r, i) {
				return c(this, void 0, void 0, function () {
					var t, n;
					return f(this, (e) => {
						switch (e.label) {
							case 0:
								return [4, i.json()];
							case 1:
								return (
									(t = e.sent()),
									(n = t.error),
									[
										2,
										x.create("request-failed", {
											requestName: r,
											serverCode: n.code,
											serverMessage: n.message,
											serverStatus: n.status,
										}),
									]
								);
						}
					});
				});
			}
			function V(e) {
				var t = e.apiKey;
				return new Headers({
					"Content-Type": "application/json",
					Accept: "application/json",
					"x-goog-api-key": t,
				});
			}
			function L(e, t) {
				var n = t.refreshToken,
					r = V(e);
				return r.append("Authorization", ((e) => k + " " + e)(n)), r;
			}
			function K(n) {
				return c(this, void 0, void 0, function () {
					var t;
					return f(this, (e) => {
						switch (e.label) {
							case 0:
								return [4, n()];
							case 1:
								return 500 <= (t = e.sent()).status && t.status < 600
									? [2, n()]
									: [2, t];
						}
					});
				});
			}
			function B(t) {
				return new Promise((e) => {
					setTimeout(e, t);
				});
			}
			function M(e) {
				return btoa(
					String.fromCharCode.apply(
						String,
						(() => {
							for (var e = [], t = 0; t < arguments.length; t++)
								e = e.concat(r(arguments[t]));
							return e;
						})(e),
					),
				)
					.replace(/\+/g, "-")
					.replace(/\//g, "_");
			}
			var U = /^[cdef][\w-]{21}$/,
				H = "";
			function W() {
				try {
					var e = new Uint8Array(17);
					(self.crypto || self.msCrypto).getRandomValues(e),
						(e[0] = 112 + (e[0] % 16));
					var t = ((e) => M(e).substr(0, 22))(e);
					return U.test(t) ? t : H;
				} catch (e) {
					return H;
				}
			}
			var $ = "firebase-installations-database",
				z = 1,
				J = "firebase-installations-store",
				X = null;
			function Y() {
				return (X =
					X ||
					((e, t, n) => {
						var r = v(indexedDB, "open", [e, t]),
							i = r.request;
						return (
							i &&
								(i.onupgradeneeded = (e) => {
									n && n(new I(i.result, e.oldVersion, i.transaction));
								}),
							r.then((e) => new T(e))
						);
					})($, z, (e) => {
						switch (e.oldVersion) {
							case 0:
								e.createObjectStore(J);
						}
					}));
			}
			function Q(i, o) {
				return c(this, void 0, void 0, function () {
					var t, n, r;
					return f(this, (e) => {
						switch (e.label) {
							case 0:
								return (t = te(i)), [4, Y()];
							case 1:
								return (
									(n = e.sent()),
									[
										4,
										(r = n.transaction(J, "readwrite"))
											.objectStore(J)
											.put(o, t),
									]
								);
							case 2:
								return e.sent(), [4, r.complete];
							case 3:
								return e.sent(), [2, o];
						}
					});
				});
			}
			function Z(i) {
				return c(this, void 0, void 0, function () {
					var t, n, r;
					return f(this, (e) => {
						switch (e.label) {
							case 0:
								return (t = te(i)), [4, Y()];
							case 1:
								return (
									(n = e.sent()),
									[
										4,
										(r = n.transaction(J, "readwrite"))
											.objectStore(J)
											.delete(t),
									]
								);
							case 2:
								return e.sent(), [4, r.complete];
							case 3:
								return e.sent(), [2];
						}
					});
				});
			}
			function ee(s, u) {
				return c(this, void 0, void 0, function () {
					var t, n, r, i, o, a;
					return f(this, (e) => {
						switch (e.label) {
							case 0:
								return (t = te(s)), [4, Y()];
							case 1:
								return (
									(n = e.sent()),
									(r = n.transaction(J, "readwrite")),
									[4, (i = r.objectStore(J)).get(t)]
								);
							case 2:
								return (
									(o = e.sent()),
									void 0 !== (a = u(o)) ? [3, 4] : [4, i.delete(t)]
								);
							case 3:
								return e.sent(), [3, 6];
							case 4:
								return [4, i.put(a, t)];
							case 5:
								e.sent(), (e.label = 6);
							case 6:
								return [4, r.complete];
							case 7:
								return e.sent(), [2, a];
						}
					});
				});
			}
			function te(e) {
				return e.appName + "!" + e.appId;
			}
			function ne(i) {
				return c(this, void 0, void 0, function () {
					var r, t, n;
					return f(this, (e) => {
						switch (e.label) {
							case 0:
								return [
									4,
									ee(i, (e) => {
										var t = ((e) =>
												ie(e || { fid: W(), registrationStatus: 0 }))(e),
											n = ((e, t) => {
												if (0 !== t.registrationStatus)
													return 1 === t.registrationStatus
														? {
																installationEntry: t,
																registrationPromise: (function (n) {
																	return c(this, void 0, void 0, function () {
																		var t;
																		return f(this, (e) => {
																			switch (e.label) {
																				case 0:
																					return [4, re(n)];
																				case 1:
																					(t = e.sent()), (e.label = 2);
																				case 2:
																					return 1 !== t.registrationStatus
																						? [3, 5]
																						: [4, B(100)];
																				case 3:
																					return e.sent(), [4, re(n)];
																				case 4:
																					return (t = e.sent()), [3, 2];
																				case 5:
																					if (0 === t.registrationStatus)
																						throw x.create(
																							"create-installation-failed",
																						);
																					return [2, t];
																			}
																		});
																	});
																})(e),
															}
														: { installationEntry: t };
												if (!navigator.onLine) {
													var n = Promise.reject(x.create("app-offline"));
													return {
														installationEntry: t,
														registrationPromise: n,
													};
												}
												var r = {
														fid: t.fid,
														registrationStatus: 1,
														registrationTime: Date.now(),
													},
													i = (function (r, i) {
														return c(this, void 0, void 0, function () {
															var t, n;
															return f(this, (e) => {
																switch (e.label) {
																	case 0:
																		return (
																			e.trys.push([0, 2, , 7]),
																			[
																				4,
																				(function (s, e) {
																					var u = e.fid;
																					return c(
																						this,
																						void 0,
																						void 0,
																						function () {
																							var t, n, r, i, o, a;
																							return f(this, (e) => {
																								switch (e.label) {
																									case 0:
																										return (
																											(t = F(s)),
																											(n = V(s)),
																											(r = {
																												fid: u,
																												authVersion: k,
																												appId: s.appId,
																												sdkVersion: N,
																											}),
																											(i = {
																												method: "POST",
																												headers: n,
																												body: JSON.stringify(r),
																											}),
																											[4, K(() => fetch(t, i))]
																										);
																									case 1:
																										return (o = e.sent()).ok
																											? [4, o.json()]
																											: [3, 3];
																									case 2:
																										return (
																											(a = e.sent()),
																											[
																												2,
																												{
																													fid: a.fid || u,
																													registrationStatus: 2,
																													refreshToken:
																														a.refreshToken,
																													authToken: R(
																														a.authToken,
																													),
																												},
																											]
																										);
																									case 3:
																										return [
																											4,
																											G(
																												"Create Installation",
																												o,
																											),
																										];
																									case 4:
																										throw e.sent();
																								}
																							});
																						},
																					);
																				})(r, i),
																			]
																		);
																	case 1:
																		return (t = e.sent()), [2, Q(r, t)];
																	case 2:
																		return D((n = e.sent())) &&
																			409 === n.serverCode
																			? [4, Z(r)]
																			: [3, 4];
																	case 3:
																		return e.sent(), [3, 6];
																	case 4:
																		return [
																			4,
																			Q(r, {
																				fid: i.fid,
																				registrationStatus: 0,
																			}),
																		];
																	case 5:
																		e.sent(), (e.label = 6);
																	case 6:
																		throw n;
																	case 7:
																		return [2];
																}
															});
														});
													})(e, r);
												return { installationEntry: r, registrationPromise: i };
											})(i, t);
										return (r = n.registrationPromise), n.installationEntry;
									}),
								];
							case 1:
								return (t = e.sent()).fid !== H ? [3, 3] : ((n = {}), [4, r]);
							case 2:
								return [2, ((n.installationEntry = e.sent()), n)];
							case 3:
								return [2, { installationEntry: t, registrationPromise: r }];
						}
					});
				});
			}
			function re(e) {
				return ee(e, (e) => {
					if (!e) throw x.create("installation-not-found");
					return ie(e);
				});
			}
			function ie(e) {
				return ((e) =>
					1 === e.registrationStatus && e.registrationTime + O < Date.now())(e)
					? { fid: e.fid, registrationStatus: 0 }
					: e;
			}
			function oe(s, u) {
				return c(this, void 0, void 0, function () {
					var t, n, r, i, o, a;
					return f(this, (e) => {
						switch (e.label) {
							case 0:
								return (
									(t = ((e, t) => {
										var n = t.fid;
										return F(e) + "/" + n + "/authTokens:generate";
									})(s, u)),
									(n = L(s, u)),
									(r = { installation: { sdkVersion: N } }),
									(i = { method: "POST", headers: n, body: JSON.stringify(r) }),
									[4, K(() => fetch(t, i))]
								);
							case 1:
								return (o = e.sent()).ok ? [4, o.json()] : [3, 3];
							case 2:
								return (a = e.sent()), [2, R(a)];
							case 3:
								return [4, G("Generate Auth Token", o)];
							case 4:
								throw e.sent();
						}
					});
				});
			}
			function ae(i, o) {
				return (
					void 0 === o && (o = !1),
					c(this, void 0, void 0, function () {
						var r, t, n;
						return f(this, (e) => {
							switch (e.label) {
								case 0:
									return [
										4,
										ee(i, (e) => {
											if (!ue(e)) throw x.create("not-registered");
											var t = e.authToken;
											if (
												!o &&
												((e) =>
													2 === e.requestStatus &&
													!((e) => {
														var t = Date.now();
														return (
															t < e.creationTime ||
															e.creationTime + e.expiresIn < t + j
														);
													})(e))(t)
											)
												return e;
											if (1 === t.requestStatus)
												return (
													(r = (function (r) {
														return c(this, void 0, void 0, function () {
															var t, n;
															return f(this, (e) => {
																switch (e.label) {
																	case 0:
																		return [4, se(r)];
																	case 1:
																		(t = e.sent()), (e.label = 2);
																	case 2:
																		return 1 !== t.authToken.requestStatus
																			? [3, 5]
																			: [4, B(100)];
																	case 3:
																		return e.sent(), [4, se(r)];
																	case 4:
																		return (t = e.sent()), [3, 2];
																	case 5:
																		if (0 === (n = t.authToken).requestStatus)
																			throw x.create("generate-token-failed");
																		return [2, n];
																}
															});
														});
													})(i)),
													e
												);
											if (!navigator.onLine) throw x.create("app-offline");
											var n = ((e) => {
												var t = { requestStatus: 1, requestTime: Date.now() };
												return s(s({}, e), { authToken: t });
											})(e);
											return (
												(r = (function (i, o) {
													return c(this, void 0, void 0, function () {
														var t, n, r;
														return f(this, (e) => {
															switch (e.label) {
																case 0:
																	return (
																		e.trys.push([0, 3, , 8]), [4, oe(i, o)]
																	);
																case 1:
																	return (
																		(t = e.sent()),
																		(r = s(s({}, o), { authToken: t })),
																		[4, Q(i, r)]
																	);
																case 2:
																	return e.sent(), [2, t];
																case 3:
																	return !D((n = e.sent())) ||
																		(401 !== n.serverCode &&
																			404 !== n.serverCode)
																		? [3, 5]
																		: [4, Z(i)];
																case 4:
																	return e.sent(), [3, 7];
																case 5:
																	return (
																		(r = s(s({}, o), {
																			authToken: { requestStatus: 0 },
																		})),
																		[4, Q(i, r)]
																	);
																case 6:
																	e.sent(), (e.label = 7);
																case 7:
																	throw n;
																case 8:
																	return [2];
															}
														});
													});
												})(i, n)),
												n
											);
										}),
									];
								case 1:
									return (t = e.sent()), r ? [4, r] : [3, 3];
								case 2:
									return (n = e.sent()), [3, 4];
								case 3:
									(n = t.authToken), (e.label = 4);
								case 4:
									return [2, n.token];
							}
						});
					})
				);
			}
			function se(e) {
				return ee(e, (e) => {
					if (!ue(e)) throw x.create("not-registered");
					return ((e) =>
						1 === e.requestStatus && e.requestTime + O < Date.now())(
						e.authToken,
					)
						? s(s({}, e), { authToken: { requestStatus: 0 } })
						: e;
				});
			}
			function ue(e) {
				return void 0 !== e && 2 === e.registrationStatus;
			}
			function ce(n, r) {
				return (
					void 0 === r && (r = !1),
					c(this, void 0, void 0, function () {
						var t;
						return f(this, (e) => {
							switch (e.label) {
								case 0:
									return [
										4,
										(function (i) {
											return c(this, void 0, void 0, function () {
												var t, n, r;
												return f(this, (e) => {
													switch (e.label) {
														case 0:
															return [4, ne(i)];
														case 1:
															return (
																(t = e.sent()),
																(n = t.installationEntry),
																(r = t.registrationPromise) ? [4, r] : [3, 3]
															);
														case 2:
															return e.sent(), [3, 4];
														case 3:
															if (2 !== n.registrationStatus)
																throw x.create("create-installation-failed");
															e.label = 4;
														case 4:
															return [2];
													}
												});
											});
										})((t = q(n))),
									];
								case 1:
									return e.sent(), [2, ae(t, r)];
							}
						});
					})
				);
			}
			function fe(o, a) {
				return c(this, void 0, void 0, function () {
					var t, n, r, i;
					return f(this, (e) => {
						switch (e.label) {
							case 0:
								return (
									(t = ((e, t) => {
										var n = t.fid;
										return F(e) + "/" + n;
									})(o, a)),
									(n = L(o, a)),
									(r = { method: "DELETE", headers: n }),
									[4, K(() => fetch(t, r))]
								);
							case 1:
								return (i = e.sent()).ok
									? [3, 3]
									: [4, G("Delete Installation", i)];
							case 2:
								throw e.sent();
							case 3:
								return [2];
						}
					});
				});
			}
			je.INTERNAL.registerService(
				"installations",
				(t) => (
					q(t),
					{
						app: t,
						getId: () =>
							(function (o) {
								return c(this, void 0, void 0, function () {
									var t, n, r, i;
									return f(this, (e) => {
										switch (e.label) {
											case 0:
												return [4, ne((t = q(o)))];
											case 1:
												return (
													(n = e.sent()),
													(r = n.installationEntry),
													(i = n.registrationPromise) && i.catch(() => {}),
													2 === r.registrationStatus && ae(t).catch(() => {}),
													[2, r.fid]
												);
										}
									});
								});
							})(t),
						getToken: (e) => ce(t, e),
						delete: () =>
							(function (r) {
								return c(this, void 0, void 0, function () {
									var t, n;
									return f(this, (e) => {
										switch (e.label) {
											case 0:
												return [
													4,
													ee((t = q(r)), (e) => {
														if (!e || 0 !== e.registrationStatus) return e;
													}),
												];
											case 1:
												if (!(n = e.sent())) return [3, 6];
												if (1 !== n.registrationStatus) return [3, 2];
												throw x.create("delete-pending-registration");
											case 2:
												if (2 !== n.registrationStatus) return [3, 6];
												if (navigator.onLine) return [3, 3];
												throw x.create("app-offline");
											case 3:
												return [4, fe(t, n)];
											case 4:
												return e.sent(), [4, Z(t)];
											case 5:
												e.sent(), (e.label = 6);
											case 6:
												return [2];
										}
									});
								});
							})(t),
					}
				),
			);
			var le,
				de,
				pe,
				he,
				ve,
				ge = "measurementId",
				ye = "firebase_id",
				we = "origin";
			function be(e) {
				return Array.isArray(window[e]);
			}
			function _e(e, n, t) {
				var r = () => {
					for (var e = [], t = 0; t < arguments.length; t++)
						e[t] = arguments[t];
					window[n].push(arguments);
				};
				return (
					window[t] && "function" == typeof window[t] && (r = window[t]),
					(window[t] = ((d, p) => (e, t, n) => {
						if (e === le.EVENT) {
							var r = [];
							if (n && n.send_to) {
								var i = n.send_to;
								Array.isArray(i) || (i = [i]);
								for (var o = 0, a = i; o < a.length; o++) {
									var s = a[o],
										u = p[s];
									if (!u) {
										r = [];
										break;
									}
									r.push(u);
								}
							}
							if (0 === r.length)
								for (var c = 0, f = Object.values(p); c < f.length; c++) {
									var l = f[c];
									r.push(l);
								}
							Promise.all(r)
								.then(() => d(le.EVENT, t, n || {}))
								.catch((e) => console.error(e));
						} else if (e === le.CONFIG) {
							(p[t] || Promise.resolve())
								.then(() => {
									d(le.CONFIG, t, n);
								})
								.catch((e) => console.error(e));
						} else d(le.SET, t);
					})(r, e)),
					{ gtagCore: r, wrappedGtag: window[t] }
				);
			}
			((de = le = le || {}).EVENT = "event"),
				(de.SET = "set"),
				(de.CONFIG = "config"),
				((he = pe = pe || {}).ADD_PAYMENT_INFO = "add_payment_info"),
				(he.ADD_TO_CART = "add_to_cart"),
				(he.ADD_TO_WISHLIST = "add_to_wishlist"),
				(he.BEGIN_CHECKOUT = "begin_checkout"),
				(he.CHECKOUT_PROGRESS = "checkout_progress"),
				(he.EXCEPTION = "exception"),
				(he.GENERATE_LEAD = "generate_lead"),
				(he.LOGIN = "login"),
				(he.PAGE_VIEW = "page_view"),
				(he.PURCHASE = "purchase"),
				(he.REFUND = "refund"),
				(he.REMOVE_FROM_CART = "remove_from_cart"),
				(he.SCREEN_VIEW = "screen_view"),
				(he.SEARCH = "search"),
				(he.SELECT_CONTENT = "select_content"),
				(he.SET_CHECKOUT_OPTION = "set_checkout_option"),
				(he.SHARE = "share"),
				(he.SIGN_UP = "sign_up"),
				(he.TIMING_COMPLETE = "timing_complete"),
				(he.VIEW_ITEM = "view_item"),
				(he.VIEW_ITEM_LIST = "view_item_list"),
				(he.VIEW_PROMOTION = "view_promotion"),
				(he.VIEW_SEARCH_RESULTS = "view_search_results");
			var me,
				Ee,
				Se =
					(((ve = {})["no-ga-id"] =
						'"' +
						ge +
						'" field is empty in Firebase config. Firebase Analytics requires this field to contain a valid measurement ID.'),
					(ve["already-exists"] =
						"A Firebase Analytics instance with the measurement ID ${id}  already exists. Only one Firebase Analytics instance can be created for each measurement ID."),
					(ve["already-initialized"] =
						"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect."),
					ve),
				Ie = new u("analytics", "Analytics", Se),
				Te = {},
				Ce = "dataLayer",
				Oe = "gtag",
				Ne = !1;
			function ke(e) {
				if (Ne) throw Ie.create("already-initialized");
				e.dataLayerName && (Ce = e.dataLayerName),
					e.gtagName && (Oe = e.gtagName);
			}
			function Ae(t, e) {
				if (!t.options[ge]) throw Ie.create("no-ga-id");
				var r = t.options[ge];
				if (null != Te[r]) throw Ie.create("already-exists", { id: r });
				if (!Ne) {
					be(Ce) ||
						((e) => {
							var t = document.createElement("script");
							(t.src = "https://www.googletagmanager.com/gtag/js?l=" + e),
								(t.async = !0),
								document.head.appendChild(t);
						})(Ce),
						((e) => {
							be(e) ? window[e] : (window[e] = []);
						})(Ce);
					var n = _e(Te, Ce, Oe),
						i = n.wrappedGtag,
						o = n.gtagCore;
					(Ee = i), (me = o), (Ne = !0);
				}
				Te[r] = (function (r, i) {
					return c(this, void 0, void 0, function () {
						var t, n;
						return f(this, (e) => {
							switch (e.label) {
								case 0:
									return [4, r.installations().getId()];
								case 1:
									return (
										(t = e.sent()),
										i("js", new Date()),
										i(
											le.CONFIG,
											r.options[ge],
											(((n = {})[ye] = t),
											(n[we] = "firebase"),
											(n.update = !0),
											n),
										),
										[2]
									);
							}
						});
					});
				})(t, me);
				var a = {
					app: t,
					logEvent: (e, t, n) =>
						((e, t, n, r, i) => {
							var o = r || {};
							(i && i.global) || (o = s(s({}, r), { send_to: t })),
								e(le.EVENT, n, o || {});
						})(Ee, r, e, t, n),
					setCurrentScreen: (e, t) =>
						((e, t, n, r) => {
							r && r.global
								? e(le.SET, { screen_name: n })
								: e(le.CONFIG, t, { update: !0, screen_name: n });
						})(Ee, r, e, t),
					setUserId: (e, t) =>
						((e, t, n, r) => {
							r && r.global
								? e(le.SET, { user_id: n })
								: e(le.CONFIG, t, { update: !0, user_id: n });
						})(Ee, r, e, t),
					setUserProperties: (e, t) =>
						((e, t, n, r) => {
							if (r && r.global) {
								for (var i = {}, o = 0, a = Object.keys(n); o < a.length; o++) {
									var s = a[o];
									i["user_properties." + s] = n[s];
								}
								e(le.SET, i);
							} else e(le.CONFIG, t, { update: !0, user_properties: n });
						})(Ee, r, e, t),
					setAnalyticsCollectionEnabled: (e) =>
						((e, t) => {
							window["ga-disable-" + e] = !t;
						})(t.options[ge], e),
				};
				return e({ INTERNAL: { analytics: { logEvent: a.logEvent } } }), a;
			}
			je.INTERNAL.registerService(
				"analytics",
				Ae,
				{ settings: ke, EventName: pe },
				void 0,
				!1,
			);
		}).apply(this, arguments);
	} catch (e) {
		throw (
			(console.error(e),
			new Error(
				"Cannot instantiate firebase-analytics - be sure to load firebase-app.js first.",
			))
		);
	}
});
//# sourceMappingURL=firebase-analytics.js.map
