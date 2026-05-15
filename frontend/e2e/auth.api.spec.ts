import { expect, test } from "@playwright/test";
import { apiUrl, testOtp, testPhone } from "./fixtures";

/**
 * API-level smoke for the test-phone OTP bypass.
 *
 * Validates the contract TesterArmy and the UI smoke depend on:
 *   - /send-otp returns { success: true, message_id: <number> }
 *   - /verify-otp returns { success: true, token_hash: "...", email: "..." }
 *
 * Fails fast if TEST_PHONES isn't set on the backend, so a misconfigured
 * preview env is obvious before TesterArmy starts clicking around.
 */
test.describe("auth API (test-phone bypass)", () => {
  test("send-otp accepts the test phone and returns a message_id", async ({ request }) => {
    const res = await request.post(`${apiUrl}/api/auth/send-otp`, {
      data: { phone: testPhone },
    });
    expect(res.status(), await res.text()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(typeof body.message_id).toBe("number");
  });

  test("verify-otp with the fixed OTP returns a token_hash", async ({ request }) => {
    const send = await request.post(`${apiUrl}/api/auth/send-otp`, {
      data: { phone: testPhone },
    });
    expect(send.status()).toBe(200);
    const { message_id } = await send.json();

    const verify = await request.post(`${apiUrl}/api/auth/verify-otp`, {
      data: { phone: testPhone, otp: testOtp, message_id },
    });
    expect(verify.status(), await verify.text()).toBe(200);
    const body = await verify.json();
    expect(body.success).toBe(true);
    expect(typeof body.token_hash).toBe("string");
    expect(body.token_hash.length).toBeGreaterThan(10);
    expect(typeof body.email).toBe("string");
  });

  test("verify-otp rejects a wrong OTP for a test phone", async ({ request }) => {
    const send = await request.post(`${apiUrl}/api/auth/send-otp`, {
      data: { phone: testPhone },
    });
    const { message_id } = await send.json();

    const verify = await request.post(`${apiUrl}/api/auth/verify-otp`, {
      data: { phone: testPhone, otp: "999999", message_id },
    });
    expect(verify.status()).toBe(400);
  });
});
