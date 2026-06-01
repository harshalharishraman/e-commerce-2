exports.up = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table
      .integer('category_id')
      .unsigned()
      .references('id')
      .inTable('categories')
      .onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('product_tb', (table) => {
    table.dropForeign('category_id');
    table.dropColumn('category_id');
  });
};