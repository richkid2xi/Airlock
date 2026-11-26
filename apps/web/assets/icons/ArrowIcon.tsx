export interface IconProps {
  className?: string;
}

export function ArrowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={`arrow-icon ${className}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10h13M11.5 5.5 16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
