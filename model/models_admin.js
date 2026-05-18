const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const re_cus = require('../resvo/resvo_cus');
const tk=require('../token/token_cus')
const jwt=require('jsonwebtoken')
const enc=require('bcrypt')

class models_admin{
    static async model_signup_admin(req,res){
        try {
            const {name,email,password,employee_id}=req.body
             const enc_p=await enc.hash(password,10)
             const enc_n=await enc.hash(name,10)
             //const enc_e=await enc.hash(email,10)
            
                const new_account=await knex('admin_tb').insert({
                    name:enc_n,
                    email:email,
                    password:enc_p,
                    employee_id:employee_id
                });
                return new_account
        } catch (error) {
            throw error
        }
    }

static async model_login_admin(n,e,p){
    try {
        const account=await knex('admin_tb').where({email:e}).first()
        const dec_name=await enc.compare(n,account.name)
        const dec_password=await enc.compare(p,account.password)
        if(dec_name  && dec_password){
        return account}
        
        else{
            return false
        }
        
    } catch (error) {
        throw error
    }
    

}


static async model_add_categories_admin(cat_list){
    const trans=await knex.transaction()
    try {
        const bulk=[]
        for(const i of cat_list){
            const new_slug=i.toLowerCase().replaceAll(' ','-')
            const exist=await trans('categories').where({slug:new_slug}).first()
            if(exist){
                throw new Error(`${new_slug} already exists in categories`) 
            }
            bulk.push({ name: i, slug: new_slug })}
            const inserted=await trans('categories').insert(bulk).returning('*')
            await trans.commit()
            return inserted
    } 
    
    catch (error) 
    {
      await trans.rollback();
    throw error;
    }
}

static async model_delete_categories_admin(del_list){

    const trans=await knex.transaction()
    try {
        const bulk=[]
        for(const i of del_list){
            
            const new_slug=i.toLowerCase().replaceAll(' ','-')
            const exist=await trans('categories').where({slug:new_slug}).first()
            if(!exist){
                await trans.rollback()
                return { success: false, message: `${i} doesn't exist in categories` }}
        
        bulk.push(new_slug)}
            await trans('categories').whereIn('slug',bulk).del()
            const new_tb=await trans('categories').select('*')
            await trans.commit()
            return new_tb
    } 
    
    catch (error) 
    {
      await trans.rollback();
    throw error;
    }

}

static async if_email_exist(e){
        try{
            const u=await knex('admin_tb').where({email:e}).first();
            return u
            }
        catch(error){
            console.error('error in retriving data of such email');
            throw error
        }
}


}


module.exports=models_admin