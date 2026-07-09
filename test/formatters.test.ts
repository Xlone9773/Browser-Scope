import { describe, it, expect } from "vitest";
import {
  formatBytes,
  formatSpeed,
  formatHertz,
  formatNumber,
  formatPercent,
  formatList,
  generateFilenameTimestamp,
} from "../utils/formatters";

describe("formatters utility tests", () => {
  describe("formatBytes", () => {
    it("should format 0 B correctly", () => {
      expect(formatBytes(0)).toBe("0 B");
    });

    it("should handle NaN gracefully", () => {
      expect(formatBytes(NaN)).toBe("Unknown");
    });

    it("should format standard KB correctly", () => {
      expect(formatBytes(1024, "en")).toContain("1 kB");
    });

    it("should format standard MB correctly", () => {
      expect(formatBytes(1024 * 1024, "en")).toContain("1 MB");
    });

    it("should format standard GB correctly", () => {
      expect(formatBytes(1024 * 1024 * 1024, "en")).toContain("1 GB");
    });

    it("should fallback for very large numbers safely", () => {
      const hugeBytes = 1024 * 1024 * 1024 * 1024 * 1024 * 5;
      expect(formatBytes(hugeBytes, "en")).toContain("5 PB");
    });
  });

  describe("formatSpeed", () => {
    it("should handle NaN or 0", () => {
      expect(formatSpeed(0)).toBe("Unknown");
      expect(formatSpeed(NaN)).toBe("Unknown");
    });

    it("should format speed in Mbps correctly", () => {
      const result = formatSpeed(125.5, "en");
      expect(result).toMatch(/125\.5/);
    });
  });

  describe("formatHertz", () => {
    it("should handle NaN", () => {
      expect(formatHertz(NaN)).toBe("Unknown");
    });

    it("should format hertz values correctly", () => {
      const result = formatHertz(60, "en");
      expect(result).toMatch(/60/);
    });
  });

  describe("formatNumber", () => {
    it("should format with default options", () => {
      expect(formatNumber(12345.678, 2, 2, "en")).toBe("12,345.68");
    });

    it("should handle NaN by returning '0'", () => {
      expect(formatNumber(NaN)).toBe("0");
    });
  });

  describe("formatPercent", () => {
    it("should format fractions as percentages", () => {
      expect(formatPercent(0.854, 1, "en")).toBe("85.4%");
    });

    it("should handle NaN by returning '0%'", () => {
      expect(formatPercent(NaN)).toBe("0%");
    });
  });

  describe("formatList", () => {
    it("should return empty string for empty lists", () => {
      expect(formatList([])).toBe("");
    });

    it("should format array items into a localized string", () => {
      expect(formatList(["A", "B", "C"], "conjunction", "en")).toBe("A, B, and C");
    });
  });

  describe("generateFilenameTimestamp", () => {
    it("should return a correctly-formatted timestamp string", () => {
      const ts = generateFilenameTimestamp();
      // Format: YYYY-MM-DD-HH-MM
      expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/);
    });
  });
});
