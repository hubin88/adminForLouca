// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import '../static/global.js'            // 加载全局变量
import Methods from './static/methods.js'          // 加载全局方法
import Unload from './myComponents/unload'         // 加载Unload组件
import Delete from './myComponents/delete.vue'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Element)
Vue.use(Methods)                                 // 注册全局方法
Vue.component('my-unload', Unload)                                   // 注册全局组件
Vue.component('delete', Delete)

import Login from './components/Login.vue'
import Home from './components/Home.vue'

import Statistics from './components/Home/Admin/Statistics.vue'
//Administration
import Administration from './components/Home/Administration/Administration.vue'
import Notification from './components/Home/Administration/Notification.vue'
//User
import User from './components/Home/User/User.vue'
import Charm from './components/Home/User/Charm.vue'
import Vest from './components/Home/User/Vest.vue'
import FloorGroup from './components/Home/User/FloorGroup.vue'
import LabelGroup from './components/Home/User/LabelGroup.vue'
import GatheringGroup from './components/Home/User/GatheringGroup.vue'
//Content
import Dynamics from './components/Home/Content/Dynamics.vue'
import Announcement from './components/Home/Content/Announcement.vue'
import Comments from './components/Home/Content/Comments.vue'
import Assess from './components/Home/Content/Assess.vue'
import FloorShow from './components/Home/Content/FloorShow.vue'
import CheckStreet from './components/Home/Content/CheckStreet.vue'
import Gathering from './components/Home/Content/Gathering.vue'
import Loucabeen from './components/Home/Content/Loucabeen.vue'
import Service from './components/Home/Content/Service.vue'
//Auditing
import Identification from './components/Home/Auditing/Identification.vue'
import Report from './components/Home/Auditing/Report.vue'
//Community
import Community from './components/Home/Community/Community.vue'
import TradingArea from './components/Home/Community/TradingArea.vue'
//System
import Advertisement from './components/Home/System/Advertisement.vue'
import Label from './components/Home/System/Label.vue'
import Trade from './components/Home/System/Trade.vue'
import Authority from './components/Home/System/Authority.vue'
//account
import Account from './components/Home/Account/account.vue';
import Transaction from './components/Home/Account/transaction.vue';
//message
// import NewBuildMessage from './components/Home/Message/NewBuildMessage.vue';
import Message from './components/Home/Message/Message.vue';

const router = new VueRouter({
  mode: 'history',
  component: App,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [

        {
          path: 'statistics',
          name: 'statistics',
          component: Statistics
        },
        // Administration
        {
          path: 'administration',
          name: 'administration',
          component: Administration
        },
        {
          path: 'notification',
          name: 'notification',
          component: Notification
        },

        //User

        {
          path: 'user',
          name: 'user',
          component: User
        },{
          path: 'charm',
          name: 'charm',
          component: Charm,
        },{
          path: 'vest',
          name: 'vest',
          component: Vest
        }, {
          path: 'floorgroup',
          name: 'floorgroup',
          component: FloorGroup
        }, {
          path: 'labelgroup',
          name: 'labelgroup',
          component: LabelGroup
        }, {
          path: 'gatheringgroup',
          name: 'gatheringgroup',
          component: GatheringGroup
        },

        //Content
        {
          path: 'dynamics',
          name: 'dynamics',
          component: Dynamics
        }, {
          path: 'announcement',
          name: 'announcement',
          component: Announcement
        }, {
          path: 'comments',
          name: 'comments',
          component: Comments
        }, {
          path: 'assess',
          name: 'assess',
          component: Assess
        }, {
          path: 'floorshow',
          name: 'floorshow',
          component: FloorShow
        }, {
          path: 'checkstreet',
          name: 'checkstreet',
          component: CheckStreet
        }, {
          path: 'gathering',
          name: 'gathering',
          component: Gathering
        }, {
          path: 'loucabeen',
          name: 'loucabeen',
          component: Loucabeen
        }, {
          path: 'service',
          name: 'service',
          component: Service
        },

        //Aduiting
        {
          path: 'identification',
          name: 'identification',
          component: Identification
        }, {
          path: 'report',
          name: 'report',
          component: Report
        },

        //Community
        {
          path: 'community',
          name: 'community',
          component: Community
        }, {
          path: 'tradingarea',
          name: 'tradingarea',
          component: TradingArea
        },

        //System
        {
          path: 'advertisement',
          name: 'advertisement',
          component: Advertisement
        }, {
          path: 'label',
          name: 'label',
          component: Label
        }, {
          path: 'trade',
          name: 'trade',
          component: Trade
        }, {
          path: 'authority',
          name: 'authority',
          component: Authority
        },

        //account
        {
          path: 'transaction',
          name: 'transaction',
          component: Transaction
        },
        {
          path: 'account',
          name: 'account',
          component: Account
        },
        {
          path: 'allMessage',
          name: 'allMessage',
          component: Message,
        },
      ]
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})

new Vue({
  el: '#app',
  router: router
}).$mount('#app')
