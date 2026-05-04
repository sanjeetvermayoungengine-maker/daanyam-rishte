#!/usr/bin/env bash
# setup-secrets.sh
#
# Creates Google Secret Manager secrets for the Rishte launch and grants
# the Cloud Run runtime service account access to read them. Idempotent —
# safe to re-run; if a secret already exists, it adds a new version.
#
# Run from anywhere:
#   bash /Users/sanjeet/Desktop/daanyam-rishte/setup-secrets.sh
#
# You'll be prompted to paste each secret value. Input is hidden (no echo).
# Sources for the values:
#   SUPABASE_URL              -> Supabase dashboard -> daanyam-rishte project
#                                -> Settings -> API -> Project URL.
#   SUPABASE_SERVICE_ROLE_KEY -> Supabase dashboard -> daanyam-rishte project
#                                -> Settings -> API -> Project API keys ->
#                                "service_role" (click reveal).
#   SUPABASE_DATABASE_URL     -> Supabase dashboard -> daanyam-rishte project
#                                -> Settings -> Database -> Connection string
#                                (URI form). Pick the "Session" pooler if
#                                you want connection pooling, or "Direct" for
#                                migrations. The migrate-on-boot uses this
#                                same URL, so direct connection is safer.
#   BULKSMS_API_ID            -> Vercel dashboard -> daanyam-webapp ->
#                                Settings -> Environment Variables ->
#                                BULKSMS_API_ID (click the eye icon).
#   BULKSMS_API_PASSWORD      -> same path, BULKSMS_API_PASSWORD.
#   BULKSMS_SENDER_ID         -> same path, BULKSMS_SENDER_ID.

set -euo pipefail

PROJECT_ID="${GCLOUD_PROJECT:-daanyam-astroengine}"
REGION="${REGION:-asia-south1}"
SERVICE="${SERVICE:-rishte-api}"

echo "Project:  $PROJECT_ID"
echo "Region:   $REGION"
echo "Service:  $SERVICE"
echo

# Make sure the Secret Manager API is enabled (no-op if already on).
gcloud --project="$PROJECT_ID" services enable secretmanager.googleapis.com >/dev/null

# Detect the runtime service account that the rishte-api Cloud Run service
# uses. If the service doesn't exist yet, fall back to the default compute SA.
RUNTIME_SA=$(gcloud --project="$PROJECT_ID" run services describe "$SERVICE" \
  --region="$REGION" \
  --format='value(spec.template.spec.serviceAccountName)' 2>/dev/null || true)
if [[ -z "${RUNTIME_SA:-}" ]]; then
  PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
  RUNTIME_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
  echo "rishte-api not found yet; using default compute SA: $RUNTIME_SA"
else
  echo "Detected runtime SA: $RUNTIME_SA"
fi
echo

create_secret() {
  local name="$1"
  echo "---"
  read -r -s -p "Paste value for $name (input hidden, press Enter to skip): " VAL
  echo
  if [[ -z "${VAL:-}" ]]; then
    echo "  empty input; skipping $name"
    unset VAL
    return
  fi

  if gcloud --project="$PROJECT_ID" secrets describe "$name" >/dev/null 2>&1; then
    echo "  secret $name exists; adding a new version"
    printf '%s' "$VAL" | gcloud --project="$PROJECT_ID" secrets versions add "$name" --data-file=-
  else
    echo "  creating secret $name"
    printf '%s' "$VAL" | gcloud --project="$PROJECT_ID" secrets create "$name" \
      --replication-policy=automatic \
      --data-file=-
  fi
  unset VAL

  gcloud --project="$PROJECT_ID" secrets add-iam-policy-binding "$name" \
    --member="serviceAccount:$RUNTIME_SA" \
    --role="roles/secretmanager.secretAccessor" >/dev/null
  echo "  granted secretAccessor to $RUNTIME_SA"
}

create_secret SUPABASE_URL
create_secret SUPABASE_SERVICE_ROLE_KEY
create_secret SUPABASE_DATABASE_URL
create_secret BULKSMS_API_ID
create_secret BULKSMS_API_PASSWORD
create_secret BULKSMS_SENDER_ID

echo
echo "==============================================="
echo "Done. Secrets created (or revisioned) in $PROJECT_ID."
echo "Cloud Run runtime SA $RUNTIME_SA can read them."
echo
echo "Next: run deploy-rishte.sh from the repo root to ship the backend."
echo "==============================================="
