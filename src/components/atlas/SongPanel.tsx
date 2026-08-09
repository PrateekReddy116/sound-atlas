import { X } from "lucide-react";
import { useState } from "react";

import type { SongLocation } from "@/lib/atlas/types";
import { timeAgo } from "@/lib/atlas/world";

/**
 * Floating discovery panel. Spotify playback happens exclusively inside
 * Spotify's official embed — nothing is hosted or proxied here.
 */
export function SongPanel({
  song,
  isMine,
  onClose,
}: {
  song: SongLocation;
  isMine: boolean;
  onClose: () => void;
}) {
  const [listening, setListening] = useState(false);

  return (
    <aside
      aria-label={`${song.title} by ${song.artist}`}
      className="glass animate-rise pointer-events-auto absolute bottom-24 left-1/2 z-20 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl p-4 sm:bottom-8 sm:left-8 sm:translate-x-0"
    >
      <button
        onClick={onClose}
        aria-label="Close song details"
        className="absolute top-3 right-3 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>

      {song.artworkUrl ? (
        <img
          src={song.artworkUrl}
          alt={`Album artwork for ${song.title} by ${song.artist}`}
          loading="lazy"
          className="aspect-square w-full rounded-md object-cover"
        />
      ) : null}

      <h2 className="mt-4 text-xl leading-snug">{song.title}</h2>
      <p className="text-sm text-muted-foreground">{song.artist}</p>
      {song.album ? <p className="mt-1 text-xs text-muted-foreground">{song.album}</p> : null}

      <div className="mt-4">
        {listening ? (
          <iframe
            title={`Spotify player for ${song.title}`}
            src={`https://open.spotify.com/embed/track/${song.spotifyTrackId}?theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="rounded-md"
          />
        ) : (
          <button
            onClick={() => setListening(true)}
            className="w-full rounded-full border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            ▶ Listen on Spotify
          </button>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {isMine
          ? "Left here by you"
          : song.isDemo
            ? "Left here as demo content"
            : song.username
              ? `Left here by @${song.username}`
              : "Left here by someone"}
        <span aria-hidden> · </span>
        {timeAgo(song.createdAt)}
      </p>

      <a
        href={`https://open.spotify.com/track/${song.spotifyTrackId}`}
        target="_blank"
        rel="noreferrer"
        className="text-whisper mt-2 inline-block hover:text-foreground"
      >
        Open in Spotify
      </a>
    </aside>
  );
}
