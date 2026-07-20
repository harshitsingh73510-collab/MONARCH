"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { sound } from "@/lib/sound";
import SignatureReveal from "@/components/SignatureReveal";

type Status = "idle" | "sending" | "done" | "error";

const FIELDS = [
  { name: "name", label: "Your name", type: "text", req: true },
  { name: "company", label: "Company", type: "text", req: true },
  { name: "email", label: "Work email", type: "email", req: true },
] as const;

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const btnRef = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.2}px, ${(e.clientY - (r.top + r.height / 2)) * 0.28}px)`;
  };
  const onLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0,0)";
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.company) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) sound.chime("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        zIndex: 2,
        paddingBlock: "16vh",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(60vw, 640px)",
          height: "min(60vw, 640px)",
          background: "radial-gradient(circle, rgba(232,201,143,0.12) 0%, transparent 62%)",
          filter: "blur(24px)",
          zIndex: 0,
        }}
      />

      <SignatureReveal
        className="section"
        style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "46rem", margin: "0 auto", textAlign: "center" }}
      >
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "2rem" }}>
            08 — Let&apos;s begin
          </p>
          <h2 className="display-lg font-display" style={{ maxWidth: "16ch", marginInline: "auto", marginBottom: "1.4rem" }}>
            Let&apos;s build something impossible.
          </h2>
          <p className="lede" style={{ maxWidth: "44ch", marginInline: "auto", marginBottom: "clamp(2.5rem, 5vh, 4rem)" }}>
            Monarch partners with a select few each year. Tell us what
            you&apos;re building — and what you want the world to remember.
          </p>
        </Reveal>

        {status === "done" ? (
          <div
            style={{
              padding: "clamp(2.5rem, 6vw, 4rem)",
              border: "1px solid var(--fog-strong)",
              borderRadius: 10,
              background: "rgba(232,201,143,0.03)",
              animation: "fadeUp .9s var(--ease-cine)",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 99, background: "var(--champagne)", margin: "0 auto 1.4rem", boxShadow: "0 0 18px var(--champagne)" }} />
            <h3 className="display-md font-display" style={{ marginBottom: "0.8rem" }}>
              Received.
            </h3>
            <p className="lede">Monarch will be in touch, personally.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ textAlign: "left" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1.2rem, 3vw, 2.2rem)", marginBottom: "1.6rem" }} className="c-grid">
              {FIELDS.map((f) => (
                <label key={f.name} style={{ display: "block", gridColumn: f.name === "email" ? "1 / -1" : "auto" }}>
                  <span className="eyebrow" style={{ display: "block", marginBottom: "0.7rem" }}>
                    {f.label}
                  </span>
                  <input
                    name={f.name}
                    type={f.type}
                    required={f.req}
                    data-hover
                    className="c-input"
                  />
                </label>
              ))}
              <label style={{ display: "block", gridColumn: "1 / -1" }}>
                <span className="eyebrow" style={{ display: "block", marginBottom: "0.7rem" }}>
                  Tell us about your project <span style={{ opacity: 0.5 }}>(optional)</span>
                </span>
                <textarea name="message" rows={3} data-hover className="c-input" style={{ resize: "none" }} />
              </label>
            </div>

            <div onMouseMove={onMove} onMouseLeave={onLeave} style={{ display: "inline-block", padding: "1.5rem", marginLeft: "-1.5rem" }}>
              <button
                ref={btnRef}
                type="submit"
                data-hover
                disabled={status === "sending"}
                className="font-mono"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.9rem",
                  padding: "1.1rem 2.4rem",
                  border: "1px solid var(--fog-strong)",
                  borderRadius: 999,
                  background: "rgba(232,201,143,0.03)",
                  color: "var(--platinum)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  cursor: "none",
                  transition: "transform .35s var(--ease-cine), border-color .4s, background .4s",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--champagne)" }} />
                {status === "sending" ? "Sending…" : status === "error" ? "Try again" : "Request access"}
              </button>
            </div>
            {status === "error" && (
              <p className="font-mono" style={{ fontSize: "0.72rem", color: "var(--titanium)", marginTop: "1rem" }}>
                Something interrupted the signal. Please try again.
              </p>
            )}
          </form>
        )}
      </SignatureReveal>

      <style>{`
        .c-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--fog-strong);
          padding: 0.7rem 0;
          color: var(--platinum);
          font-family: var(--font-body);
          font-size: 1rem;
          outline: none;
          transition: border-color .4s var(--ease-cine);
        }
        .c-input:focus { border-color: var(--champagne); }
        .c-input::placeholder { color: var(--titanium-dim); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        @media (max-width: 640px) { .c-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
