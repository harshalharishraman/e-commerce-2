require('dotenv').config()
const exp=require('express')
const ctrl_item=require('../control/controller_item')
const tok=require('../token/token_cus')

const router_item=exp.Router()

router_item.use((req,res,next)=>{
    const client_type=req.baseUrl.startsWith('/admin')?'admin':'user';
    console.log(client_type)
    tok.access_tok_verifly(req,res,next,client_type)
})
router_item.get('/categories/get_all',ctrl_item.crtl_get_all_categories)
router_item.get('/categories/all_sub/:id',ctrl_item.crtl_get_all_subcategories)
router_item.get('/categories/:cid/sub/:sid/products',ctrl_item.crtl_get_all_products)

module.exports=router_item