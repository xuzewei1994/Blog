
const express = require('express')
const router = express.Router()

//权限验证(当不是管理员账号访问admin)
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登陆</h1>')
	}
})

//显示后台管理首页
router.get('admin', (req, res) => {
   res.send('admin page')
})

module.exports = router




