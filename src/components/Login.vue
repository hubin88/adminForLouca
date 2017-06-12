<template>
    <div>
        <div class="login_box">
            <div class="title">
                <span>楼咖后台管理系统</span>
            </div>
            <div class="inp_group">
                <div class="inp_group_title"><label for="username">用户名</label></div>
                <input v-model="user.phone" id="username" type="text" placeholder="请输入手机号">
            </div>
            <div class="inp_group">
                <div class="inp_group_title"><label for="password">密 码</label></div>
                <input v-model="user.password" id="password" type="password" placeholder="请输入密码">
            </div>
            <p class="remember">
                <label for="remember">记住密码 </label>
                <input type="checkbox" id="remember">
            </p>
            <button class="login_btn" @click="login">登 录</button>
        </div>
    </div>
</template>

<script>

import jquery from '../static/lib/jquery-1.9.1.min.js'
export default {
    name: 'login',
    data () {
        return {
            testPhone:true,
            user:{
                password:'',
                phone:'',
            }
        }
    },
    beforeCreate: function(){
        $('html').css({
            'height':'100%'
        })
        $('body').css({
            'background':'url(static/bg.jpg) no-repeat',
            'background-size':'cover',
            'width':'100%',
            'height':'100%'
        })
    },
    watch:{
        phone:function(){
//            var pattern = /^1[34578]\d{9}$/;
//            pattern.test(this.phone);
        },
    },
    methods:{
        login(){
            this.$http.post('http://'+ global.URL +'/v1/user/login',this.user).then((response) => {
                if(response.body.code == 200 || response.body.code == 201){
                    this.$message({
                        message: '登录成功',
                        type: 'success'
                    });
                    window.location.href="/home"
                    var str = JSON.stringify(response.body.data)
                    window.sessionStorage.setItem('loginLoucaUser',str)
                }else{
                    this.$message({
                        message: response.body.message,
                        type: 'warning'
                    });
                }
            },(response) => {

            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    html,body{
        width:100%;
        height: 100%;
        min-height: 600px;
    }
    .title{
        position: absolute;
        top: 12px;
        left: 12px;
        width: 100%;
        font-size: 20px;
    }
    .inp_group{
        height: 40px;
        width: 310px;
        margin: 18px auto;
        margin-top: 0;
        font-size: 0px;
        vertical-align: middle;
    }
    .inp_group_title{
        text-align: center;
        display: inline-block;
        font-size: 16px;
        height: 40px;
        width: 50px;
        line-height: 40px;
        border: 1px solid #ccc;
        border-right: none;
        padding: 0 12px;
        border-radius: 6px 0 0 6px;
        background: #1D8CE0;
        color: #efefef;
    }
    .inp_group input{
        display: inline-block;
        height: 40px;
        line-height: 40px;
        width: 200px;
        border:1px solid #ccc;
        border-left: none;
        padding: 0 12px;
        border-radius: 0 6px 6px 0;
        font-size: 16px;
    }
    .login_box{
        overflow: hidden;
        background: rgba(255,255,255,0.65);
        width: 400px;
        padding-top: 70px;
        height: 250px;
        border: 1px solid #ccc;
        border-radius: 6px;
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        -o-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
    }
    .remember{
        width: 300px;
        margin: 0 auto;
        text-align: right;
        color:#666666;
    }
    .login_btn{
        display: block;
        margin: 12px auto;
        font-size: 16px;
        border: none;
        width: 300px;
        background: #1D8CE0;
        color: #efefef;
        line-height: 40px;
        border-radius: 6px;
    }
    .login_btn:hover{
        background: #20a0ff;
    }
</style>













