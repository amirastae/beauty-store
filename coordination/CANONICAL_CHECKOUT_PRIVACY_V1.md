# Canonical Checkout Privacy v1

> Read first: `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`

Branch: `canonical-checkout-privacy-v1`  
Target: `integration-staging`

## Scope

Narrow privacy hardening for the canonical FATIKHAN checkout only.

## Change

The checkout draft contains delivery PII:
- full name;
- mobile number;
- email;
- province/city;
- postal code;
- street address;
- order note.

Previously this draft was stored in persistent `localStorage`.

This patch:
- stores the draft in `sessionStorage` instead;
- migrates the old `veloura-checkout-draft-v2` value once if present;
- deletes the legacy persistent localStorage value;
- clears the session draft after authoritative `paid` status is returned;
- preserves pending-payment state behavior;
- leaves failed/cancelled drafts available in-session for retry.

## Not changed

- cinematic homepage/media/timeline;
- cart persistence;
- order idempotency;
- receipt-token verification;
- payment provider logic;
- D1/R2 schema or bindings.

## Acceptance

Canonical `npm run quality` + commerce integration/payment lifecycle regression must pass before merge.
