exports.up = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table.bigInteger('price(usd)').notNullable().defaultTo(0)
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table.dropColumn('price(usd)')
  })
}