/**
 * ============================================================
 *  Barbie School — Backend (Google Apps Script)
 * ============================================================
 *
 *  CARA SETUP YANG BENAR (ikuti urutan ini):
 *
 *  CARA A — PALING MUDAH (disarankan)
 *  1. Buka https://sheets.google.com → buat spreadsheet kosong baru
 *  2. Beri nama: "Barbie School — Database"
 *  3. Klik menu: Extensions → Apps Script
 *  4. Hapus kode default, paste SEMUA kode ini
 *  5. Simpan (Ctrl+S), beri nama project: Barbie School API
 *  6. Di dropdown fungsi (atas), pilih "setup" lalu klik Run ▶
 *  7. Muncul popup izin → Review permissions → pilih akun Google
 *     → Advanced → Go to Barbie School API (unsafe) → Allow
 *  8. Setelah selesai, lihat log di bawah (Execution log)
 *     atau buka kembali tab spreadsheet-nya → sheet sudah terisi
 *
 *  CARA B — Script standalone
 *  1. Buka https://script.google.com → New project
 *  2. Paste kode ini, jalankan setup()
 *  3. Spreadsheet akan muncul di Google Drive (cari "Barbie School")
 *
 *  SETELAH setup() BERHASIL:
 *  - Deploy → New deployment → Web app
 *    Execute as: Me | Who has access: Anyone
 *  - Salin URL Web App → tempel di index.html (CONFIG.API_URL)
 *
 *  Password admin disimpan di Script Properties (bukan di kode).
 *  Default: Bismillaah
 */

const SHEET_ANNOUNCEMENTS = 'Announcements';
const SHEET_EVENTS = 'Events';
const PROP_PASSWORD = 'ADMIN_PASSWORD';
const PROP_SSID = 'SPREADSHEET_ID';

