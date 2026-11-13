// Everything the site says lives in this file. Edit here, then run `npm run build`.

export const SITE = {
  // The live address. It turns on share previews (Open Graph images), canonical links and the sitemap.
  url: "https://samuelowoade.com",
  title: "Samuel Owoade",
  description:
    "Software engineer in Charlotte, NC. Backend systems at Wells Fargo; building Corpayard, Leaty and Threadline. Green card holder.",
};

export const ME = {
  name: "Samuel Owoade",
  initials: "SO",
  title: "Software engineer",
  intro:
    "I build backend systems at Wells Fargo, mostly Java and Spring Boot for mortgage servicing and fraud. Outside it I build products end to end.",
  currently: "Corpayard",
  workAuth: "Green card holder · no sponsorship needed",
  place: "Charlotte, NC",
  timeZone: "America/New_York",
  email: "samuelowoade0428@gmail.com",
  linkedin: "https://www.linkedin.com/in/samuel-owoade/",
  github: "https://github.com/Sammich99",
  // The PDF in src/ that the download buttons serve. Replace the file to update it.
  resume: { file: "Samuel_Owoade_Resume.pdf", updated: "November 2026", pages: 1 },
  spec: [
    ["Role", "Software Engineer II"],
    ["At", "Wells Fargo"],
    ["Based", "Charlotte, NC"],
    ["Work", "U.S. permanent resident"],
    ["Stack", "Java · Spring Boot · TypeScript · Flutter · Kafka"],
  ],
};

export const WHY = [
  "I don't want to just imagine what could exist. I want to be part of making it exist.",
  "I'm curious about how things work, and even more curious about how they could work better. When I run into a problem, my first instinct is to work out how to solve it, then take it from an idea in my head to a product people can use.",
];

