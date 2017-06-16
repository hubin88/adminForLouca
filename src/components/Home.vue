<style scoped>
  header {
    height: 86px;
    width: 100%;
    background: white;
    position: relative;
  }

  .title {
    width: 310px;
    height: 86px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
  }

  .title .logo_box {
    position: absolute;
    left: 0;
    top: 0;
    width: 86px;
    height: 86px;
    display: inline-block;
  }

  .title a {
    position: absolute;
    right: 0;
    width: 224px;
    height: 86px;
    display: inline-block;
    box-sizing: border-box;
    border-right: 2px solid rgb(202, 202, 202);
    line-height: 86px;
    text-align: center;
    font-size: 24px;
  }

  .title h1 {
    font-size: 24px;
  }

  .control {
    width: 120px;
    height: 86px;
    position: absolute;
    left: 342px;
    display: inline-block;
  }

  .control a, .user_btn a {
    width: 44px;
    height: 86px;
    display: inline-block;
  }

  .control .back_btn {
    position: absolute;
    left: 0;
    background: url(../assets/home/images/back.png) no-repeat;
    background-position: center;
  }

  .control .forward_btn {
    position: absolute;
    right: 0;
    background: url(../assets/home/images/forward_s.png) no-repeat;
    background-position: center;
  }

  .back_btn:hover {
    background: url(../assets/home/images/back_N.png) no-repeat;
    background-position: center;
  }

  .forward_btn:hover {
    background: url(../assets/home/images/forward_n.png) no-repeat;
    background-position: center;
  }

  .user {
    width: 300px;
    height: 86px;
    position: absolute;
    right: 44px;
    top: 0;
  }

  .head_box {
    width: 50px;
    height: 50px;
    margin: 18px 0;
    display: inline-block;
    background: url(../assets/home/images/Ellipse-1.png) no-repeat;
    background-size: auto;
    background-position: center;
  }

  .nickname {
    height: 86px;
    width: 116px;
    line-height: 86px;
    padding: 0 12px;
    display: inline-block;
    font-size: 18px;
    vertical-align: text-bottom;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .user_btn {
    width: 120px;
    height: 86px;
    position: absolute;
    right: 0;
    top: 0;
  }

  .locking {
    position: absolute;
    left: 0;
    background: url(../assets/home/images/lock_n.png) no-repeat;
    background-position: center;
  }

  .logout {
    position: absolute;
    right: 0;
    background: url(../assets/home/images/quit_N.png) no-repeat;
    background-position: center;
  }

  .locking:hover {
    background: url(../assets/home/images/lock_s.png) no-repeat;
    background-position: center;
  }

  .logout:hover {
    background: url(../assets/home/images/quit_s.png) no-repeat;
    background-position: center;
  }

  section {
    width: 100%;
    position: absolute;
    top: 86px;
    bottom: 0px;
  }

  .clear {
    clear: both;
  }

  /*
      aside
  */
  aside {
    width: 310px;
    height: 100%;
    position: relative;
    left: 0;
    top: 0;
    background: url(../assets/home/images/bg1.png);
    background-repeat: repeat-y;
    float: left;
    overflow: auto;
  }

  .fold aside {
    width: 86px;
  }

  .fold aside .hide_box {
    width: 86px;
  }

  .fold aside .first_nav .nav_text {
    width: 0;
    padding: 0;
  }

  .fold .content {
    left: 86px
  }

  .fold aside .second_nav li span {
    margin-left: 24px;
  }

  .hide_box {
    text-align: right;
    width: 310px;
    height: 40px;
    font-size: 16px;
    background: rgb(70, 70, 78);
  }

  .hide_box .hide_btn {
    color: rgb(149, 160, 170);
    line-height: 40px;
    margin-right: 20px;
  }

  .hide_box .hide_btn:hover {
    color: white;
  }

  .first_nav {
    height: 65px;
    position: relative;
  }

  .first_nav .active {
    color: #fff;
  }

  .first_nav .active a {
    color: #fff;
    transform: rotate(90deg);
  }

  .nav_icon {
    width: 86px;
    height: 65px;
    position: absolute;
    left: 0;
    top: 0;
    background: rgb(75, 75, 84);
  }

  .nav_icon img {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .nav_text {
    cursor: pointer;
    width: 204px;
    height: 65px;
    position: absolute;
    right: 0;
    top: 0;
    padding-left: 20px;
    font-size: 20px;
    background: rgb(65, 65, 74);
    line-height: 65px;
    color: rgb(149, 160, 170);
    overflow: hidden;
  }

  .nav_text .fold {
  }

  .nav_text:hover {
    color: white;
    transition: all ease 0.5s;
  }

  .first_nav .nav_text a {
    position: absolute;
    right: 20px;
    color: rgb(149, 160, 170);
    top: 22px;
    border-radius: 50%;
    transition: all ease 0.5s;
  }

  .nav_text:hover a {
    transform: rotate(90deg);
    transition: all ease 0.5s;
    transform-origin: 50% 50%;
    color: white;
  }

  .second_nav {
    display: none;
    width: 100%;
    background: rgb(65, 65, 74);
  }

  .second_nav li {
    height: 65px;
    width: 100%;
    font-size: 20px;
    line-height: 65px;
    color: rgb(149, 160, 170);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .second_nav li span {
    margin-left: 125px;
  }

  .second_nav li:hover {
    background: rgb(100, 100, 115);
    color: white;
  }

  /*
      Content
  */
  .content {
    overflow: auto;
    position: absolute;
    left: 310px;
    right: 0;
    width: auto;
    height: 100%;
    background: rgb(241, 241, 241);
    float: right;
  }

</style>

<template>
  <div>
    <header>
      <div class="title">
        <div class="logo_box">
          <img src="../assets/home/images/logo.png">
        </div>
        <a href="">
          <h1>后台管理系统</h1>
        </a>
      </div>
      <div class="control">
        <a href="" class="back_btn"></a>
        <a href="" class="forward_btn"></a>
      </div>
      <div class="user">
        <div class="head_box" :style="userHeadStyle"></div>
        <div class="nickname">{{ loginUser.name }}</div>
        <div class="user_btn">
          <a href="" class="locking"></a>
          <a href="" class="logout" @click="logout"></a>
        </div>
      </div>
    </header>

    <section id="louca">
      <!--    侧边栏   -->
      <aside>
        <li class="hide_box">
          <a href="javascript:void(0)" class="hide_btn el-icon-d-arrow-left"></a>
        </li>
        <!--     管理面板       -->
        <li class="first_nav">
          <a href="javascript:void(0)" class="nav_icon">
            <img src="../assets/home/images/monitor.png" alt="*">
          </a>
          <div class="nav_text">
            管理面板
            <a href="javascript:void(0)" class="el-icon-arrow-right"></a>
          </div>
        </li>
        <ul class="second_nav">
          <router-link :to="{name:'statistics'}" href="javascript:void(0)">
            <li class="list"><span>统计</span></li>
          </router-link>
          <!--
                              <router-link :to="{name:'administration'}" href="javascript:void(0)"><li class="list"><span>管理面板</span></li></router-link>
                              <router-link :to="{name:'notification'}" href="javascript:void(0)"><li class="list"><span>通知推送</span></li></router-link>
          -->
        </ul>

        <!--     用户群组       -->
        <li class="first_nav">
          <a href="javascript:void(0)" class="nav_icon">
            <img src="../assets/home/images/user.png" alt="*">
          </a>
          <div class="nav_text">
            用户群组
            <a href="javascript:void(0)" class="el-icon-arrow-right"></a>
          </div>
        </li>
        <ul class="second_nav">
          <router-link :to="{name:'user'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('user_view')"><span>用户管理</span></li>
          </router-link>

          <!--
                              <router-link :to="{name:'vest'}" href="javascript:void(0)"><li class="list"><span>马甲管理</span></li></router-link>
                              <router-link :to="{name:'floorgroup'}" href="javascript:void(0)"><li class="list"><span>同楼群</span></li></router-link>
                              <router-link :to="{name:'labelgroup'}" href="javascript:void(0)"><li class="list"><span>标签群</span></li></router-link>
                              <router-link :to="{name:'gatheringgroup'}" href="javascript:void(0)"><li class="list"><span>聚会群</span></li></router-link>
          -->
        </ul>

        <!--     内容应用       -->
        <li class="first_nav">
          <a href="javascript:void(0)" class="nav_icon">
            <img src="../assets/home/images/pencil.png" alt="*">
          </a>
          <div class="nav_text">
            内容应用
            <a href="javascript:void(0)" class="el-icon-arrow-right"></a>
          </div>
        </li>
        <ul class="second_nav">
          <router-link :to="{name:'dynamics'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('newsletter_view')"><span>动态管理</span></li>
          </router-link>
          <router-link :to="{name:'announcement'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('announce_view')"><span>公告管理</span></li>
          </router-link>
          <!--
                              <router-link :to="{name:'comments'}" href="javascript:void(0)"><li class="list"><span>评论管理</span></li></router-link>
          -->
          <router-link :to="{name:'assess'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('comment_view')"><span>评论管理</span></li>
          </router-link>
          <router-link :to="{name:'floorshow'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('showtime_view')"><span>楼咖秀</span></li>
          </router-link>
          <!--                    <router-link :to="{name:'checkstreet'}" href="javascript:void(0)"><li class="list"><span>查令街</span></li></router-link>-->
          <router-link :to="{name:'gathering'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('partying_view')"><span>聚会</span></li>
          </router-link>
          <router-link :to="{name:'loucabeen'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('been_view')"><span>咖豆管理</span></li>
          </router-link>
          <router-link :to="{name:'service'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('service_view')"><span>服务管理</span></li>
          </router-link>
        </ul>

        <!--     认证审核       -->
        <li class="first_nav">
          <a href="javascript:void(0)" class="nav_icon">
            <img src="../assets/home/images/audit.png" alt="*">
          </a>
          <div class="nav_text">
            认证审核
            <a href="javascript:void(0)" class="el-icon-arrow-right"></a>
          </div>
        </li>
        <ul class="second_nav">
          <router-link :to="{name:'identification'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('certificate_view')"><span>认证管理</span></li>
          </router-link>
          <!--                    <router-link :to="{name:'report'}" href="javascript:void(0)"><li class="list"><span>举报管理</span></li></router-link>-->
        </ul>

        <!--     社区商圈       -->
        <li class="first_nav">
          <a href="javascript:void(0)" class="nav_icon">
            <img src="../assets/home/images/crowd.png" alt="*">
          </a>
          <div class="nav_text">
            社区商圈
            <a href="javascript:void(0)" class="el-icon-arrow-right"></a>
          </div>
        </li>
        <ul class="second_nav">
          <router-link :to="{name:'community'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('group_view')"><span>社区管理</span></li>
          </router-link>
          <router-link :to="{name:'tradingarea'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('circle_view')"><span>商圈管理</span></li>
          </router-link>
        </ul>

        <!--     系统设置       -->
        <li class="first_nav">
          <a href="javascript:void(0)" class="nav_icon">
            <img src="../assets/home/images/cog.png" alt="*">
          </a>
          <div class="nav_text">
            系统设置
            <a href="javascript:void(0)" class="el-icon-arrow-right"></a>
          </div>
        </li>
        <ul class="second_nav">
          <router-link :to="{name:'advertisement'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('place_view')"><span>广告管理</span></li>
          </router-link>
          <router-link :to="{name:'label'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('tag_view')"><span>标签管理</span></li>
          </router-link>
          <router-link :to="{name:'authority'}" href="javascript:void(0)">
            <li class="list" v-if="hasPrivileges('permission_view')"><span>角色&权限</span></li>
          </router-link>
          <!--
                              <router-link :to="{name:'trade'}" href="javascript:void(0)"><li class="list"><span>行业管理</span></li></router-link>

          -->
        </ul>
        <!-- 账户管理 -->
        <li class="first_nav">
          <a href="javascript:void(0)" class="nav_icon">
            <img src="../assets/home/images/crowd.png" alt="*">
          </a>
          <div class="nav_text">
            账户管理
            <a href="javascript:void(0)" class="el-icon-arrow-right"></a>
          </div>
        </li>
        <ul class="second_nav">
          <router-link :to="{name:'transaction'}" href="javascript:void(0)">
            <li class="list"><span>交易管理</span></li>
          </router-link>
          <router-link :to="{name:'account'}" href="javascript:void(0)">
            <li class="list"><span>账户管理</span></li>
          </router-link>
        </ul>

        <!-- 群发管理 -->
        <li class="first_nav">
          <a href="javascript:void(0)" class="nav_icon">
            <img src="../assets/home/images/crowd.png" alt="*">
          </a>
          <div class="nav_text">
            群发管理
            <a href="javascript:void(0)" class="el-icon-arrow-right"></a>
          </div>
        </li>
        <ul class="second_nav">
          <!--<router-link :to="{name:'newbuildmessage'}" href="javascript:void(0)">-->
            <!--<li class="list"><span>新建群发</span></li>-->
          <!--</router-link>-->
          <router-link :to="{name:'allMessage'}" href="javascript:void(0)">
            <li class="list"><span>全部消息</span></li>
          </router-link>
        </ul>


      </aside>

      <!--    主体    -->
      <div class="content">
        <router-view :privileges="privileges"
                     @change-privileges="changePrivileges"></router-view>
        <!--                <router-view></router-view>-->
      </div>

      <!--    清除浮动    -->
      <div class="clear"></div>
    </section>
  </div>
</template>

<script>
  import jquery from '../static/lib/jquery-1.9.1.min.js'
  export default({
    data(){
      return {
        privileges: []
      }
    },
    beforeCreate: function () {
      console.log(window.sessionStorage.getItem('loginLoucaUser'));
      if (!!window.sessionStorage.getItem('loginLoucaUser')) {
        var that = this;
        var login = window.sessionStorage.getItem('loginLoucaUser');
        this.loginUser = JSON.parse(login);
        this.privileges = this.loginUser.privileges;
        this.userHeadStyle = {
          background: 'url(' + that.loginUser.headPic + ')',
          'background-size': 'cover',
          'background-position': 'center',
          'border-radius': '9999px'
        }
      } else {
        window.location.href = '/login'
      }
    },
    mounted: function () {
      $(function () {
        function init() {
          $('.first_nav').click(function () {
            $(this).stop();
            $(this).find('.nav_text').toggleClass('active');
            $(this).next('.second_nav').slideToggle();
          })
          $('.hide_btn').click(function () {
            $('section').toggleClass('fold');
            $(this).toggleClass('el-icon-d-arrow-right');
          })
          $('.forward_btn').click(function () {
            window.history.go(1)
          })
          $('.back_btn').click(function () {
            window.history.go(-1)
          })
        }

        init();
      })
    },
    methods: {
      logout(){
        window.sessionStorage.removeItem('loginLoucaUser')
      },
      changePrivileges(obj){
        this.privileges = obj;
        console.log(this.privileges);
      }
    }
  })
</script>






















