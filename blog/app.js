

const express = require('express')
const swig = require('swig')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Cookies = require('cookies')
const session = require('express-session')
const MongoStore = require("connect-mongo")(session)

//app代表整个应用
const app = express()
const port = 3000

//1.连接数据库
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

//静态资源处理
app.use(express.static('public'))

//为了处理post/put请求的参数,设置bodyParser中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//bodyParser中间件执行完毕后会把post/put请求的参数以对象的形式保存在req.body上

/*————————————————————————————模版设置开始----------------------*/
//开发阶段设置不走缓存
swig.setDefaults({
  // cache: 'memory'
  cache:false
})
//配置应用模板
app.engine('html', swig.renderFile)

//配置模板的存放目录
app.set('views', './views')

//注册模板引擎
app.set('view engine', 'html')
//设置后就可以调用res.render()方法渲染模版
/*————————————————————————————模版设置结束----------------------*/

//设置session中间件
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
    //设置session存储在数据库中
    store:new MongoStore({ mongooseConnection: mongoose.connection })      
}))

app.use((req,res,next)=>{  
    req.userInfo = req.session.userInfo || {}
    next()
})

/*————————————————————————————路由设置开始----------------------*/
app.use("/",require('./routes/index.js'))
app.use("/user",require('./routes/user.js'))
app.use("/admin",require('./routes/admin.js'))
app.use("/category",require('./routes/category.js'))
app.use("/article",require('./routes/article.js'))
/*————————————————————————————路由设置结束----------------------*/

app.listen(port, () => console.log(`app listening on port ${port}!`))







