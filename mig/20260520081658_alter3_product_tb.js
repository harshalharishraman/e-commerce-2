exports.up = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table.string('name').notNullable().defaultTo('')
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table.dropColumn('name')
  })
}