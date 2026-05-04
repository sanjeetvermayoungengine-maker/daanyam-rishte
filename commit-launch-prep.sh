#!/usr/bin/env bash
# commit-launch-prep.sh
#
# Stages all the launch-prep work on feature/template-redesign and creates
# a single commit. Stops short of git push so you can review the result with
# `git log -1` / `git show` and amend if needed.
#
# Run from the repo root:
#   cd /Users/sanjeet/Desktop/daanyam-rishte
#   bash commit-launch-prep.sh
#
# To push after reviewing:
#   git push origin feature/template-redesign

set -euo pipefail

cd "$(dirname "$0")"

# Sanity check: must be on the launch branch.
branch=$(git branch --show-current)
if [[ "$branch" != "feature/template-redesign" ]]; then
  echo "ERROR: expected branch feature/template-redesign, got $branch" >&2
  exit 1
fi

# Untrack .DS_Store (it's already in .gitignore but was committed before
# the rule existed). Ignore failure if it's not tracked anymore.
git rm --cached .DS_Store 2>/dev/null || true

# Stage everything else. The .gitignore was updated to exclude .claude/
# so Cowork session state stays out.
git add -A

echo
echo "=== Staged for commit ==="
git diff --cached --stat
echo

read -r -p "Proceed with commit? [y/N] " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Aborted. Run 'git reset' to unstage."
  exit 0
fi

git commit -m "feat(launch): phone-OTP auth + launch prep for Rishte soft launch

Backend:
- Add /api/auth/send-otp and /api/auth/verify-otp routes via BulkSMSPlans
  + Supabase admin client (backend/src/routes/authRoutes.ts).
- Mount auth router with per-IP rate limits (6 send / 10min,
  20 verify / 10min) in backend/src/app.ts.
- Add @supabase/supabase-js and zod dependencies.
- Refactor migrations/migrate.ts to export runMigrations() (CLI entrypoint
  preserved) and call it from index.ts at boot. Failed migrations now
  block server startup.

Frontend:
- Wire AuthProvider into App.tsx; AuthContext exposes real sendOtp,
  verifyOtp, signInWithGoogle.
- Replace fake OTP/Google handlers in Onboarding/AuthScreen.tsx with
  real backend calls; only advance once a Supabase session exists.
- Header sign-in button now routes to /onboarding (phone OTP) instead
  of triggering Google OAuth directly.
- Add onboarding Redux slice (store/onboardingSlice.ts) and wire it
  into the root store.
- Tailwind + PostCSS config for the new onboarding screens.
- Step 4 Horoscope rework, locationInput utility + tests, plus smaller
  polish across Home/ShareModal/SharePrivacySettings.

Docs:
- LAUNCH_RUNBOOK.md (the operational checklist for going live), plus
  ONBOARDING_INTEGRATION.md, DEPLOY_PROMPT.md, COMMIT_INSTRUCTIONS.md,
  Rishte_Launch_Readiness_Report.docx.

Repo hygiene:
- Add .claude/ to .gitignore (Cowork session state).
- Untrack .DS_Store (already in .gitignore but was tracked from before)."

echo
echo "=== Commit created ==="
git log -1 --stat
echo
echo "Next: review with 'git show HEAD', then push with:"
echo "  git push origin feature/template-redesign"
