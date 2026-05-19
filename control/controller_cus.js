require('dotenv').config();
const model = require('../model/models_cus');
const re_cus = require('../resvo/resvo_cus');
const enc=require('bcrypt');
const tk=require('../token/token_cus')
const exp = require('express');
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
        
        const atok=await tk.atok_gen(logged_account.id,logged_account.name)
        const rtok=await tk.rtok_gen(logged_account.id,logged_account.name)
        return res.status(200).json(new re_cus(200,`logged in using ${email}`,{"access_tok":atok,"refresh_token":rtok}))


        
    } catch (error) {
        return res.status(500).json(new re_cus(500,`internal server issue`,null))

    }
}
}



module.exports=customer_cus
