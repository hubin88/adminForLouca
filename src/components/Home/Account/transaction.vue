<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="交易管理" name="交易管理">
        <div class="search_box">
          <el-date-picker
            style="width:400px"
            v-model="selectKey.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            placeholder="开始时间-结束时间"
            align="right"
            @change="changeTime"
          >
          </el-date-picker>
          <el-select v-model="selectKey.moneyFlow" clearable placeholder="请选择"
                     style="width: 150px">
            <el-option label="所有" value="0"></el-option>
            <el-option label="转入" value="1"></el-option>
            <el-option label="转出" value="2"></el-option>
          </el-select>
          <el-select v-model="selectKey.transferType" clearable placeholder="请选择"
                     style="width: 150px">
            <el-option v-for="item in selectKey.transferScope"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-input v-model="selectKey.searchUser" placeholder="请输入昵称或手机号"
                    style="width:160px;"></el-input>
          <el-button type="primary" @click="resetData">搜索</el-button>
          <el-button type="success" style="float:right" @click="exportExcel('transaction')">导出数据
          </el-button>
        </div>
        <div class="table_box">
          <table class="table" id="transaction">
            <thead>
            <tr>
              <th>订单号</th>
              <th>时间</th>
              <th>用户</th>
              <th>转账类型</th>
              <th>对象</th>
              <th>资金流向</th>
              <th>金额</th>
              <th>余额</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in transaction_data">
              <td></td>
              <td>{{item.orderTime}}</td>
              <td class="td_box">
                <span>{{item.payerName}}</span>
                <span>{{item.payerPhone}}</span>
              </td>
              <td>{{item.orderType}}</td>
              <td class="td_box">
                <span>{{item.payeeName}}</span>
                <span>{{item.payeePhone}}</span>
              </td>
              <td>{{item.direction}}</td>
              <td>{{item.orderAmount}}</td>
              <td>{{item.payerBalance}}</td>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'transaction',
    data () {
      return {
        activeName: '交易管理',
        transaction_data: [],
        selectKey: {
          time: [],
          moneyFlow: "0",
          transferScope: [{
            label: "不限",
            value: "0"
          }, {
            label: "充值",
            value: "1"
          }, {
            label: "交易",
            value: "2"
          }, {
            label: "转账",
            value: "3"
          }, {
            label: "提现",
            value: "5"
          }, {
            label: "红包",
            value: "6"
          }, {
            label: "退款",
            value: "7"
          }, {
            label: "打赏",
            value: "8"
          }, {
            label: "手续费",
            value: "9"
          }],
          transferType: "0",
          searchUser: "",
        },
        page: {
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          currentPage: 1,
          total: 1,
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
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
      changeTime(val){
        this.selectKey.time = val.split(" - ");
      },
      resetData(){
        let obj = {
          direction: parseInt(this.selectKey.moneyFlow),
          limit: this.page.pageSize,
          page: this.page.currentPage,
          subject: parseInt(this.selectKey.transferType),
        };
        if (this.selectKey.searchUser) {
          Object.assign(obj, { account: this.selectKey.searchUser });
        }
        if (this.selectKey.time.length > 0) {
          Object.assign(obj, {
            startTime: this.selectKey.time[0],
            endTime: this.selectKey.time[1]
          });
        }
        this.$http.post('http://' + global.URL + '/v1/wallet/tradeBills', obj).then((res) => {
//          if (res.body.code === 200) {
          console.log(res);
          this.transaction_data = res.body.walletList || [];
          this.page.total = res.body.count;
//          }
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

  .table_handle {
    padding: 12px 35px;
  }

  .td_box > span {
    display: block;
  }

  .td_box > span:last-child {
    color: #1c8de0;
  }
</style>
