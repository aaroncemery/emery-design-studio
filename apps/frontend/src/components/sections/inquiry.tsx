"use client";

import { useState, useTransition } from "react";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { Rule } from "@/components/primitives/rule";
import { Reveal } from "@/components/primitives/reveal";
import { submitInquiry } from "@/app/actions/inquiry";
import type { InquirySection } from "@/lib/sanity/types";

const FALLBACK_SCOPE_OPTIONS = [
  "Full Renovation",
  "Interior Architecture",
  "Styling & Furnishing",
  "Consultation",
  "Not yet sure",
];

const FALLBACK_BUDGET_OPTIONS = [
  "Under $500k",
  "$500k — $1M",
  "$1M — $3M",
  "$3M+",
  "Prefer not to say",
];

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono text-[11px] md:text-[9px] tracking-[0.18em] uppercase text-[#9a968d] block mb-2"
    >
      {children}
    </label>
  );
}

const inputBase =
  "w-full bg-transparent border-0 border-b border-[rgba(17,17,17,0.2)] pb-3 font-sans text-[14px] text-[#111111] placeholder:text-[#9a968d] focus:outline-none focus:border-[#1b3a5b] transition-colors duration-300 resize-none";

interface Props {
  data?: InquirySection;
}

export function Inquiry({ data }: Props) {
  const scopeOptions =
    data?.scopeOptions && data.scopeOptions.length > 0
      ? data.scopeOptions
      : FALLBACK_SCOPE_OPTIONS;
  const budgetOptions =
    data?.budgetOptions && data.budgetOptions.length > 0
      ? data.budgetOptions
      : FALLBACK_BUDGET_OPTIONS;

  const [budget, setBudget] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("budget", budget);
    setError("");

    startTransition(async () => {
      const result = await submitInquiry(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Section id="contact" className="bg-[#ece8df]" paddingY="xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-[120px]">
        {/* Left: info */}
        <div>
          <Reveal>
            <MonoLabel className="text-[#1b3a5b] block mb-5">
              §&nbsp;06&nbsp;—&nbsp;Inquiry
            </MonoLabel>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="font-serif text-[#111111] leading-[0.94] tracking-tight mb-8"
              style={{ fontSize: "clamp(34px, 3.8vw, 56px)" }}
            >
              {data?.heading ? (
                data.heading
              ) : (
                <>
                  We&rsquo;d be glad&nbsp;/
                  <br />
                  to <em>hear</em> from you.
                </>
              )}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="font-sans text-[#6b6b66] text-sm leading-relaxed mb-10">
              {data?.subheading ??
                "We take on six to eight projects per year and give each one our full attention. If you’re thinking about a project — even one that’s still forming — we’d love to hear about it."}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Rule className="mb-8" />
            <address className="not-italic space-y-1 mb-6">
              <MonoLabel className="text-[#9a968d] block mb-3">
                Studio address
              </MonoLabel>
              <p className="font-sans text-[#111111] text-sm">
                Emery Design Studio
              </p>
              <p className="font-sans text-[#6b6b66] text-sm">
                Kirkland, WA 98033
              </p>
            </address>
            <div className="space-y-1">
              <a
                href="mailto:hello@emerydesignstudio.com"
                className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#1b3a5b] hover:opacity-70 transition-opacity duration-300 block"
              >
                hello@emerydesignstudio.com
              </a>
            </div>
          </Reveal>
        </div>

        {/* Right: form */}
        <Reveal delay={0.1}>
          {success ? (
            <div className="flex flex-col justify-center min-h-[400px]">
              <MonoLabel className="text-[#1b3a5b] block mb-4">
                Received
              </MonoLabel>
              <h3
                className="font-serif italic text-[#111111] leading-tight mb-4"
                style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
              >
                Thank you. We&rsquo;ll be in touch.
              </h3>
              <p className="font-sans text-[#6b6b66] text-sm leading-relaxed">
                We respond to all inquiries within five working days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Name */}
              <div>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                  className={inputBase}
                />
              </div>

              {/* Email */}
              <div>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className={inputBase}
                />
              </div>

              {/* Location */}
              <div>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="City, neighbourhood, or address"
                  className={inputBase}
                />
              </div>

              {/* Scope */}
              <div>
                <FieldLabel htmlFor="scope">Scope</FieldLabel>
                <select id="scope" name="scope" className={inputBase}>
                  <option value="">Select a scope…</option>
                  {scopeOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget — pill toggles */}
              <div>
                <FieldLabel htmlFor="budget-group">Budget</FieldLabel>
                <div
                  id="budget-group"
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Budget range"
                >
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setBudget(opt === budget ? "" : opt)}
                      aria-pressed={budget === opt}
                      className="font-mono text-[11px] md:text-[9px] tracking-[0.14em] uppercase px-4 py-3 md:py-2 border transition-all duration-300"
                      style={{
                        borderColor:
                          budget === opt ? "#1b3a5b" : "rgba(17,17,17,0.2)",
                        backgroundColor:
                          budget === opt ? "#1b3a5b" : "transparent",
                        color: budget === opt ? "#ffffff" : "#6b6b66",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell us about the project — what it is, where it is, what you hope it becomes."
                  className={inputBase}
                />
              </div>

              {error && (
                <p role="alert" className="font-sans text-xs text-[#c8553d]">
                  {error}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <MonoLabel className="text-[#9a968d]">
                  Response within 5 working days
                </MonoLabel>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-3 px-6 py-3 font-mono text-[10px] tracking-[0.16em] uppercase border border-[#1b3a5b] bg-[#1b3a5b] text-white transition-all duration-[360ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:bg-[#152e4a] hover:border-[#152e4a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Sending…" : "Send inquiry"}
                  {!isPending && <span aria-hidden="true">→</span>}
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
