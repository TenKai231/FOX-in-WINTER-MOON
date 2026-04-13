document.addEventListener("DOMContentLoaded", () => {
  const modelViewer = document.getElementById("fox-3d");
  const modelWrapper = document.getElementById("model-wrapper");

  if (!modelViewer || !modelWrapper) return;

  // === BASE camera values (default) ===
  const BASE_THETA = -180;
  const BASE_PHI   = 80;

  // === Scroll storytelling values ===
  // Saat scroll 0 → theta -180, saat habis hero section model tetap berputar
  // tetapi dibuat lebih pelan agar gerakannya terasa halus.
  const SCROLL_THETA_RANGE = 160; // total derajat putaran selama scroll hero
  const SCROLL_PHI_RANGE   = 12;  // tilt kecil saat scroll

  // === Pointer parallax offset ===
  let pointerOffsetTheta = 0;
  let pointerOffsetPhi   = 0;

  // === Current & Target camera ===
  let targetTheta  = BASE_THETA;
  let targetPhi    = BASE_PHI;
  let currentTheta = BASE_THETA;
  let currentPhi   = BASE_PHI;

  const LERP_SPEED = 0.04;
  const THRESHOLD  = 0.04;
  let animating    = false;

  // === LERP helper ===
  function lerp(a, b, t) { return a + (b - a) * t; }

  // === Clamp helper ===
  function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

  // === ANIMATION LOOP ===
  function animationLoop() {
    currentTheta = lerp(currentTheta, targetTheta, LERP_SPEED);
    currentPhi   = lerp(currentPhi,   targetPhi,   LERP_SPEED);

    const dTheta = Math.abs(currentTheta - targetTheta);
    const dPhi   = Math.abs(currentPhi   - targetPhi);

    if (dTheta > THRESHOLD || dPhi > THRESHOLD) {
      try {
        modelViewer.cameraOrbit =
          `${currentTheta.toFixed(2)}deg ${currentPhi.toFixed(2)}deg 40%`;
      } catch (_) {}
      requestAnimationFrame(animationLoop);
    } else {
      currentTheta = targetTheta;
      currentPhi   = targetPhi;
      try {
        modelViewer.cameraOrbit =
          `${currentTheta.toFixed(2)}deg ${currentPhi.toFixed(2)}deg 40%`;
      } catch (_) {}
      animating = false;
    }
  }

  function startLoop() {
    if (!animating) {
      animating = true;
      requestAnimationFrame(animationLoop);
    }
  }

  // === Gabungkan scroll + pointer menjadi target tunggal ===
  function updateTarget() {
    targetTheta = scrollBaseTheta + pointerOffsetTheta;
    targetPhi   = scrollBasePhi   + pointerOffsetPhi;
    startLoop();
  }

  // === SCROLL STORYTELLING ===
  let scrollBaseTheta = BASE_THETA;
  let scrollBasePhi   = BASE_PHI;

  function handleScroll() {
    const heroSection = document.getElementById("hero");
    if (!heroSection) return;

    const heroHeight = heroSection.offsetHeight;
    // scrollY relatif dari atas halaman; hero mulai dari 0
    const scrollY    = clamp(window.scrollY, 0, heroHeight);
    const progress   = scrollY / heroHeight; // 0.0 → 1.0

    // Theta: berputar dari BASE_THETA sejauh SCROLL_THETA_RANGE
    scrollBaseTheta = BASE_THETA + progress * SCROLL_THETA_RANGE;
    // Phi: sedikit turun saat scroll (model "menunduk")
    scrollBasePhi   = BASE_PHI  + progress * SCROLL_PHI_RANGE;

    updateTarget();
  }

  // Throttle scroll via rAF agar tidak jank
  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        handleScroll();
        scrollTicking = false;
      });
    }
  }, { passive: true });

  // === POINTER PARALLAX ===
  function handlePointerMove(event) {
    const rect = modelWrapper.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width  - 0.5;
    const y = (event.clientY - rect.top)  / rect.height - 0.5;

    // Parallax offset kecil agar tidak override scroll terlalu dominan
    pointerOffsetTheta = x * 20;
    pointerOffsetPhi   = y * 10;
    updateTarget();
  }

  function handlePointerLeave() {
    // Reset pointer offset, biarkan scroll yang menentukan posisi
    pointerOffsetTheta = 0;
    pointerOffsetPhi   = 0;
    updateTarget();
  }

  modelWrapper.addEventListener("pointermove",  handlePointerMove,  { passive: true });
  modelWrapper.addEventListener("pointerleave", handlePointerLeave, { passive: true });

  // Init scroll position saat page load (kalau user refresh di tengah)
  handleScroll();

  // === Fallback warning ===
  let didLoad = false;
  modelViewer.addEventListener("load", () => { didLoad = true; });
  setTimeout(() => {
    if (!didLoad) console.warn("Model did not load within 8s. Check path/server.");
  }, 8000);
});
