# Sistem Manajemen Data Pegawai

Aplikasi berbasis web untuk membantu admin mengelola data pegawai secara terpusat, mulai dari menambahkan, melihat, mengubah, hingga menghapus data. Aplikasi ini juga menyediakan dashboard visual untuk menampilkan ringkasan data pegawai berdasarkan jenis kelamin, pendidikan terakhir, dan usia.

Proyek ini dikembangkan sebagai bagian dari **Uji Kompetensi Sertifikasi Junior Web Programming**.

## Fitur Utama

### 1. Manajemen Data Pegawai
- **Tambah data pegawai** dengan atribut minimal:
  - Nama Pegawai
  - Jenis Kelamin
  - Pendidikan Terakhir
  - Tanggal Lahir
- **Lihat data pegawai** dalam bentuk daftar/tabel.
- **Ubah data pegawai** yang sudah tersimpan.
- **Hapus data pegawai** setelah admin menyetujui pop-up konfirmasi.

### 2. Dashboard Data Pegawai
Dashboard menyajikan visualisasi ringkasan data pegawai, meliputi:
- **Grafik jenis kelamin:** perbandingan jumlah pegawai laki-laki dan perempuan.
- **Grafik pendidikan terakhir:** jumlah pegawai berdasarkan jenjang pendidikan terakhir.
- **Grafik usia:** distribusi jumlah pegawai berdasarkan kelompok usia. Usia dihitung dari tanggal lahir yang tersimpan.

> Catatan: rentang kelompok usia dan jenis grafik dapat disesuaikan dengan implementasi aplikasi.

## Teknologi yang Digunakan

Stack yang direkomendasikan untuk proyek ini:

| Teknologi | Kegunaan |
|---|---|
| PHP | Bahasa pemrograman backend |
| Laravel | Framework backend, routing, validasi, dan pengelolaan data |
| Inertia.js | Penghubung Laravel dengan frontend React tanpa perlu membangun REST API terpisah untuk kebutuhan halaman aplikasi |
| React | Membangun antarmuka pengguna yang interaktif |
| PostgreSQL | Database untuk menyimpan data pegawai |
| Vite | Menjalankan proses development dan build aset frontend |

**Penting:** sesuaikan tabel teknologi ini dengan teknologi dan versi yang benar-benar digunakan di repository. Tambahkan library grafik dan UI yang digunakan setelah pilihannya sudah ditetapkan.

## Gambaran Arsitektur

Aplikasi menggunakan pendekatan **monolith dengan Laravel dan Inertia.js**:

1. Laravel menangani route, controller, validasi input, proses CRUD, dan komunikasi dengan database.
2. Inertia.js meneruskan data dari Laravel ke halaman frontend.
3. React digunakan untuk membangun halaman, form, tabel, komponen pop-up konfirmasi, dan visualisasi dashboard.
4. Data dashboard dihitung dari data pegawai yang tersimpan di database.

Dengan pendekatan ini, backend dan frontend tetap berada dalam satu repository serta tidak perlu membuat dan mengelola REST API terpisah hanya untuk menghubungkan halaman React dengan Laravel.

## Persyaratan Sistem

Pastikan perangkat pengembangan telah memiliki perangkat berikut:

- PHP dengan versi yang sesuai dengan versi Laravel pada proyek.
- Composer.
- Node.js dan npm.
- PostgreSQL.
- Git.

Periksa dokumentasi resmi Laravel untuk persyaratan versi PHP dan ekstensi yang dibutuhkan oleh versi Laravel yang digunakan.

## Instalasi dan Menjalankan Aplikasi

### 1. Clone repository

```bash
git clone <URL_REPOSITORY>
cd <NAMA_FOLDER_PROYEK>
```

Ganti `<URL_REPOSITORY>` dan `<NAMA_FOLDER_PROYEK>` sesuai repository milikmu.

### 2. Instal dependensi backend

```bash
composer install
```

### 3. Siapkan file konfigurasi environment

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Pada Windows, file tersebut juga dapat disalin secara manual melalui File Explorer.

### 4. Buat application key

```bash
php artisan key:generate
```

### 5. Konfigurasikan database

Buka file `.env`, lalu sesuaikan konfigurasi database dengan lingkungan lokal. Contoh untuk MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=
```

Buat database dengan nama yang sesuai sebelum menjalankan migrasi. Sesuaikan konfigurasi di atas apabila menggunakan PostgreSQL atau database lain yang didukung proyek.

### 6. Jalankan migrasi database

```bash
php artisan migrate
```

Apabila repository menyediakan seeder dan data awal memang diperlukan, jalankan:

```bash
php artisan db:seed
```

### 7. Instal dependensi frontend

```bash
npm install
```

### 8. Jalankan aplikasi

Jalankan server Laravel:

```bash
php artisan serve
```

Di terminal lain, jalankan Vite:

```bash
npm run dev
```

Buka alamat lokal yang ditampilkan oleh Laravel, biasanya:

```text
http://127.0.0.1:8000
```

## Aturan Pengelolaan Data

- Setiap data pegawai harus memiliki atribut wajib sesuai validasi form.
- Tanggal lahir digunakan sebagai dasar perhitungan usia pada dashboard.
- Setiap proses penghapusan harus menampilkan pop-up konfirmasi terlebih dahulu.
- Data hanya dihapus setelah admin menyetujui konfirmasi tersebut.

## Status Pengembangan

Proyek ini dikembangkan untuk memenuhi kebutuhan Uji Kompetensi Sertifikasi Junior Web Programming. Fitur dan teknologi yang tercantum pada README perlu disesuaikan dengan implementasi akhir aplikasi.

## Pengembang

Dikembangkan oleh Naufal Rizki Abyan.
