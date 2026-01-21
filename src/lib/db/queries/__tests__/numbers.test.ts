import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the db module
vi.mock("@/lib/db", () => ({
  db: {
    query: {
      signalUserNumberStats: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
  },
  signalUserNumberStats: {
    userId: "user_id",
    number: "number",
    count: "count",
  },
}));

import { db } from "@/lib/db";
import {
  getUserNumberStats,
  getUserAllNumberStats,
  getUserTotalSightings,
} from "../numbers";

const mockFindFirst = db.query.signalUserNumberStats.findFirst as ReturnType<
  typeof vi.fn
>;
const mockFindMany = db.query.signalUserNumberStats.findMany as ReturnType<
  typeof vi.fn
>;

describe("numbers database queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserNumberStats", () => {
    it("returns stats for a pattern the user has logged", async () => {
      const mockResult = {
        number: "444",
        count: 5,
        firstSeen: new Date("2024-01-01"),
        lastSeen: new Date("2024-01-15"),
      };
      mockFindFirst.mockResolvedValue(mockResult);

      const result = await getUserNumberStats("user-123", "444");

      expect(result).toEqual({
        number: "444",
        count: 5,
        firstSeen: new Date("2024-01-01"),
        lastSeen: new Date("2024-01-15"),
      });
      expect(mockFindFirst).toHaveBeenCalledTimes(1);
    });

    it("returns null when user has not logged the pattern", async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await getUserNumberStats("user-123", "999");

      expect(result).toBeNull();
    });

    it("passes correct query parameters", async () => {
      mockFindFirst.mockResolvedValue(null);

      await getUserNumberStats("user-abc", "1111");

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: expect.anything(),
      });
    });
  });

  describe("getUserAllNumberStats", () => {
    it("returns all stats for a user ordered by count", async () => {
      const mockResults = [
        {
          number: "444",
          count: 10,
          firstSeen: new Date("2024-01-01"),
          lastSeen: new Date("2024-01-15"),
        },
        {
          number: "111",
          count: 5,
          firstSeen: new Date("2024-01-02"),
          lastSeen: new Date("2024-01-10"),
        },
      ];
      mockFindMany.mockResolvedValue(mockResults);

      const result = await getUserAllNumberStats("user-123");

      expect(result).toHaveLength(2);
      expect(result[0]?.number).toBe("444");
      expect(result[0]?.count).toBe(10);
      expect(result[1]?.number).toBe("111");
    });

    it("returns empty array when user has no stats", async () => {
      mockFindMany.mockResolvedValue([]);

      const result = await getUserAllNumberStats("user-new");

      expect(result).toEqual([]);
    });

    it("maps database results to UserNumberStat interface", async () => {
      const mockResults = [
        {
          id: "stat-id", // Extra field from DB
          userId: "user-123", // Extra field from DB
          number: "777",
          count: 3,
          firstSeen: new Date("2024-02-01"),
          lastSeen: new Date("2024-02-15"),
        },
      ];
      mockFindMany.mockResolvedValue(mockResults);

      const result = await getUserAllNumberStats("user-123");

      // Should only include the mapped fields
      expect(result[0]).toEqual({
        number: "777",
        count: 3,
        firstSeen: new Date("2024-02-01"),
        lastSeen: new Date("2024-02-15"),
      });
      // Should not include extra DB fields
      expect(result[0]).not.toHaveProperty("id");
      expect(result[0]).not.toHaveProperty("userId");
    });
  });

  describe("getUserTotalSightings", () => {
    it("sums counts across all patterns", async () => {
      const mockResults = [
        {
          number: "444",
          count: 10,
          firstSeen: new Date(),
          lastSeen: new Date(),
        },
        {
          number: "111",
          count: 5,
          firstSeen: new Date(),
          lastSeen: new Date(),
        },
        {
          number: "1111",
          count: 3,
          firstSeen: new Date(),
          lastSeen: new Date(),
        },
      ];
      mockFindMany.mockResolvedValue(mockResults);

      const total = await getUserTotalSightings("user-123");

      expect(total).toBe(18);
    });

    it("returns 0 when user has no stats", async () => {
      mockFindMany.mockResolvedValue([]);

      const total = await getUserTotalSightings("user-new");

      expect(total).toBe(0);
    });
  });
});
