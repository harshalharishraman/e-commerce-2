require('dotenv').config();
const model = require('../model/models_cus');
const re_cus = require('../resvo/resvo_cus');
const enc=require('bcrypt');
const tk=require('../token/token_cus')
const exp = require('express');
const app=exp();


class controller_item{

static async crtl_get_all_categories(req,res){
return res.status(200).json({"hello from crtl_get_all_categories":null})
}
}

module.exports=controller_item