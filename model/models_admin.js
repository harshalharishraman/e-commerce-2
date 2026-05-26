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
        await knex('admin_tb').where({ email:e}).update({
        last_login_at: knex.fn.now()})
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


static async model_update_categories_admin(to_upd_list,new_list){

    const trans=await knex.transaction()
    try {
        for(const i of to_upd_list){
            const exist=await trans('categories').where({name:i}).first()
            if(!exist){
                return { success: false, message: `${i} doesn't exist in categories` }}
        }
        for(let i=0;i < to_upd_list.length;i++){
            const new_slug=await new_list[i].toLowerCase().replaceAll(' ','-')
            await trans('categories').where({name:to_upd_list[i]})
            .update({name:new_list[i],slug:new_slug})
        }
            const new_tb=await trans('categories').select('*')
            await trans.commit()
            return { success: true, data: new_tb }
    } 
    
    catch (error) 
    {
      await trans.rollback();
    throw error;
    }

}


static async model_add_sub_categories_admin(names,cat_ids){
const trans=await knex.transaction()
    try {
        const bulk=[]
        let x=0
        for(const i of names){
            const new_slug=i.toLowerCase().replaceAll(' ','-')
            const exist=await trans('subcategories_tb').where({slug:new_slug,category_id:cat_ids[x]}).first()
            if(exist){
                x++;
             await trans.rollback()
                return { success: false, message: `${i} doesn't exist in categories` }}
            bulk.push({ name: i, slug: new_slug ,category_id:cat_ids[x]});
        x++;}
            const inserted=await trans('subcategories_tb').insert(bulk).returning('*')
            await trans.commit()
            return {success:true,data:inserted}
    } 
    
    catch (error) 
    {
      await trans.rollback();
    throw error;
    }


}

static async model_del_sub_categories_admin(to_del){
        const trans=await knex.transaction()
    try {
        const bulk=[]
        for(const i of to_del){
            
            const new_slug=i.toLowerCase().replaceAll(' ','-')
            const exist=await trans('subcategories_tb').where({slug:new_slug}).first()
            if(!exist){
                await trans.rollback()
                return { success: false, message: `${i} doesn't exist in categories` }}
        
        bulk.push(new_slug)}
            await trans('subcategories_tb').whereIn('slug',bulk).del()
            const new_tb=await trans('subcategories_tb').select('name')
            await trans.commit()
            return {success:true,data:new_tb}
    } 
    
    catch (error) 
    {
      await trans.rollback();
    throw error;
    }
}

