'use client';

import { Home } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
  nextUrl?: URL;
}) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-danger/10 border border-danger mb-6 flex items-center justify-center">
          <Home className="size-10 text-danger" />
        </div>
        <h2 className="text-2xl font-bold text-ink mb-2">Something went wrong</h2>
        <p className="text-muted mb-6">An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-surface"
        >
          Reset
        </button>
      </div>
    </div>
  );
}