export function AirlockMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="8" fill="#3B82F6" />
      <circle cx="16" cy="16" r="8" stroke="#FFFFFF" strokeWidth="2.5" />
      <path d="M5 16H11M21 16H27" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
