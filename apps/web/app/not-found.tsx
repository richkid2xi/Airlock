export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ink">Not Found</h2>
        <p className="text-muted">The page you are looking for does not exist.</p>
        <a href="/app" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-surface">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}