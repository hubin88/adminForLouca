<template>
    <div class="box">
        <el-tabs v-model="activeName">
            <!--      搜索      -->
            <el-tab-pane label="聚会群" name="聚会群">

                <div class="search_box">
                    <el-date-picker
                        v-model="selectKey.createTime"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                    <div class="searchText">
                        <el-input placeholder="请输入内容" v-model="selectKey.userKey">
                            <el-select v-model="selectKey.selectUser" slot="prepend" placeholder="群名称">
                                <el-option label="群名称" value="1"></el-option>
                                <el-option label="群主昵称" value="2"></el-option>
                            </el-select>
                        </el-input>
                    </div>
                    <el-button type="primary">搜索</el-button>
                </div>
                
                <div class="table_handle">
                    <!--<el-button type="primary">屏蔽</el-button>-->
                </div>
                
                <!--    列表    -->
                <div class="table_box">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll" @change="checkAll($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>聚会群名称</th>
                                <th>群成员数量</th>
                                <th>3日消息数</th>
                                <th>群主</th>
                                <th>时间</th>
                                <th>群介绍</th>
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
                                <td>{{item.name}}</td>
                                <td>{{item.member}}</td>
                                <td>{{item.news}}</td>
                                <td>{{item.owner}}</td>
                                <td>{{item.createTime}}</td>
                                <td>{{item.introduce}}</td>
<!--
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="showUser(item.id)">编辑</a>
                                    <a href="javascript:void(0)">发动态</a>
                                    <a href="javascript:void(0)">屏蔽</a>
                                </td>
-->
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
    name: 'gatheringGroup',
    data () {
        return {
            showUserDetail:true,
            activeName:'聚会群',
            page:{
                currentPage:1
            },
            isIndeterminate:false,
            isCheckedAll:false,
            checked:[],
            selectKey:{
                createTime:'',
            },
            selectScope:{
                tradingArea:[{
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
                    name: '摄影群',
                    member: '23',
                    news: '12',
                    owner:'乐天天',
                    createTime: '2017.01.16 23:19',
                    introduce: '01月16号聚会群',
                    isChecked:false,
                },{
                    id: 1,
                    name: '摄影群',
                    member: '23',
                    news: '12',
                    owner:'乐天天',
                    createTime: '2017.01.16 23:19',
                    introduce: '01月16号聚会群',
                    isChecked:false,
                }
            ]
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