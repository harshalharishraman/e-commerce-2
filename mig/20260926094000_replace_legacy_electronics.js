const rename = [
  ['Sony WH-1000XM6 The Best Wireless Noise Canceling Headphones, HD NC Processor QN3, 12 Microphones, Adaptive NC Optimizer, Mastered by Engineers, Studio-Quality- Midnight Blue', 'Sony WH-1000XM6'],
  ['Samsung Galaxy S25 Ultra 5G AI Smartphone (Titanium Silverblue, 12GB RAM, 256GB Storage), 200MP Camera, 5000mAh Ultra Long Battery, QHD+ Dynamic AMOLED 2X, Galaxy AI, Knox Security, S Pen Included', 'Samsung Galaxy S25 Ultra'],
  ['Amazfit T-Rex 3 Pro Outdoor Smart Watch 44mm Sapphire AMOLED Display with Flashlight, Ti Bezel, Dual Band GPS, Offline Maps, 17 Days Battery, 10 ATM, 180+ Sports Mode for Android & iPhone, Arctic Gold', 'Amazfit T-Rex 3 Pro']
]
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
exports.up = async function (knex) {
  await knex.transaction(async (trx) => {
    const electronics = await trx('categories').whereRaw('lower(name) = ?', ['electronics']).first()
    if (!electronics) return
    for (const [oldName, newName] of rename) {
      await trx('product_tb').where({ category_id: electronics.id, name: oldName }).update({ name: newName, slug: slug(newName) })
    }
    const keep = [
      'Sony WH-1000XM6',
      'Amazfit T-Rex 3 Pro',
      'Samsung Galaxy S25 Ultra',
      'iPhone 18 Pro (256 GB) - Silver',
      'Samsung Galaxy S24 Ultra',
      'Nothing Phone 4a (8GB 128GB Black)',
      'Nothing Phone (4b), White (8GB, 128GB)'
    ]
    await trx('product_tb').where({ category_id: electronics.id }).whereNotIn('name', keep).del()
  })
}
exports.down = async function () {}