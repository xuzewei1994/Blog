

const express = require('express')
const CategoryModel = require('../models/category.js')
const ArticleModel = require('../models/article.js')

const router = express.Router()

async function getCommonData(){
    const categoriesPromise = CategoryModel.find({},"name").sort({order:-1})
    const topArticlesPromise = ArticleModel.find({},"click title").sort({click:-1}).limit(10)
    const categories = await categoriesPromise
    const topArticles = await topArticlesPromise
    return {
        categories,
        topArticles
    }
}


//显示首页
router.get('/', (req, res) => {
    //render方法作用: 
    //1.模版中block的替换
    //2.把替换后的html返回给客户端
    getCommonData()
    .then(data=>{
        const { categories,topArticles } = data
        ArticleModel.getPaginationArticlesData(req)
        .then(data=>{
            res.render("main/index",{
                userInfo:req.userInfo,
                categories,
                topArticles,
                //首页文章分页数据
                articles:data.docs,
                page:data.page,
                list:data.list,
                pages:data.pages,
                url:"/"
            })
        })
    })
})

//处理文章分页数据的ajax请求
router.get('/articles', (req, res) => {
    ArticleModel.getPaginationArticlesData(req)
    .then(data=>{
        res.json({
            status:0,
            message:"获取文章数据成功",
            data:data
        })
    })
    .catch(err=>{
        res.json({
            status:10,
            message:"获取文章数据失败"
        })        
    })
})


//显示列表页
router.get('/list', (req, res) => {  
    res.render("main/list",{
        userInfo:req.userInfo
    })
})


//显示详情页
router.get('/detail', (req, res) => {
    res.render("main/detail",{
        userInfo:req.userInfo
    })
})

module.exports = router