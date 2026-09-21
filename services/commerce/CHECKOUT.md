# Checkout engine

The checkout route is intentionally provider-neutral. It creates a durable order snapshot and a payment record in `requires_provider` state, but it does not fake a successful payment.

## Flow

1. Require `Idempotency-Key`.
2. Validate open cart and customer email/address.
3. Reload line prices from the server-side cart.
4. Reserve inventory with conditional stock updates.
5. Build order + immutable line snapshots.
6. Create an unconfigured payment intent record.
7. Finalize inventory and mark cart completed in a D1 batch.
8. Persist the completed idempotent response.

If a reservation or checkout step fails before the final batch, reserved quantities are released.

## Provider adapter gate

A real provider adapter must later:
- create external payment intent,
- verify signed webhooks,
- transition `payments.status`,
- transition `orders.payment_status`,
- make webhook processing idempotent.

No secret keys belong in browser code or the repository.
