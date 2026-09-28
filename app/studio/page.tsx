import type { Metadata } from "next";
import StudioIntro from "@/components/studio/StudioIntro";
import Birth from "@/components/sections/Birth";
import Vision from "@/components/sections/Vision";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Studio · MONARCH",
  description:
    "Monarch is a small digital experience studio. Technology should disappear; emotion is what remains.",
};

/**
 * /studio — the philosophy lives here now. The two manifesto sequences that
 * used to interrupt the homepage (What we believe · The future) became the
 * spine of this page instead of being thrown away.
 */
export default function StudioPage() {
  return (
    <main style={{ position: "relative", zIndex: 2 }}>
      <StudioIntro />
      <Birth />
      <StudioIntro part="make" />
      <Vision />
      <StudioIntro part="end" />
      <Footer compact />
    </main>
  );
}
