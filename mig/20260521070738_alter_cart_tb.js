exports.up = async function (knex) {
  await knex.schema.alterTable('cart_tb', (table) => {
    table.dropUnique(['user_id'])        // drop unique constraint first before dropping column
    table.dropColumn('user_id')
    table.string('email').notNullable().defaultTo('').unique()
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('cart_tb', (table) => {
    table.dropUnique(['email'])
    table.dropColumn('email')
    table.uuid('user_id').notNullable().defaultTo('').unique()
  })
}