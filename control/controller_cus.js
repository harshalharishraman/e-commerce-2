require('dotenv').config();
const model = require('../model/models_cus');
const re_cus = require('../resvo/resvo_cus');
const enc=require('bcrypt');
const tk=require('../token/token_cus')
const exp = require('express');
const jwt=require('jsonwebtoken')
const app=exp();

class customer_cus{
static async ctrl_login_cus(req,res){
    res.status(200).json(new re_cus(200,'hello',null))
}
static async ctrl_signup_cus(req,res){
    try{

    const{name,email,password,main_address,secondary_address,DOB}=req.body
    
     if(!name || !email || !password || !main_address|| !secondary_address|| !DOB){
                  return res.status(400).json(new re_cus(null,400,'all fields are required'))
            }
    const valid=require('../valid')
    const valid_var=await valid.ver(req,res)
    const ck=await model.if_email_exist(email);
           if(ck){
              return res.status(409).json(new re_cus(null,409,'an account exists with this email'));}
    const mm=await model.model_signup_cus(name,email,password,main_address,secondary_address,new Date(DOB))
    return res.status(201).json(new re_cus(201,`account created using ${email}`,null))
}
    
     catch(error){
        return res.status(500).json(new re_cus(500,`internal server issue`,null))
    }
}

static async ctrl_login_cus(req,res){
    try {
        const{name,email,password}=req.body
    
     if(!name || !email || !password){
                  return res.status(400).json(new re_cus(null,400,'all fields are required'))
            }
     const valid=require('../valid')
    const valid_var=await valid.ver(req,res)

    const ck=await model.if_email_exist(email);
    if(!ck){
        return res.status(404).json(new re_cus(null,404,'no account exists with this email'));}
    
        const logged_account=await model.model_login_cus(name,email,password)

        if(!logged_account){
            return res.status(500).json(new re_cus(500,`invalid credentails`,null))}
        
        const atok=await tk.atok_gen(logged_account.id,logged_account.name,logged_account.email)
        const rtok=await tk.rtok_gen(logged_account.id,logged_account.name,logged_account.email)
        return res.status(200).json(new re_cus(200,`logged in using ${email}`,{"email":logged_account.email,"access_tok":atok,"refresh_token":rtok}))


        
    } catch (error) {
        return res.status(500).json(new re_cus(500,`internal server issue`,null))

    }
}

static async ctrl_add_to_cart(req,res,src='user'){
    try {
            
    const req_head_auth=req.headers.authorization

    if(!req_head_auth){
        return res.status(400).json(new resp_cus(400, 'missing header', null));
    }

   if (!req_head_auth.startsWith('Bearer ')) {
            return res.status(400).json(new resp_cus(400, 'invalid auth format, use: Bearer <token>', null));
        }
    

    const acc_tk=req_head_auth.split(" ")[1]

    if(!acc_tk){
              return res.status(400).json(new resp_cus(400,'token missing',null))
  
    }

    const key=src==='admin'?process.env.admin_access_sec_k:process.env.access_sec_k
    const dec=jwt.verify(acc_tk,key)
    if(!dec){
        return res.status(500).json(new resp_cus(500,'corrupted jwt',null))
    }
    const dec_email=dec.email
    const {name,qty}=req.body
    const from_model=await model.model_cart_add(dec_email,name,qty)
    if(!from_model.success){
            return res.status(400).json(new re_cus(400,from_model.message,null))
        }
        return res.status(201).json(new re_cus(200,from_model.message,{"new categories":from_model.data}))
    } 
    
    catch (error) {
        return res.status(500).json(new re_cus(500,`internal server issue`,null))
    }    
}
}



module.exports=customer_cus
