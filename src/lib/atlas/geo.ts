export interface Landmark {
  name: string;
  country?: string;
  lat: number;
  lng: number;
  isRegion?: boolean;
}

export const GLOBAL_LANDMARKS: Landmark[] = [
  { name: "NORTH AMERICA", lat: 40, lng: -100, isRegion: true },
  { name: "SOUTH AMERICA", lat: -15, lng: -60, isRegion: true },
  { name: "EUROPE", lat: 50, lng: 15, isRegion: true },
  { name: "ASIA", lat: 35, lng: 95, isRegion: true },
  { name: "AFRICA", lat: 0, lng: 20, isRegion: true },
  { name: "OCEANIA", lat: -25, lng: 135, isRegion: true },

  // Landmark Cities
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { name: "Reykjavik", country: "Iceland", lat: 64.1466, lng: -21.9426 },
  { name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
  { name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780 },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 }
];

export function latLngTo3D(lat: number, lng: number, zOffset = 0) {
  const x = lng * 20;
  const y = -lat * 20;
  const z = zOffset;
  return { x, y, z };
}

export function latLngToSvg(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 7200;
  const y = ((90 - lat) / 180) * 3600;
  return { x, y };
}
