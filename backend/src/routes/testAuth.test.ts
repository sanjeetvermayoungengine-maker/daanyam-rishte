import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  TEST_MESSAGE_ID,
  __resetTestAuthCacheForTests,
  getTestOtp,
  isTestAuthEnabled,
  isTestPhone,
} from "./testAuth.js";

const ORIG_TEST_PHONES = process.env.TEST_PHONES;
const ORIG_TEST_OTP = process.env.TEST_OTP;

function setEnv(phones: string | undefined, otp: string | undefined) {
  if (phones === undefined) delete process.env.TEST_PHONES;
  else process.env.TEST_PHONES = phones;
  if (otp === undefined) delete process.env.TEST_OTP;
  else process.env.TEST_OTP = otp;
  __resetTestAuthCacheForTests();
}

describe("testAuth", () => {
  beforeEach(() => {
    setEnv(undefined, undefined);
  });

  afterEach(() => {
    setEnv(ORIG_TEST_PHONES, ORIG_TEST_OTP);
  });

  it("exposes a sentinel message_id", () => {
    expect(TEST_MESSAGE_ID).toBe(999000001);
  });

  it("returns false for every phone when TEST_PHONES is unset", () => {
    expect(isTestAuthEnabled()).toBe(false);
    expect(isTestPhone("9999999999")).toBe(false);
    expect(isTestPhone("1234567890")).toBe(false);
  });

  it("returns false when TEST_PHONES is an empty string", () => {
    setEnv("", undefined);
    expect(isTestAuthEnabled()).toBe(false);
    expect(isTestPhone("9999999999")).toBe(false);
  });

  it("matches phones from a comma-separated TEST_PHONES list", () => {
    setEnv("9000000001, 9000000002,9000000003", undefined);
    expect(isTestAuthEnabled()).toBe(true);
    expect(isTestPhone("9000000001")).toBe(true);
    expect(isTestPhone("9000000002")).toBe(true);
    expect(isTestPhone("9000000003")).toBe(true);
    expect(isTestPhone("9000000004")).toBe(false);
  });

  it("ignores malformed entries silently (not 10 digits)", () => {
    setEnv("9000000001,not-a-phone,12345", undefined);
    expect(isTestPhone("9000000001")).toBe(true);
    expect(isTestPhone("12345")).toBe(false);
    expect(isTestPhone("not-a-phone")).toBe(false);
  });

  it("uses TEST_OTP when set and falls back to 000000 otherwise", () => {
    setEnv("9000000001", undefined);
    expect(getTestOtp()).toBe("000000");

    setEnv("9000000001", "654321");
    expect(getTestOtp()).toBe("654321");

    // Invalid TEST_OTP (wrong length) falls back to default
    setEnv("9000000001", "12");
    expect(getTestOtp()).toBe("000000");
  });

  it("re-reads env after cache reset (so deploys can rotate the list)", () => {
    setEnv("9000000001", undefined);
    expect(isTestPhone("9000000001")).toBe(true);
    expect(isTestPhone("9000000002")).toBe(false);

    setEnv("9000000002", undefined);
    expect(isTestPhone("9000000001")).toBe(false);
    expect(isTestPhone("9000000002")).toBe(true);
  });
});
