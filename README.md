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

## SETUP BACKEND (ikuti langkah ini)

### Cara A — Paling mudah (disarankan)

1. Buka [sheets.google.com](https://sheets.google.com) → **Buat spreadsheet kosong baru**
2. Beri nama: **Barbie School — Database**
3. Klik menu **Extensions → Apps Script**
4. Hapus semua kode default, lalu **paste seluruh isi `Code.gs`**
5. Tekan **Ctrl+S** (simpan), beri nama project: `Barbie School API`
6. Di dropdown fungsi di atas, **pilih `setup`** lalu klik tombol **Run ▶**
7. Muncul popup izin:
   - Klik **Review permissions**
   - Pilih akun Google kamu
   - Klik **Advanced** → **Go to Barbie School API (unsafe)** → **Allow**
8. Setelah selesai:
   - Lihat **Execution log** di bagian bawah (harus ada tulisan `✅ SETUP BERHASIL!`)
   - Kembali ke tab spreadsheet → **refresh** → akan muncul sheet **Announcements** dan **Events** berisi data contoh

### Cara B — Script standalone

1. Buka [script.google.com](https://script.google.com) → **New project**
2. Paste kode `Code.gs`, jalankan fungsi **`setup`**
3. Spreadsheet baru akan muncul di **Google Drive** (cari nama "Barbie School — Database")

### Cek apakah setup sudah benar

Jalankan fungsi **`checkSetup`** (pilih di dropdown lalu Run).  
Log harus menampilkan `✅ Setup terlihat OK` beserta URL spreadsheet.

### Set password admin (opsional)

1. Di editor Apps Script, klik ikon ⚙️ **Project Settings**
2. Scroll ke **Script Properties**
3. Pastikan ada:
   - `ADMIN_PASSWORD` = `Bismillaah` (atau ganti sesuai keinginan)
   - `SPREADSHEET_ID` = (terisi otomatis oleh setup)

> Password **tidak pernah** ditulis di frontend / GitHub Pages.

### Deploy Web App

1. Klik **Deploy → New deployment**
2. Type: **Web app**
3. Description: `Barbie School API`
4. **Execute as:** Me  
5. **Who has access:** Anyone  
6. Klik **Deploy**
7. **Salin Web App URL** (bentuk: `https://script.google.com/macros/s/....../exec`)

### Hubungkan ke Frontend

Buka `index.html`, cari baris:

```js
API_URL: 'https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec'
```

Ganti dengan URL Web App yang baru saja kamu salin.

---

## Deploy Frontend ke GitHub Pages

1. Buat repository baru di GitHub
2. Upload **hanya** `index.html`
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

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Run tidak terjadi apa-apa | Pastikan dropdown fungsi memilih **`setup`** (bukan doGet/doPost), lalu Run |
| Tidak muncul di Google Sheet | Gunakan **Cara A** (buat Sheet dulu → Extensions → Apps Script). Setelah setup, **refresh** tab spreadsheet |
| Minta izin berulang | Klik Advanced → Go to … (unsafe) → Allow. Wajib dilakukan sekali |
| Execution log kosong | Klik menu **Executions** di sidebar kiri Apps Script, buka log terbaru |
| Status Offline di web | Cek `API_URL` sudah benar & Web App sudah di-deploy ulang setelah ubah kode |
| Password salah terus | Project Settings → Script Properties → pastikan `ADMIN_PASSWORD` = `Bismillaah` |
| Sheet kosong | Jalankan ulang fungsi `setup()` |

---

## Struktur File

```
barbie-school/
├── index.html      ← Frontend (upload ke GitHub Pages)
├── Code.gs         ← Backend (paste di Apps Script)
└── README.md
```

Barbie School 🎀 — Stay updated, stay fabulous!
