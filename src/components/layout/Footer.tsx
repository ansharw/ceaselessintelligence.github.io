import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNav, calendarUrl, whatsappUrl } from "@/content";

export function Footer() {
  return (
    <footer className="dark-section bg-dark text-dark-fg">
      <Container wide className="py-20 sm:py-28">
        <Link href="/" className="block">
          <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.95]">
            CEASELESS
            <br />
            INTELLIGENCE
          </h2>
        </Link>

        <nav className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-dark-hairline pt-10">
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-[12px] uppercase tracking-[0.1em] text-dark-muted transition-colors duration-300 hover:text-dark-fg"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[12px] uppercase tracking-[0.1em] text-dark-muted transition-colors duration-300 hover:text-dark-fg"
          >
            Book a Strategy Call
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[12px] uppercase tracking-[0.1em] text-dark-muted transition-colors duration-300 hover:text-dark-fg"
          >
            WhatsApp
          </a>
        </nav>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg italic text-dark-muted">
            Intelligence. Infrastructure. Growth.
          </p>
          <p className="font-sans text-xs text-dark-muted">
            © {new Date().getFullYear()} Ceaseless Intelligence. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
