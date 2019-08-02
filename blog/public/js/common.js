
;(function($){

    //1.登录注册面板的切换
    var $register = $('#register')//用户注册
    var $login = $('#login')//用户登录

    //1.1 从登录面板到注册面板(go-register:免费注册按钮)
    $('#go-register').on('click',function(){
        $login.hide()
        $register.show()
    })
    //1.2 从注册面板到登录面板(go-login:已有账号,去登录按钮)
    $('#go-login').on('click',function(){
        $register.hide()
        $login.show()        
    })

    //用户名以字母开头包含数字和下划线的3-10位字符
    var usernameReg = /^[a-z][a-z0-9_]{2,9}$/i
    //密码为3-6位任意字符
    var passwordReg = /^\w{3,6}$/

    //2.注册(sub-register:注册按钮)
    $('#sub-register').on('click',function(){
        //2.1 获取表单数据
        var username = $register.find('[name=username]').val()
        var password = $register.find('[name=password]').val()
        var repassword = $register.find('[name=repassword]').val()
        //2.2 验证
        var errMsg = ''
        var $err = $register.find('.err')

        if(!usernameReg.test(username)){
            errMsg = '用户名以字母开头包含数字和下划线的3-10位字符'
        }
        else if(!passwordReg.test(password)){
            errMsg = '密码为3-6位任意字符'
        }
        else if(password != repassword){
            errMsg = '两次密码不一致'
        }
        //验证不通过
        if(errMsg){
            $err.html(errMsg)
            return
        }
        //验证通过
        else{
            $err.html('')
            //2.3 发送ajax请求
            $.ajax({
                url:'/user/register',
                type:'POST',
                dateType:'json',
                data:{
                    username:username,
                    password:password
                }
            })
            .done(function(result){
                if(result.status == 0){
                    $('#go-login').trigger('click')
                }else{
                     $err.html(result.message)
                }
            })
            .fail(function(err){
                $err.html("请求失败,请稍后再试")
            })
        }
    })

    //3.登陆(sub-login:登陆按钮)
    $('#sub-login').on('click',function(){
        //2.1 获取表单数据
        var username = $login.find('[name=username]').val()
        var password = $login.find('[name=password]').val()
        //2.2 验证
        var errMsg = ''
        var $err = $login.find('.err')

        if(!usernameReg.test(username)){
            errMsg = '用户名以字母开头包含数字和下划线的3-10位字符'
        }
        else if(!passwordReg.test(password)){
            errMsg = '密码为3-6位任意字符'
        }
        //验证不通过
        if(errMsg){
            $err.html(errMsg)
            return
        }
        //验证通过
        else{
            $err.html('')
            //3.3 发送ajax请求
            $.ajax({
                url:'/user/login',
                type:'POST',
                dateType:'json',
                data:{
                    username:username,
                    password:password
                }
            })
            .done(function(result){
                if(result.status == 0){
                    /*
                    //如果不刷新则不会显示登陆框
                    $login.hide()
                    $('#user-info span').html(result.data.username)
                    $('#user-info').show()
                    */
                    //登陆成功刷新一次页面(显示登陆框)
                    window.location.reload()
                }else{
                     $err.html(result.message)
                }
            })
            .fail(function(err){
                $err.html("请求失败,请稍后再试")
            })
        }
    })

    //4.退出
    $('#logout').on('click',function(){
        $.ajax({
            url:'user/logout'
        })
        .done(function(result){
            window.location.reload()
        })
        .fail(function(err){
            $('#user-info .err').html("请求失败,请稍后再试")
        })
    })
})(jQuery);






