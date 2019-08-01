
const swig = require('swig')
const express = require('express')
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
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.use(express.static('public'))
//开发阶段设置不走缓存
swig.setDefaults({
  // cache: 'memory'
  cache:false
})
//配置应用模板
//第一个参数是模板名称,同时也是模板文件的扩展名
//第二个参数是解析模板的方法
app.engine('html', swig.renderFile)
//配置模板的存放目录
//第一参数必须是views
//第二个参数是模板存放的目录
app.set('views', './views')
//注册模板引擎
//第一个参数必须是view engine
//第二个参数是模板名称,也就是app.engine的第一个参数
app.set('view engine', 'html')

//配置路由
app.use("/",require('./routes/index.js'))

//配置路由
app.use("/user",require('./routes/user.js'))

app.listen(port, () => console.log(`app listening on port ${port}!`))










