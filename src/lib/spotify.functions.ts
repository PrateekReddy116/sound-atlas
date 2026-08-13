"use server";

import { z } from "zod";

import {
  extractTrackId,
  hasSpotifyCredentials,
  lookupPublicTrack,
  searchSpotifyTracks,
} from "./spotify.server";
import type { SpotifyTrack } from "./atlas/types";

const searchSchema = z.object({ query: z.string().min(1).max(120) });
const resolveSchema = z.object({ url: z.string().min(1).max(400) });

export async function searchSongs(input: {
  query: string;
}): Promise<{ searchEnabled: boolean; results: SpotifyTrack[] }> {
  const data = searchSchema.parse(input);
  const pasted = extractTrackId(data.query);
  if (pasted) {
    const track = await lookupPublicTrack(pasted);
    return { searchEnabled: hasSpotifyCredentials(), results: track ? [track] : [] };
  }
  if (!hasSpotifyCredentials()) return { searchEnabled: false, results: [] };
  return { searchEnabled: true, results: await searchSpotifyTracks(data.query) };
}

export async function resolveSong(input: { url: string }): Promise<SpotifyTrack | null> {
  const data = resolveSchema.parse(input);
  const trackId = extractTrackId(data.url);
  if (!trackId) return null;
  return lookupPublicTrack(trackId);
}
