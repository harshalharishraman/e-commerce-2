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
              
              const atok=await tk.atok_gen(from_model.id,from_model.name,'admin')
              const rtok=await tk.rtok_gen(from_model.id,from_model.name,'admin')
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
        console.error(error)
    }
}


}

module.exports=controller_admin