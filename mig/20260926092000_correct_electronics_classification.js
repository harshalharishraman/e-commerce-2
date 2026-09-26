exports.up = async function (knex) {
  await knex.transaction(async (trx) => {
    const electronics = await trx('categories').whereRaw('lower(name) = ?', ['electronics']).first()
    if (!electronics) return
    const headphones = await trx('subcategories_tb').where({ category_id: electronics.id, slug: 'headphones' }).first()
    const smartwatch = await trx('subcategories_tb').where({ category_id: electronics.id, slug: 'smartwatch' }).first()
    const smartphones = await trx('subcategories_tb').where({ category_id: electronics.id, slug: 'smartphones' }).first()
    if (headphones) await trx('product_tb').where({ category_id: electronics.id }).whereILike('name', '%headphone%').update({ sub_category_id: headphones.id })
    if (smartwatch) await trx('product_tb').where({ category_id: electronics.id }).whereILike('name', '%watch%').update({ sub_category_id: smartwatch.id })
    if (smartphones) {
      await trx('product_tb').where({ category_id: electronics.id })
        .where((q) => q.whereILike('name', '%phone%').orWhereILike('name', '%galaxy%').orWhereILike('name', '%iphone%'))
        .whereRaw("lower(name) not like '%headphone%' and lower(name) not like '%watch%'")
        .update({ sub_category_id: smartphones.id })
    }
  })
}
exports.down = async function () {}