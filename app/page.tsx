import Arrival from "@/components/sections/Arrival";
import Problem from "@/components/sections/Problem";
import Birth from "@/components/sections/Birth";
import Ecosystem from "@/components/sections/Ecosystem";
import Process from "@/components/sections/Process";
import SelectedWork from "@/components/sections/SelectedWork";
import WhyMonarch from "@/components/sections/WhyMonarch";
import Vision from "@/components/sections/Vision";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/Marquee";

export default function Home() {
  return (
    <main style={{ position: "relative" }}>
      <Arrival />
      <Problem />
      <Birth />
      <Ecosystem />
      <Process />
      <SelectedWork />
      <Marquee />
      <WhyMonarch />
      <Vision />
      <Contact />
      <Footer />
    </main>
  );
}
