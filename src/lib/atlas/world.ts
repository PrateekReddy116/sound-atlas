import type { SongLocation } from "./types";

/** Rough radius of the inhabited part of the world. */
export const WORLD_RADIUS = 130;

const MIN_SPACING = 7;

function distance(a: [number, number, number], b: [number, number, number]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/**
 * Finds a visually pleasing spot near an origin that doesn't crowd existing songs.
 */
export function findOpenSpot(
  origin: [number, number, number],
  songs: SongLocation[],
  radius = 16,
): [number, number, number] {
  for (let attempt = 0; attempt < 60; attempt++) {
    const angle = Math.random() * Math.PI * 2;
    const spread = radius * (0.35 + Math.random() * 0.9) * (1 + attempt / 40);
    const candidate: [number, number, number] = [
      origin[0] + Math.cos(angle) * spread,
      origin[1] + (Math.random() - 0.45) * 6,
      origin[2] + Math.sin(angle) * spread,
    ];
    const crowded = songs.some((song) => distance(song.position, candidate) < MIN_SPACING);
    if (!crowded) return candidate;
  }
  return [origin[0] + radius, origin[1], origin[2] + radius];
}

export function isCrowded(
  candidate: [number, number, number],
  songs: SongLocation[],
  ignoreId?: string,
) {
  return songs.some(
    (song) => song.id !== ignoreId && distance(song.position, candidate) < MIN_SPACING,
  );
}

/**
 * The discovery engine. MVP: a random song that isn't where we already are.
 * Weighting hooks live here so smarter discovery can replace the strategy later.
 */
export function pickDiscovery(songs: SongLocation[], currentId?: string | null) {
  const pool = songs.filter((song) => song.id !== currentId);
  if (pool.length === 0) return null;
  const now = Date.now();
  const weights = pool.map((song) => {
    const ageDays = (now - new Date(song.createdAt).getTime()) / 86_400_000;
    const freshness = ageDays < 7 ? 1.6 : 1;
    const human = song.isDemo ? 0.85 : 1.35;
    return freshness * human;
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = Math.random() * total;
  for (let index = 0; index < pool.length; index++) {
    roll -= weights[index]!;
    if (roll <= 0) return pool[index]!;
  }
  return pool[pool.length - 1]!;
}

export function timeAgo(iso: string) {
  const seconds = Math.max(1, (Date.now() - new Date(iso).getTime()) / 1000);
  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
  ];
  let value = seconds;
  let label = "second";
  for (const [step, name] of units) {
    if (value < step) {
      label = name;
      break;
    }
    value /= step;
    label = name;
  }
  const rounded = Math.floor(value);
  return `${rounded} ${label}${rounded === 1 ? "" : "s"} ago`;
}
