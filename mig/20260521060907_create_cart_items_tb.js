// migration 2 — cart_items_tb
exports.up = async function (knex) {
  await knex.schema.createTable('cart_items_tb', (table) => {
    table.increments('id').primary()
    table.integer('cart_id').notNullable()
      .references('id').inTable('cart_tb').onDelete('CASCADE')
    table.integer('product_id').notNullable()
      .references('id').inTable('product_tb').onDelete('CASCADE')
    table.integer('quantity').notNullable().defaultTo(1)
    table.timestamps(true, true)
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('cart_items_tb')
}