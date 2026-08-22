# Ceaseless Intelligence — Landing Page

A single-page landing page (static HTML/CSS/JS) with an elegant dark navy/blue/metal theme, built from the locked "Turn Intelligence Into Growth" website copy.

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
index.html                Main page (nav, hero, services, why, process, industries, about, contact)
thank-you.html             Thank-you page after form submission
privacy-policy.html        Privacy policy draft (needs legal review)
terms-of-service.html      Terms of service draft (needs legal review)
css/style.css              Design system (navy/black + electric blue + steel metal)
js/main.js                 Mobile nav, tracking, form submission
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

The form also submits three **custom** HubSpot properties (`company_description`,
`improvement_goal`, `services_interested`) — create these under HubSpot
**Settings → Properties** (Contact or Deal, matching your form's object type)
before go-live, or submissions with those fields will be rejected by HubSpot.

### 2. Google Analytics 4
In `js/main.js`, replace `CONFIG.GA4_ID` with the real Measurement ID.
`initGA4()` loads gtag.js and starts tracking automatically — no HTML edits
needed. Events already tracked: `hero_cta_click`, `form_started`,
`form_submitted`, `scroll_depth`, `section_viewed`.

### 3. Google Calendar Appointment Schedule
Already wired up as a **link**, not an iframe — Google's Appointment Schedule
booking pages send `X-Frame-Options: SAMEORIGIN`, so they refuse to render
inside anyone else's `<iframe>` (confirmed by checking response headers
directly). The "Book a Time on Google Calendar" button in the Contact
section (`index.html`) opens the booking page in a new tab instead. To
change the schedule, just update that link's `href` to the new booking URL —
no other code changes needed.

### 4. Email & WhatsApp
Official contact channels are `ceaselessintelligence@gmail.com` and WhatsApp `+62 812-9112-9561`, both live in the `index.html` footer (`.footer-contact`), the Contact section's WhatsApp button, and the floating WhatsApp button. Update all four spots together if either channel changes — `privacy-policy.html` / `terms-of-service.html` just reference "the email listed in the footer" generically, so no edit needed there.

### 5. CEO photo
The About section has a placeholder avatar for Syahreza Daffa Rafiali (Founder & CEO) in `index.html` (`.leader-card`). Swap the placeholder `<svg>` for a real `<img src="assets/ceo.jpg" alt="Syahreza Daffa Rafiali">` once a photo file is available.

### 6. Legal
`privacy-policy.html` and `terms-of-service.html` are drafts — they must be reviewed by a lawyer/legal counsel before publishing, especially for compliance with Indonesia's Personal Data Protection Law (UU PDP).

## Security notes

- No secrets live in client-side code. The only value shipped to the
  browser that matters here is the GA4 Measurement ID, which is public
  by design.
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

- No generic "AI robot" stock photos or futuristic visuals — the hero visual uses an abstract representation of a pipeline/data (bar chart, follow-up automation, CRM sync nodes) built with CSS/SVG.
- Once real photos are available (team, office, product), they can be swapped in to replace `.hero__visual` and the "About" section to strengthen credibility.
- Copy is locked per the approved "Turn Intelligence Into Growth" version — treat `index.html`'s visible text as final unless a new copy revision is explicitly provided.

## Functional checklist

- [x] Locked website copy implemented (nav, hero, services, why, process, industries, about, contact, footer)
- [x] Two services clearly explained (B2B Lead Generation, AI Solutions & Automation)
- [x] All CTA buttons functional (scroll to section / form)
- [x] Mobile layout tested (390px–1440px)
- [x] Privacy policy & terms of service published (draft)
- [ ] Form submissions reach HubSpot — needs real Portal ID + Form GUID (set as Cloudflare secrets) + the 3 custom properties created in HubSpot
- [x] Google Calendar booking link active (opens in new tab, not embedded)
- [ ] Analytics events verified in GA4 — needs real Measurement ID
- [ ] CEO photo installed — placeholder avatar in place for now
- [ ] Custom domain connected in Cloudflare
- [ ] Founder & CTO have approved all claims on this page
