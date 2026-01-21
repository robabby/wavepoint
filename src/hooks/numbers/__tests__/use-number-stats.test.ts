import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useNumberStats, useNumberStat } from "../use-number-stats";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        retryDelay: 0,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

describe("useNumberStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches all stats successfully", async () => {
    const mockStats = [
      { number: "444", count: 5, firstSeen: "2024-01-01", lastSeen: "2024-01-15" },
      { number: "111", count: 3, firstSeen: "2024-01-02", lastSeen: "2024-01-10" },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          stats: mockStats,
          totalSightings: 8,
          uniquePatterns: 2,
        }),
    });

    const { result } = renderHook(() => useNumberStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats).toEqual(mockStats);
    expect(result.current.totalSightings).toBe(8);
    expect(result.current.uniquePatterns).toBe(2);
    expect(result.current.isError).toBe(false);
    expect(result.current.isUnauthorized).toBe(false);
    expect(mockFetch).toHaveBeenCalledWith("/api/numbers/stats");
  });

  it("handles unauthorized error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useNumberStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isUnauthorized).toBe(true);
    expect(result.current.stats).toEqual([]);
    expect(result.current.totalSightings).toBe(0);
    expect(result.current.uniquePatterns).toBe(0);
  });

  it("isUnauthorized is false initially", () => {
    // Test that isUnauthorized defaults to false before any error
    mockFetch.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useNumberStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isUnauthorized).toBe(false);
  });

  it("does not fetch when disabled", () => {
    const { result } = renderHook(() => useNumberStats({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns defaults while loading", () => {
    mockFetch.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useNumberStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.stats).toEqual([]);
    expect(result.current.totalSightings).toBe(0);
    expect(result.current.uniquePatterns).toBe(0);
    expect(result.current.isLoading).toBe(true);
  });
});

describe("useNumberStat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches pattern stat successfully", async () => {
    const mockStat = {
      number: "444",
      count: 5,
      firstSeen: "2024-01-01",
      lastSeen: "2024-01-15",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ pattern: "444", stats: mockStat }),
    });

    const { result } = renderHook(() => useNumberStat("444"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stat).toEqual(mockStat);
    expect(result.current.hasLogged).toBe(true);
    expect(result.current.count).toBe(5);
    expect(result.current.firstSeen).toBe("2024-01-01");
    expect(result.current.lastSeen).toBe("2024-01-15");
    expect(mockFetch).toHaveBeenCalledWith("/api/numbers/stats?pattern=444");
  });

  it("handles pattern with no stats", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ pattern: "999", stats: null }),
    });

    const { result } = renderHook(() => useNumberStat("999"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stat).toBeNull();
    expect(result.current.hasLogged).toBe(false);
    expect(result.current.count).toBe(0);
    expect(result.current.firstSeen).toBeNull();
    expect(result.current.lastSeen).toBeNull();
  });

  it("handles unauthorized error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useNumberStat("444"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isUnauthorized).toBe(true);
    expect(result.current.stat).toBeNull();
    expect(result.current.hasLogged).toBe(false);
  });

  it("does not fetch when disabled", () => {
    const { result } = renderHook(
      () => useNumberStat("444", { enabled: false }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("does not fetch when pattern is empty", () => {
    const { result } = renderHook(() => useNumberStat(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns defaults while loading", () => {
    mockFetch.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useNumberStat("444"), {
      wrapper: createWrapper(),
    });

    expect(result.current.stat).toBeNull();
    expect(result.current.hasLogged).toBe(false);
    expect(result.current.count).toBe(0);
    expect(result.current.isLoading).toBe(true);
  });
});
