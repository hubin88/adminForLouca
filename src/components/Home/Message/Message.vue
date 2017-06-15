<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="全部消息" name="全部消息">
        <!--消息列表-->
        <div class="table_box">
          <el-table
            class="table"
            :data="message_data"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="msgId"
              label="消息ID"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="kind"
              label="消息类型"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="content"
              label="消息内容"
            ></el-table-column>
            <el-table-column
              prop="way"
              label="发送方式"
              width="250"
            ></el-table-column>
            <el-table-column
              prop="state"
              label="状态"
              width="120"
            ></el-table-column>
            <el-table-column
              label="操作"
              width="220"
            >
              <template scope="scope">
                <el-button @click="showDetail(scope.row.msgId)" size="small" type="info">查看
                </el-button>
                <el-button @click="editMessage(scope.row.msgId)" size="small" type="info">编辑
                </el-button>
                <el-button @click="deleteMessage(scope.row.msgId)" size="small" type="danger">删除
                </el-button>
              </template>
            </el-table-column>
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
    <!--详细信息-->
    <el-card class="message_show" v-show="detail.isShowDetail">
      <div class="message_header">
        <span class="message_title">消息详情</span>
        <i class="el-icon-close" @click="detail.isShowDetail=false"></i>
      </div>
      <div class="message_user">
        <span class="dy_text">用户</span>
        <span class="username">
              <span v-if="detail.data.author">{{detail.data.author.name}}</span>
             </span>
        <div class="userhead_box">
          <div v-if="detail.data.author" class="userhead_img"
               :style="{backgroundImage: 'url('+ detail.data.author.headPic +')',backgroundSize:'cover'}"></div>
        </div>
      </div>
      <el-form labelWidth="100px">
        <el-form-item label="发送方式">
          {{wayLabel[detail.data.way]}}
        </el-form-item>
        <el-form-item label="发送对象">
        </el-form-item>
        <el-form-item label="发送内容">
          {{detail.data.content}}
        </el-form-item>
        <el-form-item label="人数">
        </el-form-item>
        <el-form-item label="发送时间">
        </el-form-item>
        <el-form-item label="状态">
          {{stateLabel[detail.data.state]}}
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'allMessage',
    data () {
      return {
        activeName: "全部消息",
        message_data: [],
        kindLabel: {
          1: "推广",
          2: "升级提醒",
          3: "紧急通知",
        },
        wayLabel: {
          1: "混合(先APP内，失败再短信)",
          2: "限APP内",
          3: "限短信",
        },
        stateLabel: {
          0: "草稿",
          1: "发送中",
          2: "发完",
        },
        page: {
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          currentPage: 1,
          total: 1,
        },
        detail: {
          isShowDetail: false,
          data: {},
        },
      }
    },
    mounted: function () {
      this.resetData();
      (function init() {
        $('.message_show .el-card__body').css({
          padding: 0
        });
        $('.el-card__body .el-form').css({
          width: "100%",
        });
        $('.el-card__body .el-form-item__label').css({
          "font-weight": "bold",
          "font-size": "16px",
          "padding-left": "10px",
        });
      })();
    },
    methods: {
      showDetail(id){
        this.detail.isShowDetail = true;
        this.$http.get('http://' + global.URL + '/v1/message/push/' + id).then((res) => {
          if (res.body.code === 200) {
            this.detail.data = res.body.data || {};
          }
        });
      },
      editMessage(id){},
      deleteMessage(id){
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('http://' + global.URL + '/v1/message/push/' + id).then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.resetData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          });
        });
      },
      resetData(){
        this.$http.get('http://' + global.URL + '/v1/message/push?limit=' + this.page.pageSize + '&page=' + this.page.currentPage).then((res) => {
          if (res.body.code === 200) {
            const arr = res.body.list || [];
            this.message_data = [];
            arr.forEach(item => {
              this.message_data.push({
                ...item,
                kind: this.kindLabel[item.kind],
                way: this.wayLabel[item.way],
                state: this.stateLabel[item.state],
              });
            });
          }
        });
      },
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.resetData();
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.resetData();
      },
    }
  }
</script>

<style scoped>
  .box {
    height: 100%;
  }

  .search_box {
    padding: 12px 36px;
    text-align: right;
  }

  .table_box {
    padding: 0 35px;
    height: 100%;
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

  .message_show {
    display: block;
    position: absolute;
    top: 0;
    right: 35px;
    width: 520px;
    font-size: 18px;
    color: rgba(0, 0, 0, .8);
    box-shadow: -10px 10px 5px #ccc;
    z-index: 999;
  }

  .message_header {
    position: relative;
    height: 65px;
    background: rgb(65, 65, 73);
    font-size: 24px;
    color: rgb(177, 177, 185);
  }

  .dy_text {
    position: absolute;
    left: 50px;
    color: rgba(167, 167, 167, 1);
  }

  .message_title {
    position: absolute;
    left: 46px;
    top: 20px;
  }

  .message_header i {
    font-size: 20px;
    position: absolute;
    right: 32px;
    top: 24px;
  }

  .message_header i:hover {
    cursor: pointer;
    color: rgb(84, 179, 183);
  }

  .message_user {
    width: 100%;
    height: 105px;
    position: relative;
  }

  .message_user .username {
    position: relative;
    top: 40px;
    left: 120px;
  }

  .message_user .userhead_img {
    position: absolute;
    top: 0;
    right: 56px;
    background: red;
    width: 105px;
    height: 105px;
  }

  .message_user .dy_text {
    top: 40px;
  }

  .message_show .el-card__body {
    padding: 0;
  }

  .message_user .el-form {
    position: absolute;
    top: 100px;
  }

  .el-card__body .el-form-item__label {
    font-weight: bold;
    font-size: 16px;
  }
</style>
