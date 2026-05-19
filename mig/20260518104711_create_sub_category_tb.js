/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 * */
exports.up = async function(knex) {

    await knex.schema.createTable('subcategories_tb', (table) => {

        table.increments('id').primary()

        table.integer('category_id')
            .unsigned()
            .references('id')
            .inTable('categories')
            .onDelete('CASCADE')

        table.string('name', 255).notNullable()

        table.string('slug', 255)
            .notNullable()
            .unique()

        table.text('description')

        table.string('image_url')

        table.boolean('is_active')
            .defaultTo(true)

        table.timestamp('created_at')
            .defaultTo(knex.fn.now())

        table.timestamp('updated_at')
            .defaultTo(knex.fn.now())

        table.timestamp('deleted_at')
            .nullable()

    })

}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {

    await knex.schema.dropTableIfExists('subcategories_tb')

}
