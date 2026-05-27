require('dotenv').config();
const model = require('../model/models_admin');
const re_cus = require('../resvo/resvo_cus');
const enc=require('bcrypt');
const tk=require('../token/token_cus')
const exp = require('express');
const app=exp();

class controller_admin{

static async ctrl_signup_admin(req,res){
    try {
        const{name,email,password,employee_id}=req.body
    
     if(!name || !email || !password || !employee_id){
                  return res.status(400).json(new re_cus(null,400,'all fields are required'))
            }

if (!/^EMP\d{6}$/.test(employee_id)) {
  return res.status(400).json(new re_cus(400, 'employee_id must be in format EMP followed by 6 digits eg EMP123456', null))
}
    const valid=require('../valid')
    const valid_var=await valid.ver(req,res)

    const ck=await model.if_email_exist(email);
           if(ck){
              return res.status(409).json(new re_cus(null,409,'an account exists with this email'));}
        const from_model=await model.model_signup_admin(req,res)
        console.log(from_model)
        return res.status(201).json(new re_cus(201,`new admin account created using ${res.email}`,null))
    } catch (error) {
        return res.status(500).json(new re_cus(500,'internal server issue',null))
    }
}

static async ctrl_login_admin(req,res){
    try{
        const{name,email,password}=req.body
    
     if(!name || !email || !password){
                  return res.status(400).json(new re_cus(null,400,'all fields are required'))
            }
    const valid=require('../valid')
    const valid_var=await valid.ver(req,res)

    const ck=await model.if_email_exist(email);
           if(ck){
            const {name,email,password}=req.body
            const from_model=await model.model_login_admin(name,email,password)
              
              if(!from_model){
                return res.status(400).json(new re_cus(400,'invalid credentails',null))
              }
              
              const atok=await tk.atok_gen(from_model.id,from_model.name,from_model.email,'admin')
              const rtok=await tk.rtok_gen(from_model.id,from_model.name,from_model.email,'admin')
            return res.status(200).json(new re_cus(200,`logged in using email:${email}`,{"access_token":atok,
                "refresh_token":rtok
            }))}
            else{
                return res.status(400).json(new re_cus(400,'no such account found',null))
            }

    }
    catch(error){
        console.error(error)
    return res.status(500).json(new re_cus(500,'internal server issue',null))
    }
}

//CATEGORIES
static async ctrl_add_categories(req,res){
    try {
        const {categories}=req.body
        if(!categories || !Array.isArray(categories) || categories.length===0){
            return res.status(400).json(new re_cus(400,'array missing or invalid',null))
        }
        const valid = categories.every(cat => typeof cat === 'string');
        if(valid==false){
            return res.status(400).json(new re_cus(400,'only string elements accepted',null))
        }
        const from_model=await model.model_add_categories_admin(categories)
        return res.status(201).json(new re_cus(200,'added category/ies',{"new categories":from_model}))
        
    } catch (error) {
        return res.status(500).json(new re_cus(500,'internal server issue',null))
        
    }
}

static async crtl_delete_categories(req,res){
    
    try {
        const {categories}=req.body
        if(!categories || !Array.isArray(categories) || categories.length===0){
            return res.status(400).json(new re_cus(400,'array missing or invalid',null))
        }
        const valid = categories.every(cat => typeof cat === 'string');
        if(valid==false){
            return res.status(400).json(new re_cus(400,'only string elements accepted',null))
        }
        const from_model=await model.model_delete_categories_admin(categories)
        if(!from_model.success){
            return res.status(400).json(new re_cus(400,from_model.message,null))
        }
        return res.status(201).json(new re_cus(200,'deleted category/ies',{"new categories":from_model}))

    } 
    catch (error) {
        console.error(error)
        return res.status(500).json(new re_cus(500,'internal server issue',null))
    }
}

static async crtl_update_categories(req,res){
    
    try {
    const {categories,new_categories}=req.body
        if(!categories || !Array.isArray(categories) || categories.length===0 
           || !new_categories || !Array.isArray(new_categories) || new_categories.length===0){
            return res.status(400).json(new re_cus(400,'array/s missing or invalid',null))
        }
        const valid = categories.every(cat => typeof cat === 'string') 
           && new_categories.every(cat => typeof cat === 'string')
        if(valid==false){
            return res.status(400).json(new re_cus(400,'only string elements accepted',null))
        }
        const check_lenght=(categories.length==new_categories.length)?true:false
        if(check_lenght==false){
            return res.status(400).json(new re_cus(400,'unequal no of elements btw arrays',null))
        }   
        const from_model=await model.model_update_categories_admin(categories,new_categories)
        if(!from_model.success){
            return res.status(400).json(new re_cus(400,from_model.message,null))
        }
        return res.status(201).json(new re_cus(200,'updated category/ies',{"new categories":from_model.data}))

    } 
    catch (error) {
        console.error(error)
        return res.status(500).json(new re_cus(500,'internal server issue',null))
    }
}

//SUB-CATEGORIES
static async ctrl_add_sub_categories(req,res){

try {
    const {subs,cat_ids}=req.body
        if(!subs || !Array.isArray(subs) || subs.length===0){
            return res.status(400).json(new re_cus(400,'array missing or invalid',null))
        }
        
        const valid = subs.every(cat => typeof cat === 'string');
        if(valid==false){
            return res.status(400).json(new re_cus(400,'only string elements accepted in subs',null))
        }

        const valid2 = cat_ids.every(cat => Number.isInteger(cat));
        if(valid2==false){
            return res.status(400).json(new re_cus(400,'only +ve int elements accepted in cat_ids',null))
        }

        const check_lenght=(subs.length==cat_ids.length)?true:false
        if(check_lenght==false){
            return res.status(400).json(new re_cus(400,'unequal no of elements btw arrays',null))
        }   

        const from_model=await model.model_add_sub_categories_admin(subs,cat_ids)
        if(!from_model.success){
            return res.status(400).json(new re_cus(400,from_model.message,null))
        }
        return res.status(201).json(new re_cus(200,'added sub_category/ies',{"new categories":from_model.data}))
        
    } catch (error) {
        console.error(error)
        return res.status(500).json(new re_cus(500,'internal server issue',null))
        
    }
}

static async ctrl_del_sub_categories(req,res){


try {
    const {subs}=req.body
        if(!subs || !Array.isArray(subs) || subs.length===0){
            return res.status(400).json(new re_cus(400,'array missing or invalid',null))
        }
        const valid = subs.every(cat => typeof cat === 'string');
        if(valid==false){
            return res.status(400).json(new re_cus(400,'only string elements accepted in subs',null))
        }  

        const from_model=await model.model_del_sub_categories_admin(subs)
        if(!from_model.success){
            return res.status(400).json(new re_cus(400,from_model.message,null))
        }
        return res.status(201).json(new re_cus(200,'added sub category/ies',{"new sub categories":from_model.data}))
    } catch (error) {
        console.error(error)
        return res.status(500).json(new re_cus(500,'internal server issue',null))
        
    }
}

static async ctrl_upd_sub_categories(req,res){

try {
    const {to_upd,new_names}=req.body
        if(!to_upd || !Array.isArray(to_upd) || to_upd.length===0 
           || !new_names || !Array.isArray(new_names) || new_names.length===0){
            return res.status(400).json(new re_cus(400,'array/s missing or invalid',null))
        }
        let valid = to_upd.every(cat => typeof cat === 'string') 
           && new_names.every(cat => typeof cat === 'string')
        if(valid==false){
            return res.status(400).json(new re_cus(400,'only string elements accepted',null))
        }
        const check_lenght=(to_upd.length==new_names.length)?true:false
        if(check_lenght==false){
            return res.status(400).json(new re_cus(400,'unequal no of elements btw arrays',null))
        }   
        const from_model=await model.model_update_sub_categories_admin(to_upd,new_names)
        if(!from_model.success){
            return res.status(400).json(new re_cus(400,from_model.message,null))
        }
        return res.status(201).json(new re_cus(200,'updated sub category/ies',{"new sub categories":from_model.data}))

    } 
    catch (error) {
        console.error(error)
        return res.status(500).json(new re_cus(500,'internal server issue',null))
    }
}

//PRODUCTS
static async ctrl_add_products(req, res) {
  try {
    const prod =[].concat(req.body.prod),
          stock=[].concat(req.body.stock).map(Number)
          ,brand=[].concat(req.body.brand)
          ,desc=[].concat(req.body.desc)
          ,price=[].concat(req.body.price).map(Number)
          ,img_urls=req.files.map(f=>f.location)
    

    if (!prod    || !Array.isArray(prod)    || prod.length === 0
     || !img_urls || !Array.isArray(img_urls) || img_urls.length === 0
     || !stock   || !Array.isArray(stock)   || stock.length === 0
     || !brand   || !Array.isArray(brand)   || brand.length === 0
     || !desc    || !Array.isArray(desc)    || desc.length === 0
     || !price    || !Array.isArray(price)    || price.length === 0)
      {
      return res.status(400).json(new re_cus(400, 'array/s missing or invalid', null))
    }

    const valid = prod.every(i => typeof i === 'string')
      && img_urls.every(i => typeof i === 'string')
      && brand.every(i => typeof i === 'string')
      && desc.every(i => typeof i === 'string')
      && stock.every(i => Number.isInteger(i))
      && price.every(i => Number.isInteger(i))

    if (!valid) {
      return res.status(400).json(new re_cus(400, 'wrong type of elements in one or more arrays', null))
    }

    const check_length = prod.length === img_urls.length  // ✓ proper chained check
      && img_urls.length === stock.length
      && stock.length === brand.length
      && brand.length === desc.length
      && desc.length === price.length

    if (!check_length) {
      return res.status(400).json(new re_cus(400, 'unequal no of elements btw arrays', null))
    }

    const cid = req.params.cid
    const sid = req.params.sid

    const from_model = await model.model_add_products_admin(prod, img_urls, stock, brand, desc,price, cid, sid)

    if (!from_model.success) {
      return res.status(400).json(new re_cus(400, from_model.message, null))
    }

    return res.status(201).json(new re_cus(201, 'added product/s', { 'new products': from_model.data }))

  } catch (error) {
    console.error(error)
    return res.status(500).json(new re_cus(500, 'internal server issue', null))
  }
}


static async ctrl_del_products(req,res){

    try {
        const {names}=req.body
        if (!names||!Array.isArray(names)|| names.length === 0){
            return res.status(400).json(new re_cus(400, 'array missing or invalid', null))
        }

        const valid = names.every(i => typeof i === 'string')

        if (!valid) {
            return res.status(400).json(new re_cus(400, 'only string elements accpeted', null))}

        const cid = req.params.cid
        const sid = req.params.sid

    const from_model = await model.model_del_products_admin(names, cid, sid)

    if (!from_model.success) {
      return res.status(400).json(new re_cus(400, from_model.message, null))
    }

    return res.status(201).json(new re_cus(201, 'deleted product/s', { 'new product_tb of such subcategory': from_model.data }))

  } catch (error) {
    console.error(error)
    return res.status(500).json(new re_cus(500, 'internal server issue', null))
  }
}


static async ctrl_upd_products(req,res){
try{
const { to_upd,new_names, new_img_url, new_stock, new_desc,new_price } = req.body

    if (!to_upd    || !Array.isArray(to_upd)    || to_upd.length === 0
     || !new_img_url || !Array.isArray(new_img_url) || new_img_url.length === 0
     || !new_stock   || !Array.isArray(new_stock)   || new_stock.length === 0
     || !new_names   || !Array.isArray(new_names)   || new_names.length === 0
     || !new_desc    || !Array.isArray(new_desc)    || new_desc.length === 0
     | !new_price   || !Array.isArray(new_price)    || new_price.length === 0) {
      return res.status(400).json(new re_cus(400, 'array/s missing or invalid', null))
    }

    const valid = to_upd.every(i => typeof i === 'string')
      && new_img_url.every(i => typeof i === 'string')
      && new_names.every(i => typeof i === 'string')
      && new_desc.every(i => typeof i === 'string')
      && new_stock.every(i => Number.isInteger(i))
      && new_price.every(i => Number.isInteger(i))

    if (!valid) {
      return res.status(400).json(new re_cus(400, 'wrong type of elements in one or more arrays', null))
    }

    const check_length = to_upd.length === new_img_url.length  // ✓ proper chained check
      && new_img_url.length === new_stock.length
      && new_stock.length === new_names.length
      && new_names.length === new_desc.length
      && new_desc.length === new_price.length

    if (!check_length) {
      return res.status(400).json(new re_cus(400, 'unequal no of elements btw arrays', null))
    }

    const cid = req.params.cid
    const sid = req.params.sid

    const from_model = await model.model_upd_products_admin(to_upd,new_names,new_img_url,new_stock,new_desc,new_price,cid,sid)

    if (!from_model.success) {
      return res.status(400).json(new re_cus(400, from_model.message, null))
    }

    return res.status(201).json(new re_cus(201, 'updated product/s',{ 'new products': from_model.data }))

  } catch (error) {
    console.error(error)
    return res.status(500).json(new re_cus(500, 'internal server issue', null))
  }
}


}

module.exports=controller_admin