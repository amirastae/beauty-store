#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-http://127.0.0.1:8787}"
fail(){ echo "FAIL: $*" >&2; exit 1; }

json_get(){
  python3 -c "import json,sys; print(json.load(sys.stdin)$1)"
}

health="$(curl -fsS "$BASE/api/v1/health")"
printf '%s\n' "$health" | grep -q '"ok":true' || fail "health"

products="$(curl -fsS "$BASE/api/v1/products?limit=100")"
printf '%s\n' "$products" | grep -q 'Luminous Barrier Serum' || fail "base catalog"

v2="$(curl -fsS -X POST "$BASE/api/v1/compat/veloura-v2/resolve"   -H 'content-type: application/json'   -d '{"product_id":"lip-velvet-01","shade_id":"rose"}')"
printf '%s\n' "$v2" | grep -q '"variant_id":"var_v2_lip_rose"' || fail "veloura v2 resolver"
printf '%s\n' "$v2" | grep -q '"currency_code":"IRR"' || fail "veloura v2 currency"

v21_last="$(curl -fsS -X POST "$BASE/api/v1/compat/veloura-v2/resolve" \
  -H 'content-type: application/json' \
  -d '{"product_id":"veloura-56"}')"
printf '%s\n' "$v21_last" | grep -q '"variant_id":"var_v21_56_default"' || fail "full v2.1 catalog resolver"
printf '%s\n' "$v21_last" | grep -q '"currency_code":"IRR"' || fail "full v2.1 catalog currency"

v21_shade="$(curl -fsS -X POST "$BASE/api/v1/compat/veloura-v2/resolve" \
  -H 'content-type: application/json' \
  -d '{"product_id":"veloura-21","shade_id":"deep"}')"
printf '%s\n' "$v21_shade" | grep -q '"variant_id":"var_v21_21_deep"' || fail "v2.1 shade resolver"

shop="$(curl -fsS -X POST "$BASE/api/v1/compat/shop-v1/resolve"   -H 'content-type: application/json'   -d '{"product_id":1}')"
printf '%s\n' "$shop" | grep -q '"variant_id":"var_shop_1_default"' || fail "shop v1 resolver"
printf '%s\n' "$shop" | grep -q '"currency_code":"USD"' || fail "shop v1 currency"

cart="$(curl -fsS -X POST "$BASE/api/v1/carts" -H 'content-type: application/json' -d '{"currency_code":"USD"}')"
cart_id="$(printf '%s' "$cart" | python3 -c 'import json,sys; print(json.load(sys.stdin)["data"]["id"])')"
[ -n "$cart_id" ] || fail "USD cart create"

curl -fsS -X POST "$BASE/api/v1/carts/$cart_id/items"   -H 'content-type: application/json'   -d '{"variant_id":"var_serum_std","quantity":2}' >/tmp/veloura-add.json

before="$(curl -fsS "$BASE/api/v1/inventory/var_serum_std")"
before_available="$(printf '%s' "$before" | python3 -c 'import json,sys; print(json.load(sys.stdin)["data"]["available"])')"
[ "$before_available" -ge 2 ] || fail "inventory before checkout"

code="$(curl -sS -o /tmp/currency-mismatch.json -w '%{http_code}' -X POST "$BASE/api/v1/carts/$cart_id/items"   -H 'content-type: application/json'   -d '{"variant_id":"var_v2_lip_rose","quantity":1}')"
[ "$code" = "409" ] || fail "mixed currency must be rejected"
grep -q 'CURRENCY_MISMATCH' /tmp/currency-mismatch.json || fail "currency mismatch code"

idem="it-$(date +%s)-$RANDOM-$RANDOM"
payload='{"email":"qa@example.com","shipping_address":{"full_name":"QA User","line1":"Test Street 1","city":"Frankfurt","postal_code":"60311","country_code":"DE"}}'

