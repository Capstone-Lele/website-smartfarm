# 📋 Dokumen Usability Testing — Moderated

**Nama Sistem :** SmartFarm Web Application  
**Metode Pengujian :** Moderated Usability Testing  
**Peran yang Diuji :** Admin  
**Tanggal Pengujian :** _______________  
**Lokasi :** _______________  
**Moderator :** _______________

---

## Petunjuk Pelaksanaan

- Peserta diminta menyelesaikan tugas secara mandiri seperti penggunaan nyata.
- Moderator **tidak** memberi bantuan kecuali peserta benar-benar berhenti (*stop*).
- Setiap tugas dicatat respons, keterangan hambatan, dan nama penguji.
- Kolom **Respon** diisi dengan tanda ✓ pada salah satu: **Lancar**, **Cukup Lama**, atau **Stop**.

---

## Keterangan Respon

| Respon | Keterangan |
|--------|------------|
| **Lancar** | Peserta menyelesaikan tugas tanpa hambatan berarti |
| **Cukup Lama** | Peserta menyelesaikan tugas namun membutuhkan waktu lebih lama dari ekspektasi |
| **Stop** | Peserta tidak dapat menyelesaikan tugas dan memerlukan bantuan |

---

## PERAN ADMIN

### 🔐 Bagian 1 — Autentikasi (Auth)

| NO | TUGAS | PAGE | LANGKAH | EKSPEKTASI APLIKASI | RESPON | | | KETERANGAN | DIUJI OLEH |
|----|-------|------|---------|---------------------|--------|--|--|------------|------------|
| | | | | | **Lancar** | **Cukup Lama** | **Stop** | | |
| 1 | Login ke sistem | `/login` | 1. Buka halaman login <br> 2. Masukkan email/username <br> 3. Masukkan password <br> 4. Klik tombol **Masuk** | Sistem memvalidasi kredensial dan mengarahkan pengguna ke halaman dashboard utama | | | | | |
| 2 | Login dengan kredensial salah | `/login` | 1. Buka halaman login <br> 2. Masukkan email yang salah atau password yang salah <br> 3. Klik tombol **Masuk** | Sistem menampilkan pesan error yang informatif tanpa mengalihkan halaman | | | | | |
| 3 | Logout dari sistem | Dashboard (semua halaman) | 1. Klik ikon atau menu profil <br> 2. Pilih opsi **Logout** <br> 3. Konfirmasi logout (jika ada) | Sistem menghapus sesi dan mengarahkan pengguna kembali ke halaman login | | | | | |

---

### 🏠 Bagian 2 — Dashboard Utama

| NO | TUGAS | PAGE | LANGKAH | EKSPEKTASI APLIKASI | RESPON | | | KETERANGAN | DIUJI OLEH |
|----|-------|------|---------|---------------------|--------|--|--|------------|------------|
| | | | | | **Lancar** | **Cukup Lama** | **Stop** | | |
| 4 | Melihat ringkasan data di dashboard | `/dashboard` | 1. Setelah login, amati halaman dashboard <br> 2. Identifikasi kartu statistik / ringkasan yang ditampilkan | Halaman dashboard menampilkan ringkasan data keseluruhan sistem (kolam, komoditas, keuangan, dll.) dengan jelas | | | | | |
| 5 | Navigasi antar menu utama | `/dashboard` | 1. Klik menu **Kolam** di sidebar <br> 2. Klik menu **Komoditas** di sidebar <br> 3. Klik menu **Pengguna** di sidebar <br> 4. Kembali ke **Dashboard** | Setiap klik menu menampilkan halaman yang sesuai tanpa error, sidebar aktif berubah highlight | | | | | |
| 6 | Mengakses pengaturan profil | `/dashboard/profile-setting` | 1. Klik ikon profil atau nama pengguna di navbar/sidebar <br> 2. Pilih **Pengaturan Profil** | Halaman pengaturan profil terbuka dan menampilkan data pengguna yang sedang login | | | | | |

---

### 👤 Bagian 3 — Manajemen Pengguna (Users)

