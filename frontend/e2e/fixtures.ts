/**
 * Shared fixtures for the Rishte smoke suite.
 *
 * `testPhone` is the 10-digit number TesterArmy specs use. Override via the
 * TEST_PHONE env var; otherwise the first phone in the default preview list.
 */

export const apiUrl = process.env.API_URL ?? "http://localhost:3000";
export const testPhone = process.env.TEST_PHONE ?? "9000000001";
export const testOtp = process.env.TEST_OTP ?? "000000";
