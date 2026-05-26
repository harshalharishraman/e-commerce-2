exports.up = async function (knex) {
  await knex.schema.alterTable('cart_items_tb', (table) => {
    table.bigInteger('price').notNullable().defaultTo(0)
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('cart_items_tb', (table) => {
    table.dropColumn('price')
  })
}