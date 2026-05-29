require('dotenv').config()
const exp=require('express')
const ctrl_admin=require('../control/controller_admin')
const tok=require('../token/token_cus')
const { crtl_get_all_categories } = require('../control/controller_item')
const upload = require('../middlewares/upload')

const router_admin=exp.Router()

router_admin.post('/signup',ctrl_admin.ctrl_signup_admin)
router_admin.post('/login',ctrl_admin.ctrl_login_admin)
router_admin.post('/refresh',(req,res)=>{tok.refresh(req,res,'admin')})

router_admin.use((req,res,next)=>{tok.access_tok_verifly(req,res,next,'admin')})

router_admin.post('/add_categories/',ctrl_admin.ctrl_add_categories)
router_admin.delete('/delete_categories/',ctrl_admin.crtl_delete_categories)
router_admin.put('/update_categories/',ctrl_admin.crtl_update_categories)

router_admin.post('/categories/add_subs',ctrl_admin.ctrl_add_sub_categories)
router_admin.delete('/categories/del_subs',ctrl_admin.ctrl_del_sub_categories)
router_admin.put('/categories/upd_subs',ctrl_admin.ctrl_upd_sub_categories)

router_admin.post('/categories/:cid/sub/:sid/add',upload.array('images',100),ctrl_admin.ctrl_add_products)
router_admin.delete('/categories/:cid/sub/:sid/del',upload.none(),ctrl_admin.ctrl_del_products)
router_admin.put('/categories/:cid/sub/:sid/upd',upload.array('images',100),ctrl_admin.ctrl_upd_products)




module.exports=router_admin