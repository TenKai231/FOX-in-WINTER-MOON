# Panduan Aksesibilitas (Accessibility)

Proyek **The Fox & The Winter Moon** dibangun dengan komitmen untuk menyediakan pengalaman web yang inklusif dan dapat diakses oleh semua pengguna, termasuk mereka yang menggunakan teknologi pendamping (seperti *screen reader*) atau memiliki keterbatasan visual, motorik, maupun kognitif. 

Dokumen ini merangkum berbagai upaya teknis yang telah diimplementasikan dalam proyek ini untuk memenuhi standar dasar *Web Content Accessibility Guidelines* (WCAG).

## 1. Navigasi Keyboard (Keyboard Navigation)

Kami memastikan seluruh fungsionalitas utama aplikasi dapat diakses tanpa menggunakan *mouse*:
- **Indikator Fokus yang Jelas**: Setiap elemen interaktif (tautan, tombol, kontrol audio) memiliki *outline* atau efek visual (`focus:ring`, `focus:outline-none`) yang jelas saat disorot menggunakan tombol `Tab`.
- **Urutan DOM yang Logis**: Alur perpindahan fokus keyboard diatur mengikuti struktur HTML dari atas ke bawah, kiri ke kanan, sehingga terasa alami dan tidak menjebak (*keyboard trap*).
- **Interaksi Komponen Kustom**: Elemen interaktif seperti pemutar Web Audio API dapat dijeda/diputar menggunakan interaksi standar keyboard (`Enter` atau `Space` saat sedang fokus).

## 2. Teks Alternatif (Alt Text) & Media

- **Gambar dan Aset Visual**: Seluruh aset gambar (didalam `assets/image/` dan `assets/icon/`) pada tag `<img>` telah dilengkapi dengan atribut `alt` yang deskriptif guna mendeskripsikan konteks visual pada pengguna *screen reader*. Gambar dekoratif yang tidak membawa makna krusial menggunakan atribut `alt=""` atau `aria-hidden="true"`.
- **Model 3D (Model-Viewer)**: Implementasi `<model-viewer>` menyertakan teks alternatif untuk mendeskripsikan model "Red Fox di Hutan Musim Dingin" bagi *screen reader*.

## 3. Kontras Warna & Desain Visual

- **Rasio Kontras**: Pemilihan palet warna melalui Tailwind CSS telah diuji untuk memastikan teks utama (termasuk tipografi teks yang diletakkan di atas *background* gelap malam musim dingin) memenuhi standar kontras WCAG AA (rasio 4.5:1 untuk teks normal).
- **Legibilitas Tipografi**: Menggunakan penyesuaian *line-height* (jarak antar baris) dan ukuran font (*font-size*) yang responsif agar mudah dibaca pada berbagai ukuran layar mobile maupun desktop.

## 4. Struktur Semantik & Atribut ARIA

- **HTML5 Landmarks**: Halaman web disusun dengan elemen semantik seperti `<header>`, `<nav>`, `<main>`, `<section>`, dan `<footer>` agar teknologi pendamping dapat dengan mudah membaca kerangka utama dan melompat antar-bagian (navigasi cepat).
- **ARIA/Roles**: Komponen-komponen UI yang non-standar atau dirender via JavaScript dilengkapi dengan atribut ARIA seperti `aria-label`, `aria-expanded`, atau `aria-controls` saat diperlukan, untuk menjelaskan status dan tujuan tombol (terutama UI timeline dan galeri).

## 5. Kontrol Animasi & Keamanan Kognitif

- **Tidak Ada Flashing Berbahaya**: Efek animasi partikel salju, transisi paralaks, dan visualisasi bar audio dirancang secara halus tanpa kilatan cahaya berfrekuensi tinggi (tidak melewati batas maksimum 3 kali kedipan per detik) untuk mencegah risiko kejang (*seizure*).
- **Visibilitas dan Durasi**: Animasi *scroll reveal* menggunakan *hardware acceleration* tanpa membatasi kontrol *scroll* pengguna (tidak ada efek *scroll jacking*), pengguna bebas mengontrol kecepatan gulir halaman.

---

*Laporan dan implementasi aksesibilitas ini merupakan langkah berkelanjutan dalam proses pengembangan untuk menyeimbangkan antara estetika audio-visual 3D dan web yang edukasional dan inklusif.*