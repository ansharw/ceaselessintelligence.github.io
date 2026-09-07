"use client";

import { useEffect } from "react";
import { initGA4, trackEvent } from "@/lib/analytics";

const WATCHED_SECTIONS = ["positioning", "capabilities", "approach", "company", "contact"];
const SCROLL_THRESHOLDS = [25, 50, 75, 100];

export function Analytics() {
  useEffect(() => {
    initGA4();

    const fired = new Set<number>();
    function onScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((window.scrollY / docHeight) * 100);
      for (const t of SCROLL_THRESHOLDS) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent("scroll_depth", { depth_percent: t });
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      const seen = new Set<string>();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !seen.has(entry.target.id)) {
              seen.add(entry.target.id);
              trackEvent("section_viewed", { section: entry.target.id });
            }
          });
        },
        { threshold: 0.4 }
      );
      WATCHED_SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer!.observe(el);
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  return null;
}
