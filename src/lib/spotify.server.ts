import type { SpotifyTrack } from "./atlas/types";

const TRACK_URL = /(?:track[/:])([A-Za-z0-9]{22})/;

export function extractTrackId(input: string): string | null {
  const match = TRACK_URL.exec(input.trim());
  return match?.[1] ?? null;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

/** Client-credentials token, kept server-side only. */
async function getAppToken(id: string, secret: string) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) return cachedToken.value;
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: `Basic ${btoa(`${id}:${secret}`)}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new Error("Spotify rejected the credentials.");
  const json = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.value;
}

type ApiTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string; width: number }[] };
};

function toTrack(track: ApiTrack): SpotifyTrack {
  const images = [...(track.album.images ?? [])].sort((a, b) => a.width - b.width);
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    album: track.album?.name ?? null,
    artworkUrl: images[1]?.url ?? images[0]?.url ?? null,
  };
}

export async function searchSpotifyTracks(query: string): Promise<SpotifyTrack[]> {
  const id = process.env["SPOTIFY_CLIENT_ID"];
  const secret = process.env["SPOTIFY_CLIENT_SECRET"];
  if (!id || !secret) return [];
  const token = await getAppToken(id, secret);
  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "track");
  url.searchParams.set("limit", "10");
  const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error("Spotify search is unavailable right now.");
  const json = (await response.json()) as { tracks?: { items: ApiTrack[] } };
  return (json.tracks?.items ?? []).filter(Boolean).map(toTrack);
}

export function hasSpotifyCredentials() {
  return Boolean(process.env["SPOTIFY_CLIENT_ID"] && process.env["SPOTIFY_CLIENT_SECRET"]);
}

function meta(html: string, property: string) {
  const pattern = new RegExp(`<meta property="${property}" content="([^"]*)"`);
  return pattern.exec(html)?.[1] ?? null;
}

function decode(value: string | null) {
  if (!value) return null;
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Public-metadata lookup for a single track. Works without app credentials so a
 * pasted Spotify link is always a valid way to leave a song.
 */
export async function lookupPublicTrack(trackId: string): Promise<SpotifyTrack | null> {
  const [page, oembed] = await Promise.all([
    fetch(`https://open.spotify.com/track/${trackId}`, {
      headers: { "user-agent": "Mozilla/5.0 SoundAtlas" },
    }).then((response) => (response.ok ? response.text() : "")),
    fetch(
      `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`,
    ).then((response) =>
      response.ok
        ? (response.json() as Promise<{ title?: string; thumbnail_url?: string }>)
        : null,
    ),
  ]);

  const title = decode(meta(page, "og:title")) ?? oembed?.title ?? null;
  if (!title) return null;
  const description = decode(meta(page, "og:description")) ?? "";
  const parts = description.split(" · ").map((part) => part.trim());
  const artwork = decode(meta(page, "og:image")) ?? oembed?.thumbnail_url ?? null;

  return {
    id: trackId,
    title,
    artist: parts[0] || "Unknown artist",
    album: parts[1] || null,
    artworkUrl: artwork,
  };
}
