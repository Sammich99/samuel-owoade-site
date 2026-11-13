# Samuel Owoade, personal site

The site for **samuelowoade.com**, drawn like a blueprint. The home page tells the story as a journey over a real map, in three chapters: Nigeria (Babcock University, Ibadan), a flight from Lagos to Kennesaw, Georgia (with Bloomberg in New York), then the drive to Charlotte, North Carolina, ending at "You are here: Corpayard". Each product has its own case-study page. Plain HTML, CSS and a little JavaScript, built by a small Node script with no dependencies and no tracking.

## Edit

Everything the site says is in [`src/content.mjs`](src/content.mjs). Change it there, then build.

| To change | Edit |
| --- | --- |
| Name, intro, work status, spec sheet, links | `ME` in `src/content.mjs` |
| Stops on the road (jobs, degrees, certificates, milestones) | `STOPS` |
| Pins on the map (name, coordinates, which side the label sits) | `PLACES` |
| Chapters and the places in each | `CHAPTERS` |
| Lines on the map (roads, the flight, the drive) | `LEGS` |
| Products and their case studies | `PRODUCTS` |
| The emblems under "Along the way" | `EMBLEMS` |
| Markup | `src/templates.mjs` |
| Colours, type, spacing, dark mode | `src/styles.css` |
| The map journey, chapter maps, GPS, dock, theme switch | `src/site.js` |
| Map outlines | `src/data/` (see "Map data") |
| Images | `src/img/` |
| Resume | replace `src/Samuel_Owoade_Resume.pdf` (and `ME.resume.updated`) |

**Add a stop:** add an entry to `STOPS` in date order with its chapter (`region`), `place` (a key of `PLACES`, or `null` for online), `view` (which part of the map to show) and `year`. Use `small: true` for a certificate, `stat` for a headline number, `steps` for a dated mini-timeline. Logos are coloured tiles defined in `MARKS`.

**Add a product:** add it to `PRODUCTS`, with a full-length screenshot of its site (`full`, scrolled on hover), a cropped interface piece (`frag`), a share screenshot (`shot`) and an icon. Then add a stop with `product: "<id>"`. Its page is created at `/work/<id>/`.

## How the journey works

- The page is built as a **vertical road** with a card for each chapter, so it's complete without JavaScript, on phones, and for anyone with Reduce Motion turned on. With JavaScript, each chapter card gets a small map of its places.
- On screens 900px and wider, `site.js` rebuilds the same cards as a **sideways journey over a map**:
  - the section holds still while you scroll, and you travel to the right along a winding road;
  - each chapter opens with an overview of its pins, then its stops alternate above and below the road;
  - the map camera follows you: Nigeria, out to the globe for the flight from Lagos, down to Georgia and the U.S. East Coast, then to the Carolinas;
  - a green route draws behind you, and the dock steps aside for a **GPS pill** that says where you are.
- Distances on the map (for example the flight and the drive) are calculated from the coordinates in `PLACES`.
- Clicking a place in a chapter card jumps to its stops. "Back to the road" on a case study returns to that product's stop.
- If the map libraries or data can't load, the page stays as the vertical road without maps.

## Map data

- Country and U.S. state outlines are from [Natural Earth](https://www.naturalearthdata.com/) (public domain), via the `world-atlas` (countries, 1:110m) and `us-atlas` (states, 1:10m, trimmed to states only) packages. They live in `src/data/`.
- The map is drawn with [d3](https://d3js.org/) 7.9.0 and topojson 3.0.2, loaded from cdnjs on the home page only.

## Build and preview

Needs Node 18 or newer.

```sh
npm run build     # writes the site to dist/
npm run preview   # builds, then serves dist/ at http://localhost:4321
```

All links inside the site are relative, so `dist/` works at a domain root or in a subfolder. (The 404 page uses root paths, so it looks right only at a domain root. The maps need the site served over http, so they don't appear when `dist/index.html` is opened straight from disk.)

## Deploy (Netlify, samuelowoade.com)

The domain was bought on Netlify. `netlify.toml` holds the settings: build command `npm run build`, publish folder `dist`, the `www` address sending visitors to `samuelowoade.com`, and a few security headers. Keep this site on your own Netlify team, separate from Corpayard's, so the two never share build credits.

The Netlify site is **samuelowoade** (https://samuelowoade.netlify.app) on the samuelowoade team, first deployed 13 November 2026. `samuelowoade.com` and `www.samuelowoade.com` point to it through Netlify DNS, and Netlify renews the HTTPS certificate itself.

On a new computer, sign in and link this folder once:

```sh
netlify login
netlify link --name samuelowoade
```

To publish an update:

```sh
npm run build && netlify deploy --prod --dir dist --no-build
```

`SITE.url` in `src/content.mjs` is set to `https://samuelowoade.com`. That gives share previews on LinkedIn, X and iMessage (`og.png` for the home page, each product's screenshot for its case study), canonical links, `sitemap.xml` and a sitemap line in `robots.txt`. Change it only if the domain changes.

## Notes

- Light mode uses a light, neutral palette with each product's tint; dark mode uses a near-black palette with soft glows behind the products.
- **Fonts:** Geist and Geist Mono, from Google Fonts.
- **Motion:** the hero blurs in, cards slide in, the route draws, product screenshots scroll through the whole site on hover, dock icons grow under the cursor, and opening a product morphs its picture into the case study (Chrome and Safari). Reduce Motion turns all of that off, and Reduce Transparency removes the blur behind the dock and GPS.
- **The public resume leaves out your phone number** (removed 13 November 2026). When you replace the PDF, export it without the number too.
- **Screenshots:** the product images come from corpayard.com, leaty.ai and threadline.digital, captured 13 November 2026. Retake them when those sites change.
