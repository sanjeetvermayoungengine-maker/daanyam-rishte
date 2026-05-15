#!/usr/bin/env bash
# deploy-rishte-preview.sh — deploy Rishte backend to a SEPARATE Cloud Run
# service (`rishte-api-preview`) with TEST_PHONES + TEST_OTP enabled.
#
# Used for PR / preview deploys that TesterArmy and the Playwright smoke
# suite hit. The production `rishte-api` service is untouched and never
# gets TEST_PHONES.
#
# Run from anywhere:
#   bash /Users/sanjeet/Desktop/daanyam-rishte/deploy-rishte-preview.sh
#
# Prereqs: setup-secrets.sh has already been run for the project (the same
# Supabase / BulkSMS secrets are shared). You'll be prompted to confirm /
# update the test-phone list.

set -euo pipefail

PROJECT_ID="${GCLOUD_PROJECT:-daanyam-astroengine}"
REGION="${REGION:-asia-south1}"
SERVICE="${SERVICE:-rishte-api-preview}"
SUPABASE_URL_VAL="https://umpxmvtuchlkkdttcvfl.supabase.co"
# Frontend preview origins — exact match only (see backend/src/app.ts); no wildcards.
CORS_ORIGIN_VAL="https://rishte-preview.daanyam.in,http://localhost:5173"

# Defaults — override by exporting before running, e.g.:
#   TEST_PHONES_VAL=9000000001,9000000002 bash deploy-rishte-preview.sh
TEST_PHONES_DEFAULT="9000000001,9000000002,9000000003,9000000004,9000000005"
TEST_OTP_DEFAULT="000000"
TEST_PHONES_VAL="${TEST_PHONES_VAL:-$TEST_PHONES_DEFAULT}"
TEST_OTP_VAL="${TEST_OTP_VAL:-$TEST_OTP_DEFAULT}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Project:      $PROJECT_ID"
echo "Region:       $REGION"
echo "Service:      $SERVICE  (preview — separate from prod rishte-api)"
echo "Test phones:  $TEST_PHONES_VAL"
echo "Test OTP:     $TEST_OTP_VAL"
echo

# Guardrail — never let this script touch the prod service.
if [[ "$SERVICE" == "rishte-api" ]]; then
  echo "ERROR: refusing to apply TEST_PHONES to the production service rishte-api." >&2
  echo "Pick a different SERVICE name (e.g. rishte-api-preview)." >&2
  exit 1
fi

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
  --update-env-vars "^~^NODE_ENV=production~CORS_ORIGIN=${CORS_ORIGIN_VAL}~SUPABASE_URL=${SUPABASE_URL_VAL}~SUPABASE_SERVICE_ROLE_KEY=${SRK}~DATABASE_URL=${DBU}~BULKSMS_API_ID=${BAI}~BULKSMS_API_PASSWORD=${BAP}~BULKSMS_SENDER_ID=${BSI}~TEST_PHONES=${TEST_PHONES_VAL}~TEST_OTP=${TEST_OTP_VAL}"

echo
echo "==> Phase 2: building image and deploying via Cloud Build"
SHORT_SHA_VAL="$(git rev-parse --short HEAD)"
gcloud --project="$PROJECT_ID" builds submit \
  --config cloudbuild.yaml \
  --substitutions="SHORT_SHA=${SHORT_SHA_VAL},_SERVICE=${SERVICE}" \
  .

echo
echo "==> Resolving service URL for health check"
SERVICE_URL=$(gcloud --project="$PROJECT_ID" run services describe "$SERVICE" \
  --region="$REGION" --format='value(status.url)')
echo "Cloud Run URL: $SERVICE_URL"

echo
echo "==> Health check"
sleep 5
curl -sS "$SERVICE_URL/api/health" || true
echo

echo
echo "==============================================="
echo "Preview backend live at: $SERVICE_URL"
echo
echo "Point Vercel previews / Playwright at this URL via VITE_API_URL,"
echo "then log in with any TEST_PHONES entry + TEST_OTP=$TEST_OTP_VAL."
echo
echo "See TESTERARMY.md for the full handoff."
echo "==============================================="
