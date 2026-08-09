export type SongLocation = {
  id: string;
  spotifyTrackId: string;
  title: string;
  artist: string;
  album: string | null;
  artworkUrl: string | null;
  position: [number, number, number];
  rotationY: number;
  scale: number;
  isDemo: boolean;
  createdBy: string | null;
  createdAt: string;
  username: string | null;
  // Geographic Location Data for 2D Map
  lat?: number;
  lng?: number;
  locationName?: string;
};

export type SpotifyTrack = {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  artworkUrl: string | null;
  lat?: number;
  lng?: number;
  locationName?: string;
};
