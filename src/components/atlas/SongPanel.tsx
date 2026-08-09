import { X, Play, ExternalLink, MapPin } from "lucide-react";
import type { SongLocation } from "@/lib/atlas/types";
import { timeAgo } from "@/lib/atlas/world";

/**
 * Apple Design minimal discovery panel (No Emojis, Clean Lucide SVG Icons).
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
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${song.artist} ${song.title} official audio`,
  )}`;

  return (
    <aside
      aria-label={`${song.title} by ${song.artist}`}
      className="glass animate-rise pointer-events-auto absolute bottom-24 left-1/2 z-30 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/20 sm:bottom-8 sm:left-8 sm:translate-x-0"
    >
      {/* Apple-style floating close pill */}
      <button
        onClick={onClose}
        aria-label="Close song details"
        className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-muted-foreground backdrop-blur-md transition-all duration-200 hover:bg-black/60 hover:text-white active:scale-90"
      >
        <X className="size-4" />
      </button>

      {/* Hero Album Artwork */}
      {song.artworkUrl ? (
        <div className="relative overflow-hidden rounded-2xl shadow-lg border border-white/10 group">
          <img
            src={song.artworkUrl}
            alt={`Album artwork for ${song.title} by ${song.artist}`}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {song.locationName ? (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md shadow-md">
              <MapPin className="size-3 text-primary" />
              {song.locationName}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Typography Hierarchy */}
      <div className="mt-4">
        <h2 className="text-2xl font-serif font-normal text-foreground leading-tight tracking-tight">
          {song.title}
        </h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{song.artist}</p>
        {song.album ? <p className="mt-0.5 text-xs text-muted-foreground/60">{song.album}</p> : null}
      </div>

      {/* Integrated Spotify Embed Player */}
      <div className="mt-4 overflow-hidden rounded-xl bg-black/40 border border-white/10 shadow-inner">
        <iframe
          title={`Spotify player for ${song.title}`}
          src={`https://open.spotify.com/embed/track/${song.spotifyTrackId}?theme=0`}
          width="100%"
          height="80"
          frameBorder="0"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="w-full rounded-xl"
        />
      </div>

      {/* Action Buttons: Full Track & Spotify App */}
      <div className="mt-4 flex items-center gap-2.5">
        <a
          href={youtubeSearchUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-white/20 active:scale-95 shadow-sm"
        >
          <Play className="size-3.5 fill-current text-white/90" /> Play Full Song
        </a>
        <a
          href={`https://open.spotify.com/track/${song.spotifyTrackId}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center rounded-full border border-white/15 bg-black/30 p-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-white/30 hover:text-white active:scale-95"
          title="Open in Spotify App"
        >
          <ExternalLink className="size-4" />
        </a>
      </div>

      {/* Minimalist Footnote Attribution */}
      <div className="mt-4 text-center text-[11px] font-sans text-muted-foreground/80 tracking-wide">
        {isMine
          ? "Left here by you"
          : song.isDemo
            ? "Demo content"
            : song.username
              ? `Left by @${song.username}`
              : "Left by a stranger"}
        <span aria-hidden className="mx-1.5 opacity-40">·</span>
        {timeAgo(song.createdAt)}
      </div>
    </aside>
  );
}
