import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <section className="flex min-h-[80vh] items-center py-28">
      <Container className="max-w-xl text-center">
        <SectionLabel className="justify-center">Request Received</SectionLabel>
        <h1 className="mt-6 font-serif text-4xl sm:text-5xl">Thank You.</h1>
        <p className="mt-6 font-sans text-lg leading-relaxed text-muted">
          We&rsquo;ve received your information. The Ceaseless Intelligence team will review your
          business and reach out by email or WhatsApp.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block font-sans text-sm tracking-[0.08em] uppercase border-b border-ink pb-1 transition-opacity duration-300 hover:opacity-60"
        >
          Back to Home
        </Link>
      </Container>
    </section>
  );
}
