const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const re_cus = require('../resvo/resvo_cus');
const tk=require('../token/token_cus')
const jwt=require('jsonwebtoken')
const enc=require('bcrypt')

class models_item{
static async models_get_all_categories(req,res){
try {
    const to_c=await knex('categories').select('name')
    if(!to_c){
        return res.status(400).json(new re_cus(400,'uable to retrive categories',null))
    }
    return to_c
} catch (error) {
    console.error(error)
    throw error
}
}
static async models_get_all_subcategories(req,res){
    try{
        const id=req.params.id
       const to_ctrl=await knex('subcategories_tb').where({category_id:id}).select('name')
       if(!to_ctrl){
        return res.status(400).json(new re_cus(400,'unable to retrive sub_categories',null))
    }

    if(to_ctrl.length==0){
        return res.status(400).json(new re_cus(400,'no such category exists',null))
    }
       return to_ctrl
        
    } 
    
    catch (error) {
        throw error
    }
}
}

module.exports=models_item