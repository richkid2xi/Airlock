'use client';

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ink mb-2">Something went wrong</h2>
        <p className="text-muted mb-6">An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-surface"
        >
          Reload
        </button>
      </div>
    </div>
  );
}