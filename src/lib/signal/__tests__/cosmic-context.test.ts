/**
 * Unit tests for cosmic context calculation.
 */

import { describe, expect, it } from "vitest";
import {
  calculateMoonPhase,
  getMoonPhaseEmoji,
  getMoonPhaseName,
  getPlanetGlyph,
  getSignGlyph,
  getAspectSymbol,
  formatDegree,
  type MoonPhase,
} from "../cosmic-context";

describe("calculateMoonPhase", () => {
  // Test each phase boundary
  const testCases: Array<{ sunLon: number; moonLon: number; expected: MoonPhase; desc: string }> = [
    // New Moon (0° - 22.5° and 337.5° - 360°)
    { sunLon: 0, moonLon: 0, expected: "new_moon", desc: "exact new moon" },
    { sunLon: 0, moonLon: 10, expected: "new_moon", desc: "moon 10° ahead" },
    { sunLon: 0, moonLon: 350, expected: "new_moon", desc: "moon 350° ahead (approaching new moon)" },
    { sunLon: 100, moonLon: 100, expected: "new_moon", desc: "same position at 100°" },

    // Waxing Crescent (22.5° - 67.5°)
    { sunLon: 0, moonLon: 45, expected: "waxing_crescent", desc: "45° ahead - waxing crescent" },
    { sunLon: 0, moonLon: 30, expected: "waxing_crescent", desc: "30° ahead - waxing crescent" },
    { sunLon: 0, moonLon: 60, expected: "waxing_crescent", desc: "60° ahead - waxing crescent" },

    // First Quarter (67.5° - 112.5°)
    { sunLon: 0, moonLon: 90, expected: "first_quarter", desc: "exact first quarter (90°)" },
    { sunLon: 0, moonLon: 70, expected: "first_quarter", desc: "70° ahead" },
    { sunLon: 0, moonLon: 110, expected: "first_quarter", desc: "110° ahead" },

    // Waxing Gibbous (112.5° - 157.5°)
    { sunLon: 0, moonLon: 135, expected: "waxing_gibbous", desc: "135° ahead - waxing gibbous" },
    { sunLon: 0, moonLon: 120, expected: "waxing_gibbous", desc: "120° ahead" },
    { sunLon: 0, moonLon: 150, expected: "waxing_gibbous", desc: "150° ahead" },

    // Full Moon (157.5° - 202.5°)
    { sunLon: 0, moonLon: 180, expected: "full_moon", desc: "exact full moon (180°)" },
    { sunLon: 0, moonLon: 160, expected: "full_moon", desc: "160° ahead" },
    { sunLon: 0, moonLon: 200, expected: "full_moon", desc: "200° ahead" },

    // Waning Gibbous (202.5° - 247.5°)
    { sunLon: 0, moonLon: 225, expected: "waning_gibbous", desc: "225° ahead - waning gibbous" },
    { sunLon: 0, moonLon: 210, expected: "waning_gibbous", desc: "210° ahead" },
    { sunLon: 0, moonLon: 240, expected: "waning_gibbous", desc: "240° ahead" },

    // Last Quarter (247.5° - 292.5°)
    { sunLon: 0, moonLon: 270, expected: "last_quarter", desc: "exact last quarter (270°)" },
    { sunLon: 0, moonLon: 250, expected: "last_quarter", desc: "250° ahead" },
    { sunLon: 0, moonLon: 290, expected: "last_quarter", desc: "290° ahead" },

    // Waning Crescent (292.5° - 337.5°)
    { sunLon: 0, moonLon: 315, expected: "waning_crescent", desc: "315° ahead - waning crescent" },
    { sunLon: 0, moonLon: 300, expected: "waning_crescent", desc: "300° ahead" },
    { sunLon: 0, moonLon: 330, expected: "waning_crescent", desc: "330° ahead" },

    // Test with non-zero sun position
    { sunLon: 120, moonLon: 120, expected: "new_moon", desc: "both at 120°" },
    { sunLon: 120, moonLon: 210, expected: "first_quarter", desc: "sun at 120°, moon at 210° (90° ahead)" },
    { sunLon: 120, moonLon: 300, expected: "full_moon", desc: "sun at 120°, moon at 300° (180° ahead)" },

    // Test wrap-around
    { sunLon: 350, moonLon: 80, expected: "first_quarter", desc: "sun at 350°, moon at 80° (90° ahead with wrap)" },
  ];

  testCases.forEach(({ sunLon, moonLon, expected, desc }) => {
    it(`returns ${expected} for ${desc}`, () => {
      expect(calculateMoonPhase(sunLon, moonLon)).toBe(expected);
    });
  });
});

