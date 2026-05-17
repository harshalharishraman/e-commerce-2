require('dotenv').config()
const jwt=require('jsonwebtoken')
const enc=require('bcrypt')
const resp_cus=require('../resvo/resvo_cus')
class token{
static async atok_gen(i,n,src='users'){
    try {
        const enc_id=await enc.hash(i,10)
        const enc_name=await enc.hash(n,10)
        const key=src==='admin'?process.env.admin_access_sec_k:process.env.access_sec_k
        const tok=jwt.sign({
            id:enc_id,
            name:enc_name
        },key,{
            expiresIn:"30m"
        });
        return tok
    } catch (error) {
        return res.status(500).josn(new resp_cus(500,"error in  access tok gen",null))
    }
}

static async rtok_gen(i,n,src='users'){
try {
    const enc_id=await enc.hash(i,10)
        const enc_name=await enc.hash(n,10)
        const key=src==='admin'?process.env.admin_refresh_sec_k:process.env.refresh_sec_k
        const tok=jwt.sign({
            id:enc_id,
            name:enc_name
        },key,{
            expiresIn:"7d"
        });
        return tok
    } catch (error) {
        return res.status(500).json(new resp_cus(500,"error in  access tok gen",null))
    }
}

static async access_tok_verifly(req,res,next,src='users'){
    
try {
    
    const req_head_auth=req.headers.authorization

    if(!req_head_auth){
        return res.status(400).json(new resp_cus(400, 'missing header', null));
    }

   if (!req_head_auth.startsWith('Bearer ')) {
            return res.status(400).json(new resp_cus(400, 'invalid auth format, use: Bearer <token>', null));
        }
    

    const acc_tk=req_head_auth.split(" ")[1]

    if(!acc_tk){
              return res.status(400).json(new resp_cus(400,'token missing',null))
  
    }

    const key=src==='admin'?process.env.admin_access_sec_k:process.env.access_sec_k
    const dec=jwt.verify(acc_tk,key)
    if(!dec){
        return res.status(500).json(new resp_cus(500,'corrupted jwt',null))
    }
    req.user = dec;
    next();  
} catch (error) {
    console.error(error)
    return res.status(500).json(new resp_cus(500,'invalid or expired token',null))
}
    }


static async refresh(req, res, src = 'users') {
  try {
    const { refresh_token } = req.body

    if (!refresh_token) {
      return res.status(400).json(new resp_cus(400, 'missing refresh token', null))
    }

    // verify with REFRESH key — this was the bug
    const ref_key = src === 'admin' ? process.env.admin_refresh_sec_k : process.env.refresh_sec_k
    const v = jwt.verify(refresh_token, ref_key)

    // sign new access token with ACCESS key
    const acc_key = src === 'admin' ? process.env.admin_access_sec_k : process.env.access_sec_k
    const n_acc_tk = jwt.sign({ id: v.id, name: v.name }, acc_key, { expiresIn: '30m' })

    // sign new refresh token with REFRESH key
    const n_ref_tk = jwt.sign({ id: v.id, name: v.name }, ref_key, { expiresIn: '7d' })

    return res.status(200).json(new resp_cus(200, 'refresh successful', {
      access_token: n_acc_tk,
      refresh_token: n_ref_tk
    }))

  } catch (error) {
    console.error(error)
    return res.status(403).json(new resp_cus(403, 'invalid refresh token', { error: error.message }))
  }
}
}
module.exports=token