// ============================================================
//  SETUP — Jalankan fungsi ini SEKALI (pilih "setup" lalu Run)
// ============================================================
function setup() {
  const props = PropertiesService.getScriptProperties();
  let ss = null;
  let createdNew = false;

  // 1) Coba pakai spreadsheet aktif (jika script di-bind ke Sheet)
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    ss = null;
  }

  // 2) Kalau belum ada, coba buka dari Script Properties
  if (!ss) {
    const savedId = props.getProperty(PROP_SSID);
    if (savedId) {
      try {
        ss = SpreadsheetApp.openById(savedId);
      } catch (e) {
        ss = null;
      }
    }
  }

  // 3) Kalau masih belum ada → buat spreadsheet baru
  if (!ss) {
    ss = SpreadsheetApp.create('Barbie School — Database');
    createdNew = true;
  }

  // Simpan ID-nya
  props.setProperty(PROP_SSID, ss.getId());

  // ---------- Sheet Announcements ----------
  let shAnn = ss.getSheetByName(SHEET_ANNOUNCEMENTS);
  if (!shAnn) {
    shAnn = ss.insertSheet(SHEET_ANNOUNCEMENTS);
  }
  const annHeaders = ['id', 'title', 'category', 'date', 'body', 'createdAt', 'updatedAt'];
  const needAnnHeader = shAnn.getLastRow() === 0 || String(shAnn.getRange(1, 1).getValue()) !== 'id';
  if (needAnnHeader) {
    shAnn.clear();
    shAnn.getRange(1, 1, 1, annHeaders.length).setValues([annHeaders]);
    shAnn.setFrozenRows(1);
    shAnn.getRange(1, 1, 1, annHeaders.length)
      .setFontWeight('bold')
      .setBackground('#f7a8c4')
      .setFontColor('#4d3541');
    shAnn.setColumnWidth(1, 140);
    shAnn.setColumnWidth(2, 280);
    shAnn.setColumnWidth(5, 400);
  }

  // ---------- Sheet Events ----------
  let shEvt = ss.getSheetByName(SHEET_EVENTS);
  if (!shEvt) {
    shEvt = ss.insertSheet(SHEET_EVENTS);
  }
  const evtHeaders = ['id', 'dateLabel', 'title', 'time', 'sortDate', 'createdAt', 'updatedAt'];
  const needEvtHeader = shEvt.getLastRow() === 0 || String(shEvt.getRange(1, 1).getValue()) !== 'id';
  if (needEvtHeader) {
    shEvt.clear();
    shEvt.getRange(1, 1, 1, evtHeaders.length).setValues([evtHeaders]);
    shEvt.setFrozenRows(1);
    shEvt.getRange(1, 1, 1, evtHeaders.length)
      .setFontWeight('bold')
      .setBackground('#f7a8c4')
      .setFontColor('#4d3541');
  }

  // Hapus Sheet1 default jika masih ada & sudah ada sheet lain
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) { /* ignore */ }
  }

  // ---------- Seed data contoh (hanya jika kosong) ----------
  if (shAnn.getLastRow() < 2) {
    const now = new Date().toISOString();
    const seedAnn = [
      [String(Date.now()), 'Jadwal Ujian Tengah Semester', 'Akademik', '2026-09-07',
        'Ujian Tengah Semester akan dilaksanakan mulai Senin, 7 September 2026. Silakan cek jadwal masing-masing kelas dan persiapkan diri dengan baik. Semangat, Barbie Scholars! 🎀', now, now],
      [String(Date.now() + 1), 'Pendaftaran Ekstrakurikuler Dibuka', 'Kegiatan', '2026-09-03',
        'Pendaftaran ekstrakurikuler untuk semester baru telah dibuka. Pilih kegiatan yang sesuai dengan minat dan bakatmu. Pendaftaran dilakukan melalui wali kelas.', now, now],
      [String(Date.now() + 2), 'Rapat Pengurus OSIS', 'OSIS', '2026-09-05',
        'Seluruh pengurus OSIS dimohon hadir pada rapat persiapan program kerja. Detail tempat dan waktu dapat dilihat pada agenda sekolah.', now, now],
      [String(Date.now() + 3), 'Pembayaran Administrasi Semester', 'Administrasi', '2026-09-10',
        'Pengingat pembayaran administrasi semester. Untuk informasi lebih lanjut, silakan menghubungi bagian tata usaha sekolah.', now, now]
    ];
    shAnn.getRange(2, 1, seedAnn.length, annHeaders.length).setValues(seedAnn);
  }

  if (shEvt.getLastRow() < 2) {
    const now = new Date().toISOString();
    const seedEvt = [
      [String(Date.now() + 10), '03 SEP', 'Pendaftaran Ekskul', '08:00 — 14:00', '2026-09-03', now, now],
      [String(Date.now() + 11), '05 SEP', 'Rapat OSIS', '13:00 — 15:00', '2026-09-05', now, now],
      [String(Date.now() + 12), '07 SEP', 'UTS Dimulai', 'Sesuai jadwal kelas', '2026-09-07', now, now],
      [String(Date.now() + 13), '12 SEP', 'School Charity Day', '09:00 — selesai', '2026-09-12', now, now]
    ];
    shEvt.getRange(2, 1, seedEvt.length, evtHeaders.length).setValues(seedEvt);
  }

  // ---------- Password default ----------
  if (!props.getProperty(PROP_PASSWORD)) {
    props.setProperty(PROP_PASSWORD, 'Bismillaah');
  }

  // ---------- Hasil (lihat di Execution log) ----------
  const url = ss.getUrl();
  const id = ss.getId();

  Logger.log('========================================');
  Logger.log('✅ SETUP BERHASIL!');
  Logger.log('========================================');
  Logger.log('Spreadsheet: ' + ss.getName());
  Logger.log('ID         : ' + id);
  Logger.log('URL        : ' + url);
  Logger.log('Password   : (lihat Script Properties → ADMIN_PASSWORD)');
  Logger.log('Sheet      : Announcements + Events sudah siap');
  if (createdNew) {
    Logger.log('CATATAN    : Spreadsheet BARU dibuat. Cari di Google Drive dengan nama "Barbie School — Database"');
  } else {
    Logger.log('CATATAN    : Menggunakan spreadsheet yang sudah ada. Refresh tab spreadsheet untuk melihat sheet baru.');
  }
  Logger.log('========================================');

  // Return object (terlihat di hasil eksekusi)
  return {
    ok: true,
    message: 'Setup berhasil!',
    spreadsheetName: ss.getName(),
    spreadsheetId: id,
    spreadsheetUrl: url,
    createdNew: createdNew
  };
}

