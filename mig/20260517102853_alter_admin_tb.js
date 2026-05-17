/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('admin_tb', (table) => {
    table.dropColumn('level')
    table.uuid('employee_id').notNullable().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('password').notNullable().defaultTo('')
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('admin_tb', (table) => {
    table.dropColumn('employee_id')
    table.dropColumn('password')
    table.integer('level').notNullable().defaultTo(1)
  })
}