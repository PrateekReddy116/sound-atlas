"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/lib/atlas/brand";
import { useSession } from "@/hooks/useSession";

export function AuthPage() {
  const router = useRouter();
  const { user, ready } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/");
  }, [ready, user, router]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          toast(
            "Account created! Check your email to confirm, or sign in if confirmation is disabled.",
          );
          setMode("signin");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.replace("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="glass w-full max-w-sm rounded-2xl border border-white/20 p-7 shadow-2xl">
        <p className="text-whisper">{BRAND.name}</p>
        <h1 className="mt-3 font-serif text-3xl leading-snug">
          {mode === "signin" ? "Sign in to leave a song" : "Create your account"}
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Wandering never needs an account — only leaving a song does.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-whisper">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-whisper">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-whisper transition-colors hover:text-foreground"
          >
            {mode === "signin" ? "Create an account" : "I already have an account"}
          </button>
          <Link href="/" className="text-whisper transition-colors hover:text-foreground">
            Back to the world
          </Link>
        </div>
      </div>
    </main>
  );
}
