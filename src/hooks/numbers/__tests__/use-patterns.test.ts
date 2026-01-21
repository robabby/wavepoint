import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePatterns, usePattern } from "../use-patterns";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
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

describe("usePatterns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches all patterns successfully", async () => {
    const mockPatterns = [
      { id: "111", title: "New Beginnings" },
      { id: "222", title: "Balance" },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ patterns: mockPatterns, total: 2 }),
    });

    const { result } = renderHook(() => usePatterns(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.patterns).toEqual(mockPatterns);
    expect(result.current.total).toBe(2);
    expect(result.current.isError).toBe(false);
    expect(mockFetch).toHaveBeenCalledWith("/api/numbers");
  });

  it("fetches patterns by category", async () => {
    const mockPatterns = [{ id: "111", category: "triple" }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          patterns: mockPatterns,
          total: 1,
          category: "triple",
        }),
    });

    const { result } = renderHook(() => usePatterns({ category: "triple" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.patterns).toEqual(mockPatterns);
    expect(result.current.category).toBe("triple");
    expect(mockFetch).toHaveBeenCalledWith("/api/numbers?category=triple");
  });

  it("fetches featured patterns", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ patterns: [], total: 0 }),
    });

    const { result } = renderHook(() => usePatterns({ featured: true }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/numbers?featured=true");
  });

  it("handles fetch error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => usePatterns(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.patterns).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it("returns empty arrays while loading", () => {
    mockFetch.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => usePatterns(), {
      wrapper: createWrapper(),
    });

    expect(result.current.patterns).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.isLoading).toBe(true);
  });
});

describe("usePattern", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches a known pattern successfully", async () => {
    const mockPattern = { id: "444", title: "Stability" };
    const mockRelated = [{ id: "111", title: "New Beginnings" }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ pattern: mockPattern, related: mockRelated }),
    });

    const { result } = renderHook(() => usePattern("444"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pattern).toEqual(mockPattern);
    expect(result.current.related).toEqual(mockRelated);
    expect(result.current.isKnownPattern).toBe(true);
    expect(result.current.breakdown).toBeNull();
    expect(mockFetch).toHaveBeenCalledWith("/api/numbers/444");
  });

  it("returns breakdown for uncovered pattern", async () => {
    const mockBreakdown = {
      number: "847",
      components: [{ digit: "8", meaning: "Abundance" }],
      synthesizedMeaning: "A blend of energies",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ pattern: null, breakdown: mockBreakdown }),
    });

    const { result } = renderHook(() => usePattern("847"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pattern).toBeNull();
    expect(result.current.breakdown).toEqual(mockBreakdown);
    expect(result.current.isKnownPattern).toBe(false);
  });

  it("handles 404 error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => usePattern("invalid"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.pattern).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("does not fetch when disabled", () => {
    const { result } = renderHook(
      () => usePattern("444", { enabled: false }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("does not fetch when pattern is empty", () => {
    const { result } = renderHook(() => usePattern(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
