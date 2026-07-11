import Arrival from "@/components/sections/Arrival";
import Birth from "@/components/sections/Birth";
import Problem from "@/components/sections/Problem";
import MeetMonarch from "@/components/sections/MeetMonarch";
import Intelligence from "@/components/sections/Intelligence";
import Ecosystem from "@/components/sections/Ecosystem";
import Industries from "@/components/sections/Industries";
import Proof from "@/components/sections/Proof";
import Vision from "@/components/sections/Vision";
import Enter from "@/components/sections/Enter";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main style={{ position: "relative" }}>
      <Arrival />
      <Birth />
      <Problem />
      <MeetMonarch />
      <Intelligence />
      <Ecosystem />
      <Industries />
      <Proof />
      <Vision />
      <Enter />
      <Footer />
    </main>
  );
}
