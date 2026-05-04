#!/usr/bin/env bash
# deploy-rishte.sh — set env vars + build & deploy Rishte backend to Cloud Run.
#
# Prompts silently for the 5 secret values (input never echoed).
#
# Run from anywhere:
#   bash /Users/sanjeet/Desktop/daanyam-rishte/deploy-rishte.sh

set -euo pipefail

PROJECT_ID="${GCLOUD_PROJECT:-daanyam-astroengine}"
REGION="${REGION:-asia-south1}"
SERVICE="${SERVICE:-rishte-api}"
SUPABASE_URL_VAL="https://umpxmvtuchlkkdttcvfl.supabase.co"
CORS_ORIGIN_VAL="https://rishte.daanyam.in,https://daanyam-rishte.vercel.app"

# Resolve the repo root reliably no matter where this is invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Project: $PROJECT_ID"
echo "Region:  $REGION"
echo "Service: $SERVICE"
echo "Repo:    $SCRIPT_DIR"
echo

read -r -s -p "Paste SUPABASE_SERVICE_ROLE_KEY (input hidden): " SRK; echo
read -r -s -p "Paste SUPABASE_DATABASE_URL (input hidden):     " DBU; echo
read -r -s -p "Paste BULKSMS_API_ID (input hidden):             " BAI; echo
read -r -s -p "Paste BULKSMS_API_PASSWORD (input hidden):       " BAP; echo
read -r -s -p "Paste BULKSMS_SENDER_ID (input hidden):          " BSI; echo

if [[ -z "$SRK" || -z "$DBU" || -z "$BAI" || -z "$BAP" || -z "$BSI" ]]; then
  echo "ERROR: one or more values were empty. Aborting." >&2
  exit 1
fi

cleanup() {
  unset SRK DBU BAI BAP BSI
}
trap cleanup EXIT INT TERM

echo
echo "==> Phase 1: applying env vars to $SERVICE (creates a new revision)"
gcloud --project="$PROJECT_ID" run services update "$SERVICE" \
  --region="$REGION" \
  --update-env-vars "^~^NODE_ENV=production~CORS_ORIGIN=${CORS_ORIGIN_VAL}~SUPABASE_URL=${SUPABASE_URL_VAL}~SUPABASE_SERVICE_ROLE_KEY=${SRK}~DATABASE_URL=${DBU}~BULKSMS_API_ID=${BAI}~BULKSMS_API_PASSWORD=${BAP}~BULKSMS_SENDER_ID=${BSI}"

echo
echo "==> Phase 2: building image and deploying via Cloud Build"
SHORT_SHA_VAL="$(git rev-parse --short HEAD)"
gcloud --project="$PROJECT_ID" builds submit \
  --config cloudbuild.yaml \
  --substitutions="SHORT_SHA=${SHORT_SHA_VAL}" \
  .

echo
echo "==> Resolving service URL for health check"
SERVICE_URL=$(gcloud --project="$PROJECT_ID" run services describe "$SERVICE" \
  --region="$REGION" --format='value(status.url)')
echo "Cloud Run URL: $SERVICE_URL"

echo
echo "==> Health check"
sleep 5  # let the new revision warm up
curl -sS "$SERVICE_URL/api/health" || true
echo

echo
echo "==============================================="
echo "Done. If health returned {\"status\":\"ok\",...}, the backend is live"
echo "with the new auth routes and migrations applied at boot."
echo
echo "Next steps:"
echo "  1. bash commit-launch-prep.sh   # commit the dirty branch"
echo "  2. git push origin feature/template-redesign"
echo "  3. Open PR to main, merge      # Vercel auto-deploys frontend"
echo "==============================================="
