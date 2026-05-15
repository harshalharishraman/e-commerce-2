exports.up = async function(knex) {

  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  await knex.schema.createTable('ecom2_cus_tb', (t) => {

    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'))
      .notNullable();

    t.string('name').notNullable();

    t.string('email')
      .notNullable()
      .unique();

    t.string('password').notNullable();

    t.string('main_address');

    t.string('secondary_address');

    t.date('DOB');

    t.text('access_token');

    t.text('refresh_token');

    t.timestamps(true, true);
  });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('ecom2_cus_tb');
};