// ---- Products: a card on the road, and a case-study page at /work/<id>/ ----
// Pictures: `icon`, `full` (the whole site, scrolled on hover), `frag` (cropped interface for the case study),
// `shot` (share preview).
export const PRODUCTS = {
  corpayard: {
    name: "Corpayard",
    url: "https://corpayard.com",
    icon: "img/icon-corpayard.png",
    full: "img/corpayard-full.jpg", fullSize: [1200, 3500],
    frag: "img/frag-corpayard.jpg", fragSize: [1100, 1268],
    shot: "img/corpayard.jpg",
    status: "Pre-launch",
    tagline: "From call-up to camp, together.",
    note: "A free, independent app that helps Nigerian corps members meet the people going to their orientation camp and get ready together.",
    stack: ["Flutter", "Dart", "Node.js", "TypeScript", "SQLite"],
    glow: "rgba(34,197,94,.45)",
    meta: [["Year", "2026"], ["Status", "Pre-launch"], ["Platforms", "iPhone and Android"], ["Website", "corpayard.com", "https://corpayard.com"]],
    fragAlt: "Corpayard home screen: a connection request from someone going to the same camp, your people, and the getting-ready checklist.",
    fragCaption: "Home, as shown on corpayard.com",
    problem:
      "Prospective corps members are posted to an orientation camp, often in a state they don't know, and usually without knowing anyone else who is going. Getting documents, kit and travel right is something each person works out alone.",
    built: [
      "Matching by actual camp, batch, stream and broad departure area. Never GPS, and discovery stays off until you turn it on.",
      "Every connection is a request and an accept, then direct and squad chats with reporting built in.",
      "Shared squad checklists for documents and kit, with each member's own ticks.",
      "A trip card that sends your journey to family from your own WhatsApp or SMS. The location never leaves your phone.",
      "A camp mode that works offline, and the website and waitlist at corpayard.com.",
    ],
    now: "In development for 2027 Batch A on iPhone and Android. Independent of NYSC and free for corps members.",
  },
  leaty: {
    name: "Leaty",
    url: "https://leaty.ai",
    icon: "img/icon-leaty.png",
    full: "img/leaty-full.jpg", fullSize: [1200, 932],
    frag: "img/frag-leaty.jpg", fragSize: [1100, 835],
    shot: "img/leaty.jpg",
    status: "App Store",
    tagline: "Your semester, figured out.",
    note: "An AI study app for college students. I built its backend and AI features as a part-time engineer with LOCK3DIN.",
    stack: ["TypeScript", "Node.js", "MongoDB", "OpenAI", "AWS S3", "Flutter"],
    glow: "rgba(124,108,242,.5)",
    meta: [["Years", "2024 – Now"], ["Role", "Full-stack & AI engineer, part-time"], ["Get it", "App Store", "https://apps.apple.com/us/app/id6760660353"], ["Website", "leaty.ai", "https://leaty.ai"]],
    fragAlt: "Leaty app icon and headline: Your Semester, Figured Out.",
    fragCaption: "From leaty.ai",
    problem:
      "College students keep courses, syllabi, deadlines and study material in too many places, and it's hard to know what deserves attention next.",
    built: [
      "TypeScript and Node.js services, MongoDB models and REST APIs behind the Flutter app.",
      "Syllabus ingestion, onboarding and learner progress, with course files stored in AWS S3.",
      "OpenAI-backed retrieval over each student's own course resources, with conversations that persist.",
      "Quizzes, flashcards and AI coaching generated from course content.",
      "Question-bank caching, API versioning, rate limiting and free and premium tiers.",
    ],
    now: "Live on the App Store for iPhone. Built with LOCK3DIN.",
  },
  threadline: {
    name: "Threadline",
    url: "https://threadline.digital",
    icon: "img/icon-threadline.png",
    full: "img/threadline-full.jpg", fullSize: [1200, 3500],
    frag: "img/frag-threadline.jpg", fragSize: [1100, 733],
    shot: "img/threadline.jpg",
    status: "Live",
    tagline: "Follow the thought. Keep the thread.",
    note: "Memory that follows you between Claude and ChatGPT, through remote MCP server tools with OAuth and scoped permissions.",
    stat: ["480+", "automated tests"],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "MCP", "OAuth"],
    glow: "rgba(163,190,72,.42)",
    meta: [["Year", "2026"], ["Status", "Live and free"], ["Works with", "Claude and ChatGPT"], ["Website", "threadline.digital", "https://threadline.digital"]],
    fragAlt: "Threadline headline: Follow the thought. Keep the thread. With Add to Claude and Use with ChatGPT buttons.",
    fragCaption: "From threadline.digital",
    problem:
      "What you work out with one AI assistant stays with that assistant. Switch from ChatGPT to Claude and you start explaining from scratch.",
    built: [
      "A Next.js and TypeScript web app, and remote MCP server tools backed by PostgreSQL.",
      "Save notes from Claude or ChatGPT into topic-sorted projects, then recall them in either.",
      "OAuth with PKCE, refresh-token rotation and scoped permissions, so you choose what each assistant can see.",
      "Idempotent saves and structured topic classification, covered by over 480 automated tests.",
      "Imports from ChatGPT exports, file uploads, and project backup and restore.",
    ],
    now: "Live and free at threadline.digital. A Chrome extension is next.",
  },
};


// ---- The journey ----
// Real places on the map. `side` = which side of the pin the label sits (-1 left, 1 right);
// `dy` nudges labels apart when places are close and the map is zoomed out; `short` is used on small maps.
export const PLACES = {
  babcock: { label: "Babcock University", short: "Babcock", sub: "Ilishan-Remo, Ogun State", lon: 3.718, lat: 6.893, side: 1, dy: 14 },
  ibadan: { label: "Ibadan", sub: "Oyo State · home", lon: 3.947, lat: 7.378, side: 1, dy: -14 },
  lagos: { label: "Lagos", sub: "Murtala Muhammed International Airport", lon: 3.321, lat: 6.577, side: -1 },
  kennesaw: { label: "Kennesaw", sub: "Kennesaw State University", lon: -84.58, lat: 34.04, side: -1 },
  newyork: { label: "New York", sub: "Bloomberg", lon: -74.006, lat: 40.713, side: 1 },
  charlotte: { label: "Charlotte", sub: "Wells Fargo", lon: -80.843, lat: 35.227, side: 1 },
};

// Chapters: one per place Samuel was based. Each opens with an overview of its pins.
export const CHAPTERS = [
  { id: "ng", n: 1, name: "Nigeria", years: "2016 – 2021", places: ["babcock", "ibadan"] },
  { id: "ga", n: 2, name: "Kennesaw, Georgia", years: "2022 – 2023", places: ["kennesaw", "newyork"] },
  { id: "nc", n: 3, name: "Charlotte, North Carolina", years: "2024 – now", places: ["charlotte"] },
];

