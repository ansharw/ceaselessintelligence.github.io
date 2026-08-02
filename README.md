# Ceaseless Intelligence — Landing Page

Landing page satu halaman (static HTML/CSS/JS), dark mode elegan, dibangun dari PRD `Ceaseless Intelligence Landing Page v1.0`.

## Menjalankan secara lokal

```bash
cd ceaseless-intellegence
python3 -m http.server 8080
# buka http://localhost:8080
```

Tidak ada build step — semua file statis (`index.html`, `css/style.css`, `js/main.js`).

## Struktur file

```
index.html            Halaman utama (14 section sesuai PRD + form lead)
thank-you.html         Halaman terima kasih setelah form submit
privacy-policy.html    Draf kebijakan privasi (perlu review legal)
terms-of-service.html  Draf ketentuan layanan (perlu review legal)
css/style.css          Design system (dark navy + graphite + growth green)
js/main.js             Nav mobile, accordion FAQ, tracking, submit form
```

## Sebelum go-live — isi placeholder berikut

Bagian ini fungsional secara visual/UX, tapi butuh kredensial asli sebelum terhubung ke sistem produksi.

### 1. HubSpot CRM (form lead)
Edit `js/main.js` → objek `CONFIG` di bagian atas:
```js
HUBSPOT_PORTAL_ID: "",   // Portal ID HubSpot
HUBSPOT_FORM_GUID: "",   // Form GUID dari HubSpot
```
Selama kosong, form akan tampil sukses secara lokal (demo mode) tanpa mengirim data ke mana pun — aman untuk testing/demo klien.

### 2. Google Analytics 4
Di `index.html`, uncomment blok `<script>` gtag.js di `<head>` dan ganti `G-XXXXXXXXXX` dengan Measurement ID asli. Event yang sudah di-track otomatis lewat `js/main.js`: `hero_cta_click`, `whatsapp_click`, `form_started`, `form_submitted`, `faq_opened`, `scroll_depth`, `section_viewed`.

### 3. Google Calendar Appointment Schedule
Cari `<!-- GOOGLE CALENDAR BOOKING PLACEHOLDER -->` di `index.html` (section Final CTA) dan ganti div placeholder dengan `<iframe>` dari Google Calendar → Settings → Appointment schedules → Share.

### 4. Nomor WhatsApp
Ganti `6280000000000` di tiga tempat (tombol floating, tombol CTA di section final, link footer) dengan nomor WhatsApp bisnis resmi.

### 5. Email & kontak lain
Ganti `hello@ceaseless-intelligence.com`, link LinkedIn (`#`), dan lokasi kantor di footer `index.html`.

### 6. Domain & SSL
Deploy ke hosting statis (Cloudflare Pages / Netlify / Vercel) dengan custom domain + SSL otomatis.

### 7. Legal
`privacy-policy.html` dan `terms-of-service.html` adalah draf — wajib direview pengacara/legal sebelum publish, terutama kepatuhan UU PDP.

## Catatan desain

- Tidak ada foto stok "robot AI" atau visual futuristik generik, sesuai arahan PRD — visual hero memakai representasi abstrak pipeline/data (bar chart, node quotation, racking) dengan CSS/SVG.
- Saat foto asli tersedia (gudang, tim sales, racking, towing/car carrier), foto tersebut bisa disisipkan menggantikan `.hero__visual`, kartu industri, dan section "Why" untuk memperkuat kredibilitas.
- Section "Proof / Case Studies" sengaja diganti dengan "Apa yang Akan Kami Ukur" karena PRD melarang testimonial/hasil yang belum terbukti. Setelah ada data klien nyata (dengan izin), section ini bisa diganti dengan format case study sesuai PRD §11.

## Checklist fungsional (mengacu ke PRD §15 Acceptance Criteria)

- [x] Target market dinyatakan akurat
- [x] Dua layanan dijelaskan jelas (lead gen = entry service, AI = diagnosis-led)
- [x] Tidak ada klaim yang belum terbukti (tanpa "guaranteed", "trusted by hundreds", dll)
- [x] Semua tombol CTA berfungsi (scroll ke section / WhatsApp / form)
- [x] Layout mobile teruji (390px–1440px)
- [x] Kebijakan privasi & ketentuan layanan dipublikasikan (draf)
- [ ] Form submissions masuk ke HubSpot — butuh Portal ID + Form GUID asli
- [ ] Google Calendar booking aktif — butuh link embed asli
- [ ] Analytics events terverifikasi di GA4 — butuh Measurement ID asli
- [ ] Gambar memiliki hak pakai legal — belum ada foto asli terpasang
- [ ] Founder & CTO menyetujui seluruh klaim di halaman ini
