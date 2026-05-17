/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('admin_tb', (table) => {

    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.string('name').notNullable();
    table.string('email').notNullable().unique();

    table.text('refresh_token').nullable();

    // 1 = moderator, 2 = admin, 3 = superadmin (define your own scale)
    table.integer('level').notNullable().defaultTo(1);

    table.timestamp('last_login_at').nullable();
    table.timestamps(true, true); // created_at + updated_at, auto default
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('admin_users');
};
