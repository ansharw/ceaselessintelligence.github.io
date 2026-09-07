"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { serviceOptions } from "@/content";
import { trackEvent } from "@/lib/analytics";

const fieldClasses =
  "w-full border-b border-hairline bg-transparent py-3 font-sans text-base text-ink placeholder:text-muted/70 focus:border-ink transition-colors duration-300 outline-none";

const labelClasses = "font-sans text-[11px] uppercase tracking-[0.14em] text-muted";

type Status = { kind: "idle" } | { kind: "success"; demo: boolean } | { kind: "error"; message: string };

export function LeadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [submitting, setSubmitting] = useState(false);
  const [startedTracked, setStartedTracked] = useState(false);

  function handleInput() {
    if (!startedTracked) {
      setStartedTracked(true);
      trackEvent("form_started");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);

    // Honeypot: bots tend to fill hidden fields. Drop silently.
    if (data.get("companyWebsite2")) return;

    const payload = {
      fullName: String(data.get("fullName") ?? "").trim(),
      companyName: String(data.get("companyName") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      website: String(data.get("website") ?? "").trim(),
      companyDescription: String(data.get("companyDescription") ?? "").trim(),
      improvementGoal: String(data.get("improvementGoal") ?? "").trim(),
      services: data.getAll("services").map(String),
      companyWebsite2: String(data.get("companyWebsite2") ?? ""),
    };

    setSubmitting(true);
    setStatus({ kind: "idle" });

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Submission failed: ${res.status}`);
      const result = await res.json();

      trackEvent("form_submitted", { services: payload.services.join(",") });
      form.reset();

      if (result?.demo) {
        setStatus({ kind: "success", demo: true });
      } else {
        router.push("/thank-you");
      }
    } catch (err) {
      console.error("Lead form submission failed:", err);
      setStatus({
        kind: "error",
        message: "Sorry, something went wrong while submitting the form. Please try again shortly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (status.kind === "success") {
    return (
      <p className="font-serif text-2xl leading-relaxed max-w-md">
        Thank you. We&rsquo;ve received your information. The Ceaseless Intelligence team will
        review your business and reach out by email.
      </p>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} onInput={handleInput} noValidate className="space-y-7">
      <h3 className="font-serif text-2xl">Start a Conversation</h3>

      <div className="space-y-2">
        <label htmlFor="fullName" className={labelClasses}>
          Name*
        </label>
        <input id="fullName" name="fullName" type="text" autoComplete="name" required className={fieldClasses} />
      </div>

      <div className="space-y-2">
        <label htmlFor="companyName" className={labelClasses}>
          Company*
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          autoComplete="organization"
          required
          className={fieldClasses}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className={labelClasses}>
          Business Email*
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={fieldClasses} />
      </div>

      <div className="space-y-2">
        <label htmlFor="website" className={labelClasses}>
          Website
        </label>
        <input
          id="website"
          name="website"
          type="url"
          placeholder="https://"
          autoComplete="url"
          className={fieldClasses}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="companyDescription" className={labelClasses}>
          What does your company do?*
        </label>
        <textarea
          id="companyDescription"
          name="companyDescription"
          rows={2}
          required
          className={`${fieldClasses} resize-none`}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="improvementGoal" className={labelClasses}>
          What&rsquo;s the constraint you&rsquo;re trying to remove?*
        </label>
        <textarea
          id="improvementGoal"
          name="improvementGoal"
          rows={2}
          required
          className={`${fieldClasses} resize-none`}
        />
      </div>

      <fieldset className="space-y-3">
        <legend className={labelClasses}>Where do you need leverage?</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {serviceOptions.map((option) => (
            <label
              key={option}
              className="inline-flex items-center gap-2 font-sans text-sm text-muted"
            >
              <input type="checkbox" name="services" value={option} className="accent-ink" />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-3 font-sans text-xs text-muted">
        <input type="checkbox" id="consent" name="consent" required className="mt-0.5 accent-ink" />
        <span>By submitting this form, you agree that Ceaseless Intelligence may contact you regarding this inquiry.</span>
      </label>

      {/* Honeypot spam-protection field — hidden from users, bots often fill it. */}
      <div className="absolute left-[-9999px] h-0 overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor="companyWebsite2">Leave this blank</label>
        <input type="text" id="companyWebsite2" name="companyWebsite2" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="font-sans text-sm tracking-[0.08em] uppercase border-b border-ink pb-1 transition-opacity duration-300 hover:opacity-60 disabled:opacity-40"
      >
        {submitting ? "Sending..." : "Start the Conversation"}
      </button>

      <p role="status" aria-live="polite" className="font-sans text-sm min-h-[1.2em] text-accent">
        {status.kind === "error" ? status.message : ""}
      </p>
    </form>
  );
}
