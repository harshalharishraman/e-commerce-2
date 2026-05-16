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
}

module.exports=models_item