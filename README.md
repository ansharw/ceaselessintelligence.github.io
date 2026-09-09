# Ceaseless Intelligence — Landing Page

A single-page landing page built with **Next.js (App Router) + Tailwind CSS v4**, in an editorial ivory/parchment design system (Fraunces serif + Inter sans, restrained Framer Motion reveals), built from the locked "Turn Intelligence Into Growth" website copy.

## Architecture

The site is a static export (`next build` → `out/`) served by a small **Cloudflare Worker with Static Assets** — Cloudflare's current unified model (the successor to the older, separate "Pages" product):

```
src/app, src/components, src/content   → Next.js source; `next build` compiles this to out/
out/                                     → static export output, served automatically via the ASSETS binding
worker/index.js                         → the Worker: routes /api/submit-lead, everything else falls through to ASSETS
```

The browser never sends the lead form anywhere directly. It POSTs to
`/api/submit-lead`, handled in `worker/index.js`, which emails a plain-text
notification via Cloudflare's native **Email Workers** binding (`env.SEND_EMAIL`,
declared as `[[send_email]]` in `wrangler.toml`) — no third-party email API or
secret involved. Security response headers (CSP, X-Frame-Options, etc.) are
also set in `worker/index.js`, applied to every response.

GA4's Measurement ID stays client-side in `src/lib/analytics.ts` (`GA4_ID`) —
that one is designed to be public, it's not a secret.

## Running locally

```bash
npm install
npm run dev
# open http://localhost:3000 — fast iteration on UI (no lead-form backend here)
```

To exercise the full stack including the lead-form API exactly like production:

```bash
npm run build      # static export to out/
npx wrangler dev    # serves out/ + worker/index.js together
```

## File structure

```
src/app/                    Next.js routes: /(home), /thank-you, /privacy, /terms
src/components/ui/          Container, Reveal, SectionLabel, ArrowLink primitives
src/components/layout/      Header, Footer, WhatsAppFloat, LegalLayout
src/components/forms/       LeadForm (client component, posts to /api/submit-lead)
src/components/analytics/   Analytics (GA4 + scroll-depth + section-viewed tracking)
src/content/                Page copy as data (nav, hero, capabilities, method, ...)
src/lib/analytics.ts        trackEvent()/initGA4() helpers
worker/index.js              The Worker: form handler + email via Email Workers + security headers + static asset fallback
wrangler.toml                Cloudflare Worker/assets config (assets dir: out/) + the [[send_email]] binding
.dev.vars.example            Placeholder for any future local secret (copy to .dev.vars, gitignored)
```

## Deploying to Cloudflare (step by step, from scratch)

### 1. Push this repo to GitHub
Make sure the latest code (including `wrangler.toml`, `worker/index.js`) is committed and pushed to the branch you'll deploy from (usually `main`).

### 2. Connect the repo in Cloudflare
1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create**.
2. Choose **Import a repository** (this is the current unified flow — it replaces the old separate "Pages" button).
3. Authorize GitHub if asked, then pick this repo.
4. Build settings: **Build command** `npm run build` (runs `next build`, producing the static export in `out/`) — Cloudflare will detect `wrangler.toml` and use `npx wrangler deploy` as the **Deploy command** automatically.
5. Click **Save and Deploy**.

### 3. Set up Email Routing for lead notifications
No secrets to configure here — the Worker sends email via Cloudflare's native
Email Workers binding, already declared in `wrangler.toml`. You just need
Email Routing turned on for the domain in the Cloudflare dashboard (see
"Cloudflare Email Routing" under "Before go-live" below for the exact steps).
Until the destination address is verified there, the form runs in **demo
mode** — it accepts submissions but doesn't send them anywhere, which is safe
for testing.

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
The static export in `out/` works unchanged on any host. `worker/index.js` is
otherwise a plain Worker (standard `fetch(request, env)` handler, no
framework), but it does use two Cloudflare-specific pieces: `env.ASSETS.fetch()`
for the static-asset fallback, and the `env.SEND_EMAIL` / `cloudflare:email`
binding for lead notifications. Moving off Cloudflare later means swapping
those two for whatever static-file serving and email-sending (e.g. Resend,
Postmark, SES) the new host provides — everything else ports as-is.

## Before go-live — fill in the following placeholders

### 1. Cloudflare Email Routing (lead-notification email)
The lead form emails a plain-text notification from `contact@ceaselessintelligence.com`
(`FROM_EMAIL` in `worker/index.js`) to `ceaselessintelligence@gmail.com`
(`NOTIFY_EMAIL`), sent via Cloudflare's native Email Workers binding — no
third-party service or API key required.

