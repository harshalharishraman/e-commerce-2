require('dotenv').config()
const {Queue}=require('bullmq')

const connection={host:'localhost',port:6379}

const cart_queue=new Queue('cart',{
    connection,
defaultJobOptions:{
        attempts:3,
        backoff:{
            type:'exponential',
            delay:5000, //wait for 5 sec for retry
            

        },
        removeOnComplete:50,
        removeOnFail: 100
    }},)

module.exports={connection,cart_queue}