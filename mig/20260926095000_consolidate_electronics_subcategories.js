exports.up = async function (knex) {
  await knex.transaction(async (trx) => {
    const electronics = await trx('categories').whereRaw('lower(name) = ?', ['electronics']).first()
    if (!electronics) return
    const oldHeadphones = await trx('subcategories_tb').where({ category_id: electronics.id, slug: 'head-phones' }).first()
    const newHeadphones = await trx('subcategories_tb').where({ category_id: electronics.id, slug: 'headphones' }).first()
    const oldWatch = await trx('subcategories_tb').where({ category_id: electronics.id, slug: 'smart-watches' }).first()
    const newWatch = await trx('subcategories_tb').where({ category_id: electronics.id, slug: 'smartwatch' }).first()

    if (oldHeadphones && newHeadphones) {
      await trx('subcategories_tb').where({ id: newHeadphones.id }).update({ slug: 'headphones-duplicate' })
      await trx('product_tb').where({ sub_category_id: newHeadphones.id }).update({ sub_category_id: oldHeadphones.id })
      await trx('subcategories_tb').where({ id: oldHeadphones.id }).update({ name: 'Headphones', slug: 'headphones' })
      await trx('subcategories_tb').where({ id: newHeadphones.id }).del()
    }
    if (oldWatch && newWatch) {
      await trx('subcategories_tb').where({ id: newWatch.id }).update({ slug: 'smartwatch-duplicate' })
      await trx('product_tb').where({ sub_category_id: newWatch.id }).update({ sub_category_id: oldWatch.id })
      await trx('subcategories_tb').where({ id: oldWatch.id }).update({ name: 'Smartwatch', slug: 'smartwatch' })
      await trx('subcategories_tb').where({ id: newWatch.id }).del()
    }
  })
}
exports.down = async function () {}