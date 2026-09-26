const electronics = [
  { name: 'Sony WH-1000XM6 The Best Wireless Noise Canceling Headphones, HD NC Processor QN3, 12 Microphones, Adaptive NC Optimizer, Mastered by Engineers, Studio-Quality- Midnight Blue', price: 39395, sub: 'headphones', description: 'The best noise cancellation with the HD Noise Canceling Processor QN3, twelve microphones, adaptive noise cancellation, studio-quality sound, ultra-clear calls, and a compact foldable carrying case.' },
  { name: 'Amazfit T-Rex 3 Pro Outdoor Smart Watch 44mm Sapphire AMOLED Display with Flashlight, Ti Bezel, Dual Band GPS, Offline Maps, 17 Days Battery, 10 ATM, 180+ Sports Mode for Android & iPhone, Arctic Gold', price: 34999, sub: 'smartwatch', description: 'Adventure-ready smartwatch with sapphire glass, a 3000-nit AMOLED display, titanium bezel, offline maps, dual-band GPS, 180+ sports modes, 10 ATM water resistance, and a built-in flashlight.' },
  { name: 'Samsung Galaxy S25 Ultra 5G AI Smartphone (Titanium Silverblue, 12GB RAM, 256GB Storage), 200MP Camera, 5000mAh Ultra Long Battery, QHD+ Dynamic AMOLED 2X, Galaxy AI, Knox Security, S Pen Included', price: 99999, sub: 'smartphones', description: 'Galaxy AI smartphone with Gemini Live, a 200MP camera, Snapdragon 8 Elite processor, 5000mAh battery, QHD+ Dynamic AMOLED 2X display, Samsung Knox security, and S Pen.' },
  { name: 'iPhone 18 Pro (256 GB) - Silver', price: 164900, sub: 'smartphones', description: 'Pro smartphone with a 6.3-inch Super Retina XDR display, ProMotion up to 120Hz, Ceramic Shield, 48MP Fusion camera, 18MP Center Stage camera, A20 Pro chip, and long battery life.' },
  { name: 'Samsung Galaxy S24 Ultra', price: 104999, sub: 'smartphones', description: 'Galaxy AI smartphone with a titanium frame, 17.25cm flat display, 200MP camera, Snapdragon 8 Gen 3 processor, S Pen, Knox protection, and Samsung Wallet.' },
  { name: 'Nothing Phone 4a (8GB 128GB Black)', price: 35990, sub: 'smartphones', description: 'Black Nothing Phone 4a with 8GB RAM and 128GB storage, designed for smooth multitasking, responsive everyday performance, and reliable entertainment.' },
  { name: 'Nothing Phone (4b), White (8GB, 128GB)', price: 32065, sub: 'smartphones', description: 'White smartphone with 8GB RAM, 128GB storage, Snapdragon 6 Gen 4, 50MP OIS main camera, 8MP ultra-wide camera, 120Hz AMOLED display, and a 6000mAh battery.' }
]
const decor = [
  ['Wooden Study Table', 26000, 'Crafted from premium solid wood for durability and stability, with a spacious scratch-resistant tabletop, integrated storage, and a comfortable working height.'],
  ['Modern Lounge Chair', 58000, 'Premium upholstery, high-density cushioning, a sturdy metal or hardwood frame, and a contoured ergonomic profile for comfortable living-room lounging.'],
  ['Modern Table Lamp', 499, 'Warm, flicker-free ambient light in a compact footprint, compatible with energy-efficient LED bulbs and built with a durable polymer or powder-coated metal body.'],
  ['Decorative Wall Art', 269, 'Vibrant wall art with protective water-resistant coating, lightweight backing, and pre-installed hooks or adhesive for easy mounting.']
]
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const imageUrl = (productSlug) => process.env.AWS_BUCKET_NAME && process.env.AWS_REGION ? 'https://' + process.env.AWS_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/sub-categories-images/catalog-' + productSlug + '.jpg' : 'local-catalog/' + productSlug + '.jpg'
exports.up = async function (knex) {
  await knex.transaction(async (trx) => {
    let electronicsCategory = await trx('categories').whereRaw('lower(name) = ?', ['electronics']).first()
    if (!electronicsCategory) { ;[electronicsCategory] = await trx('categories').insert({ name: 'Electronics', slug: 'electronics' }).returning('*') }
    for (const item of electronics) {
      let sub = await trx('subcategories_tb').where({ category_id: electronicsCategory.id, slug: item.sub }).first()
      if (!sub) { ;[sub] = await trx('subcategories_tb').insert({ category_id: electronicsCategory.id, name: item.sub === 'smartwatch' ? 'Smartwatch' : item.sub === 'smartphones' ? 'Smartphones' : 'Headphones', slug: item.sub, description: '' }).returning('*') }
      const productSlug = slug(item.name)
      const existing = await trx('product_tb').where({ slug: productSlug }).first()
      const values = { name: item.name, slug: productSlug, category_id: electronicsCategory.id, sub_category_id: sub.id, description: item.description, price_usd: item.price, brand: item.name.split(' ')[0] }
      if (existing) await trx('product_tb').where({ id: existing.id }).update(values)
      else await trx('product_tb').insert({ ...values, image_url: imageUrl(productSlug), stock: 25 })
    }
    let decorCategory = await trx('categories').whereRaw('lower(name) in (?, ?)', ['home decor', 'home & living']).first()
    if (!decorCategory) { ;[decorCategory] = await trx('categories').insert({ name: 'Home Decor', slug: 'home-decor' }).returning('*') }
    let decorSub = await trx('subcategories_tb').where({ category_id: decorCategory.id }).first()
    if (!decorSub) { ;[decorSub] = await trx('subcategories_tb').insert({ category_id: decorCategory.id, name: 'Home Decor', slug: 'home-decor', description: '' }).returning('*') }
    for (const [name, price, description] of decor) {
      const productSlug = slug(name)
      const existing = await trx('product_tb').where({ slug: productSlug }).first()
      const values = { name, slug: productSlug, category_id: decorCategory.id, sub_category_id: decorSub.id, description, price_usd: price }
      if (existing) await trx('product_tb').where({ id: existing.id }).update(values)
      else await trx('product_tb').insert({ ...values, image_url: imageUrl(productSlug), stock: 25, brand: '' })
    }
  })
}
exports.down = async function () {}