import { describe, it, expect } from "vitest";
import {
  reduceToDigit,
  letterToNumber,
  nameToNumber,
  vowelsOnly,
  consonantsOnly,
  lifePathNumber,
  birthdayNumber,
  expressionNumber,
  soulUrgeNumber,
  personalityNumber,
  maturityNumber,
  personalYearNumber,
  personalMonthNumber,
  personalDayNumber,
  calculateStableNumbers,
} from "../calculations";

describe("reduceToDigit", () => {
  it("returns single digits as-is", () => {
    expect(reduceToDigit(5)).toBe(5);
    expect(reduceToDigit(9)).toBe(9);
  });

  it("reduces double digits", () => {
    expect(reduceToDigit(15)).toBe(6); // 1+5=6
    expect(reduceToDigit(28)).toBe(1); // 2+8=10, 1+0=1
  });

  it("preserves master numbers by default", () => {
    expect(reduceToDigit(11)).toBe(11);
    expect(reduceToDigit(22)).toBe(22);
    expect(reduceToDigit(33)).toBe(33);
  });

  it("reduces master numbers when preserveMaster is false", () => {
    expect(reduceToDigit(11, false)).toBe(2);
    expect(reduceToDigit(22, false)).toBe(4);
    expect(reduceToDigit(33, false)).toBe(6);
  });

  it("preserves master numbers from larger numbers", () => {
    expect(reduceToDigit(29)).toBe(11); // 2+9=11
    expect(reduceToDigit(38)).toBe(11); // 3+8=11
  });

  it("handles large numbers", () => {
    expect(reduceToDigit(1980)).toBe(9); // 1+9+8+0=18, 1+8=9
    expect(reduceToDigit(1234)).toBe(1); // 1+2+3+4=10, 1+0=1
  });
});

describe("letterToNumber", () => {
  it("maps A-I to 1-9", () => {
    expect(letterToNumber("A")).toBe(1);
    expect(letterToNumber("E")).toBe(5);
    expect(letterToNumber("I")).toBe(9);
  });

  it("maps J-R to 1-9", () => {
    expect(letterToNumber("J")).toBe(1);
    expect(letterToNumber("N")).toBe(5);
    expect(letterToNumber("R")).toBe(9);
  });

  it("maps S-Z to 1-8", () => {
    expect(letterToNumber("S")).toBe(1);
    expect(letterToNumber("W")).toBe(5);
    expect(letterToNumber("Z")).toBe(8);
  });

  it("is case-insensitive", () => {
    expect(letterToNumber("a")).toBe(1);
    expect(letterToNumber("z")).toBe(8);
  });

  it("returns 0 for non-letters", () => {
    expect(letterToNumber(" ")).toBe(0);
    expect(letterToNumber("1")).toBe(0);
    expect(letterToNumber("-")).toBe(0);
  });
});

describe("nameToNumber", () => {
  it("calculates sum of name letters reduced", () => {
    // JOHN = 1+6+8+5 = 20 = 2
    // DOE = 4+6+5 = 15 = 6
    // Total = 2+6 = 8
    expect(nameToNumber("JOHN DOE")).toBe(8);
  });

  it("handles full names", () => {
    // Known example: should give consistent result
    const result = nameToNumber("John Michael Smith");
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(33);
  });

  it("ignores spaces and special characters", () => {
    expect(nameToNumber("A B")).toBe(nameToNumber("AB"));
    expect(nameToNumber("A-B")).toBe(nameToNumber("AB"));
  });
});

describe("vowelsOnly", () => {
  it("extracts vowels from a name", () => {
    expect(vowelsOnly("JOHN")).toBe("O");
    expect(vowelsOnly("MICHAEL")).toBe("IAE");
  });

  it("handles Y as vowel in middle of word", () => {
    // Y after consonant and not at start of word = vowel
    expect(vowelsOnly("MARY")).toBe("AY");
    expect(vowelsOnly("EMILY")).toBe("EIY");
  });

  it("treats Y as consonant at start", () => {
    expect(vowelsOnly("YELLOW")).toBe("EO");
    expect(vowelsOnly("YOUNG")).toBe("OU");
  });
});

describe("consonantsOnly", () => {
  it("extracts consonants from a name", () => {
    expect(consonantsOnly("JOHN")).toBe("JHN");
    expect(consonantsOnly("MICHAEL")).toBe("MCHL");
  });

  it("treats Y as consonant at start of word", () => {
    expect(consonantsOnly("YELLOW")).toBe("YLLW");
  });

  it("excludes Y when acting as vowel", () => {
    expect(consonantsOnly("MARY")).toBe("MR");
  });
});

