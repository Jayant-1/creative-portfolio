"use client";

import { useState } from "react";
import { email } from "@/lib/site";
import { trackContactFormAttempt, trackContactFormDelivery } from "@/lib/analytics";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_t4ykead";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_1iixa8j";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "7mE4BTZLDXl5TxQVO";

export default function ContactForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!message.trim()) {
      setError("Please write a message before proceeding.");
      return;
    }
    setError("");
    setStep(2);
    trackContactFormAttempt(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please write a message before submitting.");
      setStep(1);
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!senderEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    trackContactFormAttempt(2);
    setLoading(true);
    setError("");

    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          user_name: name.trim(),
          my_name: "Jayant Potdar",
          user_email: senderEmail.trim(),
          my_email: "jayantpotdar2006@gmail.com",
          user_message: message.trim(),
        },
        EMAILJS_PUBLIC_KEY
      );

      setLoading(false);
      setSubmitted(true);
      setStatusMessage("Thank you! Your message has been sent directly to my inbox.");
      trackContactFormDelivery("emailjs", "success");
    } catch (err) {
      console.error("EmailJS Error:", err);
      setLoading(false);
      // Graceful fallback to mailto so the user's message is never lost
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        `Portfolio Inquiry from ${name.trim()}`
      )}&body=${encodeURIComponent(
        `Hi Jayant,\n\n${message.trim()}\n\nFrom: ${name.trim()} (${senderEmail.trim()})`
      )}`;
      setSubmitted(true);
      setStatusMessage("Email client opened with your prepared message.");
      trackContactFormDelivery("mailto_fallback", "fallback");
    }
  };

  return (
    <div className="bg-[var(--ca-yellow-soft)] p-6 sm:p-8 shadow-[4px_6px_20px_rgba(17,18,18,0.18)] text-left">
      {submitted ? (
        <div className="py-8 text-center">
          <p className="ca-hand text-3xl font-bold text-[var(--ca-ink)]">
            Thank you, {name}!
          </p>
          <p className="ca-mono mt-3 text-xs sm:text-sm uppercase tracking-wider text-[var(--ca-ink)]/80">
            {statusMessage || `Your message has been sent directly to my inbox. I will reply to ${senderEmail} shortly.`}
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setMessage("");
              setName("");
              setSenderEmail("");
              setError("");
              setStatusMessage("");
            }}
            className="ca-mono mt-5 inline-flex min-h-[48px] items-center justify-center bg-[var(--ca-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--ca-blue)] active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
          >
            Send another note
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <p
            data-pf-block="contact.description"
            className="ca-mono text-sm sm:text-base font-bold uppercase tracking-widest text-[var(--ca-ink)] leading-snug"
          >
            Hiring for a full stack role or planning a project? Tell me about it, and we can arrange a call.
          </p>

          <div className="grid mt-4">
            {/* Step 1: Message */}
            <div
              className={`col-start-1 row-start-1 transition-opacity duration-300 ${
                step === 1 ? "opacity-100" : "pointer-events-none opacity-0 invisible"
              }`}
            >
              <textarea
                rows={5}
                id="ca-contact-message"
                name="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error && step === 1 && e.target.value.trim()) {
                    setError("");
                  }
                }}
                placeholder="Tell me about your role or project…"
                aria-label="Your message"
                className="block min-h-36 sm:min-h-44 w-full border-0 bg-white/50 p-3 sm:p-4 rounded-md text-base sm:text-lg text-[var(--ca-ink)] shadow-none placeholder:text-[var(--ca-ink)]/65 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] resize-none"
              />

              {error && step === 1 && (
                <p className="mt-2 text-xs font-bold text-red-600 ca-mono" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="ca-mono mt-4 inline-flex min-h-[48px] items-center justify-center bg-[var(--ca-ink)] px-7 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--ca-blue)] hover:text-white active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
              >
                Next (1/2) →
              </button>
            </div>

            {/* Step 2: Name & Email */}
            <div
              className={`col-start-1 row-start-1 transition-opacity duration-300 ${
                step === 2 ? "opacity-100" : "pointer-events-none opacity-0 invisible"
              }`}
            >
              <div className="flex flex-col gap-4 sm:gap-5">
                <div>
                  <label
                    htmlFor="ca-contact-name"
                    className="block leading-none ca-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)]/70 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="ca-contact-name"
                    name="name"
                    disabled={loading}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error && step === 2) setError("");
                    }}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    className="block min-h-12 w-full rounded-none border-0 border-b-2 border-[var(--ca-ink)]/25 bg-transparent p-0 pb-1 text-base sm:text-lg text-[var(--ca-ink)] shadow-none placeholder:text-[var(--ca-ink)]/65 focus-visible:outline-hidden focus-visible:border-[var(--ca-orange)] focus-visible:ring-1 focus-visible:ring-[var(--ca-orange)] disabled:opacity-60"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ca-contact-email"
                    className="block leading-none ca-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)]/70 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="ca-contact-email"
                    name="email"
                    disabled={loading}
                    value={senderEmail}
                    onChange={(e) => {
                      setSenderEmail(e.target.value);
                      if (error && step === 2) setError("");
                    }}
                    placeholder="jane@example.com"
                    autoComplete="email"
                    className="block min-h-12 w-full rounded-none border-0 border-b-2 border-[var(--ca-ink)]/25 bg-transparent p-0 pb-1 text-base sm:text-lg text-[var(--ca-ink)] shadow-none placeholder:text-[var(--ca-ink)]/65 focus-visible:outline-hidden focus-visible:border-[var(--ca-orange)] focus-visible:ring-1 focus-visible:ring-[var(--ca-orange)] disabled:opacity-60"
                  />
                </div>
              </div>

              {error && step === 2 && (
                <p className="mt-2 text-xs font-bold text-red-600 ca-mono" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Back to your note"
                  disabled={loading}
                  onClick={() => {
                    setError("");
                    setStep(1);
                  }}
                  className="ca-mono flex h-12 w-12 items-center justify-center text-lg font-bold text-[var(--ca-ink)]/70 transition-colors hover:text-[var(--ca-ink)] disabled:opacity-50 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] rounded-sm"
                >
                  ←
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="ca-mono inline-flex min-h-[48px] items-center justify-center gap-2 bg-[var(--ca-ink)] px-7 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--ca-blue)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send (2/2)"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
