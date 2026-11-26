'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>An unexpected error occurred. Please try again.</p>
          <button
            onClick={reset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              background: '#168cff',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </body>
    </html>
  );
}