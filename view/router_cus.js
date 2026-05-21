require('dotenv').config()
const exp=require('express')
const ctrl_cus=require('../control/controller_cus')
const tok=require('../token/token_cus')


const router_cus=exp.Router()
router_cus.post('/signup',ctrl_cus.ctrl_signup_cus)
router_cus.post('/login',ctrl_cus.ctrl_login_cus)
router_cus.post('/refresh',tok.refresh)

router_cus.use((req,res,next)=>{tok.access_tok_verifly(req,res,next,'user')})

router_cus.post('/cart/add',ctrl_cus.ctrl_add_to_cart)
router_cus.delete('/cart/del',ctrl_cus.ctrl_del_from_cart)

module.exports=router_cus