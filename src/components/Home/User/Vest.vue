<template>
    <div class="box">
        <el-tabs v-model="activeName">
            <!--      全部马甲      -->
            <el-tab-pane label="全部马甲" name="全部马甲">

                <div class="search_box">
                    <el-select v-model="selectKey.type" clearable placeholder="选择社区">
                        <el-option
                            v-for="item in selectScope.community"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <div class="searchUser">
                        <el-input placeholder="请输入内容" v-model="selectKey.userKey">
                            <el-select v-model="selectKey.selectUser" slot="prepend" placeholder="请选择">
                                <el-option label="昵称" value="1"></el-option>
                                <el-option label="手机号" value="2"></el-option>
                            </el-select>
                        </el-input>
                    </div>
                    <el-button type="primary">搜索</el-button>
                </div>
                
                <div class="table_handle">
                    <el-button type="primary">屏蔽</el-button>
                </div>
                <!--    聚会列表    -->
                <div class="table_box">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll" @change="checkAll($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>用户</th>
                                <th>社区</th>
                                <th>资料完整度</th>
                                <th>动态</th>
                                <th>楼咖秀</th>
                                <th>注册时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in data">
                                <td>
                                    <el-checkbox 
                                        v-model="data[index].isChecked" 
                                        class="check_btn" @change="checkOne($event.target.checked,item.id)"> 
                                        {{item.id}}
                                    </el-checkbox>
                                </td>
                                <td>{{item.user}}</td>
                                <td>{{item.community}}</td>
                                <td>{{item.integrity}}</td>
                                <td>{{item.dynamics}}</td>
                                <td>{{item.show}}</td>
                                <td>{{item.createTime}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="showUser(item.id)">编辑</a>
                                    <a href="javascript:void(0)">发动态</a>
                                    <a href="javascript:void(0)">屏蔽</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_control">
                        <el-pagination
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="page.currentPage"
                          :page-sizes="[100, 200, 300, 400]"
                          :page-size="100"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="400">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="创建马甲" name="创建马甲">
                <table class="createVest_box">
                    <tr>
                        <td>手机号:</td>
                        <td>
                            <el-input placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>密码:</td>
                        <td>
                            <el-input type="password" placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>昵称:</td>
                        <td>
                            <el-input type="password" placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>头像:</td>
                        <td>
                            <el-button>添加头像</el-button>
                        </td>
                    </tr>
                    <tr>
                        <td>性别:</td>
                        <td>
                            <el-radio class="radio" v-model="createVest.sex" label="0">男</el-radio>
                            <el-radio class="radio" v-model="createVest.sex" label="1">女</el-radio>
                            <el-radio class="radio" v-model="createVest.sex" label="2">保密</el-radio>
                        </td>
                    </tr>
                    <tr>
                        <td>生日:</td>
                        <td>
                            <el-date-picker
                                v-model="createVest.birthday"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </td>
                    </tr>
                    <tr>
                        <td>社区:</td>
                        <td>
                            选择社区
                        </td>
                    </tr>
                    <tr>
                        <td>楼层:</td>
                        <td>
                            <el-input placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>姓名:</td>
                        <td>
                            <el-input placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>公司:</td>
                        <td>
                            <el-input placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>职位:</td>
                        <td>
                            <el-input placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>个人标签:</td>
                        <td>
                            <el-input placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>认证状态:</td>
                        <td>
                            <el-radio class="radio" v-model="createVest.state" label="0">已认证</el-radio>
                            <el-radio class="radio" v-model="createVest.state" label="1">未认证</el-radio>
                        </td>
                    </tr>
                    <tr>
                        <td>注册时间:</td>
                        <td>
                            <el-date-picker
                                v-model="createVest.loginTime"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </td>
                    </tr>
                </table>
            </el-tab-pane>
        </el-tabs>
        
    </div>
</template>

<script>
export default {
    name: 'vest',
    data () {
        return {
            showUserDetail:true,
            activeName:'全部马甲',
            page:{
                currentPage:1
            },
            isIndeterminate:false,
            isCheckedAll:false,
            checked:[],
            selectKey:{},
            selectScope:{
                type:[{
                  value: '选项1',
                  label: '掘金'
                }, {
                  value: '选项2',
                  label: '喝水'
                }, {
                  value: '选项3',
                  label: '跑步'
                }]
            },
            data:[
                {
                    id: 0,
                    user: '沙发',
                    community: '英豪大厦',
                    integrity: '88%',
                    dynamics: 23,
                    show: 4,
                    createTime: '2017.2.29',
                    isChecked:false,
                },{
                    id: 1,
                    user: '沙水电费',
                    community: '英豪大厦',
                    integrity: '88%',
                    dynamics: 23,
                    show: 4,
                    createTime: '2017.2.29',
                    isChecked:false,
                }
            ],
            createVest:{
                tel:'',
                password:'',
                nickname:'',
                head:'',
                sex:'',
                birthday:'',
                community:'',
                floor:'',
                name:'',
                company:'',
                position:'',
                label:[],
                state: '',
                loginTime:'',
            }
        }
    },
    beforeCreate: function(){
    },
    mounted: function(){
        (function init(){
            $('.el-tabs__header').css({
                background:'white'
            })
            $('.searchUser .el-input-group__prepend .el-input__inner').css({
                width:'100px'
            })
            $('.el-card__header').css({
                background:'rgb(65,65,73)'
            })
            $('.el-card__body').css({
                padding: '0px'
            })
            $('.el-tabs__content').css({
                overflow: 'visible'
            })
        })()
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${val}`);
        },
        checkAll:function(isChecked){
            this.checked = [];
            if(isChecked){
                console.log('aaa')
                for(let i = 0; i < this.data.length; i++){
                    this.data[i].isChecked = true;
                    this.checked.push(this.data[i].id)
                }
            }else{
                for(let i = 0; i < this.data.length; i++){
                    this.data[i].isChecked = false;
                }
            }
            this.isIndeterminate = false;
            
        },
        checkOne:function(isChecked,id){
            if(isChecked){
                this.checked.push(id)
            }else{
                for(let i = 0; i < this.checked.length; i++){
                    if(this.checked[i] == id){
                        this.checked.splice(i,1)
                    }
                }
            }
            if(this.checked.length == this.data.length){
                this.isIndeterminate = false;
                this.isCheckedAll = true;
            }else if(this.checked.length == 0){
                this.isIndeterminate = false;
                this.isCheckedAll = false;
            }else{
                this.isIndeterminate = true;
            }
            console.log(this.checked)
        },
        showUser(o){
            console.log(o)
            this.showUserDetail = true;
        },
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*
        Search
    */
    .title{
        font-size: 20px;
    }
    .search_box{
        padding: 12px 36px;
        text-align: right;
    }
    .searchUser{
        display: inline-block;
        width:340px;
    }
    .userKey{
        width:200px;
    }
    
    /*
        Table
    */
    .table_box{
        padding: 0 35px;
    }
    .table{
        width: 100%;
        border-collapse: collapse;
    }
    .table_control{
        position: relative;
        box-sizing: border-box;
        border:1px solid rgb(222,222,222);
        border-top: none;
        padding: 12px 24px;
        text-align: right;
        background: #fff;
    }
    .table td,.table th{
        border: 1px solid rgb(222,222,222);
        padding: 12px;
        text-align: center;
    }
    .table td{
        background: #fff;
    }
    .table th{
        padding: 12px;
        background: rgb(238,248,249);
    }
    .table_handle{
        padding: 12px 35px;
    }
    .operation>a{
        color:#20a0ff;
        padding: 0 2px;
    }
    /*
        CreateVest
    */
    .createVest_box{
    }
    .createVest_box td{
        padding: 6px;
    }
</style>


























