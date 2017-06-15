<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="新建群发" name="新建群发">
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
            <el-button type="primary" @click="sureSendNow">立即群发</el-button>
            <el-button>定时发送</el-button>
          </el-form-item>
        </el-form>
        <el-dialog title="选择商圈社区" v-model="showCommitySelecter" size="tiny">
          <el-row>
            <el-col :span="8">
              <div>
                <el-input
                  placeholder="选择城市"
                  icon="search"
                  v-model="selectKey.chosedCity.label"
                  :on-icon-click="searchTrading">
                </el-input>
                <br>
                <div class="select-content">
                  <div v-for="item in selectKey.city"
                       @click="choseCity(item.value)" class="city">{{item.label}}
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-input
                  placeholder="选择商圈"
                  icon="search"
                  v-model="selectKey.chosedTrading.label"
                  :on-icon-click="searchCommunity">
                </el-input>
                <br>
                <div class="select-content">
                  <div v-for="item in selectKey.trading" @click="choseTrading(item.value)"
                       class="trading">
                    {{item.label}}
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-checkbox :indeterminate="selectKey.isIndeterminate" v-model="selectKey.checkAll"
                             @change="checkAllCommunity">全选
                </el-checkbox>
                <br>
                <el-checkbox-group v-model="form.checkedCommunity" @change="checkedCommunityChange">
                  <el-checkbox v-for="item in selectKey.communityName" :label="item"
                               :key="item">{{item}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="showCommitySelecter = false">取 消</el-button>
                        <el-button type="primary" @click="sureSelectCommity">确 定</el-button>
                    </span>
        </el-dialog>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'newbuildmessage',
    data () {
      return {
        userId: JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).userId,
        activeName: "新建群发",
        showCommitySelecter: false,
        showLabelSelecter: false,
        remainNum: 0,
        addLabel: "",
        sendPeopleNum: 1000,
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
        selectKey: {
          city: [{
            label: "深圳",
            value: 0,
          }],
          chosedCity: {
            label: "深圳",
            value: 0,
          },
          trading: [],
          chosedTrading: {
            label: "",
            value: "",
          },
          community: [],
          communityName: [],
          checkAll: true,
          isIndeterminate: true,
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
        }
      }
    },
    methods: {
      choseCity(val){
        this.selectKey.chosedCity = this.selectKey.city.filter(item => item.value === val).pop();
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
        let checkedCount = value.length;
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
        console.log(this.form.communityId);
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
      sureSendNow(){
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
        this.$http.post('http://' + global.URL + '/v1/message/push', obj).then((res) => {
          if (res.body.code === 201) {
            this.$message({
              type: 'success',
              message: '发布成功!'
            });
            this.resetForm();
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
        Object.assign(this.form,{
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
    }
  }
</script>

<style scoped>
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

  .remainNum {
    position: absolute;
    bottom: 0;
    left: 550px;
  }
</style>
