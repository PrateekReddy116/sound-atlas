import type { Metadata } from "next";

import { WorldPage } from "@/components/atlas/WorldPage";

export const metadata: Metadata = {
  title: "Sound Atlas — A world made of music",
  description:
    "Wander a shared 3D world of songs left behind by strangers, listen through Spotify, and leave one of your own.",
  openGraph: {
    title: "Sound Atlas — A world made of music",
    description: "Leave a song behind. Discover one somewhere else.",
  },
};

export default function Home() {
  return <WorldPage />;
}
