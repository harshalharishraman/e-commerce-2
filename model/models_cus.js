const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const re_cus = require('../resvo/resvo_cus');
const b=require('bcrypt')
const tk=require('../token/token_cus')
const jwt=require('jsonwebtoken')
const enc=require('bcrypt')

class models_cus{
static async model_signup_cus(n,em,p,ma,sa,d){
    try{
        const enc_p=await enc.hash(p,10)
    const new_account=await knex('ecom2_cus_tb').insert({
        name:n,
        email:em,
        password:enc_p,
        main_address:ma,
        secondary_address:sa,
        DOB:d
    });
    return new_account

    }
    catch(error){
      console.error(error)
      throw error
    }
}

static async model_login_cus(n,e,p){
    try {
        const account=await knex('ecom2_cus_tb').where({name:n,email:e}).first()
        const pass_check=await enc.compare(p,account.password)
        if(pass_check){
            return account
        }
        return false
    } catch (error) {
        console.error(error)
        throw error
    }
}

static async if_email_exist(e){
        try{
            const u=await knex('ecom2_cus_tb').where({email:e}).first();
            return u
        }catch(error){
            console.error('error in retriving data of such email');
            throw error
        }
}

static async model_cart_add(dec_email, name, qty = 1) {
  const trans = await knex.transaction()
  try {
    qty = Number(qty)
    if (!Number.isInteger(qty) || qty < 1) { await trans.rollback(); return { success: false, message: 'quantity must be a positive integer' } }
    const product = await trans('product_tb').where({ name }).first()
    if (!product) { await trans.rollback(); return { success: false, message: `no product with name: ${name} exists` } }
    if (Number(product.stock) < qty) { await trans.rollback(); return { success: false, message: 'not enough stock of product exists' } }
    let cart = await trans('cart_tb').where({ email: dec_email, status: 'active' }).first()
    if (!cart) [cart] = await trans('cart_tb').insert({ email: dec_email, status: 'active' }).returning('*')
    const existing = await trans('cart_items_tb').where({ cart_id: cart.id, product_id: product.id }).first()
    let added
    if (existing) {
      ;[added] = await trans('cart_items_tb').where({ id: existing.id }).update({ quantity: existing.quantity + qty, price: product.price_usd }).returning('*')
    } else {
      ;[added] = await trans('cart_items_tb').insert({ cart_id: cart.id, product_id: product.id, quantity: qty, price: product.price_usd }).returning('*')
    }
    await trans('product_tb').where({ id: product.id }).decrement('stock', qty)
    await trans.commit()
    return { success: true, message: `added to cart id: ${cart.id}`, data: added }
  } catch (error) { await trans.rollback(); throw error }
}
static async model_cart_del(dec_email, name, qty = 1) {
  const trans = await knex.transaction()
  try {
    qty = Number(qty)
    if (!Number.isInteger(qty) || qty < 1) { await trans.rollback(); return { success: false, message: 'quantity must be a positive integer' } }
    const product = await trans('product_tb').where({ name }).first()
    const cart = await trans('cart_tb').where({ email: dec_email, status: 'active' }).first()
    if (!product || !cart) { await trans.rollback(); return { success: false, message: 'product is not in the active cart' } }
    const item = await trans('cart_items_tb').where({ cart_id: cart.id, product_id: product.id }).first()
    if (!item) { await trans.rollback(); return { success: false, message: 'product is not in the active cart' } }
    const removed = Math.min(qty, item.quantity)
    if (item.quantity > removed) await trans('cart_items_tb').where({ id: item.id }).update({ quantity: item.quantity - removed })
    else await trans('cart_items_tb').where({ id: item.id }).del()
    await trans('product_tb').where({ id: product.id }).increment('stock', removed)
    await trans.commit()
    return { success: true, message: `updated cart id: ${cart.id}`, data: { product_id: product.id, quantity_removed: removed } }
  } catch (error) { await trans.rollback(); throw error }
}
static async model_cart_checkout(dec_email) {
  const trans = await knex.transaction()
  try {
    const cart = await trans('cart_tb').where({ email: dec_email, status: 'active' }).first()
    if (!cart) { await trans.rollback(); return { success: false, message: 'no active cart exist for this user' } }
    const cartItems = await trans('cart_items_tb').where({ cart_id: cart.id })
    if (!cartItems.length) { await trans.rollback(); return { success: false, message: 'cart is empty' } }
    const products = []
    let subtotal = 0
    let tax = 0
    for (const item of cartItems) {
      const product = await trans('product_tb').where({ id: item.product_id }).first()
      if (!product) throw new Error(`product ${item.product_id} no longer exists`)
      const price = Number(item.price ?? product.price_usd ?? 0)
      const quantity = Number(item.quantity)
      const category = String((await trans('categories').where({ id: product.category_id }).first())?.name || '').toLowerCase()
      const taxRate = /electronics/.test(category) ? 0.18 : 0
      const lineTotal = price * quantity
      const lineTax = taxRate ? lineTotal - (lineTotal / (1 + taxRate)) : 0
      const lineBeforeTax = lineTotal - lineTax
      subtotal += lineBeforeTax
      tax += lineTax
      products.push({ id: product.id, name: product.name, quantity, price, tax_rate: taxRate * 100, line_total: Math.round(lineTotal * 100) / 100, before_tax: Math.round(lineBeforeTax * 100) / 100 })
    }
    subtotal = Math.round(subtotal * 100) / 100
    tax = Math.round(tax * 100) / 100
        const grossTotal = Math.round((subtotal + tax) * 100) / 100
    const shipping = grossTotal >= 500 ? 0 : 100
    const final = Math.round((grossTotal + shipping) * 100) / 100
    const deliveryFrom = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)
    const deliveryTo = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10)
    await trans('cart_tb').where({ id: cart.id }).update({ status: 'converted_to_order' })
    const [order] = await trans('orders_tb').insert({ cart_id: cart.id, final_amt: Math.round(final) }).returning('*')
    const user = await trans('ecom2_cus_tb').where({ email: dec_email }).first()
    await trans.commit()
    return { success: true, message: 'checkout successful', data: {
      order_id: order.id, shipping_address: user?.secondary_address || '', products,
      cost: subtotal, gst: tax, shipping_cost: shipping, final_cost: final,
      delivery_from: deliveryFrom, delivery_to: deliveryTo, delivery_window: '9:00 AM - 7:00 PM'
    } }
  } catch (error) { await trans.rollback(); throw error }
}}
module.exports=models_cus