// Routes drawn on the map, in order. Roads are dashed; the flight is solid with a plane.
export const LEGS = [
  { id: "bab-iba", from: "babcock", to: "ibadan", style: "road" },
  { id: "iba-lag", from: "ibadan", to: "lagos", style: "road" },
  { id: "flight", from: "lagos", to: "kennesaw", style: "flight", km: true, caption: "Lagos → United States" },
  { id: "ken-ny", from: "kennesaw", to: "newyork", style: "road" },
  { id: "hop", from: "kennesaw", to: "charlotte", style: "road", km: true, caption: "Kennesaw → Charlotte" },
];

// Logos: small coloured tiles. `svg` marks are drawn in templates.mjs.
export const MARKS = {
  ksu: { cls: "b-ksu", text: "KSU" },
  wf: { cls: "b-wf", text: "WF" },
  bloom: { cls: "b-bloom", text: "B" },
  babcock: { cls: "b-babcock", text: "BU" },
  jpmc: { cls: "b-jpmc", text: "JPMC" },
  ms: { cls: "b-ms", svg: "microsoft" },
  poise: { cls: "b-poise", text: "P" },
  jobberman: { cls: "b-jobberman", text: "J" },
  gc: { cls: "b-gc", svg: "greencard" },
  trophy: { cls: "b-trophy", svg: "trophy" },
};

