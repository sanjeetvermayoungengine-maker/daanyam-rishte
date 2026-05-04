import { Router } from "express";
import { z } from "zod";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Phone-OTP authentication for Rishte.
 *
 * Mirrors the Daanyam webapp's flow exactly:
 *   1) POST /api/auth/send-otp  → BulkSMSPlans sends a 6-digit code via SMS
 *   2) POST /api/auth/verify-otp → BulkSMSPlans verifies, we upsert the user
 *      in Supabase, and return a magic-link `token_hash` the frontend can
 *      exchange for a real Supabase session via supabase.auth.verifyOtp().
 *
 * Once the session is established, every protected backend route picks up the
 * Supabase JWT from the Authorization header (see middleware/requireAuth.ts).
 */

export const authRoutes = Router();

const SendOtpSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

const VerifyOtpSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
  message_id: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === "string" ? Number(v) : v;
    if (!Number.isFinite(n)) throw new Error("message_id must be numeric");
    return n;
  }),
});

let _supabaseAdmin: SupabaseClient | null = null;
function getSupabaseAdmin(): SupabaseClient | null {
  if (_supabaseAdmin) return _supabaseAdmin;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return null;
  }
  _supabaseAdmin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _supabaseAdmin;
}

// ---------- send-otp ----------

authRoutes.post("/send-otp", async (req, res) => {
  const parsed = SendOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid phone number. Please enter 10 digits." });
    return;
  }

  const { phone } = parsed.data;
  const phoneWithCountryCode = `91${phone}`;

  const apiId = process.env.BULKSMS_API_ID;
  const apiPassword = process.env.BULKSMS_API_PASSWORD;
  const senderId = process.env.BULKSMS_SENDER_ID || "BLKSMS";

  if (!apiId || !apiPassword) {
    console.error("[send-otp] BulkSMSPlans API credentials not configured");
    res.status(500).json({ error: "SMS service is temporarily unavailable. Please try again later." });
    return;
  }

  const payload = {
    api_id: apiId,
    api_password: apiPassword,
    sms_type: "OTP",
    sms_encoding: "1",
    sender: senderId,
    number: phoneWithCountryCode,
    message: "{{otp}} is your Rishte login OTP. Valid for 10 mins.",
  };

  try {
    const smsResponse = await fetch("https://bulksmsplans.com/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const responseText = await smsResponse.text();

    let smsData: Record<string, unknown>;
    try {
      smsData = JSON.parse(responseText);
    } catch {
      console.error("[send-otp] Failed to parse BulkSMSPlans response as JSON:", responseText);
      res.status(502).json({ error: "Unable to send OTP. Please try again." });
      return;
    }

    const responseCode = Number(smsData.code);
    if (responseCode === 200) {
      const messageId = (smsData.data as Record<string, unknown> | undefined)?.message_id;
      res.status(200).json({ success: true, message_id: messageId });
      return;
    }

    console.error("[send-otp] BulkSMSPlans error:", smsData);
    res.status(502).json({ error: "Unable to send OTP. Please try again." });
  } catch (error) {
    console.error("[send-otp] Unexpected error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ---------- verify-otp ----------

authRoutes.post("/verify-otp", async (req, res) => {
  const parsed = VerifyOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request. Please check your input." });
    return;
  }

  const { phone, otp, message_id } = parsed.data;

  const apiId = process.env.BULKSMS_API_ID;
  const apiPassword = process.env.BULKSMS_API_PASSWORD;

  if (!apiId || !apiPassword) {
    console.error("[verify-otp] BulkSMSPlans API credentials not configured");
    res.status(500).json({ error: "SMS service is temporarily unavailable." });
    return;
  }

  // 1. Verify the OTP with BulkSMSPlans.
  let verifyData: Record<string, unknown>;
  try {
    const verifyResponse = await fetch("https://bulksmsplans.com/api/verify_status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_id: apiId,
        api_password: apiPassword,
        message_id,
        otp,
      }),
    });
    verifyData = (await verifyResponse.json()) as Record<string, unknown>;
  } catch (error) {
    console.error("[verify-otp] BulkSMSPlans verify call failed:", error);
    res.status(502).json({ error: "Unable to verify OTP. Please try again." });
    return;
  }

  if (Number(verifyData.code) !== 200) {
    console.warn("[verify-otp] OTP rejected by BulkSMSPlans:", verifyData.code, verifyData.message);
    res.status(400).json({ error: "That code didn't match. Please check and try again." });
    return;
  }

  // 2. Upsert the user in Supabase by phone, then mint a magiclink token_hash.
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    console.error("[verify-otp] Supabase admin client is not configured (SUPABASE_URL / SERVICE_ROLE_KEY missing).");
    res.status(500).json({ error: "Authentication is temporarily unavailable." });
    return;
  }

  const phoneWithCountryCode = `+91${phone}`;
  const dummyEmail = `phone_${phone}@daanyam.in`;

  let userEmail: string = dummyEmail;

  try {
    // Check existing profile (use the same user_profiles table as Daanyam if it exists).
    const { data: existingProfile } = await supabaseAdmin
      .from("user_profiles")
      .select("id, email")
      .eq("phone", phone)
      .maybeSingle();

    if (existingProfile) {
      userEmail = existingProfile.email || dummyEmail;
    } else {
      // Create a new auth user.
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        phone: phoneWithCountryCode,
        email: dummyEmail,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: { login_method: "phone_otp", source: "rishte" },
      });

      if (createError) {
        const msg = createError.message || "";
        if (msg.includes("already") || msg.includes("exists") || msg.includes("registered")) {
          // Already exists in auth — try to find them.
          let existingAuthUser: { id: string; email?: string } | null = null;
          let page = 1;
          while (!existingAuthUser) {
            const { data: usersPage } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
            const found = usersPage?.users?.find(
              (u) => u.phone === phoneWithCountryCode || u.email === dummyEmail
            );
            if (found) {
              existingAuthUser = { id: found.id, email: found.email ?? undefined };
              break;
            }
            const next =
              usersPage && (usersPage as unknown as { nextPage?: number }).nextPage;
            if (typeof next !== "number" || next <= page) break;
            page = next;
          }
          if (existingAuthUser) {
            userEmail = existingAuthUser.email || dummyEmail;
            // Best-effort upsert into user_profiles (table may or may not exist; ignore failure).
            await supabaseAdmin
              .from("user_profiles")
              .upsert({ id: existingAuthUser.id, email: existingAuthUser.email || "", phone })
              .then(() => undefined, (err) => {
                console.warn("[verify-otp] user_profiles upsert skipped:", err?.message);
              });
          } else {
            console.warn("[verify-otp] Could not locate existing auth user; falling back to deterministic email:", dummyEmail);
            userEmail = dummyEmail;
          }
        } else {
          console.error("[verify-otp] Failed to create user:", createError);
          res.status(500).json({ error: "Failed to create account. Please try again." });
          return;
        }
      } else {
        userEmail = dummyEmail;
        await supabaseAdmin
          .from("user_profiles")
          .insert({ id: newUser.user.id, email: "", phone })
          .then(() => undefined, (err) => {
            console.warn("[verify-otp] user_profiles insert skipped:", err?.message);
          });
      }
    }

    // 3. Generate a magic link the frontend can exchange for a real session.
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: userEmail,
    });

    if (linkError || !linkData) {
      console.error("[verify-otp] Failed to generate session link:", linkError);
      res.status(500).json({ error: "Login failed. Please try again." });
      return;
    }

    const tokenHash = linkData.properties?.hashed_token;
    if (!tokenHash) {
      console.error("[verify-otp] No token hash in link data");
      res.status(500).json({ error: "Login failed. Please try again." });
      return;
    }

    res.status(200).json({
      success: true,
      token_hash: tokenHash,
      email: userEmail,
    });
  } catch (error) {
    console.error("[verify-otp] Unexpected error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
