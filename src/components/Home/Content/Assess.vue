<template>
    <div class="box">
        <el-tabs v-model="activeName">
            <!--      全部评价      -->
            <el-tab-pane label="全部评价" name="first">
                <div class="search_box">

					<el-select v-model="selectKey.type" clearable placeholder="评价类型">
                        <el-option
                            v-for="item in selectScope.type"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <div class="searchText">
                        <el-input placeholder="请输入评价人id" v-model="selectKey.gradeUserId"></el-input>
                    </div>
                    <div class="searchText">
                        <el-input placeholder="请输入被评价人id" v-model="selectKey.byGradeUserId"></el-input>
                    </div>
                    <el-button type="primary" @click="resetData">搜索</el-button>
                </div>

                <div class="table_handle">
                    <el-button type="danger" @click="deleteAssess(checked)">删除</el-button>
                    <el-button style="visibility:hidden">占位</el-button>
                    <el-button type="success" style="float:right" @click="exportExcel('party')">导出表格</el-button>
                </div>
                <!--    评价列表    -->
                <div class="table_box">
                    <table class="table" id="party">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll" @change="checkAll($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>类型</th>
                                <th>评价对象</th>
                                <th>内容</th>
                                <th>评分</th>
                                <th>综合得分</th>
                                <th>评价人</th>
                                <th>评价时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody v-if="data.length != 0">
                            <tr v-for="(item,index) in data">
                                <td>
                                    <el-checkbox
                                        v-model="data[index].isChecked"
                                        class="check_btn" @change="checkOne($event.target.checked,item.gradeId)">
                                        {{item.gradeId}}
                                    </el-checkbox>
                                </td>
                                <td>{{item.type}}</td>
                                <td>{{item.byGradeName}}</td>
                                <td style="max-width:450px;">{{item.gradeContent}}</td>
                                <td>{{item.grade}}</td>
                                <td>{{item.avg}}</td>
                                <td>{{item.gradeName}}</td>
                                <td>{{item.publishTime}}</td>
                                <td class="operation">
<!--                                    <a href="javascript:void(0)" @click="showParty(item.id)">查看</a>-->
                                    <a href="javascript:void(0)" @click="deleteAssess(item.gradeId)">删除</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_control">
                        <el-pagination
                          @size-change="handleSizeChangeParty"
                          @current-change="handleCurrentChangeParty"
                          :current-page="page.currentPage"
                          :page-sizes="page.pageSizes"
                          :page-size="page.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="page.total">
                        </el-pagination>
                    </div>
                </div>

            </el-tab-pane>
          <delete v-if="showDelete" :checked="checked" :cancel="cancelDelete" :confirm="confirmDelete"></delete>
        </el-tabs>

    </div>
</template>

<script>
export default {
    name: 'assess',
    data () {
        return {
            activeName:'first',
          showDelete:false,
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
				gradeUserId:'',
				byGradeUserId:'',
				type:'',

			},
            selectScope:{
				type:[{
					value:1,
					label:'聚会'
				},{
					value:2,
					label:'服务'
				}]
			},
            data:[],
        }
    },
    mounted: function(){
		var that = this;
        this.$http.get('http://'+ global.URL +'/v1/grade/list?limit='+ that.page.pageSize +'&page='+ that.page.currentPage).then((res) => {
			if(res.body.code == 200 || res.body.code == 200){
				this.page.total = res.body.total;
				this.data = res.body.list;
				console.log(res.body.list);
			}else{
				this.page.total = 0;
			}
        });

        (function init(){
            $('.dynamics_show .el-card__body').css({
                padding:0
            })
            $('.search_btn').css({
                color:'red'
            })
            $('.select_inp').css({
                width:'100px'
            })
            $('.el-tabs__header').css({
                background:'white'
            })
            $('.el-tabs__content').css({
                overflow:'visible'
            })
        })()
    },
    methods: {
        resetData(){
            this.data = [];
            this.checked = [];
          this.showDelete=false;
            this.isIndeterminate = false;
            this.isCheckedAll = false;
            var that = this;
            var parameter = '';

			if(this.selectKey.type){
				parameter += '&type=' + this.selectKey.type;
			}
			if(this.selectKey.gradeUserId){
				parameter += '&gradeUserId=' + this.selectKey.gradeUserId;
			}
			if(this.selectKey.byGradeUserId){
				parameter += '&byGradeUserId=' + this.selectKey.byGradeUserId;
			}

			this.$http.get('http://'+ global.URL +'/v1/grade/list?limit='+ that.page.pageSize +'&page='+ that.page.currentPage + parameter).then((res) => {
				if(res.body.code == 200 || res.body.code == 200){
					this.page.total = res.body.total;
					this.data = res.body.list;
					console.log(res.body.list);
				}else{
					this.page.total = 0;
				}
			});

        },
        handleSizeChangeParty(val) {
            this.page.pageSize = val;
            this.resetData();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChangeParty(val) {
            this.page.currentPage = val;
            this.resetData();
            console.log(`当前页: ${val}`);
        },
        showParty(o){
            console.log(o)
            this.showPartyDetail = true;
            this.$http.get('http://'+ global.URL +'/v1/party/detail/'+ o).then((res) => {
                console.log(res)
                if(res.body.code == 200){
                    this.partyDetail = res.body.data;
                }else{
                    this.$message('网络错误')
                }
            })
        },
        deleteAssess(o){
          console.log(o);
          this.checked = []
          if (typeof o == 'object'&&o.length>0) {
            this.checked = o.join(",")
            this.showDelete = true
          } else if (typeof o == 'number') {
            this.checked = o.toString()
            this.showDelete = true
          }
        },
      cancelDelete(){
        this.resetData();
      },
      confirmDelete(id){
        this.$http.delete('http://'+ global.URL +'/v1/grade?ids='+ id).then((res) => {
                if(res.body.code == 200){
                    this.resetData();
                    this.$message('删除成功');
                }
            })
      },
        checkAll:function(isChecked){
            this.checked = [];
            if(isChecked){
                console.log('aaa')
                for(let i = 0; i < this.data.length; i++){
                    this.data[i].isChecked = true;
                    this.checked.push(this.data[i].gradeId)
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
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .search_box{
        padding: 12px 36px;
        text-align: right;
    }
    .searchText{
        display: inline-block;
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
    .page_group{
        position: absolute;
        top: 30px;
        width:940px;
        text-align: center;
    }
    .table_control .page_group li{
        display: inline-block;
        padding: 0 12px;
        cursor: pointer;
    }
    .table_control .page_group li:hover{
        color: rgb(84,184,183);
    }
    .table_control .page_group .omit:hover{
        color: #000;
    }
    .page_group .control_li{
        color: rgb(84,184,183);
    }
    .table_control .total{
        position: absolute;
        right: 100px;
        top: 30px;
    }
    .table_control .total .total_block{
        padding: 0 10px;
    }
    .table_control .go_page{
        text-align: center;
        width: 60px;
    }
    .table_control .total .confirm{
        color: rgb(84,184,183);
    }
    .table{
        border-collapse: collapse;
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
        padding: 0 2px;
        color: #20a0ff;
    }
</style>


























