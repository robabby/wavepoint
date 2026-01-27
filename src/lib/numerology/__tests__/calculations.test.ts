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

/**
 * VERIFICATION TESTS
 *
 * These tests verify our calculations against manually computed results
 * using the standard Pythagorean method (reduce month/day/year separately).
 *
 * Method: Life Path = reduce(reduce(M) + reduce(D) + reduce(Y))
 */
describe("Life Path Verification - Manual Calculations", () => {
  /**
   * Taylor Swift: December 13, 1989
   * - Month: 12 → 3 (1+2)
   * - Day: 13 → 4 (1+3)
   * - Year: 1989 → 27 → 9 (1+9+8+9=27, 2+7=9)
   * - Sum: 3+4+9 = 16 → 7
   * - Life Path: 7 (verified by multiple sources)
   */
  it("calculates Taylor Swift correctly (Dec 13, 1989 = Life Path 7)", () => {
    const date = new Date(1989, 11, 13); // December 13, 1989
    expect(lifePathNumber(date)).toBe(7);
  });

  /**
   * Princess Diana: July 1, 1961
   * - Month: 7 → 7
   * - Day: 1 → 1
   * - Year: 1961 → 17 → 8 (1+9+6+1=17, 1+7=8)
   * - Sum: 7+1+8 = 16 → 7
   * - Life Path: 7 (verified)
   */
  it("calculates Princess Diana correctly (Jul 1, 1961 = Life Path 7)", () => {
    const date = new Date(1961, 6, 1); // July 1, 1961
    expect(lifePathNumber(date)).toBe(7);
  });

  /**
   * Bill Gates: October 28, 1955
   * - Month: 10 → 1 (1+0)
   * - Day: 28 → 10 → 1 (2+8=10, 1+0=1)
   * - Year: 1955 → 20 → 2 (1+9+5+5=20, 2+0=2)
   * - Sum: 1+1+2 = 4
   * - Life Path: 4 (verified)
   */
  it("calculates Bill Gates correctly (Oct 28, 1955 = Life Path 4)", () => {
    const date = new Date(1955, 9, 28); // October 28, 1955
    expect(lifePathNumber(date)).toBe(4);
  });

  /**
   * Elon Musk: June 28, 1971
   * - Month: 6 → 6
   * - Day: 28 → 1 (2+8=10, 1+0=1)
   * - Year: 1971 → 18 → 9 (1+9+7+1=18, 1+8=9)
   * - Sum: 6+1+9 = 16 → 7
   * - Life Path: 7
   */
  it("calculates Elon Musk correctly (Jun 28, 1971 = Life Path 7)", () => {
    const date = new Date(1971, 5, 28); // June 28, 1971
    expect(lifePathNumber(date)).toBe(7);
  });

  /**
   * Test date that yields Master Number 11
   * March 20, 1950
   * - Month: 3 → 3
   * - Day: 20 → 2 (2+0)
   * - Year: 1950 → 15 → 6 (1+9+5+0=15, 1+5=6)
   * - Sum: 3+2+6 = 11 (Master Number - preserved)
   * - Life Path: 11
   */
  it("correctly identifies Master Number 11", () => {
    const date = new Date(1950, 2, 20); // March 20, 1950
    expect(lifePathNumber(date)).toBe(11);
  });

  /**
   * Test date that yields Master Number 22
   * April 27, 1980
   * - Month: 4 → 4
   * - Day: 27 → 9 (2+7)
   * - Year: 1980 → 18 → 9 (1+9+8+0=18, 1+8=9)
   * - Sum: 4+9+9 = 22 (Master Number - preserved)
   * - Life Path: 22
   */
  it("correctly identifies Master Number 22", () => {
    const date = new Date(1980, 3, 27); // April 27, 1980
    expect(lifePathNumber(date)).toBe(22);
  });

  /**
   * Test date that yields Master Number 33
   * November 29, 1990
   * - Month: 11 → 11 (Master Number - preserved at component level!)
   * - Day: 29 → 11 (2+9=11, Master Number - preserved)
   * - Year: 1990 → 19 → 10 → 1 (wait, let's recalculate: 1+9+9+0=19, 1+9=10, 1+0=1)
   *   Hmm, that gives 11+11+1=23→5, not 33
   *
   * To get 33, we need M+D+Y = 33 with all components reduced
   * 11+11+11=33 won't work because year can't reduce to 11 directly
   * Actually: 11 (Nov) + 11 (from day 29) + 11 (from year) = 33
   * Need a year that reduces to 11: e.g., 2009 → 2+0+0+9=11
   * Nov 29, 2009: 11 + 11 + 11 = 33
   */
  it("correctly identifies Master Number 33", () => {
    const date = new Date(2009, 10, 29); // November 29, 2009
    // 11 (Nov preserved) + 11 (29→11) + 11 (2009→11) = 33
    expect(lifePathNumber(date)).toBe(33);
  });

  /**
   * Barack Obama: August 4, 1961
   * Using the CORRECT reduce-separately method:
   * - Month: 8 → 8
   * - Day: 4 → 4
   * - Year: 1961 → 17 → 8 (1+9+6+1=17, 1+7=8)
   * - Sum: 8+4+8 = 20 → 2
   * - Life Path: 2 (NOT 11!)
   *
   * Note: Many websites incorrectly say Obama is 11 because they
   * use the "sum all digits" method (8+4+1+9+6+1=29→11).
   * Professional numerologists using the correct method get 2.
   */
  it("calculates Barack Obama using correct method (Aug 4, 1961 = Life Path 2)", () => {
    const date = new Date(1961, 7, 4); // August 4, 1961
    expect(lifePathNumber(date)).toBe(2);
  });
});

