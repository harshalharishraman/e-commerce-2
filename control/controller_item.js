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
    return res.status(200).json(new re_cus(200,'categories sucessfully retrived',{"categories":m}))

} catch (error) {
    console.error(error)
    return res.status(500).json(new re_cus(500,'internal server issue',null))
}
}

static async crtl_get_all_subcategories(req,res){
try {
    const m = await model.models_get_all_subcategories(req,res);
    return res.status(200).json(new re_cus(200,'sub_categories sucessfully retrived',{"sub_categories":m}))

} catch (error) {
    console.error(error)
    return res.status(500).json(new re_cus(500,'internal server issue',null))
}
}

static async crtl_get_all_products(req,res){
try {
    const m = await model.models_get_all_products(req,res);
    const n=m.map(c=>c.name)
    const x=m.map(c=>c.image_url)
    return res.status(200).json(new re_cus(200,'products sucessfully retrived',{"products":m}))

} catch (error) {
    console.error(error)
    return res.status(500).json(new re_cus(500,'internal server issue',null))
}
}
}

module.exports=controller_item