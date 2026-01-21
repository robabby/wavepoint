import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock auth
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

// Mock database queries
const mockGetUserNumberStats = vi.fn();
const mockGetUserAllNumberStats = vi.fn();
const mockGetUserTotalSightings = vi.fn();

vi.mock("@/lib/db/queries", () => ({
  getUserNumberStats: () => mockGetUserNumberStats(),
  getUserAllNumberStats: () => mockGetUserAllNumberStats(),
  getUserTotalSightings: () => mockGetUserTotalSightings(),
}));

import { GET } from "../stats/route";

describe("GET /api/numbers/stats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (queryParams = "") =>
    new Request(`http://localhost:3000/api/numbers/stats${queryParams}`);

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const response = await GET(createRequest());
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 401 when session has no user id", async () => {
    mockAuth.mockResolvedValue({ user: {} });

    const response = await GET(createRequest());
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns all stats when authenticated and no pattern specified", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    mockGetUserAllNumberStats.mockResolvedValue([
      { number: "444", count: 5, firstSeen: new Date(), lastSeen: new Date() },
      { number: "111", count: 3, firstSeen: new Date(), lastSeen: new Date() },
    ]);
    mockGetUserTotalSightings.mockResolvedValue(8);

    const response = await GET(createRequest());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.stats).toHaveLength(2);
    expect(data.totalSightings).toBe(8);
    expect(data.uniquePatterns).toBe(2);
  });

  it("returns stats for specific pattern when pattern param provided", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    mockGetUserNumberStats.mockResolvedValue({
      number: "444",
      count: 5,
      firstSeen: new Date("2024-01-01"),
      lastSeen: new Date("2024-01-15"),
    });

    const response = await GET(createRequest("?pattern=444"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pattern).toBe("444");
    expect(data.stats).toBeDefined();
    expect(data.stats.count).toBe(5);
  });

  it("returns null stats when user has not logged the pattern", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    mockGetUserNumberStats.mockResolvedValue(null);

    const response = await GET(createRequest("?pattern=999"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pattern).toBe("999");
    expect(data.stats).toBeNull();
  });

  it("returns empty stats for new user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-new" } });
    mockGetUserAllNumberStats.mockResolvedValue([]);
    mockGetUserTotalSightings.mockResolvedValue(0);

    const response = await GET(createRequest());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.stats).toHaveLength(0);
    expect(data.totalSightings).toBe(0);
    expect(data.uniquePatterns).toBe(0);
  });
});
