import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

type SupabaseClaims = JWTPayload & {
  sub?: string;
  email?: string;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseJwtIssuer = supabaseUrl ? `${supabaseUrl}/auth/v1` : "";
const jwks = supabaseUrl ? createRemoteJWKSet(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`)) : null;

function readBearerToken(req: Request) {
  const authHeader = req.header("authorization") ?? req.header("Authorization");
  if (!authHeader) {
    return null;
  }
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }
  return token;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!jwks || !supabaseJwtIssuer) {
    res.status(500).json({ error: "Supabase auth is not configured on server" });
    return;
  }

  const token = readBearerToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: supabaseJwtIssuer,
    });
    const claims = payload as SupabaseClaims;
    if (!claims.sub) {
      res.status(401).json({ error: "Token missing subject" });
      return;
    }
    req.auth = {
      userId: claims.sub,
      email: claims.email,
    };
    next();
  } catch (err) {
    // Log the real reason so we can debug 401s without exposing the token to clients.
    // jose throws with .code (e.g. ERR_JWT_EXPIRED, ERR_JWS_SIGNATURE_VERIFICATION_FAILED,
    // ERR_JWKS_NO_MATCHING_KEY, ERR_JWT_CLAIM_VALIDATION_FAILED).
    const e = err as { code?: string; message?: string; claim?: string; reason?: string };
    console.error(
      "[requireAuth] jwtVerify failed",
      JSON.stringify({
        code: e.code,
        message: e.message,
        claim: e.claim,
        reason: e.reason,
        expectedIssuer: supabaseJwtIssuer,
      })
    );
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
