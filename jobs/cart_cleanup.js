const knexConfig = require('../knexfile')
const knex = require('knex')(knexConfig)
const cron=require('node-cron')
cron.schedule('0 * * * *', async () => {
  try {
    const updated = await knex('cart_tb')
      .where({ status: 'active' })
      .andWhere('updated_at', '<', knex.raw("NOW() - INTERVAL '2 hours'"))
      .update({ status: 'abandoned' })

    console.log(`[cart_cleanup] marked ${updated} carts as abandoned`)

  } catch (error) {
    console.error('[cart_cleanup] error:', error)
  }
})