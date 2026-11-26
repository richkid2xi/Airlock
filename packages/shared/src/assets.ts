export const FUNDING_ASSET = "USDC";
export const GAS_ASSET = "SOL";

export function formatUsdc(value: number): string {
  const num = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num) + " USDC";
}

export function formatCompactUsdc(value: number): string {
  if (!Number.isFinite(value)) {
    return "0.00 USDC";
  }
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value) + " USDC";
}