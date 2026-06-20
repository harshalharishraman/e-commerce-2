const {Worker, tryCatch}=require('bullmq')
const {connection}=require('./queue')
const {cartCleanup}=require('../jobs/cart_cleanup')

const cart_worker_1=new Worker('cart',async(job)=>{
    console.log(`worker:${job.name} ${job.id} accepted job from cart_queue,${job.data}`,{})
     switch(job.name){
        case 'cart-cleanup':
                return cartCleanup()
            
        default:
            throw new Error(`unknow cart job:${job.name}`)
     }},{
        connection,
        concurrency:1//1 job at a time
     })

cart_worker_1.on('completed',(job)=>
    {console.log(`worker:${job.name} ${job.id} completed`)})

cart_worker_1.on('failed',
    (job,err)=>{console.log(`worker:${job.name} ${job.id} failed,\nerror:${err}`)})

module.exports={cart_worker_1}