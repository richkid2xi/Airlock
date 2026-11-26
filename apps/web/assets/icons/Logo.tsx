import { AirlockMark } from "@/assets/icons/AirlockMark";

export interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <span className={`logo ${className}`}>
      <AirlockMark size={30} />
      {showText && <span className="logo-text">Airlock</span>}
    </span>
  );
}
