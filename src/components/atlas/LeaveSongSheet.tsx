"use client";

import { Loader2, Search, X, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { searchSongs } from "@/lib/spotify.functions";
import type { SpotifyTrack } from "@/lib/atlas/types";
import { GLOBAL_LANDMARKS } from "@/lib/atlas/geo";

export function LeaveSongSheet({
  onClose,
  onPlaceHere,
  onChooseSpot,
}: {
  onClose: () => void;
  onPlaceHere: (track: SpotifyTrack) => void;
  onChooseSpot: (track: SpotifyTrack) => void;
}) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [_searchEnabled, setSearchEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chosen, setChosen] = useState<SpotifyTrack | null>(null);

  // Privacy-friendly location selection (Apple Design Responsibility §16)
  const [locationMode, setLocationMode] = useState<"auto" | "city">("auto");
  const fallbackCity = GLOBAL_LANDMARKS[6] ?? GLOBAL_LANDMARKS[0]!;
  const [selectedCity, setSelectedCity] = useState(fallbackCity);
  const [detectedLoc, _setDetectedLoc] = useState<{ lat: number; lng: number; name: string } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 320);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchSongs({ query: debounced })
      .then((response) => {
        if (cancelled) return;
        setSearchEnabled(response.searchEnabled);
        setResults(response.results);
        setError(
          response.results.length === 0
            ? "Couldn't find that song. Try another search query."
            : null,
        );
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't reach search service. Try again in a moment.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const hint = useMemo(
    () => "Search for any song title or artist, or paste a Spotify track link",
    [],
  );

  const handleFinalPlace = (isDirect: boolean) => {
    if (!chosen) return;
    
    // Attach location coordinates to chosen track
    const trackWithLocation: SpotifyTrack = {
      ...chosen,
      lat: locationMode === "auto" && detectedLoc ? detectedLoc.lat : selectedCity.lat,
      lng: locationMode === "auto" && detectedLoc ? detectedLoc.lng : selectedCity.lng,
      locationName: locationMode === "auto" && detectedLoc ? detectedLoc.name : `${selectedCity.name}, ${selectedCity.country || ''}`,
    };

    if (isDirect) {
      onPlaceHere(trackWithLocation);
    } else {
      onChooseSpot(trackWithLocation);
    }
  };

  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-end justify-center p-4 sm:items-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-background/60 backdrop-blur-sm transition-opacity duration-300"
      />
      <div
        role="dialog"
        aria-label="Leave a song behind"
        className="glass animate-rise relative w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-white/20"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground transition-all duration-200 hover:text-foreground active:scale-95"
        >
          <X className="size-5" />
        </button>

        <h2 className="text-2xl font-serif font-normal">Leave a song behind</h2>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>

        <div className="mt-5 flex items-center gap-3 border-b border-border/60 pb-3">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search any song or artist..."
            aria-label="Search for a song"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {loading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden />
          ) : null}
        </div>

        {error ? <p className="mt-4 text-xs text-muted-foreground">{error}</p> : null}

        <ul className="mt-3 max-h-56 space-y-1.5 overflow-y-auto pr-1">
          {results.map((track) => {
            const active = chosen?.id === track.id;
            return (
              <li key={track.id}>
                <button
                  onClick={() => setChosen(track)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-all duration-200 ${
                    active
                      ? "bg-primary/15 border border-primary/40 text-foreground"
                      : "hover:bg-secondary/60 border border-transparent"
                  }`}
                >
                  {track.artworkUrl ? (
                    <img
                      src={track.artworkUrl}
                      alt=""
                      className="size-11 rounded-md object-cover shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <span className="size-11 rounded-md bg-muted" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">{track.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {track.artist}
                      {track.album ? ` · ${track.album}` : ""}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {chosen ? (
          <div className="mt-5 flex flex-col gap-4 border-t border-border/60 pt-4">
            {/* Clean Location Selector (No Emojis) */}
            <div className="flex flex-col gap-2 rounded-xl bg-secondary/40 p-3 border border-white/10">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" /> Geographic Location
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={locationMode === "auto" ? "auto" : selectedCity.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "auto") {
                      setLocationMode("auto");
                    } else {
                      setLocationMode("city");
                      const found = GLOBAL_LANDMARKS.find(c => c.name === val);
                      if (found) setSelectedCity(found);
                    }
                  }}
                  className="w-full rounded-lg border border-white/20 bg-background/80 px-3 py-1.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="auto">Detect My Location</option>
                  {GLOBAL_LANDMARKS.filter(l => !l.isRegion).map(city => (
                    <option key={city.name} value={city.name}>
                      {city.name}, {city.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => handleFinalPlace(true)}
                className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md"
              >
                Place here
              </button>
              <button
                onClick={() => handleFinalPlace(false)}
                className="flex-1 rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary hover:text-primary active:scale-95"
              >
                Choose a spot
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
