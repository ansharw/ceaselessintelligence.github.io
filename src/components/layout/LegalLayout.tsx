import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function LegalLayout({
  title,
  updated,
  notice,
  children,
}: {
  title: string;
  updated: string;
  notice: string;
  children: ReactNode;
}) {
  return (
    <section className="py-28 sm:py-36">
      <Container className="max-w-2xl">
        <p className="border-l-2 border-accent bg-ivory-deep px-5 py-4 font-sans text-sm leading-relaxed text-muted">
          {notice}
        </p>

        <h1 className="mt-10 font-serif text-3xl sm:text-4xl">{title}</h1>
        <p className="mt-2 font-sans text-sm text-muted">Last updated: {updated}</p>

        <div className="mt-10 space-y-10 font-sans text-base leading-relaxed text-muted [&_h2]:font-sans [&_h2]:text-sm [&_h2]:uppercase [&_h2]:tracking-[0.08em] [&_h2]:text-ink [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:marker:text-accent">
          {children}
        </div>
      </Container>
    </section>
  );
}
