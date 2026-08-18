import { Hero } from "@/components/Hero";
import { Evolution } from "@/components/Evolution";
import { Capabilities } from "@/components/Capabilities";
import { NameKeywords } from "@/components/NameKeywords";
import { SubmissionSection } from "@/components/SubmissionSection";
import { Prize } from "@/components/Prize";
import { Criteria } from "@/components/Criteria";
import { KeepInMind } from "@/components/KeepInMind";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Evolution />
      <Capabilities />
      <NameKeywords />
      <KeepInMind />
      <Criteria />
      <SubmissionSection />
      <Prize />
      <Footer />
    </>
  );
}
