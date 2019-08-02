
const swig = require('swig')
const express = require('express')
//引入cookies库
const Cookies = require('cookies')

//引入express-session库
const session = require('express-session')

//将session存储起来
const MongoStore = require("connect-mongo")(session)

const app = express()
const port = 3000

//1.连接数据库(设置数据库为:blog)(mongoose)
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true })
//获取db对象
const db = mongoose.connection
//连接数据库失败
db.on('error', (err) => {
    console.log('connection db error:',err)
    throw err
})
//连接数据库
db.once('open', () => {
    console.log('connection db success')
})



//静态资源处理(Express)
//获取中间件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'))

//开发阶段设置不走缓存
swig.setDefaults({
  cache:false
})

//配置应用模板
app.engine('html', swig.renderFile)

//配置模板的存放目录
app.set('views', './views')

//注册模板引擎
app.set('view engine', 'html')
//设置cookie中间件
/*
//处理cookie
app.use((req,res,next)=>{
    //生成cookies对象并且保存到req对象上
    req.cookies = new Cookies(req,res)
    let userInfo = {}
    if(req.cookies.get('userInfo')){
        userInfo = JSON.parse(req.cookies.get('userInfo'))
    } 
    req.userInfo = userInfo
    next()
})
*/


// 设置session中间件
app.use(session({
    //设置cookie名称
    name:'kzid',
    //用它来对session cookie签名，防止篡改
    secret:'abc',
    //强制保存session即使它并没有变化
    resave: true,
    //强制将未初始化的session存储
    saveUninitialized: true, 
    //如果为true,则每次请求都更新cookie的过期时间
    rolling:true,
    //cookie过期时间 1天
    cookie:{maxAge:1000*60*60*24},

    //设置session存储在数据库(mongoDB)中
    store:new MongoStore({ mongooseConnection: mongoose.connection })   
    
}))
app.use((req,res,next)=>{   
    req.userInfo = req.session.userInfo || {}
    next()
})

//配置路由
app.use("/",require('./routes/index.js'))

//配置路由
app.use("/user",require('./routes/user.js'))

app.use("/admin",require('./routes/admin.js'))

app.listen(port, () => console.log(`app listening on port ${port}!`))