| NO | TUGAS | PAGE | LANGKAH | EKSPEKTASI APLIKASI | RESPON | | | KETERANGAN | DIUJI OLEH |
|----|-------|------|---------|---------------------|--------|--|--|------------|------------|
| | | | | | **Lancar** | **Cukup Lama** | **Stop** | | |
| 7 | Melihat daftar pengguna | `/dashboard/users` | 1. Klik menu **Pengguna** di sidebar <br> 2. Amati tabel daftar pengguna yang ditampilkan | Sistem menampilkan tabel daftar pengguna beserta informasi kolom: nama, email, peran, dan status | | | | | |
| 8 | Mencari pengguna berdasarkan nama | `/dashboard/users` | 1. Buka halaman daftar pengguna <br> 2. Ketik nama pengguna pada kolom pencarian <br> 3. Amati hasil filter yang muncul | Tabel otomatis memfilter dan menampilkan pengguna yang sesuai dengan kata kunci pencarian | | | | | |
| 9 | Menambah pengguna baru | `/dashboard/users` | 1. Klik tombol **Tambah Pengguna** / **+ Pengguna** <br> 2. Isi form: nama lengkap, email, password, peran <br> 3. Pilih izin akses kolam (jika ada) <br> 4. Klik tombol **Simpan** | Modal form tertutup dan pengguna baru muncul di tabel daftar pengguna | | | | | |
| 10 | Melihat detail pengguna | `/dashboard/users` | 1. Klik nama atau baris pengguna pada tabel <br> 2. Amati panel detail yang terbuka | Sistem menampilkan detail lengkap pengguna: nama, email, peran, kolam yang diizinkan, dan tanggal dibuat | | | | | |
| 11 | Mengedit data pengguna | `/dashboard/users` | 1. Pada baris pengguna, klik ikon atau tombol **Edit** <br> 2. Ubah salah satu data (misalnya nama atau peran) <br> 3. Klik **Simpan** | Modal form tertutup dan perubahan data tercermin pada tabel daftar pengguna | | | | | |
| 12 | Menghapus pengguna | `/dashboard/users` | 1. Pada baris pengguna, klik ikon atau tombol **Hapus** <br> 2. Konfirmasi penghapusan pada dialog yang muncul | Dialog konfirmasi muncul sebelum penghapusan; setelah konfirmasi, pengguna terhapus dari tabel | | | | | |

---

### 🐟 Bagian 4 — Manajemen Kolam (Pools)

| NO | TUGAS | PAGE | LANGKAH | EKSPEKTASI APLIKASI | RESPON | | | KETERANGAN | DIUJI OLEH |
|----|-------|------|---------|---------------------|--------|--|--|------------|------------|
| | | | | | **Lancar** | **Cukup Lama** | **Stop** | | |
| 13 | Melihat daftar kolam | `/dashboard/pools` | 1. Klik menu **Kolam** di sidebar <br> 2. Amati daftar/kartu kolam yang ditampilkan | Sistem menampilkan daftar kolam beserta informasi: nama kolam, komoditas, status aktif/nonaktif | | | | | |
| 14 | Menambah kolam baru | `/dashboard/pools` | 1. Klik tombol **Tambah Kolam** / **+ Kolam** <br> 2. Isi form: nama kolam, deskripsi, kapasitas, dll. <br> 3. Klik tombol **Simpan** | Modal form tertutup dan kolam baru muncul di daftar kolam | | | | | |
| 15 | Melihat detail kolam | `/dashboard/pools` | 1. Klik nama atau kartu kolam pada daftar <br> 2. Amati halaman detail kolam yang terbuka | Halaman detail kolam terbuka menampilkan informasi lengkap: data kolam, komoditas terkait, riwayat inventori | | | | | |
| 16 | Mengedit data kolam | `/dashboard/pools` | 1. Pada daftar/detail kolam, klik tombol **Edit** <br> 2. Ubah salah satu data kolam (misalnya nama atau kapasitas) <br> 3. Klik **Simpan** | Modal form tertutup dan perubahan data tercermin pada daftar/detail kolam | | | | | |
| 17 | Menonaktifkan / mengaktifkan kolam | `/dashboard/pools` | 1. Pada daftar atau detail kolam, cari tombol atau toggle status <br> 2. Ubah status kolam (aktif ↔ nonaktif) <br> 3. Konfirmasi perubahan (jika ada dialog) | Status kolam berubah dan tampilan di daftar/detail memperbarui status secara langsung | | | | | |
| 18 | Melihat data karantina kolam | `/dashboard/pools` | 1. Buka detail salah satu kolam <br> 2. Cari tab atau menu **Karantina** <br> 3. Amati daftar data karantina yang tampil | Sistem menampilkan riwayat atau data karantina kolam yang terkait | | | | | |

---

## Rangkuman Hasil Pengujian

| Bagian | Jumlah Tugas | Lancar | Cukup Lama | Stop |
|--------|-------------|--------|------------|------|
| Auth | 3 | | | |
| Dashboard | 3 | | | |
| Pengguna / Users | 6 | | | |
| Kolam / Pools | 6 | | | |
| **Total** | **18** | | | |

---

## Catatan Moderator

```
_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________
```

---

## Tanda Tangan

| | Moderator | Peserta Uji |
|---|-----------|-------------|
| **Nama** | | |
| **Tanda Tangan** | | |
| **Tanggal** | | |

---

> *Dokumen ini digunakan untuk keperluan penelitian Tugas Akhir (Skripsi). Data hasil pengujian bersifat rahasia dan hanya digunakan untuk keperluan akademis.*
