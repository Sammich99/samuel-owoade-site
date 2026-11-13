// Enhancements only. Every page is complete without this script: the road renders as a vertical list
// with a chapter card per place. With the map libraries loaded, each chapter gets a real map; on wide screens
// (with motion allowed) the road becomes a sideways journey flying over the map.

(function () {
  "use strict";
  var root = document.documentElement;
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var wideMQ = window.matchMedia("(min-width: 900px)");
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var smooth = function (t) { return t * t * (3 - 2 * t); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  // ---- Local time
  function tick() {
    $$("[data-clock]").forEach(function (el) {
      try { el.textContent = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: el.getAttribute("data-tz") || undefined }).format(new Date()); }
      catch (e) { el.textContent = ""; }
    });
  }
  tick();
  setInterval(tick, 20000);

  // ---- Toast and copy email (falls back to the mailto link)
  var toast = $(".toast"), toastTimer;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg; toast.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.hidden = true; }, 2600);
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-copy]");
    if (!el || !navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard.writeText(el.getAttribute("data-copy")).then(
      function () { say("Email copied"); },
      function () { window.location.href = el.getAttribute("href"); }
    );
  });

  // ---- Light and dark, remembered on this device
  var redraw = [];
  $$("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dark = root.dataset.theme ? root.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      var flip = function () { root.dataset.theme = next; redraw.forEach(function (f) { f(); }); };
      if (!reduceMQ.matches && document.startViewTransition) document.startViewTransition(flip); else flip();
      try { localStorage.setItem("so-theme", next); } catch (e) {}
    });
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { redraw.forEach(function (f) { f(); }); });

  // ---- Mac-style dock: icons grow under the cursor
  var dock = $(".dock");
  if (dock && canHover && !reduceMQ.matches) {
    var items = $$("a, button", dock);
    dock.addEventListener("mousemove", function (e) {
      items.forEach(function (it) {
        var r = it.getBoundingClientRect();
        var size = 44 + 22 * Math.max(0, 1 - Math.abs(e.clientX - (r.left + r.width / 2)) / 110);
        it.style.width = it.style.height = size.toFixed(1) + "px";
      });
    });
    dock.addEventListener("mouseleave", function () { items.forEach(function (it) { it.style.width = it.style.height = ""; }); });
  }

  // ---- Product screenshots scroll through the whole site on hover
  function wireHover(scope) {
    if (!canHover || reduceMQ.matches) return;
    $$(".card.product", scope).forEach(function (card) {
      var shot = $(".shot", card), img = shot && $("img", shot);
      if (!img) return;
      card.addEventListener("mouseenter", function () {
        var dist = Math.max(0, img.offsetHeight - shot.clientHeight);
        img.style.transitionDuration = Math.min(9, Math.max(1.2, dist / 420)) + "s";
        img.style.transform = "translateY(" + -dist + "px)";
      });
      card.addEventListener("mouseleave", function () { img.style.transitionDuration = ".9s"; img.style.transform = ""; });
    });
  }

  // =====================================================================
  // The road
  // =====================================================================
  var road = document.getElementById("road");
  if (!road) return;
  var J = JSON.parse($("#journey-data", road).textContent);
  var PLACES = J.places, CHAPTERS = J.chapters, LEGS = J.legs;
  var original = road.innerHTML;
  var mode = null, H = null, V = null, MAP = null;

  // Map labels. `z` = zoom window (projection radius ÷ view height) in which the label shows.
  var LABELS = [
    { t: "NIGERIA", lon: 8.1, lat: 10.3, z: [1.4, 9], big: true },
    { t: "BENIN", lon: 2.3, lat: 9.7, z: [2.2, 9] }, { t: "NIGER", lon: 8.6, lat: 15.6, z: [2.2, 9] },
    { t: "CAMEROON", lon: 12.6, lat: 5.4, z: [2.2, 9] }, { t: "CHAD", lon: 15.8, lat: 13.2, z: [2.2, 9] },
    { t: "GULF OF GUINEA", lon: 3.5, lat: 2.6, z: [2.2, 9] },
    { t: "OYO STATE", lon: 3.55, lat: 8.0, z: [12, 99], big: true }, { t: "OGUN STATE", lon: 3.2, lat: 7.05, z: [12, 99], big: true },
    { t: "LAGOS LAGOON", lon: 3.9, lat: 6.35, z: [12, 99] }, { t: "BENIN", lon: 2.75, lat: 7.6, z: [12, 99] },
    { t: "AFRICA", lon: 18, lat: 6, z: [0, 1.4], big: true }, { t: "NORTH AMERICA", lon: -100, lat: 44, z: [0, 1.4], big: true },
    { t: "ATLANTIC OCEAN", lon: -40, lat: 24, z: [0, 1.6], big: true },
    { t: "UNITED STATES", lon: -98, lat: 39, z: [1.2, 2.2] },
    { t: "GEORGIA", lon: -83.4, lat: 32.5, z: [2.4, 99], big: true }, { t: "NORTH CAROLINA", lon: -79.3, lat: 35.7, z: [2.4, 99], big: true },
    { t: "SOUTH CAROLINA", lon: -80.9, lat: 33.8, z: [3.2, 99] }, { t: "TENNESSEE", lon: -86.3, lat: 35.9, z: [3.2, 99] },
    { t: "ALABAMA", lon: -86.8, lat: 32.8, z: [3.2, 99] }, { t: "FLORIDA", lon: -82.2, lat: 29.6, z: [3.2, 99] },
    { t: "VIRGINIA", lon: -78.6, lat: 37.6, z: [2.4, 99] }, { t: "PENNSYLVANIA", lon: -77.6, lat: 40.9, z: [2.4, 99] },
    { t: "ATLANTIC OCEAN", lon: -73.5, lat: 33.5, z: [2.4, 99] }
  ];

  function km(legId) {
    var leg = LEGS.filter(function (l) { return l.id === legId; })[0], a = PLACES[leg.from], b = PLACES[leg.to];
    var d = d3.geoDistance([a.lon, a.lat], [b.lon, b.lat]) * 6371;
    return d > 1000 ? Math.round(d / 100) * 100 : Math.round(d / 10) * 10;
  }

  // ---- Map outlines (Natural Earth via world-atlas and us-atlas), loaded once
  function loadMap() {
    if (!window.d3 || !window.topojson || !window.fetch) return Promise.reject(new Error("map libraries unavailable"));
    return Promise.all([
      fetch("data/countries-110m.json").then(function (r) { return r.json(); }),
      fetch("data/us-states-10m.json").then(function (r) { return r.json(); })
    ]).then(function (res) {
      var w = res[0], u = res[1];
      var countries = topojson.feature(w, w.objects.countries), states = topojson.feature(u, u.objects.states);
      var st = function (n) { return states.features.filter(function (f) { return f.properties.name === n; })[0]; };
      MAP = {
        land: topojson.feature(w, w.objects.land),
        borders: topojson.mesh(w, w.objects.countries, function (a, b) { return a !== b; }),
        stateBorders: topojson.mesh(u, u.objects.states, function (a, b) { return a !== b; }),
        NIGERIA: countries.features.filter(function (f) { return f.properties.name === "Nigeria"; })[0],
        GEORGIA: st("Georgia"), NCAR: st("North Carolina"), SCAR: st("South Carolina"),
        graticule: d3.geoGraticule10()
      };
    });
  }

  // ---- Map renderer: an orthographic camera over the Earth
  function drawMap(canvas, w, h, cam, opt) {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); canvas.style.width = w + "px"; canvas.style.height = h + "px"; }
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var cs = getComputedStyle(root), v = function (n) { return cs.getPropertyValue(n).trim(); };
    var proj = d3.geoOrthographic().rotate([-cam.lon, -cam.lat]).scale(cam.s).translate([w * (cam.cx == null ? 0.5 : cam.cx), h / 2]).clipAngle(90).precision(0.6);
    var path = d3.geoPath(proj, ctx);
    var z = cam.s / h, center = [cam.lon, cam.lat];
    var visible = function (lon, lat) { return d3.geoDistance([lon, lat], center) < Math.PI / 2 - 0.05; };
    var route = v("--route"), card = v("--card"), fg = v("--fg"), mono = v("--font-mono"), sans = v("--font-sans");

    ctx.beginPath(); path({ type: "Sphere" }); ctx.fillStyle = v("--map-water"); ctx.fill();
    ctx.beginPath(); path(MAP.graticule); ctx.strokeStyle = v("--map-grat"); ctx.lineWidth = 0.6; ctx.stroke();
    ctx.beginPath(); path(MAP.land); ctx.fillStyle = v("--map-land"); ctx.fill();
    if (z > 1.1) { ctx.beginPath(); path(MAP.stateBorders); ctx.strokeStyle = v("--map-border"); ctx.globalAlpha = clamp((z - 1.1) / 0.8, 0, 1) * 0.8; ctx.lineWidth = 0.7; ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.beginPath(); path(MAP.borders); ctx.strokeStyle = v("--map-border"); ctx.lineWidth = 0.9; ctx.stroke();
    (opt.highlight || []).forEach(function (f) { ctx.beginPath(); path(f); ctx.fillStyle = v("--map-hi"); ctx.fill(); ctx.strokeStyle = v("--map-hi-border"); ctx.lineWidth = 1.4; ctx.stroke(); });
    if (z < 1.6) { ctx.beginPath(); path({ type: "Sphere" }); ctx.strokeStyle = v("--map-border"); ctx.globalAlpha = clamp((1.6 - z) / 0.6, 0, 1); ctx.lineWidth = 1.2; ctx.stroke(); ctx.globalAlpha = 1; }

    if (opt.labels !== false) {
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      LABELS.forEach(function (L) {
        if (z < L.z[0] || z > L.z[1] || !visible(L.lon, L.lat)) return;
        var p = proj([L.lon, L.lat]); if (!p || p[0] < -80 || p[0] > w + 80) return;
        ctx.globalAlpha = clamp(Math.min(z - L.z[0], L.z[1] - z) / Math.max(0.35, L.z[0] * 0.15), 0, 1);
        ctx.font = (L.big ? 500 : 400) + " " + (L.big ? 13 : 11) + "px " + mono;
        ctx.fillStyle = v("--map-label");
        if ("letterSpacing" in ctx) ctx.letterSpacing = L.big ? "4px" : "2.5px";
        ctx.fillText(L.t, p[0], p[1]);
      });
      if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
      ctx.globalAlpha = 1;
    }

    // Routes: roads dashed, the flight solid with a plane at its head.
    (opt.legs || []).forEach(function (L) {
      var leg = LEGS.filter(function (l) { return l.id === L.id; })[0], upto = clamp(L.p, 0, 1);
      if (!leg || upto <= 0) return;
      var A = PLACES[leg.from], B = PLACES[leg.to], interp = d3.geoInterpolate([A.lon, A.lat], [B.lon, B.lat]);
      var pts = []; for (var i = 0; i <= 90 * upto; i++) pts.push(interp(i / 90)); pts.push(interp(upto));
      var flight = leg.style === "flight";
      ctx.globalAlpha = L.fade == null ? 1 : L.fade;
      ctx.beginPath(); path({ type: "LineString", coordinates: pts });
      ctx.strokeStyle = route; ctx.lineWidth = flight ? 2.6 : 2.2; ctx.setLineDash(flight ? [] : [6, 6]); ctx.stroke(); ctx.setLineDash([]);
      if (flight && upto < 1) {
        var h1 = interp(upto), p1 = proj(h1), p0 = proj(interp(Math.max(0, upto - 0.01)));
        if (p1 && visible(h1[0], h1[1])) {
          ctx.save(); ctx.translate(p1[0], p1[1]); ctx.rotate(Math.atan2(p1[1] - p0[1], p1[0] - p0[0]));
          ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(-7, -8); ctx.lineTo(-3, 0); ctx.lineTo(-7, 8); ctx.closePath();
          ctx.fillStyle = route; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = card; ctx.stroke(); ctx.restore();
        }
      }
      if (leg.km && L.km !== false && upto > 0.62 && (L.fade == null || L.fade > 0.9)) {
        var m = interp(0.45), p = proj(m);
        if (p && visible(m[0], m[1])) {
          ctx.globalAlpha = clamp((upto - 0.62) / 0.15, 0, 1);
          ctx.font = "500 11px " + mono; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          var text = "about " + km(leg.id).toLocaleString("en-US") + " km", tw = ctx.measureText(text).width + 14, ty = p[1] - 36;
          ctx.fillStyle = card; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(p[0] - tw / 2, ty, tw, 20, 10); else ctx.rect(p[0] - tw / 2, ty, tw, 20); ctx.fill();
          ctx.strokeStyle = v("--map-border"); ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = fg; ctx.fillText(text, p[0], ty + 10);
        }
      }
      ctx.globalAlpha = 1;
    });

    // Pins
    (opt.pins || Object.keys(PLACES)).forEach(function (key) {
      var P = PLACES[key];
      if (!visible(P.lon, P.lat)) return;
      var p = proj([P.lon, P.lat]); if (!p) return;
      var hot = opt.hot === key, detail = (opt.detail || []).indexOf(key) >= 0;
      ctx.beginPath(); ctx.arc(p[0], p[1], hot ? 13 : 9, 0, Math.PI * 2); ctx.fillStyle = v("--route-halo"); ctx.fill();
      ctx.beginPath(); ctx.arc(p[0], p[1], hot ? 6 : 4.5, 0, Math.PI * 2); ctx.fillStyle = route; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = card; ctx.stroke();
      ctx.textBaseline = "middle"; ctx.font = "600 12.5px " + sans;
      var name = w < 500 && P.short ? P.short : P.label, nw = ctx.measureText(name).width;
      var fitsR = p[0] + 16 + nw < w - 6, fitsL = p[0] - 16 - nw > 6;
      var right = P.side > 0 ? (fitsR || !fitsL) : !fitsL;
      ctx.textAlign = right ? "left" : "right";
      var tx = p[0] + (right ? 16 : -16), ly = p[1] + (opt.dy && opt.dy[key] != null ? opt.dy[key] : z < 8 ? (P.dy || 0) : 0);
      ctx.fillStyle = fg; ctx.fillText(name, tx, detail ? ly - 7 : ly);
      if (detail) { ctx.font = "400 11px " + mono; ctx.fillStyle = v("--muted"); ctx.fillText(P.sub, tx, ly + 9); }
    });
  }
  function fit(feature, bw, bh, center) {
    var c = center || d3.geoCentroid(feature);
    return { lon: c[0], lat: c[1], s: d3.geoOrthographic().rotate([-c[0], -c[1]]).fitSize([bw, bh], feature).scale() };
  }
  var box = function (w, s, e, n) { return { type: "MultiPoint", coordinates: [[w, s], [e, n]] }; };
  // Flight-map camera move: zooming out pulls back first and pans later; zooming in pans first and settles later.
  function lerpCam(a, b, t) {
    var out = b.s < a.s * 0.8, inn = b.s > a.s * 1.25;
    var tc = out ? Math.pow(t, 2.2) : inn ? 1 - Math.pow(1 - t, 2.2) : t;
    var ts = out ? 1 - Math.pow(1 - t, 1.8) : inn ? Math.pow(t, 1.8) : t;
    var c = d3.geoInterpolate([a.lon, a.lat], [b.lon, b.lat])(tc);
    var acx = a.cx == null ? 0.5 : a.cx, bcx = b.cx == null ? 0.5 : b.cx;
    return { lon: c[0], lat: c[1], s: Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * ts), cx: acx + (bcx - acx) * t };
  }
  function views(w, h) {
    var a = PLACES.lagos, b = PLACES.kennesaw, m = d3.geoInterpolate([a.lon, a.lat], [b.lon, b.lat])(0.5);
    return {
      ngAll: fit(MAP.NIGERIA, w * 0.5, h * 0.6),
      ngLocal: fit(box(2.95, 6.25, 4.45, 7.75), w * 0.42, h * 0.5),
      world: { lon: m[0], lat: m[1] - 4, s: h * 0.4 },
      east: fit(box(-86.5, 31.5, -72.5, 42), w * 0.42, h * 0.62),
      ga: fit(MAP.GEORGIA, w * 0.4, h * 0.58),
      se: fit({ type: "FeatureCollection", features: [MAP.GEORGIA, MAP.SCAR, MAP.NCAR] }, w * 0.68, h * 0.62),
      nc: fit(MAP.NCAR, w * 0.62, h * 0.55)
    };
  }
  var CHAPTER_VIEW = { ng: "ngAll", ga: "east", nc: "se" };
  function chapterHighlight(id) { return id === "ng" ? [MAP.NIGERIA] : id === "ga" ? [MAP.GEORGIA] : [MAP.NCAR]; }

  // ---- Shared road helpers
  function readStops(scope) {
    return $$(".v-stop", scope).map(function (li) {
      var d = li.dataset;
      return { id: d.id, region: d.region, place: d.place || null, view: d.view, year: d.year, title: d.title, tag: d.tag, size: d.size, now: li.hasAttribute("data-now"), card: $(".card", li) };
    });
  }
  function passing(s) { return "<span>" + (s.now ? "You are here" : "Now passing") + ":</span> <b>" + esc(s.title) + "</b> <span>· " + esc(s.tag) + "</span>"; }
  function setGps(el, html, p) {
    var t = $(".txt", el); if (t.innerHTML !== html) t.innerHTML = html;
    $(".bar i", el).style.width = (p * 100).toFixed(1) + "%";
    $(".pct", el).textContent = Math.round(p * 100) + "%";
  }

  // ---- Sideways journey over the map (wide screens)
  function buildH() {
    var stops = readStops(road);
    var chapterEls = {}; $$(".v-chapter .chapter", road).forEach(function (el) { chapterEls[el.dataset.chapter] = el; });
    var head = $(".road-head", road), gps = $(".gps", road), nextText = $("[data-next] p", road).textContent;
    var dataEl = $("#journey-data", road);
    road.innerHTML = '<div class="journey"><div class="j-sticky"><canvas class="j-map" aria-hidden="true"></canvas><div class="j-fade-top"></div><div class="j-fade-bottom"></div><div class="j-track"></div></div></div>';
    road.appendChild(dataEl);
    var journey = $(".journey", road), sticky = $(".j-sticky", road), track = $(".j-track", road);
    head.classList.remove("pad"); $(".hint", head).textContent = "Scroll to travel →";
    sticky.appendChild(head);
    gps.classList.remove("off"); sticky.appendChild(gps);

    var vw = sticky.clientWidth, Hh = sticky.clientHeight;
    var headBottom = 118, gpsTop = Hh - 72;
    var top = headBottom + 10, bottom = gpsTop - 10, mid = (top + bottom) / 2;
    var A = clamp((bottom - top) / 2 - 150, 54, 130);
    var S = 360, OV = 760, CROSS = 1000, HOP = 560;
    var VW = views(vw, Hh);
    var cam = function (name, cx) { var c = VW[name]; return { lon: c.lon, lat: c.lat, s: c.s, cx: cx == null ? 0.5 : cx }; };

    // Lay out: [chapter overview] stops… then the flight, the drive, and so on.
    var x = 120, i = 0, pts = [], chapters = [], keys = [], spans = {};
    CHAPTERS.forEach(function (ch, ci) {
      if (ci === 1) { spans.flight = [x, x + CROSS]; x += CROSS; }
      if (ci === 2) { spans.hop = [x, x + HOP]; x += HOP; }
      var ov = { ch: ch, x0: x, x1: x + OV };
      chapters.push(ov);
      keys.push({ x: ov.x0 + 120, c: cam(CHAPTER_VIEW[ch.id], 0.66) }, { x: ov.x1 - 200, c: cam(CHAPTER_VIEW[ch.id], 0.66) });
      x += OV;
      var chStops = stops.filter(function (s) { return s.region === ch.id; });
      chStops.forEach(function (s, k) {
        if (k > 0) x += S;
        var p = { s: s, x: x, y: i % 2 === 0 ? mid + A : mid - A, above: i % 2 === 0 };
        pts.push(p); keys.push({ x: p.x, c: cam(s.view) }); i++;
      });
      keys.push({ x: x + 220, c: cam(chStops[chStops.length - 1].view) });
      x += S;
    });
    var fl = spans.flight, fspan = fl[1] - fl[0];
    keys.push({ x: fl[0] + fspan * 0.28, c: { lon: VW.world.lon + 6, lat: VW.world.lat, s: VW.world.s } }, { x: fl[1] - fspan * 0.28, c: { lon: VW.world.lon - 6, lat: VW.world.lat, s: VW.world.s } });
    keys.push({ x: (spans.hop[0] + spans.hop[1]) / 2, c: cam("se") });
    keys.sort(function (a, b) { return a.x - b.x; });
    keys.unshift({ x: 0, c: keys[0].c });
    var last = pts[pts.length - 1], nextX = last.x + 420, W = nextX + 440;
    keys.push({ x: W, c: keys[keys.length - 1].c });

    // Foreground road: one in Nigeria, one across the U.S. Each starts low, under its chapter card.
    var seg = function (a, b) { var dx = b.x - a.x; return "C " + (a.x + dx / 2) + " " + a.y + " " + (b.x - dx / 2) + " " + b.y + " " + b.x + " " + b.y; };
    var roadFrom = function (start, ps) { var d = "M " + start.x + " " + start.y + " " + seg(start, ps[0]); for (var k = 1; k < ps.length; k++) d += " " + seg(ps[k - 1], ps[k]); return d; };
    var low = bottom - 26;
    var roads = [
      roadFrom({ x: chapters[0].x0 + 40, y: low }, pts.filter(function (p) { return p.s.region === CHAPTERS[0].id; })),
      roadFrom({ x: chapters[1].x0 + 40, y: low }, pts.filter(function (p) { return p.s.region !== CHAPTERS[0].id; }))
    ];
    var ahead = "M " + last.x + " " + last.y + " C " + (last.x + 200) + " " + last.y + " " + (nextX - 160) + " " + mid + " " + nextX + " " + mid;

    track.style.width = W + "px";
    track.innerHTML = '<svg class="j-svg" width="' + W + '" height="' + Hh + '" viewBox="0 0 ' + W + " " + Hh + '" aria-hidden="true">' +
      roads.map(function (d) { return '<path class="road-base" d="' + d + '"/><path class="road-mark" d="' + d + '"/>'; }).join("") +
      '<path class="road-air" d="' + ahead + '"/><path class="road-route" d="' + roads.join(" ") + '"/>' +
      '<circle class="j-you-halo" r="13" cx="0" cy="' + mid + '"/><circle class="j-you" r="7" cx="0" cy="' + mid + '"/></svg>' +
      '<div class="j-next" style="left:' + (nextX + 190) + "px; top:" + mid + 'px"><span class="pill">Next</span><p></p><small>The road keeps going.</small></div>';
    $(".j-next p", track).textContent = nextText;
    chapters.forEach(function (ov) {
      var el = chapterEls[ov.ch.id];
      el.style.left = ov.x0 + 60 + "px"; el.style.top = top + 6 + "px";
      track.appendChild(el);
    });
    var cardW = { product: 330, milestone: 330, small: 290, regular: 310 };
    pts.forEach(function (p) {
      var w = cardW[p.s.size] || 310;
      var avail = Math.round(p.above ? (p.y - 30) - (headBottom + 4) : (gpsTop - 8) - (p.y + 30));
      var wrap = document.createElement("div");
      wrap.className = "j-stop"; wrap.id = "stop-" + p.s.id;
      wrap.innerHTML = '<span class="j-link" style="left:' + p.x + "px; top:" + (p.above ? p.y - 30 : p.y + 10) + 'px; height:20px"></span>' +
        '<span class="j-node" style="left:' + p.x + "px; top:" + p.y + 'px"><span class="pill"></span></span>';
      $(".pill", wrap).textContent = p.s.year;
      var holder = document.createElement("div");
      holder.className = "j-card";
      holder.style.cssText = "left:" + (p.x - w / 2) + "px; width:" + w + "px; " + (p.above ? "bottom:" + (Hh - (p.y - 30)) + "px;" : "top:" + (p.y + 30) + "px;") +
        (p.s.size === "product" ? "height:" + Math.min(avail, 420) + "px;" : "max-height:" + avail + "px; overflow:hidden;");
      holder.appendChild(p.s.card);
      wrap.appendChild(holder);
      track.appendChild(wrap);
      p.el = wrap;
    });

    var route = $(".road-route", track), total = route.getTotalLength(), samples = [];
    for (var k = 0; k <= 1200; k++) { var l = (k / 1200) * total, pp = route.getPointAtLength(l); samples.push([pp.x, l]); }
    route.style.strokeDasharray = total;
    var travel = W - vw;
    journey.style.height = travel + Hh + "px";
    var byId = {}; pts.forEach(function (p) { byId[p.s.id] = p; });
    H = { journey: journey, sticky: sticky, track: track, route: route, total: total, samples: samples, travel: travel, vw: vw, Hh: Hh, pts: pts, chapters: chapters,
      keys: keys, spans: spans, byId: byId, S: S, canvas: $(".j-map", sticky), gps: gps, you: $(".j-you", track), halo: $(".j-you-halo", track) };
    wireHover(track);
    updateH();
  }
  function camAt(x) {
    var k = H.keys;
    for (var i = 0; i < k.length - 1; i++) if (x <= k[i + 1].x) return lerpCam(k[i].c, k[i + 1].c, smooth(clamp((x - k[i].x) / Math.max(1, k[i + 1].x - k[i].x), 0, 1)));
    return k[k.length - 1].c;
  }
  function updateH() {
    var st = H; if (!st) return;
    var r = st.journey.getBoundingClientRect();
    var p = clamp(-r.top / Math.max(1, st.travel), 0, 1), tx = p * st.travel, eye = tx + st.vw * 0.5;
    st.track.style.transform = "translate3d(" + -tx + "px,0,0)";
    var len = 0;
    for (var i = 0; i < st.samples.length; i++) { if (st.samples[i][0] <= eye) len = st.samples[i][1]; else if (st.samples[i][0] > eye + 40) break; }
    st.route.style.strokeDashoffset = st.total - len;
    var pt = st.route.getPointAtLength(len);
    st.you.setAttribute("cx", pt.x); st.you.setAttribute("cy", pt.y); st.halo.setAttribute("cx", pt.x); st.halo.setAttribute("cy", pt.y);
    var f0 = st.spans.flight[0], f1 = st.spans.flight[1], h0 = st.spans.hop[0], h1 = st.spans.hop[1];
    var flying = eye > f0 - 40 && eye < f1 + 40;
    st.sticky.classList.toggle("flying", flying || eye < st.pts[0].x - 200);

    var current = null;
    st.pts.forEach(function (q) { var passed = q.x <= eye + 2; q.el.classList.toggle("passed", passed); if (passed) current = q; });
    var overview = st.chapters.filter(function (ov) { return eye >= ov.x0 && eye < ov.x1 - 120; })[0];
    var chapterId = overview ? overview.ch.id : current ? current.s.region : CHAPTERS[0].id;
    var P = function (id) { return st.byId[id].x; };
    var prog = function (a, b) { return clamp((eye - a) / Math.max(1, b - a), 0, 1); };
    var legs = [
      { id: "bab-iba", p: prog(P("bs") + 40, P("jobberman") - 40), fade: eye > f1 ? 0.35 : 1 },
      { id: "iba-lag", p: prog(P("jobberman") + 60, f0 + 40), fade: eye > f1 ? 0.35 : 1 },
      { id: "flight", p: prog(f0 + fspanOf(st) * 0.12, f1 - fspanOf(st) * 0.12), fade: 1 - 0.75 * prog(f1, f1 + 300) },
      { id: "ken-ny", p: prog(P("bloomberg") - st.S * 0.7, P("bloomberg") - 30), fade: 1 - 0.7 * prog(P("bloomberg") + 80, P("jpmc")) },
      { id: "hop", p: prog(h0 - 120, h1 - 60), fade: 1 - 0.55 * prog(h1 + 200, h1 + 600) }
    ];
    var near = null, nd = Infinity;
    st.pts.forEach(function (q) { var d = Math.abs(q.x - eye); if (d < nd) { nd = d; near = q; } });
    var hot = near && near.s.place && nd < st.S * 0.6 && !flying && !overview ? near.s.place : null;
    var ovCh = overview && overview.ch;
    drawMap(st.canvas, st.vw, st.Hh, camAt(eye), {
      legs: legs, hot: hot,
      highlight: flying ? [] : chapterHighlight(chapterId),
      detail: ovCh ? ovCh.places : [],
      // Lagos appears when you head for the airport; New York with chapter 2; Charlotte when the drive begins.
      // On the globe only the departure and arrival are pinned.
      pins: flying ? ["lagos", "kennesaw"] : Object.keys(PLACES).filter(function (k) {
        return (k !== "charlotte" || eye > h0 - 200) && (k !== "lagos" || eye > P("jobberman")) && (k !== "newyork" || eye > st.chapters[1].x0);
      })
    });
    var text;
    var leg = function (id) { return LEGS.filter(function (l) { return l.id === id; })[0]; };
    if (flying) text = "<b>The crossing</b> <span>· " + esc(leg("flight").caption) + "</span>";
    else if (eye > h0 && eye < h1) text = "<b>On the move</b> <span>· " + esc(leg("hop").caption) + "</span>";
    else if (ovCh) text = "<b>Chapter " + ovCh.n + " · " + esc(ovCh.name) + "</b> <span>· " + esc(ovCh.years) + "</span>";
    else if (current) text = passing(current.s);
    else text = "<b>Starting out</b> <span>· " + esc(CHAPTERS[0].name) + "</span>";
    setGps(st.gps, text, p);
    document.body.classList.toggle("on-road", r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5);
  }
  function fspanOf(st) { return st.spans.flight[1] - st.spans.flight[0]; }

  // ---- Vertical road (phones, Reduce Motion): each chapter's card gets a small map
  function drawChapterMaps() {
    if (!MAP) return;
    $$(".chapter-map", road).forEach(function (c) {
      var w = c.parentElement.clientWidth - 42; if (w < 120) return;
      var h = Math.round(w * 0.62), id = c.dataset.chapter, VW = views(w, h);
      var cfg = id === "ng"
        ? { view: "ngLocal", opt: { labels: false, highlight: [MAP.NIGERIA], pins: ["babcock", "ibadan", "lagos"], legs: [{ id: "bab-iba", p: 1 }, { id: "iba-lag", p: 1 }] } }
        : id === "ga"
        ? { view: "world", opt: { labels: false, highlight: [MAP.NIGERIA, MAP.GEORGIA], pins: ["lagos", "kennesaw", "newyork"], dy: { kennesaw: 13, newyork: -11 }, legs: [{ id: "flight", p: 1, km: false }, { id: "ken-ny", p: 1 }] } }
        : { view: "se", opt: { labels: false, highlight: [MAP.NCAR], pins: ["kennesaw", "charlotte"], legs: [{ id: "hop", p: 1, km: false }] } };
      var c0 = VW[cfg.view];
      drawMap(c, w, h, { lon: c0.lon, lat: c0.lat, s: cfg.view === "world" ? Math.min(w * 0.62, h * 0.8) : c0.s, cx: 0.5 }, cfg.opt);
    });
  }
  function buildV() {
    var vroad = $(".v-road", road);
    V = { vroad: vroad, gps: $(".gps", road), stops: readStops(road).map(function (s) { return { s: s, el: document.getElementById("stop-" + s.id) }; }) };
    drawChapterMaps();
    if (!reduceMQ.matches && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove("pre"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -10% 0px" });
      $$(".card", vroad).forEach(function (c) { if (c.getBoundingClientRect().top > window.innerHeight) { c.classList.add("pre"); io.observe(c); } });
    }
    wireHover(vroad);
    updateV();
  }
  function updateV() {
    var st = V; if (!st) return;
    var r = st.vroad.getBoundingClientRect(), eye = window.innerHeight * 0.55;
    var prog = clamp(eye - r.top, 0, r.height);
    st.vroad.style.setProperty("--p", prog + "px");
    var current = null;
    st.stops.forEach(function (q) { var passed = $(".node", q.el).getBoundingClientRect().top < eye; q.el.classList.toggle("passed", passed); if (passed) current = q.s; });
    var onRoad = r.top < window.innerHeight * 0.7 && r.bottom > window.innerHeight * 0.3;
    st.gps.classList.toggle("off", !onRoad);
    document.body.classList.toggle("on-road", onRoad);
    setGps(st.gps, current ? passing(current) : "<b>Chapter 1 · " + esc(CHAPTERS[0].name) + "</b> <span>· " + esc(CHAPTERS[0].years) + "</span>", r.height ? prog / r.height : 0);
  }

  function build(force) {
    var next = MAP && wideMQ.matches && !reduceMQ.matches ? "h" : "v";
    if (!force && next === mode && next === "v") { drawChapterMaps(); return; }
    mode = next; H = V = null;
    road.innerHTML = original;
    if (next === "h") buildH(); else buildV();
  }
  function update() { if (mode === "h") updateH(); else updateV(); }
  redraw.push(function () { if (mode === "h") updateH(); else drawChapterMaps(); });

  // Go to a stop. On the sideways road, scroll to where that stop sits mid-screen.
  function goTo(id, instant) {
    var behavior = instant || reduceMQ.matches ? "instant" : "smooth";
    if (mode === "h" && H && H.byId[id]) {
      var top = H.journey.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + clamp((H.byId[id].x - H.vw * 0.5 + 40) / H.travel, 0, 1) * H.travel, behavior: behavior });
    } else {
      var el = document.getElementById("stop-" + id);
      if (el) el.scrollIntoView({ block: "center", behavior: behavior });
    }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#stop-"]');
    if (!a) return;
    e.preventDefault();
    goTo(a.getAttribute("href").slice(6));
    try { history.replaceState(null, "", a.getAttribute("href")); } catch (err) {}
  });

  build(true);
  loadMap().then(function () { build(true); landOnHash(); }, function () { root.classList.add("no-map"); });
  window.addEventListener("load", update);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
  var raf = 0;
  window.addEventListener("scroll", function () { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; update(); }); }, { passive: true });
  var rt = 0;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { build(mode === "h"); }, 150); });
  wideMQ.addEventListener("change", function () { build(true); });
  reduceMQ.addEventListener("change", function () { build(true); });

  // Arriving from a case study ("Back to the road") lands on that product's stop.
  function landOnHash() {
    if (!/^#stop-/.test(location.hash)) return;
    var target = location.hash.slice(6);
    var land = function () { goTo(target, true); update(); };
    setTimeout(land, 0);
    if (document.readyState !== "complete") window.addEventListener("load", land, { once: true });
  }
  landOnHash();
})();
