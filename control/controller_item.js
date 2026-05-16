require('dotenv').config();
const model = require('../model/models_item');
const re_cus = require('../resvo/resvo_cus');
const enc=require('bcrypt');
const tk=require('../token/token_cus')
const exp = require('express');
const app=exp();


class controller_item{

static async crtl_get_all_categories(req,res){
try {
    const m = await model.models_get_all_categories(req,res);
    const n=m.map(c=>c.name)
    return res.status(200).json(new re_cus(200,'categories sucessfully retrived',{"categories":n}))

} catch (error) {
    console.error(error)
    return res.status(500).json(new re_cus(500,'internal server issue',null))
}
}
}

module.exports=controller_item