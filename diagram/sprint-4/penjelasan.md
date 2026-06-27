# Penjelasan Activity Diagram Sprint 4

---

## 1. Activity Diagram Laporan Kematian (diagram_menampilkan_laporan_kematian)

Gambar Activity Diagram Laporan Kematian menunjukkan alur proses melihat dan memfilter data laporan kematian ikan. Admin membuka halaman Laporan Kematian, sistem memuat dan menampilkan seluruh data dari API. Admin dapat mengatur filter berdasarkan rentang tanggal, kolam, siklus, dan petugas, di mana filter siklus hanya tersedia setelah kolam dipilih. Admin juga dapat mereset filter, melihat detail data melalui sheet yang memuat foto bukti, jumlah ikan mati, tanggal, petugas, catatan, serta informasi kolam dan siklus, atau mengganti tab antara Ringkasan dan Grafik dengan tab Data Tabel.

---

## 2. Activity Diagram Laporan Panen (diagram_menampilkan_laporan_panen)

Gambar Activity Diagram Laporan Panen menunjukkan alur proses melihat dan memfilter data laporan hasil panen ikan. Admin membuka halaman Laporan Panen, sistem memuat dan menampilkan seluruh data dari API. Admin dapat mengatur filter berdasarkan rentang tanggal, kolam, siklus, dan petugas, mereset filter, melihat detail data melalui sheet yang memuat foto bukti, jumlah panen, berat total, tanggal, petugas, serta informasi kolam dan siklus, atau mengganti tab antara Ringkasan dan Grafik dengan tab Data Tabel.

---

## 3. Activity Diagram Laporan Tebar Benih (diagram_menampilkan_laporan_tebar_benih)

Gambar Activity Diagram Laporan Tebar Benih menunjukkan alur proses melihat dan memfilter data laporan penebaran benih ke kolam pembibitan. Admin membuka halaman Laporan Tebar Benih, sistem memuat data khusus kolam berkategori pembibitan dari API. Admin dapat mengatur filter berdasarkan rentang tanggal, kolam pembibitan, siklus, dan petugas, mereset filter, melihat detail data melalui sheet yang memuat foto bukti, jumlah tebar, jumlah saat ini, berat rata-rata awal, tanggal, serta informasi kolam, atau mengganti tab antara Ringkasan dan Grafik dengan tab Data Tabel.

---

## 4. Activity Diagram Laporan IoT (diagram_menampilkan_laporan_iot)

Gambar Activity Diagram Laporan IoT menunjukkan alur proses melihat data sensor kualitas air dari perangkat IoT. Admin membuka halaman Laporan IoT, sistem memuat data sensor dari API. Admin dapat mengatur filter berdasarkan rentang tanggal dan parameter yang ditampilkan yaitu pH, suhu, atau keduanya, mereset filter, atau mengganti tab antara Ringkasan dan Grafik yang menampilkan statistik dan grafik tren, dengan tab Data Tabel yang menampilkan histori nilai sensor.

---

## 5. Activity Diagram Laporan Keuangan (diagram_menampilkan_laporan_keuangan)

Gambar Activity Diagram Laporan Keuangan menunjukkan alur proses melihat ringkasan dan rincian transaksi keuangan. Admin membuka halaman Keuangan, sistem memuat dan menggabungkan data dari empat sumber transaksi yaitu komoditas, inventaris, pengajuan inventaris, dan non-inventaris, lalu menampilkan kartu statistik total pemasukan dan pengeluaran. Admin dapat mengatur filter rentang tanggal, mereset tanggal, atau mengganti tab antara Ringkasan dan Grafik, Laporan, Semua Data, serta tab per sumber transaksi. Pada tab Ringkasan dan Grafik, admin dapat memfilter berdasarkan tipe transaksi yaitu semua, reguler non-hibah, atau hibah.

---

## 6. Activity Diagram Menampilkan Landing Page (diagram_menampilkan_landing_page)

Gambar Activity Diagram Menampilkan Landing Page menunjukkan alur proses pengunjung mengakses halaman publik aplikasi. Pengunjung membuka halaman Landing Page, sistem memuat data guest dari API lalu merender seluruh section secara berurutan meliputi Navbar, Header, Profil, Kolam, Populasi, Panen, Ringkasan Keuangan, CTA, dan Footer. Pengunjung dapat menelusuri informasi yang tersedia atau menekan tombol Login pada Navbar untuk diarahkan ke halaman Login.

---

## 7. Activity Diagram Menu Beranda (diagram_menu_beranda)

Gambar Activity Diagram Menu Beranda menunjukkan alur proses melihat ringkasan kondisi tambak pada halaman dashboard. Admin membuka halaman Beranda, sistem memuat data statistik, keuangan, pakan, pengajuan inventaris, dan inventaris secara paralel. Apabila terdapat pengajuan pending atau stok rendah, sistem menampilkan banner notifikasi. Sistem kemudian merender banner sambutan, ringkasan finansial, enam kartu statistik, grafik tren pakan, dan grafik status populasi ikan. Admin dapat membaca informasi yang ditampilkan atau mengklik notifikasi untuk diarahkan ke halaman Pengajuan Inventaris atau halaman Inventaris.

---

## 8. Activity Diagram Manajemen Komoditas (diagram_manajemen_komoditas)

Gambar Activity Diagram Manajemen Komoditas menunjukkan alur proses melihat dan mencatat transaksi penjualan hasil panen ikan. Admin membuka halaman Komoditas, sistem memuat data dan menampilkan kartu statistik total stok, ikan keluar, dan ikan masuk. Admin dapat mengatur filter rentang tanggal, mengganti tab antara Ikan Masuk, Ikan Keluar, dan Laporan, atau menambah penjualan melalui sheet form yang memuat field pembeli, tanggal, catatan, foto nota, dan daftar item komoditas dengan total harga otomatis. Setelah form diisi, sistem memvalidasi input dan menampilkan popup konfirmasi sebelum menyimpan data ke basis data.
