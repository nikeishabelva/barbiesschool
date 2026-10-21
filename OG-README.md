# Barbie School — OG Image Support

Revisi agar link website **https://nikeishabelva.github.io/barbiesschool/** muncul thumbnail otomatis saat di-share ke WhatsApp, Facebook, Twitter/X, Telegram, dll.

## Perubahan

1. **index.html** — ditambahkan meta tag Open Graph + Twitter Card:
   - `og:image` → `https://nikeishabelva.github.io/barbiesschool/og-image.png`
   - `og:title`, `og:description`, `og:url`, dll.
   - Twitter Card `summary_large_image`

2. **og-image.png** — gambar preview 1200×630 (ukuran ideal untuk social media)

## Cara Deploy

1. Download & extract zip ini
2. Upload / replace file berikut ke repo GitHub `nikeishabelva/barbiesschool` (branch `main`):
   - `index.html` (overwrite)
   - `og-image.png` (file baru di root)
3. Pastikan GitHub Pages aktif (Settings → Pages → Deploy from branch `main` / root)
4. Tunggu 1–2 menit agar Pages ter-update
5. **Clear cache preview** (penting!):
   - WhatsApp: kirim link ke diri sendiri / chat lain. Kalau masih lama, gunakan https://developers.facebook.com/tools/debug/ → masukkan URL → **Scrape Again**
   - Facebook: tool yang sama
   - Twitter/X: https://cards-dev.twitter.com/validator

## Cek cepat

Setelah deploy, buka:
https://nikeishabelva.github.io/barbiesschool/og-image.png

Harus langsung tampil gambar pink Barbie School.

## File yang tidak diubah

- `Code.gs` (backend Apps Script)
- `hotlink/`, `qris.png`, `README.md` asli repo tetap sama

Barbie School 🎀 — Stay updated, stay fabulous!
