/**
 * Test-mode OTP bypass for TesterArmy / Playwright smoke runs.
 *
 * Activates only when `TEST_PHONES` is set in the environment. A request whose
 * phone is in that list skips the BulkSMSPlans round-trip and accepts a fixed
 * OTP (default "000000", overridable via `TEST_OTP`). The Supabase upsert +
 * magic-link generation in /verify-otp still runs end-to-end, so test logins
 * exercise the real session path — only the SMS provider is short-circuited.
 *
 * Production stays dead-code: if TEST_PHONES is empty / unset, every helper
 * returns false and no branch is taken. Do NOT set TEST_PHONES on prod.
 */

const PHONE_REGEX = /^\d{10}$/;

/** Sentinel message_id we return from /send-otp for test phones. */
export const TEST_MESSAGE_ID = 999000001;

let _cache: { raw: string | undefined; set: Set<string> } | null = null;

function getTestPhoneSet(): Set<string> {
  const raw = process.env.TEST_PHONES;
  if (_cache && _cache.raw === raw) return _cache.set;

  const set = new Set<string>();
  if (raw) {
    for (const part of raw.split(",")) {
      const trimmed = part.trim();
      if (PHONE_REGEX.test(trimmed)) {
        set.add(trimmed);
      } else if (trimmed.length > 0) {
        console.warn(`[testAuth] Ignoring malformed TEST_PHONES entry: ${trimmed}`);
      }
    }
  }
  _cache = { raw, set };
  return set;
}

/** True iff TEST_PHONES is set AND `phone` (10 digits) is in the list. */
export function isTestPhone(phone: string): boolean {
  return getTestPhoneSet().has(phone);
}

/** Fixed OTP test phones must send. Defaults to "000000". */
export function getTestOtp(): string {
  const raw = process.env.TEST_OTP;
  if (raw && /^\d{6}$/.test(raw)) return raw;
  return "000000";
}

/** True if test-mode is active at all (any phones configured). */
export function isTestAuthEnabled(): boolean {
  return getTestPhoneSet().size > 0;
}

/** Test-only — clears the env cache so test cases can mutate process.env. */
export function __resetTestAuthCacheForTests(): void {
  _cache = null;
}
