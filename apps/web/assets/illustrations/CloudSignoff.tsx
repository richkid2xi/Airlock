export function CloudSignoff({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Soft atmospheric cloud & cyber nebula gradients */}
        <radialGradient id="cloud-glow-1" cx="25%" cy="80%" r="55%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.18)" />
          <stop offset="50%" stopColor="rgba(14, 165, 233, 0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="cloud-glow-2" cx="75%" cy="75%" r="60%">
          <stop offset="0%" stopColor="rgba(34, 211, 238, 0.15)" />
          <stop offset="50%" stopColor="rgba(59, 130, 246, 0.06)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="cloud-mist-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="60%" stopColor="rgba(248, 250, 252, 0.6)" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>
      </defs>

      {/* Ambient cloud orbs */}
      <rect x="0" y="0" width="1440" height="220" fill="url(#cloud-glow-1)" />
      <rect x="0" y="0" width="1440" height="220" fill="url(#cloud-glow-2)" />

      {/* Flowing atmospheric cloud vapor waves */}
      <path
        d="M0,120 C240,70 480,160 720,100 C960,40 1200,130 1440,90 L1440,220 L0,220 Z"
        fill="rgba(59, 130, 246, 0.05)"
      />
      <path
        d="M0,150 C300,110 600,180 900,130 C1140,90 1320,160 1440,140 L1440,220 L0,220 Z"
        fill="rgba(34, 211, 238, 0.06)"
      />
      <path
        d="M0,175 C360,140 720,200 1080,165 C1260,150 1380,180 1440,170 L1440,220 L0,220 Z"
        fill="url(#cloud-mist-base)"
      />
    </svg>
  );
}
