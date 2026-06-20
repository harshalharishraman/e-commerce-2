require('dotenv').config()
const {cart_queue}=require('./queue')

class schedulers{
    static async cart_cleanup_scheduler(){
        try {
            await cart_queue.upsertJobScheduler(
                'cart',
                {pattern:'0 * * * *'},
                tz='Asia/Kolkata',
                {
                    name:'cart-cleanup',
                    data:{},
                    opts:{
                        attempts:3
                    }
                }
            )
            console.log('cart cleanup scheduler registered')
        } catch (error) {
            console.error(`cart cleanup scheduler error
                \nerror:${error}`)
                throw error
        }
    }
}

module.exports=schedulers