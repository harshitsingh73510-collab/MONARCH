import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Let's begin · MONARCH",
  description: "Tell Monarch what you're building — and what you want the world to remember.",
};

export default function ContactPage() {
  return (
    <main style={{ position: "relative", zIndex: 2, paddingTop: "4rem" }}>
      <Contact />
      <Footer compact />
    </main>
  );
}
