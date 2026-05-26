/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('product_tb', (table) => {

    table.increments('id').primary();

    table
      .integer('sub_category_id')
      .notNullable()
      .references('id')
      .inTable('subcategories_tb')
      .onDelete('CASCADE');

    table.text('image_url').notNullable();

    table.text('description').notNullable();

    table.bigInteger('stock').notNullable().defaultTo(0);

    table.timestamps(true, true); // created_at + updated_at
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('product_tb');
};