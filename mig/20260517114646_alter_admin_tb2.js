exports.up = async function (knex) {
  await knex.schema.alterTable('admin_tb', (table) => {
    table.string('employee_id').alter()
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('admin_tb', (table) => {
    table.uuid('employee_id').alter()
  })
}