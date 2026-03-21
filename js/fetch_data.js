// ============================================================
// fetch_data.js — Ganti bar chart hardcode dengan data real
// ============================================================
// CARA PAKAI:
//   1. Taruh data.json di folder ROOT website (sejajar index.html)
//   2. Ganti <script src="js/script.js"> menjadi dua baris:
//        <script src="js/fetch_data.js" defer></script>
//        <script src="js/script.js" defer></script>
//   Atau: copy-paste fungsi ini ke dalam script.js kamu
// ============================================================

async function loadFoxData() {
  try {
    const response = await fetch("data/data.json");
    if (!response.ok) throw new Error("data.json tidak ditemukan");
    const data = await response.json();

    updateDistributionChart(data.distribution);
    updateTrendChart(data.trend);
    updateMetaBadge(data.meta);

  } catch (err) {
    console.warn("Gagal load data.json, pakai data fallback:", err);
    // Kalau data.json tidak ada, chart tetap pakai nilai hardcode di HTML
  }
}

// ── Update Bar Chart KIRI (Territory Distribution) ──────────
function updateDistributionChart(distribution) {
  // Urutkan: Europe, North America, Asia, Africa (atau Middle East), Oceania (Australia)
  const labelMap = {
    "Europe"       : "Eurasia",
    "North America": "America",
    "Asia"         : "Asia",
    "Africa"       : "Africa",
    "Oceania"      : "Australia",
  };

  const bars = document.querySelectorAll(
    "#population .bar-fill[data-target]"
  );

  // Cari parent section population
  const section = document.getElementById("population");
  if (!section) return;

  const allBars = section.querySelectorAll(".bar-fill");
  // Bar chart kiri = 4 bar pertama
  const leftBars = Array.from(allBars).slice(0, 4);

  distribution.slice(0, 4).forEach((item, i) => {
    const bar = leftBars[i];
    if (!bar) return;

    // Update tinggi bar sesuai persentase real
    const pct = item.percentage;
    bar.setAttribute("data-target", pct + "%");
    bar.style.height = pct + "%";

    // Update label angka di dalam bar
    const span = bar.querySelector("span");
    if (span) span.textContent = pct + "%";

    // Update label nama benua di bawah bar
    const labelEl = bar.closest(".relative")?.querySelector("p");
    if (labelEl) labelEl.textContent = labelMap[item.continent] ?? item.continent;
  });
}

// ── Update Bar Chart KANAN (Global Population Trend) ────────
function updateTrendChart(trend) {
  const section = document.getElementById("population");
  if (!section) return;

  const allBars = section.querySelectorAll(".bar-fill");
  // Bar chart kanan = bar setelah index ke-4
  const rightBars = Array.from(allBars).slice(4);

  trend.forEach((item, i) => {
    const bar = rightBars[i];
    if (!bar) return;

    bar.setAttribute("data-target", item.normalized + "%");
    bar.style.height = item.normalized + "%";

    // Update tooltip/label
    const span = bar.querySelector("span");
    if (span) {
      span.textContent = item.change_pct > 0
        ? "+" + item.change_pct + "%"
        : item.change_pct + "%";
    }

    // Update label tahun di bawah bar
    const labelEl = bar.closest(".relative")?.querySelector("p");
    if (labelEl) labelEl.textContent = item.year;
  });
}

// ── Tampilkan badge sumber data ──────────────────────────────
function updateMetaBadge(meta) {
  // Cari elemen subtitle di section population dan tambahkan info sumber
  const section = document.getElementById("population");
  if (!section) return;

  const subtitle = section.querySelector("p.text-gray-400");
  if (subtitle) {
    subtitle.innerHTML =
      `Data dari <a href="${meta.source_url}" target="_blank" 
       class="text-fox-orange underline hover:opacity-80 transition-opacity"
       >${meta.source}</a>. 
       Diproses dengan Python + Pandas. 
       Total: ${(meta.total_records / 1000000).toFixed(1)}M records.`;
  }
}

// Jalankan setelah DOM siap
document.addEventListener("DOMContentLoaded", loadFoxData);
