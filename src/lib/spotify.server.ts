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

  // If Spotify API credentials are set, use official Spotify Search API
  if (id && secret) {
    try {
      const token = await getAppToken(id, secret);
      const url = new URL("https://api.spotify.com/v1/search");
      url.searchParams.set("q", query);
      url.searchParams.set("type", "track");
      url.searchParams.set("limit", "10");
      const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
      if (response.ok) {
        const json = (await response.json()) as { tracks?: { items: ApiTrack[] } };
        return (json.tracks?.items ?? []).filter(Boolean).map(toTrack);
      }
    } catch (err) {
      console.warn("Spotify search failed, falling back to public music catalog", err);
    }
  }

  // Universal Public Fallback Search (iTunes API — 0 setup required, works for any song query)
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=10`;
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as {
        results: Array<{
          trackId: number;
          trackName: string;
          artistName: string;
          collectionName: string;
          artworkUrl100: string;
        }>;
      };
      return data.results.map((item) => ({
        id: String(item.trackId),
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName || null,
        artworkUrl: item.artworkUrl100 ? item.artworkUrl100.replace("100x100bb", "300x300bb") : null,
      }));
    }
  } catch (err) {
    console.warn("Fallback music search error", err);
  }

  return [];
}

export function hasSpotifyCredentials() {
  return true; // Search is always enabled now with fallback support
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
