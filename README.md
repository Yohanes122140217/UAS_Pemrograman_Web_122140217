=
                 Sellit.
       Aplikasi Web Jual Beli Online
=
Deskripsi:
----------
Sellit. adalah aplikasi web berbasis e-commerce yang memungkinkan pengguna untuk menjual dan membeli produk secara online.
Website ini dirancang agar mudah digunakan oleh mahasiswa ITERA untuk mengelola toko, menampilkan produk, dan memfasilitasi transaksi dengan aman.

Fitur Aplikasi:
---------------
1. Registrasi dan Login Pengguna
   - Otentikasi akun penjual dan pembeli
2. Manajemen Produk
   - Tambah, edit, dan hapus produk
   - Upload gambar produk
3. Pencarian dan Filter
   - Cari produk berdasarkan nama
   - Filter kategori dan harga
4. Keranjang Belanja & Checkout
   - Menambahkan produk ke keranjang
   - Proses checkout sederhana
5. Ulasan Produk
   - Pembeli dapat memberikan rating dan komentar
6. Dashboard Admin
   - Statistik penjualan, pengguna, dan produk

Dependensi:
-----------
Berikut ini adalah beberapa package Python yang dibutuhkan oleh aplikasi ini agar dapat berjalan:

- RESTfulAPI by pyramid-python
- PostgreSQL (Database provider)
- SQLAlchemy (ORM untuk managing database)
- Alembic (untuk database schema versioning dan commit versions)
- bcrypt / passlib (hashing password)
- python-venv (untuk penyusunan environment)
- uvicorn / waitress (server WSGI/ASGI)
- pyramid_jwt (untuk otentikasi berbasis token)
- pyramid_tm + zope (untuk menyusun commit ke database secara otomatis)

