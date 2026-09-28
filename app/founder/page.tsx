import type { Metadata } from "next";
import FounderProfile from "@/components/founder/FounderProfile";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Harshit Singh — Founder / Creative Director · MONARCH",
  description:
    "Monarch exists because too much of the internet began to feel interchangeable. A note from its founder, Harshit Singh.",
};

export default function FounderPage() {
  return (
    <>
      <FounderProfile />
      <Footer compact />
    </>
  );
}