1. In the Cloudflare dashboard, select the `ceaselessintelligence.com` zone → **Email → Email Routing** → enable it if not already on (this adds the required MX/TXT records automatically since the domain's DNS is on Cloudflare).
2. Under **Destination addresses**, add `ceaselessintelligence@gmail.com` and click the verification link Cloudflare emails to it. The Worker can only send to a destination that's been verified this way.
3. That's it on the Cloudflare side — `wrangler.toml` already declares the `[[send_email]]` binding pointing at that address, so the next deploy picks it up automatically.

If the destination address isn't verified yet, the form shows a success message in "demo mode" without sending data anywhere. `FROM_EMAIL` doesn't need its own inbox — any address on a domain with Email Routing enabled works as a sender. To change either address, update both `worker/index.js` (`NOTIFY_EMAIL`/`FROM_EMAIL`) and the `destination_address` in `wrangler.toml` together.

### 2. Google Analytics 4
In `src/lib/analytics.ts`, replace `GA4_ID` with the real Measurement ID.
`initGA4()` loads gtag.js and starts tracking automatically — no other edits
needed. Events already tracked: `form_started`, `form_submitted`,
`scroll_depth`, `section_viewed`.

### 3. Google Calendar Appointment Schedule
Already wired up as a **link**, not an iframe — Google's Appointment Schedule
booking pages send `X-Frame-Options: SAMEORIGIN`, so they refuse to render
inside anyone else's `<iframe>` (confirmed by checking response headers
directly). The `calendarUrl` constant in `src/content/hero.ts` opens the
booking page in a new tab. To change the schedule, just update that URL —
no other code changes needed.

### 4. Email & WhatsApp
Official contact channels are `ceaselessintelligence@gmail.com` and WhatsApp `+62 812-9112-9561`. The email address lives in the `contactEmail` constant in `src/content/contact.ts` (used by the Contact section's Email block and the lead form's error-state fallback link) — that's separate from the `NOTIFY_EMAIL` constant in `worker/index.js` used for lead notifications, so update both if the address changes. The WhatsApp number lives in the `whatsappUrl` constant in `src/content/hero.ts`, used by the Contact section link, the footer, and the floating WhatsApp button (`src/components/layout/WhatsAppFloat.tsx`) — update it once there and all three follow. `/privacy` / `/terms` just reference "the email listed in the footer" generically, so no edit needed there.

### 5. CEO photo
The Company section has a placeholder avatar for Syahreza Daffa Rafiali (Founder & CEO) in `src/app/page.tsx` (the leader card). Swap the placeholder `<svg>` for a real `<Image src="/ceo.jpg" alt="Syahreza Daffa Rafiali" />` once a photo file is available (place it under `public/`).

### 6. Legal
`/privacy` and `/terms` (`src/app/privacy`, `src/app/terms`) are drafts — they must be reviewed by a lawyer/legal counsel before publishing, especially for compliance with Indonesia's Personal Data Protection Law (UU PDP).

## Security notes

- No secrets live in client-side code, and lead notifications don't need one
  at all — email delivery runs entirely through a Cloudflare Workers binding.
  The only value shipped to the browser that matters here is the GA4
  Measurement ID, which is public by design.
- `worker/index.js` sets a Content-Security-Policy, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, and a restrictive `Permissions-Policy`
  on every response.
- The lead form has honeypot spam protection checked **both** client-side
  (fast path) and server-side in `worker/index.js` (so it can't be bypassed by
  calling the API directly).
- For stronger anti-spam beyond the honeypot, consider adding Cloudflare
  Turnstile (free CAPTCHA alternative) to the form, or a Cloudflare Rate
  Limiting rule on `/api/submit-lead` — neither is wired up yet.

## Design notes

- No generic "AI robot" stock photos or futuristic visuals — the editorial ivory/parchment design system (borrowed from the sibling Numinous Gravitas site) relies on typography, hairline borders, and restrained motion rather than illustration.
- Once real photos are available (team, office, product), they can be swapped in via the Company section's leader card to strengthen credibility.
- Copy is locked per the approved "Turn Intelligence Into Growth" version — treat the text in `src/content/` as final unless a new copy revision is explicitly provided.

## Functional checklist

- [x] Locked website copy implemented (nav, hero, services, why, process, industries, about, contact, footer)
- [x] Two services clearly explained (B2B Lead Generation, AI Solutions & Automation)
- [x] All CTA buttons functional (scroll to section / form)
- [x] Mobile layout tested (390px–1440px)
- [x] Privacy policy & terms of service published (draft)
- [ ] Form submissions email a notification — needs `ceaselessintelligence@gmail.com` verified as a destination address in Cloudflare Email Routing
- [x] Google Calendar booking link active (opens in new tab, not embedded)
- [ ] Analytics events verified in GA4 — needs real Measurement ID
- [ ] CEO photo installed — placeholder avatar in place for now
- [ ] Custom domain connected in Cloudflare
- [ ] Founder & CTO have approved all claims on this page
