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

static async model_cart_add(dec_email, name, qty) {
  const trans = await knex.transaction()
  try {

    const product = await trans('product_tb').where({ name }).first()
    if (!product) {
      await trans.rollback()
      return { success: false, message: `no product with name: ${name} exists` }
    }

    let cart = await trans('cart_tb').where({ email: dec_email, status: 'active' }).first()
    if (!cart) {
      const [new_cart] = await trans('cart_tb')
        .insert({ email: dec_email, status: 'active' })
        .returning('*')
      cart = new_cart
    }

    const [added] = await trans('cart_items_tb').insert({
      cart_id:    cart.id,
      product_id: product.id,
      quantity:   qty,
      price:      product.price_usd
    }).returning('*')

    await trans.commit()
    return { success: true, message: `added to cart id: ${cart.id}`, data: added }

  } catch (error) {
    await trans.rollback()
    throw error
  }
}

static async model_cart_del(dec_email,name){
    const trans = await knex.transaction()
    try {
    const product = await trans('product_tb').where({ name }).first()
    if (!product) {
      await trans.rollback()
      return { success: false, message: `no product with name: ${name} exists` }
    }

    const cart = await trans('cart_tb').where({ email: dec_email, status: 'active' }).first()
    if (!cart) {
        await trans.rollback()
      return { success: false, message: `no active cart for this user exists` }
    }

    const check=await trans('cart_items_tb').where({cart_id:cart.id,product_id:product.id}).del().returning('*')
    
    if(!check){
        await trans.rollback()
        return { success: false, message: `product doesn't exist in this active cart` }
    }
    await trans.commit()
    return { success: true, message: `deleted from cart id: ${cart.id}`, data: check}


    } 
    
    catch (error) {
        throw error
    }
}
}
module.exports=models_cus