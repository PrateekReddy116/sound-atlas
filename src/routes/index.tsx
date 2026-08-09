import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { Loader2, Plus, Sparkles, Globe, Compass } from "lucide-react";
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Intro } from "@/components/atlas/Intro";
import { LeaveSongSheet } from "@/components/atlas/LeaveSongSheet";
import { SongPanel } from "@/components/atlas/SongPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSession } from "@/hooks/useSession";
import { useLeaveSong, useSongs } from "@/hooks/useSongs";
import { BRAND } from "@/lib/atlas/brand";
import type { SongLocation, SpotifyTrack } from "@/lib/atlas/types";
import { findOpenSpot, isCrowded, pickDiscovery } from "@/lib/atlas/world";
import type { WorldController } from "@/components/world/CameraRig";
import { supabase } from "@/integrations/supabase/client";

// Exact R3F Three.js 3D Abyss Canvas from echo-world repo
const WorldCanvas = lazy(() =>
  import("@/components/world/WorldCanvas").then((module) => ({ default: module.WorldCanvas })),
);

// Geographic 2D World Map Canvas
const WorldMapCanvas = lazy(() =>
  import("@/components/world/WorldMapCanvas").then((module) => ({ default: module.WorldMapCanvas })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sound Atlas — A world made of music" },
      {
        name: "description",
        content:
          "Wander a shared 3D world of songs left behind by strangers, listen through Spotify, and leave one of your own.",
      },
      { property: "og:title", content: "Sound Atlas — A world made of music" },
      {
        property: "og:description",
        content: "Leave a song behind. Discover one somewhere else.",
      },
    ],
  }),
  component: WorldPage,
});

