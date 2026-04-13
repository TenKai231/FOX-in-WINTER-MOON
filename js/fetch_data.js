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
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();

    updateDistributionChart(data.distribution);
    updateTrendChart(data.trend);
    updateMetaBadge(data.meta);
  } catch (err) {
    console.warn("Gagal load data.json, pakai data fallback:", err);
    // Kalau data.json tidak ada, tampilkan notifikasi UX yang elegan dan tetap pakai chart statis bawaan HTML
    showFallbackToast(err);
  }
}

// ── Tampilkan Notifikasi Error (UX Fallback) ────────────────
/**
 * Alih-alih membiarkan aplikasi kosong atau crash, fungsi ini
 * membangun elemen notifikasi Tailwind secara dinamis untuk memberitahu user.
 */
function showFallbackToast(error) {
  const section = document.getElementById("population");
  if (!section) return;

  const alertBox = document.createElement("div");
  alertBox.className = "mt-6 max-w-xl mx-auto p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4 text-left backdrop-blur-md opacity-0 transition-opacity duration-1000";
  alertBox.innerHTML = `
    <div class="p-3 bg-red-500/20 rounded-full flex-shrink-0">
      <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    </div>
    <div>
      <h4 class="text-red-400 font-bold text-sm uppercase font-fantasy tracking-wider">Live Data Unavailable</h4>
      <p class="text-gray-400 text-xs font-body mt-1 leading-relaxed">
        Gagal memuat API data JSON (${error.message}). Tampilan saat ini menggunakan data statis <i>(fallback mode)</i> agar Anda tetap dapat melihat *preview* visualisasi.
      </p>
    </div>
  `;

  const headerContainer = section.querySelector(".text-center.mb-16.reveal");
  if (headerContainer) {
    headerContainer.appendChild(alertBox);
    // Trigger fade-in animation
    requestAnimationFrame(() => {
      alertBox.classList.remove("opacity-0");
    });
  }
}

// ── Update Bar Chart KIRI (Territory Distribution) ──────────
/**
 * Memetakan data distribusi ke dalam elemen bar chart pada DOM.
 * Digunakan pola `labelMap` untuk melakukan normalisasi key wilayah (karena data API
 * bisa berbeda penamaan dengan label UI). Fungsi ini secara dinamis memperbarui
 * elemen CSS width (.bar-fill) agar merepresentasikan persentase distribusi secara akurat.
 */
function updateDistributionChart(distribution) {
  // Urutkan: Europe, North America, Asia, Africa (atau Middle East), Oceania (Australia)
  const labelMap = {
    Europe: "Eurasia",
    "North America": "America",
    Asia: "Asia",
    Africa: "Africa",
    Oceania: "Australia",
  };

  const bars = document.querySelectorAll("#population .bar-fill[data-target]");

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
    if (labelEl)
      labelEl.textContent = labelMap[item.continent] ?? item.continent;
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
      span.textContent =
        item.change_pct > 0
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
    subtitle.innerHTML = `Data dari <a href="${meta.source_url}" target="_blank" 
       class="text-fox-orange underline hover:opacity-80 transition-opacity"
       >${meta.source}</a>. 
       Diproses dengan Python + Pandas. 
       Total: ${(meta.total_records / 1000000).toFixed(1)}M records.`;
  }
}

// Jalankan setelah DOM siap
document.addEventListener("DOMContentLoaded", loadFoxData);
