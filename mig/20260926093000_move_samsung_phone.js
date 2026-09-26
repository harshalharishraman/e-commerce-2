exports.up = async function (knex) {
  await knex.transaction(async (trx) => {
    const electronics = await trx('categories').whereRaw('lower(name) = ?', ['electronics']).first()
    const smartphones = electronics && await trx('subcategories_tb').where({ category_id: electronics.id, slug: 'smartphones' }).first()
    if (smartphones) await trx('product_tb').where({ category_id: electronics.id }).whereRaw("lower(name) like 'samsung s%'").update({ sub_category_id: smartphones.id })
  })
}
exports.down = async function () {}