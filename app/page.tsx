import Arrival from "@/components/sections/Arrival";
import Problem from "@/components/sections/Problem";
import SelectedWork from "@/components/sections/SelectedWork";
import Ecosystem from "@/components/sections/Ecosystem";
import Process from "@/components/sections/Process";
import Founder from "@/components/sections/Founder";
import WhyMonarch from "@/components/sections/WhyMonarch";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/Marquee";

/*
 * HERO → 01 the noise / sameness / exception → 02 SELECTED WORK →
 * 03 capabilities → 04 process → 05 founder → 06 why Monarch → 07 let's begin
 * (The two manifesto sequences now live on /studio.)
 */
export default function Home() {
  return (
    <main style={{ position: "relative" }}>
      <Arrival />
      <Problem />
      <SelectedWork />
      <Marquee />
      <Ecosystem />
      <Process />
      <Founder />
      <WhyMonarch />
      <Contact />
      <Footer />
    </main>
  );
}
