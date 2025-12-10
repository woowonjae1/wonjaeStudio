"use client";

import Prism from "@/components/Prism";

interface DynamicPrismProps {
  animationType?: "rotate" | "hover" | "3drotate";
  timeScale?: number;
  height?: number;
  baseWidth?: number;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  noise?: number;
  glow?: number;
}

const DynamicPrism = (props: DynamicPrismProps) => {
  return <Prism {...props} />;
};

export default DynamicPrism;
