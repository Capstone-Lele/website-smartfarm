# Lampiran D Test Case Black Box Testing - Master Data Kategori (Categories)

| ID | Test Case | Deskripsi | Test step | Test data | Expected result | Actual result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Menampilkan Daftar Kategori | Menguji fungsionalitas sistem dalam menampilkan seluruh data kategori barang pada tabel daftar kategori (Read-Only). | 1. Masuk ke Dashboard sebagai Admin<br>2. Mengakses menu "Master Data" -> "Kategori" pada sidebar | - | Sistem menampilkan tabel daftar kategori dengan kolom Nama Kategori secara lengkap, rapi, dan urut. | Halaman sukses memuat dan menampilkan tabel seluruh data kategori secara lengkap. | Passed |
| **TC-02** | Menampilkan Loading Skeleton Saat Memuat Data | Menguji transisi UI saat data kategori sedang diambil dari API server. | 1. Mengakses menu "Master Data" -> "Kategori"<br>2. Mengamati layar sebelum data selesai dimuat | - | Sistem menampilkan skeleton loader table sebagai indikator pemuatan data untuk kenyamanan pengguna sebelum data benar-benar ditampilkan. | Layar menampilkan skeleton table dengan animasi memuat sebelum data asli muncul. | Passed |
