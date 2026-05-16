require('dotenv').config()
const exp=require('express')
const ctrl_cus=require('../control/controller_cus')
const tok=require('../token/token_cus')


const router_cus=exp.Router()
router_cus.post('/signup',ctrl_cus.ctrl_signup_cus)
router_cus.post('/login',ctrl_cus.ctrl_login_cus)
router_cus.post('/refresh',tok.refresh)


module.exports=router_cus