// The road, oldest first.
//   place: a key in PLACES (null = online)   tag: the place shown on the card
//   view:  what the map shows while you read it (ngLocal, ga, east, nc)
//   small: a certificate waypoint   product: a product card   now: "You are here"
export const STOPS = [
  { id: "mcp", region: "ng", place: "babcock", tag: "Babcock University", view: "ngLocal", year: "Apr 2017", small: true, kind: "Certificate", mark: "ms", title: "Microsoft Certified Professional", org: "Microsoft" },
  { id: "psense", region: "ng", place: "babcock", tag: "Babcock University", view: "ngLocal", year: "Feb 2020", small: true, kind: "Certificate", mark: "poise", title: "PSENSE Employability Skills", org: "Poise Nigeria" },
  { id: "bs", region: "ng", place: "babcock", tag: "Ogun State, Nigeria", view: "ngLocal", year: "Aug 2020", kind: "Education", mark: "babcock", title: "B.S. Computer Science", org: "Babcock University · 2016 – 2020" },
  { id: "jobberman", region: "ng", place: "ibadan", tag: "Ibadan", view: "ngLocal", year: "Nov 2021", small: true, kind: "Certificate", mark: "jobberman", title: "Soft-Skills Training", org: "Jobberman · Ibadan" },
  { id: "dtw", region: "ga", place: "kennesaw", tag: "Kennesaw, GA", view: "ga", year: "Aug 2022", kind: "Work", mark: "ksu", title: "Backend Engineer", org: "Down to the Wire, Kennesaw State · 2022 – 2023",
    note: "Spring Boot APIs and Dijkstra-based routing for a trip planner that combines travel options in one itinerary.", stat: ["35,000+", "Kennesaw State users served"] },
  { id: "cday22", region: "ga", place: "kennesaw", tag: "Kennesaw, GA", view: "ga", year: "Fall 2022", kind: "Award", mark: "trophy", title: "1st place, Graduate Capstone", org: "KSU C-Day · Geometry Matching Task",
    note: "A game built on the basics of brain and muscle recovery, to help patients through rehabilitation after brain injury. Team of four, supervised by Dr. Sungchul Jung.",
    links: [["C-Day archive", "https://campus.kennesaw.edu/colleges-departments/ccse/events/computing-showcase/docs/fall-2022-c-day-ccse-archive.pdf"]] },
  { id: "bloomberg", region: "ga", place: "newyork", tag: "Online + New York", view: "east", year: "Jun 2023", small: true, kind: "Program", mark: "bloom", title: "Accelerator Summer Program", org: "Bloomberg · algorithms and system design" },
  { id: "jpmc", region: "ga", place: null, tag: "Online", view: "ga", year: "Jun 2023", small: true, kind: "Certificate", mark: "jpmc", title: "Software Engineering Virtual Experience", org: "JPMorgan Chase · TypeScript, Java, Python" },
  { id: "cday23", region: "ga", place: "kennesaw", tag: "Kennesaw, GA", view: "ga", year: "Fall 2023", kind: "Award", mark: "trophy", title: "3rd place, Graduate Capstone", org: "KSU C-Day · Transportation as a Service",
    note: "Combines transport options into a single route from origin to destination, using mapping APIs. Team of five, supervised by Dr. Reza Parizi.",
    links: [["Presentation", "https://youtu.be/4J-k-4dQ8fc"], ["Poster", "https://digitalcommons.kennesaw.edu/cgi/viewcontent.cgi?article=1373&context=cday"], ["Winners", "https://campus.kennesaw.edu/colleges-departments/ccse/events/computing-showcase/fa23-cday-winners.php#gc"]] },
  { id: "ms", region: "ga", place: "kennesaw", tag: "Kennesaw, GA", view: "ga", year: "Dec 2023", kind: "Education", mark: "ksu", title: "M.S. Software Engineering", org: "Kennesaw State University", stat: ["4.0", "GPA"] },
  { id: "wf1", region: "nc", place: "charlotte", tag: "Charlotte, NC", view: "nc", year: "Jan 2024", kind: "Work", mark: "wf", title: "Software Engineer I", org: "Wells Fargo",
    note: "Kafka-driven services that gave fraud teams live case data in place of batch reports.", stat: ["80%+", "automated test coverage"] },
  { id: "leaty", region: "nc", place: "charlotte", view: "nc", year: "Oct 2024", product: "leaty" },
  { id: "wf2", region: "nc", place: "charlotte", tag: "Charlotte, NC", view: "nc", year: "Jan 2025", kind: "Work", mark: "wf", title: "Software Engineer II", org: "Wells Fargo",
    note: "Own a mortgage-servicing platform. Led its move to OpenShift and the Java 17 / Spring Boot 3 upgrade.", stat: ["60%", "shorter regression cycles"] },
  { id: "threadline", region: "nc", place: "charlotte", view: "nc", year: "2026", product: "threadline" },
  { id: "gc", region: "nc", place: "charlotte", tag: "Charlotte, NC", view: "nc", year: "Aug 2026", kind: "Milestone", mark: "gc", title: "Green card", org: "EB-2 National Interest Waiver",
    steps: [["Apr 2024", "Filed the EB-2 NIW petition. Denied."], ["Mar 2025", "Refiled."], ["Apr 2025", "Approved."], ["Mar 2026", "Filed for adjustment of status."], ["Aug 2026", "Green card received."]],
    highlight: "U.S. permanent resident. No visa sponsorship needed." },
  { id: "corpayard", region: "nc", place: "charlotte", view: "nc", year: "Now", product: "corpayard", now: true },
];

export const NEXT = "Corpayard launches for 2027 Batch A, on iPhone and Android.";

// "Along the way": every emblem at once. Each jumps to its stop on the road.
export const EMBLEMS = [
  { to: "corpayard", product: "corpayard", sub: "building now" },
  { to: "threadline", product: "threadline", sub: "live" },
  { to: "leaty", product: "leaty", sub: "app store" },
  { to: "wf2", mark: "wf", name: "Wells Fargo", sub: "2024 – now" },
  { to: "gc", mark: "gc", name: "Green card", sub: "aug 2026" },
  { to: "cday22", mark: "trophy", name: "KSU C-Day", sub: "1st & 3rd place" },
  { to: "ms", mark: "ksu", name: "Kennesaw State", sub: "m.s. · 4.0" },
  { to: "bs", mark: "babcock", name: "Babcock University", sub: "b.s. · 2016 – 2020" },
  { to: "jpmc", mark: "jpmc", name: "JPMorgan Chase", sub: "2023" },
  { to: "bloomberg", mark: "bloom", name: "Bloomberg", sub: "2023" },
  { to: "mcp", mark: "ms", name: "Microsoft", sub: "certified · 2017" },
];

export const ROAD = {
  title: "From Babcock University in Nigeria to building my own products in Charlotte.",
  hint: "Scroll to travel. Each stop is something I learned, earned, built or shipped.",
};
