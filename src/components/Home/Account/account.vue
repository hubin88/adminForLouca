<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="账户管理" name="账户管理">
        <div class="search_box">
          <el-input v-model="searchUser" placeholder="请输入昵称或手机号" style="width:160px;"></el-input>
          <el-button type="primary" @click="resetData">搜索</el-button>
        </div>
        <!--<el-row :gutter="10">-->
          <!--<el-col :span="2">-->
            <!--<div class="grid-content bg-purple">概况</div>-->
          <!--</el-col>-->
          <!--<el-col :span="4">-->
            <!--<div class="grid-content bg-purple-light">账户余额:<span>1000元</span></div>-->
          <!--</el-col>-->
          <!--<el-col :span="4">-->
            <!--<div class="grid-content bg-purple">可提现金额:<span>1000元</span></div>-->
          <!--</el-col>-->
          <!--<el-col :span="4">-->
            <!--<div class="grid-content bg-purple-light">冻结金额:<span>1000元</span></div>-->
          <!--</el-col>-->
          <!--<el-col :span="4">-->
            <!--<div class="grid-content bg-purple">已提现金额:<span>1000元</span></div>-->
          <!--</el-col>-->
        <!--</el-row>-->
        <div class="table_box">
          <el-table
            class="table"
            :data="account_data"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="userName"
              label="用户"
            ></el-table-column>
            <el-table-column
              prop="phone"
              label="手机号"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="community"
              label="社区"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="totalMoney"
              label="总金额（元）"
              sortable
              width="170"
            ></el-table-column>
            <el-table-column
              prop="balanceMoney"
              label="可提现金额（元）"
              sortable
            ></el-table-column>
            <el-table-column
              prop="lockIncomeMoney"
              label="收入锁定金额（元）"
              sortable
            ></el-table-column>
            <el-table-column
              prop="lockRechargeMoney"
              label="充值锁定金额（元）"
              sortable
            ></el-table-column>
            <el-table-column
              prop="totalDrawMoney"
              label="已提现金额（元）"
              sortable
            ></el-table-column>
          </el-table>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'account',
    data () {
      return {
        activeName: '账户管理',
        searchUser: "",//搜索昵称或手机号
        account_data: [],
        page: {
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          currentPage: 1,
          total: 1,
        },
      }
    },
    mounted: function () {
      this.resetData();
    },
    methods: {
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.resetData();
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.resetData();
      },
      resetData(){
        let parameter = '';
        if (this.searchUser) {
          parameter += '&nick=' + this.searchUser;
        }
        this.$http.get('http://' + global.URL + '/v1/wallet/bills/account?limit=' + this.page.pageSize + '&page=' + this.page.currentPage + parameter).then((res) => {
          if (res.body.code === 200) {
            this.account_data = res.body.list || [];
            this.page.total = res.body.total;
          }else{
            this.$message.error(res.body.message);
          }
        });
      }
    }
  }
</script>
<style scoped>
  .search_box {
    padding: 12px 36px;
    text-align: right;
  }

  .table_box {
    padding: 0 35px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table_control {
    position: relative;
    box-sizing: border-box;
    border: 1px solid rgb(222, 222, 222);
    border-top: none;
    padding: 12px 24px;
    text-align: right;
    background: #fff;
  }

  .table td, .table th {
    border: 1px solid rgb(222, 222, 222);
    padding: 12px;
    text-align: center;
  }

  .table td {
    background: #fff;
  }

  .table th {
    padding: 12px;
    background: rgb(238, 248, 249);
  }

  .el-row {
    height: 60px;
    padding: 12px 36px;
  }
  .el-col{
    height: 100%;
    line-height: 230%;
  }
</style>
