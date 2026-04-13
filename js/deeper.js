// ── Page fade in ──
window.addEventListener("load", () => {
  setTimeout(
    () => document.getElementById("page-overlay").classList.add("hidden"),
    100,
  );
});

// ── Fade out on navigation ──
function fadeOut(href) {
  const o = document.getElementById("page-overlay");
  o.style.transition = "opacity 0.6s ease";
  o.style.opacity = "1";
  o.style.pointerEvents = "all";
  setTimeout(() => (window.location.href = href), 650);
}
["logo-link", "back-main-btn"].forEach((id) => {
  const el = document.getElementById(id);
  if (el)
    el.addEventListener("click", (e) => {
      e.preventDefault();
      fadeOut(id === "logo-link" ? "index.html" : "more.html");
    });
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

// ── Scroll reveal ──
document.querySelectorAll(".reveal").forEach((el) =>
  new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  ).observe(el),
);
