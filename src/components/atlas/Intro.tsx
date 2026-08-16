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
  const [step, setStep] = useState(reducedMotion ? 5 : 0);

  useEffect(() => {
    if (reducedMotion) {
      onEnter();
      return;
    }

    const timers = [
      window.setTimeout(() => setStep(1), 600),
      window.setTimeout(() => setStep(2), 2800),
      window.setTimeout(() => setStep(3), 4200),
      window.setTimeout(() => setStep(4), 7200),
      window.setTimeout(() => {
        setStep(5);
        onEnter();
      }, 8800),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [reducedMotion, onEnter]);

  const skip = () => {
    setStep(5);
    onEnter();
  };

  if (step >= 5) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#040406] px-6 text-center transition-opacity duration-[1200ms] ease-in-out ${
        step === 4 ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative max-w-xl">
        <h1
          className={`text-xl font-light tracking-[0.15em] text-foreground/90 transition-all duration-[1600ms] sm:text-2xl ${
            step === 1
              ? "translate-y-0 opacity-100 blur-0"
              : "pointer-events-none translate-y-2 opacity-0 blur-md"
          }`}
        >
          A world made of music.
        </h1>

        <div
          className={`absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3 transition-all duration-[1600ms] ${
            step === 3
              ? "translate-y-0 opacity-100 blur-0"
              : "pointer-events-none translate-y-2 opacity-0 blur-md"
          }`}
        >
          <h2 className="text-xl font-light tracking-[0.15em] text-foreground/90 sm:text-2xl">
            {BRAND.tagline}
          </h2>
          <p className="font-sans text-xs font-light tracking-widest text-muted-foreground sm:text-sm">
            Wander around. Every place contains a song left by a stranger.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute right-5 bottom-6 z-50 text-whisper text-muted-foreground transition-colors hover:text-foreground sm:right-8 sm:bottom-8"
      >
        Skip
      </button>
    </div>
  );
}
