/**
 * Surprise & Delight detection for Signal.
 *
 * Micro-moments computed at capture time to celebrate special occasions.
 */

import type { MoodOption } from "./schemas";

/**
 * Delight moment types
 */
export type DelightType =
  | "time_alignment"
  | "milestone"
  | "anniversary"
  | "pattern_echo"
  | "lucky_timing";

/**
 * A delight moment to celebrate
 */
export interface DelightMoment {
  type: DelightType;
  title: string;
  message: string;
  icon: string;
}

/**
 * Context needed to detect delight moments
 */
export interface DelightContext {
  /** The number just logged */
  number: string;
  /** Current timestamp */
  timestamp: Date;
  /** Mood tags for this sighting */
  moodTags?: MoodOption[];
  /** Total sightings count after this one */
  totalSightings: number;
  /** First sighting date for this user */
  firstSightingDate: Date | null;
  /** Historical sightings for pattern echo detection */
  historicalSightings?: Array<{
    number: string;
    moodTags: MoodOption[] | null;
    timestamp: Date;
  }>;
}

/**
 * Detect delight moments based on sighting context.
 *
 * Returns at most one delight moment (the most special one).
 * Priority: anniversary > milestone > time_alignment > lucky_timing > pattern_echo
 *
 * @param context - The sighting context
 * @returns A delight moment or null if none applies
 */
export function detectDelight(context: DelightContext): DelightMoment | null {
  const { number, timestamp, totalSightings, firstSightingDate } = context;

  // Check for anniversary (1 year since first sighting)
  if (firstSightingDate) {
    const anniversary = checkAnniversary(firstSightingDate, timestamp);
    if (anniversary) return anniversary;
  }

  // Check for milestone (10th, 50th, 100th, etc.)
  const milestone = checkMilestone(totalSightings);
  if (milestone) return milestone;

  // Check for time alignment (e.g., 333 at 3:33)
  const timeAlignment = checkTimeAlignment(number, timestamp);
  if (timeAlignment) return timeAlignment;

  // Check for lucky timing (special calendar dates)
  const luckyTiming = checkLuckyTiming(timestamp);
  if (luckyTiming) return luckyTiming;

  // Check for pattern echo (same number + mood months apart)
  const patternEcho = checkPatternEcho(context);
  if (patternEcho) return patternEcho;

  return null;
}

/**
 * Check for anniversary (1 year since first sighting).
 */
