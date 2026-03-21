# The Fox & The Winter Moon

**Ringkasan**  
Proyek web interaktif edukasional tentang pemandangan dan fakta biologis Red Fox (Rubah Merah). Menampilkan model 3D interaktif, animasi halaman, visualisasi suara, dan data populasi. Dibangun secara modular menggunakan HTML, CSS (Tailwind CLI), dan JavaScript.

## Fitur Utama
- Model 3D interaktif menggunakan `<model-viewer>`.
- Animasi partikel (bintang, salju) dan scroll reveal yang tersentralisasi di CSS.
- Pemutar audio sintesis dan visualisasi bar spektrum frekuensi dengan Web Audio API.
- Struktur folder bersih yang optimal untuk performa tanpa memuat Tailwind CDN di setiap halamannya.
- Peta persebaran populasi interaktif.

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

## Eksekusi Data tambahan (Python)
Untuk mengubah kumpulan data pada file JSON:
1. Masuk ke folder `data/` 
2. Edit dan jalankan `etl_redfox.py`. 
3. Script otomatis akan menulis ulang/memperbarui file `data.json` di rute yang sama. 

## Lisensi
MIT — Bebas digunakan dan dimodifikasi untuk eksplorasi dan tujuan edukasi.
