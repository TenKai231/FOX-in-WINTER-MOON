// ── Page fade in ──
window.addEventListener("load", () => {
  setTimeout(
    () => document.getElementById("page-overlay").classList.add("hidden"),
    100,
  );
});

document.addEventListener("DOMContentLoaded", () => {
  // ── Fade out on nav ──
  function fadeOut(href) {
    const o = document.getElementById("page-overlay");
    o.style.transition = "opacity 0.6s ease";
    o.style.opacity = "1";
    o.style.pointerEvents = "all";
    setTimeout(() => (window.location.href = href), 650);
  }

  const logoLink = document.getElementById("logo-link");
  const backBtn = document.getElementById("back-main-btn");

  if (logoLink)
    logoLink.addEventListener("click", (e) => {
      e.preventDefault();
      fadeOut("../index.html");
    });
  if (backBtn)
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      fadeOut("../index.html");
    });

  // Hub cards fade out
  ["card-deeper", "card-timeline", "card-sounds", "card-gallery"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el)
        el.addEventListener("click", (e) => {
          e.preventDefault();
          fadeOut(el.getAttribute("href"));
        });
    },
  );

  // ── Stars ──
  const sc = document.getElementById("star-container");
  if (sc) {
    for (let i = 0; i < 60; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const sz = Math.random() * 2 + 1 + "px";
      s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${sz};height:${sz};animation-duration:${Math.random() * 3 + 2}s;animation-delay:${Math.random() * 3}s;`;
      sc.appendChild(s);
    }
  }

  // Mini stars inside timeline card
  const cs = document.getElementById("card-stars");
  if (cs) {
    for (let i = 0; i < 30; i++) {
      const s = document.createElement("div");
      s.style.cssText = `position:absolute;background:white;border-radius:50%;width:${Math.random() * 2 + 1}px;height:${Math.random() * 2 + 1}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;opacity:${Math.random() * 0.4 + 0.1};`;
      cs.appendChild(s);
    }
  }

  // ── Snow ──
  const snc = document.getElementById("snow-container");
  if (snc) {
    for (let i = 0; i < 50; i++) {
      const sf = document.createElement("div");
      sf.className = "snowflake";
      const sz = Math.random() * 3 + 2 + "px";
      sf.style.cssText = `left:${Math.random() * 100}vw;width:${sz};height:${sz};animation-duration:${Math.random() * 10 + 5}s;animation-delay:${Math.random() * 5}s;`;
      snc.appendChild(sf);
    }
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
}); // end DOMContentLoaded
