# Ceaseless Intelligence — Landing Page

A single-page landing page (static HTML/CSS/JS) with an elegant dark mode, built from the `Ceaseless Intelligence Landing Page v1.0` PRD.

## Running locally

```bash
cd ceaseless-intellegence
python3 -m http.server 8080
# open http://localhost:8080
```

No build step — everything is static (`index.html`, `css/style.css`, `js/main.js`).

## File structure

```
index.html            Main page (14 sections per the PRD + lead form)
thank-you.html         Thank-you page after form submission
privacy-policy.html    Privacy policy draft (needs legal review)
terms-of-service.html  Terms of service draft (needs legal review)
css/style.css          Design system (dark navy + graphite + growth green)
js/main.js             Mobile nav, FAQ accordion, tracking, form submission
```

## Before go-live — fill in the following placeholders

These sections work visually/functionally, but need real credentials before connecting to production systems.

### 1. HubSpot CRM (lead form)
Edit `js/main.js` → the `CONFIG` object at the top:
```js
HUBSPOT_PORTAL_ID: "",   // HubSpot Portal ID
HUBSPOT_FORM_GUID: "",   // Form GUID from HubSpot
```
While empty, the form will show a success message locally (demo mode) without sending data anywhere — safe for testing/client demos.

### 2. Google Analytics 4
In `index.html`, uncomment the gtag.js `<script>` block in `<head>` and replace `G-XXXXXXXXXX` with the real Measurement ID. Events already tracked automatically via `js/main.js`: `hero_cta_click`, `whatsapp_click`, `form_started`, `form_submitted`, `faq_opened`, `scroll_depth`, `section_viewed`.

### 3. Google Calendar Appointment Schedule
Find `<!-- GOOGLE CALENDAR BOOKING PLACEHOLDER -->` in `index.html` (Final CTA section) and replace the placeholder div with an `<iframe>` from Google Calendar → Settings → Appointment schedules → Share.

### 4. WhatsApp number
Replace `6280000000000` in three places (floating button, CTA button in the final section, footer link) with the official business WhatsApp number.

### 5. Email & other contact info
Replace `hello@ceaseless-intelligence.com`, the LinkedIn link (`#`), and the office location in the `index.html` footer.

### 6. Domain & SSL
Deploy to static hosting (Cloudflare Pages / Netlify / Vercel) with a custom domain + automatic SSL.

### 7. Legal
`privacy-policy.html` and `terms-of-service.html` are drafts — they must be reviewed by a lawyer/legal counsel before publishing, especially for compliance with Indonesia's Personal Data Protection Law (UU PDP).

## Design notes

- No generic "AI robot" stock photos or futuristic visuals, per the PRD's direction — the hero visual uses an abstract representation of a pipeline/data (bar chart, quotation node, racking) built with CSS/SVG.
- Once real photos are available (warehouse, sales team, racking, towing/car carrier), they can be swapped in to replace `.hero__visual`, the industry cards, and the "Why" section to strengthen credibility.
- The "Proof / Case Studies" section was intentionally replaced with "What We'll Measure" because the PRD prohibits unproven claims/results. Once real client data exists (with permission), this section can be replaced with a case-study format per PRD §11.

## Functional checklist (based on PRD §15 Acceptance Criteria)

- [x] Target market stated accurately
- [x] Two services clearly explained (lead gen = entry service, AI = diagnosis-led)
- [x] No unproven claims (no "guaranteed", "trusted by hundreds", etc.)
- [x] All CTA buttons functional (scroll to section / WhatsApp / form)
- [x] Mobile layout tested (390px–1440px)
- [x] Privacy policy & terms of service published (draft)
- [ ] Form submissions reach HubSpot — needs real Portal ID + Form GUID
- [ ] Google Calendar booking active — needs real embed link
- [ ] Analytics events verified in GA4 — needs real Measurement ID
- [ ] Images have legal usage rights — no real photos installed yet
- [ ] Founder & CTO have approved all claims on this page
