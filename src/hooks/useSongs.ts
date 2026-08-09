import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { SongLocation, SpotifyTrack } from "@/lib/atlas/types";

type Row = {
  id: string;
  spotify_track_id: string;
  title: string;
  artist: string;
  album: string | null;
  artwork_url: string | null;
  position_x: number;
  position_y: number;
  position_z: number;
  rotation_y: number;
  scale: number;
  is_demo: boolean;
  created_by: string | null;
  created_at: string;
  profiles?: { username: string | null } | null;
};

function toSong(row: Row): SongLocation {
  return {
    id: row.id,
    spotifyTrackId: row.spotify_track_id,
    title: row.title,
    artist: row.artist,
    album: row.album,
    artworkUrl: row.artwork_url,
    position: [row.position_x, row.position_y, row.position_z],
    rotationY: row.rotation_y,
    scale: row.scale,
    isDemo: row.is_demo,
    createdBy: row.created_by,
    createdAt: row.created_at,
    username: row.profiles?.username ?? null,
  };
}

export function useSongs() {
  return useQuery({
    queryKey: ["world-locations"],
    queryFn: async (): Promise<SongLocation[]> => {
      const { data, error } = await supabase
        .from("world_locations")
        .select(
          "id, spotify_track_id, title, artist, album, artwork_url, position_x, position_y, position_z, rotation_y, scale, is_demo, created_by, created_at",
        )
        .order("created_at", { ascending: true })
        .limit(2000);
      if (error) throw error;
      return ((data ?? []) as Row[]).map(toSong);
    },
    staleTime: 30_000,
  });
}

export function useLeaveSong() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      track: SpotifyTrack;
      position: [number, number, number];
      userId: string;
    }): Promise<SongLocation> => {
      const { data, error } = await supabase
        .from("world_locations")
        .insert({
          spotify_track_id: input.track.id,
          title: input.track.title,
          artist: input.track.artist,
          album: input.track.album,
          artwork_url: input.track.artworkUrl,
          position_x: input.position[0],
          position_y: input.position[1],
          position_z: input.position[2],
          rotation_y: Math.random() * Math.PI * 2,
          created_by: input.userId,
        })
        .select(
          "id, spotify_track_id, title, artist, album, artwork_url, position_x, position_y, position_z, rotation_y, scale, is_demo, created_by, created_at",
        )
        .single();
      if (error) throw error;
      return toSong(data as Row);
    },
    onSuccess: (song) => {
      queryClient.setQueryData<SongLocation[]>(["world-locations"], (previous) =>
        previous ? [...previous, song] : [song],
      );
    },
  });
}
