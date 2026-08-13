"use client";

import { useEffect } from "react";
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

// Preset geographic coordinates for seed songs
const DEMO_GEO_MAP: Record<string, { lat: number; lng: number; locationName: string }> = {
  "Space Song": { lat: 40.7128, lng: -74.0060, locationName: "New York, USA" },
  "Sparkle": { lat: 35.6762, lng: 139.6503, locationName: "Tokyo, Japan" },
  "Midnight City": { lat: 48.8566, lng: 2.3522, locationName: "Paris, France" },
  "Starman": { lat: 51.5074, lng: -0.1278, locationName: "London, UK" },
  "Kun Faya Kun": { lat: 19.0760, lng: 72.8777, locationName: "Mumbai, India" },
  "Resonance": { lat: 64.1466, lng: -21.9426, locationName: "Reykjavik, Iceland" },
};

function toSong(row: Row, index: number = 0): SongLocation {
  const demoGeo = DEMO_GEO_MAP[row.title] || {
    lat: (index * 17) % 120 - 60,
    lng: (index * 31) % 360 - 180,
    locationName: "Earth",
  };

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
    lat: demoGeo.lat,
    lng: demoGeo.lng,
    locationName: demoGeo.locationName,
  };
}

export function useSongs() {
  const queryClient = useQueryClient();

  const query = useQuery({
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
      return ((data ?? []) as Row[]).map((row, idx) => toSong(row, idx));
    },
    staleTime: 30_000,
  });

  // Supabase Realtime Subscription: Listen for live song additions across all clients!
  useEffect(() => {
    const channel = supabase
      .channel("public:world_locations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "world_locations" },
        (payload) => {
          const newRow = payload.new as Row;
          const newSong = toSong(newRow, Date.now());
          queryClient.setQueryData<SongLocation[]>(["world-locations"], (prev) => {
            if (!prev) return [newSong];
            if (prev.some((s) => s.id === newSong.id)) return prev;
            return [...prev, newSong];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useLeaveSong() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      track: SpotifyTrack;
      position: [number, number, number];
      userId: string;
      lat?: number;
      lng?: number;
      locationName?: string;
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
      const song = toSong(data as Row);
      if (input.lat !== undefined) song.lat = input.lat;
      if (input.lng !== undefined) song.lng = input.lng;
      if (input.locationName) song.locationName = input.locationName;
      return song;
    },
    onSuccess: (song) => {
      queryClient.setQueryData<SongLocation[]>(["world-locations"], (previous) =>
        previous ? [...previous, song] : [song],
      );
    },
  });
}
