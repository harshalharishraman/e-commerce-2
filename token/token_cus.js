require('dotenv').config()
const jwt=require('jsonwebtoken')
const resp_cus=require('../resvo/resvo_cus')
class token{
static async atok_gen(i,n){
    try {
        const tok=jwt.sign({
            id:i,
            name:n
        },process.env.access_sec_k,{
            expiresIn:"30m"
        });
        return tok
    } catch (error) {
        return res.status(500).josn(new resp_cus(500,"error in  access tok gen",null))
    }
}

static async rtok_gen(i,n){
try {
        const tok=jwt.sign({
            id:i,
            name:n
        },process.env.refresh_sec_k,{
            expiresIn:"7d"
        });
        return tok
    } catch (error) {
        return res.status(500).json(new resp_cus(500,"error in  access tok gen",null))
    }
}

static async access_tok_verifly(req,res,next){
    
try {
    
    const req_head_auth=req.headers.authorization

   if (!req_head_auth.startsWith('Bearer ')) {
            return res.status(400).json(new resp_cus(400, 'invalid auth format, use: Bearer <token>', null));
        }
    
    if(!req_head_auth){
        return res.status(400).json(new resp_cus(400,'header missing',null))

    }

    const acc_tk=req_head_auth.split(" ")[1]

    if(!acc_tk){
              return res.status(400).json(new resp_cus(400,'token missing',null))
  
    }


    const dec=jwt.verify(acc_tk,process.env.access_sec_k)
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


    
static async refresh(req,res){
        try{
        const {refresh_token}=req.body
        if(!refresh_token){
            return res.status(400).json(new resp_cus(400,'missing refresh token',null))
        }
        
        const v=jwt.verify(refresh_token,process.env.refresh_sec_k)
        const n_acc_tk=jwt.sign({
            id:v.id,
            name:v.name

        },process.env.access_sec_k,{
            expiresIn:'30m'
        });
        const n_ref_tk=jwt.sign({
            id:v.id,
            name:v.name

        },process.env.refresh_sec_k,{
            expiresIn:'7d'
        });
        res.status(200).json(new resp_cus(200,'refresh sucessful',{"access_token":n_acc_tk,"refresh_token":n_ref_tk,
        }));}
        catch(error){
            console.error(error)
            return res.status(403).json(new resp_cus(403,'invalid refresh token',{"error":error}))
        }

        }
}
module.exports=token

