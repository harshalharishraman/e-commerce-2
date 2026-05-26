// migration 1 — cart_tb
exports.up = async function (knex) {
  await knex.schema.createTable('cart_tb', (table) => {
    table.increments('id').primary()
    table.uuid('user_id').notNullable()
      .references('id').inTable('ecom2_cus_tb').onDelete('CASCADE')
    table.unique(['user_id'])           // one cart per user at a time
    table.enu('status', ['active', 'abandoned', 'converted_to_order'])
      .notNullable().defaultTo('active')
    table.timestamps(true, true)
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('cart_tb')
}