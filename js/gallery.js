// ══════════════════════════════════════════════════
// gallery.js — Wild Gallery | The Fox & The Winter Moon
// Data: iNaturalist API (Vulpes vulpes, casual grade)
// ══════════════════════════════════════════════════

// ── Config ──
const API_BASE   = "https://api.inaturalist.org/v1/observations";
const TAXON_ID   = 42069;   // Vulpes vulpes
const PER_PAGE   = 9;       // foto per load

// iNaturalist place_id per wilayah
const PLACE_IDS = {
  "ALL"          : null,
  "EUROPE"       : 97391,
  "ASIA"         : 97395,
  "NORTH AMERICA": 97394,
  "AFRICA"       : 97392,
  "OCEANIA"      : 97393,
};

// State
let currentRegion = "ALL";
let currentPage   = 1;
let isLoading     = false;
let totalResults  = 0;

// ── Page overlay fade in ──
window.addEventListener("load", () => {
  const overlay = document.getElementById("page-overlay");
  if (overlay) {
    overlay.style.transition = "opacity 0.8s ease";
    setTimeout(() => { overlay.style.opacity = "0"; overlay.style.pointerEvents = "none"; }, 100);
  }
});

// ── Fade out helper ──
function fadeOut(href) {
  const overlay = document.getElementById("page-overlay");
  if (overlay) {
    overlay.style.transition = "opacity 0.6s ease";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "all";
  }
  setTimeout(() => window.location.href = href, 650);
}

// ── Nav links ──
document.addEventListener("DOMContentLoaded", () => {
  const logoLink = document.getElementById("logo-link");
  const backBtn  = document.getElementById("back-more-btn");
  if (logoLink) logoLink.addEventListener("click", e => { e.preventDefault(); fadeOut("../index.html"); });
  if (backBtn)  backBtn.addEventListener("click",  e => { e.preventDefault(); fadeOut("more.html"); });
});

// ── Stars ──
const sc = document.getElementById("star-container");
if (sc) {
  for (let i = 0; i < 60; i++) {
    const s = document.createElement("div");
    const sz = Math.random() * 2 + 1 + "px";
    s.style.cssText = `
      position:absolute; background:white; border-radius:50%;
      opacity:0; animation:twinkle linear infinite;
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      width:${sz}; height:${sz};
      animation-duration:${Math.random()*3+2}s;
      animation-delay:${Math.random()*4}s;
    `;
    sc.appendChild(s);
  }
}

// ── Snow ──
const snc = document.getElementById("snow-container");
if (snc) {
  for (let i = 0; i < 40; i++) {
    const sf = document.createElement("div");
    const sz = Math.random() * 3 + 2 + "px";
    sf.style.cssText = `
      position:absolute; top:-20px; background:white; border-radius:50%;
      opacity:0.6; pointer-events:none; filter:blur(0.5px);
      animation:fall linear infinite;
      left:${Math.random()*100}vw; width:${sz}; height:${sz};
      animation-duration:${Math.random()*10+5}s;
      animation-delay:${Math.random()*5}s;
    `;
    snc.appendChild(sf);
  }
}

// ── Scroll reveal ──
const revealObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("active"); obs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

// ══════════════════════════════════════════════════
// FETCH dari iNaturalist API
// ══════════════════════════════════════════════════
async function fetchObservations(region = "ALL", page = 1) {
  const placeId = PLACE_IDS[region];

  let url = `${API_BASE}?taxon_id=${TAXON_ID}`
          + `&photos=true`
          + `&quality_grade=research`
          + `&per_page=${PER_PAGE}`
          + `&page=${page}`
          + `&order=desc&order_by=created_at`;

  if (placeId) url += `&place_id=${placeId}`;

  const resp = await fetch(url);
  if (!resp.ok) throw new Error("API error: " + resp.status);
  return await resp.json();
}