// ============================================================
//  CEK STATUS — Jalankan ini untuk melihat apakah setup sudah OK
// ============================================================
function checkSetup() {
  const props = PropertiesService.getScriptProperties();
  const ssId = props.getProperty(PROP_SSID);
  const pass = props.getProperty(PROP_PASSWORD);

  Logger.log('--- Status Setup ---');
  Logger.log('SPREADSHEET_ID : ' + (ssId || '❌ BELUM ADA — jalankan setup()'));
  Logger.log('ADMIN_PASSWORD : ' + (pass ? '✅ sudah di-set' : '❌ BELUM ADA'));

  if (!ssId) {
    Logger.log('➡️  Silakan jalankan fungsi setup() terlebih dahulu.');
    return { ok: false, error: 'Belum di-setup' };
  }

  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheets = ss.getSheets().map(s => s.getName());
    Logger.log('Spreadsheet    : ' + ss.getName());
    Logger.log('URL            : ' + ss.getUrl());
    Logger.log('Sheets         : ' + sheets.join(', '));
    Logger.log('✅ Setup terlihat OK');
    return { ok: true, url: ss.getUrl(), sheets: sheets };
  } catch (e) {
    Logger.log('❌ Gagal membuka spreadsheet: ' + e.message);
    Logger.log('➡️  Jalankan ulang setup()');
    return { ok: false, error: e.message };
  }
}

// ============================================================
//  HELPERS
// ============================================================
function getSS() {
  const ssId = PropertiesService.getScriptProperties().getProperty(PROP_SSID);
  if (!ssId) {
    // Coba active spreadsheet (bound script)
    try {
      const active = SpreadsheetApp.getActiveSpreadsheet();
      if (active) {
        PropertiesService.getScriptProperties().setProperty(PROP_SSID, active.getId());
        return active;
      }
    } catch (e) { /* ignore */ }
    throw new Error('SPREADSHEET_ID belum di-set. Jalankan fungsi setup() dulu.');
  }
  return SpreadsheetApp.openById(ssId);
}

function checkAuth(password) {
  const stored = PropertiesService.getScriptProperties().getProperty(PROP_PASSWORD);
  if (!stored) throw new Error('ADMIN_PASSWORD belum di-set di Script Properties.');
  return password === stored;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseBody(e) {
  if (e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (err) { return {}; }
  }
  return {};
}

function sheetToObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

// ============================================================
//  API — doGet (publik)
// ============================================================
function doGet(e) {
  try {
    const action = ((e && e.parameter && e.parameter.action) || '').toLowerCase();

    if (action === 'getannouncements') {
      const ss = getSS();
      const list = sheetToObjects(ss.getSheetByName(SHEET_ANNOUNCEMENTS));
      list.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      return jsonResponse({ ok: true, data: list });
    }

    if (action === 'getevents') {
      const ss = getSS();
      const list = sheetToObjects(ss.getSheetByName(SHEET_EVENTS));
      list.sort((a, b) => String(a.sortDate || '').localeCompare(String(b.sortDate || '')));
      return jsonResponse({ ok: true, data: list });
    }

    if (action === 'ping') {
      return jsonResponse({ ok: true, message: 'Barbie School API is online 🎀' });
    }

    // Default: tampilkan status sederhana di browser
    if (!action) {
      return jsonResponse({
        ok: true,
        message: 'Barbie School API 🎀',
        usage: 'Gunakan ?action=getAnnouncements atau ?action=getEvents atau ?action=ping'
      });
    }

    return jsonResponse({ ok: false, error: 'Action tidak dikenal. Gunakan: getAnnouncements, getEvents, ping' });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message || err) });
  }
}

