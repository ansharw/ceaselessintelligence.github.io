"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { primaryNav, fullNav } from "@/content";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled || open
            ? "bg-ivory/90 backdrop-blur-sm border-b border-hairline"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <Container wide>
          <div className="flex h-[76px] items-center justify-between">
            <Link
              href="/"
              className="font-sans text-[13px] sm:text-sm font-medium tracking-[0.18em] text-ink"
              onClick={() => setOpen(false)}
            >
              CEASELESS <span className="text-accent">INTELLIGENCE</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-sans text-[12px] tracking-[0.08em] uppercase text-ink/70 transition-colors duration-300 hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="font-sans text-[12px] tracking-[0.14em] uppercase text-ink"
              aria-expanded={open}
              aria-controls="site-menu"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="dark-section fixed inset-0 z-40 overflow-y-auto bg-dark text-dark-fg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Container wide className="flex min-h-full flex-col justify-center py-28">
              <nav className="flex flex-col">
                {fullNav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.06 + i * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-dark-hairline"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-6 py-4 sm:py-5"
                    >
                      <span className="font-sans text-xs text-dark-muted">
                        {item.index}
                      </span>
                      <span className="font-serif text-3xl sm:text-5xl transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-2">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