// ══════════════════════════════════════════════════
// BUILD CARD HTML dari satu observasi
// ══════════════════════════════════════════════════
function buildCard(obs) {
  // Ambil URL foto — ganti 'square' atau 'small' dengan 'medium'
  let photoUrl = obs.photos?.[0]?.url || "";
  photoUrl = photoUrl
    .replace("/square.", "/medium.")
    .replace("/small.",  "/medium.");

  // Fallback kalau tidak ada foto
  if (!photoUrl) return null;

  const lokasi   = (obs.place_guess || "Unknown Location").toUpperCase();
  const tahun    = obs.observed_on ? obs.observed_on.slice(0, 4) : "";
  const observer = (obs.user?.login || "Anonymous").toUpperCase();
  const region   = guessRegion(obs.place_guess || "");

  return `
    <div class="gallery-card group relative rounded-xl overflow-hidden"
         style="aspect-ratio:4/3"
         data-region="${region}"
         data-id="${obs.id}">
      <!-- Shimmer skeleton -->
      <div class="absolute inset-0 shimmer z-0" style="background:#0c1324"></div>
      <!-- Foto -->
      <img alt="${obs.place_guess || 'Red Fox'}"
           class="relative z-10 w-full h-full object-cover"
           src="${photoUrl}"
           loading="lazy"
           onerror="this.closest('.gallery-card').style.display='none'" />
      <!-- Hover overlay -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
           style="background:linear-gradient(to top, rgba(0,0,0,0.85), transparent)"></div>
      <!-- Label -->
      <div class="absolute bottom-0 left-0 p-6 text-white z-30 transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
        <p class="font-fantasy text-xs mb-1 tracking-widest" style="color:#34D399">VULPES VULPES</p>
        <p class="font-fantasy text-base font-bold flex items-center gap-1"><i class="ph-bold ph-map-pin"></i> ${lokasi}${tahun ? " · " + tahun : ""}</p>
        <p class="font-fantasy text-xs mt-2 tracking-tighter text-white/60 flex items-center gap-1"><i class="ph-bold ph-user"></i> ${observer}</p>
      </div>
      <!-- Link ke iNaturalist -->
      <a href="https://www.inaturalist.org/observations/${obs.id}"
         target="_blank" rel="noopener"
         class="absolute inset-0 z-40 opacity-0"
         title="Lihat di iNaturalist"></a>
    </div>
  `;
}

// ── Tebak region dari nama lokasi ──
function guessRegion(placeGuess) {
  const p = placeGuess.toLowerCase();
  const europeKw    = ["norway","sweden","finland","uk","england","scotland","germany","france","spain","italy","netherlands","denmark","poland","russia","ukraine","switzerland","austria","portugal","greece","hungary","czech","romania","belgium","ireland","croatia"];
  const asiaKw      = ["japan","china","korea","india","taiwan","thailand","indonesia","malaysia","vietnam","philippines","mongolia","kazakhstan","iran","turkey","israel","syria","iraq","pakistan","nepal","bangladesh","singapore"];
  const northAmKw   = ["usa","united states","canada","mexico","alaska","california","new york","texas","florida","ontario","british columbia","alberta"];
  const africaKw    = ["morocco","algeria","egypt","ethiopia","kenya","nigeria","south africa","tanzania","uganda","ghana","cameroon","senegal","mali","libya","tunisia","somalia"];
  const oceaniaKw   = ["australia","new zealand","papua","fiji"];

  if (europeKw.some(k  => p.includes(k))) return "EUROPE";
  if (asiaKw.some(k    => p.includes(k))) return "ASIA";
  if (northAmKw.some(k => p.includes(k))) return "NORTH AMERICA";
  if (africaKw.some(k  => p.includes(k))) return "AFRICA";
  if (oceaniaKw.some(k => p.includes(k))) return "OCEANIA";
  return "ALL";
}

// ══════════════════════════════════════════════════
// RENDER ke gallery grid
// ══════════════════════════════════════════════════
function renderCards(observations, append = false) {
  const grid  = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  const loadMoreBtn = document.getElementById("load-more-btn");

  if (!grid) return;

  // Kalau reset (bukan append), kosongkan grid
  if (!append) grid.innerHTML = "";

  // Filter yang punya foto valid
  const valid = observations.filter(o => o.photos?.length > 0);

  if (valid.length === 0 && !append) {
    if (empty) empty.classList.remove("hidden");
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
    return;
  }

  if (empty) empty.classList.add("hidden");

  valid.forEach(obs => {
    const html = buildCard(obs);
    if (html) grid.insertAdjacentHTML("beforeend", html);
  });

  // Tampilkan/sembunyikan Load More
  const loaded = grid.querySelectorAll(".gallery-card").length;
  if (loadMoreBtn) {
    loadMoreBtn.style.display = loaded >= totalResults ? "none" : "block";
  }
}

