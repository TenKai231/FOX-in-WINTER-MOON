# 🦊 The Fox & The Winter Moon

> Interactive educational web experience about Red Fox ecology.
> [🔗 Live Demo](https://your-demo-link.com) | [📊 View Architecture](./ARCHITECTURE.md) | [📚 View References](./REFERENCES.md)

## 🎯 Tujuan Proyek

Proyek ini dikembangkan sebagai:
1. **Tugas UTS/UAS Web Programming**: Fokus pada implementasi Web Audio API, DOM Manipulation, dan Asynchronous Data Fetching.
2. **Portofolio Publik**: Mendemonstrasikan kemampuan Frontend Development & Interactive Storytelling tanpa framework berat.

## ✨ Fitur Unggulan

- 🌌 **Immersive 3D**: Model interaktif dengan `<model-viewer>` (Google).
- 🔊 **Dynamic Audio**: Pemutar audio sintesis dan visualisasi bar spektrum frekuensi dengan Web Audio API.
- 🗺️ **Data Visualization**: Peta persebaran populasi interaktif yang dibangun dari data eksternal.
- ❄️ **Performant UI**: Animasi partikel (bintang, salju) tersentralisasi menggunakan hardware-accelerated CSS.

## 🛠️ Tech Stack & Justifikasi

| Teknologi | Alasan Pemilihan |
|-----------|-----------------|
| **Tailwind CSS** | Utility-first untuk prototyping cepat & konsistensi desain yang optimal tanpa memuat CDN di setiap halaman. |
| **Vanilla JS ES6+** | Memahami fundamental JavaScript (DOM, Fetch, Events) dan modularitas tanpa abstraksi framework berat. |
| **Web Audio API** | Eksplorasi fitur native browser untuk pengalaman audio reaktif secara real-time. |
| **Python (Pandas)** | Skrip ETL (Extract, Transform, Load) untuk memproses data mentah populasi dari GBIF API menjadi JSON statis. |

## 📐 Arsitektur & Alur Data

Secara garis besar, alur kerja untuk rendering data di proyek ini adalah:
`data/data.json` → `js/fetch_data.js` (Fetch & Error Handling) → `DOM Renderer (Vanilla JS)` → `UI Interactions`

*(Silakan lihat dokumen [ARCHITECTURE.md](./ARCHITECTURE.md) untuk detail lengkap diagram dan struktur kode.)*

## 🚀 Fitur Canggih & Tantangan Teknis

Sebagai bukti kompetensi pengembangan web modern, proyek ini mengimplementasikan beberapa solusi teknis untuk mengatasi berbagai tantangan:

- **Optimasi Loading Model 3D**: Memuat aset 3D (`<model-viewer>` / `.glb`) seringkali membebani kinerja awal (khususnya di perangkat *mobile*). Hal ini diatasi dengan teknik *lazy loading*, *poster placeholder* yang ringan, dan penundaan inisialisasi WebGL hingga elemen terlihat (menghemat memori).
- **Audio Sintesis & Visualisasi Real-Time**: Mengembangkan visualisasi spektrum frekuensi audio secara langsung menggunakan Web Audio API (`AnalyserNode`), yang menuntut optimasi sinkronisasi `requestAnimationFrame` dengan kinerja *paint* browser agar tidak terjadi *frame drop*.
- **Data Fetching Asinkron**: Menghindari *render-blocking* dengan memuat data populasi global secara *asynchronous* (`fetch`, `async/await`) dari file JSON eksternal, sehingga UI tetap responsif saat konten sedang dimuat.
- **Manajemen Kode Vanilla JS Modular**: Mengatasi tantangan skalabilitas struktur kode tanpa *framework* modern (React/Vue) dengan memisahkan instansi fungsionalitas per halaman (`sounds.js`, `timeline.js`, `three-setup.js`) dan menggunakan ES Modules.
- **Sentralisasi & Performa Animasi CSS**: Mengelola ratusan animasi partikel (salju, bintang) dan efek paralaks tanpa membebani *main thread* JavaScript dengan memanfaatkan *hardware acceleration* (transform/opacity) dan optimasi kompilasi Tailwind CLI.

## Struktur Project

Proyek ini kini menggunakan struktur web modern:

- `index.html` — Halaman pendaratan (beranda utama).
- `pages/` — Folder yang berisi sub-halaman (`more.html`, `deeper.html`, `timeline.html`, `sounds.html`).
- `css/` — Berisi `input.css` sebagai sumber kode semua keyframe kustom dan utilitas Tailwind.
- `dist/` — Berisi `output.css`, hasil kompilasi CSS yang digunakan oleh seluruh halaman HTML.
- `js/` — Kumpulan skrip terpisah untuk masing-masing halaman HTML (contoh: `more.js`, `fetch_data.js`).
- `data/` — Folder penyimpan data lokal (`data.json`) dan script ETL Python (`etl_redfox.py`).
- `assets/` — Folder untuk gambar, video dokumenter, dan file 3D `.glb`.

## Cara Menjalankan (Lokal)

Mengingat web ini menggunakan struktur modular, CORS policies, ES modules (`import`), dan pengambilan `fetch` JSON, file **tidak boleh** sekedar diklik langsung dari File Explorer (`file://`).

1. Buka terminal di folder root (selevel dengan `index.html`).
2. Apabila Anda melakukan kustomisasi CSS di dalam form HTML, pastikan re-build CSS lewat Terminal:
   ```bash
   npm run build:css
   ```
3. Jalankan server lokal. Contoh:
   - Python: `python -m http.server 8000`
   - Node: `npx serve .` atau `npx http-server .`
   - VSCode: Klik "Go Live" pada ekstensi Live Server.
4. Buka `http://localhost:8000` di web browser Anda.

## 🌍 Deployment (Live Demo)

Proyek ini sepenuhnya kompatibel dengan layanan *static hosting* berkat arsitekturnya yang ringan (HTML/CSS/JS murni).

**Untuk deploy ke Vercel atau Netlify:**
1. _Push_ semua kode (termasuk `output.css` dalam folder `dist`) ke repositori GitHub public.
2. Sambungkan repo tersebut ke Vercel/Netlify.
3. Anda tidak perlu setup _build command_ (kosongkan saja), dan biarkan _output directory_ menunjuk ke folder root (`/`).
4. Pastikan URL _Live Demo_ terbaru di-*update* pada bagian atas file `README.md` ini.

## Eksekusi Data tambahan (Python)

Untuk mengubah kumpulan data pada file JSON:

1. Masuk ke folder `data/`
2. Edit dan jalankan `etl_redfox.py`.
3. Script otomatis akan menulis ulang/memperbarui file `data.json` di rute yang sama.

## Lisensi

MIT — Bebas digunakan dan dimodifikasi untuk eksplorasi dan tujuan edukasi.
