<template>
    <div class="box">
        <el-tabs v-model="activeName">
            <!--      搜索      -->
            <el-tab-pane label="全部行业" name="全部行业">
                <div class="search_box">
                    <div class="searchText">
                        <el-input placeholder="搜索行业名称" v-model="selectKey.content"></el-input>
                    </div>
                    <el-button type="primary">搜索</el-button>
                </div>
                
                <div class="table_handle">
                    <el-button type="primary">删除</el-button>
                    <el-button type="" style="float:right">新建行业</el-button>
                </div>
                
                <!--    列表    -->
                <div class="table_box">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll" @change="checkAll($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>一级行业分类名称</th>
                                <th>子行业数量</th>
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
                                <td>{{item.name}}</td>
                                <td>{{item.children.total}}</td>
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
    name: 'tradingArea',
    data () {
        return {
            activeName:'全部行业',
            page:{
                currentPage:1
            },
            isIndeterminate:false,
            isCheckedAll:false,
            checked:[],
            selectKey:{
                content:'',
            },
            selectScope:{},
            data:[
                {
                    id: 0,
                    name: '互联网',
                    children: {
                        total:'13'
                    },
                    isChecked:false,
                },{
                    id: 1,
                    name: '互联网',
                    children: {
                        total:'13'
                    },
                    isChecked:false,
                },{
                    id: 2,
                    name: '互联网',
                    children: {
                        total:'13'
                    },
                    isChecked:false,
                }
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