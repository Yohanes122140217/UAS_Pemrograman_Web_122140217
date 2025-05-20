===========================================
                 Sellit.
       Aplikasi Web Jual Beli Online
===========================================

Deskripsi:
----------
Sellit. adalah aplikasi web berbasis e-commerce yang memungkinkan pengguna untuk menjual dan membeli produk secara online. Aplikasi ini dirancang agar mudah digunakan oleh pengguna umum dan pemilik usaha kecil untuk mengelola toko, menampilkan produk, dan memfasilitasi transaksi dengan aman.

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
   - Statistik penjualan, pengguna, dan produk (opsional)

Dependensi:
-----------
Berikut ini adalah beberapa package Python yang dibutuhkan oleh aplikasi ini agar dapat berjalan:

- Flask / FastAPI / Pyramid (tergantung implementasi framework)
- SQLAlchemy
- Alembic
- Jinja2 / Chameleon (templating)
- bcrypt / passlib (hashing password)
- python-dotenv
- pandas, numpy
- matplotlib (jika menampilkan grafik)
- opencv-python, librosa, mediapipe (jika ada pengolahan media)
- yfinance (jika aplikasi terhubung ke data saham)
- uvicorn / waitress (server WSGI/ASGI)
- pyramid_jwt (untuk otentikasi berbasis token)
- matplotlib, scipy, soundfile, pydub, audioread, dll (jika terdapat pemrosesan audio/visual)

Kamu dapat menginstal seluruh dependensi dengan perintah:
