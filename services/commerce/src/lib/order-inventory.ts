import type { Env } from '../env'

type ReservedOrderLine = {
  variant_id: string | null
  quantity: number
}

function eventId() {
  return 'inv_' + crypto.randomUUID().replaceAll('-', '')
}

async function linesForOrder(db: D1Database, orderId: string) {
  const result = await db.prepare(
    `SELECT variant_id, quantity FROM order_items WHERE order_id = ?`
  ).bind(orderId).all<ReservedOrderLine>()
  return result.results.filter((line): line is ReservedOrderLine & { variant_id: string } => Boolean(line.variant_id))
}

export async function releaseOrderReservation(db: D1Database, orderId: string, reason: string) {
  const lines = await linesForOrder(db, orderId)
  if (!lines.length) return

  const now = new Date().toISOString()
  const statements: D1PreparedStatement[] = []

  for (const line of lines) {
    statements.push(
      db.prepare(
        `UPDATE inventory_items
         SET reserved = MAX(reserved - ?, 0), updated_at = ?
         WHERE variant_id = ?`
      ).bind(line.quantity, now, line.variant_id)
    )
    statements.push(
      db.prepare(
        `INSERT INTO inventory_events
         (id, variant_id, event_type, quantity, reference_type, reference_id, metadata_json, created_at)
         VALUES (?, ?, 'release', ?, 'order', ?, ?, ?)`
      ).bind(eventId(), line.variant_id, line.quantity, orderId, JSON.stringify({ reason }), now)
    )
  }

  await db.batch(statements)
}

export async function finalizeOrderInventory(db: D1Database, orderId: string) {
  const lines = await linesForOrder(db, orderId)
  if (!lines.length) return

  for (const line of lines) {
    const inventory = await db.prepare(
      `SELECT stock_on_hand, reserved FROM inventory_items WHERE variant_id = ? LIMIT 1`
    ).bind(line.variant_id).first<{ stock_on_hand: number; reserved: number }>()

    if (!inventory || inventory.stock_on_hand < line.quantity || inventory.reserved < line.quantity) {
      throw new Error('INVENTORY_FINALIZE_INVARIANT:' + line.variant_id)
    }
  }

  const now = new Date().toISOString()
  const statements: D1PreparedStatement[] = []

  for (const line of lines) {
    statements.push(
      db.prepare(
        `UPDATE inventory_items
         SET stock_on_hand = stock_on_hand - ?, reserved = reserved - ?, updated_at = ?
         WHERE variant_id = ? AND stock_on_hand >= ? AND reserved >= ?`
      ).bind(line.quantity, line.quantity, now, line.variant_id, line.quantity, line.quantity)
    )
    statements.push(
      db.prepare(
        `INSERT INTO inventory_events
         (id, variant_id, event_type, quantity, reference_type, reference_id, metadata_json, created_at)
         VALUES (?, ?, 'stock_out', ?, 'order', ?, '{}', ?)`
      ).bind(eventId(), line.variant_id, line.quantity, orderId, now)
    )
  }

  await db.batch(statements)
}

export async function expireOrder(db: D1Database, orderId: string, reason = 'payment_expired') {
  const now = new Date().toISOString()
  const claim = await db.prepare(
    `UPDATE orders SET status = 'expiring', updated_at = ?
     WHERE id = ? AND status = 'pending' AND payment_status = 'unpaid'`
  ).bind(now, orderId).run()

  if ((claim.meta.changes ?? 0) !== 1) return false

  try {
    await releaseOrderReservation(db, orderId, reason)
    await db.batch([
      db.prepare(
        `UPDATE payments SET status = 'expired', updated_at = ?
         WHERE order_id = ? AND status <> 'paid'`
      ).bind(now, orderId),
      db.prepare(
        `UPDATE orders SET status = 'cancelled', payment_status = 'expired', updated_at = ?
         WHERE id = ? AND status = 'expiring'`
      ).bind(now, orderId),
      db.prepare(
        `INSERT INTO outbox_events
         (id, event_type, aggregate_type, aggregate_id, payload_json, status, attempts, available_at, created_at)
         VALUES (?, 'order.expired', 'order', ?, ?, 'pending', 0, ?, ?)`
      ).bind(
        'evt_' + crypto.randomUUID().replaceAll('-', ''),
        orderId,
        JSON.stringify({ order_id: orderId, reason }),
        now,
        now
      )
    ])
    return true
  } catch (error) {
    await db.prepare(
      `UPDATE orders SET status = 'pending', updated_at = ? WHERE id = ? AND status = 'expiring'`
    ).bind(new Date().toISOString(), orderId).run()
    throw error
  }
}

export async function releaseExpiredOrders(env: Env) {
  const db = env.DB
  if (!db) return { scanned: 0, released: 0 }

  const now = new Date().toISOString()
  const result = await db.prepare(
    `SELECT id FROM orders
     WHERE status = 'pending'
       AND payment_status = 'unpaid'
       AND payment_expires_at IS NOT NULL
       AND payment_expires_at <= ?
     ORDER BY payment_expires_at ASC
     LIMIT 50`
  ).bind(now).all<{ id: string }>()

  let released = 0
  for (const row of result.results) {
    if (await expireOrder(db, row.id)) released++
  }

  const receiptCleanup = await db.prepare(
    `DELETE FROM order_receipts
     WHERE expires_at IS NOT NULL AND expires_at <= ?`
  ).bind(now).run()

  return {
    scanned: result.results.length,
    released,
    receipts_cleaned: receiptCleanup.meta.changes ?? 0
  }
}
