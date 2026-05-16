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
            expiresIn:"3m"
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
            expiresIn:"6m"
        });
        return tok
    } catch (error) {
        return res.status(500).josn(new resp_cus(500,"error in  access tok gen",null))
    }
}
}

module.exports=token

