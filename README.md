# Barbie School — School Announcement Center

Aplikasi pengumuman sekolah berbasis HTML/CSS/JavaScript + **Google Sheets** sebagai database (via Apps Script).

## Fitur

### Publik
- Dashboard + statistik real-time
- Pencarian & filter kategori pengumuman
- Detail pengumuman (modal)
- Agenda sekolah
- Responsive (laptop & HP)
- Tema soft pink

### Admin (tersembunyi)
- Akses: **klik logo 🎀 sebanyak 4 kali** berturut-turut
- Login dengan password (disimpan di Script Properties, **tidak** ada di kode GitHub Pages)
- Full **CRUD** Pengumuman
- Full **CRUD** Agenda Sekolah
- Logout: klik logo 4× lagi saat sudah login

---

## Struktur File

```
barbie-school/
├── index.html      ← Frontend (upload ke GitHub Pages)
├── Code.gs         ← Backend Apps Script (paste di script.google.com)
└── README.md
```

---

## Setup Backend (Google Apps Script)

### 1. Buat project baru
1. Buka [script.google.com](https://script.google.com)
2. **New project**
3. Hapus kode default, lalu **paste seluruh isi `Code.gs`**

### 2. Jalankan setup (auto-buat Spreadsheet + header)
1. Di editor, pilih fungsi **`setup`** di dropdown
2. Klik **Run**
3. Izinkan akses (Review permissions → Advanced → Go to … → Allow)
4. Buka **Executions** / log → pastikan muncul  
   `✅ Setup selesai!` beserta URL Spreadsheet

Script akan otomatis:
- Membuat Spreadsheet baru bernama **Barbie School — Database**
- Membuat sheet `Announcements` + header
- Membuat sheet `Events` + header
- Mengisi data contoh
- Menyimpan `SPREADSHEET_ID` ke Script Properties
- Menyimpan password default `Bismillaah`

### 3. (Opsional) Ganti password
1. Klik ikon ⚙️ **Project Settings**
2. Scroll ke **Script Properties**
3. Edit property `ADMIN_PASSWORD` → isi password baru

> Password **tidak pernah** ditulis di frontend / GitHub Pages.

### 4. Deploy sebagai Web App
1. Klik **Deploy** → **New deployment**
2. Type: **Web app**
3. Description: `Barbie School API`
4. **Execute as:** Me
5. **Who has access:** Anyone
6. **Deploy**
7. Salin **Web App URL** (bentuknya `https://script.google.com/macros/s/....../exec`)

### 5. Hubungkan ke Frontend
Buka `index.html`, cari baris:

```js
API_URL: 'https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec'
```

Ganti dengan URL Web App yang baru saja kamu salin.

---

## Deploy Frontend ke GitHub Pages

1. Buat repository baru di GitHub
2. Upload **hanya** `index.html` (dan README jika mau)
3. Settings → Pages → Deploy from branch → `main` → `/ (root)`
4. Simpan, tunggu beberapa detik, buka URL GitHub Pages

---

## Cara Pakai Admin

1. Buka website
2. **Klik logo 🎀 sebanyak 4 kali** (dalam 2 detik)
3. Muncul modal login → ketik password (`Bismillaah` default)
4. Setelah login, menu **Kelola** muncul di sidebar
5. Kamu bisa:
   - Tambah / Edit / Hapus **Pengumuman**
   - Tambah / Edit / Hapus **Agenda**
6. Logout: klik logo 4× lagi → konfirmasi keluar

Sesi admin disimpan di `sessionStorage` (hilang saat tab ditutup).

---

## API Reference (untuk developer)

| Method | Action | Auth | Keterangan |
|--------|--------|------|------------|
| GET | `getAnnouncements` | Tidak | Ambil semua pengumuman |
| GET | `getEvents` | Tidak | Ambil semua agenda |
| GET | `ping` | Tidak | Cek status API |
| POST | `login` | Password | Verifikasi password |
| POST | `createAnnouncement` | Password | Tambah pengumuman |
| POST | `updateAnnouncement` | Password | Edit pengumuman |
| POST | `deleteAnnouncement` | Password | Hapus pengumuman |
| POST | `createEvent` | Password | Tambah agenda |
| POST | `updateEvent` | Password | Edit agenda |
| POST | `deleteEvent` | Password | Hapus agenda |

Contoh POST body:
```json
{
  "action": "createAnnouncement",
  "password": "Bismillaah",
  "title": "Judul",
  "category": "Akademik",
  "date": "2026-10-14",
  "body": "Isi pengumuman..."
}
```

---

## Catatan Keamanan

- Password **hanya** disimpan di Script Properties Apps Script.
- Frontend **tidak** menyimpan password hard-coded.
- Setiap request admin mengirim password (diverifikasi server-side).
- Untuk keamanan lebih tinggi, ganti password default setelah setup.
- Web App di-set "Anyone" agar bisa diakses dari GitHub Pages (wajib untuk public frontend).

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Status Offline | Cek API_URL sudah benar & Web App sudah di-deploy |
| Password salah terus | Pastikan Script Property `ADMIN_PASSWORD` = `Bismillaah` (atau password yang kamu set) |
| Sheet kosong | Jalankan ulang fungsi `setup()` |
| CORS / failed to fetch | Pastikan Content-Type POST = `text/plain` (sudah dihandle di kode) |
| Data tidak update | Hard refresh (Ctrl+F5) atau cek Executions di Apps Script |

---

Barbie School 🎀 — Stay updated, stay fabulous!
