<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="全部消息" name="全部消息">
        <!--       操作区         -->
        <div class="table_handle">
          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="addNewMessage"
                     v-if="hasPrivileges('message_add')">新建群发
          </el-button>
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
              width="200"
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
            <el-table-column label="发送统计">
              <el-table-column
                prop="total"
                label="预计"
                width="100"
              >
              </el-table-column>
              <el-table-column
                prop="success"
                label="成功"
                width="100"
              >
              </el-table-column>
              <el-table-column
                prop="failure"
                label="失败"
                width="100"
              >
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="操作"
              width="220"
            >
              <template scope="scope">
                <el-button @click="showDetail(scope.row.msgId)" size="small" type="info">查看
                </el-button>
                <el-button @click="editMessage(scope.row.msgId)" size="small" type="info"
                           v-if="hasPrivileges('message_edit')">编辑
                </el-button>
                <el-button @click="deleteMessage(scope.row.msgId)" size="small" type="danger"
                           v-if="hasPrivileges('message_manage')">删除
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
            <el-radio label="1">app消息</el-radio>
            <el-radio label="2">短信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消息类型">
          <el-radio-group v-model="form.messageType">
            <el-radio label="1">推广</el-radio>
            <el-radio label="2">升级提醒</el-radio>
            <el-radio label="3">紧急通知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="推送目标">
          <el-radio-group v-model="form.sendTarget">
            <el-radio label="all">所有人</el-radio>
            <el-radio label="some">指定目标</el-radio>
          </el-radio-group>
          <el-tooltip class="item" effect="dark"
                      content="若选择指定目标，可以按条件筛选出指定的人" placement="right">
            <i class="icon el-icon-information"></i>
          </el-tooltip>
        </el-form-item>
        <template v-if="form.sendTarget!=='all'">
          <el-form-item label="选择用户">
            <el-select
              v-model="form.userId"
              filterable
              remote
              multiple
              clearable
              placeholder="请输入用户昵称"
              :remote-method="remoteMethod"
              :loading="loading"
              @change="clearFilter"
            >
              <el-option
                v-for="item in selectKey.users"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-tooltip class="item" effect="dark"
                        content="若选择了特定的若干个推送目标，则不可以再按条件筛选" placement="right">
              <i class="icon el-icon-information"></i>
            </el-tooltip>
          </el-form-item>
          <template v-if="form.userId.length===0">
            <el-form-item label="目标系统">
              <el-radio-group v-model="form.targetType">
                <el-radio label="all">all</el-radio>
                <el-radio label="android">android</el-radio>
                <el-radio label="ios">ios</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="性别标签">
              <el-radio-group v-model="form.sexLabelId">
                <el-radio v-for="item in label.sexLabel" :label="item.value">{{item.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="最近登录">
              <el-radio-group v-model="form.loadingTime">
                <el-radio v-for="item in loadingTime" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商圈社区">
              <el-button type="primary" @click="showCommunityBox">选择商圈社区</el-button>
              <el-tag type="success" v-for="item in form.checkedCommunity" :key="item"
                      :closable="true"
                      @close="removeConmmunity(item)">
                {{item.label}}
              </el-tag>
            </el-form-item>
          </template>
        </template>
        <el-form-item v-if="form.sendType==='2'" label="短信模板" prop="messageMould">
          <el-input
            v-model="form.messageMould"
            placeholder="请输入短信模板，例如：SMS_36160070"
          ></el-input>
          <el-tooltip class="item" effect="dark"
                      content="模板的格式为SMS_XXXXXXXX，一个X代表一个数字，总共8个数字" placement="right">
            <i class="icon el-icon-information"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          v-else
          label="发送内容"
          style="clear: right;"
          prop="content"
          :rules="[{ required: true, message: '请输入发送内容', trigger: 'blur' },{ min: 10, max: 1000, message: '消息内容为10-1000个字符', trigger: 'blur' }]"
        >
          <el-input type="textarea" v-model="form.content" style="width: 40%" :maxlength="1000"
                    :autosize="{minRows:12}" @change="changeContent"
                    placeholder="消息内容限10-1000个字符"></el-input>
          <span class="remainNum">{{remainNum}}/1000</span>
          <div class="carousel">
            <ul class="carousel-content">
              <span class="prev" @click="prevImg"></span>
              <span class="next" @click="nextImg"></span>
              <li v-for="(item,index) in edit.imgPosition" :class="{active:index===curIndex}"
                  :style="{backgroundPosition: item.img}">
                <div class="label">{{item.label}}</div>
                <div class="text" :style="item.text">
                  <div class="title">楼咖App</div>
                  <div :style="item.content">{{form.content}}</div>
                  <div v-if="curIndex===3"
                       style="height: 12px;font-size: 12px;line-height: 12px;margin-top: 10px;">
                    滑动来查看
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </el-form-item>
        <el-form-item style="margin-top: 20px;">
          <el-button type="primary" @click="sureSendNow(edit.type,true)">立即群发</el-button>
          <el-button @click="timingSend">定时发送</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--选择社区-->
    <el-dialog title="选择商圈社区" v-model="showCommitySelecter" size="small">
      <div style="margin-top: -20px;">
        <el-tooltip class="item" effect="dark"
                    content="点击搜索，会搜索该城市或者商圈下的所有子选项，若勾选城市或商圈则不能再搜索，表示选择所有子选项" placement="right">
          <i class="icon el-icon-information"></i>
        </el-tooltip>
      </div>
      <el-row>
        <el-col :span="8">
          <div>
            <el-checkbox :indeterminate="selectKey.city.isIndeterminate"
                         v-model="selectKey.city.checkAll"
                         @change="checkAllCity">全选
            </el-checkbox>
            <br>
            <el-checkbox-group v-model="selectKey.city.checkedCity" @change="changeCity">
              <div v-for="item in selectKey.city.cityName" style="padding-left: 20px;">
                <el-checkbox :label="item"
                             :key="item">{{item}}
                </el-checkbox>
                <el-button type="primary" icon="search" size="mini" @click="searchTrading(item)">
                  搜索
                </el-button>
              </div>
            </el-checkbox-group>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-checkbox :indeterminate="selectKey.trading.isIndeterminate"
                         v-model="selectKey.trading.checkAll"
                         @change="checkAllTrading">全选
            </el-checkbox>
            <br>
            <el-checkbox-group v-model="selectKey.trading.checkedTrading" @change="changeTrading">
              <div v-for="item in selectKey.trading.tradingName" style="padding-left: 20px;">
                <el-checkbox :label="item"
                             :key="item">{{item}}
                </el-checkbox>
                <el-button type="primary" icon="search" size="mini" @click="searchCommunity(item)">
                  搜索
                </el-button>
              </div>
            </el-checkbox-group>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-checkbox :indeterminate="selectKey.community.isIndeterminate"
                         v-model="selectKey.community.checkAll"
                         @change="checkAllCommunity">全选
            </el-checkbox>
            <br>
            <el-checkbox-group v-model="selectKey.community.checkedCommunity"
                               @change="changeCommunity">
              <div v-for="item in selectKey.community.communityName" style="padding-left: 20px;">
                <el-checkbox :label="item"
                             :key="item">{{item}}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
                        <el-button @click="showCommitySelecter = false">取 消</el-button>
                        <el-button type="primary" @click="sureSelectCommity">确 定</el-button>
                    </span>
    </el-dialog>
    <!--定时发送-->
    <el-dialog title="定时发送" v-model="showTimingSelecter" size="tiny">
      <el-date-picker
        v-model="form.timing"
        type="datetime"
        clearable
        @change="choseTiming"
        placeholder="选择日期时间"
        :picker-options="pickerBeginDateBefore"
      >
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
                        <el-button @click="showTimingSelecter = false">取 消</el-button>
                        <el-button type="primary" @click="sureSelectTiming">确 定</el-button>
                    </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'allMessage',
    data () {
      return {
        loading: false,
        activeName: "全部消息",
        userId: JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).userId,
        message_data: [],
        showCommitySelecter: false,
        showLabelSelecter: false,
        showTimingSelecter: false,
        remainNum: 0,
        curIndex: 0,
        addLabel: "",
        selectKey: {
          users: [],
          city: {
            options: [{ label: "深圳", value: 0 }],
            checkedCity: [],
            cityName: ["深圳"],
            checkAll: true,
            isIndeterminate: true,
          },
          trading: {
            options: [],
            checkedTrading: [],
            tradingName: [],
            checkAll: true,
            isIndeterminate: true,
          },
          community: {
            options: [],
            checkedCommunity: [],
            communityName: [],
            checkAll: true,
            isIndeterminate: true,
          },
        },
        label: {
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
        },
        loadingTime: [{
          value: 1,
          label: "最近一月有登录",
        }, {
          value: 2,
          label: "最近一周有登录",
        }, {
          value: 3,
          label: "最近一月未登录",
        }, {
          value: 4,
          label: "最近一周未登录",
        }],
        kindLabel: {
          1: "推广",
          2: "升级提醒",
          3: "紧急通知",
        },
        wayLabel: {
          2: "限APP内",
          3: "限短信",
          1: "混合(先APP内，失败再短信)",
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
          editId: "",
          isShowEdit: false,
          type: "post",//判断是编辑(put)还是新建(post)
          imgPosition: [{
            label: "Android",
            img: "0 0",
            text: {
              width: "212px",
              top: "93px",
              left: "74px",
            },
            content: {
              height: "13px",
              "line-height": "13px",
              overflow: "hidden",
              color: "white",
            },
          }, {
            label: "iOS Rolldown",
            img: "-326px 0",
            text: {
              width: "227px",
              top: "88px",
              left: "57px",
            },
            content: {
              height: "24px",
              "line-height": "12px",
              overflow: "hidden",
              color: "white",
            },
          }, {
            label: "iOS Notification Center",
            img: "2px -227px",
            text: {
              width: "216px",
              top: "165px",
              left: "60px",
            },
            content: {
              height: "24px",
              "line-height": "12px",
              overflow: "hidden",
              color: "white",
            },
          }, {
            label: "iOS Lock Screen",
            img: "-326px -227px",
            text: {
              width: "228px",
              top: "152px",
              left: "58px",
            },
            content: {
              height: "24px",
              "line-height": "12px",
              overflow: "hidden",
              color: "white",
            },
          }],
        },
        form: {
          sendType: "1",
          messageType: "1",
          targetType: "all",
          sendTarget: "all",
          loadingTime: "",
          messageMould: "SMS_",
          checkedCommunity: [],
          sexLabelId: "",
          content: "",
          timing: "",
          userId: [],
        },
        timing: "",
        pickerBeginDateBefore: {
          disabledDate: (time) => time.getTime() < new Date().getTime(),
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
      prevImg(){
        if (this.curIndex === 0) {
          this.curIndex = 3;
        } else {
          this.curIndex--;
        }
      },
      nextImg(){
        if (this.curIndex === 3) {
          this.curIndex = 0;
        } else {
          this.curIndex++;
        }
      },
      clearFilter(){
        this.form.targetType = "all";
        this.form.loadingTime = "";
        this.form.checkedCommunity = [];
        this.form.sexLabelId = "";
      },
      remoteMethod(name){
        this.selectKey.users = [];
        if (name !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$http.get('http://' + global.URL + '/v1/user/find?name=' + name).then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                let arr = res.body.list || [];
                arr.forEach((item) => {
                  this.selectKey.users.push({
                    value: item.userId,
                    label: item.name,
                  })
                });
              }
            })
          }, 500);
        }
      },
      timingSend(){
        this.timing = "";
        this.form.timing = "";
        this.showTimingSelecter = true;
      },
      sureSelectTiming(){
        this.showTimingSelecter = false;
        this.sureSendNow(this.edit.type, false);
      },
      choseTiming(val){
        this.form.timing = val;
      },
      editMessage(id){
        this.resetForm();
        this.edit.editId = id;
        this.$http.get('http://' + global.URL + '/v1/message/push/' + id).then(res => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.edit.isShowEdit = true;
            this.edit.type = "put";
            const obj = res.body.data || {};
            Object.assign(this.form, {
              sendType: obj.way + "",
              messageType: obj.kind + "",
              sendTarget: obj.goal.all ? "all" : "some",
              content: obj.content,
            });
            if (obj.templateCode) {
              this.form.messageMould = obj.templateCode;
            }
            if (obj.content) {
              this.changeContent(this.form.content);
            }
            if (obj.assignTime) {
              this.form.timing = obj.assignTime;
            }
            if (!obj.goal.all) {
              Object.assign(this.form, {
                targetType: obj.goal.system,
                sexLabelId: obj.goal.sex,
              });
              if (obj.goal.regions) {
                const arr = [];
                obj.goal.regions.forEach(item => {
                  this.form.checkedCommunity.push({
                    label: item.name,
                    value: item.circleId,
                  });
                  arr.push(item.name);
                });
                this.selectKey.trading.checkedTrading = arr;
              }
              if (obj.goal.groups) {
                const arr = [];
                obj.goal.groups.forEach(item => {
                  this.form.checkedCommunity.push({
                    label: item.name,
                    value: item.groupId,
                  });
                  arr.push(item.name);
                });
                this.selectKey.community.checkedCommunity = arr;
              }
              if (obj.goal.login) {
                switch (obj.goal.login) {
                  case 7:
                    this.form.loadingTime = 2;
                    break;
                  case 30:
                    this.form.loadingTime = 1;
                    break;
                }
              }
              if (obj.goal.nologin) {
                switch (obj.goal.nologin) {
                  case 7:
                    this.form.loadingTime = 4;
                    break;
                  case 30:
                    this.form.loadingTime = 3;
                    break;
                }
              }
            }
          }
        });
      },
      addNewMessage(){
        this.edit.isShowEdit = true;
        this.edit.type = "post";
        this.resetForm();
      },
      showCommunityBox(){
        this.showCommitySelecter = true;
        this.resetSelectCommunity();
      },
      resetSelectCommunity(){
        Object.assign(this.selectKey, {
          city: {
            options: [{ label: "深圳", value: 0 }],
            checkedCity: [],
            cityName: ["深圳"],
            checkAll: true,
            isIndeterminate: true,
          },
          trading: {
            options: [],
            checkedTrading: [],
            tradingName: [],
            checkAll: true,
            isIndeterminate: true,
          },
          community: {
            options: [],
            checkedCommunity: [],
            communityName: [],
            checkAll: true,
            isIndeterminate: true,
          },
        });
      },
      /*
       * 选择城市
       * */
      checkAllCity(event){
        this.selectKey.city.checkedCity = event.target.checked ? this.selectKey.city.cityName : [];
        this.selectKey.city.isIndeterminate = false;
      },
      changeCity(value){
        const checkedCount = value.length;
        this.selectKey.city.checkAll = checkedCount === this.selectKey.city.cityName.length;
        this.selectKey.city.isIndeterminate = checkedCount > 0 && checkedCount < this.selectKey.city.cityName.length;
        this.selectKey.city.checkedCity = value;
      },
      searchTrading(value){
        if (this.selectKey.city.checkedCity.includes(value)) return false;
        Object.assign(this.selectKey.trading, {
          options: [],
          checkedTrading: [],
          tradingName: [],
          checkAll: true,
          isIndeterminate: true,
        });
        this.$http.get('http://' + global.URL + '/v1/region?page=1&limit=999').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            const arr = res.body.list || [];
            arr.forEach(item => {
              this.selectKey.trading.tradingName.push(item.name);
              this.selectKey.trading.options.push({
                label: item.name,
                value: item.circleId,
              });
            });
          }
        });
      },
      /*
       * 选择商圈
       * */
      checkAllTrading(event){
        this.selectKey.trading.checkedTrading = event.target.checked ? this.selectKey.trading.tradingName : [];
        this.selectKey.trading.isIndeterminate = false;
      },
      changeTrading(value){
        const checkedCount = value.length;
        this.selectKey.trading.checkAll = checkedCount === this.selectKey.trading.tradingName.length;
        this.selectKey.trading.isIndeterminate = checkedCount > 0 && checkedCount < this.selectKey.trading.tradingName.length;
        this.selectKey.trading.checkedTrading = value;
      },
      searchCommunity(value){
        if (this.selectKey.trading.checkedTrading.includes(value)) return false;
        Object.assign(this.selectKey.community, {
          options: [],
          checkedCommunity: [],
          communityName: [],
          checkAll: true,
          isIndeterminate: true,
        });
        const val = this.selectKey.trading.options.filter(item => item.label === value).pop().value;
        this.$http.get('http://' + global.URL + '/v1/region/' + val + '/group').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            const arr = res.body.list || [];
            arr.forEach(item => {
              this.selectKey.community.communityName.push(item.name);
              this.selectKey.community.options.push({
                label: item.name,
                value: item.groupId,
              });
            });
          }
        });
      },
      /*
       * 选择社区
       * */
      checkAllCommunity(event){
        this.selectKey.community.checkedCommunity = event.target.checked ? this.selectKey.community.communityName : [];
        this.selectKey.community.isIndeterminate = false;
      },
      changeCommunity(value){
        const checkedCount = value.length;
        this.selectKey.community.checkAll = checkedCount === this.selectKey.community.communityName.length;
        this.selectKey.community.isIndeterminate = checkedCount > 0 && checkedCount < this.selectKey.community.communityName.length;
        this.selectKey.community.checkedCommunity = value;
      },
      sureSelectCommity(){
        const arr = [];
        this.selectKey.trading.options.filter(item => {
          if (this.selectKey.trading.checkedTrading.includes(item.label)) {
            arr.push({
              label: item.label,
              value: item.value,
            });
          }
        });
        this.selectKey.community.options.filter(item => {
          if (this.selectKey.community.checkedCommunity.includes(item.label)) {
            arr.push({
              label: item.label,
              value: item.value,
            });
          }
        });
        this.form.checkedCommunity = arr;
        this.showCommitySelecter = false;
      },
      removeConmmunity(val){
        this.form.checkedCommunity = this.form.checkedCommunity.filter(item => item !== val);
      },
      changeContent(val){
        this.remainNum = val.length;
      },
      sureSendNow(type, sendType){
        const trading = this.form.checkedCommunity.filter(item => this.selectKey.trading.checkedTrading.includes(item.label));
        const community = this.form.checkedCommunity.filter(item => this.selectKey.community.checkedCommunity.includes(item.label));
        const obj = {
          goal: {
            all: true,
          },
          kind: this.form.messageType,
          userId: this.userId,
          way: this.form.sendType,
        };
        if (this.form.sendType === '2') {
          obj.templateCode = this.form.messageMould;
        } else {
          obj.content = this.form.content;
        }
        if (type === "put") {
          obj.msgId = this.edit.editId;
        }
        if (!sendType && !!this.form.timing) {
          obj.assignTime = this.form.timing;
        }
        if (this.form.sendTarget !== "all") {
          obj.goal.all = false;
          obj.goal.system = this.form.targetType;
          if (this.form.sexLabelId) {
            obj.goal.sex = this.form.sexLabelId;
          }
          if (this.form.userId.length > 0) {
            obj.goal.userId = this.form.userId;
          }
          if (this.form.loadingTime) {
            switch (this.form.loadingTime) {
              case 1:
                obj.goal.login = 30;
                break;
              case 2:
                obj.goal.login = 7;
                break;
              case 3:
                obj.goal.nologin = 30;
                break;
              case 4:
                obj.goal.nologin = 7;
                break;
            }
          }
          if (trading.length > 0) {
            const regionId = [];
            trading.forEach(item => {regionId.push(item.value)});
            obj.goal.regionId = regionId;
          }
          if (community.length > 0) {
            const groupId = [];
            community.forEach(item => {groupId.push(item.value)});
            obj.goal.groupId = groupId;
          }
        }
        this.$http[type]('http://' + global.URL + '/v1/message/push', obj).then((res) => {
          if (res.body.code === 200 || res.body.code === 201) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.resetForm();
            this.edit.isShowEdit = false;
            this.resetData();
          } else {
            this.$message.error(res.body.message);
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
          sendType: "2",
          messageType: "1",
          targetType: "all",
          sendTarget: "all",
          loadingTime: "",
          checkedCommunity: [],
          sexLabelId: "",
          content: "",
          timing: "",
          userId: [],
        });
        this.remainNum = 0;
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
          console.log(id);
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
            this.page.total = res.body.total;
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
  .carousel {
    display: inline-block;
    width: 55%;
    height: 260px;
    border: 1px solid #ccc;
    margin-left: 4%;
    float: right;
  }

  .carousel-content > span {
    position: absolute;
    width: 30px;
    height: 80px;
    top: calc(50% - 40px);
    background-image: url("../../../assets/preview_arrow.png");
    background-repeat: no-repeat;
    cursor: pointer;
  }

  .carousel-content > span.prev {
    left: -60px;
    background-position: 18px center;
  }

  .carousel-content > span.next {
    right: -60px;
    background-position: -12px center;
  }

  .carousel-content {
    margin: 0 auto;
    position: relative;
    width: 80%;
    height: 226px;
  }

  .carousel-content li.active {
    display: block;
  }

  .carousel-content > li {
    display: none;
    margin: 34px auto 0;
    height: 100%;
    width: 326px;
    position: relative;
    background-image: url("../../../assets/preview_phone.png");
    background-repeat: no-repeat;
  }

  .carousel-content .text {
    position: absolute;
    font-size: 12px;
  }

  .carousel-content .title {
    color: white;
    height: 13px;
    line-height: 13px;
    font-weight: bold;
  }

  .carousel-content .label {
    position: absolute;
    top: -35px;
    text-align: center;
    width: 100%;
  }

  .edit_show {
    width: 1100px;
    position: absolute;
    top: 50px;
    left: 50%;
    margin-left: -550px;
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
    left: 340px;
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

  .icon {
    display: inline-block;
    width: 20px;
    height: 15px;
    font-size: 16px;
    line-height: 16px;
  }

  .el-form-item {
    margin-bottom: 0;
  }
</style>
