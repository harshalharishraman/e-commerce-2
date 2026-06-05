const otp_gen=require('otp-generator')
const b=require('bcrypt')
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

class otp_class{
static async otp_gener(){
    try{
    const o=await otp_gen.generate(4,{

        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    });

    return o
    }
    catch(error){
        throw error
    }

}

static async otp_send(otp,email){

    try {
        const result=await resend.emails.send({
            from:'onboarding@resend.dev',
             to:'harshal.ixa@gmail.com',
             subject:'our otp from ecom2',
             html: `
                <h2>Your OTP Code</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>Valid for 15 minutes.</p>
            `
        });

        return {result,otp}
    } catch (error) {
        throw error
    }

}

static async otp_verfly(otp,email){
    try {
        
    }
    
    catch (error) {
        
    }
}

}

module.exports=otp_class

