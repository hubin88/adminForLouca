<template>
    <div class="box">
        <el-tabs v-model="activeName">
            <!--      搜索      -->
            <el-tab-pane label="认证管理" name="认证管理">
                <div class="search_box">
<!--
                    <el-select v-model="selectKey.type" clearable placeholder="认证类型">
                        <el-option
                            v-for="item in selectScope.type"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
-->
                    <el-select v-model="selectKey.state" clearable placeholder="认证状态">
                        <el-option
                            v-for="item in selectScope.state"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
<!--
                    <el-date-picker
                        v-model="selectKey.timeRange"
                        type="datetimerange"
                        placeholder="选择时间范围">
                    </el-date-picker>
-->
                    <div class="searchText">
                      <!--<el-select v-model="selectKey.userId" placeholder="请选择用户">-->
                        <!--<el-option-->
                          <!--v-for="item in selectKey.userIds"-->
                          <!--:key="item.value"-->
                          <!--:label="item.label"-->
                          <!--:value="item.value">-->
                        <!--</el-option>-->
                      <!--</el-select>-->
                        <el-input placeholder="请输入用户Id" v-model="selectKey.userId"></el-input>
                    </div>
                    <el-button type="primary" @click="resetData">搜索</el-button>
                </div>

                <div class="table_handle">
<!--
                    <el-button type="primary">通过</el-button>
                    <el-button type="primary">驳回</el-button>