// ============================================================
//  API — doPost (admin + login)
// ============================================================
function doPost(e) {
  try {
    const body = parseBody(e);
    const action = (body.action || '').toLowerCase();
    const password = body.password || '';

    // ---- Login ----
    if (action === 'login') {
      if (checkAuth(password)) {
        return jsonResponse({ ok: true, message: 'Login berhasil' });
      }
      return jsonResponse({ ok: false, error: 'Password salah' });
    }

    // Semua aksi admin butuh password
    if (!checkAuth(password)) {
      return jsonResponse({ ok: false, error: 'Unauthorized. Password salah atau belum login.' });
    }

    const ss = getSS();
    const now = new Date().toISOString();

    // ---- ANNOUNCEMENTS CRUD ----
    if (action === 'createannouncement') {
      const sh = ss.getSheetByName(SHEET_ANNOUNCEMENTS);
      const id = String(Date.now());
      const row = [
        id,
        body.title || '',
        body.category || 'Akademik',
        body.date || now.slice(0, 10),
        body.body || '',
        now,
        now
      ];
      sh.appendRow(row);
      return jsonResponse({
        ok: true,
        data: { id, title: row[1], category: row[2], date: row[3], body: row[4], createdAt: now, updatedAt: now }
      });
    }

    if (action === 'updateannouncement') {
      const sh = ss.getSheetByName(SHEET_ANNOUNCEMENTS);
      const data = sh.getDataRange().getValues();
      const id = String(body.id);
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === id) {
          sh.getRange(i + 1, 2).setValue(body.title || data[i][1]);
          sh.getRange(i + 1, 3).setValue(body.category || data[i][2]);
          sh.getRange(i + 1, 4).setValue(body.date || data[i][3]);
          sh.getRange(i + 1, 5).setValue(body.body || data[i][4]);
          sh.getRange(i + 1, 7).setValue(now);
          return jsonResponse({ ok: true, message: 'Pengumuman diperbarui' });
        }
      }
      return jsonResponse({ ok: false, error: 'Pengumuman tidak ditemukan' });
    }

    if (action === 'deleteannouncement') {
      const sh = ss.getSheetByName(SHEET_ANNOUNCEMENTS);
      const data = sh.getDataRange().getValues();
      const id = String(body.id);
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === id) {
          sh.deleteRow(i + 1);
          return jsonResponse({ ok: true, message: 'Pengumuman dihapus' });
        }
      }
      return jsonResponse({ ok: false, error: 'Pengumuman tidak ditemukan' });
    }

    // ---- EVENTS CRUD ----
    if (action === 'createevent') {
      const sh = ss.getSheetByName(SHEET_EVENTS);
      const id = String(Date.now());
      const row = [
        id,
        body.dateLabel || '',
        body.title || '',
        body.time || '',
        body.sortDate || '',
        now,
        now
      ];
      sh.appendRow(row);
      return jsonResponse({
        ok: true,
        data: { id, dateLabel: row[1], title: row[2], time: row[3], sortDate: row[4], createdAt: now, updatedAt: now }
      });
    }

    if (action === 'updateevent') {
      const sh = ss.getSheetByName(SHEET_EVENTS);
      const data = sh.getDataRange().getValues();
      const id = String(body.id);
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === id) {
          sh.getRange(i + 1, 2).setValue(body.dateLabel || data[i][1]);
          sh.getRange(i + 1, 3).setValue(body.title || data[i][2]);
          sh.getRange(i + 1, 4).setValue(body.time || data[i][3]);
          sh.getRange(i + 1, 5).setValue(body.sortDate || data[i][4]);
          sh.getRange(i + 1, 7).setValue(now);
          return jsonResponse({ ok: true, message: 'Agenda diperbarui' });
        }
      }
      return jsonResponse({ ok: false, error: 'Agenda tidak ditemukan' });
    }

    if (action === 'deleteevent') {
      const sh = ss.getSheetByName(SHEET_EVENTS);
      const data = sh.getDataRange().getValues();
      const id = String(body.id);
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === id) {
          sh.deleteRow(i + 1);
          return jsonResponse({ ok: true, message: 'Agenda dihapus' });
        }
      }
      return jsonResponse({ ok: false, error: 'Agenda tidak ditemukan' });
    }

    return jsonResponse({ ok: false, error: 'Action tidak dikenal' });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message || err) });
  }
}
