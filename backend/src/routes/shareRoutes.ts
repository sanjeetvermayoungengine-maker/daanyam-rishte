import { Router } from "express";
import "../types/express.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createShare,
  getShareAnalyticsSummary,
  getSharePresetDefinitions,
  getPublicShareByToken,
  listShares,
  revokeShare,
  updateSharePermissions,
} from "../services/shareService.js";
import {
  buildOgPayload,
  isCrawlerUserAgent,
  renderShareErrorOgHtml,
  renderShareOgHtml,
} from "../services/shareOgRenderer.js";
import type { BioDataSnapshot, SharePermissions, ShareSource, ShareType } from "../types/share.js";
import { bioDataSnapshotSchema } from "../types/shareValidation.js";

type CreateShareBody = {
  recipient?: string;
  shareType?: ShareType | string;
  label?: string | null;
  source?: ShareSource | string;
  expiryDate?: string;
  permissions?: Partial<SharePermissions>;
  bioData?: BioDataSnapshot;
};

export const shareRoutes = Router();

shareRoutes.get("/presets", (_req, res) => {
  res.status(200).json({ presets: getSharePresetDefinitions() });
});

shareRoutes.get("/", requireAuth, async (req, res) => {
  try {
    res.status(200).json({ shares: await listShares(req.auth!.userId) });
  } catch (err) {
    console.error("[shareRoutes GET /] listShares failed:", err);
    res.status(500).json({ error: "unable to fetch shares" });
  }
});

shareRoutes.get("/analytics/summary", requireAuth, async (req, res) => {
  try {
    res.status(200).json({ summary: await getShareAnalyticsSummary(req.auth!.userId) });
  } catch (err) {
    console.error("[shareRoutes GET /analytics/summary] failed:", err);
    res.status(500).json({ error: "unable to fetch share analytics" });
  }
});

shareRoutes.post("/", requireAuth, async (req, res) => {
  const body = req.body as CreateShareBody;
  if (!body.bioData) {
    res.status(400).json({ error: "bioData is required" });
    return;
  }

  const parsedBioData = bioDataSnapshotSchema.safeParse(body.bioData);
  if (!parsedBioData.success) {
    res.status(400).json({ error: parsedBioData.error.issues[0]?.message ?? "invalid bioData" });
    return;
  }

  try {
    const share = await createShare({
      ownerUserId: req.auth!.userId,
      recipient: body.recipient ?? "",
      shareType: body.shareType,
      label: body.label,
      source: body.source,
      expiryDate: body.expiryDate ?? "",
      permissions: body.permissions,
      bioData: parsedBioData.data as unknown as BioDataSnapshot,
    });

    res.status(201).json({ share });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unable to create share";
    res.status(400).json({ error: message });
  }
});

shareRoutes.patch("/:id/permissions", requireAuth, async (req, res) => {
  try {
    const share = await updateSharePermissions(
      req.params.id,
      req.auth!.userId,
      (req.body as { permissions?: SharePermissions }).permissions ?? {}
    );
    if (!share) {
      res.status(404).json({ error: "share not found" });
      return;
    }

    res.status(200).json({ share });
  } catch (err) {
    console.error("[shareRoutes PATCH /:id/permissions] failed:", err);
    res.status(500).json({ error: "unable to update permissions" });
  }
});

shareRoutes.patch("/:id/revoke", requireAuth, async (req, res) => {
  try {
    const share = await revokeShare(req.params.id, req.auth!.userId);
    if (!share) {
      res.status(404).json({ error: "share not found" });
      return;
    }

    res.status(200).json({ share });
  } catch (err) {
    console.error("[shareRoutes PATCH /:id/revoke] failed:", err);
    res.status(500).json({ error: "unable to revoke share" });
  }
});

shareRoutes.get("/:token", async (req, res) => {
  try {
    const result = await getPublicShareByToken(req.params.token, {
      userAgent: req.get("user-agent"),
      referrer: req.get("referer") ?? req.get("referrer"),
      ipAddress: req.ip,
    });
    if (result.kind === "not_found") {
      res.status(404).json({ code: "not_found", message: "share token not found" });
      return;
    }

    if (result.kind === "revoked") {
      res.status(403).json({ code: "revoked", message: "share link has been revoked", share: result.share });
      return;
    }

    if (result.kind === "expired") {
      res.status(410).json({ code: "expired", message: "share link has expired", share: result.share });
      return;
    }

    res.status(200).json({
      share: result.share,
      bioData: result.bioData,
    });
  } catch (err) {
    console.error("[shareRoutes GET /:token] failed:", err);
    res.status(500).json({ error: "unable to resolve share token" });
  }
});

/**
 * Crawler-facing HTML endpoint for /share/:token.
 *
 * The frontend reverse-proxies link-preview bots (WhatsApp/Twitter/etc) to this
 * route so they receive a tiny HTML page with proper OG tags derived from the
 * biodata (honoring privacy settings). Real users continue through the SPA.
 *
 * Always returns 200 with HTML so the bot can read meta tags — error states
 * (not found/expired/revoked) render an explanatory preview page instead of
 * a JSON error.
 */
shareRoutes.get("/:token/og", async (req, res) => {
  const token = req.params.token;
  try {
    const result = await getPublicShareByToken(token, {
      userAgent: req.get("user-agent"),
      referrer: req.get("referer") ?? req.get("referrer"),
      ipAddress: req.ip,
    });

    let html: string;
    if (result.kind === "ok") {
      html = renderShareOgHtml(
        buildOgPayload({ token, share: result.share, bioData: result.bioData })
      );
    } else {
      html = renderShareErrorOgHtml({ token, reason: result.kind });
    }

    res.set("Cache-Control", "public, max-age=300");
    res.set("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (err) {
    console.error("[shareRoutes GET /:token/og] failed:", err);
    res
      .status(200)
      .set("Content-Type", "text/html; charset=utf-8")
      .send(renderShareErrorOgHtml({ token, reason: "not_found" }));
  }
});

// Re-export for use by a top-level router that wants to inspect user-agent
// before routing crawlers to /og or the SPA.
export { isCrawlerUserAgent };
