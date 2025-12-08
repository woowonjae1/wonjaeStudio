"use client";

import Prism from "@/components/Prism";
import Navbar from "@/components/Navbar";
import HeroContent from "@/components/HeroContent";
import TransitionSection from "@/components/TransitionSection";
import MusicCards from "@/components/MusicCards";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export default function HomePage() {
  return (
    <div style={{ background: "#000" }}>
      <section
        id="home"
        style={{ width: "100%", height: "100vh", position: "relative" }}
      >
        <Navbar />
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.5}
          glow={1}
        />
        <HeroContent />
      </section>
      <TransitionSection />
      <section id="music">
        <MusicCards />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <ContactSection />
    </div>
  );
}
