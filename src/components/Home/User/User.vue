<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <!--      全部用户      -->
      <el-tab-pane label="全部用户" name="全部用户">
        <!--        详情页        -->
        <el-card class="box-card" v-show="showUserDetail">
          <div slot="header" class="detail_header">
            <span class="detail_title">详细信息</span>
            <i class="el-icon-close closeBtn" @click="showUserDetail=false"></i>
          </div>
          <div class="detail_content">
            <div class="user_operaiton">
              <p style="font-size:18px;text-align:center;line-height:36px">用户操作记录</p>
            </div>
            <div class="user_info">
              <div class="info_header">
                <div class="headerTop">
                  <div class="user_headImg"
                       :style="{backgroundImage: 'url('+ userDetail.headPic +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                  <span class="user_nickname">{{userDetail.name}}</span>
                  <span class="user_sex">{{sex[userDetail.sex]}}</span>
                </div>
                <div class="headerBottom">
                  <div class="user_dynamics">
                    <span>动态</span><br>
                    <span class="num">{{userDetail.newsletterNum}}</span>
                  </div>
                  <div class="user_comment">
                    <span>评论</span><br>
                    <span class="num">{{userDetail.commentNum}}</span>
                  </div>
                  <div class="user_fans">
                    <span>粉丝</span><br>
                    <span class="num">{{userDetail.fansNum}}</span>
                  </div>
                  <div class="user_concern">
                    <span>关注</span><br>
                    <span class="num">{{userDetail.followNum}}</span>
                  </div>
                </div>
              </div>
              <div class="info_body">
                <ul>
                  <li class="info_list">
                    <span class="list_title">是否禁用</span>
                    <span>{{userDetail.status === 0 ? "是" : "否"}}</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">标签</span>
                    <template v-if="userDetail.tags">
                      <span class="tag"
                            v-for="(item,index) in userDetail.tags">{{item.words}}</span>
                    </template>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">生日</span>
                    <span v-if="userDetail.birthday">{{userDetail.birthday}}</span>
                    <span v-else>无</span>
                  </li>

                  <li class="info_list">
                    <span class="list_title">手机号</span>
                    <span v-if="userDetail.phone" @click="showDetailTel(userDetail.userId)">{{userDetail.phone}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">写字楼</span>
                    <span v-if="userDetail.groupInfo">{{userDetail.groupInfo.name}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">楼层</span>
                    <span v-if="userDetail.floor">{{userDetail.floor}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">姓名</span>
                    <span v-if="userDetail.name">{{userDetail.name}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">行业</span>
                    <span v-if="userDetail.industry">{{userDetail.industry}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">公司</span>
                    <span v-if="userDetail.companyName">{{userDetail.companyName}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">职位</span>
                    <span v-if="userDetail.job">{{userDetail.job}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">注册时间</span>
                    <span v-if="userDetail.registerTime">{{userDetail.registerTime}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">最后登录</span>
                    <span v-if="userDetail.lastTime">{{userDetail.lastTime}}</span>
                    <span v-else>无</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-card>
        <!--        更改社区        -->
        <el-dialog title="更改社区" v-model="showEditGroup" size="tiny">
          <el-form :model="editGroup">
            <el-form-item label="社区" label-width="60px">
              <el-select v-model="editGroup.area" clearable placeholder="选择商圈" @change="selectArea"
                         style="width:150px">
                <el-option
                  v-for="item in addUserOptions.groups"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="editGroup.groupId" filterable clearable placeholder="选择社区" style="width:150px;">
                <el-option
                  v-for="item in selectScope.group"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="楼层" label-width="60px">
              <el-input-number v-model="editGroup.floor" :min="-100" :max="1000"></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showEditGroup = false">取 消</el-button>
            <el-button type="primary" @click="editGroupNow">确 定</el-button>
          </div>
        </el-dialog>

        <!--        添加用户		-->
        <el-dialog title="添加用户" v-model="showAddUser">
          <el-form :model="addUser">
            <el-form-item label="昵称" label-width="60px">
              <el-input style="width:240px;" v-model="addUser.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" label-width="60px">
              <el-radio class="radio" v-model="addUser.sex" label="1">男</el-radio>
              <el-radio class="radio" v-model="addUser.sex" label="2">女</el-radio>
            </el-form-item>
            <el-form-item label="手机号" label-width="60px">
              <el-input-number style="width:240px" v-model="addUser.phone"></el-input-number>
            </el-form-item>
            <el-form-item label="密码" label-width="60px">
              <el-input style="width:240px;" v-model="addUser.password"></el-input>
            </el-form-item>
            <el-form-item label="头像" label-width="60px">
              <my-unload mId="userHeadPic" :onSuccess="successUnload" :action="action"
                         :onDelete="deleteUnload" :img="addUserHeadPic"></my-unload>
            </el-form-item>
            <el-form-item label="生日" label-width="60px">
              <div style="position:relative">
                <el-date-picker
                  v-model="addUser.birthday"
                  type="date"
                  align="right"
                  clearable
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="社群" label-width="60px">
              <el-select v-model="addUserOptions.area" clearable placeholder="选择商圈" @change="selectArea"
                         style="width:150px">
                <el-option
                  v-for="item in selectScope.area"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="addUserOptions.groupId" filterable clearable placeholder="选择社区" style="width:150px;">
                <el-option
                  v-for="item in selectScope.group"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="楼层" label-width="60px">
              <el-input-number v-model="addUser.floor" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="运营账号" label-width="80px">
              <el-radio class="radio" v-model="addUser.vestUser" label="1">是</el-radio>
              <el-radio class="radio" v-model="addUser.vestUser" label="0">否</el-radio>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showAddUser = false">取 消</el-button>
            <el-button type="primary" @click="addUserNow">确 定</el-button>
          </div>
        </el-dialog>

        <div class="search_box">
          <el-select v-model="selectKey.area" clearable placeholder="选择商圈" @change="selectArea"
                     style="width:150px">
            <el-option
              v-for="item in selectScope.area"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="selectKey.group" filterable clearable placeholder="选择社区" style="width:150px;">
            <el-option
              v-for="item in selectScope.group"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="selectKey.state" clearable placeholder="认证状态" style="width:110px;">
            <el-option
              v-for="item in selectScope.state"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="selectKey.selectType" clearable placeholder="请选择"
                     style="width: 100px">
            <el-option label="注册时间" value="1"></el-option>
            <el-option label="最新开启App时间" value="2"></el-option>
          </el-select>
          <el-date-picker
            style="width:200px"
            v-model="selectKey.lastTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            placeholder="请选择时间"
            align="right">
          </el-date-picker>
          <div class="searchUser" style="width:220px">
            <el-input placeholder="请输入内容" v-model="selectKey.userKey">
              <el-select v-model="selectKey.selectUser" slot="prepend" clearable placeholder="请选择" style="width:110px" @change="clearSeletUser">
                <el-option label="昵称,姓名" value="1"></el-option>
                <el-option label="手机号" value="2"></el-option>
                <el-option label="用户ID" value="3"></el-option>
              </el-select>
            </el-input>
          </div>
          <el-button type="primary" @click="searchNow">搜索</el-button>
        </div>

        <!--        操作区        -->
        <div class="table_handle">
          <!--                    <el-button type="danger">禁用</el-button>-->
          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="exportExcel('user')">导出表格
          </el-button>
          <el-button style="float:right" @click="showAddUser = true"
                     v-if="hasPrivileges('user_add')">添加用户
          </el-button>
        </div>
        <!--禁言-->
        <el-dialog title="禁言" v-model="gag.showGag" size="tiny">
          <el-form v-model="gag" label-width="160px">
            <el-form-item label="被禁级别">
              <el-select v-model="gag.level" placeholder="请选被禁级别">
                <el-option label="禁发布" value="1"></el-option>
                <el-option label="禁发布和发言" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="被禁原因">
              <el-input type="textarea" v-model="gag.reason"></el-input>
            </el-form-item>
            <el-form-item label="被禁起止时间">
              <el-date-picker
                v-model="gag.time"
                type="datetimerange"
                align="right"
                placeholder="选择时间范围"
                :picker-options="gag.pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="sureGag">确定</el-button>
              <el-button @click="gag.showGag=false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <!--        列表区        -->
        <div class="table_box">
          <table class="table" id="user">
            <thead>
            <tr>
              <th>
                <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll"
                             @change="checkAll($event.target.checked)"> ID
                </el-checkbox>
              </th>
              <th>用户</th>
              <th>社区</th>
              <th>认证状态</th>
              <th>动态</th>
              <th>评论</th>
              <th>粉丝</th>
              <th>关注</th>
              <th>注册时间</th>
              <th>最后登录时间</th>
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
              <td>{{item.user.name}}<br>
                <span @click="showTel(item.id)">{{item.tel}}</span>
              </td>
              <td>{{item.community.name}}</td>
              <td>{{YN[item.state]}}</td>
              <td>{{item.newsletter.num}}</td>
              <td>{{item.comment.num}}</td>
              <td>{{item.fans.num}}</td>
              <td>{{item.follow.num}}</td>
              <td>{{item.registerTime}}</td>
              <td>{{item.lastTime}}</td>
              <td class="operation">
                <a href="javascript:void(0)" @click="showUser(item.id)">查看</a>
                <a href="javascript:void(0)" @click="changeGroup(item.id)" v-if="hasPrivileges('user_manage')">切换社区</a>
                <a href="javascript:void(0)" @click="showGag(item.id)" v-if="hasPrivileges('user_manage')">禁言</a>
                <a href="javascript:void(0)" @click="disableUser(item.id)"
                   v-if="item.status&&hasPrivileges('user_manage')">禁用</a>
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
      </el-tab-pane>
      <el-tab-pane label="用户详情" name="用户详情">
        <div class="search_box">
          <el-input v-model="detail.searchContent" style="display: inline-block;width: 200px;"
                    placeholder="姓名、昵称、公司、职位"></el-input>
          <el-button type="primary" @click="searchDetail">搜索</el-button>
        </div>
        <el-table
          class="table"
          :data="detail.user_data"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="userId"
            label="用户ID"
          ></el-table-column>
          <el-table-column
            prop="realName"
            label="姓名"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="昵称"
          ></el-table-column>
          <el-table-column
            prop="headPic"
            label="头像"
          >
            <template scope="scope">
              <img :src="scope.row.headPic" style="width: 50px;height: auto">
            </template>
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
          >
            <template scope="scope">
              {{scope.row.sex === 1 ? "男" : "女"}}
            </template>
          </el-table-column>
          <el-table-column
            prop="auth"
            label="是否认证"
          >
            <template scope="scope">
              {{scope.row.auth === 1 ? "是" : "否"}}
            </template>
          </el-table-column>
          <el-table-column
            prop="groupName"
            label="社区"
          ></el-table-column>
          <el-table-column
            prop="company"
            label="公司"
          ></el-table-column>
          <el-table-column
            prop="job"
            label="职位"
          ></el-table-column>
        </el-table>
        <div class="table_control">
          <el-pagination
            @size-change="handleSizeChangeDetail"
            @current-change="handleCurrentChangeDetail"
            :current-page="detail.page.currentPage"
            :page-sizes="detail.page.pageSizes"
            :page-size="detail.page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="detail.page.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  export default {
    name: 'user',
    data() {
      return {
        handler: JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).userId,
        YN: ['否', '是'],
        sex: ['保密', '男', '女'],
        showUserDetail: false,
        showEditGroup: false,
        showAddUser: false,
        activeName: '全部用户',
        page: {
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          currentPage: 1,
          total: 400,
        },
        editGroup: {
          floor: '',
          groupId: '',
          groups: [],
          userId: '',
          area: '',
        },
        detail: {
          user_data: [],
          searchContent: '',
          page: {
            pageSizes: [10, 20, 50, 100, 200, 500, 1000],
            pageSize: 10,
            currentPage: 1,
            total: 400,
          },
        },
        isIndeterminate: false,
        isCheckedAll: false,
        checked: [],
        selectKey: {
          selectType: '',
          type: '',
          state: '',
          lastTime: '',
          userKey: '',
          selectUser: '',
          area: [],
          group: '',
        },
        gag: {
          showGag: false,
          id: '',
          time: '',
          level: '',
          pickerOptions: {
            disabledDate(value) {
              return new Date().getTime() - value.getTime() > 3600 * 24 * 1000;
            }
          },
        },
        selectScope: {
          state: [{
            value: '1',
            label: '已认证'
          }, {
            value: '0',
            label: '未认证'
          }],
          area: [],
          group: []
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
        data: [],
        userDetail: '',
        addUserHeadPic: [],
        addUserOptions: {
          groupId: '',
          groups: [],
          area: '',
        },
        addUser: {
          birthday: '',
          floor: '',
          groupId: '',
          headPic: '',
          name: '',
          password: '',
          phone: '',
          sex: '',
          vestUser: ''
        },
        action: '',
      }
    },
    props: ['privileges'],
    mounted: function () {
      var that = this;
      this.action = 'http://' + global.URL + '/v1/file/upload?kind=2';
      this.resetData();

      this.$http.get('http://' + global.URL + '/v1/region?page=1&limit=999').then((res) => {
        if (res.body.code == 200 || res.body.code == 201) {
          for (let i = 0; i < res.body.list.length; i++) {
            let o = {
              value: res.body.list[i].circleId,
              label: res.body.list[i].name,
            }
            this.selectScope.area.push(o);
            this.addUserOptions.groups.push({
              value: res.body.list[i].circleId,
              label: res.body.list[i].name,
              children: [],
            });
          }
        }
      });

      // 初始化样式
      (function init() {
        $('.el-tabs__header').css({
          background: 'white'
        })
        $('.searchUser .el-input-group__prepend .el-input__inner').css({
          width: '110px'
        })
        $('.el-card__header').css({
          background: 'rgb(65,65,73)'
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
      showDetailTel(id){
        const viewerId = this.handler;
        this.$http.get('http://' + global.URL + '/v1/user/phone?viewerId=' + viewerId + '&vieweeId=' + id).then((res) => {
          if (res.body.code == 200) {
            this.userDetail.phone = res.body.message;
          }
        });
      },
      showTel(id) {
        const viewerId = this.handler;
        this.$http.get('http://' + global.URL + '/v1/user/phone?viewerId=' + viewerId + '&vieweeId=' + id).then((res) => {
          if (res.body.code == 200) {
            this.data.filter(item => item.id === id)[0].tel = res.body.message;
          }
        });
      },
      searchDetail() {
        this.$http.get('http://' + global.URL + '/v1/user/index?content=' + this.detail.searchContent + '&page=' + this.detail.page.currentPage + '&limit=' + this.detail.page.pageSize).then((res) => {
          if (res.body.code == 200) {
            this.detail.user_data = res.body.list || [];
            this.detail.page.total = res.body.total;
          }
        });
      },
      handleSizeChangeDetail(val) {
        this.detail.page.pageSize = val;
        this.searchDetail();
      },
      handleCurrentChangeDetail(val) {
        this.detail.page.currentPage = val;
        this.searchDetail();
      },
      disableUser(id) {
        this.$confirm('是否禁用该用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('http://' + global.URL + '/v1/user/disable?user=' + id).then((res) => {
            if (res.body.code == 200) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.resetData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });

      },
      showGag(id) {
        this.gag.id = id;
        this.gag.level = '';
        this.gag.reason = '';
        this.gag.time = '';
        this.gag.showGag = true;
      },
      sureGag() {
        const startTime = new Date(this.gag.time[0]).getTime() - new Date().getTime() > 60 * 1000 ? new Date(this.gag.time[0]).getTime() : new Date().getTime() + 60 * 1000;
        const obj = {
          endLockTime: this.formatTime(new Date(this.gag.time[1]).getTime()),
          handler: this.handler,
          level: this.gag.level,
          reason: this.gag.reason,
          startLockTime: this.formatTime(startTime),
          userId: this.gag.id,
        };
        this.$http.post('http://' + global.URL + '/v1/user/locked', obj).then((res) => {
          if (res.body.code == 201) {
            this.$message("操作成功");
            this.gag.showGag = false;
            this.resetData();
          }
        });
      },
      cancelAuthentication(id) {
        this.$http.put('http://' + global.URL + '/v1/user/certificated/' + id).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message("取消认证");
            this.resetData();
          }
        });
      },
      // 按商圈选择
      selectArea(val) {
        this.selectScope.group = [];
        this.$http.get('http://' + global.URL + '/v1/region/' + val + '/group').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            for (let i = 0; i < res.body.list.length; i++) {
              let o = {
                value: res.body.list[i].groupId,
                label: res.body.list[i].name
              }
              this.selectScope.group.push(o);
            }
          }
        })
      },
      clearSeletUser(){
        this.selectKey.userKey='';
      },
      // 搜索函数
      searchNow() {
        var that = this;
        if (this.selectKey.userKey) {
          var searchTel = function () {
            that.data = [];
            that.checked = [];
            that.isIndeterminate = false;
            that.isCheckedAll = false;
            that.$http.get('http://' + global.URL + '/v1/user/find/phone/' + that.selectKey.userKey).then((response) => {
              that.page.total = 1;
              if (response.body.code == 204) {
                that.page.total = 0;
                return false;
              }
              var obj = response.body.data;
              var Uname = obj.name ? obj.name : '';
              var Cname = obj.groupInfo ? obj.groupInfo.name : '';
              let o = {
                id: obj.userId,
                tel: obj.phone,
                user: {
                  name: Uname
                },
                community: {
                  name: Cname
                },
                state: obj.authentication,
                newsletter: {
                  num: obj.newsletterNum
                },
                comment: {
                  num: obj.commentNum
                },
                fans: {
                  num: obj.fansNum
                },
                follow: {
                  num: obj.followNum
                },
                registerTime: obj.registerTime,
                lastTime: obj.lastTime,
                isChecked: false
              }
              that.data.push(o);
            })
          };
          if (this.selectKey.selectUser == '2') {
            searchTel();
          } else {
            this.resetData();
          }
        } else {
          this.resetData()
        }
      },
      resetData() {
        this.data = [];
        this.checked = [];
        this.isIndeterminate = false;
        this.isCheckedAll = false;
        this.addUserOptions.groupId = [];
        var that = this;
        var parameter = '';
        if (this.selectKey.selectType && this.selectKey.lastTime) {
          if (Boolean(this.selectKey.lastTime[0])) {
            let sDate = new Date(this.selectKey.lastTime[0]);
            let sYear = sDate.getFullYear();
            let sMonth = sDate.getMonth() + 1;
            let sDay = sDate.getDate();
            let sHours = sDate.getHours();
            let sMinutes = sDate.getMinutes();
            let sSeconds = sDate.getSeconds();
            var sStr = sYear + '-' + sMonth + '-' + sDay + ' ' + sHours + ':' + sMinutes + ':' + sSeconds;

            let eDate = new Date(this.selectKey.lastTime[1]);
            let eYear = eDate.getFullYear();
            let eMonth = eDate.getMonth() + 1;
            let eDay = eDate.getDate();
            let eHours = eDate.getHours();
            let eMinutes = eDate.getMinutes();
            let eSeconds = eDate.getSeconds();
            var eStr = eYear + '-' + eMonth + '-' + eDay + ' ' + eHours + ':' + eMinutes + ':' + eSeconds;
            parameter += '&time=' + this.selectKey.selectType + '&startTime=' + sStr + '&endTime=' + eStr;
          }
        }
        if (this.selectKey.state) {
          parameter += '&auth=' + this.selectKey.state
        }
        if (this.selectKey.userKey) {
          if(this.selectKey.selectUser == '1'){
            parameter += '&name=' + this.selectKey.userKey
          }else{
            parameter += '&userId=' + this.selectKey.userKey
          }
        }
        if (this.selectKey.group) {
          parameter += '&groupId=' + this.selectKey.group;
        } else if (this.selectKey.area && this.selectKey.area.length != 0) {
          var strArr = []
          for (let i = 0; i < this.selectScope.group.length; i++) {
            strArr.push(this.selectScope.group[i].value)
          }
          parameter += '&groupId=' + strArr.join(',');
        }
        this.$http.get('http://' + global.URL + '/v1/user/list?limit=' + that.page.pageSize + '&page=' + that.page.currentPage + parameter).then((response) => {
          var arr = response.body.list || [];
          that.page.total = response.body.total;
          for (let i = 0, length = arr.length; i < length; i++) {
            var Uname = arr[i].name ? arr[i].name : '';
            var Cname = arr[i].groupInfo ? arr[i].groupInfo.name : '';
            let o = {
              id: arr[i].userId,
              tel: arr[i].phone,
              user: {
                name: Uname
              },
              community: {
                name: Cname
              },
              state: arr[i].authentication,
              newsletter: {
                num: arr[i].newsletterNum
              },
              comment: {
                num: arr[i].commentNum
              },
              fans: {
                num: arr[i].fansNum
              },
              follow: {
                num: arr[i].followNum
              },
              registerTime: arr[i].registerTime,
              lastTime: arr[i].lastTime,
              isChecked: false,
              status: arr[i].status,
            }
            that.data.push(o);
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
      checkAll(isChecked) {
        this.checked = [];
        if (isChecked) {
          for (let i = 0; i < this.data.length; i++) {
            this.data[i].isChecked = true;
            this.checked.push(this.data[i].id)
          }
        } else {
          for (let i = 0; i < this.data.length; i++) {
            this.data[i].isChecked = false;
          }
        }
        this.isIndeterminate = false;

      },
      checkOne(isChecked, id) {
        if (isChecked) {
          this.checked.push(id)
        } else {
          for (let i = 0; i < this.checked.length; i++) {
            if (this.checked[i] == id) {
              this.checked.splice(i, 1)
            }
          }
        }
        if (this.checked.length == this.data.length) {
          this.isIndeterminate = false;
          this.isCheckedAll = true;
        } else if (this.checked.length == 0) {
          this.isIndeterminate = false;
          this.isCheckedAll = false;
        } else {
          this.isIndeterminate = true;
        }
      },
      showUser(o) {
        this.showUserDetail = true;
        this.$http.get('http://' + global.URL + '/v1/user/' + o + '/detail').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.userDetail = res.body.data;
          } else {
            this.$message('数据有误')
          }
        });
      },
      changeGroup(o) {
        this.editGroup.userId = o;
        this.showEditGroup = true;
      },
      editGroupNow() {
        const obj = {
          floor: this.editGroup.floor,
          groupId: this.editGroup.groupId,
          userId: this.editGroup.userId,
        };
        this.$http.put('http://' + global.URL + '/v1/user/switch/group', obj).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message(res.body.data)
            this.resetData();
          } else {
            this.$message(res.body.message);
          }
        })
        this.showEditGroup = false;
      },
      addUserNow() {
        if (Boolean(this.addUser.birthday)) {
          let sDate = new Date(this.addUser.birthday);
          let sYear = sDate.getFullYear();
          let sMonth = sDate.getMonth() + 1;
          let sDay = sDate.getDate();
          let sHours = sDate.getHours();
          let sMinutes = sDate.getMinutes();
          let sSeconds = sDate.getSeconds();
          var sStr = sYear + '-' + sMonth + '-' + sDay + ' ' + sHours + ':' + sMinutes + ':' + sSeconds;
          this.addUser.birthday = sStr;
        }
        let o = { ...this.addUser, groupId: this.addUserOptions.groupId };
        this.addUser.headPic = this.addUserHeadPic[0];
        this.$http.post('http://' + global.URL + '/v1/user', o).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message('操作成功')
            this.showAddUser = false;
            this.resetData();
          } else {
            this.$message(res.body.message);
          }
        })
      },
      successUnload(img, arr) {
        console.log(arr)
        this.addUserHeadPic = arr;
      },
      deleteUnload(img, arr) {
        this.addUserHeadPic = arr;
      },
      formatTime(time) {
        let sDate = new Date(time);
        let sYear = sDate.getFullYear();
        let sMonth = sDate.getMonth() + 1;
        let sDay = sDate.getDate();
        let sHours = sDate.getHours();
        let sMinutes = sDate.getMinutes();
        let sSeconds = sDate.getSeconds();
        var str = sYear + '-' + sMonth + '-' + sDay + ' ' + sHours + ':' + sMinutes + ':' + sSeconds;
        return str;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*
      查看用户详情
  */
  .box-card {
    width: 720px;
    position: absolute;
    z-index: 9999;
    right: 0;
    box-shadow: -5px 5px 5px #ccc;
  }

  .closeBtn {
    float: right;
    color: white;
    font-size: 18px;
  }

  .closeBtn:hover {
    color: #20a0ff;
    cursor: pointer;
  }

  .detail_title {
    color: white;
    font-size: 18px;
  }

  .detail_content {
    width: 720px;
    height: 800px;
  }

  .user_operaiton {
    width: 360px;
    height: 800px;
    background: #eee;
    float: left;
  }

  .user_info {
    position: relative;
    width: 360px;
    height: 800px;
    float: right;
  }

  .user_info .headerTop {
    width: 340px;
    padding: 10px;
  }

  .user_info .info_header .user_headImg {
    width: 100px;
    height: 100px;
    background: #ccc;
  }

  .user_info .info_header .user_nickname {
    position: absolute;
    top: 0;
    left: 120px;
    line-height: 120px;
    width: 140px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .user_info .info_header .user_sex {
    position: absolute;
    top: 0;
    right: 0px;
    width: 100px;
    line-height: 120px;
    text-align: center;
  }

  .user_info .info_header .headerBottom {
    padding: 10px;
    display: flex;
    background: white;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  .user_dynamics, .user_comment, .user_fans, .user_concern {
    flex: 1;
    text-align: center;
  }

  .user_info .num {
    font-weight: bold;
  }

  .user_info .info_body {
    padding: 10px;
  }

  .user_info .info_body .info_list {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  .user_info .info_body .info_list .list_title {
    font-weight: bold;
    padding-right: 20px;
  }

  .tag {
    margin-right: 6px;
  }

  /*
      搜索
  */
  .title {
    font-size: 20px;
  }

  .search_box {
    padding: 12px 36px;
    text-align: right;
  }

  .searchUser {
    display: inline-block;
    width: 340px;
  }

  .userKey {
    width: 200px;
  }

  /*
      新建类型
  */
  .create_text {
    padding: 12px 0;
    font-size: 16px;
  }

  .create_input_box {
    width: 300px;
  }

  /*
      Table
  */
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

  .operation > a {
    color: #20a0ff;
    padding: 0 2px;
  }
</style>
