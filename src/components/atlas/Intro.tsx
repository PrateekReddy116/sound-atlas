"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/atlas/brand";

/**
 * Ultra-fluid cinematic opening sequence.
 * Displays elegant small centered text fading in & out sequentially,
 * then seamlessly reveals the live 3D world.
 */
export function Intro({
  onEnter,
  reducedMotion,
}: {
  onEnter: () => void;
  reducedMotion: boolean;
}) {
  // Step 0: Initial dark
  // Step 1: Line 1 Fade In ("A world made of music.")
  // Step 2: Line 1 Fade Out
  // Step 3: Line 2 Fade In ("By the world, for the world.")
  // Step 4: Line 2 Fade Out
  // Step 5: Overlay Fade Out & Enter World
  const [step, setStep] = useState(reducedMotion ? 5 : 0);

  useEffect(() => {
    if (reducedMotion) {
      onEnter();
      return;
    }

    const timers = [
      window.setTimeout(() => setStep(1), 600),   // Line 1 Fade In
      window.setTimeout(() => setStep(2), 2800),  // Line 1 Fade Out
      window.setTimeout(() => setStep(3), 4200),  // Line 2 Fade In
      window.setTimeout(() => setStep(4), 7200),  // Line 2 Fade Out
      window.setTimeout(() => {
        setStep(5);
        onEnter();
      }, 8800), // Reveal World
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [reducedMotion, onEnter]);

  if (step >= 5) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#040406] px-6 text-center transition-opacity duration-[1800ms] ease-in-out ${
        step === 4 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative max-w-xl">
        {/* Line 1: "A world made of music." */}
        <h1
          className={`text-xl sm:text-2xl font-light tracking-[0.15em] text-foreground/90 transition-all duration-[1600ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            step === 1
              ? "opacity-100 blur-0 translate-y-0"
              : "opacity-0 blur-md translate-y-2 pointer-events-none"
          }`}
        >
          A world made of music.
        </h1>

        {/* Line 2: "By the world, for the world." */}
        <div
          className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 transition-all duration-[1600ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            step === 3
              ? "opacity-100 blur-0 translate-y-0"
              : "opacity-0 blur-md translate-y-2 pointer-events-none"
          }`}
        >
          <h2 className="text-xl sm:text-2xl font-light tracking-[0.15em] text-foreground/90">
            {BRAND.tagline}
          </h2>
          <p className="text-xs sm:text-sm font-sans tracking-widest text-muted-foreground font-light">
            Wander around. Every place contains a song left by a stranger.
          </p>
        </div>
      </div>
    </div>
  );
}