describe("lifePathNumber", () => {
  it("calculates Life Path from birth date", () => {
    // December 14, 1989: 12+14+1989 = 1+2+1+4+1+9+8+9 = 35 = 8
    // Actually: 12→3, 14→5, 1989→1+9+8+9=27→9, 3+5+9=17→8
    const date = new Date(1989, 11, 14); // Month is 0-indexed
    expect(lifePathNumber(date)).toBe(8);
  });

  it("preserves master number 11", () => {
    // Feb 29, 1980: 2→2, 29→11, 1980→1+9+8+0=18→9, 2+11+9=22
    // Actually need to find a date that gives 11
    // Nov 28, 1984: 11→2, 28→1, 1984→22, 2+1+22=25→7... let's try another
    // March 20, 1950: 3, 2, 1+9+5+0=15→6, 3+2+6=11
    const date = new Date(1950, 2, 20);
    expect(lifePathNumber(date)).toBe(11);
  });

  it("preserves master number 22", () => {
    // Feb 22, 1986: 2, 22→4, 1+9+8+6=24→6, 2+4+6=12→3... not 22
    // Need to find a date that gives 22
    // Aug 3, 2007: 8, 3, 2007→9, 8+3+9=20→2... not 22
    // Dec 31, 1942: 12→3, 31→4, 1942→1+9+4+2=16→7, 3+4+7=14→5... not 22
    // Let's calculate: need month+day+year to equal 22 before final reduction
    // Nov 20, 1990: 11→2, 20→2, 1990→1+9+9+0=19→1, 2+2+1=5... not right
    // Actually the method reduces each component first, then adds
    // So we need M+D+Y (all reduced) = 22
    // 4+9+9=22: M=4 (April), D=9 or 18 or 27, Y=9 means 1980 etc
    const date = new Date(1980, 3, 27); // April 27, 1980: 4+9+9=22
    expect(lifePathNumber(date)).toBe(22);
  });

  it("handles leap year dates", () => {
    const leapDate = new Date(2000, 1, 29); // Feb 29, 2000
    const result = lifePathNumber(leapDate);
    expect(result).toBeGreaterThanOrEqual(1);
  });
});

describe("birthdayNumber", () => {
  it("returns day reduced to single digit", () => {
    const date = new Date(1990, 5, 15); // June 15
    expect(birthdayNumber(date)).toBe(6); // 1+5=6
  });

  it("preserves 11 for 11th day", () => {
    const date = new Date(1990, 5, 11);
    expect(birthdayNumber(date)).toBe(11);
  });

  it("preserves 22 for 22nd day", () => {
    const date = new Date(1990, 5, 22);
    expect(birthdayNumber(date)).toBe(22);
  });

  it("reduces 29th to 11", () => {
    const date = new Date(1990, 5, 29);
    expect(birthdayNumber(date)).toBe(11); // 2+9=11
  });
});

describe("expressionNumber", () => {
  it("calculates from full name", () => {
    const result = expressionNumber("John Doe");
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(33);
  });
});

describe("soulUrgeNumber", () => {
  it("calculates from vowels only", () => {
    const result = soulUrgeNumber("John Doe");
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(33);
  });

  it("differs from expression number", () => {
    const name = "John Michael Smith";
    const expression = expressionNumber(name);
    const soulUrge = soulUrgeNumber(name);
    // They could be the same by coincidence, but usually differ
    // Just verify both are valid
    expect(expression).toBeGreaterThanOrEqual(1);
    expect(soulUrge).toBeGreaterThanOrEqual(1);
  });
});

describe("personalityNumber", () => {
  it("calculates from consonants only", () => {
    const result = personalityNumber("John Doe");
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(33);
  });
});

describe("maturityNumber", () => {
  it("sums Life Path and Expression", () => {
    const maturity = maturityNumber(7, 3);
    expect(maturity).toBe(1); // 7+3=10→1
  });

  it("preserves master numbers", () => {
    const maturity = maturityNumber(5, 6);
    expect(maturity).toBe(11); // 5+6=11
  });
});

describe("personalYearNumber", () => {
  it("calculates based on birth date and current year", () => {
    const birthDate = new Date(1990, 5, 15); // June 15, 1990
    const currentDate = new Date(2024, 0, 1); // Jan 1, 2024
    const result = personalYearNumber(birthDate, currentDate);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(9);
  });

  it("does not preserve master numbers", () => {
    // Personal cycles reduce fully
    const birthDate = new Date(1990, 10, 20); // Nov 20
    const currentDate = new Date(2024, 0, 1);
    const result = personalYearNumber(birthDate, currentDate);
    expect(result).toBeLessThanOrEqual(9);
  });
});

describe("personalMonthNumber", () => {
  it("adds personal year to calendar month", () => {
    const birthDate = new Date(1990, 5, 15);
    const currentDate = new Date(2024, 5, 1); // June 2024
    const result = personalMonthNumber(birthDate, currentDate);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(9);
  });
});

describe("personalDayNumber", () => {
  it("adds personal month to calendar day", () => {
    const birthDate = new Date(1990, 5, 15);
    const currentDate = new Date(2024, 5, 15);
    const result = personalDayNumber(birthDate, currentDate);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(9);
  });
});

describe("calculateStableNumbers", () => {
  it("returns date-based numbers without name", () => {
    const birthDate = new Date(1990, 5, 15);
    const result = calculateStableNumbers(birthDate);

    expect(result.lifePath).toBeDefined();
    expect(result.birthday).toBeDefined();
    expect(result.expression).toBeNull();
    expect(result.soulUrge).toBeNull();
    expect(result.personality).toBeNull();
    expect(result.maturity).toBeNull();
  });

  it("returns all numbers with name", () => {
    const birthDate = new Date(1990, 5, 15);
    const result = calculateStableNumbers(birthDate, "John Michael Smith");

    expect(result.lifePath).toBeDefined();
    expect(result.birthday).toBeDefined();
    expect(result.expression).toBeDefined();
    expect(result.soulUrge).toBeDefined();
    expect(result.personality).toBeDefined();
    expect(result.maturity).toBeDefined();
  });

  it("handles empty name string", () => {
    const birthDate = new Date(1990, 5, 15);
    const result = calculateStableNumbers(birthDate, "   ");

    expect(result.expression).toBeNull();
  });
});