describe("getMoonPhaseEmoji", () => {
  it("returns correct emoji for each phase", () => {
    expect(getMoonPhaseEmoji("new_moon")).toBe("🌑");
    expect(getMoonPhaseEmoji("waxing_crescent")).toBe("🌒");
    expect(getMoonPhaseEmoji("first_quarter")).toBe("🌓");
    expect(getMoonPhaseEmoji("waxing_gibbous")).toBe("🌔");
    expect(getMoonPhaseEmoji("full_moon")).toBe("🌕");
    expect(getMoonPhaseEmoji("waning_gibbous")).toBe("🌖");
    expect(getMoonPhaseEmoji("last_quarter")).toBe("🌗");
    expect(getMoonPhaseEmoji("waning_crescent")).toBe("🌘");
  });
});

describe("getMoonPhaseName", () => {
  it("returns correct display name for each phase", () => {
    expect(getMoonPhaseName("new_moon")).toBe("New Moon");
    expect(getMoonPhaseName("waxing_crescent")).toBe("Waxing Crescent");
    expect(getMoonPhaseName("first_quarter")).toBe("First Quarter");
    expect(getMoonPhaseName("waxing_gibbous")).toBe("Waxing Gibbous");
    expect(getMoonPhaseName("full_moon")).toBe("Full Moon");
    expect(getMoonPhaseName("waning_gibbous")).toBe("Waning Gibbous");
    expect(getMoonPhaseName("last_quarter")).toBe("Last Quarter");
    expect(getMoonPhaseName("waning_crescent")).toBe("Waning Crescent");
  });
});

describe("getPlanetGlyph", () => {
  it("returns correct glyph for planets", () => {
    expect(getPlanetGlyph("sun")).toBe("☉");
    expect(getPlanetGlyph("moon")).toBe("☽");
    expect(getPlanetGlyph("mercury")).toBe("☿");
    expect(getPlanetGlyph("venus")).toBe("♀");
    expect(getPlanetGlyph("mars")).toBe("♂");
    expect(getPlanetGlyph("jupiter")).toBe("♃");
    expect(getPlanetGlyph("saturn")).toBe("♄");
  });

  it("returns input for unknown planet", () => {
    expect(getPlanetGlyph("unknown")).toBe("unknown");
  });
});

describe("getSignGlyph", () => {
  it("returns correct glyph for zodiac signs", () => {
    expect(getSignGlyph("aries")).toBe("♈");
    expect(getSignGlyph("taurus")).toBe("♉");
    expect(getSignGlyph("gemini")).toBe("♊");
    expect(getSignGlyph("cancer")).toBe("♋");
    expect(getSignGlyph("leo")).toBe("♌");
    expect(getSignGlyph("virgo")).toBe("♍");
    expect(getSignGlyph("libra")).toBe("♎");
    expect(getSignGlyph("scorpio")).toBe("♏");
    expect(getSignGlyph("sagittarius")).toBe("♐");
    expect(getSignGlyph("capricorn")).toBe("♑");
    expect(getSignGlyph("aquarius")).toBe("♒");
    expect(getSignGlyph("pisces")).toBe("♓");
  });
});

describe("getAspectSymbol", () => {
  it("returns correct symbol for major aspects", () => {
    expect(getAspectSymbol("conjunction")).toBe("☌");
    expect(getAspectSymbol("opposition")).toBe("☍");
    expect(getAspectSymbol("trine")).toBe("△");
    expect(getAspectSymbol("square")).toBe("□");
    expect(getAspectSymbol("sextile")).toBe("⚹");
  });
});

describe("formatDegree", () => {
  it("formats whole degrees correctly", () => {
    expect(formatDegree(15)).toBe("15° 0'");
    expect(formatDegree(0)).toBe("0° 0'");
    expect(formatDegree(29)).toBe("29° 0'");
  });

  it("formats degrees with minutes correctly", () => {
    expect(formatDegree(15.5)).toBe("15° 30'");
    expect(formatDegree(22.25)).toBe("22° 15'");
    expect(formatDegree(7.75)).toBe("7° 45'");
  });

  it("rounds minutes correctly", () => {
    expect(formatDegree(10.33)).toBe("10° 20'"); // 0.33 * 60 = 19.8 ≈ 20
    expect(formatDegree(10.67)).toBe("10° 40'"); // 0.67 * 60 = 40.2 ≈ 40
  });
});
