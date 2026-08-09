import { useEffect, useState } from "react";

import { BRAND } from "@/lib/atlas/brand";

/**
 * Short cinematic opening. The world is already alive behind it and is slowly
 * revealed as the words fade.
 */
export function Intro({
  onEnter,
  reducedMotion,
}: {
  onEnter: () => void;
  reducedMotion: boolean;
}) {
  const [step, setStep] = useState(reducedMotion ? 3 : 0);

  useEffect(() => {
    if (reducedMotion) return;
    const timers = [
      window.setTimeout(() => setStep(1), 1500),
      window.setTimeout(() => setStep(2), 3600),
      window.setTimeout(() => setStep(3), 4600),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
      <div
        className="absolute inset-0 bg-background transition-opacity duration-[2200ms]"
        style={{ opacity: step >= 2 ? 0.42 : step >= 1 ? 0.82 : 1 }}
      />
      <div className="relative">
        <h1
          className="text-4xl leading-tight transition-all duration-1000 sm:text-6xl"
          style={{
            opacity: step === 0 ? 1 : step === 1 ? 0 : 0,
            transform: step === 0 ? "none" : "translateY(-10px)",
          }}
        >
          A world made of music.
        </h1>
        <h2
          className="absolute inset-x-0 top-0 text-4xl leading-tight transition-all duration-1000 sm:text-6xl"
          style={{
            opacity: step === 1 ? 1 : 0,
            transform: step >= 2 ? "translateY(-10px)" : "none",
          }}
        >
          {BRAND.tagline}
        </h2>
      </div>

      <div
        className="relative mt-16 flex flex-col items-center gap-6 transition-opacity duration-1000"
        style={{ opacity: step >= 3 ? 1 : 0, pointerEvents: step >= 3 ? "auto" : "none" }}
      >
        <p className="text-whisper">{BRAND.name}</p>
        <button
          onClick={onEnter}
          className="glass rounded-full px-8 py-3 text-sm tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Enter the world
        </button>
        <p className="max-w-xs text-xs text-muted-foreground">{BRAND.secondary}</p>
      </div>
    </div>
  );
}
