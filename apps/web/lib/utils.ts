import { formatUsdc, formatCompactUsdc } from "@airlock/shared";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
  return formatUsdc(value);
}

export function formatRelativeTime(value: string) {
  const seconds = Math.max(0, Math.round((Date.now() - Date.parse(value)) / 1000));
  if (seconds < 45) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function truncateAddress(value: string, start = 6, end = 5) {
  return `${value.slice(0, start)}…${value.slice(-end)}`;
}

export { formatUsdc, formatCompactUsdc };