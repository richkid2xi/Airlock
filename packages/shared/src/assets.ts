export const FUNDING_ASSET = "USDC";
export const GAS_ASSET = "SOL";

export function formatUsdc(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USDC",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactUsdc(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USDC",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}