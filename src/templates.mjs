// Page templates. Every function returns an HTML string; build.mjs writes them to dist/.
// `base` is the relative path back to the site root ("" for the home page, "../../" for /work/<id>/),
// so the built site works on any host, in a subfolder, or opened straight from disk.
//
// The home page is rendered as a vertical road with a chapter card per place, complete without JavaScript.
// On wide screens site.js rebuilds the same markup as the sideways map journey, using the journey data
// embedded as JSON and the map outlines in data/.

import { SITE, ME, WHY, PRODUCTS, PLACES, CHAPTERS, LEGS, MARKS, STOPS, NEXT, EMBLEMS, ROAD } from "./content.mjs";

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const absolute = (path) => (SITE.url ? SITE.url.replace(/\/$/, "") + "/" + path.replace(/^\//, "") : "");
const ext = (href, text) => `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(text)} <span aria-hidden="true">↗</span></a>`;
const stopTitle = (s) => (s.product ? PRODUCTS[s.product].name : s.title);
const stopTag = (s) => s.tag || (s.place ? PLACES[s.place].label : "Online");

const ICONS = {
  home: `<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>`,
  road: `<path d="M8 3c0 4-4 5-4 9s4 5 4 9M16 3c0 4 4 5 4 9s-4 5-4 9M12 4v2.5M12 10.5v3M12 17.5V20"/>`,
  linkedin: `<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 10.5V16M8.5 7.8v.01M12 16v-3.2a2 2 0 0 1 4 0V16M12 10.5V16"/>`,
  github: `<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>`,
  mail: `<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>`,
  resume: `<path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z"/><path d="M14 3.5v5h5M9 13h6M9 16.5h4"/>`,
  download: `<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>`,
  moon: `<path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z"/>`,
};
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

const SVG_MARKS = {
  microsoft: `<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="1" y="1" width="8.4" height="8.4" fill="#F25022"/><rect x="10.6" y="1" width="8.4" height="8.4" fill="#7FBA00"/><rect x="1" y="10.6" width="8.4" height="8.4" fill="#00A4EF"/><rect x="10.6" y="10.6" width="8.4" height="8.4" fill="#FFB900"/></svg>`,
  greencard: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2.2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.8 15.5c.5-1.3 1.5-2 2.7-2s2.2.7 2.7 2M13.5 10h4.5M13.5 13h3"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5.5a2.5 2.5 0 0 0 2.6 4M16 6h2.5a2.5 2.5 0 0 1-2.6 4M12 13v3.5M8.5 20h7M10 16.5h4V20h-4z"/></svg>`,
};
const markInner = (key) => (MARKS[key].svg ? SVG_MARKS[MARKS[key].svg] : esc(MARKS[key].text));
const badge = (key) => `<span class="badge ${MARKS[key].cls}" aria-hidden="true">${markInner(key)}</span>`;

// ---------- Cards on the road ----------
function productCard(s, base) {
  const p = PRODUCTS[s.product];
  return `<article class="card product${s.now ? " now" : ""}" style="--tint: var(--t-${s.product}); --glow: ${p.glow}">
      <div class="kind">${s.now ? `<span class="here"><i></i>You are here</span>` : `<span class="tag">Product</span>`}<span class="tag">${esc(p.status)}</span></div>
      <div class="who"><span class="badge"><img src="${base}${esc(p.icon)}" alt="" width="40" height="40" style="view-transition-name: icon-${s.product}"></span><h3>${esc(p.name)}</h3></div>
      <p class="tagline">${esc(p.tagline)}</p>
      <p class="note">${esc(p.note)}</p>
      ${p.stat ? `<div class="stat"><b>${esc(p.stat[0])}</b><span>${esc(p.stat[1])}</span></div>` : ""}
      <p class="stack">${p.stack.slice(0, 4).map((t) => esc(t.toLowerCase())).join(" · ")}</p>
      <a class="go" href="${base}work/${s.product}/">Case study <span aria-hidden="true">→</span></a>
      <a class="shot" href="${base}work/${s.product}/" tabindex="-1" aria-hidden="true" style="view-transition-name: shot-${s.product}"><img src="${base}${esc(p.full)}" alt="" width="${p.fullSize[0]}" height="${p.fullSize[1]}"></a>
    </article>`;
}
function stopCard(s, base) {
  if (s.product) return productCard(s, base);
  const place = `<span class="place${s.place ? "" : " online"}">${esc(stopTag(s))}</span>`;
  if (s.small) {
    return `<article class="card small"><div class="kind"><span class="tag">${esc(s.kind)}</span>${place}</div><div class="who">${badge(s.mark)}<div><h3>${esc(s.title)}</h3><p class="org">${esc(s.org)}</p></div></div></article>`;
  }
  return `<article class="card${s.steps ? " milestone" : ""}">
      <div class="kind"><span class="tag">${esc(s.kind)}</span>${place}</div>
      <div class="who">${badge(s.mark)}<div><h3>${esc(s.title)}</h3><p class="org">${esc(s.org)}</p></div></div>
      ${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
      ${s.steps ? `<ol class="steps">${s.steps.map(([d, t]) => `<li><span class="mono">${esc(d)}</span><span>${esc(t)}</span></li>`).join("")}</ol>` : ""}
      ${s.highlight ? `<p class="highlight"><span class="live"></span>${esc(s.highlight)}</p>` : ""}
      ${s.stat ? `<div class="stat"><b>${esc(s.stat[0])}</b><span>${esc(s.stat[1])}</span></div>` : ""}
      ${s.links ? `<p class="links-row">${s.links.map(([t, u]) => ext(u, t)).join("")}</p>` : ""}
    </article>`;
}
// The chapter card: the place, its years, and a pin per place with how many stops happened there.
function chapterCard(ch) {
  const stops = STOPS.filter((s) => s.region === ch.id);
  const online = stops.filter((s) => !s.place);
  const row = (to, dot, name, sub, n) =>
    `<li><a href="#stop-${to}" data-to="${to}"><i class="${dot}"></i><span>${esc(name)}<small>${esc(sub)}</small></span><span class="count">${n} stop${n > 1 ? "s" : ""}</span></a></li>`;
  const rows = ch.places.map((k) => row(stops.find((s) => s.place === k).id, "", PLACES[k].label, PLACES[k].sub, stops.filter((s) => s.place === k).length)).join("") +
    (online.length ? row(online[0].id, "online", "Online", "Remote programs", online.length) : "");
  return `<span class="tag">Chapter ${ch.n}</span><h3>${esc(ch.name)}</h3><span class="years">${esc(ch.years)} · ${stops.length} stops</span><ul>${rows}</ul>`;
}

// ---------- Layout ----------
function layout({ title, description, base, path, body, ogImage, head = "" }) {
  const pageTitle = title === SITE.title ? title : `${title} · ${SITE.title}`;
  const canonical = absolute(path);
  const og = ogImage ? absolute(ogImage) : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#FAFAFB" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#09090B" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(pageTitle)}">
<meta property="og:description" content="${esc(description)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">\n<meta property="og:url" content="${esc(canonical)}">` : ""}
${og ? `<meta property="og:image" content="${esc(og)}">\n<meta name="twitter:card" content="summary_large_image">` : `<meta name="twitter:card" content="summary">`}
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="${base}styles.css">
<script>try{var t=localStorage.getItem("so-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add("js")</script>
${head}<script src="${base}site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="frame" id="main">
  <div class="row pad top rise" style="--i:0"><a href="${base || "./"}"><strong>${esc(ME.name.toLowerCase())}</strong></a><span>/ ${esc(ME.title.toLowerCase())}</span><span class="grow"></span><span>${esc(ME.place.toLowerCase())} · <span data-clock data-tz="${esc(ME.timeZone)}"></span> et</span></div>
${body}
  <section class="row pad contact" id="contact" aria-label="Contact"><span class="tag">Contact</span><a class="mail" href="mailto:${esc(ME.email)}">${esc(ME.email)}</a><span class="links">${ext(ME.linkedin, "linkedin")}${ext(ME.github, "github")}</span></section>
  <footer class="row pad foot"><span>© ${new Date().getFullYear()} ${esc(ME.name)}</span><span class="mono">Map data: Natural Earth · <span data-clock data-tz="${esc(ME.timeZone)}"></span> in ${esc(ME.place)}</span></footer>
</div>
<nav class="dock" aria-label="Quick links">
  <a href="${base || "./"}" aria-label="Home" title="Home">${icon("home")}</a>
  <a href="${base}#road" aria-label="The road" title="The road">${icon("road")}</a>
  <span class="sep" aria-hidden="true"></span>
  <a href="${esc(ME.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">${icon("linkedin")}</a>
  <a href="${esc(ME.github)}" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">${icon("github")}</a>
  <a href="mailto:${esc(ME.email)}" data-copy="${esc(ME.email)}" aria-label="Copy email address" title="Copy email">${icon("mail")}</a>
  <a href="${base}${esc(ME.resume.file)}" download aria-label="Download resume (PDF)" title="Download resume">${icon("resume")}</a>
  <span class="sep" aria-hidden="true"></span>
  <button type="button" data-theme-toggle aria-label="Switch light or dark" title="Light or dark">${icon("moon")}</button>
</nav>
<div class="toast" role="status" hidden></div>
</body>
</html>
`;
}

// ---------- Home ----------
export function homePage() {
  const base = "";
  const resumeHref = esc(ME.resume.file);

  const hero = `
  <div class="dim" aria-hidden="true"><span>2016 → today</span></div>
  <section class="row hero" aria-label="About">
    <div class="pad">
      <span class="tag rise" style="--i:1">Profile</span>
      <h1 class="rise" style="--i:2">${esc(ME.name).replace(" ", "<br>")}</h1>
      <p class="intro rise" style="--i:3">${esc(ME.intro)}</p>
      <div class="statuses rise" style="--i:4">
        <span class="status"><span class="live"></span>Currently building ${esc(ME.currently)}</span>
        <span class="auth">${esc(ME.workAuth)}</span>
      </div>
      <div class="actions rise" style="--i:5">
        <a class="btn primary" href="${resumeHref}" download>${icon("download")}Download resume</a>
        <a class="btn" href="#road">Take the road <span aria-hidden="true">→</span></a>
      </div>
    </div>
    <dl class="spec rise" style="--i:6">
      ${ME.spec.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
      <div><dt>Links</dt><dd><a href="${esc(ME.github)}" target="_blank" rel="noopener">GitHub</a> · <a href="${esc(ME.linkedin)}" target="_blank" rel="noopener">LinkedIn</a> · <a href="${resumeHref}" download>Resume</a></dd></div>
    </dl>
  </section>`;

  const emblems = `
  <section class="row pad legend" aria-labelledby="h-along">
    <div class="legend-head"><h2 class="tag" id="h-along">Along the way</h2><p>Everything on the road below. Pick one to go there.</p></div>
    <div class="emblems">${EMBLEMS.map((e, i) => {
      const p = e.product && PRODUCTS[e.product];
      const mark = p ? `<span class="mark"><img src="${esc(p.icon)}" alt="" width="52" height="52"></span>` : `<span class="mark ${MARKS[e.mark].cls}" aria-hidden="true">${markInner(e.mark)}</span>`;
      return `<a class="emblem rise" style="--i:${7 + i}" href="#stop-${e.to}" data-to="${e.to}">${mark}<b>${esc(p ? p.name : e.name)}</b><small>${esc(e.sub)}</small></a>`;
    }).join("")}</div>
  </section>`;

  // The road, vertical: a chapter card (with its own small map) opens each place, then that place's stops.
  let stops = "";
  CHAPTERS.forEach((ch) => {
    stops += `
        <li class="v-chapter" id="chapter-${ch.id}"><div class="chapter" data-chapter="${ch.id}"><canvas class="chapter-map" data-chapter="${ch.id}" aria-hidden="true"></canvas>${chapterCard(ch)}</div></li>`;
    STOPS.filter((s) => s.region === ch.id).forEach((s) => {
      const size = s.product ? "product" : s.small ? "small" : s.steps ? "milestone" : "regular";
      stops += `
        <li class="v-stop" id="stop-${s.id}" data-id="${s.id}" data-region="${s.region}" data-place="${s.place || ""}" data-view="${s.view}" data-year="${esc(s.year)}" data-title="${esc(stopTitle(s))}" data-tag="${esc(stopTag(s))}" data-size="${size}"${s.now ? " data-now" : ""}>
          <span class="node"><span class="pill">${esc(s.year)}</span></span>
          ${stopCard(s, base)}
        </li>`;
    });
  });

  // What the map script needs: places, chapters, routes. Map outlines load from data/ on wide screens.
  const journey = JSON.stringify({ places: PLACES, chapters: CHAPTERS, legs: LEGS }).replace(/</g, "\\u003c");

  const road = `
  <section class="row road" id="road" aria-labelledby="h-road">
    <div class="pad road-head"><div><span class="tag">The road so far</span><h2 id="h-road">${esc(ROAD.title)}</h2></div><p class="hint">${esc(ROAD.hint)}</p></div>
    <div class="v-road">
      <span class="track" aria-hidden="true"></span><span class="route" aria-hidden="true"></span>
      <ol class="v-stops">${stops}
      </ol>
    </div>
    <div class="v-next" data-next><div><span class="pill">Next</span><p>${esc(NEXT)}</p><small>The road keeps going.</small></div></div>
    <div class="gps off" aria-live="polite"><span class="live"></span><span class="txt"></span><span class="bar"><i></i></span><span class="pct">0%</span></div>
    <script type="application/json" id="journey-data">${journey}</script>
  </section>`;

  const why = `
  <section class="row two" aria-labelledby="h-why"><div><h2 class="tag" id="h-why">Why I build</h2></div><div class="why">${WHY.map((p) => `<p>${esc(p)}</p>`).join("")}</div></section>`;

  const resume = `
  <section class="row resume" aria-labelledby="h-resume">
    <div class="doc"><span class="sheet" aria-hidden="true"></span><div><h2 class="tag" id="h-resume">Resume</h2><b>${esc(ME.name)}, ${esc(ME.title.toLowerCase())}</b><small>PDF · ${ME.resume.pages} page · updated ${esc(ME.resume.updated)}</small></div></div>
    <a class="btn primary" href="${resumeHref}" download>${icon("download")}Download resume</a>
  </section>`;

  // d3 (projections) and topojson (outline decoding) power the map; the page works without them.
  const head = `<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js" defer></script>
<link rel="preload" href="data/countries-110m.json" as="fetch" crossorigin>
<link rel="preload" href="data/us-states-10m.json" as="fetch" crossorigin>
`;
  return layout({ title: SITE.title, description: SITE.description, base, path: "/", body: hero + emblems + road + why + resume, ogImage: "og.png", head });
}

// ---------- Case studies ----------
export function casePage(id) {
  const base = "../../";
  const p = PRODUCTS[id];
  const ids = STOPS.filter((s) => s.product).map((s) => s.product).reverse(); // newest first
  const next = ids[(ids.indexOf(id) + 1) % ids.length];
  const [fw, fh] = p.fragSize;

  const body = `
  <article class="case" aria-labelledby="h-case">
    <div class="row pad case-head">
      <a class="back rise" style="--i:1" href="${base}#stop-${id}"><span aria-hidden="true">←</span> Back to the road</a>
      <div class="case-title rise" style="--i:2"><img src="${base}${esc(p.icon)}" alt="" width="52" height="52" style="view-transition-name: icon-${id}"><h1 id="h-case">${esc(p.name)}</h1></div>
      <p class="case-line rise" style="--i:3">${esc(p.tagline)}</p>
    </div>
    <dl class="row meta rise" style="--i:4">${p.meta.map(([k, v, href]) => `<div><dt>${esc(k)}</dt><dd>${href ? ext(href, v) : esc(v)}</dd></div>`).join("")}</dl>
    <div class="row pad"><figure class="frag" style="--tint: var(--t-${id}); --glow: ${p.glow}; view-transition-name: shot-${id}">
      <img src="${base}${esc(p.frag)}" alt="${esc(p.fragAlt)}" width="${fw}" height="${fh}">
      <figcaption>${esc(p.fragCaption)}</figcaption>
    </figure></div>
    <div class="row cols">
      <section class="pad"><h2 class="tag">The problem</h2><p class="problem">${esc(p.problem)}</p></section>
      <section class="pad"><h2 class="tag">What I built</h2><ul class="built">${p.built.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></section>
    </div>
    <div class="row pad case-foot">
      <section><h2 class="tag">Built with</h2><p class="stack">${p.stack.map((t) => esc(t.toLowerCase())).join(" · ")}</p></section>
      <section><h2 class="tag">Where it stands</h2><p>${esc(p.now)}</p></section>
    </div>
    <nav class="row pad next-nav" aria-label="More work">
      <a href="${base}#stop-${id}"><span aria-hidden="true">←</span> Back to the road</a>
      <a href="../${next}/"><img src="${base}${esc(PRODUCTS[next].icon)}" alt="" width="26" height="26"><span><span class="tag">Next</span>${esc(PRODUCTS[next].name)}</span> <span aria-hidden="true">→</span></a>
    </nav>
  </article>`;

  return layout({ title: p.name, description: `${p.tagline} ${p.note}`, base, path: `/work/${id}/`, body, ogImage: p.shot });
}

export function notFoundPage() {
  // Hosts serve 404.html at whatever URL was missed, so this page uses root-absolute paths.
  const body = `
  <section class="row pad lost">
    <span class="tag">Off the map</span>
    <h1>This page isn't on the road.</h1>
    <p>It may have moved. The home page has everything.</p>
    <a class="btn primary" href="/">Back to the start <span aria-hidden="true">→</span></a>
  </section>`;
  return layout({ title: "Page not found", description: SITE.description, base: "/", path: "/404.html", body });
}

export function sitemap() {
  if (!SITE.url) return "";
  const urls = ["/", ...Object.keys(PRODUCTS).map((id) => `/work/${id}/`)].map(absolute);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join("\n")}
</urlset>
`;
}

export function robots() {
  return `User-agent: *\nAllow: /\n${SITE.url ? `Sitemap: ${absolute("sitemap.xml")}\n` : ""}`;
}

export const PRODUCT_IDS = Object.keys(PRODUCTS);