// ══════════════════════════════════════════════════
// SKELETON saat loading
// ══════════════════════════════════════════════════
function showSkeleton() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  grid.innerHTML = "";
  for (let i = 0; i < PER_PAGE; i++) {
    grid.insertAdjacentHTML("beforeend", `
      <div class="gallery-card relative rounded-xl overflow-hidden" style="aspect-ratio:4/3">
        <div class="absolute inset-0 shimmer" style="background:#0c1324"></div>
        <div class="absolute bottom-6 left-6 space-y-2">
          <div class="h-3 w-24 rounded shimmer" style="background:#1a2340"></div>
          <div class="h-4 w-36 rounded shimmer" style="background:#1a2340"></div>
        </div>
      </div>
    `);
  }
}

// ══════════════════════════════════════════════════
// LOAD GALLERY (reset atau append)
// ══════════════════════════════════════════════════
async function loadGallery(region = "ALL", page = 1, append = false) {
  if (isLoading) return;
  isLoading = true;

  const loadMoreBtn = document.getElementById("load-more-btn");
  if (loadMoreBtn) loadMoreBtn.textContent = "LOADING...";

  if (!append) showSkeleton();

  try {
    const data = await fetchObservations(region, page);
    totalResults = data.total_results || 0;

    // Update stats bar total
    const statsTotal = document.getElementById("stats-total");
    if (statsTotal) statsTotal.textContent = totalResults.toLocaleString() + "+ Records";

    renderCards(data.results || [], append);

  } catch (err) {
    console.error("Gallery fetch error:", err);
    const grid = document.getElementById("gallery-grid");
    if (grid && !append) {
      grid.innerHTML = `
        <div class="col-span-3 text-center py-20">
          <p class="font-fantasy text-white/30 tracking-widest uppercase text-sm">
            Failed to load observations. Please check your connection.
          </p>
        </div>
      `;
    }
  } finally {
    isLoading = false;
    if (loadMoreBtn) loadMoreBtn.textContent = "LOAD MORE OBSERVATIONS";
  }
}

// ══════════════════════════════════════════════════
// FILTER BUTTONS
// ══════════════════════════════════════════════════
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // Update active state
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Update state & reload
    currentRegion = btn.dataset.region;
    currentPage   = 1;
    loadGallery(currentRegion, currentPage, false);
  });
});

// ══════════════════════════════════════════════════
// LOAD MORE BUTTON
// ══════════════════════════════════════════════════
const loadMoreBtn = document.getElementById("load-more-btn");
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    loadGallery(currentRegion, currentPage, true);
  });
}

// ══════════════════════════════════════════════════
// DATA PIPELINE BUTTONS
// ══════════════════════════════════════════════════
const rawDataBtn = document.getElementById("raw-data-btn");
if (rawDataBtn) {
  rawDataBtn.addEventListener("click", () => {
    const url = `${API_BASE}?taxon_id=${TAXON_ID}&photos=true&quality_grade=research&per_page=9`;
    window.open(url, "_blank");
  });
}

const inatBtn = document.getElementById("inaturalist-btn");
if (inatBtn) {
  inatBtn.addEventListener("click", () => {
    window.open("https://www.inaturalist.org/observations?taxon_id=42069&quality_grade=research&photos=true", "_blank");
  });
}

// ══════════════════════════════════════════════════
// TERMINAL TYPING ANIMATION
// ══════════════════════════════════════════════════
function startTerminalAnimation() {
  const lines = [
    "> Fetching occurrence data...",
    "> Species: Vulpes vulpes",
    "> Filter: hasImage = true",
    "> Filter: qualityGrade = RESEARCH",
    `> Found ${totalResults.toLocaleString() || "1,422,903"} records.`,
    "> Syncing image CDN...",
    "> Done.",
  ];

  const container = document.querySelector(".font-fantasy.space-y-1");
  if (!container) return;

  container.innerHTML = "";
  lines.forEach((line, i) => {
    setTimeout(() => {
      const p = document.createElement("p");
      p.style.color = "rgba(52,211,153,0.75)";
      p.style.fontSize = "0.75rem";
      p.style.fontFamily = "'Cinzel', serif";
      if (i === lines.length - 1) {
        p.innerHTML = line + '<span class="cursor-blink"></span>';
      } else {
        p.textContent = line;
      }
      container.appendChild(p);
    }, i * 400);
  });
}

// Trigger terminal animation saat section terlihat
const terminalSection = document.querySelector(".font-fantasy.space-y-1");
if (terminalSection) {
  const termObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        startTerminalAnimation();
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  termObs.observe(terminalSection.closest("section") || terminalSection);
}

// ══════════════════════════════════════════════════
// INIT — jalankan saat halaman ready
// ══════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  loadGallery("ALL", 1, false);
});
