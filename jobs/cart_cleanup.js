const knexConfig = require('../knexfile')
const knex = require('knex')(knexConfig)
const cron = require('node-cron')

cron.schedule('0 * * * *', async () => {

  const trx = await knex.transaction()

  try {

    // get expired active carts
    const expiredCarts = await trx('cart_tb')
      .where({ status: 'active' })
      .andWhere(
        'updated_at',
        '<',
        trx.raw("NOW() - INTERVAL '2 hours'")
      )

    // restore stock
    for (const cart of expiredCarts) {

      await trx('product_tb')
        .where({ id: cart.product_id })
        .increment('stock', cart.quantity)
    }

    // mark abandoned
    await trx('cart_tb')
      .where({ status: 'active' })
      .andWhere(
        'updated_at',
        '<',
        trx.raw("NOW() - INTERVAL '2 hours'")
      )
      .update({
        status: 'abandoned'
      })

    await trx.commit()

    console.log(
      `[cart_cleanup] marked ${expiredCarts.length} carts abandoned`
    )

  } catch (error) {

    await trx.rollback()

    console.error('[cart_cleanup] error:', error)
  }
})