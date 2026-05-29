require('dotenv').config()
const exp=require('express')
const view_router_cus=require('./view/router_cus')
const view_router_item=require('./view/router_items')
const view_router_admin=require('./view/router_admin')
const http=require('http')
require('./jobs/cart_cleanup')
const cors = require('cors')

const app = exp();
const http_server=http.createServer(app)
const port =process.env.Port

app.use(cors())

app.use(exp.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Meathods','*');
    res.setHeader('Access-Control-Allow-Headers','*');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
});


app.use('/cus',view_router_cus);

app.use('/cus',view_router_item)

app.use('/admin',view_router_admin)

app.use('/admin',view_router_item)

http_server.listen(port,()=>{
    console.log(`server started and listening at port:${port}`)
});

