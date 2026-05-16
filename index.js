require('dotenv').config()
const exp=require('express')
const view_router_cus=require('./view/router_cus')
const http=require('http')

const app = exp();
const http_server=http.createServer(app)
const port =process.env.Port
app.use(exp.json());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Meathods','*');
    res.setHeader('Access-Control-Allow-Headers','*');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
});

console.log('start of .use of router');
app.use('/cus',view_router_cus);
console.log('end of .use of router');

http_server.listen(port,()=>{
    console.log(`server started and listening at port:${port}`)
});

