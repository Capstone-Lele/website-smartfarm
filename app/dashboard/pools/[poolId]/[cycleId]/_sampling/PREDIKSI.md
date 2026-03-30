# Cara Kerja Prediksi Sampling

Dokumen ini menjelaskan logika prediksi pada grafik di komponen `SamplingChartLineLabel`.

## Ringkasan

Prediksi menggunakan **regresi linear sederhana** berdasarkan histori `averageWeight` (gram) dari data sampling yang sudah diurutkan berdasarkan `reportDate`.

- Garis **Aktual**: nilai berat rata-rata asli dari API.
- Garis **Prediksi**: proyeksi ke depan dari tren kenaikan/penurunan.
- Garis target panen: **750 gram** (0,75 kg).

## Alur Data

1. Ambil data sampling dengan parameter `poolId` dan `cycleId`.
2. Urutkan data berdasarkan tanggal laporan (`reportDate`) dari paling lama ke terbaru.
3. Ubah `averageWeight` ke angka (`number`).
4. Bentuk titik regresi: `x = index data`, `y = averageWeight`.

## Syarat Minimal Prediksi

Prediksi hanya muncul jika data valid minimal:

- `MIN_PREDICTION_POINTS = 3`

Jika titik valid < 3:

- Garis prediksi **tidak ditampilkan**.
- UI menampilkan info jumlah data saat ini.

## Metode Prediksi

Model yang dipakai:

- Regresi linear: `y = slope * x + intercept`
- `slope` dan `intercept` dihitung dari seluruh titik valid.

Lalu sistem membuat data masa depan bertahap (`offset` 1..`MAX_PREDICTION_POINTS`):

- `MAX_PREDICTION_POINTS = 20`
- Tanggal prediksi bertambah berdasarkan **rata-rata interval sampling**.

## Estimasi Target Panen

Target panen ditetapkan:

- `HARVEST_TARGET_GRAM = 750`

Saat nilai prediksi pertama kali >= 750 gram:

- Tanggal tersebut disimpan sebagai estimasi panen.
- Proses loop prediksi dihentikan.

Jika sampai horizon prediksi belum mencapai 750 gram:

- Estimasi tanggal panen tidak muncul.
- UI menampilkan bahwa target belum tercapai pada horizon saat ini.

## Catatan Penting

- Prediksi ini adalah **estimasi tren**, bukan kepastian biologis.
- Akurasi sangat dipengaruhi kualitas data sampling (konsistensi waktu, jumlah data, dan outlier).
- Untuk keputusan operasional panen, tetap perlu validasi lapangan.

## Lokasi Implementasi

Logika utama ada di file:

- `app/dashboard/pools/[poolId]/[cycleId]/_sampling/chart.tsx`
