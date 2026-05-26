exports.up = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table.renameColumn('price(usd)', 'price_usd')
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table.renameColumn('price_usd', 'price(usd)')
  })
}