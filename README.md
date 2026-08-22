# Ceaseless Intelligence — Landing Page

A single-page landing page (static HTML/CSS/JS) with an elegant dark navy/blue/metal theme, built from the `Ceaseless Intelligence Landing Page v1.0` PRD.

## Architecture

The site runs as a single **Cloudflare Worker with Static Assets** — Cloudflare's current unified model (the successor to the older, separate "Pages" product):

```
index.html, css/, js/main.js, *.html   → static files, served automatically via the ASSETS binding
src/index.js                            → the Worker: routes /api/submit-lead, everything else falls through to ASSETS
```

The browser never talks to HubSpot directly. The form POSTs to `/api/submit-lead`,
handled in `src/index.js`, which reads `HUBSPOT_PORTAL_ID` / `HUBSPOT_FORM_GUID`
from server-side environment variables and forwards the submission. Those two
values — and any future secret (paid API keys, etc.) — never appear in
client-side JS or dev tools. Security response headers (CSP, X-Frame-Options,
etc.) are also set in `src/index.js`, applied to every response.

GA4's Measurement ID stays client-side in `js/main.js` (`CONFIG.GA4_ID`) —
that one is designed to be public, it's not a secret.

`.assetsignore` keeps repo/config files (`wrangler.toml`, `package.json`,
`src/`, etc.) from being served as public files, even though they sit
alongside `index.html` at the repo root.

## Running locally

```bash
npm install
cp .dev.vars.example .dev.vars   # fill in HubSpot creds, or leave blank for demo mode
npm run dev
# open the local URL wrangler prints (usually http://localhost:8787)
```

`npm run dev` runs `wrangler dev`, which serves the static files **and**
runs `src/index.js` locally, so the form works exactly like production.

## File structure

```
index.html                Main page (14 sections per the PRD + lead form)
thank-you.html             Thank-you page after form submission
privacy-policy.html        Privacy policy draft (needs legal review)
terms-of-service.html      Terms of service draft (needs legal review)
css/style.css              Design system (navy/black + electric blue + steel metal)
js/main.js                 Mobile nav, FAQ accordion, tracking, form submission
src/index.js                The Worker: form handler + security headers + static asset fallback
wrangler.toml               Cloudflare Worker/assets configuration
.assetsignore                Files excluded from the public static site
.dev.vars.example           Template for local secrets (copy to .dev.vars, gitignored)
```

## Deploying to Cloudflare (step by step, from scratch)

### 1. Push this repo to GitHub
Make sure the latest code (including `wrangler.toml`, `src/index.js`, `.assetsignore`) is committed and pushed to the branch you'll deploy from (usually `main`).

### 2. Connect the repo in Cloudflare
1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create**.
2. Choose **Import a repository** (this is the current unified flow — it replaces the old separate "Pages" button).
3. Authorize GitHub if asked, then pick this repo.
4. Build settings: leave **Build command** empty (no build step needed) — Cloudflare will detect `wrangler.toml` and use `npx wrangler deploy` as the **Deploy command** automatically, which now matches this project's structure.
5. Click **Save and Deploy**.

### 3. Set the HubSpot secrets
1. Open the project → **Settings → Variables and Secrets**.
2. Add, for both **Production** and **Preview**:
   - `HUBSPOT_PORTAL_ID` — type **Secret**
   - `HUBSPOT_FORM_GUID` — type **Secret**
3. Save, then trigger a redeploy (push a commit, or use **Retry deployment**) so the Worker picks up the new variables.

While these are unset, the form still works in **demo mode** — it accepts submissions but doesn't send them anywhere, which is safe for testing.

### 4. Verify it's live
1. Project → **Deployments** tab → the newest entry should say **Success**.
2. Click it (or the **Visit** button) — you'll get a URL like `https://ceaselessintelligence.<your-subdomain>.workers.dev`.
3. Open it and check the page loads, and that submitting the lead form shows a success message.

### 5. Connect your custom domain
This branches depending on where your domain currently lives:

**If your domain's DNS is already on Cloudflare** (you added it under **Websites** and it shows "Active"):
1. Project → **Settings → Domains & Routes** → **Add** → **Custom domain**.
2. Type your domain (e.g. `ceaselessintelligence.com`) → **Add domain**.
3. Cloudflare provisions SSL automatically — usually ready within a few minutes.

**If your domain is still registered/managed elsewhere** (GoDaddy, Niagahoster, Namecheap, etc.):
1. In Cloudflare dashboard → **Websites** → **Add a domain**, enter your domain, pick a plan (Free is fine).
2. Cloudflare gives you two nameservers (e.g. `xxx.ns.cloudflare.com`).
3. Go to wherever you registered the domain → find **Nameservers** / **DNS management** → replace the existing nameservers with the two Cloudflare gave you.
4. Wait for propagation (often under an hour, can take up to 24h) — Cloudflare emails you once it's active.
5. Once the domain shows **Active** in Cloudflare, repeat the steps above: project → **Settings → Domains & Routes** → **Add custom domain**.

After that, your domain points straight at this Worker with automatic SSL, and every future `git push` to `main` redeploys it.

### Migrating later
Because `src/index.js` is a plain Worker (standard `fetch(request, env)` handler,
no framework), moving off Cloudflare later is straightforward: the static
files work unchanged anywhere, and `src/index.js` ports easily to any
Node-compatible runtime (Vercel Edge Functions, a small Express route on a
VPS, etc.) — it's ~140 lines with no Cloudflare-specific APIs beyond the
`env.ASSETS.fetch()` call, which would be replaced by whatever static-file
serving the new host provides.

## Before go-live — fill in the following placeholders

### 1. HubSpot CRM (lead form)
Set `HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_GUID` as environment variables (see deployment steps above) — not in any file in this repo. While unset, the form shows a success message in "demo mode" without sending data anywhere.

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
- `src/index.js` sets a Content-Security-Policy, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, and a restrictive `Permissions-Policy`
  on every response.
- `.assetsignore` prevents `wrangler.toml`, `package.json`, and other repo
  files from being publicly downloadable from the live site.
- The lead form has honeypot spam protection checked **both** client-side
  (fast path) and server-side in `src/index.js` (so it can't be bypassed by
  calling the API directly).
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
- [ ] Form submissions reach HubSpot — needs real Portal ID + Form GUID (set as Cloudflare secrets)
- [ ] Google Calendar booking active — needs real embed link
- [ ] Analytics events verified in GA4 — needs real Measurement ID
- [ ] CEO photo installed — placeholder avatar in place for now
- [ ] Images have legal usage rights — no real photos installed yet
- [ ] Custom domain connected in Cloudflare
- [ ] Founder & CTO have approved all claims on this page
