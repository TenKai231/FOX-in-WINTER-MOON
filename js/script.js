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
    if (existingModel && existingModel.parentNode) existingModel.parentNode.removeChild(existingModel);

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
    const stars = document.getElementById("star-container")?.children.length ?? 0;
    const snows = document.getElementById("snow-container")?.children.length ?? 0;
    const loaded = modelLoaded ? "model: ready" : `model: ${modelProgress}%`;
    badge.innerText = `stars: ${stars} · snow: ${snows} · ${loaded}`;
  }

  createStatusBadge();
  updateStatusBadge();
  setInterval(updateStatusBadge, 1000);

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
        if(sf.parentNode === container) sf.remove();
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
      { threshold: 0.5 }
    );

    videoObserver.observe(docVideo);
  }

  // === 4.5 BAR CHART ANIMATION (Grow on scroll) ===
  const barElements = document.querySelectorAll('.bar-fill');
  if (barElements && barElements.length) {
    // ensure start at zero so percent heights animate correctly
    barElements.forEach((b) => {
      b.style.height = '0%';
      const span = b.querySelector('span');
      if (span) span.style.opacity = '0';
    });

    const barObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const targetHeight = bar.dataset.target || '50%';
        // apply height (percentage string like "75%")
        bar.style.height = targetHeight;
        const span = bar.querySelector('span');
        if (span) span.style.opacity = '1';
        obs.unobserve(bar);
      });
    }, { threshold: 0.35 });

    barElements.forEach((b) => barObserver.observe(b));
  }

  // === 5. LEAFLET INTERACTIVE MAP SYSTEM ===
  const mapElement = document.getElementById("fox-map");
  if (mapElement && typeof L !== "undefined") {
    const map = L.map("fox-map", {
      zoomControl: false,
      scrollWheelZoom: false,
    }).setView([60.0, 10.0], 2);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19,
      attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
    }).addTo(map);

    function createPulseIcon(colorClass) {
      return L.divIcon({
        className: "custom-div-icon",
        html: `<div class="custom-pulse-marker ${colorClass}"><div class="pulse"></div><div class="dot"></div></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
    }

    L.marker([64.2008, -100.4937], { icon: createPulseIcon("") })
      .addTo(map)
      .bindPopup("<b style='color:#FF8C42; font-family:Cinzel'>North American Fox</b><br><span style='font-size:12px; color:#9ca3af'>Tundra & Boreal Forests. Thrives in deep snow.</span>");

    L.marker([60.4720, 8.4689], { icon: createPulseIcon("marker-blue") })
      .addTo(map)
      .bindPopup("<b style='color:#60A5FA; font-family:Cinzel'>Scandinavian Fox</b><br><span style='font-size:12px; color:#9ca3af'>Northern Europe. Hunts using magnetic fields.</span>");

    L.marker([61.5240, 105.3188], { icon: createPulseIcon("marker-white") })
      .addTo(map)
      .bindPopup("<b style='color:#FFFFFF; font-family:Cinzel'>Siberian Fox</b><br><span style='font-size:12px; color:#9ca3af'>Russian Taiga. Survives up to -70°C.</span>");
  }

});
