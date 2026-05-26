exports.up = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table.string('brand').notNullable().defaultTo('')
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table.dropColumn('brand')
  })
}