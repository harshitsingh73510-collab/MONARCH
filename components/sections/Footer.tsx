export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 2,
        paddingTop: "10vh",
        paddingInline: "var(--pad)",
        paddingBottom: "3rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "2rem",
          borderTop: "1px solid var(--fog)",
          paddingTop: "3rem",
        }}
      >
        <div>
          <p className="eyebrow" style={{ marginBottom: "0.8rem" }}>
            Monarch — a digital experience studio
          </p>
          <a
            href="#contact"
            data-hover
            className="font-mono"
            style={{ color: "var(--titanium)", fontSize: "0.8rem", textDecoration: "none" }}
          >
            Request access →
          </a>
        </div>
        <p className="eyebrow" style={{ color: "var(--titanium-dim)" }}>
          © {new Date().getFullYear()} — All rights reserved
        </p>
      </div>

      {/* ghost wordmark */}
      <div
        aria-hidden
        className="font-display"
        style={{
          fontSize: "min(22vw, 20rem)",
          fontWeight: 300,
          letterSpacing: "-0.05em",
          lineHeight: 0.8,
          color: "transparent",
          WebkitTextStroke: "1px rgba(243,242,239,0.06)",
          marginTop: "6vh",
          textAlign: "center",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        MONARCH
      </div>
    </footer>
  );
}
