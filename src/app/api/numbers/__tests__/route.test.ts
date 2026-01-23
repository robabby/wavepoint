import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "../route";

describe("GET /api/numbers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all patterns when no filters applied", async () => {
    const request = new Request("http://localhost:3000/api/numbers");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.patterns).toBeDefined();
    expect(data.total).toBe(91); // 91 patterns in expanded catalog
    expect(Array.isArray(data.patterns)).toBe(true);
  });

  it("filters by category when category param provided", async () => {
    const request = new Request(
      "http://localhost:3000/api/numbers?category=triple"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.category).toBe("triple");
    expect(data.total).toBe(9); // 9 triple patterns (111-999)
    expect(data.patterns.every((p: { category: string }) => p.category === "triple")).toBe(true);
  });

  it("returns 400 for invalid category", async () => {
    const request = new Request(
      "http://localhost:3000/api/numbers?category=invalid"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid category");
    expect(data.validCategories).toContain("triple");
  });

  it("returns featured patterns when featured=true", async () => {
    const request = new Request(
      "http://localhost:3000/api/numbers?featured=true"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.patterns).toBeDefined();
    // Featured excludes 666
    expect(
      data.patterns.every((p: { id: string }) => p.id !== "666")
    ).toBe(true);
  });

  it("returns patterns with correct structure", async () => {
    const request = new Request("http://localhost:3000/api/numbers");
    const response = await GET(request);
    const data = await response.json();

    const pattern = data.patterns[0];
    expect(pattern).toHaveProperty("id");
    expect(pattern).toHaveProperty("slug");
    expect(pattern).toHaveProperty("category");
    expect(pattern).toHaveProperty("title");
    expect(pattern).toHaveProperty("essence");
    expect(pattern).toHaveProperty("meaning");
    expect(pattern).toHaveProperty("keywords");
  });
});