static async model_update_sub_categories_admin(to_upd,new_names){

const trans=await knex.transaction()
    try {
        for(const i of to_upd){
            const exist=await trans('subcategories_tb').where({name:i}).first()
            if(!exist){
                await trans.rollback();
                return { success: false, message: `${i} doesn't exist in categories` }}
        }
        for(let i=0;i < to_upd.length;i++){
            const new_slug=await new_names[i].toLowerCase().replaceAll(' ','-')
            await trans('subcategories_tb').where({name:to_upd[i]})
            .update({name:new_names[i],slug:new_slug})
        }
            const new_tb=await trans('subcategories_tb').select('name')
            await trans.commit()
            return { success: true, data: new_tb }
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

static async model_add_products_admin(prod, img_url, stock, brand, desc,price, cid, sid){
const trans=await knex.transaction()
    try {
        const bulk=[]
        let x=0
        const exist0=await trans('subcategories_tb').where({category_id:cid}).first()
        const exist1=await trans('subcategories_tb').where({id:sid}).first()
        if(!exist0){
                if(!exist1){
                    return { 
                        success: false, 
                        message:`no category with id:${cid} and sub with id:${sid} exists`
                    } 
                }
                return { 
                    success: false,
                    message:`no category with such catgory id:${cid}` 
                }
            }
            if(!exist1){
                    return { success: false, message: `no sub category with id:${sid} exists`} 
                }
        for(let i=0;i<prod.length;i++){
            const new_slug=prod[i].toLowerCase().replaceAll(' ','-')
            
            
            const exist=await trans('product_tb').where({slug:new_slug,sub_category_id:sid}).first()
            if(exist){
             await trans.rollback()
                return { success: false, message: `${prod[i]} already exist in prducts tb` }}

            bulk.push(
                { 
                    name: prod[i],
                    slug: new_slug,
                    sub_category_id:sid,
                    image_url:img_url[i],
                    description:desc[i],
                    stock:stock[i],
                    brand:brand[i],
                    price_usd:price[i]

                }
            );
           }
            
             
            const inserted=await trans('product_tb').insert(bulk).returning('name')
            await trans.commit()
            return {success:true,data:inserted}
    } 
    
    catch (error) 
    {
      await trans.rollback();
    throw error;
    }


}

static async model_del_products_admin(to_del,cid,sid){

    const trans=await knex.transaction()
    try {
        const bulk=[]
        
        
            const exist0=await trans('subcategories_tb').where({category_id:cid}).first()
            const exist1=await trans('subcategories_tb').where({id:sid}).first()
            if(!exist0){
                if(!exist1){
                    return { 
                        success: false, 
                        message:`no category with id:${cid} and sub with id:${sid} exists`
                    } 
                }
                return { 
                    success: false,
                    message:`no category with such catgory id:${cid}` 
                }
            }
            if(!exist1){
                    return { success: false, message: `no sub category with id:${sid} exists`} 
                }


        for(const i of to_del){
            
            const new_slug=i.toLowerCase().replaceAll(' ','-')
            const exist=await trans('product_tb').where({slug:new_slug,sub_category_id:sid}).first()
            
            if(!exist){
                await trans.rollback();
                return { success: false, message: `${i} doesn't exist in this sub category` }}
            bulk.push(new_slug)}
            
            await trans('product_tb').where({sub_category_id:sid}).whereIn('slug',bulk).del()
            const new_tb=await trans('product_tb').select('name')
            await trans.commit()
            return {success:true,data:new_tb}
    } 
    
    catch (error) 
    {
    await trans.rollback();
    throw error;
    }
}

static async model_upd_products_admin(to_upd,new_names,new_img_url,new_stock,new_desc,new_price,cid,sid) {
  const trans = await knex.transaction()
  try {

    const exist0 = await trans('subcategories_tb').where({ category_id: cid }).first()
    const exist1 = await trans('subcategories_tb').where({ id: sid }).first()
    if (!exist0) {
      await trans.rollback()
      if (!exist1) return { success: false, message: `no category with id:${cid} and sub with id:${sid} exists` }
      return { success: false, message: `no category with id:${cid} exists` }
    }
    if (!exist1) {
      await trans.rollback()
      return { success: false, message: `no sub category with id:${sid} exists` }
    }

    for (let i = 0; i < to_upd.length; i++) {
      const old_slug = to_upd[i].toLowerCase().replaceAll(' ', '-')
      const new_slug = new_names[i].toLowerCase().replaceAll(' ', '-')

      const exist = await trans('product_tb').where({ slug: old_slug, sub_category_id: sid }).first()
      if (!exist) {                                        // ✓ flipped — must exist to update
        await trans.rollback()
        return { success: false, message: `${to_upd[i]} doesn't exist in products` }
      }

      await trans('product_tb')
        .where({ slug: old_slug, sub_category_id: sid }) // ✓ update instead of insert
        .update({
          name: new_names[i],
          slug: new_slug,
          image_url: new_img_url[i],
          description: new_desc[i],
          stock: new_stock[i],
          price_usd:new_price[i]
        })
    }

    const updated = await trans('product_tb').where({ sub_category_id: sid }).select('name')
    await trans.commit()
    return { success: true, data: updated }

  } catch (error) {
    await trans.rollback()
    throw error
  }
}
}


module.exports=models_admin