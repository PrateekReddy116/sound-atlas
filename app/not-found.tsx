import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl text-foreground">Nowhere</h1>
        <p className="mt-3 text-sm text-muted-foreground">There is no world at this address.</p>
        <div className="mt-6">
          <Link
            href="/"
            className="text-whisper border-b border-border pb-1 hover:text-foreground"
          >
            Return to the world
          </Link>
        </div>
      </div>
    </div>
  );
}
