import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { NetworkCanvas } from "@/components/ui/NetworkCanvas";
import { LeadForm } from "@/components/forms/LeadForm";
import {
  hero,
  calendarUrl,
  whatsappUrl,
  positioning,
  differentiation,
  interruption,
  selectivity,
  finalCta,
  capabilities,
  methodSteps,
  industries,
  applicability,
  partnership,
  company,
  leader,
  contact,
} from "@/content";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden pt-28 pb-16">
        <NetworkCanvas className="absolute inset-0 z-0 opacity-55" density={0.00009} maxDist={140} speed={0.12} parallax />
        <Container className="relative z-10">
          <SectionLabel className="mb-8">
            {hero.eyebrow} — {hero.eyebrowSuffix}
          </SectionLabel>
          <h1 className="font-serif text-[2.75rem] leading-[1.03] sm:text-[5rem] lg:text-[5.75rem] max-w-4xl text-balance">
            {hero.headline}
          </h1>
          <p className="mt-8 max-w-lg font-sans text-lg sm:text-xl leading-relaxed text-muted">
            {hero.lead}
          </p>
          <p className="mt-6 max-w-lg font-sans text-sm text-muted/80">
            <span className="text-ink">{hero.triadPrefix}</span> {hero.triadRest}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="font-sans text-sm tracking-[0.08em] uppercase border-b border-ink pb-1 transition-opacity duration-300 hover:opacity-60"
            >
              Build With Us →
            </a>
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm tracking-[0.08em] uppercase border-b border-hairline-strong pb-1 text-muted transition-colors duration-300 hover:border-ink hover:text-ink"
            >
              Book a Strategy Call
            </a>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-3 border-t border-hairline pt-8">
            {hero.descriptors.map((d) => (
              <span key={d} className="font-sans text-[11px] uppercase tracking-[0.16em] text-muted">
                {d}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Positioning */}
      <section id="positioning" className="border-t border-hairline py-28 sm:py-40">
        <Container>
          <Reveal>
            <SectionLabel>{positioning.tag}</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-serif text-3xl sm:text-5xl lg:text-6xl leading-[1.1] max-w-3xl">
              {positioning.statement[0]}
              <br />
              <span className="text-accent">{positioning.statement[1]}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16} className="mt-10 max-w-xl">
            <p className="font-sans text-lg leading-relaxed text-muted">{positioning.intro}</p>
            <ul className="mt-8 space-y-3">
              {positioning.problems.map((p) => (
                <li key={p} className="relative pl-5 font-sans text-base text-ink">
                  <span className="absolute left-0 top-[0.7em] h-px w-3 bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-8 font-sans text-lg leading-relaxed text-muted">{positioning.outro}</p>
          </Reveal>

          <Reveal delay={0.2} className="mt-10 max-w-2xl border-l-2 border-accent pl-6">
            <p className="font-serif text-xl sm:text-2xl leading-snug">{positioning.closing}</p>
          </Reveal>
        </Container>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="border-t border-hairline bg-ivory-deep py-28 sm:py-40">
        <Container>
          <Reveal>
            <SectionLabel>02 / Capabilities</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-serif text-3xl sm:text-5xl lg:text-6xl leading-[1.1]">
              Different tools.
              <br />
              <span className="text-muted">One mandate.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-lg font-sans text-lg text-muted">Move the business forward.</p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 border-t border-l border-hairline sm:grid-cols-3">
            {capabilities.map((cap, i) => (
              <Reveal key={cap.tag} delay={0.06 * i}>
                <div className="flex h-full flex-col border-b border-r border-hairline bg-ivory-deep p-8 sm:p-10 transition-colors duration-300 hover:bg-ivory">
                  <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-muted">{cap.tag}</p>
                  <h3 className="mt-5 font-serif text-2xl">{cap.title}</h3>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-muted">{cap.body}</p>
                  <ul className="mt-6 flex-1 space-y-2">
                    {cap.items.map((item) => (
                      <li key={item} className="font-sans text-sm text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <ArrowLink href="#contact">{cap.linkLabel}</ArrowLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Differentiation */}
      <section className="border-t border-hairline py-28 sm:py-40">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-serif text-3xl sm:text-5xl leading-[1.1]">
                {differentiation.statement[0]}
                <br />
                <em className="not-italic text-accent">{differentiation.statement[1]}</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-6">
                {differentiation.body.map((p) => (
                  <p key={p} className="font-sans text-lg leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
                <p className="border-l-2 border-accent pl-6 font-serif text-xl leading-snug">
                  {differentiation.quote[0]}
                  <br />
                  {differentiation.quote[1]}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Approach / Method */}
      <section id="approach" className="border-t border-hairline py-28 sm:py-40">
        <Container>
          <Reveal>
            <SectionLabel>03 / The Ceaseless Method</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-serif text-3xl sm:text-5xl lg:text-6xl">Diagnose Before Deploying.</h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 border-t border-hairline sm:grid-cols-5">
            {methodSteps.map((step, i) => (
              <Reveal key={step.num} delay={0.06 * i}>
                <div className="h-full border-t border-hairline pt-8 sm:border-t-0 sm:border-r sm:pl-8 sm:pr-6 sm:pt-0 sm:pt-8 first:sm:pl-0 last:sm:border-r-0">
                  <span className="font-sans text-xs tracking-[0.1em] text-accent">{step.num}</span>
                  <h3 className="mt-4 font-sans text-sm uppercase tracking-[0.06em]">{step.title}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Interruption */}
      <section className="dark-section relative overflow-hidden bg-dark text-dark-fg border-t border-dark-hairline py-32 sm:py-48">
        <NetworkCanvas className="absolute inset-0 z-0 opacity-35" density={0.00006} maxDist={160} speed={0.08} />
        <Container className="relative z-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl leading-[1.15]">
              {interruption.headline}
            </h2>
            <ul className="mt-12 space-y-3">
              {interruption.points.map((point) => (
                <li key={point} className="font-sans text-base sm:text-lg text-dark-muted">
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-12 font-serif text-2xl text-dark-fg">{interruption.final}</p>
          </Reveal>
        </Container>
      </section>

      {/* Applicability */}
      <section className="border-t border-hairline bg-ivory-deep py-28 sm:py-40">
        <Container>
          <Reveal>
            <SectionLabel>{applicability.tag}</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-serif text-3xl sm:text-5xl lg:text-6xl">{applicability.headline}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-xl font-sans text-lg text-muted">{applicability.lead}</p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 border-t border-l border-hairline sm:grid-cols-4">
            {industries.map((industry, i) => (
              <Reveal key={industry} delay={0.02 * i}>
                <div className="border-b border-r border-hairline bg-ivory-deep p-5 font-sans text-xs uppercase tracking-[0.06em] text-muted transition-colors duration-300 hover:bg-ivory hover:text-ink">
                  {industry}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 max-w-lg">
            <p className="font-sans text-base text-muted">{applicability.closing}</p>
          </Reveal>
        </Container>
      </section>

      {/* Selectivity */}
      <section className="border-t border-hairline py-28 sm:py-40">
        <Container>
          <Reveal>
            <SectionLabel>{selectivity.tag}</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-serif text-3xl sm:text-5xl lg:text-6xl">{selectivity.headline}</h2>
          </Reveal>
          <Reveal delay={0.14} className="mt-8 max-w-xl">
            <p className="font-sans text-lg leading-relaxed text-muted">{selectivity.intro}</p>
          </Reveal>

          <div className="mt-12 max-w-2xl">
            {selectivity.criteria.map((item, i) => (
              <Reveal key={item} delay={0.06 * i}>
                <div className="flex items-baseline gap-6 border-t border-hairline py-6 last:border-b">
                  <span className="font-sans text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-xl sm:text-2xl">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-12 max-w-xl">
            <p className="font-sans text-base leading-relaxed text-muted">{selectivity.outro}</p>
          </Reveal>
          <Reveal delay={0.16} className="mt-8 max-w-lg">
            <p className="font-serif text-xl leading-snug">{selectivity.closing}</p>
          </Reveal>
        </Container>
      </section>

      {/* Growth Partnership */}
      <section className="border-t border-hairline bg-ivory-deep py-28 sm:py-40">
        <Container>
          <Reveal>
            <SectionLabel>{partnership.tag}</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-serif text-3xl sm:text-5xl lg:text-6xl">{partnership.headline}</h2>
          </Reveal>
          <Reveal delay={0.14} className="mt-8 max-w-xl space-y-4">
            {partnership.body.map((p) => (
              <p key={p} className="font-sans text-lg leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.2} className="mt-12 flex flex-wrap items-center gap-4">
            {partnership.stack.map((item, i) => (
              <span key={item} className="contents">
                {i > 0 && <span className="font-serif text-lg text-muted/60">+</span>}
                <span className="rounded-full border border-hairline-strong px-6 py-3 font-sans text-sm font-medium text-ink">
                  {item}
                </span>
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.26} className="mt-12">
            <p className="font-serif text-xl">
              {partnership.mandate.split(":")[0]}: <strong className="text-accent">{partnership.mandate.split(":")[1]}</strong>
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Company */}
      <section id="company" className="border-t border-hairline py-28 sm:py-40">
        <Container>
          <Reveal>
            <SectionLabel>{company.tag}</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-serif text-3xl sm:text-5xl lg:text-6xl">{company.headline}</h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-[1.2fr_1fr]">
            <Reveal delay={0.14}>
              <p className="max-w-xl font-sans text-lg leading-relaxed text-muted">{company.body}</p>
              <div className="mt-10 border-t border-hairline pt-8">
                <h3 className="font-serif text-2xl">{company.principle.title}</h3>
                <div className="mt-4 space-y-2">
                  {company.principle.body.map((p) => (
                    <p key={p} className="font-sans text-base text-muted">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-col items-center border border-hairline p-8 text-center sm:items-start sm:text-left">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-ivory">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path
                      d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM4 20a8 8 0 0116 0"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="mt-6 font-sans text-[11px] uppercase tracking-[0.14em] text-muted">{leader.tag}</p>
                <h3 className="mt-2 font-serif text-xl">{leader.name}</h3>
                <p className="mt-1 font-sans text-sm text-accent">{leader.role}</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="border-t border-hairline py-28 text-center sm:py-40">
        <Container>
          <Reveal>
            <SectionLabel className="justify-center">{finalCta.tag}</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-serif text-4xl sm:text-6xl lg:text-7xl">{finalCta.headline}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-md font-sans text-lg text-muted">{finalCta.body}</p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 flex flex-wrap justify-center gap-6">
            <a
              href="#contact"
              className="font-sans text-sm tracking-[0.08em] uppercase border-b border-ink pb-1 transition-opacity duration-300 hover:opacity-60"
            >
              Start a Conversation →
            </a>
            <a
              href="#capabilities"
              className="font-sans text-sm tracking-[0.08em] uppercase text-muted transition-colors duration-300 hover:text-ink"
            >
              Capabilities
            </a>
          </Reveal>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-hairline bg-ivory-deep py-28 sm:py-40">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <Reveal>
              <SectionLabel>{contact.tag}</SectionLabel>
              <h2 className="mt-6 font-serif text-3xl sm:text-5xl lg:text-6xl">{contact.headline}</h2>
              <p className="mt-8 max-w-md font-sans text-lg leading-relaxed text-muted">{contact.body}</p>

              <div className="mt-10 flex flex-wrap gap-6">
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm tracking-[0.08em] uppercase border-b border-ink pb-1 transition-opacity duration-300 hover:opacity-60"
                >
                  Book a Strategy Call
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm tracking-[0.08em] uppercase border-b border-hairline-strong pb-1 text-muted transition-colors duration-300 hover:border-ink hover:text-ink"
                >
                  Call / Chat on WhatsApp
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <LeadForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