-->

                    <el-button style="visibility:hidden">占位</el-button>
                    <el-button type="success" style="float:right" @click="exportExcel('identification')">导出表格</el-button>
                </div>

                <!--    列表    -->
                <div class="table_box">
                    <table class="table" id="identification">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll" @change="checkAll($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>昵称</th>
                                <th>写字楼</th>
                                <th>公司</th>
                                <th>职位</th>
                                <th>类型</th>
                                <th>状态</th>
                                <th>是否大咖</th>
                                <th>时间</th>
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
                                <td>{{item.nickname}}</td>
                                <td>{{item.officeBuilding}}</td>
                                <td></td>
                                <td></td>
                                <td>{{item.type}}</td>
                                <td>{{item.state}}</td>
                                <td></td>
                                <td>{{item.time}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="showDetailNow(item.id)">查看</a>
                                    <a href="javascript:void(0)" @click="">设为大咖</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_control">
                        <el-pagination
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="page.currentPage"
                          :page-sizes="page.pageSizes"
                          :page-size="page.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="page.total">
                        </el-pagination>
                    </div>
                </div>

                <!--       详情页         -->
                <el-card class="dynamics_show" v-show="showDetail">
                    <div class="dynamics_header">
                        <span class="dynamics_title">认证详情</span>
                        <i class="el-icon-close" @click="showDetail=false"></i>
                    </div>
                    <div class="dynamics_user">
                        <span class="dy_text">用户</span>
                        <span class="username">
                            <span v-if="detail.name">{{detail.name}}</span>
                        </span>
                        <div class="userhead_box">
                            <div v-if="detail.headPic" class="userhead_img" :style="{backgroundImage: 'url('+ detail.headPic +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                        </div>
                    </div>
                    <div class="dynamics_label">
                        <span class="dy_text">手机号</span>
                        <span class="label_text">
                            <span v-if="detail.phone">{{detail.phone}}</span>
                        </span>
                    </div>
                    <div class="dynamics_label">
                        <span class="dy_text">写字楼</span>
                        <span class="label_text">
                            <span v-if="detail.groupName">{{detail.groupName}}</span>
                        </span>
                    </div>
                    <div class="dynamics_label">
                        <span class="dy_text">楼层</span>
                        <span class="label_text">
                            <span v-if="detail.floor">{{detail.floor}}</span>
                        </span>
                    </div>
                    <div class="dynamics_label">
                        <span class="dy_text">公司</span>
                        <span class="label_text">
                            <span v-if="detail.company">{{detail.company}}</span>
                        </span>
                    </div>
                    <div class="dynamics_label">
                        <span class="dy_text">职位</span>
                        <span class="label_text">
                            <span v-if="detail.jobTile">{{detail.jobTile}}</span>
                        </span>
                    </div>
                    <div class="dynamics_label">
                        <span class="dy_text">时间</span>
                        <span class="label_text">
                            <span v-if="detail.createTime">{{detail.createTime}}</span>
                        </span>
                    </div>
                    <div class="dynamics_label">
                        <span class="dy_text">状态</span>
                        <span class="label_text">
                            <span v-if="detail.state">{{state[detail.state]}}</span>
                        </span>
                    </div>
                    <div class="dynamics_label">
                        <span class="dy_text">方式</span>
                        <span class="label_text">
                            <span v-if="detail.kind">
                                {{kind[detail.kind]}}
                                <a v-if="detail.kind == 1" @click="showDetailImg = true" style="cursor:pointer;color:#20a0ff">查看图片</a>
                            </span>
                        </span>
                    </div>
                    <div class="dynamics_num" style="text-align:center">
                        <el-button type="primary" style="margin:0 20px" size="large" @click="certification('2')">通过</el-button>
                        <el-button type="primary" style="margin:0 20px" size="large" @click="showRejectReason = true">驳回</el-button>
                    </div>
                </el-card>

                <el-dialog title="驳回原因" v-model="showRejectReason">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6}"
                      placeholder="请输入驳回原因"
                      v-model="deal.reason">
                    </el-input>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="showRejectReason = false">取 消</el-button>
                        <el-button type="primary" @click="certification('4')">驳 回</el-button>
                    </div>
                </el-dialog>

                <!--        认证照片        -->
                <el-dialog title="认证照片" v-model="showDetailImg">
                    <el-carousel trigger="click" height="400px" :autoplay="false">
                        <el-carousel-item>
                            <div class="dynamics_imgs">
                                <div style="textAlign:center">工作照</div>
                                <div style="textAlign:center">
                                    <div v-if="detail.workPhoto">
                                        <div class="show_imgs" :style="{backgroundImage: 'url('+ detail.workPhoto +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                                    </div>
                                </div>
                                <div style="height:16px;"></div>
                                <div class="clear"></div>
                            </div>
                        </el-carousel-item>
                        <el-carousel-item>
                            <div class="dynamics_imgs">
                                <div style="textAlign:center">生活照</div>
                                <div style="textAlign:center">
                                    <div v-if="detail.livePhoto">
                                        <div class="show_imgs" :style="{backgroundImage: 'url('+ detail.livePhoto +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                                    </div>
                                </div>
                                <div style="height:16px;"></div>
                                <div class="clear"></div>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="showDetailImg = false">取 消</el-button>
                        <el-button type="primary" @click="showDetailImg = false">确 定</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
export default {
    name: 'assess',
    data () {
        return {
            showDetail:false,
            showDetailImg:false,
            showRejectReason:false,
            deal:{
                id:'',
                reason:'',
            },
            activeName:'认证管理',
            page:{
                currentPage:1,
                pageSizes:[10,20,50,100,200,500,1000],
                pageSize:10,
                total:100
            },
            isIndeterminate:false,
            isCheckedAll:false,
            checked:[],
            selectKey:{
                state:'',
                userId:'',
            },
            selectScope:{
                state:[{
                  value: '放弃',
                  label: '放弃'
                },{
                  value: '进行中',
                  label: '进行中'
                },{
                  value: '通过',
                  label: '通过'
                },{
                  value: '失败',
                  label: '失败'
                }],
            },
            data:[],
            detail:{},
            state:['放弃','进行中','通过','error','失败'],
            kind:['0','上传资料','邀请好友']
        }
    },
    mounted: function(){
        var that = this;
        this.$http.get('http://'+ global.URL +'/v1/user/apply/certification?page='+ that.page.currentPage+'&limit='+ that.page.pageSize).then((response) => {
            var arr = response.body.list;
            var TYPE = ['0','上传资料','邀请好友'];
            var STATE = ['放弃','进行中','通过','error','失败']
            that.page.total = response.body.total

            for(let i = 0, length = arr.length;i < length; i++){

                let o = {
                    id: arr[i].applyId,
                    nickname: arr[i].name,
                    officeBuilding: arr[i].groupName,
                    type: TYPE[arr[i].kind],
                    state: STATE[arr[i].state],
                    time: arr[i].createTime,
                    isChecked:false
                }
                that.data.push(o)
            }

        });

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
        resetData(){
            this.data = [];
            this.checked = [];
            this.isIndeterminate = false;
            this.isCheckedAll = false;
            var that = this;
            var parameter = '';
            if(this.selectKey.userId){
                parameter += '&userId=' + this.selectKey.userId;
            }
            if(this.selectKey.state){
                let str;
                if(this.selectKey.state == '放弃'){
                    str = '0';
                }else if(this.selectKey.state == '进行中'){
                    str = '1';
                }else if(this.selectKey.state == '通过'){
                    str = '2';
                }else if(this.selectKey.state == '失败'){
                    str = '4';
                }
                parameter += '&state=' + str;
            }

            this.$http.get('http://'+ global.URL +'/v1/user/apply/certification?page='+ that.page.currentPage+'&limit='+ that.page.pageSize + parameter).then((response) => {
            var arr = response.body.list||[];
            var TYPE = ['0','上传资料','邀请好友'];
            var STATE = ['放弃','进行中','通过','error','失败']
            that.page.total = response.body.total

            for(let i = 0, length = arr.length;i < length; i++){

                let o = {
                    id: arr[i].applyId,
                    nickname: arr[i].name,
                    officeBuilding: arr[i].groupName,
                    type: TYPE[arr[i].kind],
                    state: STATE[arr[i].state],
                    time: arr[i].createTime,
                    isChecked:false
                }
                that.data.push(o)
            }

        });
        },
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.resetData()
        },
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.resetData()
        },
        checkAll:function(isChecked){
            this.checked = [];
            if(isChecked){
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
        },
        showDetailNow(o){
            this.showDetail = true;
            this.deal.id = o;
            this.$http.get('http://'+ global.URL +'/v1/user/certification/'+ o +'/info').then((res) => {
                if(res.body.code == 200 || res.body.code == 201){
                    this.detail = res.body.data;
                }else{
                    this.$message(res.body.message);
                }
            })
        },
        certification(state){
            var user = JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).userId;
            if(state == "2"){
                var o = {
                  "applyId": this.deal.id,
                  "state": state,
                  "userId": user
                }
                this.$http.put('http://'+ global.URL +'/v1/user/process/certification',o).then((res) => {
                    if(res.body.code == 200 || res.body.code == 201){
                        this.$message('操作成功')
                    }else{
                        this.$message(res.body.message)
                    }
                })
            }else if(state == "4"){
                var o = {
                  "applyId": this.deal.id,
                  "state": state,
                  "userId": user,
                  "remark": this.deal.reason,
                }
                this.$http.put('http://'+ global.URL +'/v1/user/process/certification',o).then((res) => {
                    if(res.body.code == 200 || res.body.code == 201){
                        this.$message('操作成功')
                    }else{
                        this.$message(res.body.message)
                    }
                })
            }
            this.showDetail = false;
            this.showRejectReason = false;
            this.resetData();
        }
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
        详情
    */
    .dynamics_show{
        display: block;
        position: absolute;
        top:0;
        right:0;
        width: 520px;
        font-size: 18px;
        color:rgba(0,0,0,80%);
        box-shadow: -10px 10px 5px #ccc;
    }
    .dy_text{
        position: absolute;
        left: 50px;
        color:rgba(167,167,167,1);
    }
    .dynamics_header{
        position: relative;
        height: 65px;
        background: rgb(65,65,73);
        font-size: 24px;
        color: rgb(177,177,185);
    }
    .dynamics_title{
        position: absolute;
        left: 46px;
        top: 20px;
    }
    .dynamics_header i{
        font-size: 20px;
        position: absolute;
        right: 32px;
        top: 24px;
    }
    .dynamics_header i:hover{
        cursor: pointer;
        color: rgb(84,179,183);
    }
    .dynamics_user{
        width: 100%;
        height: 200px;
        position: relative;
    }
    .dynamics_user .username{
        position: relative;
        top: 109px;
        left: 120px;
    }
    .dynamics_user .userhead_img{
        position: absolute;
        top: 64px;
        right: 56px;
        background: red;
        width: 105px;
        height: 105px;
    }
    .dynamics_user .dy_text{
        top: 109px;
    }

    .dynamics_label{
        height: 60px;
        position: relative;
    }
    .dynamics_label .dy_text{
        bottom: 21px;
    }
    .dynamics_label .label_text{
        position: absolute;
        bottom: 21px;
        left: 135px;
    }
    .dynamics_label .label_time{
        color:rgb(167,167,167);
        position: absolute;
        bottom: 21px;
        right: 56px;
    }
    .dynamics_imgs{
        position: relative;
        width: 100%;
        min-height: 40px;
        padding: 12px 0;
        background: rgb(245,245,245);
    }
    .dynamics_imgs .dy_text{
        top: 20px;
    }
    .dynamics_imgs .dynamics_imgBox{
        font-size: 0;
        position: relative;
        width:351px;
        margin-right: 48px;
        margin-top: 3px;
        float: right;
    }
    .show_imgs{
        display: inline-block;
        margin: 6px;
        width: 360px;
        height: 360px;
        background: #ccc;
    }

    .dynamics_num{
        height: 80px;
        color:rgba(167,167,167,1);
        position: relative;
    }
</style>
