require('dotenv').config()
const exp=require('express')
const ctrl_item=require('../control/controller_item')
const tok=require('../token/token_cus')

const router_item=exp.Router()

router_item.use(tok.access_tok_verifly)

router_item.get('/categories/get_all',ctrl_item.crtl_get_all_categories)

module.exports=router_item