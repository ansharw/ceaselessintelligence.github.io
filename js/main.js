(function () {
  "use strict";

  /* ============================================================
     CONFIG — fill in the placeholders below before go-live.
     ============================================================ */
  var CONFIG = {
    // HubSpot Forms API: https://legacydocs.hubspot.com/docs/methods/forms/submit_form
    HUBSPOT_PORTAL_ID: "", // example: "12345678"
    HUBSPOT_FORM_GUID: "", // example: "aaaa1111-bb22-cc33-dd44-eeeeee555555"
    // Google Analytics 4 measurement ID (used if GA4 is loaded in index.html)
    GA4_ID: "G-XXXXXXXXXX",
    // Redirect after the form is successfully submitted
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

  document.addEventListener("DOMContentLoaded", function () {
    initStickyHeader();
    initMobileNav();
    initAccordion();
    initScrollDepthTracking();
    initClickTracking();
    initLeadForm();
  });

  /* ============================================================
     Sticky header shadow on scroll
     ============================================================ */
  function initStickyHeader() {
    var header = document.getElementById("site-header");
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 12) {
        header.style.boxShadow = "0 8px 30px -20px rgba(0,0,0,0.6)";
      } else {
        header.style.boxShadow = "none";
      }
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
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ============================================================
     FAQ accordion
     ============================================================ */
  function initAccordion() {
    var items = document.querySelectorAll(".accordion__item");
    items.forEach(function (item) {
      var trigger = item.querySelector(".accordion__trigger");
      if (!trigger) return;
      trigger.addEventListener("click", function () {
        var willOpen = !item.classList.contains("is-open");

        items.forEach(function (other) {
          other.classList.remove("is-open");
          var t = other.querySelector(".accordion__trigger");
          if (t) t.setAttribute("aria-expanded", "false");
        });

        if (willOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          trackEvent("faq_opened", { question: trigger.textContent.trim() });
        }
      });
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

    // Section viewed tracking (Services, FAQ, Consultation) via IntersectionObserver
    if ("IntersectionObserver" in window) {
      var watched = ["layanan", "faq", "konsultasi"];
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
     Lead form submission
     - Tracks "form_started" on first interaction.
     - Basic honeypot spam check.
     - Submits to HubSpot Forms API when CONFIG is filled in.
     - Falls back to a local success message (demo mode) when
       HubSpot credentials are not yet configured, so the form is
       fully testable before integration is wired up.
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

      var data = {
        fullName: form.fullName.value.trim(),
        companyName: form.companyName.value.trim(),
        jobTitle: form.jobTitle.value.trim(),
        email: form.email.value.trim(),
        whatsapp: form.whatsapp.value.trim(),
        website: form.website.value.trim(),
        industry: form.industry.value,
        challenge: form.challenge.value
      };

      var submitBtn = form.querySelector("button[type=submit]");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      var hasHubspotConfig = CONFIG.HUBSPOT_PORTAL_ID && CONFIG.HUBSPOT_FORM_GUID;

      var submission = hasHubspotConfig
        ? submitToHubspot(data)
        : Promise.resolve({ demo: true });

      submission
        .then(function () {
          trackEvent("form_submitted", { industry: data.industry, challenge: data.challenge });
          status.textContent =
            "Thank you. We've received your information. The Ceaseless Intelligence team will review your business needs and reach out via email or WhatsApp.";
          status.className = "form-status is-success";
          form.reset();
          if (hasHubspotConfig) {
            window.location.href = CONFIG.THANK_YOU_URL;
          }
        })
        .catch(function (err) {
          console.error("Lead form submission failed:", err);
          status.textContent =
            "Sorry, something went wrong while submitting the form. Please try again or contact us via WhatsApp.";
          status.className = "form-status is-error";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Consultation Request";
        });
    });
  }

  function submitToHubspot(data) {
    var url =
      "https://api.hsforms.com/submissions/v3/integration/submit/" +
      CONFIG.HUBSPOT_PORTAL_ID +
      "/" +
      CONFIG.HUBSPOT_FORM_GUID;

    var payload = {
      fields: [
        { name: "firstname", value: data.fullName },
        { name: "company", value: data.companyName },
        { name: "jobtitle", value: data.jobTitle },
        { name: "email", value: data.email },
        { name: "phone", value: data.whatsapp },
        { name: "website", value: data.website },
        { name: "industry", value: data.industry },
        { name: "main_challenge", value: data.challenge }
      ],
      context: {
        pageUri: window.location.href,
        pageName: document.title
      }
    };

    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("HubSpot submission failed: " + res.status);
      return res.json();
    });
  }
})();
