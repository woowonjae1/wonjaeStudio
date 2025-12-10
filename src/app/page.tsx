"use client";

import { useEffect } from "react";
import DynamicPrism from "@/components/DynamicPrism";
import Navbar from "@/components/Navbar";
import HeroContent from "@/components/HeroContent";
import TransitionSection from "@/components/TransitionSection";
import MusicCards from "@/components/MusicCards";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import LoadingScreen from "@/components/LoadingScreen";
import { registerServiceWorker } from "@/lib/registerServiceWorker";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function HomePage() {
  const { backgroundColor } = useMusicPlayer();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    console.log("Background color changed to:", backgroundColor);
  }, [backgroundColor]);

  return (
    <>
      <LoadingScreen />
      {/* Dynamic background layer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, ${backgroundColor} 0%, #000 40%, #000 100%)`,
          transition: "background 1.5s ease",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
      <div style={{ background: "transparent", minHeight: "100vh" }}>
        <section
          id="home"
          style={{ width: "100%", height: "100vh", position: "relative" }}
        >
          <Navbar />
          <DynamicPrism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
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
    </>
  );
}
