"""
ETL Pipeline — The Fox & The Winter Moon
=========================================
Extract   : GBIF API (Vulpes vulpes / Red Fox)
Transform : Pandas — hitung total per benua & tren per tahun
Load      : Simpan ke data.json (dibaca langsung oleh website)

Cara pakai:
  1. pip install requests pandas
  2. python etl_redfox.py
  3. Pindahkan data.json ke folder root website kamu
"""

import requests
import pandas as pd
import json
from datetime import datetime

# ──────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────
SPECIES_KEY = 5219243          # Kode spesies Vulpes vulpes di GBIF
BASE_URL    = "https://api.gbif.org/v1/occurrence/search"
OUTPUT_FILE = "data.json"

# Benua yang tersedia di GBIF API beserta label pelaporannya
CONTINENTS = {
    "EUROPE"        : "Europe",
    "ASIA"          : "Asia",
    "NORTH_AMERICA" : "North America",
    "AFRICA"        : "Africa",
    "OCEANIA"       : "Oceania",
}

# Tahun yang ingin dianalisis untuk data tren populasi
YEARS = [1980, 1990, 2000, 2005, 2010, 2015, 2020, 2024]


# ──────────────────────────────────────────────
# STEP 1: EXTRACT
# ──────────────────────────────────────────────
def extract_continent_count(continent_code: str) -> int:
    """
    Mengambil jumlah total rekam jejak (occurrences) spesies Red Fox
    berdasarkan benua dari GBIF API.

    Args:
        continent_code (str): Kode benua menurut standar GBIF (misal: "EUROPE", "ASIA")

    Returns:
        int: Jumlah total observasi spesies di benua tersebut.
             Mengembalikan nilai 0 jika terjadi koneksi error (Timeout/HTTP Error).

    Notes:
        Parameter `limit=0` digunakan karena kita hanya membutuhkan agregasi
        `count` metadata dari header response, bukan list datanya utuh.
    """
    params = {
        "speciesKey" : SPECIES_KEY,
        "continent"  : continent_code,
        "limit"      : 0,
    }
    try:
        resp = requests.get(BASE_URL, params=params, timeout=15)
        resp.raise_for_status()
        count = resp.json().get("count", 0)
        print(f"  [Extract] {continent_code}: {count:,} records")
        return count
    except Exception as e:
        print(f"  [GAGAL] {continent_code}: {e}")
        return 0


def extract_yearly_trend(year: int) -> int:
    """
    Mengambil jumlah total kemunculan spesies Red Fox di seluruh dunia
    untuk tahun pencatatan tertentu dari GBIF API.

    Args:
        year (int): Tahun target ekstraksi data (misal: 2020, 2024).

    Returns:
        int: Total jumlah observasi spesies pada tahun target yang diminta.
             Mengembalikan nilai 0 jika terjadi exception.
    """
    params = {
        "speciesKey" : SPECIES_KEY,
        "year"       : year,
        "limit"      : 0,
    }
    try:
        resp = requests.get(BASE_URL, params=params, timeout=15)
        resp.raise_for_status()
        count = resp.json().get("count", 0)
        print(f"  [Extract] Tahun {year}: {count:,} records")
        return count
    except Exception as e:
        print(f"  [GAGAL] tahun {year}: {e}")
        return 0


# ──────────────────────────────────────────────
# STEP 2: TRANSFORM
# ──────────────────────────────────────────────
def transform(continent_raw: dict, yearly_raw: dict) -> dict:
    """
    Mengolah data dictionary raw dari tahap Extract menjadi format terstruktur
    (JSON/Dict objects) siap pakai (*client-ready*) menggunakan library Pandas.

    Args:
        continent_raw (dict): Data jumlah populasi dipetakan berdasarkan benua.
        yearly_raw (dict): Data historis jumlah penemuan per tahun.

    Returns:
        dict: Data yang sudah distrukturisasi, terbagi menjadi `meta`,
              `distribution` (persentase tiap benua), dan `trend` (data tren tahunan
              lengkap dengan persentase pertumbuhan dan indeks bar chart normalisasi).
    """
    # --- Distribusi per benua ---
    df_continent = pd.DataFrame([
        {"continent": name, "count": count}
        for name, count in continent_raw.items()
    ])

    total = df_continent["count"].sum()
    # Hitung persentase populasi tiap benua terhadap total keseluruhan
    df_continent["percentage"] = (
        (df_continent["count"] / total * 100).round(1)
        if total > 0 else 0
    )
    # Urutkan benua dari populasi red fox yang terbesar
    df_continent = df_continent.sort_values("percentage", ascending=False)

    # --- Tren tahunan ---
    df_trend = pd.DataFrame([
        {"year": year, "count": count}
        for year, count in yearly_raw.items()
    ]).sort_values("year")

    # Normalisation scale 0-100 untuk keperluan Bar Chart di Frontend (CSS Height)
    max_count = df_trend["count"].max()
    df_trend["normalized"] = (
        (df_trend["count"] / max_count * 100).round(1)
        if max_count > 0 else 0
    )

    # Hitung persentase fluktuasi pertumbuhan/penurunan tahun-ke-tahun
    baseline = df_trend.iloc[0]["count"] if len(df_trend) > 0 else 1
    df_trend["change_pct"] = (
        ((df_trend["count"] - baseline) / baseline * 100).round(1)
        if baseline > 0 else 0
    )

    # Dictionary final yang siap di-convert jadi JSON file untuk konsumsi client fetch()
    return {
        "meta": {
            "species"     : "Vulpes vulpes",
            "common_name" : "Red Fox",
            "source"      : "GBIF (Global Biodiversity Information Facility)",
            "source_url"  : "https://www.gbif.org/species/5219243",
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_records": int(total),
        },
        "distribution": df_continent.to_dict(orient="records"),
        "trend": df_trend.to_dict(orient="records"),
    }


# ──────────────────────────────────────────────
# STEP 3: LOAD
# ──────────────────────────────────────────────
def load(data: dict, output_file: str):
    """
    Menyimpan final payload dictionary JSON ke dalam file statis.

    Args:
        data (dict): Hasil olah data dari fungsi transform().
        output_file (str): Direktori+Nama file target (misal: "data.json").
    """
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"\n[Load] Berhasil! Data disimpan ke: {output_file}")
    print(f"       Total records: {data['meta']['total_records']:,}")


# ──────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print("  ETL Pipeline — Red Fox (Vulpes vulpes)")
    print("=" * 50)

    # 1. EXTRACT
    print("\n[1/3] Extracting dari GBIF API...")

    print("  → Distribusi per benua:")
    continent_raw = {
        CONTINENTS[code]: extract_continent_count(code)
        for code in CONTINENTS
    }

    print("  → Tren populasi per tahun:")
    yearly_raw = {
        year: extract_yearly_trend(year)
        for year in YEARS
    }

    # 2. TRANSFORM
    print("\n[2/3] Transforming dengan Pandas...")
    clean_data = transform(continent_raw, yearly_raw)
    print("  Data berhasil dibersihkan dan diolah.")

    # 3. LOAD
    print("\n[3/3] Loading ke data.json...")
    load(clean_data, OUTPUT_FILE)

    print("\n[SELESAI] Salin data.json ke folder root website kamu!")
    print("          Lalu update script.js sesuai petunjuk di fetch_data.js")
    print("=" * 50)
