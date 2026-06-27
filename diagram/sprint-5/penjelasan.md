# Penjelasan Activity Diagram Sprint 5

---

## 1. Activity Diagram Manajemen Non-Inventaris (diagram_manajemen_non_inventaris)

Gambar Activity Diagram Manajemen Non-Inventaris menunjukkan alur proses melihat dan mencatat transaksi keuangan non-inventaris berupa pemasukan dan pengeluaran yang tidak terkait stok barang. Admin membuka halaman Non-Inventaris, sistem memuat data dan menampilkan kartu statistik total transaksi, pemasukan, dan pengeluaran beserta tabel daftar transaksi. Admin dapat melihat detail transaksi melalui halaman detail yang memuat informasi produk, catatan kuantitas dan jenis transaksi, serta detail finansial seperti tanggal, harga per unit, total, catatan, dan bukti nota.

Ketika admin menambah catatan, sistem membuka sheet form. Admin memilih jenis transaksi terlebih dahulu karena memengaruhi opsi produk yang tersedia, di mana pemasukan hanya menampilkan produk berkategori pendanaan sedangkan pengeluaran menampilkan produk non-inventaris lainnya. Admin mengisi form yang terdiri dari produk, tanggal, tipe transaksi, jumlah, harga per unit, catatan, dan foto bukti, dengan total dihitung otomatis. Apabila produk berkategori pendanaan, field jumlah disembunyikan dan diisi otomatis. Setelah form diisi, sistem memvalidasi input dan menampilkan popup konfirmasi sebelum menyimpan data ke basis data.
