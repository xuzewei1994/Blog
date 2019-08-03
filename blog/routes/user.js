
const express = require('express')
const hmac = require('../util/hmac.js')
const router = express.Router()

//导入用户模块
const UserModel = require('../models/user.js')

//注册
router.post('/register',(req,res)=>{
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
                password:hmac(password),
                isAdmin:true
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

//登陆
router.post('/login',(req,res)=>{
    //1.获取参数
     const { username,password } = req.body
    //2.验证
    UserModel.findOne({username:username,password:hmac(password)},'-password -__v')
    .then(user=>{
        //验证成功
        if(user){     
            //添加session
            req.session.userInfo = user
            
            res.json({
                status:0,
                message:"注册成功",
                data:user
            })   
        }
        //验证失败
        else{
             res.json({
                status:10,
                message:'用户名或密码错误'
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

//退出登陆
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.json({
            status:0,
            message:"退出登陆成功"
    }) 
})

module.exports = router










