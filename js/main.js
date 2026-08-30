(function () {
  "use strict";

  /* ============================================================
     CONFIG — fill in the placeholders below before go-live.
     HubSpot credentials are NOT here anymore — they live server-side
     as environment variables read by src/index.js (the Worker),
     so they're never shipped to the browser.
     ============================================================ */
  var CONFIG = {
    // Google Analytics 4 measurement ID. This one is meant to be public
    // (it's designed to be embedded client-side) — safe to leave here.
    GA4_ID: "G-XXXXXXXXXX",
    // Endpoint the lead form posts to (see src/index.js)
    SUBMIT_ENDPOINT: "/api/submit-lead",
    // Redirect after the form is successfully submitted (skipped in demo mode)
    THANK_YOU_URL: "thank-you.html"
  };

  /* ============================================================
     Analytics helper — sends an event to dataLayer (GA4/GTM) when
     available. Safe to call even if GA4 isn't installed yet (no-op).
     ============================================================ */
  function trackEvent(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
  }

  /* ============================================================
     GA4 bootstrap — loaded from this external file (not an inline
     <script> in index.html) so the site's Content-Security-Policy
     can stay strict (script-src 'self' + googletagmanager.com only,
     no 'unsafe-inline' needed). No-ops until CONFIG.GA4_ID is a real
     Measurement ID.
     ============================================================ */
  function initGA4() {
    var id = CONFIG.GA4_ID;
    if (!id || id.indexOf("XXXX") !== -1) return;

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initGA4();
    initStickyHeader();
    initMobileNav();
    initScrollDepthTracking();
    initClickTracking();
    initLeadForm();
    initScrollReveal();
    initNetworkCanvas("heroCanvas", { density: 0.00009, maxDist: 140, speed: 0.12 });
    initNetworkCanvas("interruptionCanvas", { density: 0.00006, maxDist: 160, speed: 0.08 });
  });

  /* ============================================================
     Header background — transparent over the hero, blurred glass
     once the page scrolls past it.
     ============================================================ */
  function initStickyHeader() {
    var header = document.getElementById("site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     Mobile nav toggle
     ============================================================ */
  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    var backdrop = document.getElementById("navBackdrop");
    if (!toggle || !menu) return;

    function closeMenu() {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (backdrop) backdrop.classList.remove("is-open");
    }

    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (backdrop) backdrop.classList.toggle("is-open", isOpen);
    });

    if (backdrop) {
      backdrop.addEventListener("click", closeMenu);
    }

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ============================================================
     Scroll depth tracking (25/50/75/100%)
     ============================================================ */
  function initScrollDepthTracking() {
    var thresholds = [25, 50, 75, 100];
    var fired = {};

    function onScroll() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      var pct = Math.round((scrollTop / docHeight) * 100);

      thresholds.forEach(function (t) {
        if (pct >= t && !fired[t]) {
          fired[t] = true;
          trackEvent("scroll_depth", { depth_percent: t });
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ============================================================
     Generic click tracking for elements with data-track / data-event
     ============================================================ */
  function initClickTracking() {
    document.querySelectorAll("[data-track], [data-event]").forEach(function (el) {
      el.addEventListener("click", function () {
        var eventName = el.getAttribute("data-event") || el.getAttribute("data-track");
        trackEvent(eventName, { label: el.textContent.trim().slice(0, 80) });
      });
    });

    // Section viewed tracking via IntersectionObserver
    if ("IntersectionObserver" in window) {
      var watched = ["positioning", "capabilities", "approach", "company", "contact"];
      var seen = {};
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !seen[entry.target.id]) {
              seen[entry.target.id] = true;
              trackEvent("section_viewed", { section: entry.target.id });
            }
          });
        },
        { threshold: 0.4 }
      );
      watched.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }
  }

  /* ============================================================
     Scroll reveal — fades/lifts .reveal elements in as they enter
     the viewport. Also flags .method__step so its top/left border
     can draw itself in via CSS. Respects reduced-motion.
     ============================================================ */
  function initScrollReveal() {
    var targets = document.querySelectorAll(".reveal, .method__step");
    if (!targets.length) return;

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================================
     Subtle animated point network for the hero and the mid-page
     "systems problem" interruption. Deliberately quiet — slow
     drift, thin lines, low opacity — not a particle-effect gimmick.
     No-op on reduced-motion or if canvas isn't supported.
     ============================================================ */
  function initNetworkCanvas(id, opts) {
    var canvas = document.getElementById(id);
    if (!canvas || !canvas.getContext) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var ctx = canvas.getContext("2d");
    var points = [];
    var width, height, dpr;
    var rafId;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.round(width * height * opts.density);
      points = [];
      for (var i = 0; i < count; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * opts.speed,
          vy: (Math.random() - 0.5) * opts.speed
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      points.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      for (var i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
          var dx = points[i].x - points[j].x;
          var dy = points[i].y - points[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < opts.maxDist) {
            ctx.strokeStyle = "rgba(197,199,201," + (1 - dist / opts.maxDist) * 0.35 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(197,199,201,0.5)";
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    }

    resize();
    tick();

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        cancelAnimationFrame(rafId);
        resize();
        tick();
      }, 200);
    });
  }

  /* ============================================================
     Lead form submission
     - Tracks "form_started" on first interaction.
     - Basic honeypot spam check (also re-checked server-side).
     - Always posts to CONFIG.SUBMIT_ENDPOINT (our own serverless
       function), which is the only thing that talks to HubSpot.
       The browser never sees HubSpot credentials.
     - The endpoint replies { demo: true } when HubSpot isn't
       configured yet server-side, so the form stays fully testable
       before integration is wired up.
     ============================================================ */
  function initLeadForm() {
    var form = document.getElementById("leadForm");
    var status = document.getElementById("formStatus");
    if (!form) return;

    var startedTracked = false;
    form.addEventListener(
      "input",
      function () {
        if (!startedTracked) {
          startedTracked = true;
          trackEvent("form_started", {});
        }
      },
      { once: false }
    );

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      status.className = "form-status";

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Honeypot: bots tend to fill hidden fields.
      var honeypot = form.querySelector("#companyWebsite2");
      if (honeypot && honeypot.value) {
        return; // silently drop
      }

      var services = Array.prototype.slice
        .call(form.querySelectorAll('input[name="services"]:checked'))
        .map(function (el) { return el.value; });

      var data = {
        fullName: form.fullName.value.trim(),
        companyName: form.companyName.value.trim(),
        email: form.email.value.trim(),
        website: form.website.value.trim(),
        companyDescription: form.companyDescription.value.trim(),
        improvementGoal: form.improvementGoal.value.trim(),
        services: services,
        companyWebsite2: honeypot ? honeypot.value : ""
      };

      var submitBtn = form.querySelector("button[type=submit]");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      submitLead(data)
        .then(function (result) {
          trackEvent("form_submitted", { services: data.services.join(",") });
          form.reset();
          if (result && result.demo) {
            status.textContent =
              "Thank you. We've received your information. The Ceaseless Intelligence team will review your business and reach out by email.";
            status.className = "form-status is-success";
          } else {
            window.location.href = CONFIG.THANK_YOU_URL;
          }
        })
        .catch(function (err) {
          console.error("Lead form submission failed:", err);
          status.textContent =
            "Sorry, something went wrong while submitting the form. Please try again shortly.";
          status.className = "form-status is-error";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Start the Conversation";
        });
    });
  }

  function submitLead(data) {
    return fetch(CONFIG.SUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error("Submission failed: " + res.status);
      return res.json();
    });
  }
})();
