
require('dotenv').config()
const re=require('./resvo/resvo_cus');

class v{
static async ver(req,res){
    const {name,email,password}=req.body;
if(name.length<4){
    return res.status(400).json
    (new re(null,400,'name has less than 4 characters'));
}
if((!email.includes('@')) &&
!(email.endsWith('.in')||email.endsWith('.com'))){
    return res.status(400).json
    (new re(null,400,'invalid email'));}
 const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=\S+$).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json
    (new re(null,400,`invalid password(atleast 1 no,special char,1 upper 
        and lowercase and atleast 8 char long and no spaces)`));
    }
return true}}
    module.exports=v;