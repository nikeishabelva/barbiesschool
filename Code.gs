/**
 * Barbie School — Backend (Google Apps Script)
 * Spreadsheet auto-generated + headers
 * Password & secrets hanya di Script Properties
 *
 * SETUP:
 * 1. Buat project Apps Script baru (script.google.com)
 * 2. Paste kode ini ke Code.gs
 * 3. Jalankan fungsi setup() sekali (izin Spreadsheet + Drive)
 * 4. Project Settings → Script Properties:
 *      ADMIN_PASSWORD = Bismillaah
 *      (opsional) SPREADSHEET_ID = <id>  → diisi otomatis oleh setup()
 * 5. Deploy → New deployment → Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 6. Salin URL Web App, tempel di index.html (CONFIG.API_URL)
 */

const SHEET_ANNOUNCEMENTS = 'Announcements';
const SHEET_EVENTS = 'Events';
const PROP_PASSWORD = 'ADMIN_PASSWORD';
const PROP_SSID = 'SPREADSHEET_ID';

// ============== SETUP (jalankan sekali) ==============
function setup() {
  const props = PropertiesService.getScriptProperties();
  let ssId = props.getProperty(PROP_SSID);
  let ss;

  if (ssId) {
    try {
      ss = SpreadsheetApp.openById(ssId);
    } catch (e) {
      ss = null;
    }
  }

  if (!ss) {
    ss = SpreadsheetApp.create('Barbie School — Database');
    props.setProperty(PROP_SSID, ss.getId());
    Logger.log('Spreadsheet baru dibuat: ' + ss.getUrl());
  }

  // --- Announcements sheet ---
  let shAnn = ss.getSheetByName(SHEET_ANNOUNCEMENTS);
  if (!shAnn) {
    shAnn = ss.insertSheet(SHEET_ANNOUNCEMENTS);
  }
  const annHeaders = ['id', 'title', 'category', 'date', 'body', 'createdAt', 'updatedAt'];
  if (shAnn.getLastRow() === 0 || shAnn.getRange(1, 1).getValue() !== 'id') {
    shAnn.clear();
    shAnn.getRange(1, 1, 1, annHeaders.length).setValues([annHeaders]);
    shAnn.setFrozenRows(1);
    shAnn.getRange(1, 1, 1, annHeaders.length).setFontWeight('bold').setBackground('#f7a8c4');
  }

  // --- Events sheet ---
  let shEvt = ss.getSheetByName(SHEET_EVENTS);
  if (!shEvt) {
    shEvt = ss.insertSheet(SHEET_EVENTS);
  }
  const evtHeaders = ['id', 'dateLabel', 'title', 'time', 'sortDate', 'createdAt', 'updatedAt'];
  if (shEvt.getLastRow() === 0 || shEvt.getRange(1, 1).getValue() !== 'id') {
    shEvt.clear();
    shEvt.getRange(1, 1, 1, evtHeaders.length).setValues([evtHeaders]);
    shEvt.setFrozenRows(1);
    shEvt.getRange(1, 1, 1, evtHeaders.length).setFontWeight('bold').setBackground('#f7a8c4');
  }

  // Hapus sheet default "Sheet1" jika masih ada
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  // Seed data contoh (hanya jika kosong)
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

  // Pastikan password sudah di-set
  if (!props.getProperty(PROP_PASSWORD)) {
    props.setProperty(PROP_PASSWORD, 'Bismillaah');
    Logger.log('Password default diset ke: Bismillaah (ganti di Script Properties jika perlu)');
  }

  Logger.log('✅ Setup selesai!');
  Logger.log('Spreadsheet ID: ' + ss.getId());
  Logger.log('URL: ' + ss.getUrl());
  return { ok: true, spreadsheetId: ss.getId(), url: ss.getUrl() };
}

// ============== HELPERS ==============
function getSS() {
  const ssId = PropertiesService.getScriptProperties().getProperty(PROP_SSID);
  if (!ssId) throw new Error('SPREADSHEET_ID belum di-set. Jalankan setup() dulu.');
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

// ============== API ==============
function doGet(e) {
  try {
    const action = (e.parameter.action || '').toLowerCase();

    if (action === 'getannouncements') {
      const ss = getSS();
      const list = sheetToObjects(ss.getSheetByName(SHEET_ANNOUNCEMENTS));
      // urut terbaru dulu
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      return jsonResponse({ ok: true, data: list });
    }

    if (action === 'getevents') {
      const ss = getSS();
      const list = sheetToObjects(ss.getSheetByName(SHEET_EVENTS));
      list.sort((a, b) => (a.sortDate || '').localeCompare(b.sortDate || ''));
      return jsonResponse({ ok: true, data: list });
    }

    if (action === 'ping') {
      return jsonResponse({ ok: true, message: 'Barbie School API is online 🎀' });
    }

    return jsonResponse({ ok: false, error: 'Action tidak dikenal. Gunakan: getAnnouncements, getEvents, ping' });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const body = parseBody(e);
    const action = (body.action || '').toLowerCase();
    const password = body.password || '';

    // ---- Login (cek password saja) ----
    if (action === 'login') {
      if (checkAuth(password)) {
        return jsonResponse({ ok: true, message: 'Login berhasil' });
      }
      return jsonResponse({ ok: false, error: 'Password salah' });
    }

    // Semua aksi admin di bawah ini butuh password
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
      return jsonResponse({ ok: true, data: { id, title: row[1], category: row[2], date: row[3], body: row[4], createdAt: now, updatedAt: now } });
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
      return jsonResponse({ ok: true, data: { id, dateLabel: row[1], title: row[2], time: row[3], sortDate: row[4], createdAt: now, updatedAt: now } });
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
    return jsonResponse({ ok: false, error: err.message });
  }
}
