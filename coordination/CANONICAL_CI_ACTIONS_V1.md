# Canonical CI Actions v1

> Read first: `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`

Branch: `canonical-ci-actions-v1`  
Target: `integration-staging`

## Scope

CI runtime maintenance only for the single canonical FATIKHAN site.

## Changes

All active workflows now use the current major official GitHub actions:

- `actions/checkout@v7`
- `actions/setup-node@v7`

Affected workflows:

- `build-canonical-staging.yml`
- `deploy-commerce-preview.yml`
- `deploy-frontend-production.yml`
- `integration-staging-verify.yml`

## Why

The previous v4/v5 actions emitted Node runtime deprecation warnings on current GitHub-hosted runners.

No site code, cinematic media, catalog, checkout, commerce behavior, D1/R2 schema, or deployment target changes are included.

## Acceptance

The integration PR must pass:
- canonical FATIKHAN quality;
- static smoke;
- commerce integration;
- payment lifecycle regression.

Production deploy remains gated by the existing Cloudflare credential and live-route checks.
