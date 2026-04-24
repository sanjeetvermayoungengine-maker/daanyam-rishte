import { describe, expect, it } from "vitest";
import { getHealthCheckUrl } from "./App";

describe("getHealthCheckUrl", () => {
  it("normalizes the API health endpoint", () => {
    expect(getHealthCheckUrl("http://localhost:3000/")).toBe("http://localhost:3000/api/health");
  });
});
