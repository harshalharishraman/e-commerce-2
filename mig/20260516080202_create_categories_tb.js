/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async function(knex) {

  await knex.schema.createTable('categories', (t) => {

    // PRIMARY KEY
    t.increments('id')
      .primary();

    // CATEGORY NAME
    t.string('name')
      .notNullable();

    // URL FRIENDLY VERSION
    t.string('slug')
      .unique()
      .notNullable();

  });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = async function(knex) {

  await knex.schema.dropTableIfExists('categories');

};