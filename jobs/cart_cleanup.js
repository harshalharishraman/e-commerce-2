const knexConfig = require('../knexfile')
const knex = require('knex')(knexConfig)
const cron = require('node-cron')

cron.schedule('0 * * * *', async () => {
  const startedAt = Date.now()

  try {
    const result = await knex.transaction(async (trx) => {
      return trx.raw(`
        WITH expired_carts AS (
          SELECT id
          FROM cart_tb
          WHERE status = 'active'
            AND updated_at < NOW() - INTERVAL '2 hours'
        ),
        item_totals AS (
          SELECT cart_items_tb.product_id, SUM(cart_items_tb.quantity) AS quantity
          FROM cart_items_tb
          INNER JOIN expired_carts ON expired_carts.id = cart_items_tb.cart_id
          GROUP BY cart_items_tb.product_id
        ),
        restored_products AS (
          UPDATE product_tb
          SET stock = product_tb.stock + item_totals.quantity
          FROM item_totals
          WHERE product_tb.id = item_totals.product_id
          RETURNING product_tb.id
        ),
        abandoned_carts AS (
          UPDATE cart_tb
          SET status = 'abandoned', updated_at = NOW()
          FROM expired_carts
          WHERE cart_tb.id = expired_carts.id
          RETURNING cart_tb.id
        )
        SELECT
          (SELECT COUNT(*) FROM abandoned_carts) AS abandoned_count,
          (SELECT COUNT(*) FROM restored_products) AS restored_product_count
      `)
    })

    const stats = result.rows[0]

    console.log(
      `[cart_cleanup] marked ${stats.abandoned_count} carts abandoned, restored ${stats.restored_product_count} products in ${Date.now() - startedAt}ms`
    )

  } catch (error) {
    console.error('[cart_cleanup] error:', error)
  }
}, {
  timezone: 'Asia/Kolkata',
  noOverlap: true
})
