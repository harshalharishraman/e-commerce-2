require('dotenv').config()
const exp=require('express')
const ctrl_admin=require('../control/controller_admin')
const tok=require('../token/token_cus')

const router_admin=exp.Router()
router_admin.post('/signup',ctrl_admin.ctrl_signup_admin)
router_admin.post('/login',ctrl_admin.ctrl_login_admin)
router_admin.post('/refresh',(req,res)=>{tok.refresh(req,res,'admin')})



module.exports=router_admin