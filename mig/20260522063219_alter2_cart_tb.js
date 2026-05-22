exports.up = async function (knex) {
  await knex.schema.alterTable('cart_tb', (table) => {
    table.dropUnique(['email'])
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('cart_tb', (table) => {
    table.unique(['email'])
  })
}