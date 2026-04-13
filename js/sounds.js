// ── Page fade in ──
window.addEventListener("load", () => {
  setTimeout(
    () => document.getElementById("page-overlay").classList.add("hidden"),
    100,
  );
});

// ── Fade out on nav ──
function fadeOut(href) {
  const o = document.getElementById("page-overlay");
  o.style.transition = "opacity 0.6s ease";
  o.style.opacity = "1";
  o.style.pointerEvents = "all";
  setTimeout(() => (window.location.href = href), 650);
}
document.getElementById("logo-link").addEventListener("click", (e) => {
  e.preventDefault();
  fadeOut("index.html");
});
document.getElementById("back-btn").addEventListener("click", (e) => {
  e.preventDefault();
  fadeOut("more.html");
});

// ── Stars ──
const sc = document.getElementById("star-container");
for (let i = 0; i < 60; i++) {
  const s = document.createElement("div");
  s.className = "star";
  const sz = Math.random() * 2 + 1 + "px";
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${sz};height:${sz};animation-duration:${Math.random() * 3 + 2}s;animation-delay:${Math.random() * 3}s;`;
  sc.appendChild(s);
}

// ── Snow ──
const snc = document.getElementById("snow-container");
for (let i = 0; i < 50; i++) {
  const sf = document.createElement("div");
  sf.className = "snowflake";
  const sz = Math.random() * 3 + 2 + "px";
  sf.style.cssText = `left:${Math.random() * 100}vw;width:${sz};height:${sz};animation-duration:${Math.random() * 10 + 5}s;animation-delay:${Math.random() * 5}s;`;
  snc.appendChild(sf);
}

// ── Waveform builder ──
function buildWave(containerId, color, heights, animate = false) {
  const el = document.getElementById(containerId);
  if (!el) return;
  heights.forEach((h, i) => {
    const bar = document.createElement("div");
    bar.className = "waveform-bar" + (animate ? " animate" : "");
    bar.style.cssText = `height:${h}%;background:${color};opacity:0.5;`;
    if (animate) bar.style.animationDuration = 0.6 + i * 0.12 + "s";
    if (animate) bar.style.animationDelay = i * 0.08 + "s";
    el.appendChild(bar);
  });
}

// Hero wave (animated)
buildWave(
  "hero-wave",
  "#60A5FA",
  [
    50, 75, 60, 100, 45, 85, 65, 90, 50, 70, 55, 80, 40, 95, 60, 75, 50, 100,
    65, 80, 45, 70,
  ],
  true,
);

// Sound card waveforms
buildWave("wave-alarm", "#FF8C42", [100, 50, 80, 35, 95, 60, 75, 45, 90]);
buildWave("wave-contact", "#60A5FA", [45, 80, 30, 90, 55, 75, 40, 85, 60]);
buildWave("wave-vixen", "#A78BFA", [100, 95, 85, 100, 90, 80, 75, 100, 95]);
buildWave("wave-pup", "#F59E0B", [35, 55, 45, 65, 35, 50, 40, 60, 35]);

// ── Spectrogram builder ──
const specHeights = [
  40, 60, 20, 85, 45, 30, 100, 55, 25, 70, 40, 15, 90, 50, 35, 75, 60, 45, 80,
  25, 65, 90, 50, 35, 70, 95, 40, 60, 30, 85, 55, 20, 75, 45, 65, 100, 50, 35,
  80, 60,
];
const specColors = [
  "#60A5FA",
  "#60A5FA",
  "#93C5FD",
  "#60A5FA",
  "#A78BFA",
  "#60A5FA",
  "#60A5FA",
  "#93C5FD",
  "#A78BFA",
  "#FF8C42",
];
const specEl = document.getElementById("spectrogram");
if (specEl) {
  specHeights.forEach((h, i) => {
    const bar = document.createElement("div");
    bar.style.cssText = `flex:1;border-radius:4px 4px 0 0;transition:height 1.2s ${i * 0.03}s ease;`;
    bar.style.background = `linear-gradient(to top, ${specColors[i % specColors.length]}10, ${specColors[i % specColors.length]}90)`;
    bar.dataset.h = h;
    bar.style.height = "0%";
    specEl.appendChild(bar);
  });
}

// ── Scroll reveal ──
const revealObs = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("active");
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

// Spectrogram grow on scroll
const specObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        specEl.querySelectorAll("div").forEach((bar) => {
          bar.style.height = bar.dataset.h + "%";
        });
        specObs.disconnect();
      }
    });
  },
  { threshold: 0.2 },
);
if (specEl) specObs.observe(specEl);

// ── Play sound (Web Audio API synth) ──
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let ctx;

const soundProfiles = {
  alarm: { freq: 880, type: "sawtooth", duration: 0.4, vol: 0.3 },
  contact: { freq: 440, type: "sine", duration: 0.8, vol: 0.25 },
  vixen: { freq: 660, type: "square", duration: 1.2, vol: 0.2 },
  pup: { freq: 1200, type: "triangle", duration: 0.3, vol: 0.25 },
};

window.playSound = function (type) {
  if (!ctx) ctx = new AudioCtx();
  const p = soundProfiles[type];
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = p.type;
  osc.frequency.setValueAtTime(p.freq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    p.freq * 0.5,
    ctx.currentTime + p.duration,
  );
  gain.gain.setValueAtTime(p.vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + p.duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + p.duration);
};
