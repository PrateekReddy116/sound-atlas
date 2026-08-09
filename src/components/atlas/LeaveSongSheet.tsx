import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { searchSongs } from "@/lib/spotify.functions";
import type { SpotifyTrack } from "@/lib/atlas/types";

export function LeaveSongSheet({
  onClose,
  onPlaceHere,
  onChooseSpot,
}: {
  onClose: () => void;
  onPlaceHere: (track: SpotifyTrack) => void;
  onChooseSpot: (track: SpotifyTrack) => void;
}) {
  const search = useServerFn(searchSongs);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chosen, setChosen] = useState<SpotifyTrack | null>(null);

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
    search({ data: { query: debounced } })
      .then((response) => {
        if (cancelled) return;
        setSearchEnabled(response.searchEnabled);
        setResults(response.results);
        setError(
          response.results.length === 0
            ? response.searchEnabled
              ? "Couldn't find that song. Try another search."
              : "Search isn't connected yet — paste a Spotify track link instead."
            : null,
        );
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't reach Spotify. Try again in a moment.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced, search]);

  const hint = useMemo(
    () =>
      searchEnabled
        ? "Search Spotify, or paste a track link"
        : "Paste a Spotify track link (search isn't connected yet)",
    [searchEnabled],
  );

  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-end justify-center p-4 sm:items-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-background/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-label="Leave a song behind"
        className="glass animate-rise relative w-full max-w-lg rounded-xl p-6"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-2xl">Leave a song behind</h2>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>

        <div className="mt-5 flex items-center gap-3 border-b border-border pb-3">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Spotify..."
            aria-label="Search Spotify for a song"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {loading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden />
          ) : null}
        </div>

        {error ? <p className="mt-4 text-xs text-muted-foreground">{error}</p> : null}

        <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto">
          {results.map((track) => {
            const active = chosen?.id === track.id;
            return (
              <li key={track.id}>
                <button
                  onClick={() => setChosen(track)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors ${
                    active ? "bg-secondary" : "hover:bg-secondary"
                  }`}
                >
                  {track.artworkUrl ? (
                    <img
                      src={track.artworkUrl}
                      alt=""
                      className="size-11 rounded object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="size-11 rounded bg-muted" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-foreground">{track.title}</span>
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
          <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
            <button
              onClick={() => onPlaceHere(chosen)}
              className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Place here
            </button>
            <button
              onClick={() => onChooseSpot(chosen)}
              className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Choose a spot
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
