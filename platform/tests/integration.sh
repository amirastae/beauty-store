#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-http://127.0.0.1:8787}"
fail(){ echo "FAIL: $*" >&2; exit 1; }

health="$(curl -fsS "$BASE/api/v1/health")"
printf '%s\n' "$health" | grep -q '"ok":true' || fail "health"

products="$(curl -fsS "$BASE/api/v1/products?limit=8")"
printf '%s\n' "$products" | grep -q 'Luminous Barrier Serum' || fail "catalog"

cart="$(curl -fsS -X POST "$BASE/api/v1/carts" -H 'content-type: application/json' -d '{}')"
cart_id="$(printf '%s' "$cart" | python3 -c 'import json,sys; print(json.load(sys.stdin)["data"]["id"])')"
[ -n "$cart_id" ] || fail "cart create"

curl -fsS -X POST "$BASE/api/v1/carts/$cart_id/items"   -H 'content-type: application/json'   -d '{"variant_id":"var_serum_std","quantity":2}' >/tmp/veloura-add.json

before="$(curl -fsS "$BASE/api/v1/inventory/var_serum_std")"
printf '%s\n' "$before" | grep -q '"available":100' || fail "inventory before checkout"

idem="it-$(date +%s)-$RANDOM-$RANDOM"
payload='{"email":"qa@example.com","shipping_address":{"full_name":"QA User","line1":"Test Street 1","city":"Frankfurt","postal_code":"60311","country_code":"DE"}}'

first="$(curl -fsS -X POST "$BASE/api/v1/checkout/$cart_id"   -H 'content-type: application/json'   -H "Idempotency-Key: $idem"   -d "$payload")"
printf '%s\n' "$first" | grep -q '"payment_status":"requires_provider"' || fail "checkout"

second="$(curl -fsS -X POST "$BASE/api/v1/checkout/$cart_id"   -H 'content-type: application/json'   -H "Idempotency-Key: $idem"   -d "$payload")"
[ "$first" = "$second" ] || fail "idempotent response mismatch"

after="$(curl -fsS "$BASE/api/v1/inventory/var_serum_std")"
printf '%s\n' "$after" | grep -q '"available":98' || fail "inventory after checkout"

echo "INTEGRATION_PASS"
echo "CART=$cart_id"
echo "IDEMPOTENCY=$idem"
