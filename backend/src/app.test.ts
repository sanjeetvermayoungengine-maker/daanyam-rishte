import { describe, expect, it } from "vitest";
import { getHealthStatus } from "./app";

describe("health endpoint", () => {
  it("returns a healthy status payload", () => {
    expect(getHealthStatus()).toEqual({
      status: "ok",
      service: "biodata-backend"
    });
  });
});
