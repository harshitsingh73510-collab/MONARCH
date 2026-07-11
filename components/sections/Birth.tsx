"use client";

import StatementSequence from "@/components/StatementSequence";

export default function Birth() {
  return (
    <StatementSequence
      id="belief"
      eyebrow="02 — What we believe"
      image="/assets/birth-architecture.webp"
      lines={[
        <>Technology should disappear.</>,
        <>Emotion is what remains.</>,
        <>
          We engineer the{" "}
          <span className="text-champagne">feeling.</span>
        </>,
      ]}
    />
  );
}
