import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  extractTrackId,
  hasSpotifyCredentials,
  lookupPublicTrack,
  searchSpotifyTracks,
} from "./spotify.server";
import type { SpotifyTrack } from "./atlas/types";

export const searchSongs = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ query: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }): Promise<{ searchEnabled: boolean; results: SpotifyTrack[] }> => {
    const pasted = extractTrackId(data.query);
    if (pasted) {
      const track = await lookupPublicTrack(pasted);
      return { searchEnabled: hasSpotifyCredentials(), results: track ? [track] : [] };
    }
    if (!hasSpotifyCredentials()) return { searchEnabled: false, results: [] };
    return { searchEnabled: true, results: await searchSpotifyTracks(data.query) };
  });

export const resolveSong = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ url: z.string().min(1).max(400) }).parse(data))
  .handler(async ({ data }): Promise<SpotifyTrack | null> => {
    const trackId = extractTrackId(data.url);
    if (!trackId) return null;
    return lookupPublicTrack(trackId);
  });
