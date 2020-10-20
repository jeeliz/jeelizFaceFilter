 /**
 * Jeeliz Face Filter - https://github.com/jeeliz/jeelizFaceFilter
 *
 * Copyright 2018 Jeeliz ( https://jeeliz.com )
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/* eslint-disable */
JEEFACEFILTERAPIGEN = function() {
  function Cb(a) {
    var b = null, d = null, e = null, m = 0;
    this.m = function(f) {
      this.xe(f.Ra);
      e.Cd({Ib:f.Ib, Fb:f.Fb});
    };
    this.Vd = function(f) {
      return b[f];
    };
    this.xe = function(f) {
      var t = null;
      m = f.length;
      b = f.map(function(n, k) {
        n = Object.assign({}, n, {index:k, parent:this, Ya:t, ee:k === m - 1});
        return t = k = 0 === k ? Db.instance(n) : Eb.instance(n);
      });
      d = b[0];
      e = b[m - 1];
      b.forEach(function(n, k) {
        0 !== k && n.se();
      });
    };
    this.N = function(f, t) {
      var n = t;
      b.forEach(function(k) {
        n = k.N(n, f);
      });
      return n;
    };
    this.Td = function() {
      return d.F();
    };
    this.wc = function() {
      return e.Wd();
    };
    this.tc = function() {
      return e.tc();
    };
    this.h = function() {
      b && (b.forEach(function(f) {
        f.h();
      }), e = d = b = null, m = 0);
    };
    "undefined" !== typeof a && this.m(a);
  }
  function cb(a, b) {
    var d = b % 8;
    return a[(b - d) / 8] >> 7 - d & 1;
  }
  function Fb(a) {
    var b = JSON.parse(a);
    a = b.ne;
    var d = b.nf, e = b.n;
    var m = "undefined" === typeof btoa ? Buffer.from(b.data, "base64").toString("latin1") : atob(b.data);
    var f = m.length;
    b = new Uint8Array(f);
    for (var t = 0; t < f; ++t) {
      b[t] = m.charCodeAt(t);
    }
    m = new Float32Array(e);
    f = new Float32Array(d);
    t = a + d + 1;
    for (var n = 0; n < e; ++n) {
      for (var k = t * n, r = 0 === cb(b, k) ? 1 : -1, h = k + 1, g = 1, w = 0, l = h + a - 1; l >= h; --l) {
        w += g * cb(b, l), g *= 2;
      }
      h = w;
      k = k + 1 + a;
      g = f.length;
      w = 0;
      for (l = k; l < k + g; ++l) {
        f[w] = cb(b, l, !0), ++w;
      }
      for (g = k = 0; g < d; ++g) {
        k += f[g] * Math.pow(2.0, -g - 1);
      }
      m[n] = 0 === k && 0 === h ? 0 : r * (1.0 + k) * Math.pow(2.0, 1 + h - Math.pow(2.0, a - 1));
    }
    return m;
  }
  function Va() {
    return -1 !== [ea.ready, ea.play, ea.pause].indexOf(ia);
  }
  function Gb(a) {
    if (ia !== ea.pause) {
      var b = ia === ea.play ? L.Ca : Y.od;
      Wa = setTimeout(ob.bind(null, a), b);
    }
  }
  function db() {
    if (ia === ea.play) {
      return !1;
    }
    ia = ea.play;
    Oa && window.cancelAnimationFrame(Oa);
    ob(0);
  }
  function pb() {
    if (ia !== ea.play) {
      return !1;
    }
    Wa && (clearTimeout(Wa), Wa = null);
    Oa && (window.cancelAnimationFrame(Oa), Oa = null);
    ia = ea.pause;
    return !0;
  }
  function Fa(a, b, d, e, m) {
    a = 4 * (3 * b + a) + d;
    return e + (W.buffer[a] / 255 + W.buffer[a + 12] / 65025) * (m - e);
  }
  function eb() {
    c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
    ta.Z();
    S.reset();
    X.reset();
    y.M();
    y.hc();
    c.disable(c.DEPTH_TEST);
    c.disable(c.BLEND);
    S.sa();
    y.ma();
  }
  function ob() {
    if (ia !== ea.pause) {
      y.hc();
      S.reset();
      S.sa();
      c.disable(c.DEPTH_TEST);
      c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
      ta.Z();
      y.ma();
      if (!x.Ab) {
        a: {
          if (x.Oa) {
            if (!x.element.needsUpdate) {
              break a;
            }
            x.ea.Ne(x.element.arrayBuffer);
            x.element.needsUpdate = !1;
          } else {
            var a = x.element.currentTime, b = a - x.Za;
            0 > b && (x.Za = a);
            if (1000 * b < Y.Pe) {
              break a;
            }
            x.Za += b;
            x.ea.refresh();
          }
          y.set("s50");
          x.X.R();
          x.ea.b(0);
          S.g(!1, !1);
        }
      }
      a = Aa.uc();
      if (G.P.length > a) {
        G.P.splice(0, G.P.length - a);
      } else {
        for (; G.P.length < a;) {
          G.P.push(0);
        }
      }
      if (1 !== G.i) {
        if (pa.every(fb)) {
          for (var d = 0, e = b = 0; e < pa.length; ++e) {
            pa[e].detected > d && (d = pa[e].detected, b = 0);
          }
          for (d = 0; d < a; ++d) {
            G.P[d] = b;
          }
        } else {
          b = G.Kc;
          d = 0;
          for (e = !1; d < a; ++d) {
            if (fb(pa[b])) {
              if (e) {
                do {
                  ++b === G.i && (b = 0);
                } while (fb(pa[b]));
              } else {
                e = !0;
              }
            }
            G.P[d] = b++;
            b >= G.i && (b = 0);
          }
          G.Kc = b;
        }
      }
      for (a = 0; a < Aa.uc(); ++a) {
        G.aa = G.P[a], G.Eb = (0.5 + G.aa) / G.i, G.Fc = G.P.lastIndexOf(G.aa) === a, y.set("s51"), b = pa[G.aa], y.C("u37", 1 + Pa.Lb * (Math.cos(b.ry) - 1)), L.ka && y.C("u36", b.rz), 1 !== G.i && y.C("u35", G.Eb), T.xa.R(), x.X.b(0), W.Ba.b(1), S.g(!1, !1), T.xa.b(0), Qa.N(!1, T.xa);
      }
      Aa.Ie();
      ta.J();
      c.viewport(0, 0, 3, 2 * G.i);
      y.set("s49");
      W.Ba.b(0);
      S.g(!1, !1);
      c.readPixels(0, 0, 3, 2 * G.i, c.RGBA, c.UNSIGNED_BYTE, W.buffer);
      for (a = 0; a < G.i; ++a) {
        if (-1 !== G.P.indexOf(a)) {
          var m = a;
          b = Ta[m];
          var f = [m];
          d = pa[m];
          e = gb[m];
          var t = 2 * m;
          b.Ga = Fa(1, t, 3, 0, 1);
          d.detected = qa.T(d.detected, b.Ga, Y.ld);
          if (b.Ga < Y.Oc) {
            L.ka && (d.rz = 0.0, d.ry = 0.0);
          } else {
            var n = W.ya;
            b.x = Fa(0, t, 1, -1, 1);
            b.y = Fa(0, t, 2, -1, 1);
            b.W = Fa(0, t, 3, 0, 1);
            b.Jb = Fa(1, t, 0, -n[0], n[0]);
            b.Kb = Fa(1, t, 1, -n[1], n[1]);
            b.za = Fa(1, t, 2, -n[2], n[2]);
            for (n = 0; n < W.U; ++n) {
              b.oc[n] = W.wa[n](Fa(2, t, n, 0, 1));
            }
            f.qb = b.x - d.xRaw;
            f.rb = b.y - d.yRaw;
            f.pb = b.W - d.sRaw;
            f.mb = b.Jb - d.rx;
            f.nb = b.Kb - d.ry;
            f.ob = L.ka ? b.za : b.za - d.rz;
            t = Aa.Qd();
            f = (1 - Xa.Sa(ua.translationFactorRange[0], ua.translationFactorRange[1], Math.sqrt(f.qb * f.qb + f.rb * f.rb + f.pb * f.pb) / t)) * (1 - Xa.Sa(ua.rotationFactorRange[0], ua.rotationFactorRange[1], Math.sqrt(f.mb * f.mb + f.nb * f.nb + f.ob * f.ob) / t)) * Xa.Sa(ua.qualityFactorRange[0], ua.qualityFactorRange[1], b.Ga);
            m = e[++hb[m] % e.length] = f;
            for (t = 0; t < e.length; ++t) {
              m = Math.min(m, e[t]);
            }
            m = Math.max(0.5, m);
            f = Math.min(m, f);
            e = qa.T(ua.alphaRange[1], ua.alphaRange[0], Math.pow(f, Y.nd));
            d.xRaw = qa.T(d.xRaw, b.x, e);
            d.yRaw = qa.T(d.yRaw, b.y, e);
            d.sRaw = qa.T(d.sRaw, b.W, e);
            d.rx = qa.T(d.rx, b.Jb, e);
            d.ry = qa.T(d.ry, b.Kb, e);
            d.rz = L.ka ? d.rz + e * b.za : qa.T(d.rz, b.za, e);
            m = d.sRaw * Pa.lb * Math.sin(d.ry);
            f = Math.sin(d.rz) * m / Ha;
            d.x = d.xRaw + Math.cos(d.rz) * m;
            d.y = d.yRaw + f;
            d.s = d.sRaw;
            e = Math.max(e, Y.md);
            for (m = 0; m < W.U; ++m) {
              d.expressions[m] = qa.T(d.expressions[m], b.oc[m], e);
            }
            ++b.Va;
          }
        }
      }
      ta.Le();
      ta.reset();
      X.reset();
      c.enable(c.DEPTH_TEST);
      L.Fa && (1 === G.i ? L.Fa(pa[0]) : L.Fa(pa));
      c.disable(c.BLEND);
      ia === ea.play && (Oa = window.requestAnimationFrame(Gb));
    }
  }
  function qb() {
    x.X || (x.X = X.instance({isPot:!1, isLinear:!0, isFloat:!1, width:T.D, height:T.B}));
    T.xa = X.instance({isPot:!0, isFloat:!1, width:Qa.Td()});
    for (var a = Y.cd, b = G.i, d = new Float32Array([0, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0]), e = new Float32Array(d.length * G.i), m = 0, f; m < G.i; ++m) {
      for (f = 0; f < d.length; ++f) {
        e[m * d.length + f] = d[f];
      }
    }
    W.Ba = Hb.instance({width:a, height:b, isFloat:!0, isPot:!1, array:e});
  }
  function Ib() {
    function a(b) {
      for (var d = [], e = 0; e < G.i; ++e) {
        d.push(JSON.parse(JSON.stringify(b)));
      }
      return d;
    }
    W.buffer = new Uint8Array(8 * Y.cd * G.i);
    Ta = a({Ga:0, x:0, y:0, W:1, Jb:0, Kb:0, za:0, oc:new Float32Array(W.U), Va:0});
    pa = a({detected:0, x:0, y:0, s:1, xRaw:0, yRaw:0, sRaw:1, rx:0, ry:0, rz:0, expressions:new Float32Array(W.U)});
    a({qb:0, rb:0, pb:0, mb:0, nb:0, ob:0});
  }
  function ib() {
    y.O("s51", [{type:"1i", name:"u1", value:0}, {type:"1i", name:"u33", value:1}, {type:"2f", name:"u34", value:T.u}, {type:"1f", name:"u35", value:0.5}, {type:"1f", name:"u36", value:0.0}]);
    y.O("s52", [{type:"1i", name:"u38", value:0}, {type:"1i", name:"u33", value:1}, {type:"1f", name:"u41", value:Y.Je}, {type:"1f", name:"u42", value:na.threshold}, {type:"3f", name:"u40", value:[W.I[0] * T.u[0], W.I[1] * T.u[1], W.I[2]]}, {type:"1f", name:"u35", value:0.5}, {type:"1f", name:"u43", value:1}, {type:"1f", name:"u36", value:0.0}]);
    var a = [{type:"1i", name:"u38", value:0}];
    y.O("s53", a);
    y.O("s54", a);
    y.O("s49", [{type:"1i", name:"u33", value:0}, {type:"1f", name:"u46", value:T.u[0]}, {type:"2f", name:"u45", value:[0, 0.5 / G.i]}]);
  }
  function jb() {
    T.u[0] = 1;
    T.u[1] = T.D / T.B;
    rb.m({Xa:na.overlapFactors, Sc:na.nScaleLevels, D:T.D, B:T.B, Yc:na.scale0Factor, I:W.I, Zc:na.scanCenterFirst});
  }
  function Jb(a) {
    if (L.oa) {
      sb("string" === typeof L.oa ? JSON.parse(L.oa) : L.oa, a);
    } else {
      var b = L.Ub;
      "JSON" !== b.toUpperCase().split(".").pop() && (b += Y.neuralNetworkPath);
      tb.get(b, function(d) {
        d = JSON.parse(d);
        sb(d, a);
      });
    }
  }
  function sb(a, b) {
    if (a.exportData) {
      var d = a.exportData;
      d.rotationEulerAnglesFactors && (W.ya = d.rotationEulerAnglesFactors);
      d.translationScalingFactors && (W.I = d.translationScalingFactors);
      "undefined" !== typeof d.nExpressions && (W.U = d.nExpressions);
      Pa.Lb = 0.4;
      Pa.lb = 0.7;
      "undefined" !== typeof d.fgScaleXFactor && (Pa.Lb = d.fgScaleXFactor);
      "undefined" !== typeof d.fgDisplaceXFactor && (Pa.lb = d.fgDisplaceXFactor);
    }
    W.U || (W.U = Y.Rc);
    if (!W.wa) {
      for (W.wa = [], d = 0; d < W.U; ++d) {
        W.wa.push(Y.Kd);
      }
    }
    b(a);
  }
  function Kb() {
    if (Ra.m({jb:L.$, width:T.D, height:T.B, debug:!1, Tc:function() {
      Ia("GLCONTEXT_LOST");
    }, antialias:L.antialias, premultipliedAlpha:!0})) {
      return !0;
    }
    Ia("GL_INCOMPATIBLE");
    return !1;
  }
  function fb(a) {
    return a.detected <= Y.Oc;
  }
  function ub(a, b, d, e) {
    return d > a ? Math.max(0, a + b / 2 - (d - e / 2)) : Math.max(0, d + e / 2 - (a - b / 2));
  }
  function Lb() {
    return Ta.some(function(a, b) {
      if (b === G.aa) {
        return !1;
      }
      b = Ta[G.aa];
      if (b.Va > a.Va || 3 > a.Va || ub(b.x, b.W, a.x, a.W) < Y.Pc * b.W) {
        return !1;
      }
      var d = T.D / T.B;
      return ub(b.y, b.W * d, a.y, a.W * d) > Y.Pc * b.W * d;
    });
  }
  function Mb() {
    var a = G.aa;
    W.Ba.Ae(1);
    1 !== G.i && (c.viewport(0, 0, 3, G.i), y.set("s0"), y.bd("u1", 1), S.g(!1, !1), y.bd("u1", 0));
    c.viewport(0, a, 1, 1);
    y.set("s52");
    L.ka && y.C("u36", pa[a].rz);
    1 !== G.i && y.C("u35", G.Eb);
    if (1 < G.i) {
      var b = Lb() ? 0.0 : 1.0;
      0 === b && console.log("UNSTITCH!", G.aa);
      y.C("u43", b);
    }
    y.Ce("u39", rb.get());
    S.g(!1, !1);
    G.Fc && (c.viewport(1, a, 1, 1), y.set("s53"), S.g(!1, !1), c.viewport(2, a, 1, 1), y.set("s54"), S.g(!1, !1));
  }
  function vb() {
    x.ea && x.ea.remove();
    x.Oa = x.element.isFakeVideo ? !0 : !1;
    if (x.Oa) {
      var a = wb();
      a = {isFlipY:!1, array:x.element.arrayBuffer, width:a.w, height:a.la, isKeepArray:!0};
    } else {
      a = {v:x.element};
    }
    x.ea = X.instance(Object.assign({isPot:!1, isLinear:!0, isFloat:!1}, a));
  }
  function Ja() {
    y.O("s50", [{type:"1i", name:"u1", value:0}, {type:"mat2", name:"u32", value:x.o}]);
  }
  function Ka() {
    x.H[0] = 0.5;
    x.H[1] = 0.5;
    var a = x.u[1] / x.u[0];
    Ha = Ra.S() / Ra.F();
    90 === Math.abs(ma.rotate) && (a = 1.0 / a);
    console.log("INFO in JeeFaceFilter - compute_videoUvScale(): aspectRatios = ", a, Ha);
    a > Ha ? x.H[1] *= Ha / a : x.H[0] *= a / Ha;
    y.O("s52", [{name:"u44", type:"1f", value:Ha}]);
    x.o[0] = 0.0;
    x.o[1] = 0.0;
    x.o[2] = 0.0;
    x.o[3] = 0.0;
    switch(ma.rotate) {
      case 0:
        x.o[0] = x.H[0];
        x.o[3] = x.H[1];
        break;
      case 180:
        x.o[0] = -x.H[0];
        x.o[3] = -x.H[1];
        break;
      case 90:
        x.o[1] = x.H[0];
        x.o[2] = -x.H[1];
        break;
      case -90:
        x.o[1] = -x.H[0], x.o[2] = x.H[1];
    }
    ma.flipX && (x.o[0] *= -1, x.o[2] *= -1);
  }
  function wb() {
    var a = {w:x.element.videoWidth || x.element.width, la:x.element.videoHeight || x.element.height};
    if (!a.w || !a.la || 4 > a.w || 4 > a.la) {
      throw Error("INVALID VIDEO DIMENSIONS - width = " + a.w + " height = " + a.la);
    }
    return a;
  }
  function kb() {
    var a = wb(), b = x.u[0] !== a.w || x.u[1] !== a.la;
    b && (x.u[0] = a.w, x.u[1] = a.la);
    return b;
  }
  function Ya(a, b) {
    if (ia === ea.error) {
      return !1;
    }
    x.element = a;
    kb();
    b && b();
    return !0;
  }
  function xb(a, b, d) {
    a && a();
    x.ua = {video:{facingMode:{ideal:ma.facingMode}, width:{min:ma.minWidth, max:ma.maxWidth, ideal:ma.idealWidth}, height:{min:ma.minHeight, max:ma.maxHeight, ideal:ma.idealHeight}}, audio:!1};
    ma.deviceId && (x.ua.deviceId = ma.deviceId);
    V.get(x.element ? x.element : V.Yd(), function(e) {
      b && b(e);
      console.log("INFO in JeeFaceFilter.capture_videoStream() - lib_getUserMedia success callback is called");
      d(e);
    }, function() {
      Ia("WEBCAM_UNAVAILABLE");
    }, x.ua);
  }
  function Ia(a) {
    ia !== ea.error && (ia = ea.error, L.ta && L.ta(a));
  }
  var qa = {Lf:function(a) {
    return Math.ceil(Math.log2(a));
  }, ie:function(a) {
    return Math.log2(a);
  }, Zf:function(a) {
    return 0 === Math.log2(a) % 1;
  }, Ye:function(a) {
    var b = [0, 0, 0, 0];
    a.forEach(function(d) {
      b[0] += d[0];
      b[1] += d[1];
      b[2] += d[2];
      b[3] += d[3];
    });
    return b;
  }, Ze:function(a, b, d) {
    return Math.min(Math.max(a, b), d);
  }, bf:function(a) {
    return a * Math.PI / 180;
  }, fg:function(a, b) {
    b = Math.pow(10, b);
    return Math.round(a * b) / b;
  }, gg:function(a) {
    return Math.round(1e6 * a) / 1e6;
  }, Mf:function(a, b) {
    return (100 * a / b).toFixed(3);
  }, T:function(a, b, d) {
    return a * (1 - d) + b * d;
  }, Gd:function(a, b) {
    return qa.zd(a - b);
  }, zd:function(a) {
    for (; a > Math.PI;) {
      a -= 2 * Math.PI;
    }
    for (; a <= -Math.PI;) {
      a += 2 * Math.PI;
    }
    return a;
  }, df:function(a, b) {
    return Math.abs(qa.Gd(a, b));
  }, Qe:function(a, b) {
    return Math.atan2(Math.sin(a) + Math.sin(b), Math.cos(a) + Math.cos(b));
  }}, tb = {get:function(a, b, d) {
    var e = new XMLHttpRequest;
    e.open("GET", a, !0);
    e.withCredentials = !1;
    e.onreadystatechange = function() {
      4 === e.readyState && (200 === e.status || 0 === e.status ? b(e.responseText) : "undefined" !== typeof d && d(e.status));
    };
    e.send();
  }, If:function(a, b) {
    tb.get(a, function(d) {
      b(JSON.parse(d));
    });
  }, dg:function(a, b, d) {
    var e = new XMLHttpRequest;
    e.open("POST", a, !0);
    e.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    e.onreadystatechange = function() {
      4 !== e.readyState || 200 !== e.status && 0 !== e.status || d(e.responseText);
    };
    e.send(b);
  }, xf:function(a, b) {
    var d = new XMLHttpRequest;
    d.open("POST", a, !0);
    d.responseType = "arraybuffer";
    d.onload = function() {
      b(d.response);
    };
    d.send();
  }}, Xa = {rg:function(a, b, d) {
    a = Math.min(Math.max((d - a) / (b - a), 0), 1);
    return a * a * (3.0 - 2.0 * a);
  }, Sa:function(a, b, d) {
    return Math.min(Math.max((d - a) / (b - a), 0), 1);
  }, rf:function(a, b, d, e) {
    return Math.pow(Math.min(Math.max((e - a) / (b - a), 0), 1), d);
  }, vg:function() {
    return 0;
  }, cg:function() {
    return 1;
  }, ag:function(a) {
    return a;
  }, mf:function(a) {
    return a * a;
  }, tf:function(a) {
    return a * (2 - a);
  }, jf:function(a) {
    return .5 > a ? 2 * a * a : -1 + (4 - 2 * a) * a;
  }, gf:function(a) {
    return a * a * a;
  }, sf:function(a) {
    return --a * a * a + 1;
  }, hf:function(a) {
    return .5 > a ? 4 * a * a * a : (a - 1) * (2 * a - 2) * (2 * a - 2) + 1;
  }, pf:function(a) {
    return a * a * a * a;
  }, uf:function(a) {
    return 1 - --a * a * a * a;
  }, kf:function(a) {
    return .5 > a ? 8 * a * a * a * a : 1 - 8 * --a * a * a * a;
  }, qf:function(a) {
    return a * a * a * a * a;
  }, vf:function(a) {
    return 1 + --a * a * a * a * a;
  }, lf:function(a) {
    return .5 > a ? 16 * a * a * a * a * a : 1 + 16 * --a * a * a * a * a;
  }}, Nb = {Md:function(a, b, d) {
    switch(a) {
      case "relu":
        return d + "=max(vec4(0.,0.,0.,0.)," + b + ");";
      case "elu":
        return d + "=mix(exp(-abs(" + b + "))-vec4(1.,1.,1.,1.)," + b + ",step(0.," + b + "));";
      case "elu01":
        return d + "=mix(0.1*exp(-abs(" + b + "))-vec4(0.1,0.1,0.1,0.1)," + b + ",step(0.," + b + "));";
      case "arctan":
        return d + "=atan(3.14159265359*texture2D(u0,vUV))/3.14159265359;";
      case "copy":
        return "";
      default:
        return !1;
    }
  }}, y = function() {
    function a(v, u, B) {
      u = v.createShader(u);
      v.shaderSource(u, B);
      v.compileShader(u);
      return v.getShaderParameter(u, v.COMPILE_STATUS) ? u : !1;
    }
    function b(v, u, B) {
      u = a(v, v.VERTEX_SHADER, u);
      B = a(v, v.FRAGMENT_SHADER, B);
      v === c && t.push(u, B);
      var U = v.createProgram();
      v.attachShader(U, u);
      v.attachShader(U, B);
      v.linkProgram(U);
      return U;
    }
    function d(v, u, B) {
      void 0 === u.ja && (u.ja = "precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5,.5);}");
      void 0 === u.Da && (u.Da = ["a0"]);
      void 0 === u.qa && (u.qa = [2]);
      if (void 0 === u.precision || "highp" === u.precision) {
        u.precision = g;
      }
      u.id = r++;
      void 0 !== u.we && u.we.forEach(function(Q, aa) {
        u.a = u.a.replace(Q, u.$a[aa]);
      });
      u.Tb = 0;
      u.qa.forEach(function(Q) {
        u.Tb += 4 * Q;
      });
      u.ia = b(v, u.ja, "precision " + u.precision + " float;\n" + u.a);
      console.log("INFO in ShadersFF.js: compile", B);
      u.j = {};
      u.c.forEach(function(Q) {
        u.j[Q] = v.getUniformLocation(u.ia, Q);
      });
      u.attributes = {};
      u.ra = [];
      u.Da.forEach(function(Q) {
        var aa = v.getAttribLocation(u.ia, Q);
        u.attributes[Q] = aa;
        u.ra.push(aa);
      });
      if (u.f) {
        v.useProgram(u.ia);
        k = u;
        n = u.id;
        for (var U in u.f) {
          v.uniform1i(u.j[U], u.f[U]);
        }
      }
      u.zb = !0;
    }
    function e(v) {
      va.Be(J);
      n !== v.id && (J.M(), n = v.id, k = v, c.useProgram(v.ia), v.ra.forEach(function(u) {
        0 !== u && c.enableVertexAttribArray(u);
      }));
    }
    function m(v, u, B) {
      d(v, u, B);
      v.useProgram(u.ia);
      v.enableVertexAttribArray(0);
      n = -1;
      return k = u;
    }
    function f() {
      return {a:"uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}", c:["u1"], f:{u1:0}};
    }
    var t = [], n = -1, k = null, r = 0, h = !1, g = "highp", w = ["u1"], l = ["u0"], C = {u1:0}, H = {u0:0}, I = {u1:0, u2:1}, N = {u3:0}, A = {s0:f(), s1:{a:"uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}", c:w, f:C, precision:"lowp"}, s2:{a:"uniform sampler2D u1,u2;varying vec2 vv0;void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a*b;}", c:["u1", "u2"], f:I}, s3:{a:"uniform sampler2D u1;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a.r*f;}", 
    c:w, f:C}, s4:{a:"uniform sampler2D u1,u2;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a.a*b.r*f;}", c:["u1", "u2"], f:I}, s5:{a:"uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(1.-vv0.x,vv0.y));}", c:w, f:C}, s6:{a:"uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(vv0.x,1.-vv0.y));}", c:w, f:C}, s7:{a:"uniform sampler2D u0;uniform float u4;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=a*u4;}", 
    c:["u0", "u4"], f:H}, s8:{a:"uniform sampler2D u0;uniform float u4;varying vec2 vv0;const vec4 f=vec4(.25,.25,.25,.25),g=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);float b=dot(a*u4,f);gl_FragColor=b*g;}", c:["u0", "u4"], f:H}, s9:{a:"uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){float a=.25*dot(e,texture2D(u1,vv0));gl_FragColor=a*e;}", c:w, f:C}, s10:{a:"uniform sampler2D u1,u5;uniform float u6;const vec4 f=vec4(1.,1.,1.,1.);varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u5,vv0);gl_FragColor=mix(b,a,u6*f);}", 
    c:["u1", "u5", "u6"], f:{u1:0, u5:1}}, s11:{a:"uniform sampler2D u1;uniform vec2 u7;varying vec2 vv0;void main(){gl_FragColor=.25*(texture2D(u1,vv0+u7)+texture2D(u1,vv0+u7*vec2(1.,-1.))+texture2D(u1,vv0+u7*vec2(-1.,-1.))+texture2D(u1,vv0+u7*vec2(-1.,1.)));}", c:["u1", "u7"], f:C}, s12:{a:"uniform sampler2D u1;uniform vec4 u8;varying vec2 vv0;float g(float a,float b){a=floor(a)+.5;return floor(a/exp2(b));}float h(float a,float b){return floor(a*exp2(b)+.5);}float i(float a,float b){return mod(a,h(1.,b));}float e(float c,float a,float b){a=floor(a+.5),b=floor(b+.5);return i(g(c,a),b-a);}vec4 j(float a){if(a==0.)return vec4(0.,0.,0.,0.);float k=128.*step(a,0.);a=abs(a);float c=floor(log2(a)),l=c+127.,b=(a/exp2(c)-1.)*8388608.,d=l/2.,m=fract(d)*2.,n=floor(d),o=e(b,0.,8.),p=e(b,8.,16.),q=m*128.+e(b,16.,23.),r=k+n;return vec4(o,p,q,r)/255.;}void main(){float a=dot(texture2D(u1,vv0),u8);gl_FragColor=j(a);}", 
    c:["u1", "u8"], f:C}, s13:{a:"uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=e/(e+exp(-a));gl_FragColor=b;}", c:l, f:H}, s14:{a:"uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(0.,0.,0.,0.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=max(f,a);}", c:l, f:H}, s15:{a:"uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=mix(exp(-abs(a))-f,a,step(0.,a));}", 
    c:l, f:H}, s16:{a:"uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=exp(-abs(a))-f;gl_FragColor=mix(.1*b,a,step(0.,a));}", c:l, f:H}, s17:{a:"uniform sampler2D u0,u6,u9;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),c=texture2D(u6,vv0),d=texture2D(u9,vv0),b=a/d;gl_FragColor=c*mix(exp(-abs(b))-f,b,step(0.,a));}", c:["u0", "u6", "u9"], f:{u0:0, u6:1, u9:2}}, s18:{a:"uniform sampler2D u0;const float e=3.141593;varying vec2 vv0;void main(){gl_FragColor=atan(e*texture2D(u0,vv0))/e;}", 
    c:l, f:H}, s19:{a:"uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=log(f+a);gl_FragColor=b;}", c:l, f:H}, s20:{a:"uniform sampler2D u0,u10;uniform float u11;const vec2 e=vec2(.5,.5);const float f=1e-5;const vec4 g=vec4(1.,1.,1.,1.),i=vec4(0.,0.,0.,0.);varying vec2 vv0;void main(){vec4 a=texture2D(u10,e);float b=u11*u11;vec4 c=max(b*a,f*g);gl_FragColor=texture2D(u0,vv0)/c;}", c:["u0", "u10", "u11"], f:{u0:0, u10:1}}, s21:{a:"uniform sampler2D u1;uniform vec2 u12;varying vec2 vv0;void main(){float a=u12.x*u12.y;vec2 b=floor(vv0*a)/a,c=fract(vv0*a),d=floor(b*u12.y),f=floor(u12.x*fract(b*u12.y)),g=(f*u12.y+d)/a;gl_FragColor=texture2D(u1,g+c/a);}", 
    c:["u1", "u12"], f:C}, s22:{a:"uniform sampler2D u13,u14,u15;varying vec2 vv0;void main(){vec4 a=texture2D(u15,vv0);vec2 b=a.rg,c=a.ba;vec4 d=texture2D(u13,b),f=texture2D(u14,c);gl_FragColor=d*f;}", c:["u13", "u14", "u15"], f:{u14:0, u13:1, u15:2}}, s23:{a:"uniform float u16;uniform sampler2D u13,u14;varying vec2 vv0;void main(){vec2 a=fract(vv0*u16);vec4 b=texture2D(u13,vv0),c=texture2D(u14,a);gl_FragColor=b*c;}", c:["u14", "u13", "u16"], f:{u14:0, u13:1}}, s24:{a:"uniform float u16;uniform sampler2D u13,u14,u17,u18,u19,u20;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(1e-3,1e-3,1e-3,1e-3);void main(){vec2 h=vv0*u16,l=floor(h),c=h-l;vec4 m=texture2D(u13,vv0),d=texture2D(u14,c),a=texture2D(u20,vv0);a=a*255.;vec4 n=texture2D(u17,c),o=texture2D(u18,c),p=texture2D(u19,c),i=step(-g,-a),b=e-i,j=b*step(-e-g,-a);b*=e-j;vec4 k=b*step(-2.*e-g,-a);b*=e-k;vec4 q=b;d=i*d+j*n+k*o+q*p,gl_FragColor=m*d;}", 
    c:"u13 u14 u16 u20 u17 u18 u19".split(" "), f:{u14:0, u13:1, u20:3, u17:4, u18:5, u19:6}}, s25:{a:"uniform sampler2D u13,u14,u21;uniform float u16,u22,u23,u24;varying vec2 vv0;const vec2 j=vec2(1.,1.);void main(){vec2 a=floor(u22*vv0),b=u22*vv0-a;float c=u16/u22;vec2 d=floor(b*c),f=b*c-d,g=(a+f)/u22;float k=u22*u24/u16;vec2 l=k*d,h=(l+f*u23)/u24,i=step(h,j);vec4 m=texture2D(u13,g),n=texture2D(u14,h),o=m*n*i.x*i.y,p=texture2D(u21,g);gl_FragColor=o*u23*u23+p;}", c:"u13 u14 u16 u22 u23 u24 u21".split(" "), 
    f:{u14:0, u13:1, u21:2}}, s26:{a:"uniform sampler2D u13,u14;varying vec2 vv0;void main(){vec4 a=texture2D(u13,vv0),b=texture2D(u14,vv0);gl_FragColor=a*b;}", c:["u13", "u14"], f:{u14:0, u13:1}}, s27:{a:"uniform sampler2D u1,u21;uniform float u25;varying vec2 vv0;void main(){gl_FragColor=texture2D(u21,vv0)+u25*texture2D(u1,vv0);}", c:["u1", "u21", "u25"], f:{u1:0, u21:1}}, s28:{a:"varying vec2 vv0;uniform sampler2D u1;const vec4 f=vec4(1.,1.,1.,1.),g=vec4(.299,.587,.114,0.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=dot(a,g)*f;}", 
    c:w, f:C, precision:"lowp"}, s29:{a:"varying vec2 vv0;uniform sampler2D u1;uniform float u26;const vec3 f=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u26)).rgb,c=texture2D(u1,vv0+vec2(u26,u26)).rgb,d=texture2D(u1,vv0+vec2(u26,0.)).rgb;gl_FragColor=vec4(dot(a,f),dot(b,f),dot(c,f),dot(d,f));}", c:["u1", "u26"], f:C, precision:"lowp"}, s30:{a:"varying vec2 vv0;uniform sampler2D u1;uniform float u26;const vec3 f=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u26)).rgb,c=texture2D(u1,vv0+vec2(u26,u26)).rgb,d=texture2D(u1,vv0+vec2(u26,0.)).rgb;gl_FragColor=vec4(a.r,b.g,c.b,dot(d,f));}", 
    c:["u1", "u26"], f:C, precision:"lowp"}, s31:{a:"varying vec2 vv0;uniform sampler2D u1,u2;uniform float u27;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=vec4(0.);a-=texture2D(u1,vec2(vv0.x-u27,vv0.y-u27))*1.,a-=texture2D(u1,vec2(vv0.x-u27,vv0.y))*2.,a-=texture2D(u1,vec2(vv0.x-u27,vv0.y+u27))*1.,a+=texture2D(u1,vec2(vv0.x+u27,vv0.y-u27))*1.,a+=texture2D(u1,vec2(vv0.x+u27,vv0.y))*2.,a+=texture2D(u1,vec2(vv0.x+u27,vv0.y+u27))*1.;vec4 b=vec4(0.);b-=texture2D(u1,vec2(vv0.x-u27,vv0.y-u27))*1.,b-=texture2D(u1,vec2(vv0.x,vv0.y-u27))*2.,b-=texture2D(u1,vec2(vv0.x+u27,vv0.y-u27))*1.,b+=texture2D(u1,vec2(vv0.x-u27,vv0.y+u27))*1.,b+=texture2D(u1,vec2(vv0.x,vv0.y+u27))*2.,b+=texture2D(u1,vec2(vv0.x+u27,vv0.y+u27))*1.;vec3 c=sqrt(a.rgb*a.rgb+b.rgb*b.rgb);vec4 e=vec4(c,texture2D(u1,vv0).a),g=texture2D(u2,vv0);gl_FragColor=g.a*e.r*f;}", 
    c:["u1", "u2", "u27"], f:I}, s32:{a:"varying vec2 vv0;uniform sampler2D u1,u2;uniform float u27;const vec4 j=vec4(1.,1.,1.,1.);const vec2 k=vec2(1.,1.);void main(){float h=0.;vec2 l=k*u27,a,b;float c,d,i=0.;for(float e=-4.;e<=4.;e+=1.)for(float f=-4.;f<=4.;f+=1.)a=vec2(e,f),c=length(a)/2.,d=exp(-c*c),b=vv0+l*a,h+=d*texture2D(u1,b).r,i+=d;vec4 m=texture2D(u2,vv0);gl_FragColor=m.a*(texture2D(u1,b).r-h/i)*j;}", c:["u1", "u2", "u27"], f:I}, s33:{a:"uniform sampler2D u3;uniform vec2 u7;varying vec2 vv0;vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}const vec2 g=vec2(.5,.5),h=vec2(1.,0.),i=vec2(0.,1.);void main(){vec2 a=vv0-u7*g;vec4 b=texture2D(u3,a),c=texture2D(u3,a+u7*h),d=texture2D(u3,a+u7*i),j=texture2D(u3,a+u7),k=e(b,c),l=e(d,j);gl_FragColor=e(k,l);}", 
    c:["u3", "u7"], f:N}, s34:{a:"uniform sampler2D u3;uniform vec2 u7;varying vec2 vv0;const vec2 k=vec2(1.,0.),l=vec2(0.,1.),m=vec2(2.,0.),n=vec2(0.,2.);vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}vec4 f(vec2 a){vec4 b=texture2D(u3,a),c=texture2D(u3,a+u7*k),d=texture2D(u3,a+u7*l),g=texture2D(u3,a+u7),h=e(b,c),i=e(d,g);return e(h,i);}void main(){vec2 a=vv0+u7*vec2(-.55,-1.05);vec4 b=f(a),c=f(a+u7*m),d=f(a+u7*2.),g=f(a+u7*n),h=e(b,c),i=e(d,g);gl_FragColor=e(h,i);}", c:["u3", "u7"], 
    f:N}, s35:{a:"uniform sampler2D u1;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a*a;}", c:["u1"], f:C, precision:"lowp"}, s36:{a:"uniform sampler2D u1;uniform vec2 u7;varying vec2 vv0;const float e=15444.;void main(){vec4 a=1001./e*texture2D(u1,vv0-3.*u7)+2002./e*texture2D(u1,vv0-2.*u7)+3003./e*texture2D(u1,vv0-u7)+3432./e*texture2D(u1,vv0)+3003./e*texture2D(u1,vv0+u7)+2002./e*texture2D(u1,vv0+2.*u7)+1001./e*texture2D(u1,vv0+3.*u7);gl_FragColor=a;}", c:["u7", "u1"], f:C, 
    precision:"lowp"}, s37:{a:"uniform sampler2D u1,u28,u29;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);const float g=.1;void main(){vec4 a=texture2D(u28,vv0),b=texture2D(u29,vv0),c=texture2D(u1,vv0),d=max(f*g,b-a*a),h=sqrt(d);gl_FragColor=(c-a)/h;}", c:["u1", "u28", "u29"], f:{u1:0, u28:1, u29:2}}}, E = {s38:{a:"uniform float u16,u30;uniform sampler2D u13,u14,u21;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(1e-5,1e-5);void main(){vec4 sum=texture2D(u21,vv0);float toSparsity=1.1111;vec2 uvFrom,uvWeight,xyPatch=ZERO2,eps2=EPS2/u16,xyTo=floor(vv0*u16+eps2);float weightSize=toSparsity*u16;vec2 halfFromSparsity=ONE2*(toSparsity-1.)/2.;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.)xyPatch.y=patch_y,uvFrom=(xyTo+HALF2+u30*(xyPatch-halfFromSparsity))/u16,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),uvWeight=(xyTo*toSparsity+xyPatch+HALF2)/weightSize,sum+=texture2D(u13,uvWeight)*texture2D(u14,uvFrom);}gl_FragColor=sum,gl_FragColor*=2.2222;}", 
    c:["u16", "u13", "u14", "u21", "u30"], $a:["1.1111", "gl_FragColor\\*=2.2222;"]}, s39:{a:"uniform float u16,u30,u24;uniform sampler2D u13,u14,u21;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(1e-4,1e-4);void main(){vec4 sum=texture2D(u21,vv0);float fromSparsity=1.1111,shrinkFactor=3.3333;vec2 uvFrom,uvWeight,xyFrom,xyPatchTo,xyPatch=ZERO2,xyShrink=ZERO2,eps2=EPS2/u24,xyTo=floor(vv0*u16+eps2);float weightSize=fromSparsity*u24;vec2 halfFromSparsity=ONE2*(fromSparsity-1.)/2.;float toSparsity=weightSize/u16;vec2 xyFrom0=xyTo*shrinkFactor;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.){xyPatch.y=patch_y;for(float shrink_x=0.;shrink_x<3.3333;shrink_x+=1.){xyShrink.x=shrink_x;for(float shrink_y=0.;shrink_y<3.3333;shrink_y+=1.)xyShrink.y=shrink_y,xyFrom=xyFrom0+xyShrink+shrinkFactor*u30*(xyPatch-halfFromSparsity),uvFrom=(xyFrom+HALF2)/u24,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),xyPatchTo=xyPatch*shrinkFactor+xyShrink,uvWeight=(xyTo*toSparsity+xyPatchTo+HALF2)/weightSize,sum+=texture2D(u13,uvWeight)*texture2D(u14,uvFrom);}}}gl_FragColor=sum,gl_FragColor*=2.2222;}", 
    c:"u16 u24 u13 u14 u21 u30".split(" "), $a:["1.1111", "gl_FragColor\\*=2.2222;", "3.3333"]}}, J = {Qa:function() {
      return h;
    }, m:function() {
      if (!h) {
        g = "highp";
        for (var v in A) {
          d(c, A[v], v);
        }
        y.set("s0");
        c.enableVertexAttribArray(0);
        h = !0;
      }
    }, kd:function(v) {
      v.forEach(function(u) {
        J.Wb(u);
      });
    }, Wb:function(v) {
      A[v.id] = v;
      d(c, v, v.id);
    }, yc:function(v, u, B) {
      u || (u = v);
      A[u] = Object.create(E[v]);
      A[u].de = !0;
      E[v].$a && E[v].$a.forEach(function(U, Q) {
        A[u].a = A[u].a.replace(new RegExp(U, "g"), B[Q]);
      });
      d(c, A[u], u);
    }, set:function(v) {
      if (!(v in A)) {
        console.log("ERROR in Shader.js - set: unknow shader: ", v);
        debugger;
      }
      e(A[v]);
    }, ab:function(v) {
      return m(v, f(), "s40");
    }, Mb:function(v) {
      return m(v, {a:"void main(){gl_FragColor=vec4(.5,.5,.5,.5);}", c:[], precision:"highp"}, "s41");
    }, Jd:function(v) {
      return "undefined" === typeof A[v] ? !1 : A[v].zb;
    }, M:function() {
      -1 !== n && (n = -1, k.ra.forEach(function(v) {
        0 !== v && c.disableVertexAttribArray(v);
      }));
    }, Ob:function() {
      var v = 0;
      k.ra.forEach(function(u, B) {
        B = k.qa[B];
        c.vertexAttribPointer(u, B, c.FLOAT, !1, k.Tb, v);
        v += 4 * B;
      });
    }, hc:function() {
      c.enableVertexAttribArray(0);
    }, ma:function() {
      J.bb(c);
    }, bb:function(v) {
      v.vertexAttribPointer(k.ra[0], 2, v.FLOAT, !1, 8, 0);
    }, bd:function(v, u) {
      c.uniform1i(k.j[v], u);
    }, C:function(v, u) {
      c.uniform1f(k.j[v], u);
    }, Aa:function(v, u, B) {
      c.uniform2f(k.j[v], u, B);
    }, lg:function(v, u) {
      c.uniform2fv(k.j[v], u);
    }, Ce:function(v, u) {
      c.uniform3fv(k.j[v], u);
    }, mg:function(v, u, B, U) {
      c.uniform3f(k.j[v], u, B, U);
    }, ng:function(v, u, B, U, Q) {
      c.uniform4f(k.j[v], u, B, U, Q);
    }, Nb:function(v, u) {
      c.uniform4fv(k.j[v], u);
    }, og:function(v, u) {
      c.uniformMatrix2fv(k.j[v], !1, u);
    }, pg:function(v, u) {
      c.uniformMatrix3fv(k.j[v], !1, u);
    }, qg:function(v, u) {
      c.uniformMatrix4fv(k.j[v], !1, u);
    }, O:function(v, u) {
      J.set(v);
      u.forEach(function(B) {
        switch(B.type) {
          case "4f":
            c.uniform4fv(k.j[B.name], B.value);
            break;
          case "3f":
            c.uniform3fv(k.j[B.name], B.value);
            break;
          case "2f":
            c.uniform2fv(k.j[B.name], B.value);
            break;
          case "1f":
            c.uniform1f(k.j[B.name], B.value);
            break;
          case "1i":
            c.uniform1i(k.j[B.name], B.value);
            break;
          case "mat2":
            c.uniformMatrix2fv(k.j[B.name], !1, B.value);
            break;
          case "mat3":
            c.uniformMatrix3fv(k.j[B.name], !1, B.value);
            break;
          case "mat4":
            c.uniformMatrix4fv(k.j[B.name], !1, B.value);
        }
      });
    }, Kf:function() {
      return "lowp";
    }, h:function() {
      c.disableVertexAttribArray(0);
      J.M();
      for (var v in A) {
        var u = A[v];
        u.zb && (console.log("INFO in ShadersFF.js: Delete shader", v), u.zb = !1, c.deleteProgram(u.ia));
        u.de && delete A[v];
      }
      t.forEach(function(B) {
        c.deleteShader(B);
      });
      t.splice(0);
      r = 0;
      h = !1;
    }, };
    return J;
  }(), c = null, Ra = function() {
    function a(g) {
      console.log("ERROR in ContextFF: ", g);
      return !1;
    }
    function b(g) {
      function w() {
        Ba.h();
        C.getExtension("WEBGL_lose_context").loseContext();
      }
      if (navigator.userAgent && -1 !== navigator.userAgent.indexOf("forceWebGL1")) {
        return !1;
      }
      console.log("INFO in ContextFF: test if WebGL2 implementation is valid...");
      var l = document.createElement("canvas");
      l.setAttribute("width", 1);
      l.setAttribute("height", 1);
      var C = null;
      try {
        C = l.getContext("webgl2", g);
      } catch (H) {
        return !1;
      }
      if (!C) {
        return !1;
      }
      d(C);
      fa.ic(C);
      g = fa.kb(C);
      if (!g.ba && !g.ca) {
        return w(), console.log("WARNING in ContextFF - is_validWebGL2(): WebGL2 is here but we cannot RTT on float or half float textures"), !1;
      }
      g = Ba.$b(C, g);
      w();
      return g ? !0 : (console.log("WARNING in ContextFF - is_validWebGL2(): WebGL2 is here but we cannot filter float or half float textures"), !1);
    }
    function d(g) {
      g.clearColor(0, 0, 0, 0);
      g.disable(g.DEPTH_TEST);
      g.disable(g.BLEND);
      g.disable(g.DITHER);
      g.disable(g.STENCIL_TEST);
      g.disable(g.CULL_FACE);
      g.GENERATE_MIPMAP_HINT && g.hint(g.GENERATE_MIPMAP_HINT, g.FASTEST);
      g.disable(g.SAMPLE_ALPHA_TO_COVERAGE);
      g.disable(g.SAMPLE_COVERAGE);
      g.depthFunc(g.LEQUAL);
      g.clearDepth(1.0);
    }
    var e = null, m = null, f = null, t = null, n = !0, k = null, r = null, h = {F:function() {
      return e.width;
    }, S:function() {
      return e.height;
    }, Bf:function() {
      return e;
    }, zf:function() {
      return c;
    }, da:function() {
      return n;
    }, flush:function() {
      c.flush();
    }, Pd:function() {
      k || (k = new Uint8Array(e.width * e.height * 4));
      c.readPixels(0, 0, e.width, e.height, c.RGBA, c.UNSIGNED_BYTE, k);
      return k;
    }, Df:function() {
      return e.toDataURL("image/jpeg");
    }, Ef:function() {
      ta.J();
      m || (m = document.createElement("canvas"), f = m.getContext("2d"));
      m.width = e.width;
      m.height = e.height;
      for (var g = h.Pd(), w = f.createImageData(m.width, m.height), l = m.width, C = m.height, H = w.data, I = 0; I < C; ++I) {
        for (var N = C - I - 1, A = 0; A < l; ++A) {
          var E = 4 * (I * l + A), J = 4 * (N * l + A);
          H[E] = g[J];
          H[E + 1] = g[J + 1];
          H[E + 2] = g[J + 2];
          H[E + 3] = g[J + 3];
        }
      }
      f.putImageData(w, 0, 0);
      return m.toDataURL("image/png");
    }, Cf:function(g) {
      !m && g && (m = document.createElement("canvas"), f = m.getContext("2d"));
      var w = g ? m : document.createElement("canvas");
      w.width = e.width;
      w.height = e.height;
      (g ? f : w.getContext("2d")).drawImage(e, 0, 0);
      return w;
    }, m:function(g) {
      g.Dd && !g.jb ? e = document.getElementById(g.Dd) : g.jb && (e = g.jb);
      e || (e = document.createElement("canvas"));
      e.width = g && void 0 !== g.width ? g.width : 512;
      e.height = g && void 0 !== g.height ? g.height : 512;
      "undefined" === typeof g && (g = {});
      void 0 === g.premultipliedAlpha && (g.premultipliedAlpha = !1);
      void 0 === g.Cc && (g.Cc = !0);
      void 0 === g.antialias && (g.antialias = !1);
      console.log("============ INIT ContextFF ============");
      if (c) {
        n = c instanceof WebGL2RenderingContext;
      } else {
        n = !0;
        var w = {antialias:g.antialias, alpha:!0, preserveDrawingBuffer:!0, premultipliedAlpha:g.premultipliedAlpha, stencil:!1, depth:g.Cc};
        navigator && navigator.userAgent && -1 !== navigator.userAgent.indexOf("noAntialiasing") && (w.antialias = !1);
        console.log("INFO in ContextFF: webglOptions = ", JSON.stringify(w));
        var l = b(w);
        console.log("INFO in ContextFF: isValidWebGL2 = ", l);
        !l && w.antialias && (console.log("WARNING in ContextFF: Turn off antialiasing because WebGL2 sucks with it"), w.antialias = !1, l = b(w), console.log("INFO in ContextFF: isValidWebGL2 = ", l));
        l ? (console.log("INFO in ContextFF - init: We try to create a WebGL2 context"), c = e.getContext("webgl2", w)) : console.log("WARNING in ContextFF - init: WebGL2 implementation is crappy. Use WebGL1");
        c ? (console.log("INFO in ContextFF - init: WebGL2 context has been initialized"), n = !0) : (console.log("INFO in ContextFF - init: We try to create a WebGL1 context (WebGL2 is not implemented or its implementation sucks)"), (c = e.getContext("webgl", w)) || (c = e.getContext("experimental-webgl", w)), n = !1, c && console.log("INFO in ContextFF - init: a WebGL1 context has been created successfully"));
      }
      if (!c) {
        return a("WebGL1 and 2 are not enabled");
      }
      (t = c.getExtension("WEBGL_lose_context")) && g.Tc && (r = g.Tc, e.addEventListener("webglcontextlost", r, !1));
      if (!fa.m()) {
        return a("Not enough GL capabilities");
      }
      d(c);
      y.m();
      S.m();
      return Ba.$b(c, fa.Od()) ? !0 : a("Cannot filter float textures");
    }, h:function() {
      c && (fa.h(), Ba.h());
      t && r && (e.removeEventListener("webglcontextlost", r, !1), t = r = null);
      c = k = f = m = e = null;
    }};
    return h;
  }(), va = function() {
    function a() {
      null === b && ("undefined" !== typeof y ? b = y : "undefined" !== typeof JEShaders && (b = JEShaders));
    }
    var b = null;
    a();
    return {Be:function(d) {
      b !== d && (b && b.M(), b = d);
    }, Qa:function() {
      return b.Qa();
    }, ma:function() {
      return b.ma();
    }, bb:function(d) {
      return b.bb(d);
    }, Ob:function() {
      return b.Ob();
    }, M:function() {
      return b.M();
    }, set:function(d) {
      return b.set(d);
    }, ab:function(d) {
      a();
      return b.ab(d);
    }, Mb:function(d) {
      a();
      return b.Mb(d);
    }, h:function() {
      return b.h();
    }};
  }(), Ea = function() {
    function a(p) {
      c.bindTexture(c.TEXTURE_2D, p);
    }
    function b(p) {
      U[0] = p;
      p = Q[0];
      var M = p >> 16 & 32768, K = p >> 12 & 2047, q = p >> 23 & 255;
      return 103 > q ? M : 142 < q ? M | 31744 | ((255 == q ? 0 : 1) && p & 8388607) : 113 > q ? (K |= 2048, M | (K >> 114 - q) + (K >> 113 - q & 1)) : M = (M | q - 112 << 10 | K >> 1) + (K & 1);
    }
    function d(p) {
      var M = new Uint16Array(p.length);
      p.forEach(function(K, q) {
        M[q] = b(K);
      });
      return M;
    }
    function e() {
      if (null !== aa.wb) {
        return aa.wb;
      }
      var p = f(d([1, 1, 1, 1]));
      return null === p ? !0 : aa.wb = p;
    }
    function m() {
      if (null !== aa.xb) {
        return aa.xb;
      }
      var p = f(new Uint8Array([255, 255, 255, 255]));
      return null === p ? !0 : aa.xb = p;
    }
    function f(p) {
      if (!va.Qa() || !H) {
        return console.log("WARNING in SharedTexture: can_initFromArray() is called too soon"), null;
      }
      var M = null;
      try {
        var K = c.getError();
        if ("FUCKING_BIG_ERROR" === K) {
          return !1;
        }
        M = D.instance({isFloat:!1, L:!0, array:p, width:1});
        K = c.getError();
        if (K !== c.NO_ERROR) {
          return !1;
        }
      } catch (q) {
        return !1;
      }
      ka.J();
      c.viewport(0, 0, 1, 1);
      c.clearColor(0, 0, 0, 0);
      c.clear(c.COLOR_BUFFER_BIT);
      va.set("s0");
      M.Yb(0);
      la.g(!0, !0);
      p = new Uint8Array(4);
      c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, p);
      p = 0.9 < p[0];
      M.remove();
      ka.Z();
      return p;
    }
    var t = 0, n = null, k = 0, r = null, h = null, g = null, w = null, l = null, C = null, H = !1, I = [], N = {isFloat:!1, isPot:!0, isLinear:!1, isMipmap:!1, isAnisotropicFiltering:!1, isMirrorX:!1, isMirrorY:!1, isSrgb:!1, isKeepArray:!1, isFlipY:null, width:0, height:0, url:null, array:null, data:null, v:null, ce:!1, L:!1, ha:null, Ua:4, Bb:0}, A = !1, E = null, J = null, v = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], u = !1, B = !1, U = new Float32Array(1), Q = new Int32Array(U.buffer), 
    aa = {wb:null, xb:null}, D = {m:function() {
      H || (console.log("INFO in SharedTexture: init()"), l = [c.RGB, null, c.RGB, c.RGBA], C = [c.RGB, null, c.RGB, c.RGBA], n = [c.TEXTURE0, c.TEXTURE1, c.TEXTURE2, c.TEXTURE3, c.TEXTURE4, c.TEXTURE5, c.TEXTURE6, c.TEXTURE7], u = "undefined" !== typeof JEContext, B = "undefined" !== typeof fa, u && JEContext.$f() && n.push(c.TEXTURE8, c.TEXTURE9), r = [-1, -1, -1, -1, -1, -1, -1, -1], w = [c.UNSIGNED_BYTE, c.FLOAT, c.FLOAT], H = !0);
    }, $d:function() {
      if (!h) {
        console.log("INFO in SharedTexture: build random texture");
        for (var p = new Float32Array(16384), M = 0; 16384 > M; ++M) {
          p[M] = 2.0 * Math.random() - 1.0;
        }
        h = {random:D.instance({isFloat:!0, isPot:!0, array:p, width:64}), gd:D.instance({isFloat:!1, isPot:!0, width:1, array:new Uint8Array([0, 0, 0, 0])})};
      }
      D.Oe();
    }, Rf:function() {
      return h.gd;
    }, Oe:function() {
      w[1] = fa.ub(c);
    }, ye:function() {
      C = l = [c.RGBA, c.RGBA, c.RGBA, c.RGBA];
    }, eg:function(p, M) {
      y.set("s1");
      ka.J();
      var K = p.F(), q = p.S();
      c.viewport(0, 0, K, q);
      p.b(0);
      la.g(!1, !1);
      c.readPixels(0, 0, K, q, c.RGBA, c.UNSIGNED_BYTE, M);
    }, qc:function(p, M, K, q, ha, wa, Ca) {
      p.activeTexture(p.TEXTURE0);
      var ra = p.createTexture();
      p.bindTexture(p.TEXTURE_2D, ra);
      ha = ha instanceof Float32Array ? ha : new Float32Array(ha);
      0 !== qa.ie(ha.length) % 1 && (p.texParameteri(p.TEXTURE_2D, p.TEXTURE_WRAP_S, p.CLAMP_TO_EDGE), p.texParameteri(p.TEXTURE_2D, p.TEXTURE_WRAP_T, p.CLAMP_TO_EDGE));
      p.texParameteri(p.TEXTURE_2D, p.TEXTURE_MAG_FILTER, p.NEAREST);
      p.texParameteri(p.TEXTURE_2D, p.TEXTURE_MIN_FILTER, p.NEAREST);
      p.pixelStorei(p.UNPACK_FLIP_Y_WEBGL, wa);
      p.texImage2D(p.TEXTURE_2D, 0, p.RGBA, K, q, 0, p.RGBA, p.FLOAT, ha);
      p.bindTexture(p.TEXTURE_2D, null);
      p.pixelStorei(p.UNPACK_FLIP_Y_WEBGL, !1);
      Ca && (ka.Z(), y.set("s0"));
      p.viewport(0, 0, K, q);
      p.framebufferTexture2D(p.FRAMEBUFFER, p.COLOR_ATTACHMENT0, p.TEXTURE_2D, M, 0);
      p.bindTexture(p.TEXTURE_2D, ra);
      Ca ? la.g(!0, !0) : S.Ka(p);
      p.deleteTexture(ra);
      H && (r[0] = -1, g = null, t = 0);
    }, instance:function(p) {
      function M(z) {
        var F = c.getError();
        if ("FUCKING_BIG_ERROR" === F) {
          return !1;
        }
        c.texImage2D(c.TEXTURE_2D, 0, da, ba, ca, z);
        F = c.getError();
        F !== c.NO_ERROR && (c.finish(), oa.Nc("[DEBUG] in SharedTexture.fill_textureFromDomElement() - GL.texImage2D params:", {glErr:F, internalFormat:da, pixelFormat:ba, pixelType:ca}), ba !== c.RGBA && (ba = c.RGBA, c.texImage2D(c.TEXTURE_2D, 0, da, ba, ca, z)));
        return !0;
      }
      function K() {
        if (!yb) {
          a(sa);
          xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, xa);
          q.isPot ? (c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, q.isMirrorX ? c.MIRRORED_REPEAT : c.REPEAT), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, q.isMirrorY ? c.MIRRORED_REPEAT : c.REPEAT)) : (c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE));
          q.isAnisotropicFiltering && "undefined" !== typeof JESETTINGS && c.texParameterf(c.TEXTURE_2D, JEContext.Ff().TEXTURE_MAX_ANISOTROPY_EXT, JESETTINGS.Re);
          c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, q.isLinear ? c.LINEAR : c.NEAREST);
          q.isLinear ? c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, q.isMipmap && !La ? c.NEAREST_MIPMAP_LINEAR : c.LINEAR) : c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, q.isMipmap && !La ? c.NEAREST_MIPMAP_NEAREST : c.NEAREST);
          ba = l[q.Ua - 1];
          da = C[q.Ua - 1];
          ca = w[wa];
          if (fa.da()) {
            var z = c.RGBA32F;
            ba === c.RGBA && ca === c.FLOAT ? q.isMipmap || q.isLinear ? da = Ba.Rd(c) : fa.ac() ? z && (da = z) : da = c.RGBA16F || c.RGBA : ba === c.RGB && ca === c.FLOAT && z && (da = z, ba = c.RGBA);
          }
          if (q.L && !q.isFloat || q.isFloat && q.isMipmap && Ba.he()) {
            (z = c.RGBA16F) && (da = z), ca = fa.ub(c);
          }
          q.Bb && (Za = q.Bb);
          q.isSrgb && 4 === q.Ua && (ba = JEContext.Pf());
          (q.v || q.url) && ca !== c.UNSIGNED_BYTE && console.log("WARNING in SharedTexture - load(): an url or domElement texture is floating point", q.v, q.url);
          if (q.v) {
            M(q.v);
          } else {
            if (q.url) {
              M(Ga);
            } else {
              if (ya) {
                z = ya;
                try {
                  var F = c.getError();
                  "FUCKING_BIG_ERROR" !== F && (F !== c.NO_ERROR && console.log("GLERR in SharedTexture:", F), c.texImage2D(c.TEXTURE_2D, 0, da, O, P, 0, ba, ca, z), c.getError() !== c.NO_ERROR && (console.log("WARNING in SharedTexture - fill_textureFromArray(): invalid texImage2D params with array =", da, ba, ca), c.texImage2D(c.TEXTURE_2D, 0, da, O, P, 0, ba, ca, null), c.getError() !== c.NO_ERROR && (console.log("WARNING in SharedTexture - fill_textureFromArray(): invalid texImage2D params with null =", 
                  da, ba, ca), c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, O, P, 0, c.RGBA, c.UNSIGNED_BYTE, null))));
                } catch (Zb) {
                  c.texImage2D(c.TEXTURE_2D, 0, da, O, P, 0, ba, ca, null);
                }
                q.isKeepArray || (ya = null);
              } else {
                F = c.getError(), "FUCKING_BIG_ERROR" !== F && (c.texImage2D(c.TEXTURE_2D, 0, da, O, P, 0, ba, ca, null), F = c.getError(), F !== c.NO_ERROR && (c.finish(), oa.Nc("DEBUG in SharedTexture.fill_emptyTexture() - GL.texImage2D params:", {glErr:F, internalFormat:da, pixelFormat:ba, pixelType:ca}), ba = c.RGBA, q.L && ca !== c.FLOAT && (ca = c.FLOAT, c.texImage2D(c.TEXTURE_2D, 0, da, O, P, 0, ba, ca, null))));
              }
            }
          }
          if (q.isMipmap) {
            if (!La && Z) {
              Z.tb(), $a = !0;
            } else {
              if (La) {
                F = Math.log2(Math.min(O, P));
                Sa = Array(1 + F);
                Sa[0] = sa;
                for (z = 1; z <= F; ++z) {
                  var ja = Math.pow(2, z), R = O / ja;
                  ja = P / ja;
                  var Ma = c.createTexture();
                  a(Ma);
                  c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST);
                  c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST);
                  c.texImage2D(c.TEXTURE_2D, 0, da, R, ja, 0, ba, ca, null);
                  a(null);
                  Sa[z] = Ma;
                }
                $a = !0;
              }
            }
          }
          a(null);
          r[t] = -1;
          xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
          ab = !0;
          q.ha && Z && (q.ha(Z), q.ha = null);
        }
      }
      var q = Object.assign({}, N, p), ha = k++;
      null === q.isFlipY && (q.isFlipY = q.url || q.array ? !0 : !1);
      q.data && (q.array = "string" === typeof q.data ? Fb(q.data) : q.isFloat ? new Float32Array(q.data) : new Uint8Array(q.data), q.isFlipY = !1);
      var wa = 0, Ca = q.v ? !0 : !1, ra = null, lb = null, zb = !1, mb = null;
      q.L = q.L || q.isFloat;
      q.L && (wa = 1);
      q.ce || fa.da() || !q.isFloat || !B || fa.ac() || (q.isFloat = !1);
      q.isFloat && (wa = 2);
      q.isAnisotropicFiltering && u && !JEContext.Uf() && (q.isAnisotropicFiltering = !1);
      var sa = c.createTexture(), Ga = null, ya = !1, O = 0, P = 0, ab = !1, yb = !1, bb = !1, za = null, Da = null, nb = null, Ua = null, da = null, ba = null, ca = null, xa = q.isFlipY, Ob = (p = q.L && q.isMipmap) && Ba.ud(), La = p && Ob ? !0 : !1, Sa = null, Za = -1, $a = !1, Na = {Gc:!1, Zb:null, rc:null};
      q.width && (O = q.width, P = q.height ? q.height : O);
      var Z = {get:function() {
        return sa;
      }, F:function() {
        return O;
      }, S:function() {
        return P;
      }, Sf:function() {
        return q.url;
      }, Vf:function() {
        return q.isFloat;
      }, Xf:function() {
        return q.L;
      }, Yf:function() {
        return q.isLinear;
      }, tb:function() {
        c.generateMipmap(c.TEXTURE_2D);
      }, sd:function(z, F) {
        La ? (z || (z = Z.vc()), Z.gb(F), a(Sa[z]), r[F] = -1) : Z.b(F);
      }, vc:function() {
        -1 === Za && (Za = Math.log(O) / Math.log(2));
        return Za;
      }, Ld:function(z) {
        if (La) {
          z || (z = Z.vc());
          y.set("s11");
          Z.gb(0);
          for (var F = O, ja = P, R = 1; R <= z; ++R) {
            F /= 2, ja /= 2, y.Aa("u7", 0.25 / F, 0.25 / ja), c.viewport(0, 0, F, ja), a(Sa[R - 1]), c.framebufferTexture2D(ka.Na(), c.COLOR_ATTACHMENT0, c.TEXTURE_2D, Sa[R], 0), la.g(!1, 1 === R);
          }
          r[0] = -1;
        } else {
          Z.tb();
        }
      }, gb:function(z) {
        z !== t && (c.activeTexture(n[z]), t = z);
      }, b:function(z) {
        if (!ab) {
          return !1;
        }
        Z.gb(z);
        if (r[z] === ha) {
          return !1;
        }
        a(sa);
        r[z] = ha;
        return !0;
      }, Yb:function(z) {
        c.activeTexture(n[z]);
        t = z;
        a(sa);
        r[z] = ha;
      }, l:function() {
        g = Z;
        c.framebufferTexture2D(ka.Na(), c.COLOR_ATTACHMENT0, c.TEXTURE_2D, sa, 0);
      }, R:function() {
        g = Z;
        c.viewport(0, 0, O, P);
        c.framebufferTexture2D(ka.Na(), c.COLOR_ATTACHMENT0, c.TEXTURE_2D, sa, 0);
      }, Sb:D.Sb, resize:function(z, F) {
        O = z;
        P = F;
        K();
      }, clone:function(z) {
        z = D.instance({width:O, height:P, L:q.L, isFloat:q.isFloat, isLinear:q.isLinear, isMirrorY:q.isMirrorY, isFlipY:z ? !xa : xa, isPot:q.isPot});
        va.set("s0");
        ka.Z();
        z.l();
        c.viewport(0, 0, O, P);
        Z.b(0);
        la.g(!0, !0);
        return z;
      }, De:function() {
        c.viewport(0, 0, O, P);
      }, remove:function() {
        c.deleteTexture(sa);
        yb = !0;
        I.splice(I.indexOf(Z), 1);
        Z = null;
      }, refresh:function() {
        Z.Yb(0);
        xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !0);
        Ca ? c.texImage2D(c.TEXTURE_2D, 0, da, ba, c.UNSIGNED_BYTE, q.v) : c.texImage2D(c.TEXTURE_2D, 0, da, O, P, 0, ba, ca, ya);
        xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
      }, ec:function() {
        var z = O * P * 4;
        Da = [new Uint8Array(z), new Uint8Array(z), new Uint8Array(z), new Uint8Array(z)];
        za = [new Float32Array(Da[0].buffer), new Float32Array(Da[1].buffer), new Float32Array(Da[2].buffer), new Float32Array(Da[3].buffer)];
        nb = new Uint8Array(4 * z);
        Ua = new Float32Array(nb.buffer);
        bb = !0;
      }, Xc:function() {
        bb || Z.ec();
        c.readPixels(0, 0, O, 4 * P, c.RGBA, c.UNSIGNED_BYTE, nb);
        for (var z = O * P, F = 2 * z, ja = 3 * z, R = 0; R < z; ++R) {
          za[0][R] = Ua[R], za[1][R] = Ua[R + z], za[2][R] = Ua[R + F], za[3][R] = Ua[R + ja];
        }
        return za;
      }, ue:function() {
        Na.Gc || (Na.Zb = new Uint8Array(O * P * 4), Na.rc = new Float32Array(Na.buffer), Na.Gc = !0);
        c.readPixels(0, 0, O, P, c.RGBA, c.UNSIGNED_BYTE, Na.Zb);
        return Na.rc;
      }, fc:function(z) {
        ka.J();
        y.set("s12");
        Z.b(0);
        if (z) {
          c.viewport(0, 0, O, P), y.Nb("u8", 0.25, 0.25, 0.25, 0.25), la.g(!1, !0);
        } else {
          for (z = 0; 4 > z; ++z) {
            c.viewport(0, P * z, O, P), y.Nb("u8", v[z]), la.g(!1, 0 === z);
          }
        }
      }, Ne:function(z) {
        var F = ca === w[0] && !m();
        a(sa);
        xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !0);
        F ? (zb || (ra = document.createElement("canvas"), ra.width = O, ra.height = P, lb = ra.getContext("2d"), mb = lb.createImageData(O, P), zb = !0), mb.data.set(z), lb.putImageData(mb, 0, 0), c.texImage2D(c.TEXTURE_2D, 0, da, ba, ca, ra)) : c.texImage2D(c.TEXTURE_2D, 0, da, O, P, 0, ba, ca, z);
        r[t] = ha;
        xa && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
      }, ug:function(z, F) {
        a(sa);
        F && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !0);
        c.texImage2D(c.TEXTURE_2D, 0, da, ba, ca, z);
        r[t] = ha;
        F && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
      }, jg:function(z, F) {
        var ja = O * P, R = 4 * ja;
        z = q.L ? z ? "RGBE" : "JSON" : "RGBA";
        F && (z = F);
        F = fa.da() && !1;
        var Ma = null;
        switch(z) {
          case "RGBE":
            Ma = "s42";
            break;
          case "JSON":
            Ma = F ? "s0" : "s12";
            break;
          case "RGBA":
          case "RGBAARRAY":
            Ma = "s6";
        }
        bb || ("RGBA" === z || "RGBE" === z || "RGBAARRAY" === z ? (Da = new Uint8Array(R), bb = !0) : "JSON" !== z || F || Z.ec());
        ka.J();
        y.set(Ma);
        Z.b(0);
        R = null;
        if ("RGBA" === z || "RGBE" === z || "RGBAARRAY" === z) {
          c.viewport(0, 0, O, P);
          la.g(!0, !0);
          c.readPixels(0, 0, O, P, c.RGBA, c.UNSIGNED_BYTE, Da);
          if ("RGBAARRAY" === z) {
            return {data:Da};
          }
          A || (E = document.createElement("canvas"), J = E.getContext("2d"), A = !0);
          E.width = O;
          E.height = P;
          ja = J.createImageData(O, P);
          ja.data.set(Da);
          J.putImageData(ja, 0, 0);
          R = E.toDataURL("image/png");
        } else {
          if ("JSON" === z) {
            if (F) {
              R = new Float32Array(ja), c.viewport(0, 0, O, P), la.g(!0, !0), c.readPixels(0, 0, O, P, c.RGBA, c.FLOAT, R);
            } else {
              for (R = 0; 4 > R; ++R) {
                c.viewport(0, P * R, O, P), y.Nb("u8", v[R]), la.g(!R, !R);
              }
              Z.Xc();
              R = Array(ja);
              for (F = 0; F < ja; ++F) {
                R[4 * F] = za[0][F], R[4 * F + 1] = za[1][F], R[4 * F + 2] = za[2][F], R[4 * F + 3] = za[3][F];
              }
            }
          }
        }
        return {format:z, data:R, width:O, height:P, isMirrorY:q.isMirrorY, isFlipY:"RGBA" === z ? q.isFlipY : !q.isFlipY};
      }};
      q.isMipmap && !La && ab && !$a && (Z.tb(), $a = !0);
      if (q.url) {
        a(sa), c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, 1, 1, 0, c.RGBA, c.UNSIGNED_BYTE, null), Ga = new Image, Ga.cf = "Anonymous", Ga.crossOrigin = "Anonymous", Ga.src = q.url, Ga.onload = function() {
          O = Ga.width;
          P = Ga.height;
          K();
        };
      } else {
        if (q.v) {
          var Ab = function() {
            O = void 0 !== q.v.videoWidth ? q.v.videoWidth : q.v.width;
            P = void 0 !== q.v.videoHeight ? q.v.videoHeight : q.v.height;
            O ? K() : (console.log("WARNING in SharedTexture - instance(): DOM element provided but width is invalid. retry loading later..."), setTimeout(Ab, 1));
          };
          Ab();
        } else {
          q.array ? (q.L && !q.isFloat ? q.array instanceof Uint16Array ? (ya = q.array, K()) : e() ? (ya = d(q.array), K()) : (K(), D.qc(c, sa, Z.F(), Z.S(), q.array, xa, !0)) : (ya = q.isFloat ? q.array instanceof Float32Array ? q.array : new Float32Array(q.array) : q.array instanceof Uint8Array ? q.array : new Uint8Array(q.array), K()), q.isKeepArray || (ya && ya !== q.array && (ya = null), delete q.array)) : K();
        }
      }
      Z.Of = Z.F;
      q.ha && ab && (q.ha(Z), q.ha = null);
      I.push(Z);
      return Z;
    }, J:function(p) {
      p !== t && (c.activeTexture(n[p]), t = p);
      r[p] = -1;
      a(null);
    }, Ue:function(p) {
      h.random.b(p);
    }, Sb:function() {
      g = null;
      c.framebufferTexture2D(ka.Na(), c.COLOR_ATTACHMENT0, c.TEXTURE_2D, null, 0);
    }, reset:function() {
      for (var p = 0; p < n.length; ++p) {
        r[p] = -1;
      }
      t = -1;
    }, hg:function() {
      t = -1;
    }, Ke:function() {
      for (var p = 0; p < n.length; ++p) {
        D.J(p);
      }
    }, sc:function() {
      h && (h.random.remove(), h.gd.remove());
    }, tg:function(p, M) {
      if ("RGBA" === p.format || "RGBE" === p.format) {
        var K = new Image;
        K.src = p.data;
        K.onload = function() {
          D.instance({isMirrorY:p.isMirrorY, isFlipY:p.isFlipY, isFloat:!1, v:K, ha:function(q) {
            if ("RGBA" === p.format) {
              M(q);
            } else {
              var ha = p.width, wa = p.height, Ca = D.instance({isMirrorY:p.isMirrorY, isFloat:!0, width:ha, height:wa, isFlipY:p.isFlipY});
              ka.Z();
              c.viewport(0, 0, ha, wa);
              y.set("s43");
              Ca.l();
              q.b(0);
              la.g(!0, !0);
              D.J(0);
              M(Ca);
              c.flush();
              setTimeout(q.remove, 50);
            }
          }});
        };
      } else {
        "JSON" === p.format ? M(D.instance({isFloat:!0, isFlipY:p.isFlipY, width:p.width, height:p.height, array:new Float32Array(p.data)})) : (console.log("ERROR in SharedTexture.unserialize(): incorrect serialized texture format"), M(!1));
      }
    }, h:function() {
      g && (ta.Z(), D.Sb(), ta.J());
      D.Ke();
      I.slice(0).forEach(function(p) {
        p.remove();
      });
      I.splice(0);
      H = !1;
      k = 0;
      "undefined" !== typeof Ba && Ba.h();
    }};
    return D;
  }(), Hb = function() {
    return {instance:function(a) {
      var b = [Ea.instance(a), Ea.instance(a)], d = [b[1], b[0]], e = d, m = {Ae:function(f) {
        e[1].l();
        e[0].b(f);
        m.dd();
      }, kg:function(f) {
        e[1].R();
        e[0].b(f);
        m.dd();
      }, dd:function() {
        e = e === b ? d : b;
      }, refresh:function() {
        e[0].refresh();
        e[1].refresh();
      }, b:function(f) {
        e[0].b(f);
      }, Te:function(f) {
        e[1].b(f);
      }, Jf:function() {
        return e[0];
      }, remove:function() {
        e[0].remove();
        e[1].remove();
        e = null;
      }};
      return m;
    }};
  }(), la = function() {
    function a(k) {
      var r = {Y:null, G:null};
      r.Y = k.createBuffer();
      k.bindBuffer(k.ARRAY_BUFFER, r.Y);
      k.bufferData(k.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), k.STATIC_DRAW);
      r.G = k.createBuffer();
      k.bindBuffer(k.ELEMENT_ARRAY_BUFFER, r.G);
      k.bufferData(k.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2]), k.STATIC_DRAW);
      return r;
    }
    var b = null, d = 0, e = !1, m = [], f = -2, t = -2, n = {reset:function() {
      t = f = -2;
    }, m:function() {
      e || (console.log("INFO in SharedVBO : init()"), b = a(c), n.sa(), e = !0);
    }, instance:function(k) {
      var r = d++, h = k.G ? k.G.length : 0, g = "undefined" === typeof k.mode ? c.STATIC_DRAW : k.mode, w = c.createBuffer();
      c.bindBuffer(c.ARRAY_BUFFER, w);
      c.bufferData(c.ARRAY_BUFFER, k.Y instanceof Float32Array ? k.Y : new Float32Array(k.Y), g);
      f = r;
      var l = null, C = null, H = null;
      if (k.G) {
        l = c.createBuffer();
        c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, l);
        var I = null;
        65536 > k.G.length ? (I = Uint16Array, C = c.UNSIGNED_SHORT, H = 2) : (I = Uint32Array, C = c.UNSIGNED_INT, H = 4);
        I = k.G instanceof I ? k.G : new I(k.G);
        c.bufferData(c.ELEMENT_ARRAY_BUFFER, I, g);
        t = r;
      }
      var N = {td:function(A) {
        f !== r && (c.bindBuffer(c.ARRAY_BUFFER, w), f = r);
        A && va.Ob();
      }, qd:function() {
        t !== r && (c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, l), t = r);
      }, bind:function(A) {
        N.td(A);
        N.qd();
      }, ef:function() {
        c.drawElements(c.TRIANGLES, h, C, 0);
        oa.wd() && console.log("ERROR in SharedVBO.draw(): No VBO bound to enabled attributes");
      }, ff:function(A, E) {
        c.drawElements(c.TRIANGLES, A, C, E * H);
      }, remove:function() {
        c.deleteBuffer(w);
        k.G && c.deleteBuffer(l);
        N = null;
      }};
      m.push(N);
      return N;
    }, sa:function() {
      -1 !== f && (c.bindBuffer(c.ARRAY_BUFFER, b.Y), f = -1);
      -1 !== t && (c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, b.G), t = -1);
    }, g:function(k, r) {
      k && la.sa();
      r && va.ma();
      c.drawElements(c.TRIANGLES, 3, c.UNSIGNED_SHORT, 0);
    }, Ka:function(k) {
      k = k || c;
      var r = a(k);
      k.bindBuffer(k.ARRAY_BUFFER, r.Y);
      k.bindBuffer(k.ELEMENT_ARRAY_BUFFER, r.G);
      va.bb(k);
      k.drawElements(k.TRIANGLES, 3, k.UNSIGNED_SHORT, 0);
      k.deleteBuffer(r.Y);
      k.deleteBuffer(r.G);
      n.reset();
      e && (n.sa(), va.ma());
    }, sc:function() {
      var k = c, r = b;
      k.deleteBuffer(r.Y);
      k.deleteBuffer(r.G);
    }, h:function() {
      n.sc();
      m.forEach(function(k) {
        k.remove();
      });
      c.bindBuffer(c.ARRAY_BUFFER, null);
      c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, null);
      n.reset();
      e = !1;
      m.splice(0);
      d = 0;
    }};
    return n;
  }(), ka = function() {
    var a = null, b = null, d = null, e = !1, m = [], f = {A:-2, pc:1}, t = {Qa:function() {
      return e;
    }, m:function() {
      if (!e) {
        a = c.createFramebuffer();
        var n = fa.da();
        b = n && c.DRAW_FRAMEBUFFER ? c.DRAW_FRAMEBUFFER : c.FRAMEBUFFER;
        d = n && c.READ_FRAMEBUFFER ? c.READ_FRAMEBUFFER : c.FRAMEBUFFER;
        e = !0;
      }
    }, Gf:function() {
      return b;
    }, Sd:function() {
      return d;
    }, Na:function() {
      return c.FRAMEBUFFER;
    }, Nf:function() {
      return f;
    }, yf:function() {
      return a;
    }, instance:function(n) {
      void 0 === n.Bc && (n.Bc = !1);
      var k = n.ea ? n.ea : null, r = n.width, h = void 0 !== n.height ? n.height : n.width, g = a, w = null, l = !1, C = !1, H = 0;
      k && (r = r ? r : k.F(), h = h ? h : k.S());
      var I = {$c:function() {
        l || (g = c.createFramebuffer(), l = !0, H = f.pc++);
      }, jd:function() {
        I.$c();
        I.l();
        w = c.createRenderbuffer();
        c.bindRenderbuffer(c.RENDERBUFFER, w);
        c.renderbufferStorage(c.RENDERBUFFER, c.DEPTH_COMPONENT16, r, h);
        c.framebufferRenderbuffer(b, c.DEPTH_ATTACHMENT, c.RENDERBUFFER, w);
        c.clearDepth(1.0);
      }, bind:function(N, A) {
        H !== f.A && (c.bindFramebuffer(b, g), f.A = H);
        k && k.l();
        A && c.viewport(0, 0, r, h);
        N && c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
      }, Se:function() {
        H !== f.A && (c.bindFramebuffer(b, g), f.A = H);
      }, clear:function() {
        c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
      }, $e:function() {
        c.clear(c.COLOR_BUFFER_BIT);
      }, af:function() {
        c.clear(c.DEPTH_BUFFER_BIT);
      }, De:function() {
        c.viewport(0, 0, r, h);
      }, l:function() {
        H !== f.A && (c.bindFramebuffer(b, g), f.A = H);
      }, rtt:function(N) {
        k = N;
        f.A !== H && (c.bindFramebuffer(c.FRAMEBUFFER, g), f.A = H);
        N.l();
      }, J:function() {
        c.bindFramebuffer(b, null);
        f.A = -1;
      }, resize:function(N, A) {
        r = N;
        h = A;
        w && (c.bindRenderbuffer(c.RENDERBUFFER, w), c.renderbufferStorage(c.RENDERBUFFER, c.DEPTH_COMPONENT16, r, h));
      }, remove:function() {
        g === a || C || (c.bindFramebuffer(b, g), c.framebufferTexture2D(b, c.COLOR_ATTACHMENT0, c.TEXTURE_2D, null, 0), w && c.framebufferRenderbuffer(b, c.DEPTH_ATTACHMENT, c.RENDERBUFFER, null), c.bindFramebuffer(b, null), c.deleteFramebuffer(g), w && c.deleteRenderbuffer(w));
        C = !0;
      }};
      n.Bc && I.jd();
      m.push(I);
      return I;
    }, J:function() {
      c.bindFramebuffer(b, null);
      f.A = -1;
    }, Le:function() {
      c.bindFramebuffer(b, null);
      c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
      c.viewport(0, 0, fa.F(), fa.S());
      f.A = -1;
    }, reset:function() {
      f.A = -2;
    }, Z:function() {
      0 !== f.A && (c.bindFramebuffer(b, a), f.A = 0);
    }, clear:function() {
      c.viewport(0, 0, fa.F(), fa.S());
      c.clear(c.COLOR_BUFFER_BIT);
    }, h:function() {
      t.J();
      m.forEach(function(n) {
        n.remove();
      });
      c.deleteFramebuffer(a);
      t.reset();
      e = !1;
      m.splice(0);
      f.A = -2;
      f.pc = 1;
    }};
    return t;
  }(), fa = function() {
    function a() {
      d = "undefined" === typeof Ra ? JEContext : Ra;
      e = !0;
    }
    function b(h, g) {
      for (var w = 0; w < h.length; ++w) {
        var l = g.getExtension(h[w]);
        if (l) {
          return l;
        }
      }
      return null;
    }
    var d = null, e = !1, m = {Dc:!1, Pb:null, Qb:null, Hc:!1, fe:!1, Rb:null, Ic:!1, eb:null, Ec:!1, hb:null, ae:!1, ib:null, be:!1}, f = null, t = {ba:!0, ca:!0, sb:!0}, n = null, k = "undefined" === typeof window ? {} : window, r = {m:function() {
      if (e) {
        return !0;
      }
      f = Object.assign({}, m);
      n = Object.assign({}, t);
      e || a();
      var h = c;
      if (!f.Dc) {
        console.log("INFO in SharedContext: enable_floatExtensions()");
        f.Pb = r.lc(h);
        k.GL_EXT_FLOAT = f.Pb;
        f.Hc = f.Pb ? !0 : !1;
        if (f.Hc || r.da()) {
          f.Qb = r.mc(h), f.fe = f.Qb ? !0 : !1, k.GL_EXT_FLOATLINEAR = f.Qb;
        }
        f.Dc = !0;
      }
      if (!f.Ec) {
        console.log("INFO in SharedContext: enable_halfFloatExtensions()");
        f.Rb = r.Ja(h);
        f.Rb ? (f.Ic = !0, k.GL_EXT_HALFFLOAT = f.Rb) : console.log("WARNING in SharedContext.enable_halfFloatExtensions(): OES_texture_half_float not found");
        if (f.Ic || r.da()) {
          f.eb = r.nc(h), k.GL_EXT_HALFFLOATLINEAR = f.eb;
        }
        f.eb || console.log("WARNING in SharedContext.enable_halfFloatExtensions(): OES_texture_half_float_linear not found");
        f.Tf = f.eb ? !0 : !1;
        f.Ec = !0;
      }
      f.hb = r.jc(h);
      f.ae = f.hb ? !0 : !1;
      k.GL_EXT_COLORBUFFERFLOAT = f.hb;
      f.ib = r.kc(h);
      f.be = f.ib ? !0 : !1;
      k.GL_EXT_COLORBUFFERHALFFLOAT = f.ib;
      ka.m();
      Ea.m();
      if (!r.Ed()) {
        return !1;
      }
      la.m();
      Ea.$d();
      return !0;
    }, F:function() {
      e || a();
      return d.F();
    }, S:function() {
      e || a();
      return d.S();
    }, da:function() {
      e || a();
      return d.da();
    }, ic:function(h) {
      r.jc(h);
      r.kc(h);
      r.lc(h);
      r.mc(h);
      r.Ja(h);
      r.nc(h);
    }, jc:b.bind(null, ["EXT_color_buffer_float", "WEBGL_color_buffer_float", "OES_color_buffer_float"]), kc:b.bind(null, ["EXT_color_buffer_half_float", "WEBGL_color_buffer_half_float", "OES_color_buffer_half_float"]), lc:b.bind(null, ["OES_texture_float", "MOZ_OES_texture_float", "WEBKIT_OES_texture_float"]), mc:b.bind(null, ["OES_texture_float_linear", "MOZ_OES_texture_float_linear", "WEBKIT_OES_texture_float_linear"]), Ja:b.bind(null, ["OES_texture_half_float", "MOZ_OES_texture_half_float", "WEBKIT_OES_texture_half_float"]), 
    nc:b.bind(null, ["OES_texture_half_float_linear", "MOZ_OES_texture_half_float_linear", "WEBKIT_OES_texture_half_float_linear"]), ub:function(h) {
      var g = r.Ja(h);
      return g && g.HALF_FLOAT_OES ? g.HALF_FLOAT_OES : h.HALF_FLOAT || h.FLOAT;
    }, Od:function() {
      return n;
    }, ac:function() {
      return n.ba;
    }, We:function() {
      return n.ca;
    }, Ve:function() {
      return n.sb;
    }, cb:function(h, g, w) {
      function l() {
        h.bindTexture(h.TEXTURE_2D, null);
        h.bindFramebuffer(C, null);
        h.deleteTexture(N);
        h.deleteFramebuffer(I);
      }
      var C = h.FRAMEBUFFER, H = h.NEAREST;
      console.log("INFO in SharedContext.test_RTT(): test RTT with glInternalPixelFormat = " + oa.K(g, h) + ", glPixelType = " + oa.K(w, h));
      var I = h.createFramebuffer();
      h.bindFramebuffer(C, I);
      var N = h.createTexture();
      h.bindTexture(h.TEXTURE_2D, N);
      h.pixelStorei(h.UNPACK_FLIP_Y_WEBGL, !1);
      h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, H);
      h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, H);
      h.texImage2D(h.TEXTURE_2D, 0, g, 1, 1, 0, h.RGBA, w, null);
      h.framebufferTexture2D(h.FRAMEBUFFER, h.COLOR_ATTACHMENT0, h.TEXTURE_2D, N, 0);
      g = h.checkFramebufferStatus(h.READ_FRAMEBUFFER || h.FRAMEBUFFER);
      if (g !== h.FRAMEBUFFER_COMPLETE) {
        return oa.Mc("WARNING in SharedContext.test_RTT(): cannot do RTT. glStatus =", g, h), l(), !1;
      }
      va.Mb(h);
      h.clearColor(0, 0, 0, 0);
      h.viewport(0, 0, 1, 1);
      h.disable(h.DEPTH_TEST);
      h.clear(h.COLOR_BUFFER_BIT);
      la.Ka(h);
      h.bindFramebuffer(C, null);
      va.ab(h);
      h.activeTexture(h.TEXTURE0);
      h.bindTexture(h.TEXTURE_2D, N);
      la.Ka(h);
      g = new Uint8Array(4);
      h.readPixels(0, 0, 1, 1, h.RGBA, h.UNSIGNED_BYTE, g);
      l();
      if (3 < Math.abs(g[0] - 127)) {
        return console.log("WARNING in SharedContext.test_RTT(): readBufferPixel = ", g.toString(), "(should be [127,127,127,127])"), !1;
      }
      console.log("  RTT success!");
      return !0;
    }, kb:function(h) {
      console.log("============ BEGIN SharedContext determine_floatRTTCapability() ============");
      var g = {ba:!1, ca:!1};
      h.disable(h.BLEND);
      h.clearColor(0, 0, 0, 0);
      h.clear(h.COLOR_BUFFER_BIT);
      h.RGBA32F && r.cb(h, h.RGBA32F, h.FLOAT) && (g.ba = !0);
      !g.ba && r.cb(h, h.RGBA, h.FLOAT) && (g.ba = !0);
      var w = r.ub(h);
      h.RGBA16F && r.cb(h, h.RGBA16F, w) && (g.ca = !0);
      !g.ca && r.cb(h, h.RGBA, w) && (g.ca = !0);
      console.log("============ END SharedContext determine_floatRTTCapability() ============");
      return g;
    }, Fd:function() {
      var h = ka.instance({width:1});
      h.$c();
      var g = Ea.instance({width:1, isFloat:!0, Ua:3});
      h.l();
      g.l();
      c.flush();
      c.checkFramebufferStatus(ka.Sd()) !== c.FRAMEBUFFER_COMPLETE ? (console.log("INFO in SharedContext - determine_floatRTT4ChannelsCapability(): cannot do RTT in 3 channels RGB texture."), Ea.ye(), n.sb = !1) : n.sb = !0;
      h.remove();
      g.remove();
    }, Ed:function() {
      var h = r.kb(c);
      Object.assign(n, h);
      if (!n.ba && !n.ca) {
        return console.log("ERROR in SharedContext - determine_capabilities(): cannot do RTT on float and half float textures"), !1;
      }
      r.Fd();
      return !0;
    }, h:function() {
      Ea.h();
      va.h();
      ka.h();
      la.h();
      e = !1;
    }};
    return r;
  }(), oa = function() {
    var a = {Ud:function(b) {
      b = Object.prototype.toString.call(b);
      b = b.replace("[object ", "[");
      b = b.replace("[", "");
      return b = b.replace("]", "");
    }, K:function(b, d) {
      if (!b) {
        return b;
      }
      d = d || c;
      var e = null, m;
      for (m in d) {
        if (d[m] === b) {
          e = m;
          break;
        }
      }
      return e ? "gl." + e : "[GL.KEYNOTFOUND for " + b.toString() + "]";
    }, Nc:function(b, d, e) {
      e = e || c;
      var m = [], f;
      for (f in d) {
        m.push("    " + f + ": " + a.K(d[f], e));
      }
      console.log(b + "\n" + m.join("\n"));
    }, bg:function(b) {
      var d = c.checkFramebufferStatus(c.FRAMEBUFFER);
      a.Mc(b, d);
    }, Mc:function(b, d, e) {
      console.log(b, a.K(d, e));
    }, wd:function(b) {
      return (glErr = c.getError()) ? (console.log(b, "GL ERROR = " + a.K(glErr)), !0) : !1;
    }};
    return a;
  }(), S = la, ta = ka, X = Ea, Ba = function() {
    function a(A, E, J, v) {
      var u = oa.Ud(J);
      console.log("INFO in TextureFilteringTester.test_mipmapping(): internalPixelFormat =", oa.K(A, l), "dataType =", u, "pixelType =", oa.K(E, l), "isMipmap =", v);
      l.texParameteri(l.TEXTURE_2D, l.TEXTURE_MIN_FILTER, v ? l.NEAREST_MIPMAP_NEAREST : l.LINEAR);
      var B = null;
      if (null !== J) {
        try {
          B = l.getError();
          if ("FUCKING_BIG_ERROR" === B) {
            return !1;
          }
          l.texImage2D(l.TEXTURE_2D, 0, A, 2, 2, 0, l.RGBA, E, J);
          B = l.getError();
          if (B !== l.NO_ERROR) {
            return console.log("WARNING in TextureFilteringTester.test_mipmapping() - cannot run _gl.texImage2D: glErr =", oa.K(B, l), "dataType =", u, "pixelType =", oa.K(E, l)), !1;
          }
        } catch (U) {
          return console.log("WARNING in TextureFilteringTester.test_mipmapping(): an exception was thrown. err=", U.message), !1;
        }
      }
      v && l.generateMipmap(l.TEXTURE_2D);
      l.clear(l.COLOR_BUFFER_BIT);
      S.Ka(l);
      B = l.getError();
      if ("FUCKING_BIG_ERROR" === B) {
        return !1;
      }
      l.readPixels(0, 0, 1, 1, l.RGBA, l.UNSIGNED_BYTE, h);
      B = l.getError();
      B === l.INVALID_OPERATION && "undefined" !== typeof l.PIXEL_PACK_BUFFER && (console.log("WARNING in TextureFilteringTester.test_mipmapping(): retry readPixels without PIXEL_PACK_BUFFER"), l.bindBuffer(l.PIXEL_PACK_BUFFER, null), l.readPixels(0, 0, 1, 1, l.RGBA, l.UNSIGNED_BYTE, h), B = l.getError());
      if (B !== l.NO_ERROR) {
        return console.log("ERROR in TextureFilteringTester.test_mipmapping(): cannot run _gl.readPixels. glErr = ", oa.K(B, l)), console.log("  values: internalPixelFormat =", oa.K(A, l), "pixelType =", oa.K(E, l)), !1;
      }
      (J = 0 !== h[0]) ? console.log("INFO in TextureFilteringTester.test_mipmapping(): success!") : console.log("INFO in TextureFilteringTester.test_mipmapping(): fail - read color is 0");
      J && (k.Vc = E, k.Ac = A);
      return J;
    }
    function b(A, E) {
      if (!C.ba) {
        return console.log("WARNING in TextureFilteringTester: level = RGBAFloat32 - cannot RTT"), !1;
      }
      if (a(A, l.FLOAT, new Float32Array(w), E)) {
        return console.log("INFO in TextureFilteringTester: level = RGBAFloat32"), n = t.Vb, !0;
      }
      console.log("WARNING in TextureFilteringTester: cannot use RGBAFloat32 level with isMipmap=", E);
      return !1;
    }
    function d(A, E, J) {
      if (!C.ca) {
        return console.log("WARNING in TextureFilteringTester: level = RGBAFloat16 - case 0 - cannot RTT"), !1;
      }
      var v = fa.Ja(l);
      if (v && v.HALF_FLOAT_OES && a(A, v.HALF_FLOAT_OES, new Uint16Array(w), E)) {
        return console.log("INFO in TextureFilteringTester: level = RGBAFloat16 - case 1 . isMipmap =", E), n = t.pa, !0;
      }
      if (l.HALF_FLOAT && a(A, l.HALF_FLOAT, new Uint16Array(w), E)) {
        return console.log("INFO in TextureFilteringTester: level = RGBAFloat16 - case 2 . isMipmap =", E), n = t.pa, !0;
      }
      if (a(A, l.FLOAT, new Float32Array(w), E)) {
        return console.log("INFO in TextureFilteringTester: level = RGBAFloat16 - case 3 . isMipmap =", E), n = t.pa, !0;
      }
      l.bindTexture(l.TEXTURE_2D, J);
      l.texImage2D(l.TEXTURE_2D, 0, l.RGBA, 1, 1, 0, l.RGBA, l.UNSIGNED_BYTE, null);
      l.bindFramebuffer(k.Ha, N);
      Ea.qc(l, J, 1, 1, new Float32Array(w), !1, !1);
      l.bindFramebuffer(k.Ha, null);
      l.bindTexture(l.TEXTURE_2D, J);
      if (a(A, null, null, E)) {
        return console.log("INFO in TextureFilteringTester: level = RGBAFloat16 - case 4 . isMipmap =", E), n = t.pa, !0;
      }
      console.log("WARNING in TextureFilteringTester: cannot use RGBAFloat16 at all with isMipmap=", E);
      return !1;
    }
    function e(A, E, J) {
      r = !0;
      if (d(A, !0, J) || b(E, !0)) {
        return !0;
      }
      r = !1;
      return d(A, !1, J) || b(E, !1) ? !0 : !1;
    }
    function m(A) {
      if (n === t.M) {
        l = A || c;
        n = t.RGBA8;
        r = !0;
        console.log("============= BEGIN TextureFilteringTester init() ============");
        fa.ic(l);
        C || (C = fa.kb(l));
        ta.reset();
        N = l.createFramebuffer();
        k.Ha = l.DRAW_FRAMEBUFFER || l.FRAMEBUFFER;
        l.bindFramebuffer(k.Ha, null);
        l.clearColor(0, 0, 0, 0);
        l.viewport(0, 0, 1, 1);
        y.M();
        H = y.ab(l);
        A = l.createTexture();
        l.activeTexture(l.TEXTURE0);
        l.bindTexture(l.TEXTURE_2D, A);
        l.texParameteri(l.TEXTURE_2D, l.TEXTURE_WRAP_S, l.REPEAT);
        l.texParameteri(l.TEXTURE_2D, l.TEXTURE_WRAP_T, l.REPEAT);
        l.texParameteri(l.TEXTURE_2D, l.TEXTURE_MAG_FILTER, l.NEAREST);
        I = A;
        var E = A = l.RGBA, J = l.RGBA16F, v = l.RGBA32F;
        v && (A = v);
        J && (E = J);
        if ((J || v) && e(E, A, I)) {
          return f(), !0;
        }
        A = E = l.RGBA;
        if (e(E, A, I)) {
          return f(), !0;
        }
        console.log("ERROR in TextureFilteringTester: level = RGBA8");
        n = t.RGBA8;
        f();
        return !1;
      }
    }
    function f() {
      l.deleteProgram(H.ia);
      l.deleteTexture(I);
      I = H = null;
      console.log("============= END TextureFilteringTester init() ============");
    }
    var t = {M:-1, Vb:3, pa:2, RGBA8:0}, n = t.M, k = {Vc:null, Ac:null, Ha:null}, r = !0, h = new Uint8Array(4), g = [0.8, 1, 0.8, 1], w = g.concat(g, g, g), l = null, C = null, H = null, I = null, N = null;
    return {ud:function(A) {
      m(A);
      return r;
    }, $b:function(A, E) {
      n === t.M && (typeof("undefined" !== E) && (C = E), m(A));
      return n !== t.RGBA8;
    }, Wf:function(A) {
      m(A);
      return n === t.Vb;
    }, he:function(A) {
      m(A);
      return n === t.pa;
    }, Hf:function(A) {
      m(A);
      return k.Vc;
    }, Rd:function(A) {
      m(A);
      return k.Ac;
    }, h:function() {
      l = null;
      r = !0;
      n = t.M;
      C = null;
    }};
  }(), Pb = function() {
    return {instance:function(a) {
      var b = X.instance(a.alpha), d = X.instance(a.beta);
      return {Hd:function() {
        b.b(1);
        d.b(2);
      }};
    }};
  }(), Db = function() {
    return {instance:function(a) {
      var b = null, d = !1, e = !1, m = null, f = !1, t = !1, n = null, k = "undefined" === typeof a.preprocessing ? !1 : a.preprocessing, r = "undefined" === typeof a.preprocessingSize ? a.size : a.preprocessingSize;
      a.mask && (d = !0, Y && void 0 !== Y.pd && (a.mask = Y.pd + a.mask), b = X.instance({isFloat:!1, url:a.mask}));
      var h = !1;
      a.customInputShader && (h = "s44", y.Wb({name:"CUSTOM PREPROCESS", id:h, a:a.customInputShader, sg:["uSource"], precision:"lowp"}), y.O(h, [{type:"1i", name:"uSource", value:0}]));
      switch(k) {
        case "sobel":
          n = "s31";
          f = !0;
          break;
        case "meanNormalization":
          n = "s32";
          f = !0;
          break;
        case "grayScale":
          n = "s28";
          f = !1;
          break;
        case "grayScaleTilt":
          n = "s29";
          t = !0;
          f = !1;
          break;
        case "rgbGrayTilt":
          n = "s30";
          t = !0;
          f = !1;
          break;
        case "copy":
          n = h ? h : "s0";
          break;
        case "inputLightRegulation":
          n = h ? h : "s28";
          m = Qb.instance({zc:r, Uc:a.size, Qc:a.nBlurPass, ge:!1});
          e = !0;
          break;
        case "direct":
        case "none":
          n = !1;
          break;
        default:
          n = "s3";
      }
      t && y.O(n, [{name:"u26", type:"1f", value:a.tilt}]);
      d && (n += "Mask");
      var g = X.instance({isFloat:!1, isPot:!1, width:a.size}), w = {F:function() {
        return r;
      }, vb:function() {
        return w.F();
      }, Wd:function() {
        return e ? m.wc() : g;
      }, N:function() {
        ta.Z();
        n && (y.set(n), f && y.C("u27", 1 / a.size), g.R(), d && b.b(1), S.g(!1, !1), g.b(0), e && m.process(g));
      }, h:function() {
        g.remove();
        d && b.remove();
      }};
      return w;
    }};
  }(), Eb = function() {
    return {instance:function(a) {
      console.log("INFO in NeuronLayerFeedForward - instance: spec =", a);
      "undefined" === typeof a.normalize && (a.normalize = !1);
      var b = {input:null, Ea:null, yb:null, V:null, Wa:null, Gb:null, Hb:null}, d = null, e = [], m = [], f = !1, t = null, n = !0, k = -1, r = a.isReorganize ? a.isReorganize : !1, h = a.kernelsCount ? !0 : !1, g = a.dynPelu ? Pb.instance(a.dynPelu) : !1, w = g ? !0 : !1, l = {isEnabled:!1};
      a.ee ? (a.sparsity = "undefined" !== typeof a.sparsity ? a.sparsity : a.Ya.vb(), n = !1) : "full" === a.connectivityUp && (a.sparsity = a.Ya.vb());
      var C = {elu:"s15", elu01:"s16", relu:"s14", arctan:"s18", sigmoid:"s13", copy:"s0", softplus:"s19", dynPelu:"s17"}[a.activation], H = a.sparsity * a.sparsity, I = !1, N = a.size, A = "";
      if (a.maxPooling) {
        switch(a.maxPooling.size) {
          case 2:
            A = "s33";
            break;
          case 4:
            A = "s34";
        }
        I = !0;
        N /= a.maxPooling.size;
        b.Gb = X.instance({isFloat:!0, isPot:!1, width:N});
      }
      var E = void 0 !== a.pe && a.pe ? !0 : !1, J = null, v = null, u = null;
      if (E) {
        J = "s45" + a.index.toString();
        y.yc("s45", J, [((a.normalization.n - 1) / 2).toFixed(1)]);
        y.O(J, [{type:"1i", name:"u1", value:0}, {type:"2f", name:"u7", value:[1 / a.size, 1 / a.size]}, {type:"1f", name:"u6", value:a.normalization.alpha}, {type:"1f", name:"u9", value:a.normalization.beta}, {type:"1f", name:"u31", value:a.normalization.k}, ]);
        var B = {isFloat:!0, isPot:!0, width:a.size};
        v = X.instance(B);
        u = X.instance(B);
      }
      var U = -1, Q = null;
      n && (b.V = X.instance({isFloat:!0, isPot:!1, width:a.size}));
      b.Ea = X.instance(a.bias);
      var aa = {F:function() {
        return a.size;
      }, vb:function() {
        return N;
      }, tc:function() {
        return a.classesCount;
      }, rd:function(D) {
        d.b(D);
      }, se:function() {
        a.remap && a.remap.isEnabled && (l = {isEnabled:!0, ke:X.instance({isFloat:!1, isFlipY:!1, array:new Uint8Array(a.remap.maskTexture.data), width:a.remap.maskTexture.width, isPot:!1}), Ra:a.remap.layers.map(function(D) {
          return a.parent.Vd(D);
        }), depth:a.remap.depth});
      }, ze:function() {
        switch(a.connectivityUp) {
          case "direct":
            Q = Rb.instance(a.connectivity);
            break;
          case "square":
            Q = Sb.instance(a.connectivity);
            break;
          case "squareFast":
            Q = Tb.instance(a.connectivity, a.activation);
            break;
          case "full":
            Q = Ub.instance(a.connectivity);
            break;
          case "conv":
            k = a.kernelsCount, Q = Vb.instance(a.connectivity), r && (b.Wa = X.instance({width:N, isFloat:!0, isFlipY:!1, isPot:!1}));
        }
        if (Q.na) {
          var D = a.size * a.sparsity;
          U = Math.log(D / a.size) / Math.log(2);
          b.input = X.instance({isMipmap:!0, isFloat:!0, isPot:!0, width:D, Bb:U});
          b.yb = X.instance({isFloat:!0, isPot:!0, width:a.size});
        }
      }, N:function(D) {
        d = D;
        Q.na ? (b.input.R(), h && b.Ea.b(2), Q.N(l), b.input.b(0), b.input.Ld(U), b.yb.R(), h ? y.set("s0") : (y.set("s27"), y.C("u25", H), b.Ea.b(1)), b.input.sd(U, 0), S.g(!1, !1), y.set(C), E ? v.l() : b.V.l(), b.yb.b(0), w && g.Hd(), S.g(!1, !1)) : (b.V.R(), b.Ea.b(1), Q.N());
        E && (y.set(J), u.l(), v.b(0), S.g(!1, !1), y.set("s46"), y.C("u6", 1), b.V.l(), u.b(1), S.g(!1, !1));
        if (n) {
          return I ? (b.Gb.R(), b.V.b(0), y.set(A), y.Aa("u7", 1 / a.size, 1 / a.size), S.g(!1, !1), D = b.Gb) : D = b.V, D.b(0), r && (b.Wa.l(), y.set("s21"), y.Aa("u12", k, N / k), S.g(!1, !1), D = b.Wa, b.Wa.b(0)), D;
        }
        D = b.V;
        a.normalize && (y.set("gpuRawAvg" === f ? "s8" : "s7"), y.C("u4", 1 / a.size), b.Hb.R(), b.V.b(0), S.g(!1, !1), D = b.Hb);
        switch(f) {
          case "cpuRGBA2Float":
            D.fc(!1);
            D = aa.te(D);
            t(D);
            break;
          case "cpuMeanFloat":
            D.fc(!0);
            D = D.ue();
            t(D);
            break;
          case "gpuRawAvg":
          case "gpuRaw":
            D.b(0);
          case "none":
            null !== t && t(D);
        }
        return !1;
      }, Cd:function(D) {
        D && (f = D.Ib || "none", t = D.Fb || null);
        b.V = X.instance({isFloat:!0, isPot:!0, isMipmap:!1, width:a.size});
        D = "undefined" !== typeof a.classesCount && a.classesCount ? a.classesCount : a.size * a.size;
        console.log("INFO in NeuronLayerFeedForward - create_output(): outputsCount = ", D);
        for (var p = 0, M = 0, K = 0; p < D; ++p) {
          e.push(M + (a.size - 1 - K) * a.size), m.push([-1, -1, -1, -1]), ++M, M === a.size && (M = 0, ++K);
        }
        a.normalize && (b.Hb = X.instance({isFloat:!0, isPot:!0, width:a.size}));
      }, te:function(D) {
        var p = D.Xc();
        e.forEach(function(M, K) {
          m[K][0] = p[0][M];
          m[K][1] = p[1][M];
          m[K][2] = p[2][M];
          m[K][3] = p[3][M];
        });
        return m;
      }, h:function() {
        for (var D in b) {
          var p = b[D];
          p && p.remove();
        }
        Q && (Q.h(), Q = null);
      }};
      a.Ya && aa.ze(a.Ya);
      return aa;
    }};
  }(), Rb = function() {
    return {instance:function(a) {
      var b = X.instance(a.weights);
      delete a.weights.data;
      return {na:!0, Ma:function() {
        return 1;
      }, h:function() {
        b.remove();
      }, Zd:function() {
        return b;
      }, N:function() {
        y.set("s26");
        b.b(1);
        S.g(!1, !1);
      }};
    }};
  }(), Ub = function() {
    return {instance:function(a) {
      var b = a.fromLayerSize, d = X.instance(a.weights);
      delete a.weights.data;
      return {na:!0, Ma:function() {
        return b;
      }, h:function() {
        d.remove();
      }, N:function(e) {
        if (e.isEnabled) {
          alert("prout");
          y.set("s24");
          e.ke.b(3);
          var m, f = Math.min(e.Ra.length, e.depth);
          for (m = 0; m < f; ++m) {
            e.Ra[m].rd(4 + m);
          }
        } else {
          y.set("s23");
        }
        y.C("u16", a.toLayerSize);
        d.b(1);
        S.g(!1, !1);
      }};
    }};
  }(), Sb = function() {
    return {instance:function(a) {
      for (var b = a.fromLayerSize, d = a.toLayerSize, e = a.toSparsity, m = e * d, f = m / b, t = b / d, n = 0, k = 0, r = 0, h = Array(e * d * e * d * 4), g = Array(e * d * e * d * 4), w = Array(b * b), l = 0; l < w.length; ++l) {
        w[l] = 0;
      }
      l = Math.floor(e / 2);
      for (var C = 0.5 / d, H = 0.5 / b, I = 0.5 / m, N = 0; N < d; ++N) {
        for (var A = Math.round(N * t), E = 0; E < d; ++E) {
          var J = Math.round(E * t), v = N / d, u = E / d;
          v += C;
          u += C;
          for (var B = 0; B < e; ++B) {
            var U = A + B - l;
            0 > U && (U += b);
            U >= b && (U -= b);
            for (var Q = 0; Q < e; ++Q) {
              var aa = n / m, D = k / m, p = J + Q - l;
              0 > p && (p += b);
              p >= b && (p -= b);
              var M = U / b, K = p / b;
              D = 1 - D - 1 / m;
              M += H;
              K += H;
              aa += I;
              D += I;
              var q = N * e + B, ha = E * e + Q;
              ha = d * e - ha - 1;
              q = ha * d * e + q;
              h[4 * q] = aa;
              h[4 * q + 1] = D;
              h[4 * q + 2] = M;
              h[4 * q + 3] = K;
              K = w[p * b + U]++;
              q = K % f;
              M = U * f + q;
              p = p * f + (K - q) / f;
              p = b * f - 1 - p;
              p = p * b * f + M;
              g[4 * p] = aa;
              g[4 * p + 1] = D;
              g[4 * p + 2] = v;
              g[4 * p + 3] = u;
              ++n >= m && (n = 0, ++k);
              ++r;
            }
          }
        }
      }
      w = null;
      var wa = X.instance(a.weights);
      delete a.weights.data;
      var Ca = X.instance({width:m, isFloat:!0, array:new Float32Array(g), isPot:!0});
      g = null;
      var ra = X.instance({width:m, isFloat:!0, array:new Float32Array(h), isPot:!0});
      h = null;
      return {na:!0, Ma:function() {
        return f;
      }, h:function() {
        Ca.remove();
        ra.remove();
        wa.remove();
      }, N:function() {
        y.set("s22");
        wa.b(1);
        ra.b(2);
        S.g(!1, !1);
      }};
    }};
  }(), Vb = function() {
    return {instance:function(a) {
      var b = a.kernelsCount, d = a.toSparsity, e = d * a.toLayerSize / a.fromLayerSize, m = X.instance(a.weights);
      delete a.weights.data;
      return {na:!0, Ma:function() {
        return e;
      }, Qf:function() {
        return d;
      }, Zd:function() {
        return m;
      }, h:function() {
        m.remove();
      }, N:function() {
        y.set("s25");
        y.C("u22", b);
        y.C("u23", d);
        y.C("u16", a.toLayerSize);
        y.C("u24", a.fromLayerSize);
        m.b(1);
        S.g(!1, !1);
      }};
    }};
  }(), Tb = function() {
    return {instance:function(a, b) {
      console.log("DEBUG in ConnectivitySquareFast - instance: spec = ", a);
      var d = a.fromLayerSize, e = a.toLayerSize, m = a.toSparsity, f = a.stride ? a.stride : 1, t = m * e / d, n = e < d, k = d / e, r = X.instance(a.weights);
      delete a.weights.data;
      var h = "s47" + [d.toString(), e.toString(), m.toString(), f.toString(), b].join("_");
      y.Jd(h) || (a = Nb.Md(b, "gl_FragColor", "gl_FragColor"), e = [{type:"1f", name:"u16", value:e}, {type:"1f", name:"u30", value:f}], n && e.push({type:"1f", name:"u24", value:d}), d = [(n ? t : m).toFixed(1), a], n && d.push(k.toFixed(1)), y.yc(n ? "s39" : "s38", h, d), y.O(h, e.concat([{type:"1i", name:"u14", value:0}, {type:"1i", name:"u21", value:1}, {type:"1i", name:"u13", value:3}])));
      return {na:!1, Ma:function() {
        return t;
      }, h:function() {
        r.remove();
      }, N:function() {
        y.set(h);
        r.b(3);
        S.g(!1, !1);
      }};
    }};
  }(), Qb = function() {
    return {instance:function(a) {
      var b = a.Qc ? a.Qc : 3, d = a.zc ? a.zc : 64, e = a.Uc ? a.Uc : 64, m = a.ge ? !0 : !1;
      a = {isFloat:!1, width:d, isPot:!1, isFlipY:!1};
      var f = X.instance(a), t = X.instance(a), n = X.instance(a), k = X.instance(a), r = X.instance({isFloat:!0, width:e, isPot:!1, isFlipY:!1}), h = 1.0 / d;
      return {process:function(g) {
        y.set("s35");
        k.l();
        S.g(m, !1);
        y.set("s36");
        for (var w = 0; w < b; ++w) {
          f.l(), y.Aa("u7", h, 0), S.g(m, !1), n.l(), k.b(0), S.g(m, !1), t.l(), f.b(0), y.Aa("u7", 0, h), S.g(m, !1), k.l(), n.b(0), S.g(m, !1), w !== b - 1 && t.b(0);
        }
        y.set("s37");
        r.l();
        g.b(0);
        t.b(1);
        k.b(2);
        S.g(m, !1);
        r.b(0);
      }, wc:function() {
        return r;
      }};
    }};
  }(), V = {Yd:function() {
    return V.dc() ? document.createElement("video") : !1;
  }, va:function(a, b) {
    a[b] = !0;
    a.setAttribute(b, "true");
  }, yd:function() {
    var a = !1, b = navigator.userAgent || navigator.vendor || window.opera;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(b) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0, 
    4))) {
      a = !0;
    }
    return a;
  }, bc:function() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }, Nd:function() {
    var a = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return 2 < a.length ? [parseInt(a[1], 10), parseInt(a[2], 10), parseInt(a[3] || 0, 10)] : [0, 0, 0];
  }, Jc:function() {
    try {
      return window.matchMedia("(orientation: portrait)").matches ? !0 : !1;
    } catch (a) {
      return window.innerHeight > window.innerWidth;
    }
  }, xd:function() {
    return V.cc() || V.bc();
  }, cc:function() {
    var a = navigator.userAgent.toLowerCase();
    return -1 !== a.indexOf("safari") && -1 === a.indexOf("chrome") ? !0 : !1;
  }, wf:function() {
    return V.yd() ? V.Jc() ? window.innerHeight / window.innerWidth * 45 : 45 : 45;
  }, dc:function() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? !0 : !1;
  }, pause:function(a) {
    a.pause();
  }, ig:function(a) {
    a.play();
  }, release:function(a) {
    a.pause();
    a.videoStream && a.videoStream.stop();
    a.videoStream = null;
  }, Ad:function(a) {
    if (!a) {
      return a;
    }
    var b = !1;
    if (a.video) {
      var d = function(e) {
        var m = {};
        "undefined" !== typeof e.min && (m.min = e.min);
        "undefined" !== typeof e.max && (m.max = e.max);
        "undefined" !== typeof e.ideal && (m.ideal = e.ideal);
        return m;
      };
      b = {};
      "undefined" !== typeof a.video.width && (b.width = d(a.video.width));
      "undefined" !== typeof a.video.height && (b.height = d(a.video.height));
      "undefined" !== typeof a.video.facingMode && (b.facingMode = a.video.facingMode);
    }
    b = {audio:a.audio, video:b};
    "undefined" !== typeof a.deviceId && (b.deviceId = a.deviceId);
    return b;
  }, ed:function(a) {
    var b = a.video.width;
    a.video.width = a.video.height;
    a.video.height = b;
    return a;
  }, Bd:function(a) {
    function b(g) {
      return [480, 576, 640, 648, 720, 768, 800, 960, 1080, 1152, 1280, 1366, 1920].sort(function(w, l) {
        return Math.abs(w - g) - Math.abs(l - g);
      });
    }
    function d(g) {
      var w = V.Ad(a);
      e.push(g(w));
    }
    var e = [];
    if (!a || !a.video) {
      return e;
    }
    if (a.video.width && a.video.height) {
      if (a.video.width.ideal && a.video.height.ideal) {
        var m = b(a.video.width.ideal).slice(0, 3), f = b(a.video.height.ideal).slice(0, 3), t = {}, n = 0;
        for (t.ga = void 0; n < m.length; t = {ga:t.ga}, ++n) {
          t.ga = m[n];
          var k = {}, r = 0;
          for (k.fa = void 0; r < f.length; k = {fa:k.fa}, ++r) {
            if (k.fa = f[r], t.ga !== a.video.width.ideal || k.fa !== a.video.height.ideal) {
              var h = Math.max(t.ga, k.fa) / Math.min(t.ga, k.fa);
              h < 4 / 3 - 0.1 || h > 16 / 9 + 0.1 || d(function(g, w) {
                return function(l) {
                  l.video.width.ideal = g.ga;
                  l.video.height.ideal = w.fa;
                  return l;
                };
              }(t, k));
            }
          }
        }
      }
      d(function(g) {
        return V.ed(g);
      });
    }
    a.video.width && a.video.height && (a.video.width.ideal && a.video.height.ideal && d(function(g) {
      delete g.video.width.ideal;
      delete g.video.height.ideal;
      return g;
    }), d(function(g) {
      delete g.video.width;
      delete g.video.height;
      return g;
    }));
    a.video.facingMode && (d(function(g) {
      delete g.video.facingMode;
      return g;
    }), a.video.width && a.video.height && d(function(g) {
      V.ed(g);
      delete g.video.facingMode;
      return g;
    }));
    e.push({audio:a.audio, video:!0});
    return e;
  }, He:function(a) {
    if (V.Jc()) {
      if (!a || !a.video) {
        return !1;
      }
      var b = a.video.width, d = a.video.height;
      if (!b || !d) {
        return !1;
      }
      if (b.ideal && d.ideal && b.ideal > d.ideal) {
        return a.video.height = b, a.video.width = d, !0;
      }
    }
    return !1;
  }, Ta:function(a) {
    a.volume = 0.0;
    V.va(a, "muted");
    if (V.cc()) {
      console.log("INFO in lib_getUserMedia - mute(): Safari detected");
      if (1 === a.volume) {
        var b = function() {
          a.volume = 0.0;
          console.log("INFO in lib_getUserMedia - mute(): mute this fucking volume by a fucking user action.");
          window.removeEventListener("mousemove", b, !1);
          window.removeEventListener("touchstart", b, !1);
        };
        console.log("WARNING in lib_getUserMedia - mute(): cannot mute the video. F****ing Safari !");
        window.addEventListener("mousemove", b, !1);
        window.addEventListener("touchstart", b, !1);
      }
      setTimeout(function() {
        a.volume = 0.0;
        V.va(a, "muted");
      }, 5);
    }
  }, fd:function(a, b, d) {
    return new Promise(function(e, m) {
      if (a.srcObject && a.srcObject.getVideoTracks) {
        var f = a.srcObject.getVideoTracks();
        1 !== f.length ? m("INVALID_TRACKNUMBER") : (f = f[0], b ? V.get(a, e, m, d) : (f.stop(), e()));
      } else {
        m("BAD_IMPLEMENTATION");
      }
    });
  }, xc:function(a, b, d, e) {
    function m(n, k, r) {
      t ? (console.log("WARNING in lib_getUserMedia - get_raw(): cannot launch callbackSuccess because an error was thrown"), console.log(JSON.stringify(e.video))) : (console.log("INFO in lib_getUserMedia - get_raw(): callbackSuccess called with constraints="), console.log(JSON.stringify(e.video)), b(n, k, r));
    }
    function f(n) {
      t || (t = !0, d(n));
    }
    var t = !1;
    return navigator.mediaDevices.getUserMedia(e).then(function(n) {
      function k() {
        setTimeout(function() {
          if (a.currentTime) {
            var r = a.videoWidth, h = a.videoHeight;
            if (0 === r || 0 === h) {
              f("VIDEO_NULLSIZE");
            } else {
              r && (a.style.width = r.toString() + "px");
              h && (a.style.height = h.toString() + "px");
              r = {vd:null, Ee:null, le:null};
              try {
                var g = n.getVideoTracks()[0];
                g && (r.le = g, r.vd = g.getCapabilities(), r.Ee = g.getSettings());
              } catch (w) {
                console.log("WARNING in lib_getUserMedia - get_raw(): Image Capture API not found");
              }
              V.xd() ? (console.log("WARNING in lib_getUserMedia - Apple device detected, add the video element to the DOM."), a.parentNode && null !== a.parentNode ? (m(a, n, r), setTimeout(function() {
                a.play();
              }, 100)) : (document.body.appendChild(a), V.Ta(a), m(a, n, r), setTimeout(function() {
                a.style.transform = "scale(0.0001,0.0001)";
                a.style.position = "fixed";
                a.style.bottom = "0px";
                a.style.right = "0px";
                V.Ta(a);
                setTimeout(function() {
                  a.play();
                }, 100);
              }, 80))) : m(a, n, r);
            }
          } else {
            f("VIDEO_NOTSTARTED"), console.log("ERROR in callSuccessIfPlaying() - VIDEO_NOTSTARTED: video.currentTime=", a.currentTime);
          }
        }, 700);
      }
      console.log("INFO in lib_getUserMedia - get_raw(): videoStream got");
      "undefined" !== typeof a.srcObject ? a.srcObject = n : (a.src = window.URL.createObjectURL(n), a.videoStream = n, console.log("WARNING in lib_getUserMedia - get_raw(): video.srcObject is not implemented. Old browser ?"));
      V.Ta(a);
      a.addEventListener("loadeddata", function() {
        console.log("INFO in lib_getUserMedia - get_raw(): video.onloadedmetadata dispatched");
        var r = a.play();
        V.Ta(a);
        "undefined" === typeof r ? k() : r.then(function() {
          console.log("INFO in lib_getUserMedia - get_raw(): playPromise accepted");
          k();
        }).catch(function(h) {
          console.log("ERROR in lib_getUserMedia - get_raw(): playPromise failed - ", h);
          f("VIDEO_PLAYPROMISEREJECTED");
        });
      }, !1);
    }).catch(function(n) {
      f(n);
    });
  }, get:function(a, b, d, e) {
    if (!a) {
      return console.log("ERROR in lib_getUserMedia.js - get(): No video provided"), d && d("VIDEO_NOTPROVIDED"), !1;
    }
    if (!V.dc()) {
      return console.log("ERROR in lib_getUserMedia.js - get(): No getUserMedia API found !"), d && d("MEDIASTREAMAPI_NOTFOUND"), !1;
    }
    if (e && e.video) {
      if (V.bc()) {
        console.log("INFO in lib_getUserMedia() - get(): iOS detected");
        var m = V.Nd();
        (12 > m[0] || 12 === m[0] && 2 > m[1]) && V.He(e);
      }
      e.video.width && e.video.width.ideal && (a.style.width = e.video.width.ideal + "px");
      e.video.height && e.video.height.ideal && (a.style.height = e.video.height.ideal + "px");
    }
    V.va(a, "autoplay");
    V.va(a, "playsinline");
    e && e.audio ? a.volume = 0.0 : V.va(a, "muted");
    console.log("INFO in lib_getUserMedia() - get(): constraints =", JSON.stringify(e));
    V.xc(a, b, function(f) {
      function t(n) {
        if (0 === n.length) {
          d("INVALID_FALLBACKCONSTRAINTS");
        } else {
          var k = n.shift();
          V.xc(a, b, function(r) {
            console.log("WARNING: fails with constraints = ", JSON.stringify(k), r);
            t(n);
          }, k);
        }
      }
      console.log("WARNING in lib_getUserMedia() - get(): cannot request video with this constraints. Downgrade constraints. err=", f);
      f = V.Bd(e);
      t(f);
    }, e);
  }, Xd:function(a) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return console.log("INFO in lib_getUserMedia - get_videoDevices(): enumerateDevices() not supported"), a(!1, "NOTSUPPORTED"), !1;
    }
    navigator.mediaDevices.enumerateDevices().then(function(b) {
      (b = b.filter(function(d) {
        return d.kind && -1 !== d.kind.toLowerCase().indexOf("video") && d.label && d.deviceId;
      })) && b.length && 0 < b.length ? a(b, !1) : (console.log("ERROR in lib_getUserMedia - get_videoDevices(): no devices founds"), a(!1, "NODEVICESFOUND"));
    }).catch(function(b) {
      console.log("ERROR in lib_getUserMedia - get_videoDevices(): enumerateDevices promise rejected", b);
      a(!1, "PROMISEREJECTED");
    });
  }, Xe:function(a, b, d) {
    var e = {};
    e[b] = d;
    b = [];
    b.push(e);
    a.applyConstraints({advanced:b}).catch(function(m) {
      console.log("ERROR in lib_getUserMedia - change_setting(): ", m);
    });
  }}, Aa = function() {
    var a = {n:5, Cb:1, Lc:0, La:[30, 45], Ia:[2, 200], k:0.7, Me:200, re:0.05}, b = -1, d = null, e = -1, m = -1, f = 0, t = -1, n = -1, k = 0, r = 0, h = a.Ia[1], g = {uc:function() {
      switch(b) {
        case -1:
          return -1;
        case 0:
          return n + d.Lc;
        case 1:
          return k;
      }
    }, Af:function(w) {
      return Math.pow(Math.min(Math.max(t, 0), d.n - 1) / (d.n - 1), w || 1);
    }, m:function(w) {
      d = Object.assign({}, a, w);
      t = n = d.Cb;
      b = 0;
    }, Ie:function(w) {
      w = ("undefined" === typeof w ? Date.now() : w) || 0;
      var l = Math.min(Math.max(w - r, d.Ia[0]), d.Ia[1]);
      h = l;
      r = w;
      var C = -1 === e ? 0 : d.k;
      e = Math.min(Math.max(1000 / l, 5), 120) * (1 - C) + e * C;
      w - m > d.Me && 5 < ++f && (l = d.k, t = t * (1 - l) + (e < d.La[0] ? n - 1 : e > d.La[1] ? n + 1 : n) * l, Math.abs(t - n) > 1 - d.re && (l = Math.min(Math.max(Math.round(t), 0), d.n - 1), l !== n && (t = n = l, e = (d.La[1] - d.La[0]) / 2.0)), m = w);
    }, ad:function(w) {
      k = w;
      b = 1;
    }, hd:function() {
      b = 0;
      g.reset();
    }, reset:function() {
      h = a.Ia[1];
      m = e = -1;
      f = 0;
    }, Qd:function() {
      return h;
    }};
    return g;
  }(), rb = function() {
    var a = {Sc:4, Xa:[1.5, 1.5, 2], I:[0.1, 0.1, 0.1], Yc:1, D:-1, B:-1, Ge:2, qe:1, Zc:!0, Id:0.8}, b = null, d = [], e = 0, m = [0.5, 0.5, 1];
    return {m:function(f) {
      b = Object.assign({}, a, f);
      d.splice(0);
      f = b.Xa[0] * b.I[0];
      var t = b.Xa[1] * b.I[1], n = 1 / (1 + b.Xa[2] * b.I[2]), k = b.Yc * Math.min(b.D, b.B), r = k / b.D;
      k /= b.B;
      var h = 0.5 * b.Id;
      h *= h;
      for (var g = 0; g < b.Sc; ++g) {
        var w = Math.pow(n, g), l = r * w, C = k * w;
        w = l * f;
        var H = C * t, I = l / 2;
        C /= 2;
        for (var N = 1 + (1 - I - I) / w, A = 1 + (1 - C - C) / H, E = 0; E < A; ++E) {
          for (var J = C + E * H, v = J - 0.5, u = 0; u < N; ++u) {
            var B = I + u * w, U = B - 0.5;
            U * U + v * v > h || d.push([B, J, l * b.qe]);
          }
        }
      }
      console.log("INFO in ScanManager.js - init(): there are", d.length, "scan positions");
      b.Zc && d.sort(function(Q, aa) {
        var D = Q[0] - 0.5;
        Q = Q[1] - 0.5;
        var p = aa[0] - 0.5;
        aa = aa[1] - 0.5;
        return D * D + Q * Q - (p * p + aa * aa);
      });
    }, get:function() {
      var f = d.length;
      if (0 === f) {
        return m;
      }
      e >= f && (e = 0);
      var t = d[Math.floor(e)];
      e = (e + 1 / b.Ge) % f;
      return t;
    }};
  }(), Y = {neuralNetworkPath:"NN_DEFAULT.json", Xb:0, od:25, fb:[2, 7], ve:{threshold:1, nScaleLevels:3, scale0Factor:0.8, overlapFactors:[2, 2, 3], scanCenterFirst:!0, nDetectsPerLoop:-1}, Je:50, Pc:0.5, Oc:0.4, me:8, Fe:{translationFactorRange:[0.0015, 0.005], rotationFactorRange:[0.003, 0.02], qualityFactorRange:[0.9, 0.98], alphaRange:[0.05, 1], }, ya:[0.65, 1.0, 0.262], I:[0.092, 0.092, 0.3], ld:0.2, nd:2, md:0.1, oe:8, Rc:1, Kd:Xa.Sa.bind(null, 
  0.3, 0.7), Pe:20, cd:3, }, ma = {facingMode:"user", idealWidth:800, idealHeight:600, minWidth:480, maxWidth:1280, minHeight:480, maxHeight:1280, rotate:0, flipX:!1}, ea = {Db:-3, je:-1, error:-2, ready:1, play:2, pause:3}, ia = ea.Db, x = null, Wb = {Ab:!1, element:null, ea:null, X:null, u:[0, 0], H:[0.5, 0.5], o:[0.5, 0., 0., 0.5], Za:0, ua:null, Oa:!1}, L = null, Xb = {ta:null, Fa:null, antialias:!0, Ub:"./", oa:null, $:null, Ca:Y.Xb, Wc:Y.Xb, Pa:!1, ka:!1}, Qa = null, na = null, ua = null, Ha = 
  1, Pa = {Lb:-1, lb:-1}, T = null, Yb = {D:0, B:0, u:[0, 0], xa:null}, W = {Ba:null, buffer:null, I:null, ya:null, U:Y.Rc, wa:null}, Ta = null, pa = null, Wa = null, Oa = null, G = {i:1, aa:0, P:null, Fc:!1, Kc:0, Eb:0}, gb = [], hb = [], Bb = {VERSION:"1.3.6", init:function(a) {
    function b() {
      ia === ea.error ? console.log("ERROR in JeeFaceFilter - check_isLoaded(): state is on error. abort.") : 2 === ++e && (console.log("INFO in JeeFaceFilter - check_isLoaded(): all is loaded"), Ka(), vb(), Ja(), L.ta && (ia = ea.ready, L.ta(!1, {GL:c, canvasElement:L.$, videoTexture:x.X.get(), maxFacesDetected:G.i, videoElement:x.element}), eb()), db());
    }
    if (ia !== ea.Db) {
      return a.callbackReady && a.callbackReady("ALREADY_INITIALIZED"), !1;
    }
    ia = ea.je;
    x = Object.assign({}, Wb);
    L = Object.assign({}, Xb);
    T = Object.assign({}, Yb);
    G.P = [0];
    W.I = Y.I.slice(0);
    W.ya = Y.ya.slice(0);
    "undefined" !== typeof a.antialias && (L.antialias = a.antialias);
    a.callbackReady && (L.ta = a.callbackReady);
    a.callbackTrack && (L.Fa = a.callbackTrack);
    a.nExpressions && (W.U = a.nExpressions);
    a.expressionsEasings && (W.wa = a.expressionsEasings);
    "undefined" !== typeof a.animateDelay && (L.Ca = a.animateDelay);
    "undefined" !== typeof a.NNCPath && (L.Ub = a.NNCPath);
    "undefined" !== typeof a.NNC && (L.oa = a.NNC);
    "undefined" !== typeof a.maxFacesDetected && (G.i = Math.max(1, a.maxFacesDetected));
    "undefined" !== typeof a.followZRot && (L.ka = a.followZRot ? !0 : !1);
    if (G.i > Y.me) {
      return Ia("MAXFACES_TOOHIGH"), !1;
    }
    if (!a.canvasId && !a.canvas) {
      return Ia("NO_CANVASID"), !1;
    }
    L.$ = a.canvas ? a.canvas : document.getElementById(a.canvasId);
    if (!L.$) {
      return Ia("INVALID_CANVASID"), !1;
    }
    T.D = L.$.width;
    T.B = L.$.height;
    if (!T.D || !T.B) {
      return Ia("INVALID_CANVASDIMENSIONS"), !1;
    }
    for (var d = 0; d < G.i; ++d) {
      gb.push(new Float32Array(Y.oe)), hb.push(0);
    }
    Aa.m({Cb:0, n:Y.fb[1] - Y.fb[0] + 1, Lc:Y.fb[0]});
    na = Object.create(Y.ve);
    a.scanSettings && (Object.assign(na, a.scanSettings), -1 !== na.nDetectsPerLoop ? Aa.ad(na.nDetectsPerLoop) : Aa.hd());
    ua = Object.create(Y.Fe);
    a.stabilizationSettings && Object.assign(ua, a.stabilizationSettings);
    var e = 0;
    a.videoSettings && a.videoSettings.videoElement ? Ya(a.videoSettings.videoElement, b) : (a.videoSettings && Object.assign(ma, a.videoSettings), xb(a.onWebcamAsk, a.onWebcamGet, function(m) {
      Ya(m, b);
    }));
    Jb(function(m) {
      console.log("INFO in JeeFaceFilter.init(): NNdata has been fetched");
      if (!Kb()) {
        return console.log("WARNING in JeeFaceFilter.init(): NNdata has been fetched but Context not initialized yet"), !1;
      }
      Qa = new Cb({Ra:m.layers, Ib:"gpuRawAvg", Fb:Mb});
      y.kd([{id:"s50", name:"APP COPY CUT", ja:"attribute vec2 a0;uniform mat2 u32;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=vec2(.5,.5)+u32*a0*vec2(1.,-1.);}", Da:["a0"], qa:[2], a:"uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}", c:["u1", "u32"], precision:"lowp"}, {id:"s51", name:"APP CUT WINDOW ELASTICLY", a:"uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}", ja:"attribute vec2 a0;uniform sampler2D u33;uniform vec2 u34;uniform float u35,u36,u37;varying vec2 vv0;void main(){vec4 a=texture2D(u33,vec2(.17,u35));vec2 f=a.gb,g=a.a*u34,b=a0;b.x*=u37;float c=cos(u36),d=sin(u36);vec2 h=mat2(c,d,-d,c)*b;vv0=f+h*.5*g,gl_Position=vec4(a0,0.,1.);}", 
      Da:["a0"], qa:[2], c:"u1 u33 u34 u35 u36 u37".split(" "), precision:"lowp"}, {id:"s52", name:"APP DETECTOR POSITION (GBA) AND DETECTION (R)", a:"uniform sampler2D u38,u33;uniform vec3 u39,u40;uniform float u41,u42,u35,u43,u36,u44;const vec4 e=vec4(.25,.25,.25,.25);void main(){vec4 d=texture2D(u38,vec2(.625,.625)),f=texture2D(u38,vec2(.875,.625)),a=texture2D(u33,vec2(.17,u35));float g=dot(d-f,e);bool h=g>u42;h?a.r=2.:a.r>u41?a.r=0.:a.r>1.9?a.r+=1.:0.,a.r*=u43;if(a.r<.9)a=vec4(1.,u39);else{a.r*=step(1.9,a.r);float i=dot(e,texture2D(u38,vec2(.875,.875))),j=dot(e,texture2D(u38,vec2(.125,.625))),k=dot(e,texture2D(u38,vec2(.375,.625))),b=cos(u36),c=sin(u36);vec2 l=mat2(b,c*u44,-c/u44,b)*vec2(i,j);a.gba+=vec3(l,k)*u40*a.a;}gl_FragColor=a;}", 
      ja:"attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}", c:"u38 u33 u39 u41 u40 u43 u36 u44 u42 u35".split(" ")}, {id:"s53", name:"APP DETECTOR ROTATION", ja:"attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}", a:"uniform sampler2D u38;const vec4 e=vec4(.25,.25,.25,.25);const vec3 f=vec3(.5,.5,.5);void main(){float a=dot(e,texture2D(u38,vec2(.125,.875))),b=dot(e,texture2D(u38,vec2(.375,.875))),c=dot(e,texture2D(u38,vec2(.625,.875))),d=dot(e,texture2D(u38,vec2(.625,.625)));vec3 g=vec3(a,b,c)*.5+f;gl_FragColor=vec4(g,d);}", 
      c:["u38"]}, {id:"s54", name:"APP DETECTOR EXPRESSIONS", ja:"attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}", a:"uniform sampler2D u38;const vec4 e=vec4(.25,.25,.25,.25);void main(){float a=dot(e,texture2D(u38,vec2(.375,.375))),b=dot(e,texture2D(u38,vec2(.625,.375))),c=dot(e,texture2D(u38,vec2(.875,.375))),d=dot(e,texture2D(u38,vec2(.125,.125)));gl_FragColor=vec4(a,b,c,d);}", c:["u38"]}, {id:"s49", name:"APP READ STATE", a:"uniform sampler2D u33;uniform vec2 u45;uniform float u46;varying vec2 vv0;void main(){float f=step(.5,mod(gl_FragCoord.y+1.5,2.)),c=step(.33,vv0.x);vec4 a=texture2D(u33,vv0+u45);a.a=mix(a.a*u46,a.a,c);vec4 d=floor(255.*a),g=255.*(255.*a-d),b=mix(d,g,f)/255.;b.x=mix(step(a.x,1.5),b.x,c),gl_FragColor=b;}", 
      c:["u33", "u46", "u45"]}]);
      qb();
      Ib();
      jb();
      ib();
      b();
    });
    return !0;
  }, destroy:function() {
    return new Promise(function(a, b) {
      Bb.toggle_pause(!0, !0).catch(function() {
        b();
      }).then(function() {
        Qa && Qa.h();
        Ra.h();
        Qa = pa = Ta = null;
        gb.splice(0);
        hb.splice(0);
        ia = ea.Db;
        a();
      });
    });
  }, toggle_pause:function(a, b) {
    if (!Va()) {
      return Promise.reject();
    }
    var d = null;
    d = x.Oa ? Promise.resolve() : b ? V.fd(x.element, !a, x.ua) : Promise.resolve();
    a ? pb() : d.then(function() {
      db();
    });
    return d;
  }, update_videoSettings:function(a) {
    pb();
    return new Promise(function(b) {
      V.fd(x.element, !1, x.ua).then(function() {
        Object.assign(ma, a);
        xb(null, null, function(d) {
          Ya(d, function() {
            Ka();
            Ja();
            db();
            b();
          });
        });
      });
    });
  }, toggle_slow:function(a) {
    Va() && ia === ea.play && (a && !L.Pa ? (L.Wc = L.Ca, na.nDetectsPerLoop = 1, this.set_animateDelay(100), L.Pa = !0) : !a && L.Pa && (na.nDetectsPerLoop = -1, this.set_animateDelay(L.Wc), L.Pa = !1));
  }, set_animateDelay:function(a) {
    L.Ca = a;
  }, resize:function() {
    if (!Va()) {
      return !1;
    }
    var a = L.$.width, b = L.$.height;
    if (!kb() && a === T.D && b === T.B) {
      return !1;
    }
    T.D = a;
    T.B = b;
    jb();
    ib();
    Ka();
    Ja();
    x.X && x.X.resize(T.D, T.B);
    return !0;
  }, set_inputTexture:function(a, b, d) {
    x.u[0] = b;
    x.u[1] = d;
    x.Ab = !0;
    Ka();
    eb();
    Ja();
    y.set("s50");
    x.X.R();
    c.activeTexture(c.TEXTURE0);
    c.bindTexture(c.TEXTURE_2D, a);
    S.g(!0, !0);
  }, reset_GLState:function() {
    eb();
    T.xa.remove();
    W.Ba.remove();
    qb();
  }, render_video:function() {
    ta.J();
    y.set("s1");
    c.viewport(0, 0, T.D, T.B);
    x.X.b(0);
    S.g(!0, !0);
  }, reset_inputTexture:function() {
    kb();
    x.Ab = !1;
    Ka();
    Ja();
  }, get_videoDevices:function(a) {
    return V.Xd(a);
  }, set_scanSettings:function(a) {
    Object.assign(na, a);
    -1 !== na.nDetectsPerLoop ? Aa.ad(na.nDetectsPerLoop) : Aa.hd();
    jb();
    ib();
  }, set_stabilizationSettings:function(a) {
    Object.assign(ua, a);
  }, set_videoOrientation:function(a, b) {
    Va() && (ma.flipX = b, ma.rotate = a, Ka(), Ja());
  }, update_videoElement:function(a, b) {
    Ya(a ? a : x.element, function() {
      vb();
      Ka();
      Ja();
      b && b();
    });
  }};
  return Bb;
};
JEEFACEFILTERAPI = JEEFACEFILTERAPIGEN();

if(typeof(module)!=='undefined'){module.exports=JEEFACEFILTERAPI;}
/* eslint-enable */