function checkAnniversary(
  firstSightingDate: Date,
  now: Date
): DelightMoment | null {
  const yearsSince =
    (now.getTime() - firstSightingDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  // Check if it's approximately 1, 2, 3... years (within 1 day)
  const years = Math.round(yearsSince);
  if (years >= 1 && Math.abs(yearsSince - years) < 1 / 365) {
    return {
      type: "anniversary",
      title: years === 1 ? "One Year of Noticing" : `${years} Years of Noticing`,
      message:
        years === 1
          ? "It's been exactly one year since you started your Signal journey."
          : `${years} years of tuning into the synchronicities around you.`,
      icon: "🎂",
    };
  }

  return null;
}

/**
 * Check for milestone sighting counts.
 */
function checkMilestone(totalSightings: number): DelightMoment | null {
  const milestones: Record<number, { title: string; message: string }> = {
    10: {
      title: "Double Digits",
      message: "You've logged 10 sightings. The patterns are emerging.",
    },
    50: {
      title: "Fifty Signals",
      message: "50 moments of synchronicity captured. You're tuned in.",
    },
    100: {
      title: "Century Mark",
      message: "100 sightings. The universe keeps speaking, you keep listening.",
    },
    222: {
      title: "Angel Number Meta",
      message: "222 sightings—an angel number of sightings. How fitting.",
    },
    333: {
      title: "Triple Threes",
      message: "333 sightings. Alignment upon alignment.",
    },
    444: {
      title: "Foundation Complete",
      message: "444 sightings. A stable foundation of awareness.",
    },
    500: {
      title: "Half a Thousand",
      message: "500 signals received. You're deeply attuned.",
    },
    777: {
      title: "Lucky Sevens",
      message: "777 sightings. The luckiest milestone of all.",
    },
    1000: {
      title: "Thousand Point Club",
      message: "1,000 sightings. You're a master of noticing.",
    },
  };

  const milestone = milestones[totalSightings];
  if (milestone) {
    return {
      type: "milestone",
      title: milestone.title,
      message: milestone.message,
      icon: "🎯",
    };
  }

  return null;
}

/**
 * Check for time alignment (number matches current time).
 * Examples: 333 at 3:33, 1111 at 11:11, 444 at 4:44
 */
function checkTimeAlignment(number: string, timestamp: Date): DelightMoment | null {
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();

  // Extract time pattern based on number length
  let timeMatch = false;

  if (number.length === 3) {
    // For 3-digit numbers like 333, 444, check X:XX format
    // 333 -> 3:33, 444 -> 4:44
    const digit = number[0];
    if (
      digit === number[1] &&
      digit === number[2] &&
      hours === parseInt(digit!, 10) &&
      minutes === parseInt(digit! + digit!, 10)
    ) {
      timeMatch = true;
    }
  } else if (number.length === 4) {
    // For 4-digit numbers like 1111, 1234, check XX:XX format
    const hourPart = number.slice(0, 2);
    const minutePart = number.slice(2, 4);
    const parsedHour = parseInt(hourPart, 10);
    const parsedMinute = parseInt(minutePart, 10);

    // Check 24-hour time match
    if (parsedHour <= 23 && parsedMinute <= 59) {
      if (hours === parsedHour && minutes === parsedMinute) {
        timeMatch = true;
      }
      // Also check 12-hour time match (e.g., 1234 at 12:34)
      if (hours === parsedHour % 12 && minutes === parsedMinute) {
        timeMatch = true;
      }
    }
  }

  if (timeMatch) {
    return {
      type: "time_alignment",
      title: "Perfect Timing",
      message: `You logged ${number} at ${formatTime(timestamp)}. Time and number aligned.`,
      icon: "⏰",
    };
  }

  return null;
}

/**
 * Check for lucky timing (special calendar dates).
 * Examples: 11/11, 2/22, 3/33 (imaginary), 12/12
 */
function checkLuckyTiming(timestamp: Date): DelightMoment | null {
  const month = timestamp.getMonth() + 1; // 1-12
  const day = timestamp.getDate();

  // Check for repeating date patterns (1/1, 2/2, ..., 12/12)
  if (month === day && month <= 12) {
    return {
      type: "lucky_timing",
      title: "Portal Day",
      message: `${month}/${day} is a special day for noticing synchronicities.`,
      icon: "✨",
    };
  }

  // Check for special dates like 11/11, 2/22
  if (month === 11 && day === 11) {
    return {
      type: "lucky_timing",
      title: "11/11 Gateway",
      message: "The most powerful portal day of the year for synchronicity.",
      icon: "🌟",
    };
  }

  if (month === 2 && day === 22) {
    return {
      type: "lucky_timing",
      title: "2/22 Alignment",
      message: "A rare day of doubled twos. Balance and harmony amplified.",
      icon: "⚖️",
    };
  }

  return null;
}

/**
 * Check for pattern echo (same number + mood appearing months apart).
 */
function checkPatternEcho(context: DelightContext): DelightMoment | null {
  const { number, moodTags, historicalSightings } = context;

  if (!moodTags || moodTags.length === 0 || !historicalSightings) {
    return null;
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Look for a matching sighting from 30-90+ days ago
  const echoMatch = historicalSightings.find((sighting) => {
    // Must be same number
    if (sighting.number !== number) return false;

    // Must be older than 30 days
    if (sighting.timestamp >= thirtyDaysAgo) return false;

    // Must be within 1 year
    if (sighting.timestamp < ninetyDaysAgo) {
      // Only check up to 1 year back
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      if (sighting.timestamp < oneYearAgo) return false;
    }

    // Must have at least one matching mood
    if (!sighting.moodTags) return false;
    const hasMatchingMood = moodTags.some((mood) =>
      sighting.moodTags!.includes(mood)
    );
    return hasMatchingMood;
  });

  if (echoMatch) {
    const daysSince = Math.floor(
      (now.getTime() - echoMatch.timestamp.getTime()) / (24 * 60 * 60 * 1000)
    );

    return {
      type: "pattern_echo",
      title: "Pattern Echo",
      message: `Same number, similar feeling—${daysSince} days later. The pattern repeats.`,
      icon: "🔮",
    };
  }

  return null;
}

/**
 * Format time for display.
 */
function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  const displayMinute = minutes.toString().padStart(2, "0");
  return `${displayHour}:${displayMinute} ${ampm}`;
}
