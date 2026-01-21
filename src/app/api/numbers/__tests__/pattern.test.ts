import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "../[pattern]/route";

describe("GET /api/numbers/[pattern]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (pattern: string) =>
    new Request(`http://localhost:3000/api/numbers/${pattern}`);

  const createParams = (pattern: string) => ({
    params: Promise.resolve({ pattern }),
  });

  it("returns pattern data for a known pattern", async () => {
    const response = await GET(createRequest("444"), createParams("444"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pattern).toBeDefined();
    expect(data.pattern.id).toBe("444");
    expect(data.pattern.category).toBe("triple");
  });

  it("returns related patterns for a known pattern", async () => {
    const response = await GET(createRequest("444"), createParams("444"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.related).toBeDefined();
    expect(Array.isArray(data.related)).toBe(true);
  });

  it("returns component breakdown for uncovered pattern", async () => {
    const response = await GET(createRequest("847"), createParams("847"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pattern).toBeNull();
    expect(data.breakdown).toBeDefined();
    expect(data.breakdown.number).toBe("847");
    expect(data.breakdown.components).toBeDefined();
    expect(data.breakdown.synthesizedMeaning).toBeDefined();
  });

  it("returns 400 for invalid pattern format (too short)", async () => {
    const response = await GET(createRequest("1"), createParams("1"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Invalid pattern format");
  });

  it("returns 400 for invalid pattern format (too long)", async () => {
    const response = await GET(createRequest("123456"), createParams("123456"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Invalid pattern format");
  });

  it("returns 400 for invalid pattern format (non-digits)", async () => {
    const response = await GET(createRequest("12a"), createParams("12a"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Invalid pattern format");
  });

  it("returns correct pattern properties", async () => {
    const response = await GET(createRequest("1111"), createParams("1111"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pattern).toHaveProperty("id", "1111");
    expect(data.pattern).toHaveProperty("slug");
    expect(data.pattern).toHaveProperty("category", "quad");
    expect(data.pattern).toHaveProperty("title");
    expect(data.pattern).toHaveProperty("essence");
    expect(data.pattern).toHaveProperty("meaning");
    expect(data.pattern).toHaveProperty("keywords");
  });
});
