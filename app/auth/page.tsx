import type { Metadata } from "next";

import { AuthPage } from "@/components/atlas/AuthPage";

export const metadata: Metadata = {
  title: "Sign in — Sound Atlas",
  description: "Sign in to leave a song behind in Sound Atlas, a shared 3D world of music.",
  openGraph: {
    title: "Sign in — Sound Atlas",
    description: "Sign in to leave a song behind.",
  },
};

export default function Auth() {
  return <AuthPage />;
}