function WorldPage() {
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const { user } = useSession();
  const { data: songs = [], isLoading } = useSongs();
  const leaveSong = useLeaveSong();

  const controllerRef = useRef<WorldController | null>(null);
  const revealRef = useRef<SongLocation | null>(null);

  const [entered, setEntered] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [selected, setSelected] = useState<SongLocation | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [placingTrack, setPlacingTrack] = useState<SpotifyTrack | null>(null);
  const [travelling, setTravelling] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    if (!entered) return;
    if (window.localStorage.getItem("atlas-visited")) return;
    window.localStorage.setItem("atlas-visited", "1");
    setHint("Wander around. You might find something you love.");
    const timer = window.setTimeout(() => setHint(null), 7000);
    return () => window.clearTimeout(timer);
  }, [entered]);

  const onTravelChange = useCallback((active: boolean) => {
    setTravelling(active);
    if (!active && revealRef.current) {
      setSelected(revealRef.current);
      revealRef.current = null;
    }
  }, []);

  const focusSong = useCallback((song: SongLocation, reveal: boolean) => {
    revealRef.current = reveal ? song : null;
    controllerRef.current?.travelTo(song.position);
    if (!reveal) setSelected(song);
  }, []);

  // 2D ↔ 3D Cross-View Focus Synchronization
  const handleViewModeChange = (newMode: "3d" | "2d") => {
    if (newMode === viewMode) return;
    setViewMode(newMode);
    
    if (selected) {
      toast.success(
        newMode === "3d"
          ? `Focusing 3D Abyss on "${selected.title}"`
          : `Centering 2D Map on "${selected.locationName || selected.title}"`
      );
      if (newMode === "3d") {
        setTimeout(() => {
          controllerRef.current?.travelTo(selected.position);
        }, 300);
      }
    } else {
      toast(newMode === "3d" ? "Switched to 3D Abyss View" : "Switched to World Map View");
    }
  };

  const takeMeAnywhere = useCallback(() => {
    const destination = pickDiscovery(songs, selected?.id ?? null);
    if (!destination) {
      toast("The world is still quiet. Leave a song behind.");
      return;
    }

    if (viewMode === "2d") {
      setSelected(destination);
      toast.success(`Discovered "${destination.title}" in ${destination.locationName || "the world"}`);
    } else {
      setSelected(null);
      focusSong(destination, true);
    }
  }, [songs, selected, focusSong, viewMode]);

  const startLeaving = useCallback(() => {
    if (!user) {
      toast("Sign in to leave a song.");
      navigate({ to: "/auth" });
      return;
    }
    setSelected(null);
    setSheetOpen(true);
  }, [user, navigate]);

  const commitSong = useCallback(
    async (track: SpotifyTrack, position: [number, number, number]) => {
      if (!user) return;
      const spot = isCrowded(position, songs) ? findOpenSpot(position, songs, 10) : position;
      const pending = toast.loading("Leaving this song behind...");
      try {
        const song = await leaveSong.mutateAsync({
          track,
          position: spot,
          userId: user.id,
          lat: track.lat,
          lng: track.lng,
          locationName: track.locationName,
        });
        toast.success("Left in the world.", { id: pending });
        setSelected(song);
        if (viewMode === "3d") {
          focusSong(song, false);
        }
      } catch {
        toast.error("Couldn't leave that song. Try again.", { id: pending });
      }
    },
    [user, songs, leaveSong, focusSong, viewMode],
  );

  const isEmpty = !isLoading && songs.length === 0;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <ClientOnly
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
          </div>
        }
      >
        <Suspense fallback={null}>
          {viewMode === "3d" ? (
            /* Exact Three.js / R3F 3D Abyss Canvas from echo-world repo */
            <WorldCanvas
              songs={songs}
              selectedId={selected?.id ?? null}
              onSelect={(song) => focusSong(song, false)}
              onDeselect={() => setSelected(null)}
              placing={placingTrack !== null}
              onPlace={(position) => {
                const track = placingTrack;
                setPlacingTrack(null);
                if (track) void commitSong(track, position);
              }}
              controllerRef={controllerRef}
              reducedMotion={reducedMotion}
              onTravelChange={onTravelChange}
            />
          ) : (
            /* Geographic 2D World Map Canvas */
            <WorldMapCanvas
              songs={songs}
              selectedId={selected?.id ?? null}
              onSelect={(song) => setSelected(song)}
              onDeselect={() => setSelected(null)}
            />
          )}
        </Suspense>
      </ClientOnly>

      {/* Thin UI layer floating over the world */}
      {entered ? (
        <>
          <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-5 sm:p-7">
            <div className="animate-soft-fade">
              <p className="text-sm tracking-[0.28em] uppercase">{BRAND.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {viewMode === "3d" ? "3D Abyss Space View" : "Geographic World Map View"}
              </p>
            </div>
            <nav className="pointer-events-auto flex items-center gap-4 sm:gap-6">
              {/* Minimalist View Mode Switcher */}
              <div className="glass flex items-center rounded-full p-1 border border-border/40">
                <button
                  onClick={() => handleViewModeChange("3d")}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs transition-all ${
                    viewMode === "3d" ? "bg-primary text-primary-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Compass className="size-3.5" />
                  3D Abyss
                </button>
                <button
                  onClick={() => handleViewModeChange("2d")}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs transition-all ${
                    viewMode === "2d" ? "bg-primary text-primary-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Globe className="size-3.5" />
                  2D World Map
                </button>
              </div>

              <button
                onClick={() => setAboutOpen((open) => !open)}
                className="text-whisper hover:text-foreground text-xs sm:text-sm"
              >
                About
              </button>
              {user ? (
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    toast("Signed out.");
                  }}
                  className="text-whisper hover:text-foreground text-xs sm:text-sm"
                >
                  Sign out
                </button>
              ) : (
                <Link to="/auth" className="text-whisper hover:text-foreground text-xs sm:text-sm">
                  Sign in
                </Link>
              )}
            </nav>
          </header>

          {aboutOpen ? (
            <div className="glass animate-rise absolute top-20 right-5 z-30 w-[min(20rem,calc(100vw-2.5rem))] rounded-xl p-5 sm:right-7">
              <h2 className="text-lg">{BRAND.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Every object here is a song someone loved enough to leave behind. Wander, listen
                through Spotify, and add one of your own. Nothing is hosted here — playback happens
                inside Spotify's own player.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">{BRAND.secondary}</p>
              <button
                onClick={() => setAboutOpen(false)}
                className="text-whisper mt-4 hover:text-foreground"
              >
                Close
              </button>
            </div>
          ) : null}

          {hint ? (
            <p className="animate-soft-fade pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 text-center text-sm text-muted-foreground">
              {hint}
            </p>
          ) : null}

          {isEmpty ? (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
              <p className="max-w-sm text-center text-lg text-muted-foreground">
                The world is still quiet. Leave a song behind.
              </p>
            </div>
          ) : null}

          {placingTrack ? (
            <div className="glass animate-rise absolute top-24 left-1/2 z-20 -translate-x-1/2 rounded-full px-5 py-2.5 text-center text-xs text-muted-foreground">
              Choose a place for “{placingTrack.title}” — click anywhere in the world.
              <button
                onClick={() => setPlacingTrack(null)}
                className="ml-3 text-foreground underline-offset-4 hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : null}

          {selected ? (
            <SongPanel
              song={selected}
              isMine={Boolean(user && selected.createdBy === user.id)}
              onClose={() => setSelected(null)}
            />
          ) : null}

          <div className="absolute inset-x-0 bottom-6 z-20 flex flex-wrap items-center justify-center gap-3 px-4 sm:bottom-8">
            <button
              onClick={startLeaving}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Plus className="size-4" aria-hidden />
              Leave a Song
            </button>
            <button
              onClick={takeMeAnywhere}
              disabled={travelling}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Sparkles className="size-4" aria-hidden />
              {travelling ? "Wandering..." : "Take Me Anywhere"}
            </button>
          </div>

          <p className="pointer-events-none absolute right-3 bottom-2 z-20 text-[10px] text-muted-foreground/70">
            Inspired by odeta (father of three) on Reddit.
          </p>
        </>
      ) : (
        <Intro onEnter={() => setEntered(true)} reducedMotion={reducedMotion} />
      )}

      {sheetOpen ? (
        <LeaveSongSheet
          onClose={() => setSheetOpen(false)}
          onPlaceHere={(track) => {
            setSheetOpen(false);
            const origin = controllerRef.current?.focusPoint() ?? [0, 1.6, 0];
            void commitSong(track, findOpenSpot(origin, songs, 14));
          }}
          onChooseSpot={(track) => {
            setSheetOpen(false);
            setPlacingTrack(track);
          }}
        />
      ) : null}
    </main>
  );
}
