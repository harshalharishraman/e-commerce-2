exports.up = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table.string('slug').notNullable().defaultTo('')
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table.dropColumn('slug')
  })
}