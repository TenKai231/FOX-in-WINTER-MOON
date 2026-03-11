document.addEventListener("DOMContentLoaded", () => {
  const modelViewer = document.getElementById("fox-3d");
  const modelWrapper = document.getElementById("model-wrapper");

  if (!modelViewer || !modelWrapper) return;

  let targetTheta  = -180;
  let targetPhi    = 80;
  let currentTheta = -180;
  let currentPhi   = 80;

  // Naikkan speed agar loop cepat selesai & tidak terus-menerus update
  const LERP_SPEED  = 0.08;
  // Threshold lebih besar = stop update lebih cepat = hemat CPU
  const THRESHOLD   = 0.05;

  let animating = false; // flag: hanya jalankan loop saat perlu

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function animationLoop() {
    currentTheta = lerp(currentTheta, targetTheta, LERP_SPEED);
    currentPhi   = lerp(currentPhi,   targetPhi,   LERP_SPEED);

    const diffTheta = Math.abs(currentTheta - targetTheta);
    const diffPhi   = Math.abs(currentPhi   - targetPhi);

    if (diffTheta > THRESHOLD || diffPhi > THRESHOLD) {
      try {
        modelViewer.cameraOrbit =
          `${currentTheta.toFixed(2)}deg ${currentPhi.toFixed(2)}deg 40%`;
      } catch (_) {}
      requestAnimationFrame(animationLoop);
    } else {
      // Snap ke target persis lalu stop loop — hemat CPU
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

  function handlePointerMove(event) {
    const rect = modelWrapper.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width  - 0.5;
    const y = (event.clientY - rect.top)  / rect.height - 0.5;
    targetTheta = -180 + x * 30;
    targetPhi   = 80   + y * 15;
    startLoop();
  }

  function handlePointerLeave() {
    targetTheta = -180;
    targetPhi   = 80;
    startLoop();
  }

  modelWrapper.addEventListener("pointermove",  handlePointerMove,  { passive: true });
  modelWrapper.addEventListener("pointerleave", handlePointerLeave, { passive: true });

  let didLoad = false;
  modelViewer.addEventListener("load", () => { didLoad = true; });
  setTimeout(() => {
    if (!didLoad) console.warn("Model did not load within 8s.");
  }, 8000);
});
