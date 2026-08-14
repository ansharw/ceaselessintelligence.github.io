# Ceaseless Intelligence — Landing Page

A single-page landing page (static HTML/CSS/JS) with an elegant dark navy/blue/metal theme, built from the `Ceaseless Intelligence Landing Page v1.0` PRD.

## Architecture

The site is static (no build step, no framework) with **one serverless function** for the lead form:

```
index.html, css/, js/main.js, *.html   → static, served directly (Cloudflare Pages CDN)
functions/api/submit-lead.js            → Cloudflare Pages Function (runs server-side)
```

The browser never talks to HubSpot directly. The form POSTs to `/api/submit-lead`,
which runs on Cloudflare's edge, reads `HUBSPOT_PORTAL_ID` / `HUBSPOT_FORM_GUID`
from server-side environment variables, and forwards the submission. Those two
values — and any future secret (paid API keys, etc.) — never appear in
client-side JS or dev tools.

GA4's Measurement ID stays client-side in `js/main.js` (`CONFIG.GA4_ID`) —
that one is designed to be public, it's not a secret.

## Running locally

```bash
npm install
cp .dev.vars.example .dev.vars   # fill in HubSpot creds, or leave blank for demo mode
npm run dev
# open http://localhost:8080
```

`npm run dev` runs `wrangler pages dev`, which serves the static files **and**
runs `functions/api/submit-lead.js` locally, so the form works exactly like
production. Opening `index.html` directly (or a plain `python3 -m http.server`)
will serve the static pages fine but the lead form will 404 on `/api/submit-lead`
since that route only exists when Pages Functions are running.

## File structure

```
index.html                Main page (14 sections per the PRD + lead form)
thank-you.html             Thank-you page after form submission
privacy-policy.html        Privacy policy draft (needs legal review)
terms-of-service.html      Terms of service draft (needs legal review)
css/style.css              Design system (navy/black + electric blue + steel metal)
js/main.js                 Mobile nav, FAQ accordion, tracking, form submission
functions/api/submit-lead.js  Server-side form handler (HubSpot credentials live here)
_headers                   Security response headers (CSP, X-Frame-Options, etc.)
wrangler.toml               Cloudflare Pages project config
.dev.vars.example           Template for local secrets (copy to .dev.vars, gitignored)
```

## Deploying to Cloudflare Pages

1. Push this repo to GitHub/GitLab.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings: **no build command**, output directory `/` (root). Cloudflare auto-detects the `functions/` folder.
4. **Settings → Environment variables** (set for both Production and Preview):
   - `HUBSPOT_PORTAL_ID` — mark as **Secret/Encrypted**
   - `HUBSPOT_FORM_GUID` — mark as **Secret/Encrypted**
5. **Custom domains** → add your domain; Cloudflare issues SSL automatically.
6. Deploy. From then on, every push to the connected branch redeploys automatically.

Alternatively, deploy from the CLI: `npm run deploy` (runs `wrangler pages deploy .`),
then set the two secrets with `npx wrangler pages secret put HUBSPOT_PORTAL_ID` (repeat for the GUID).

### Migrating later
Because there's no build step and no framework lock-in, moving off Cloudflare
is low-effort: the static files work unchanged on Netlify, Vercel, or any
plain web server. Only `functions/api/submit-lead.js` is Cloudflare-Pages-specific
(its `onRequestPost(context)` signature) — moving to Vercel/Netlify means
porting that one file to their respective serverless-function format; moving
to a VPS means running it behind a tiny Node/Express (or any language) route
instead. Everything else — HTML, CSS, `js/main.js` — copies over as-is.

## Before go-live — fill in the following placeholders

### 1. HubSpot CRM (lead form)
Set `HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_GUID` as environment variables (see
deployment steps above) — not in any file in this repo. While unset, the form
shows a success message in "demo mode" without sending data anywhere, so it's
safe to test/demo before HubSpot is wired up.

### 2. Google Analytics 4
In `js/main.js`, replace `CONFIG.GA4_ID` with the real Measurement ID.
`initGA4()` loads gtag.js and starts tracking automatically — no HTML edits
needed. Events already tracked: `hero_cta_click`, `whatsapp_click`,
`form_started`, `form_submitted`, `faq_opened`, `scroll_depth`, `section_viewed`.

### 3. Google Calendar Appointment Schedule
Find `<!-- GOOGLE CALENDAR BOOKING PLACEHOLDER -->` in `index.html` (Final CTA section) and replace the placeholder div with an `<iframe>` from Google Calendar → Settings → Appointment schedules → Share.

### 4. WhatsApp number
Replace `6280000000000` in three places (floating button, CTA button in the final section, footer link) with the official business WhatsApp number.

### 5. Email & other contact info
Replace `hello@ceaselessintelligence.com`, the LinkedIn link (`#`), and the office location in the `index.html` footer.

### 6. CEO photo
The About section has a placeholder avatar for Syahreza Daffa Rafiali (Founder & CEO) in `index.html` (`.leader-card`). Swap the placeholder `<svg>` for a real `<img src="assets/ceo.jpg" alt="Syahreza Daffa Rafiali">` once a photo file is available.

### 7. Legal
`privacy-policy.html` and `terms-of-service.html` are drafts — they must be reviewed by a lawyer/legal counsel before publishing, especially for compliance with Indonesia's Personal Data Protection Law (UU PDP).

## Security notes

- No secrets live in client-side code. The only values shipped to the
  browser are public by design (GA4 Measurement ID, WhatsApp number, email —
  all meant to be visible).
- `_headers` sets a Content-Security-Policy, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, and a restrictive `Permissions-Policy`.
- The lead form has honeypot spam protection checked **both** client-side
  (fast path) and server-side in `functions/api/submit-lead.js` (so it can't
  be bypassed by calling the API directly).
- For stronger anti-spam beyond the honeypot, consider adding Cloudflare
  Turnstile (free CAPTCHA alternative) to the form, or a Cloudflare Rate
  Limiting rule on `/api/submit-lead` — neither is wired up yet.

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
- [ ] Form submissions reach HubSpot — needs real Portal ID + Form GUID (set as Cloudflare Pages secrets)
- [ ] Google Calendar booking active — needs real embed link
- [ ] Analytics events verified in GA4 — needs real Measurement ID
- [ ] CEO photo installed — placeholder avatar in place for now
- [ ] Images have legal usage rights — no real photos installed yet
- [ ] Founder & CTO have approved all claims on this page
