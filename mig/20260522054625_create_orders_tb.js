exports.up = async function (knex) {
  await knex.schema.createTable('orders_tb', (table) => {
    table.increments('id').primary()
    table.integer('cart_id').notNullable()
      .references('id').inTable('cart_tb').onDelete('CASCADE')
    table.bigInteger('final_amt').notNullable().defaultTo(0)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('orders_tb')
}