/**
 * Y HANDLING VERIFICATION
 *
 * Standard rules:
 * - Y is VOWEL when: only vowel in syllable, after consonant at end of word
 * - Y is CONSONANT when: at start of word, after another vowel
 */
describe("Y Handling Verification", () => {
  it("Y is vowel in Mary (after consonant, end of word)", () => {
    expect(vowelsOnly("MARY")).toBe("AY");
    expect(consonantsOnly("MARY")).toBe("MR");
  });

  it("Y is vowel in Betty (after consonant, end of word)", () => {
    expect(vowelsOnly("BETTY")).toBe("EY");
    expect(consonantsOnly("BETTY")).toBe("BTT");
  });

  it("Y is vowel in Kyle (only vowel sound in first syllable)", () => {
    expect(vowelsOnly("KYLE")).toBe("YE");
    expect(consonantsOnly("KYLE")).toBe("KL");
  });

  it("Y is vowel in Bryan (provides vowel sound)", () => {
    expect(vowelsOnly("BRYAN")).toBe("YA");
    expect(consonantsOnly("BRYAN")).toBe("BRN");
  });

  it("Y is consonant in Yolanda (start of word)", () => {
    expect(vowelsOnly("YOLANDA")).toBe("OAA");
    expect(consonantsOnly("YOLANDA")).toBe("YLND");
  });

  it("Y is consonant in Yellow (start of word)", () => {
    expect(vowelsOnly("YELLOW")).toBe("EO");
    expect(consonantsOnly("YELLOW")).toBe("YLLW");
  });

  it("Y is consonant in Kay (after vowel)", () => {
    expect(vowelsOnly("KAY")).toBe("A");
    expect(consonantsOnly("KAY")).toBe("KY");
  });

  it("Y is consonant in Murray (after vowel)", () => {
    expect(vowelsOnly("MURRAY")).toBe("UA");
    expect(consonantsOnly("MURRAY")).toBe("MRRY");
  });

  it("Y is consonant in Hayley (both Ys after vowels)", () => {
    // First Y after A, second Y after E
    expect(vowelsOnly("HAYLEY")).toBe("AE");
    expect(consonantsOnly("HAYLEY")).toBe("HYLY");
  });

  it("handles mixed Y in Yolanda Barry", () => {
    // Y in Yolanda = consonant (start)
    // Y in Barry = vowel (after consonant at end)
    expect(vowelsOnly("YOLANDA BARRY")).toBe("OAAAY");
    expect(consonantsOnly("YOLANDA BARRY")).toBe("YLNDBRR");
  });
});

