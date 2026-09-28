import type { Metadata } from "next";
import SelectedWork from "@/components/sections/SelectedWork";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Projects · MONARCH",
  description: "Six worlds built by Monarch — Noir, Vanta, Noctis, Monolith, Strata and ÆRA. Every one is live.",
};

export default function WorkPage() {
  return (
    <main style={{ position: "relative" }}>
      <SelectedWork page />
      <Footer compact />
    </main>
  );
}
