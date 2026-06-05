exports.up = async function (knex) {
    await knex.schema.createTable('otp_tb', (table) => {

        table.increments('id').primary();
        table.string('email', 255).notNullable().index()
        table.string('otp_hash').notNullable();
        table.timestamp('expires_at').notNullable();
        table.integer('attempts').notNullable().defaultTo(0);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('otp_tb');
};