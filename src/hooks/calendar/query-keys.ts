export const calendarKeys = {
  all: ["calendar"] as const,
  ephemeris: () => [...calendarKeys.all, "ephemeris"] as const,
  ephemerisDay: (date: string, tz?: string) =>
    [...calendarKeys.ephemeris(), "day", date, tz] as const,
  ephemerisRange: (start: string, end: string, tz?: string) =>
    [...calendarKeys.ephemeris(), "range", start, end, tz] as const,
  journal: () => [...calendarKeys.all, "journal"] as const,
  journalRange: (start: string, end: string) =>
    [...calendarKeys.journal(), start, end] as const,
  journalEntry: (id: string) => [...calendarKeys.journal(), "entry", id] as const,
  transits: () => [...calendarKeys.all, "transits"] as const,
  transitsDay: (date: string) => [...calendarKeys.transits(), date] as const,
};
