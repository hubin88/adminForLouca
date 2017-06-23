<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="全部消息" name="全部消息">
        <!--       操作区         -->
        <div class="table_handle">
          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="addNewMessage" v-if="hasPrivileges('message_add')">新建群发</el-button>
        </div>
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
                <el-button @click="editMessage(scope.row.msgId)" size="small" type="info"  v-if="hasPrivileges('message_edit')">编辑
                </el-button>
                <el-button @click="deleteMessage(scope.row.msgId)" size="small" type="danger"  v-if="hasPrivileges('message_manage')">删除
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
    <!--编辑消息-->
    <el-card class="edit_show" v-show="edit.isShowEdit">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold">编辑消息</span>
        <span style="float: right;width: 20px;height: 20px;cursor: pointer" class="el-icon-close"
              @click="closeEdit"></span>
      </div>
      <el-form :model="form" labelWidth="80px">
        <el-form-item label="发送方式">
          <el-radio-group v-model="form.sendType">
            <el-radio label="1">混合(先APP内，失败再短信)</el-radio>
            <el-radio label="2">app消息</el-radio>
            <el-radio label="3">短信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消息类型">
          <el-radio-group v-model="form.messageType">
            <el-radio label="1">推广</el-radio>
            <el-radio label="2">升级提醒</el-radio>
            <el-radio label="3">紧急通知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标系统">
          <el-radio-group v-model="form.targetType">
            <el-radio label="all">all</el-radio>
            <el-radio label="android">android</el-radio>
            <el-radio label="ios">ios</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送给">
          <el-button type="primary" @click="showCommitySelecter=true">选择社区</el-button>
          <el-button type="primary" @click="showLabelSelecter=true">选择标签</el-button>
          <br />
          <el-tag type="success" v-for="item in form.checkedCommunity" :key="item"
                  :closable="true"
                  @close="removeConmmunity(item)">
            {{item}}
          </el-tag>
          <el-tag type="success" v-for="item in form.sexLabelName" :key="item" :closable="true"
                  @close="removeSexLabel">{{item}}
          </el-tag>
          <el-tag type="success" v-for="item in label.labelName" :key="item"
                  :closable="true"
                  @close="removeLabelName(item)">
            {{item}}
          </el-tag>
          <div style="color: #333333">您正准备向{{sendPeopleNum}}人发送消息</div>
        </el-form-item>
        <el-form-item label="发送内容">
          <el-input type="textarea" v-model="form.content" style="width: 600px" :maxlength="500"
                    :rows="13" @change="changeContent" placeholder="消息内容限10-1000个字符"></el-input>
          <span class="remainNum">{{remainNum}}/1000</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sureSendNow(edit.type)">立即群发</el-button>
          <el-button>定时发送</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--选择社区-->
    <el-dialog title="选择商圈社区" v-model="showCommitySelecter" size="tiny">
      <el-row>
        <el-col :span="8">
          <div>
            <!--<el-input-->
              <!--placeholder="选择城市"-->
              <!--icon="search"-->
              <!--v-model="selectKey.chosedCity.label"-->
              <!--:on-icon-click="searchTrading">-->
            <!--</el-input>-->
            <!--<br>-->
            <!--<div class="select-content">-->
              <!--<div v-for="item in selectKey.city"-->
                   <!--@click="choseCity(item.value)" class="city">{{item.label}}-->
              <!--</div>-->
            <!--</div>-->
            <el-checkbox :indeterminate="selectKey.city.isIndeterminate" v-model="selectKey.city.checkAll"
                         @change="">全选
            </el-checkbox>
            <br>
            <el-checkbox-group v-model="selectKey.city.checkedCity" @change="">
              <el-checkbox v-for="item in selectKey.city.cityName" :label="item"
                           :key="item">{{item}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-checkbox :indeterminate="selectKey.trading.isIndeterminate" v-model="selectKey.trading.checkAll"
                         @change="">全选
            </el-checkbox>
            <br>
            <el-checkbox-group v-model="selectKey.trading.checkedCity" @change="changeCity">
              <el-checkbox v-for="item in selectKey.trading.tradingName" :label="item"
                           :key="item">{{item}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
        <el-col :span="8">
          <!--<div>-->
            <!--<el-checkbox :indeterminate="selectKey.community.isIndeterminate" v-model="selectKey.community.checkAll"-->
                         <!--@change="checkAllCommunity">全选-->
            <!--</el-checkbox>-->
            <!--<br>-->
            <!--<el-checkbox-group v-model="form.checkedCommunity" @change="checkedCommunityChange">-->
              <!--<el-checkbox v-for="item in selectKey.communityName" :label="item"-->
                           <!--:key="item">{{item}}-->
              <!--</el-checkbox>-->
            <!--</el-checkbox-group>-->
          <!--</div>-->
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
                        <el-button @click="showCommitySelecter = false">取 消</el-button>
                        <el-button type="primary" @click="sureSelectCommity">确 定</el-button>
                    </span>
    </el-dialog>
    <!--选择标签-->
    <el-dialog title="选择标签" v-model="showLabelSelecter" size="tiny">
      <el-form labelWidth="80px">
        <el-form-item label="性别标签">
          <el-radio-group v-model="form.sexLabelId" @change="choseSex">
            <el-radio v-for="item in label.sexLabel" :label="item.value">{{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="行为标签">
          <el-button :plain="true" type="info" v-for="item in label.activeLabel"
                     @click="choseLabel(item)">{{item}}
          </el-button>
          <el-input
            placeholder="添加标签"
            icon="plus"
            v-model="addLabel"
            :on-icon-click="sureAddLabel">
          </el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'allMessage',
    data () {
      return {
        activeName: "全部消息",
        userId: JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).userId,
        message_data: [],
        message_data_origin: [],
        showCommitySelecter: false,
        showLabelSelecter: false,
        remainNum: 0,
        addLabel: "",
        sendPeopleNum: 1000,
        selectKey: {
          city:{
            checkedCity:[],
            cityName:["深圳"],
            checkAll: true,
            isIndeterminate: true,
          },
          trading:{
            options:[],
            checkedTrading:[],
            tradingName:[],
            checkAll: true,
            isIndeterminate: true,
          },
          community: {
            options:[],
            checkedCommunity:[],
            communityName:[],
            checkAll: true,
            isIndeterminate: true,
          },
        },
        label: {
          labelName: [],
          sexLabel: [{
            value: 0,
            label: "全部",
          }, {
            value: 1,
            label: "男",
          }, {
            value: 2,
            label: "女",
          }],
          activeLabel: ["服务者", "认证用户", "未认证用户", "聚会发起人", "资料不完善用户", "最近一月有登录", "最近一周有登录", "最近一月未登录"],
        },
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
        detail: {
          isShowDetail: false,
          data: {},
        },
        edit: {
          isShowEdit: false,
          type:"post",//判断是编辑(put)还是新建(post)
        },
        form: {
          sendType: "1",
          messageType: "1",
          targetType: "all",
          checkedCommunity: [],
          communityId: [],
          sexLabelId: "",
          sexLabelName: [],
          label: [],
          content: "",
        },
        page: {
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          currentPage: 1,
          total: 100,
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
        $('.message_show .el-card__body .el-form-item__label').css({
          "font-weight": "bold",
          "font-size": "16px",
          "padding-left": "10px",
        });
      })();
    },
    methods: {
      editMessage(id){
        this.edit.isShowEdit = true;
        this.edit.type="put";
        const originObj = this.message_data_origin.filter(item => item.msgId === id).pop();
        Object.assign(this.form, {
          sendType: originObj.way.toString(),
          messageType: originObj.kind.toString(),
          content: originObj.content,
        });
        this.changeContent(originObj.content);
      },
      addNewMessage(){
        this.edit.isShowEdit = true;
        this.edit.type="post";
        this.resetForm();
      },
      changeCity(value){
        const checkedCount = value.length;
        this.selectKey.city.checkAll=checkedCount === this.selectKey.city.cityName.length;
        this.selectKey.city.isIndeterminate = checkedCount > 0 && checkedCount < this.selectKey.city.cityName.length;
        this.selectKey.city.checkedCity = value;
      },
      searchTrading(){
        this.$http.get('http://' + global.URL + '/v1/region?page=1&limit=999').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            const arr = res.body.list || [];
            this.selectKey.trading = [];
            arr.forEach(item => {
              this.selectKey.trading.push({
                label: item.name,
                value: item.circleId,
              });
            });
          }
        });
      },
      choseTrading(val){
        this.selectKey.chosedTrading = this.selectKey.trading.filter(item => item.value === val).pop();
      },
      searchCommunity(){
        const val = this.selectKey.chosedTrading.value;
        this.$http.get('http://' + global.URL + '/v1/region/' + val + '/group').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            const arr = res.body.list || [];
            this.selectKey.communityName = [];
            this.selectKey.community = [];
            arr.forEach(item => {
              this.selectKey.communityName.push(item.name);
              this.selectKey.community.push({
                label: item.name,
                value: item.groupId,
              });
            });
          }
        });
      },
      checkAllCommunity(event){
        this.form.checkedCommunity = event.target.checked ? this.selectKey.communityName : [];
        this.selectKey.isIndeterminate = false;
      },
      checkedCommunityChange(value){
        const checkedCount = value.length;
        this.selectKey.checkAll = checkedCount === this.selectKey.communityName.length;
        this.selectKey.isIndeterminate = checkedCount > 0 && checkedCount < this.selectKey.communityName.length;
        this.form.checkedCommunity = value;
      },
      sureSelectCommity(){
        this.form.communityId = [];
        const arr = [];
        this.selectKey.community.filter(item => {
            if (this.form.checkedCommunity.includes(item.label)) {
              arr.push(item.value)
            }
          }
        );
        this.form.communityId = arr;
        this.showCommitySelecter = false;
      },
      removeConmmunity(val){
        this.form.checkedCommunity = this.form.checkedCommunity.filter(item => item !== val);
      },
      removeLabelName(val){
        this.label.labelName = this.label.labelName.filter(item => item !== val);
      },
      removeSexLabel(){
        this.form.sexLabelName = [];
      },
      choseSex(val){
        this.form.sexLabelName.pop();
        this.form.sexLabelName.push(this.label.sexLabel.filter(item => item.value === val).pop().label);
      },
      choseLabel(val){
        if (!this.label.labelName.includes(val)) {
          this.label.labelName.push(val);
        }
      },
      changeContent(val){
        this.remainNum = val.length;
      },
      sureSendNow(type){
        const obj = {
          //          assignTime: "",
//          attachUrl: "string",
          goal: {
            all: true,
            //          groupId: [],
            //          receiverId: [],
            //          regionId: [],
            system: this.form.targetType,
            //          version: "string",

          },
          content: this.form.content,
          kind: this.form.messageType,
//          retentionTime: 0,
//          url: "string",
          userId: this.userId,
          way: this.form.sendType,
        };
        if (this.form.sexLabelName.length > 0 && this.form.sexLabelId !== 0) {
          Object.assign(obj, { goal: { sex: this.form.sexLabelId } });
        }
        this.$http[type]('http://' + global.URL + '/v1/message/push', obj).then((res) => {
          if (res.body.code === 201) {
            this.$message({
              type: 'success',
              message: '发布成功!'
            });
            this.resetForm();
            this.edit.isShowEdit = false;
            this.resetData();
          }
        });
      },
      sureAddLabel(){
        if (this.addLabel) {
          this.label.activeLabel.push(this.addLabel);
          this.addLabel = "";
        }
      },
      resetForm(){
        Object.assign(this.form, {
          sendType: "1",
          messageType: "1",
          targetType: "all",
          checkedCommunity: [],
          communityId: [],
          sexLabelId: "",
          sexLabelName: [],
          label: [],
          content: "",
        });
      },
      closeEdit(){
        this.edit.isShowEdit = false;
      },
      showDetail(id){
        this.detail.isShowDetail = true;
        this.$http.get('http://' + global.URL + '/v1/message/push/' + id).then((res) => {
          if (res.body.code === 200) {
            this.detail.data = res.body.data || {};
          }
        });
      },
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
            this.message_data_origin = arr;
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
  .edit_show {
    width: 800px;
    position: absolute;
    top: 50px;
    left: 50%;
    margin-left: -400px;
    z-index: 1000;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }

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
    font-weight: bold;
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
    left: 100px;
    font-weight: bold;
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

  .message_show .el-card__body .el-form-item__label {
    font-weight: bold;
    font-size: 16px;
  }

  .remainNum {
    position: absolute;
    bottom: 0;
    left: 540px;
  }

  .table_handle {
    padding: 12px 35px;
  }

  .el-row {
    border: 1px solid #ccc;
  }

  .el-col {
    height: 100%;
    border-right: 1px solid #ccc;
  }

  .el-col:last-child {
    border: none;
  }

  .el-checkbox-group, .select-content {
    height: 350px;
    overflow: auto;
  }

  .el-checkbox-group > .el-checkbox:first-child {
    margin-left: 15px;
  }

  .city, .trading, .el-checkbox {
    height: 36px;
    line-height: 36px;
    margin-bottom: 1px;
  }

  .city, .trading {
    background: rgb(239, 239, 239);
    text-align: center;
  }

  .city:hover, .trading:hover {
    background: #2e90fe;
    color: #fff;
  }

  .el-tag {
    display: inline-block;
    height: 36px;
    line-height: 36px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .el-form-item__content .el-button, .el-form-item__content .el-tag {
    margin: 0 10px 5px 0;
    display: inline-block;
    width: 130px;
  }

  .el-form-item__content .el-input {
    width: 410px;
  }

  .el-form-item__content {
    position: relative;
  }

</style>
