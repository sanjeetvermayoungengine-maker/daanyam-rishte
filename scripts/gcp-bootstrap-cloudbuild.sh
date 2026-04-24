#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-daanyam-astroengine}"
REGION="${REGION:-asia-south1}"
REPOSITORY="${REPOSITORY:-daanyam-rishte}"
TRIGGER_CONFIG="${TRIGGER_CONFIG:-cloudbuild-trigger.yaml}"

gcloud config set project "$PROJECT_ID"

gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com

if ! gcloud artifacts repositories describe "$REPOSITORY" --location="$REGION" >/dev/null 2>&1; then
  gcloud artifacts repositories create "$REPOSITORY" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Docker images for daanyam-rishte"
fi

gcloud builds triggers import --source="$TRIGGER_CONFIG"

echo "Cloud Build bootstrap complete."
echo "Trigger now points at cloudbuild.yaml and images will push to:"
echo "$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/api:<tag>"
