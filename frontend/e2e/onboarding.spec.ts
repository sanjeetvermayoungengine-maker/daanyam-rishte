import { expect, test } from "@playwright/test";
import { testOtp, testPhone } from "./fixtures";

/**
 * UI smoke — happy path through the onboarding flow using the test-phone
 * bypass. TesterArmy clones this spec and extends it for biodata-form
 * scenarios. Keep the selectors text-based so a copy survives small visual
 * tweaks; if a screen is restructured, this is the first test to update.
 *
 * Flow: Language → Role → Dharm → Auth → Form (lite) → Success.
 *
 * Note on the two biodata UIs: this smoke exercises the onboarding-lite
 * FormScreen (name + DOB only). The full BioDataForm under /biodata/* is
 * not part of onboarding — write a separate spec to cover it once logged in.
 */
test.describe("onboarding happy path", () => {
  test("a test phone can log in and reach the form screen", async ({ page }) => {
    await page.goto("/onboarding");

    // Language
    await page.getByRole("button", { name: /English/i }).first().click();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Role — pick the first available role chip, then Continue.
    // (Role labels are i18n'd; we click the first non-Continue button on the screen.)
    const roleContinue = page.getByRole("button", { name: /Continue/i });
    await page.locator("button").filter({ hasNotText: /Continue|Back/i }).first().click();
    await roleContinue.click();

    // Dharm — same pattern.
    await page.locator("button").filter({ hasNotText: /Continue|Back/i }).first().click();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Auth — phone entry.
    await page.getByPlaceholder(/\d/).fill(testPhone);
    await page.getByRole("button", { name: /Send/i }).click();

    // OTP — fill one digit per input.
    const otpInputs = page.locator('input[inputmode="numeric"]');
    await expect(otpInputs).toHaveCount(6, { timeout: 10_000 });
    for (let i = 0; i < 6; i++) {
      await otpInputs.nth(i).fill(testOtp[i]);
    }
    await page.getByRole("button", { name: /Verify/i }).click();

    // Form screen — assert one of its expected labels appears.
    await expect(page.getByText(/name/i).first()).toBeVisible({ timeout: 15_000 });
  });
});
