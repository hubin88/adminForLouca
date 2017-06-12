<template>
    <div class="box">
        <el-tabs v-model="activeName">
            <!--      搜索      -->
            <el-tab-pane label="举报管理" name="举报管理">
                <div class="search_box">
                    <el-select v-model="selectKey.targetType" clearable placeholder="对象类型">
                        <el-option
                            v-for="item in selectScope.targetType"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="selectKey.causeType" clearable placeholder="举报类型">
                        <el-option
                            v-for="item in selectScope.causeType"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="selectKey.state" clearable placeholder="状态">
                        <el-option
                            v-for="item in selectScope.state"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <div class="searchText">
                        <el-input placeholder="搜索被举报人" v-model="selectKey.content">
                            <el-select v-model="selectKey.searchContentType" slot="prepend" placeholder="请选择">
                                <el-option label="昵称" value="1"></el-option>
                                <el-option label="手机号" value="2"></el-option>
                            </el-select>
                        </el-input>
                    </div>
                    <el-button type="primary">搜索</el-button>
                </div>
                
                <div class="table_handle">
                    <el-button type="primary">删除</el-button>
                    <el-button type="primary">删除并禁言</el-button>
                </div>
                
                <!--    列表    -->
                <div class="table_box">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll" @change="checkAll($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>对象类型</th>
                                <th>内容</th>
                                <th>被举报次数</th>
                                <th>被举报人</th>
                                <th>类型</th>
                                <th>时间</th>
                                <th>状态</th>
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
                                <td>{{item.targetType}}</td>
                                <td>{{item.content}}</td>
                                <td>{{item.num}}</td>
                                <td>{{item.user.name}}</td>
                                <td>{{item.causeType}}</td>
                                <td>{{item.time}}</td>
                                <td>{{item.state}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)">查看</a>
                                    <a href="javascript:void(0)">删除</a>
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
    name: 'assess',
    data () {
        return {
            showUserDetail:true,
            activeName:'举报管理',
            page:{
                currentPage:1
            },
            isIndeterminate:false,
            isCheckedAll:false,
            checked:[],
            selectKey:{
                targetType:'',
                causeType:'',
                state:'',
                searchContentType:'昵称',
                content:'',
            },
            selectScope:{
                targetType:[{
                  value: '选项1',
                  label: '动态'
                },{
                  value: '选项2',
                  label: '楼咖秀'
                },{
                  value: '选项3',
                  label: '聚会'
                }],
                causeType:[{
                  value: '选项1',
                  label: '色情/暴力/政治'
                },{
                  value: '选项2',
                  label: '广告信息'
                },{
                  value: '选项3',
                  label: '钓鱼/欺诈信息'
                },{
                  value: '选项4',
                  label: '诽谤造谣信息'
                },{
                  value: '选项5',
                  label: '其他'
                }],
                state:[{
                  value: '选项1',
                  label: '已处理'
                },{
                  value: '选项2',
                  label: '暂不处理'
                },{
                  value: '选项1',
                  label: '待处理'
                }],
            },
            data:[
                {
                    id: 0,
                    targetType: '动态',
                    content: '不拉不拉不拉不拉不拉不拉不拉不拉',
                    num: 12,
                    user: {
                        name:'网老虎'
                    },
                    causeType: '广告信息',
                    time: '2017.1.20 20:13',
                    state: '待处理',
                    isChecked:false,
                },{
                    id: 1,
                    targetType: '动态',
                    content: '不拉不拉不拉不拉不拉不拉不拉不拉',
                    num: 12,
                    user: {
                        name:'网老虎'
                    },
                    causeType: '广告信息',
                    time: '2017.1.20 20:13',
                    state: '待处理',
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