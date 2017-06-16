<template>
    <div class="box">
        <el-tabs v-model="activeName">
            <!--      搜索      -->
            <el-tab-pane label="全部评论" name="全部评论">
                <div class="search_box">
                    <el-select v-model="selectKey.type" clearable placeholder="评论类型">
                        <el-option
                            v-for="item in selectScope.type"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <div class="searchText">
                        <el-input placeholder="请输入内容" v-model="selectKey.userKey">
                            <el-select v-model="selectKey.searchUserType" slot="prepend" placeholder="群名称">
                                <el-option label="用户名" value="1"></el-option>
                                <el-option label="手机号" value="2"></el-option>
                            </el-select>
                        </el-input>
                    </div>
                    <div class="searchText">
                        <el-input placeholder="请输入内容" v-model="selectKey.content">
<!--
                            <el-select v-model="selectKey.selectUser" slot="prepend" placeholder="群名称">
                                <el-option label="群名称" value="1"></el-option>
                                <el-option label="群主昵称" value="2"></el-option>
                            </el-select>
-->
                        </el-input>
                    </div>
                    <el-button type="primary">搜索</el-button>
                </div>

                <div class="table_handle">
                    <el-button type="primary" v-if="hasPrivileges('comment_manage')">删除</el-button>
                </div>

                <!--    列表    -->
                <div class="table_box">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll" @change="checkAll($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>评论</th>
                                <th>评论人</th>
                                <th>类型</th>
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
                                <td>{{item.comment}}</td>
                                <td>{{item.commenter}}</td>
                                <td>{{item.type}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)">查看</a>
                                    <a href="javascript:void(0)" v-if="hasPrivileges('comment_manage')">删除</a>
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
        </el-tabs>

    </div>
</template>

<script>
export default {
    name: 'comments',
    data () {
        return {
            activeName:'全部评论',
            page:{
                currentPage:1
            },
            isIndeterminate:false,
            isCheckedAll:false,
            checked:[],
            selectKey:{
                type:'',
                searchUserType:'',
                userKey:'',
            },
            selectScope:{
                type:[{
                  value: '选项1',
                  label: '动态评论'
                }, {
                  value: '选项2',
                  label: '公告评论'
                }, {
                  value: '选项3',
                  label: '楼咖秀评论'
                }, {
                  value: '选项4',
                  label: '聚会评论'
                }],
            },
            data:[
                {
                    id: 0,
                    comment: '说的不错，我也是这样想滴，说的不错，我也是这样想滴',
                    commenter: '全部',
                    type: '动态评论',
                    isChecked:false,
                },{
                    id: 1,
                    comment: '说的不错，我也是这样想滴，说的不错，我也是这样想滴',
                    commenter: '全部',
                    type: '动态评论',
                    isChecked:false,
                },
            ],
        }
    },
    beforeCreate: function(){
    },
    mounted: function(){
        (function init(){
            $('.el-tabs__header').css({
                background:'white'
            })
            $('.searchText .el-input-group__prepend .el-input__inner').css({
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
        createAnnoucement
    */
    .issue_box{
        padding: 12px;
        padding-left: 36px;
    }
    .list_box{
        vertical-align: top;
        margin-bottom: 12px;
    }
    .issue_list{
        display: inline-block;
        vertical-align: top;
        font-size: 18px;
        line-height: 36px;
        margin-right: 12px;
        width:80px;
        text-align: center;
    }
    .issue_content{
        width: 1000px;
    }
    .issue_url{
        display: inline-block;
        width:214px;
    }
    .block{
        padding: 12px;
    }
    .img_list{
        display: inline-block;
        width:1000px;
    }
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
    .searchText{
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
</style>
