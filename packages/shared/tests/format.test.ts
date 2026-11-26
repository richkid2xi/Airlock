import { describe, it, expect } from "vitest";
import { formatUsdc, formatCompactUsdc } from "@airlock/shared";

describe("formatUsdc", () => {
  it("formats zero as 0.00 USDC", () => {
    expect(formatUsdc(0)).toBe("0.00 USDC");
  });

  it("formats 1250.5 as 1,250.50 USDC", () => {
    expect(formatUsdc(1250.5)).toBe("1,250.50 USDC");
  });

  it("formats 21630 as 21,630.00 USDC", () => {
    expect(formatUsdc(21630)).toBe("21,630.00 USDC");
  });

  it("negative value does not throw", () => {
    expect(formatUsdc(-100)).toBe("-100.00 USDC");
  });

  it("NaN does not throw and renders 0.00 USDC", () => {
    expect(formatUsdc(NaN)).toBe("0.00 USDC");
  });
});

describe("formatCompactUsdc", () => {
  it("formats 1250000 as 1.3M USDC", () => {
    expect(formatCompactUsdc(1250000)).toBe("1.3M USDC");
  });

  it("negative value does not throw", () => {
    expect(formatCompactUsdc(-5000)).toBe("-5K USDC");
  });

  it("NaN does not throw and renders 0.00 USDC", () => {
    expect(formatCompactUsdc(NaN)).toBe("0.00 USDC");
  });
});