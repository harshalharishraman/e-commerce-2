exports.up = async function (knex) {
  await knex.schema.alterTable('orders_tb', (table) => {
    table.dropPrimary()
    table.dropColumn('id')
  })
  await knex.schema.alterTable('orders_tb', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('orders_tb', (table) => {
    table.dropPrimary()
    table.dropColumn('id')
  })
  await knex.schema.alterTable('orders_tb', (table) => {
    table.increments('id').primary()
  })
}