first="$(curl -fsS -X POST "$BASE/api/v1/checkout/$cart_id"   -H 'content-type: application/json'   -H "Idempotency-Key: $idem"   -d "$payload")"
printf '%s\n' "$first" | grep -q '"payment_status":"requires_provider"' || fail "checkout"
printf '%s\n' "$first" | grep -q '"shipping_minor":0' || fail "USD shipping policy"

second="$(curl -fsS -X POST "$BASE/api/v1/checkout/$cart_id"   -H 'content-type: application/json'   -H "Idempotency-Key: $idem"   -d "$payload")"
[ "$first" = "$second" ] || fail "idempotent response mismatch"

reuse_code="$(curl -sS -o /tmp/idem-reuse.json -w '%{http_code}' -X POST "$BASE/api/v1/checkout/$cart_id"   -H 'content-type: application/json'   -H "Idempotency-Key: $idem"   -d '{"email":"other@example.com","shipping_address":{"full_name":"Other","line1":"Other 2","city":"Berlin","postal_code":"10115","country_code":"DE"}}')"
[ "$reuse_code" = "409" ] || fail "idempotency payload reuse must be rejected"
grep -q 'IDEMPOTENCY_KEY_REUSED' /tmp/idem-reuse.json || fail "idempotency reuse code"

after="$(curl -fsS "$BASE/api/v1/inventory/var_serum_std")"
after_available="$(printf '%s' "$after" | python3 -c 'import json,sys; print(json.load(sys.stdin)["data"]["available"])')"
expected_after=$((before_available - 2))
[ "$after_available" -eq "$expected_after" ] || fail "inventory after checkout"

irr_cart="$(curl -fsS -X POST "$BASE/api/v1/carts" -H 'content-type: application/json' -d '{"currency_code":"IRR"}')"
irr_cart_id="$(printf '%s' "$irr_cart" | python3 -c 'import json,sys; print(json.load(sys.stdin)["data"]["id"])')"
curl -fsS -X POST "$BASE/api/v1/carts/$irr_cart_id/items"   -H 'content-type: application/json'   -d '{"variant_id":"var_v2_lip_rose","quantity":1}' >/tmp/veloura-irr-add.json
irr_state="$(curl -fsS "$BASE/api/v1/carts/$irr_cart_id")"
printf '%s\n' "$irr_state" | grep -q '"currency_code":"IRR"' || fail "IRR cart currency"
printf '%s\n' "$irr_state" | grep -q '"unit_price_minor":18900000' || fail "IRR server price"

irr_idem="it-irr-$(date +%s)-$RANDOM-$RANDOM"
irr_payload='{"phone":"۰۹۱۲۱۲۳۴۵۶۷","shipping_address":{"full_name":"کاربر تست","line1":"خیابان تست","city":"تهران","postal_code":"1234567890","country_code":"IR"}}'
irr_checkout="$(curl -fsS -X POST "$BASE/api/v1/checkout/$irr_cart_id"   -H 'content-type: application/json'   -H "Idempotency-Key: $irr_idem"   -d "$irr_payload")"
printf '%s\n' "$irr_checkout" | grep -q '"payment_status":"requires_provider"' || fail "IRR phone-only checkout"
printf '%s\n' "$irr_checkout" | grep -q '"shipping_minor":1200000' || fail "IRR shipping policy"
printf '%s\n' "$irr_checkout" | grep -q '"total_minor":20100000' || fail "IRR checkout total"

irr_order_id="$(printf '%s' "$irr_checkout" | python3 -c 'import json,sys; print(json.load(sys.stdin)["data"]["order_id"])')"
payment_code="$(curl -sS -o /tmp/payment-unconfigured.json -w '%{http_code}' -X POST "$BASE/api/v1/payments/$irr_order_id/start" -H 'content-type: application/json')"
[ "$payment_code" = "503" ] || fail "disabled payment provider must return 503"
grep -q 'PAYMENT_PROVIDER_NOT_CONFIGURED' /tmp/payment-unconfigured.json || fail "disabled payment provider code"

echo "INTEGRATION_PASS"
echo "USD_CART=$cart_id"
echo "IRR_CART=$irr_cart_id"
echo "IDEMPOTENCY=$idem"