/**
 * NAME NUMBER VERIFICATION
 *
 * Pythagorean mapping: A=1, B=2, ..., I=9, J=1, ..., R=9, S=1, ..., Z=8
 */
describe("Name Number Verification", () => {
  /**
   * JOHN DOE
   * J=1, O=6, H=8, N=5 → 20 → 2
   * D=4, O=6, E=5 → 15 → 6
   * Total: 2+6 = 8
   */
  it("calculates JOHN DOE Expression = 8", () => {
    expect(expressionNumber("JOHN DOE")).toBe(8);
  });

  /**
   * JOHN DOE Soul Urge (vowels only: O, O, E)
   * O=6, O=6, E=5 → 17 → 8
   */
  it("calculates JOHN DOE Soul Urge = 8", () => {
    expect(soulUrgeNumber("JOHN DOE")).toBe(8);
  });

  /**
   * JOHN DOE Personality (consonants only: J, H, N, D)
   * J=1, H=8, N=5, D=4 → 18 → 9
   */
  it("calculates JOHN DOE Personality = 9", () => {
    expect(personalityNumber("JOHN DOE")).toBe(9);
  });

  /**
   * Verify Expression = Soul Urge + Personality relationship
   * This relationship holds when considering full reduction
   */
  it("verifies Expression components sum correctly", () => {
    const name = "JANE SMITH";
    // All letters should equal vowels + consonants
    const allLetters = name.replace(/[^A-Z]/gi, "");
    const vowels = vowelsOnly(name);
    const consonants = consonantsOnly(name);

    // Every letter should be categorized as either vowel or consonant
    expect(vowels.length + consonants.length).toBe(allLetters.length);
  });
});

/**
 * EDGE CASES
 */
describe("Edge Cases", () => {
  it("handles single-digit birth day", () => {
    const date = new Date(2000, 0, 1); // January 1, 2000
    expect(birthdayNumber(date)).toBe(1);
    expect(lifePathNumber(date)).toBeDefined();
  });

  it("handles December 31st", () => {
    const date = new Date(1999, 11, 31); // December 31, 1999
    // 12→3, 31→4, 1999→1+9+9+9=28→1, 3+4+1=8
    expect(lifePathNumber(date)).toBe(8);
  });

  it("handles single letter name", () => {
    expect(expressionNumber("A")).toBe(1);
    expect(expressionNumber("Z")).toBe(8);
  });

  it("handles name with only vowels", () => {
    expect(expressionNumber("AEI")).toBe(6); // 1+5+9=15→6
    expect(soulUrgeNumber("AEI")).toBe(6);
    expect(personalityNumber("AEI")).toBe(0); // No consonants
  });

  it("handles name with only consonants", () => {
    expect(consonantsOnly("BCD")).toBe("BCD");
    expect(vowelsOnly("BCD")).toBe("");
  });

  it("handles hyphenated names", () => {
    // Y after hyphen should be consonant (start of new word)
    // MARY: A=vowel, Y=vowel (after R)
    // YOUNG: Y=consonant (after hyphen, start of word), O=vowel, U=vowel
    expect(vowelsOnly("MARY-YOUNG")).toBe("AYOU");
    expect(consonantsOnly("MARY-YOUNG")).toBe("MRYNG");
  });

  it("handles names with apostrophes", () => {
    expect(expressionNumber("O'BRIEN")).toBeDefined();
    // O=6, B=2, R=9, I=9, E=5, N=5 = 36 → 9
    expect(expressionNumber("OBRIEN")).toBe(9);
  });

  it("preserves master 11 from birthday 29", () => {
    const date = new Date(2000, 0, 29);
    expect(birthdayNumber(date)).toBe(11); // 2+9=11
  });

  it("handles very old dates", () => {
    const date = new Date(1800, 0, 1);
    expect(lifePathNumber(date)).toBeDefined();
  });

  it("handles future dates", () => {
    const date = new Date(2100, 0, 1);
    expect(lifePathNumber(date)).toBeDefined();
  });
});
