# Local integration test

This directory can be tested without a Cloudflare account.

## 1. Install

```bash
npm install
```

## 2. Create local D1 state

```bash
npx wrangler d1 migrations apply VELOURA_DB --local
npx wrangler d1 execute VELOURA_DB --local --file=db/seed.sql
```

## 3. Start local Worker

```bash
npx wrangler dev --local --ip 127.0.0.1 --port 8787
```

## 4. Run integration test in another shell

```bash
./tests/integration.sh
```

The test verifies health, catalog reads, cart creation, cart mutation, inventory, checkout, and repeat-idempotency behavior.
