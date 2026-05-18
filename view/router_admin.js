require('dotenv').config()
const exp=require('express')
const ctrl_admin=require('../control/controller_admin')
const tok=require('../token/token_cus')
const { crtl_get_all_categories } = require('../control/controller_item')

const router_admin=exp.Router()
router_admin.post('/signup',ctrl_admin.ctrl_signup_admin)
router_admin.post('/login',ctrl_admin.ctrl_login_admin)
router_admin.post('/refresh',(req,res)=>{tok.refresh(req,res,'admin')})

router_admin.use((req,res,next)=>{tok.access_tok_verifly(req,res,next,'admin')})
router_admin.post('/add_categories/',ctrl_admin.ctrl_add_categories)



module.exports=router_admin