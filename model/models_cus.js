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
}
module.exports=models_cus