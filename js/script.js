document.addEventListener("DOMContentLoaded", () => {
  // === 1. PRELOADER SYSTEM ===
  const preloader = document.getElementById("preloader");
  const modelEl = document.getElementById("fox-3d");
  let modelLoaded = false;
  let modelProgress = 0;
  const minShowMs = 1500;
  const startTime = Date.now();

  function hidePreloaderIfReady() {
    const elapsed = Date.now() - startTime;
    const wait = Math.max(0, minShowMs - elapsed);
    setTimeout(() => {
      if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => {
          preloader.style.display = "none";
        }, 1000);
      }
    }, wait);
  }

  // jika model ada, cek apakah file tersedia (quick HEAD) untuk membantu debugging
  async function checkModelAsset(src) {
    if (!src) return false;
    try {
      const res = await fetch(src, { method: "HEAD" });
      return res.ok;
    } catch (err) {
      return false;
    }
  }

  // overlay error kecil
  function showModelError(msg) {
    console.error(msg);
    const existing = document.getElementById("model-error");
    if (existing) return;
    const overlay = document.createElement("div");
    overlay.id = "model-error";
    overlay.style.position = "fixed";
    overlay.style.left = "50%";
    overlay.style.top = "12px";
    overlay.style.transform = "translateX(-50%)";
    overlay.style.background = "rgba(255,20,20,0.9)";
    overlay.style.color = "white";
    overlay.style.padding = "8px 12px";
    overlay.style.borderRadius = "8px";
    overlay.style.zIndex = "300";
    overlay.style.fontSize = "13px";
    overlay.innerText = `3D model error: ${msg}`;
    document.body.appendChild(overlay);
    // Hide preloader so user sees message
    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => (preloader.style.display = "none"), 500);
    }
  }

  // NEW: fallback helper — ganti model-viewer dengan image jika model hilang/error
  function applyModelFallback() {
    const wrapper = document.getElementById("model-wrapper");
    if (!wrapper) return;
    // remove model-viewer if exists
    const existingModel = document.getElementById("fox-3d");
    if (existingModel && existingModel.parentNode)
      existingModel.parentNode.removeChild(existingModel);

    // create fallback image
    const img = document.createElement("img");
    img.src = "assets/image/fox_forrest.jpg";
    img.alt = "Fallback fox image";
    img.className = "w-full h-full object-cover";
    // clear wrapper and append image
    while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
    wrapper.appendChild(img);

    modelLoaded = true;
    modelProgress = 100;
    updateStatusBadge();
    hidePreloaderIfReady();
  }

  window.addEventListener("load", async () => {
    if (!modelEl) {
      hidePreloaderIfReady();
      return;
    }
    // jika model belum memicu event load, cek asset ketersediaan dulu
    const src = modelEl.getAttribute("src");
    const ok = await checkModelAsset(src);
    if (!ok) {
      // gunakan fallback image agar UI tidak broken
      console.warn(`3D model not found: ${src}. Applying image fallback.`);
      applyModelFallback();
    } else {
      if (modelLoaded) hidePreloaderIfReady();
      // jika belum loaded, tetap tunggu event 'load' dari model-viewer
    }
  });

  if (modelEl) {
    // progress (model-viewer mengirim detail.totalProgress)
    modelEl.addEventListener("progress", (ev) => {
      try {
        const p = ev?.detail?.totalProgress;
        if (typeof p === "number") {
          modelProgress = Math.round(p * 100);
          updateStatusBadge();
        }
      } catch (e) {
        // ignore
      }
    });

    modelEl.addEventListener("load", () => {
      modelLoaded = true;
      modelProgress = 100;
      hidePreloaderIfReady();
      updateStatusBadge();
    });

    modelEl.addEventListener("error", (ev) => {
      const src = modelEl.getAttribute("src");
      console.error(`Model load error for ${src}`, ev);
      // gunakan fallback agar halaman tetap berfungsi
      applyModelFallback();
      // tunjukkan log kecil (opsional)
      showModelError(`failed to load ${src}`);
      updateStatusBadge();
    });
  }

  // === DEBUG STATUS BADGE ===
  function createStatusBadge() {
    if (document.getElementById("status-badge")) return;
    const badge = document.createElement("div");
    badge.id = "status-badge";
    badge.style.position = "fixed";
    badge.style.left = "12px";
    badge.style.bottom = "12px";
    badge.style.padding = "8px 10px";
    badge.style.background = "rgba(0,0,0,0.6)";
    badge.style.color = "white";
    badge.style.fontSize = "12px";
    badge.style.borderRadius = "8px";
    badge.style.zIndex = "200";
    badge.style.backdropFilter = "blur(4px)";
    badge.style.pointerEvents = "none";
    badge.innerText = "status: initializing...";
    document.body.appendChild(badge);
  }

  function updateStatusBadge() {
    const badge = document.getElementById("status-badge");
    if (!badge) return;
    const stars =
      document.getElementById("star-container")?.children.length ?? 0;
    const snows =
      document.getElementById("snow-container")?.children.length ?? 0;
    const loaded = modelLoaded ? "model: ready" : `model: ${modelProgress}%`;
    badge.innerText = `stars: ${stars} · snow: ${snows} · ${loaded}`;
  }

  // createStatusBadge();
  // updateStatusBadge();
  // setInterval(updateStatusBadge, 1000);

  // === 2. STAR SYSTEM (Bintang Berkelip) ===
  const starContainer = document.getElementById("star-container");
  const starCount = 50;

  if (starContainer) {
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 60 + "%";
      star.style.width = Math.random() * 2 + 1 + "px";
      star.style.height = star.style.width;
      star.style.animationDuration = Math.random() * 3 + 2 + "s";
      star.style.animationDelay = Math.random() * 2 + "s";
      starContainer.appendChild(star);
    }
  }

  // === 3. SNOW SYSTEM (Subtle/Halus) ===
  const snowContainer = document.getElementById("snow-container");
  const snowCount = 60;

  if (snowContainer) {
    for (let i = 0; i < snowCount; i++) {
      const snowflake = document.createElement("div");
      snowflake.classList.add("snowflake");
      snowflake.style.left = Math.random() * 100 + "vw";
      const size = Math.random() * 3 + 2 + "px";
      snowflake.style.width = size;
      snowflake.style.height = size;
      const duration = Math.random() * 10 + 5 + "s";
      snowflake.style.animationDuration = duration;
      snowflake.style.animationDelay = Math.random() * 5 + "s";
      snowContainer.appendChild(snowflake);
    }
  }

  // === SNOW: CTA + FOOTER ===
  ["cta-snow", "footer-snow"].forEach((id) => {
    const container = document.getElementById(id);
    if (!container) return;
    const count = id === "footer-snow" ? 25 : 40;
    for (let i = 0; i < count; i++) {
      const sf = document.createElement("div");
      sf.classList.add("snowflake");
      sf.style.left = Math.random() * 100 + "vw";
      const size = Math.random() * 2.5 + 1.5 + "px";
      sf.style.width = size;
      sf.style.height = size;
      sf.style.opacity = (Math.random() * 0.4 + 0.15).toFixed(2);
      sf.style.animationDuration = Math.random() * 8 + 6 + "s";
      sf.style.animationDelay = Math.random() * 6 + "s";
      container.appendChild(sf);
    }
  });

  // === CLICK-TO-SNOW INTERACTION (SNOW PILE) ===
  function createSnowBurst(e, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Ambil koordinat klik relatif terhadap viewport
    const clickX = e.clientX;
    const clickY = e.clientY;

    // Buat burst 15-20 butir salju
    const burstCount = Math.floor(Math.random() * 6) + 15;

    for (let i = 0; i < burstCount; i++) {
      const sf = document.createElement("div");
      sf.classList.add("snowflake");

      // Sebar sedikit dari titik klik awal
      const offsetX = (Math.random() - 0.5) * 100;
      sf.style.left = `calc(${clickX}px + ${offsetX}px)`;

      // Override posisi top agar mulai dari titik kursor (atau dikit di atas/bawah)
      const offsetY = (Math.random() - 0.5) * 40;
      sf.style.top = `calc(${clickY}px + ${offsetY}px)`;

      const size = Math.random() * 3 + 2 + "px";
      sf.style.width = size;
      sf.style.height = size;
      sf.style.opacity = (Math.random() * 0.6 + 0.4).toFixed(2);

      // Animasi jatuh lebih cepat untuk efek burst
      sf.style.animationDuration = Math.random() * 3 + 2 + "s";
      // Tanpa delay
      sf.style.animationDelay = "0s";

      container.appendChild(sf);

      // Bersihkan flake setelah efek selesai
      setTimeout(() => {
        if (sf.parentNode === container) sf.remove();
      }, 5000);
    }
  }

  const snowPileCta = document.getElementById("snow-pile-cta");
  const snowPileFooter = document.getElementById("snow-pile-footer");

  if (snowPileCta) {
    snowPileCta.addEventListener("click", (e) => {
      createSnowBurst(e, "cta-snow");
    });
  }

  if (snowPileFooter) {
    snowPileFooter.addEventListener("click", (e) => {
      createSnowBurst(e, "footer-snow");
    });
  }

  // === SCROLL REVEAL SYSTEM ===
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // === 4. VIDEO AUTOPLAY SYSTEM (Scroll Play/Pause) ===
  const docVideo = document.getElementById("doc-video");
  if (docVideo) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.5) {
            docVideo.play().catch((err) => {
              console.log("Autoplay prevented:", err);
            });
          } else {
            docVideo.pause();
          }
        });
      },
      { threshold: 0.5 },
    );

    videoObserver.observe(docVideo);
  }

  // === 4.5 BAR CHART ANIMATION (Grow on scroll) ===
  const barElements = document.querySelectorAll(".bar-fill");
  if (barElements && barElements.length) {
    // ensure start at zero so percent heights animate correctly
    barElements.forEach((b) => {
      b.style.height = "0%";
      const span = b.querySelector("span");
      if (span) span.style.opacity = "0";
    });

    const barObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const bar = entry.target;
          const targetHeight = bar.dataset.target || "50%";
          // apply height (percentage string like "75%")
          bar.style.height = targetHeight;
          const span = bar.querySelector("span");
          if (span) span.style.opacity = "1";
          obs.unobserve(bar);
        });
      },
      { threshold: 0.35 },
    );

    barElements.forEach((b) => barObserver.observe(b));
  }

  // === 5. LEAFLET INTERACTIVE MAP SYSTEM ===
  const mapElement = document.getElementById("fox-map");
  if (mapElement && typeof L !== "undefined") {
    const map = L.map("fox-map", {
      zoomControl: false,
      scrollWheelZoom: false,
    }).setView([60.0, 10.0], 2);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 19,
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
      },
    ).addTo(map);

    function createPulseIcon(colorClass) {
      return L.divIcon({
        className: "custom-div-icon",
        html: `<div class="custom-pulse-marker ${colorClass}"><div class="pulse"></div><div class="dot"></div></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
    }

    L.marker([64.2008, -100.4937], { icon: createPulseIcon("") })
      .addTo(map)
      .bindPopup(
        "<b style='color:#FF8C42; font-family:Cinzel'>North American Fox</b><br><span style='font-size:12px; color:#9ca3af'>Tundra & Boreal Forests. Thrives in deep snow.</span>",
      );

    L.marker([60.472, 8.4689], { icon: createPulseIcon("marker-blue") })
      .addTo(map)
      .bindPopup(
        "<b style='color:#60A5FA; font-family:Cinzel'>Scandinavian Fox</b><br><span style='font-size:12px; color:#9ca3af'>Northern Europe. Hunts using magnetic fields.</span>",
      );

    L.marker([61.524, 105.3188], { icon: createPulseIcon("marker-white") })
      .addTo(map)
      .bindPopup(
        "<b style='color:#FFFFFF; font-family:Cinzel'>Siberian Fox</b><br><span style='font-size:12px; color:#9ca3af'>Russian Taiga. Survives up to -70°C.</span>",
      );
  }
});

// ══════════════════════════════════════════════════════
// DAILY FOX FACT SYSTEM
// Data pipeline: current date → seed → select fact
// Facts rotate automatically every day
// ══════════════════════════════════════════════════════

const FOX_FACTS = [
  {
    icon: "ph-light ph-magnet text-blue-400",
    title: "Magnetic Navigation",
    body: "Foxes use the Earth's magnetic field to hunt. They dive into the snow facing northeast with 73% accuracy — significantly higher than any other direction.",
    source: "Červený et al., 2011 — Czech University",
  },
  {
    icon: "ph-light ph-thermometer text-fox-orange",
    title: "Extreme Temperature Tolerance",
    body: "The Red Fox is the only carnivore that can survive across a 90°C temperature range — from the -70°C Siberian tundra to the warm Mediterranean regions.",
    source: "IUCN Red List — Vulpes vulpes",
  },
  {
    icon: "ph-light ph-ear text-white",
    title: "Supersonic Hearing",
    body: "Foxes can hear mice moving under 3 feet of dense snow. They can rotate their ears 150° independently to pinpoint prey with extreme precision.",
    source: "Wildlife Online — Red Fox Biology",
  },
  {
    icon: "ph-light ph-globe-hemisphere-west text-cyan-400",
    title: "Widest Distribution",
    body: "Spanning over 70 million km² across 4 continents, the Red Fox is the most widely distributed terrestrial land carnivore on Earth — beating both wolves and bears.",
    source: "GBIF — Occurrence Data 2024",
  },
  {
    icon: "ph-light ph-paw-print text-fox-gold",
    title: "45 Subspecies",
    body: "Vulpes vulpes has 45 scientifically recognized subspecies, ranging from the white-furred Arctic Fox in the tundra to the sleek desert subspecies in the Middle East.",
    source: "Mammal Species of the World, 3rd Ed.",
  },
  {
    icon: "ph-light ph-buildings text-gray-400",
    title: "Urban Foxes",
    body: "London alone is home to approximately 150,000 urban foxes — the highest density in the world. They have adapted by eating discarded food and hunting at night.",
    source: "University of Reading — Urban Fox Survey 2016",
  },
  {
    icon: "ph-light ph-snowflake text-blue-300",
    title: "The Winter Coat",
    body: "As temperatures drop, the Red Fox grows a dense secondary coat. This fur is so efficient at trapping heat that they don't shiver until temperatures hit -70°C.",
    source: "Voigt, D.R. — Wild Furbearer Management",
  },
  {
    icon: "ph-light ph-lightning text-yellow-400",
    title: "Hunting Speed",
    body: "A Red Fox can run up to 72 km/h in short sprints. When hunting, they use a technique called 'mousing' — leaping high and diving headfirst into the snow.",
    source: "Wildlife Online — Hunting Behaviour",
  },
  {
    icon: "ph-light ph-moon-stars text-indigo-300",
    title: "January Mating Season",
    body: "The iconic 'vixen scream' is heard every January and February. This female call can be heard from up to 1 km away and is often mistaken for a human screaming.",
    source: "Harris & Yalden — Mammals of the British Isles",
  },
  {
    icon: "ph-light ph-dna text-emerald-400",
    title: "10 Million Year Ancestry",
    body: "The ancestor of the Red Fox, Eucyon davisi, emerged in North America around 10 million years ago. They crossed the Bering Land Bridge before evolving into Vulpes vulpes.",
    source: "Prevosti & Rincón, 2007 — Canid Phylogeny",
  },
  {
    icon: "ph-light ph-moon text-white",
    title: "Sleeping in Open Snow",
    body: "When sleeping in open terrain, foxes curl their bodies and wrap their tails around their snouts. The thick bushy tail acts as a blanket that warms the air they breathe.",
    source: "Macdonald, D.W. — Running with the Fox",
  },
  {
    icon: "ph-light ph-database text-blue-400",
    title: "1.4 Million GBIF Records",
    body: "The GBIF database has recorded over 1.4 million occurrences of the Red Fox worldwide — making it one of the species with the most observation data globally.",
    source: "GBIF.org — Species 5219243",
  },
  {
    icon: "ph-light ph-map-trifold text-fox-orange",
    title: "Home Range",
    body: "A Red Fox can roam an average of 10 km per night during winter to hunt. In urban areas, their home range can expand up to 4 km² per individual.",
    source: "Canids.org — Home Range Data",
  },
  {
    icon: "ph-light ph-flask text-purple-400",
    title: "Domestication Experiment",
    body: "Since 1959, Russian scientists have run a fox domestication experiment. After 50+ generations of selection, these foxes display dog-like behaviors — wagging their tails and seeking human affection.",
    source: "Trut, L. — Novosibirsk Fox Experiment",
  },
  {
    icon: "ph-light ph-leaf text-green-400",
    title: "True Omnivores",
    body: "Red Foxes eat everything: mice, rabbits, insects, berries, worms, and human leftovers. This dietary flexibility is the primary reason they succeed in all habitats.",
    source: "IUCN — Vulpes vulpes Diet Analysis",
  },
];

let currentFactIndex = 0;

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}

function loadDailyFact() {
  const today = new Date();
  const dayOfYear = getDayOfYear();
  const totalDays = 365;

  // Seed based on date — changes daily, consistent throughout the day
  currentFactIndex = dayOfYear % FOX_FACTS.length;
  renderFact(currentFactIndex);

  // Show date
  const dateEl = document.getElementById("daily-date");
  if (dateEl) {
    dateEl.textContent = today.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Progress bar day of the year
  const progress = document.getElementById("day-progress");
  const dayLabel = document.getElementById("day-label");
  if (progress) {
    setTimeout(() => {
      progress.style.width = (dayOfYear / totalDays) * 100 + "%";
    }, 500);
  }
  if (dayLabel) {
    dayLabel.textContent = `Day ${dayOfYear} of ${totalDays}`;
  }
}

function renderFact(index) {
  const fact = FOX_FACTS[index];
  if (!fact) return;

  const iconEl = document.getElementById("fact-icon");
  const titleEl = document.getElementById("fact-title");
  const bodyEl = document.getElementById("fact-body");
  const sourceEl = document.getElementById("fact-source");

  // Fade out
  [iconEl, titleEl, bodyEl, sourceEl].forEach((el) => {
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(6px)";
      el.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    }
  });

  setTimeout(() => {
    if (iconEl) iconEl.innerHTML = `<i class="${fact.icon}"></i>`;
    if (titleEl) titleEl.textContent = fact.title;
    if (bodyEl) bodyEl.textContent = fact.body;
    if (sourceEl) sourceEl.textContent = "Source: " + fact.source;

    // Fade in
    [iconEl, titleEl, bodyEl, sourceEl].forEach((el) => {
      if (el) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    });
  }, 300);
}

// "Next Fact" button — for manual exploration
window.nextFact = function () {
  currentFactIndex = (currentFactIndex + 1) % FOX_FACTS.length;
  renderFact(currentFactIndex);
};

// Run on DOM ready
document.addEventListener("DOMContentLoaded", loadDailyFact);
