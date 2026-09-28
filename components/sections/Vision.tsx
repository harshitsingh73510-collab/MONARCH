"use client";

import StatementSequence from "@/components/StatementSequence";

export default function Vision() {
  return (
    <StatementSequence
      id="future"
      eyebrow="What comes next"
      image="/assets/vision-sunrise.webp"
      focus="center 40%"
      lines={[
        <>The screen is disappearing.</>,
        <>
          What comes next must feel{" "}
          <span className="text-champagne">human.</span>
        </>,
        <>We&apos;re already building it.</>,
      ]}
    />
  );
}
