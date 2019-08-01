
const express = require('express')
const hmac = require('../util/hmac.js')


const router = express.Router()

//导入用户模块
const UserModel = require('../models/user.js')

//注册
router.post('/register', (req, res) => {
    //1.获取参数
    const { username,password } = req.body

    //2.同名验证
    UserModel.findOne({username:username})
    .then(user=>{
        //已有同名用户
        if(user){
            res.json({
                status:10,
                message:"该用户名已经存在,请换一个"
            })            
        }
        //没有同名用户
        else{
            //3.插入数据
            UserModel.insertMany({
                username:username,
                password:hmac(password)
            })
            .then(user=>{
                res.json({
                    status:0,
                    message:"注册成功",
                    data:user
                })                  
            })
            .catch(err=>{
                throw err
            })
        }
    })
    .catch(err=>{
        console.log("insert user:",err)
        res.json({
            status:10,
            message:"服务器端错误,请稍后再试"
        })          
    })
})


module.exports = router










