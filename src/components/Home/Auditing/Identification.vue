<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <!--      搜索      -->
      <el-tab-pane label="认证管理" name="认证管理">
        <div class="search_box">
          <el-select v-model="selectKey.type" clearable placeholder="认证类型">
            <el-option
              v-for="item in selectScope.type"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
            <el-select
              v-model="selectKey.userId"
              filterable
              remote
              clearable
              placeholder="请选择用户昵称"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in selectScope.user"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <el-button type="primary" @click="resetData">搜索</el-button>
        </div>

        <div class="table_handle">
          <!--
                              <el-button type="primary">通过</el-button>
                              <el-button type="primary">驳回</el-button>
          -->

          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="exportExcel('identification')">
            导出表格
          </el-button>
        </div>

        <!--    列表    -->
        <div class="table_box">
          <table class="table" id="identification">
            <thead>
            <tr>
              <th>
                <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll"
                             @change="checkAll($event.target.checked)"> ID
                </el-checkbox>
              </th>
              <th>昵称</th>
              <th style="width: 120px">写字楼</th>
              <th>公司</th>
              <th>职位</th>
              <th style="width: 70px">类型</th>
              <th style="width: 60px">状态</th>
              <th style="width: 65px">是否大咖</th>
              <th style="width: 160px">时间</th>
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
              <td>{{item.company}}</td>
              <td>{{item.job}}</td>
              <td>{{item.type}}</td>
              <td>{{item.state}}</td>
              <td>{{item.vip ? '是' : '--'}}</td>
              <td>{{item.time}}</td>
              <td class="operation">
                <a href="javascript:void(0)" @click="showDetailNow(item.id)">查看</a>
                <!--<template v-if="hasPrivileges('certificate_manage')&&item.state === '通过'">-->
                <!--<a href="javascript:void(0)"-->
                <!--@click="setMvp(item.userId,item.vip)"-->
                <!--v-if="item.vip!=2"-->
                <!--&gt;{{item.vip === 1 ? '取消大咖' : '设为大咖'}}</a>-->
                <!--<a href="javascript:void(0)"-->
                <!--@click="setSuperMvp(item.userId,item.vip)"-->
                <!--v-if="item.vip!=0"-->
                <!--&gt;{{item.vip === 2 ? '取消超级大咖' : '设为超级大咖'}}</a>-->
                <!--<a href="javascript:void(0)"-->
                <!--@click="setLandlord(item.groupId,item.userId,item.landlord)"-->
                <!--&gt;{{item.landlord ? '取消楼主' : '设为楼主'}}</a>-->
                <!--</template>-->
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
                    <div class="show_imgs"
                         :style="{backgroundImage: 'url('+ detail.workPhoto +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
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
                    <div class="show_imgs"
                         :style="{backgroundImage: 'url('+ detail.livePhoto +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
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
              <div v-if="detail.headPic" class="userhead_img"
                   :style="{backgroundImage: 'url('+ detail.headPic +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
            </div>
          </div>
          <div class="dynamics_label">
            <span class="dy_text">姓名</span>
            <span class="label_text">
                            <span v-if="detail.realName">{{detail.realName}}</span>
                        </span>
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
            <span class="dy_text">行业</span>
            <span class="label_text">
                            <span v-if="detail.industry">{{detail.industry}}</span>
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
            <span class="dy_text">标签</span>
            <span class="label_text">
                            <span v-if="detail.tagsName">{{detail.tagsName.join(',')}}</span>
                        </span>
          </div>
          <div class="dynamics_label">
            <span class="dy_text">家乡</span>
            <span class="label_text">
                            <span
                              v-if="detail.province||detail.city">{{detail.province}}、{{detail.city}}</span>
                        </span>
          </div>
          <div class="dynamics_label">
            <span class="dy_text">学校</span>
            <span class="label_text">
                            <span v-if="detail.school">{{detail.school}}</span>
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
                                <a v-if="detail.kind == 1" @click="showDetailImg = true"
                                   style="cursor:pointer;color:#20a0ff">查看图片</a>
                            </span>
                        </span>
          </div>
          <div v-if="detail.kind===1&&detail.state===1" class="dynamics_num"
               style="text-align:center">
            <el-button type="primary" style="margin:0 20px" size="large"
                       @click="certification('2')">通过
            </el-button>
            <el-button type="primary" style="margin:0 20px" size="large"
                       @click="showRejectReason = true">驳回
            </el-button>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="认证用户管理" name="认证用户管理">
        <div class="search_box">
          <el-select v-model="identification.selectKey.area" clearable placeholder="选择商圈" @change="selectArea"
                     style="width:150px">
            <el-option
              v-for="item in identification.selectScope.areas"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="identification.selectKey.group" filterable clearable placeholder="选择社区" style="width:150px;">
            <el-option
              v-for="item in identification.selectScope.groups"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select
            v-model="identification.username"
            filterable
            remote
            clearable
            placeholder="请选择用户昵称"
            :remote-method="idremoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in identification.user"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
          <el-button type="primary" @click="resetIndentficationData">搜索</el-button>
        </div>
        <div class="table_box">
          <el-table
            class="table"
            :data="identification.data"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="userId"
              label="ID"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="nickname"
              label="昵称"
            ></el-table-column>
            <el-table-column
              prop="officeBuilding"
              label="社区"
            ></el-table-column>
            <el-table-column
              prop="company"
              label="公司"
            ></el-table-column>
            <el-table-column
              prop="job"
              label="职位"
              width="120"
            ></el-table-column>
            <el-table-column
              label="大咖"
              width="100"
            >
              <template scope="scope">
                {{scope.row.vip === 1 ? "是" : "否"}}
              </template>
            </el-table-column>
            <el-table-column
              label="超级大咖"
              width="120"
            >
              <template scope="scope">
                {{scope.row.vip === 2 ? "是" : "否"}}
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label="时间"
            ></el-table-column>
            <el-table-column
              label="操作"
              width="350"
            >
              <template scope="scope" v-if="hasPrivileges('certificate_manage')">
                <span class="operation">
                  <a href="javascript:void(0)" @click="showUser(scope.row.userId)">查看</a>
                  <a href="javascript:void(0)" @click="cancelAuthentication(scope.row)"
                  >取消认证</a>
                  <a href="javascript:void(0)"
                     @click="setMvp(scope.row)"
                     v-if="scope.row.vip!=2"
                  >{{scope.row.vip === 1 ? '取消大咖' : '设为大咖'}}</a>
                  <a href="javascript:void(0)"
                     @click="setSuperMvp(scope.row)"
                     v-if="scope.row.vip!=0"
                  >{{scope.row.vip === 2 ? '取消超级大咖' : '设为超级大咖'}}</a>
                  <!--<a href="javascript:void(0)"-->
                  <!--@click="setLandlord(scope.row)"-->
                  <!--&gt;{{scope.row.landlord ? '取消楼主' : '设为楼主'}}</a>-->
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="table_control">
            <el-pagination
              @size-change="idhandleSizeChange"
              @current-change="idhandleCurrentChange"
              :current-page="identification.page.currentPage"
              :page-sizes="identification.page.pageSizes"
              :page-size="identification.page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="identification.page.total">
            </el-pagination>
          </div>
        </div>
        <el-card class="box-card" v-show="identification.showUserDetail">
          <div slot="header" class="detail_header">
            <span class="detail_title">详细信息</span>
            <i class="el-icon-close closeBtn" @click="identification.showUserDetail=false"></i>
          </div>
          <div class="detail_content">
            <div class="user_info">
              <div class="info_header">
                <div class="headerTop">
                  <div class="user_headImg"
                       :style="{backgroundImage: 'url('+ identification.userDetail.headPic +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                  <span class="user_nickname">{{identification.userDetail.name}}</span>
                  <span class="user_sex">{{sex[identification.userDetail.sex]}}</span>
                </div>
                <div class="headerBottom">
                  <div class="user_dynamics">
                    <span>动态</span><br>
                    <span class="num">{{identification.userDetail.newsletterNum}}</span>
                  </div>
                  <div class="user_comment">
                    <span>评论</span><br>
                    <span class="num">{{identification.userDetail.commentNum}}</span>
                  </div>
                  <div class="user_fans">
                    <span>粉丝</span><br>
                    <span class="num">{{identification.userDetail.fansNum}}</span>
                  </div>
                  <div class="user_concern">
                    <span>关注</span><br>
                    <span class="num">{{identification.userDetail.followNum}}</span>
                  </div>
                </div>
              </div>
              <div class="info_body">
                <ul>
                  <li class="info_list">
                    <span class="list_title">是否禁用</span>
                    <span>{{identification.userDetail.status === 0 ? "是" : "否"}}</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">标签</span>
                    <template v-if="identification.userDetail.tags">
                      <span class="tag"
                            v-for="(item,index) in identification.userDetail.tags">{{item.words}}</span>
                    </template>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">生日</span>
                    <span v-if="identification.userDetail.birthday">{{identification.userDetail.birthday}}</span>
                    <span v-else>无</span>
                  </li>

                  <li class="info_list">
                    <span class="list_title">手机号</span>
                    <span v-if="identification.userDetail.phone" @click="showDetailTel(identification.userDetail.userId)">{{identification.userDetail.phone}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">写字楼</span>
                    <span v-if="identification.userDetail.groupInfo">{{identification.userDetail.groupInfo.name}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">楼层</span>
                    <span v-if="identification.userDetail.floor">{{identification.userDetail.floor}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">姓名</span>
                    <span v-if="identification.userDetail.name">{{identification.userDetail.name}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">行业</span>
                    <span v-if="identification.userDetail.industry">{{identification.userDetail.industry}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">公司</span>
                    <span v-if="identification.userDetail.companyName">{{identification.userDetail.companyName}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">职位</span>
                    <span v-if="identification.userDetail.job">{{identification.userDetail.job}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">注册时间</span>
                    <span v-if="identification.userDetail.registerTime">{{identification.userDetail.registerTime}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="info_list">
                    <span class="list_title">最后登录</span>
                    <span v-if="identification.userDetail.lastTime">{{identification.userDetail.lastTime}}</span>
                    <span v-else>无</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>


    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'assess',
    data() {
      return {
        loading: false,
        showDetail: false,
        showDetailImg: false,
        showRejectReason: false,
        deal: {
          id: '',
          reason: '',
        },
        activeName: '认证管理',
        page: {
          currentPage: 1,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          total: 100
        },
        isIndeterminate: false,
        isCheckedAll: false,
        checked: [],
        selectKey: {
          state: '',
          userId: '',
          type: '',
        },
        selectScope: {
          user: [],
          type: [{
            value: '-1',
            label: '不限'
          }, {
            value: '1',
            label: '上传资料'
          }, {
            value: '2',
            label: '好友认证'
          }],
          state: [{
            value: '放弃',
            label: '放弃'
          }, {
            value: '进行中',
            label: '进行中'
          }, {
            value: '通过',
            label: '通过'
          }, {
            value: '失败',
            label: '失败'
          }],
        },
        data: [],
        detail: {},
        state: ['放弃', '进行中', '通过', 'error', '失败'],
        kind: ['0', '上传资料', '邀请好友'],
        sex: ['保密', '男', '女'],
        identification: {
          data: [],
          page: {
            currentPage: 1,
            pageSizes: [10, 20, 50, 100, 200, 500, 1000],
            pageSize: 10,
            total: 100
          },
          user:[],
          selectScope:{
            areas:[],
            groups:[],
          },
          selectKey:{
            area:'',
            group:'',
          },
          showUserDetail:false,
          userDetail:[],
        },

      }
    },

    mounted: function () {
      var that = this;
      this.$http.get('http://' + global.URL + '/v1/user/apply/certification?page=' + that.page.currentPage + '&limit=' + that.page.pageSize).then((response) => {
        var arr = response.body.list;
        var TYPE = ['0', '上传资料', '邀请好友'];
        var STATE = ['放弃', '进行中', '通过', 'error', '失败'];
        that.page.total = response.body.total

        for (let i = 0, length = arr.length; i < length; i++) {

          let o = {
            groupId: arr[i].groupId,
            id: arr[i].applyId,
            nickname: arr[i].name,
            userId: arr[i].userId,
            officeBuilding: arr[i].groupName,
            type: TYPE[arr[i].kind],
            state: STATE[arr[i].state],
            company: arr[i].company,
            job: arr[i].job,
            vip: arr[i].vip,
            landlord: arr[i].groupOwner,
            time: arr[i].createTime,
            isChecked: false
          }
          that.data.push(o)
        }

      });
      this.$http.get('http://' + global.URL + '/v1/region?page=1&limit=999').then((res) => {
        if (res.body.code == 200 || res.body.code == 201) {
          for (let i = 0; i < res.body.list.length; i++) {
            let o = {
              value: res.body.list[i].circleId,
              label: res.body.list[i].name,
            }
            this.identification.selectScope.areas.push(o);
          }
        }
      });
      this.resetIndentficationData();
      (function init() {
        $('.el-tabs__header').css({
          background: 'white'
        })
        $('.searchText .el-input-group__prepend .el-input__inner').css({
          width: '100px'
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
      showUser(o) {
        this.identification.showUserDetail = true;
        this.$http.get('http://' + global.URL + '/v1/user/' + o + '/detail').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.identification.userDetail = res.body.data;
          } else {
            this.$message('数据有误')
          }
        });
      },
      selectArea(val) {
        this.identification.selectScope.groups = [];
        this.$http.get('http://' + global.URL + '/v1/region/' + val + '/group').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            for (let i = 0; i < res.body.list.length; i++) {
              let o = {
                value: res.body.list[i].groupId,
                label: res.body.list[i].name
              }
              this.identification.selectScope.groups.push(o);
            }
          }
        })
      },
      resetIndentficationData() {
        let parameter = '';
        if (this.identification.selectKey.group) {
          parameter += '&groupId=' + this.identification.selectKey.group;
        }
        if (this.identification.username) {
          parameter += '&name=' + this.identification.username;
        }
        this.$http.get('http://' + global.URL + '/v1/user/list?auth=1&page=' + this.identification.page.currentPage + '&limit=' + this.identification.page.pageSize + parameter).then((response) => {
          const arr = response.body.list || [];
          this.identification.page.total = response.body.total;
          const array = [];
          arr.forEach(item => {
            array.push({
              groupId: item.groupId,
              userId: item.userId,
              nickname: item.name,
              officeBuilding: item.groupInfo ? item.groupInfo.name : '',
              time: item.lastTime,
              vip: item.vip,
              company:item.companyName,
              job:item.jobName,
            });
          });
          this.identification.data = array;
        });
      },
      cancelAuthentication(obj) {
        this.$confirm('是否取消用户认证', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put('http://' + global.URL + '/v1/user/certificated/' + obj.userId).then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.resetIndentficationData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });

      },
      remoteMethod(name) {
        this.selectScope.user = [];
        if (name !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$http.get('http://' + global.URL + '/v1/user/find?name=' + name).then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                let arr = res.body.list || [];
                arr.forEach((item) => {
                  this.selectScope.user.push({
                    value: item.userId,
                    label: item.name,
                  })
                });
              }
            })
          }, 500);
        }
      },
      idremoteMethod(name){
        this.identification.user = [];
        if (name !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$http.get('http://' + global.URL + '/v1/user/find?name=' + name).then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                let arr = res.body.list || [];
                arr.forEach((item) => {
                  this.identification.user.push({
                    value: item.userId,
                    label: item.name,
                  })
                });
              }
            })
          }, 500);
        }
      },
      setMvp(obj) {
        const type = obj.vip === 1 ? '0' : '1';
        this.$http.put('http://' + global.URL + '/v1/user/mvp/', {
          state: type,
          userId: obj.userId,
        }).then(res => {
          if (res.body.code === 200) {
            this.$message('操作成功');
            this.resetIndentficationData();
          } else {
            this.$message(res.body.message);
          }
        });
      },
      setSuperMvp(obj) {
        const type = obj.vip === 2 ? '1' : '2';
        this.$http.put('http://' + global.URL + '/v1/user/mvp/',{
          state: type,
          userId: obj.userId,
        }).then(res => {
          if (res.body.code === 200) {
            this.$message('操作成功');
            this.resetIndentficationData();
          } else {
            this.$message(res.body.message);
          }
        });
      },
      setLandlord(obj) {
        const type = obj.landlord ? "1" : "3";
        this.$http.put('http://' + global.URL + '/v1/user/owner/' + obj.groupId + '/' + obj.userId + '/' + type).then(res => {
          if (res.body.code === 200) {
            this.$message('操作成功');
            this.resetIndentficationData();
          } else {
            this.$message(res.body.message);
          }
        });
      },
      resetData() {
        this.data = [];
        this.checked = [];
        this.isIndeterminate = false;
        this.isCheckedAll = false;
        var that = this;
        var parameter = '';
        if (this.selectKey.type) {
          parameter += '&type=' + this.selectKey.type;
        }
        if (this.selectKey.userId) {
          parameter += '&userId=' + this.selectKey.userId;
        }
        if (this.selectKey.state) {
          let str;
          if (this.selectKey.state == '放弃') {
            str = '0';
          } else if (this.selectKey.state == '进行中') {
            str = '1';
          } else if (this.selectKey.state == '通过') {
            str = '2';
          } else if (this.selectKey.state == '失败') {
            str = '4';
          }
          parameter += '&state=' + str;
        }

        this.$http.get('http://' + global.URL + '/v1/user/apply/certification?page=' + that.page.currentPage + '&limit=' + that.page.pageSize + parameter).then((response) => {
          var arr = response.body.list || [];
          var TYPE = ['0', '上传资料', '邀请好友'];
          var STATE = ['放弃', '进行中', '通过', 'error', '失败'];
          that.page.total = response.body.total

          for (let i = 0, length = arr.length; i < length; i++) {

            let o = {
              groupId: arr[i].groupId,
              id: arr[i].applyId,
              nickname: arr[i].name,
              userId: arr[i].userId,
              officeBuilding: arr[i].groupName,
              type: TYPE[arr[i].kind],
              state: STATE[arr[i].state],
              time: arr[i].createTime,
              company: arr[i].company,
              job: arr[i].job,
              vip: arr[i].vip,
              landlord: arr[i].groupOwner,
              isChecked: false
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
      idhandleSizeChange(val) {
        this.identification.page.pageSize = val;
        this.resetIndentficationData()
      },
      idhandleCurrentChange(val) {
        this.identification.page.currentPage = val;
        this.resetIndentficationData()
      },
      checkAll: function (isChecked) {
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
      checkOne: function (isChecked, id) {
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
      showDetailNow(id) {
        this.showDetail = true;
        this.deal.id = id;
        this.$http.get('http://' + global.URL + '/v1/user/certification/' + id + '/info').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.detail = res.body.data;
          } else {
            this.$message(res.body.message);
          }
        })
      },
      certification(state) {
        var user = JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).userId;
        if (state == "2") {
          var o = {
            "applyId": this.deal.id,
            "state": state,
            "userId": user
          }
          this.$http.put('http://' + global.URL + '/v1/user/process/certification', o).then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              this.$message('操作成功');
              this.resetData();
            } else {
              this.$message(res.body.message)
            }
          })
        } else if (state == "4") {
          var o = {
            "applyId": this.deal.id,
            "state": state,
            "userId": user,
            "remark": this.deal.reason,
          }
          this.$http.put('http://' + global.URL + '/v1/user/process/certification', o).then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              this.$message('操作成功');
              this.resetData();
            } else {
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
  .title {
    font-size: 20px;
  }

  .search_box {
    padding: 12px 36px;
    text-align: right;
  }

  .searchText {
    display: inline-block;
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

  /*
      详情
  */
  .dynamics_show {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 520px;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.8);
    box-shadow: -10px 10px 5px #ccc;
    z-index: 999;
  }

  .dy_text {
    position: absolute;
    left: 50px;
    color: rgba(167, 167, 167, 1);
  }

  .dynamics_header {
    position: relative;
    height: 65px;
    background: rgb(65, 65, 73);
    font-size: 24px;
    color: rgb(177, 177, 185);
  }

  .dynamics_title {
    position: absolute;
    left: 46px;
    top: 20px;
  }

  .dynamics_header i {
    font-size: 20px;
    position: absolute;
    right: 32px;
    top: 24px;
  }

  .dynamics_header i:hover {
    cursor: pointer;
    color: rgb(84, 179, 183);
  }

  .dynamics_user {
    width: 100%;
    height: 200px;
    position: relative;
  }

  .dynamics_user .username {
    position: relative;
    top: 109px;
    left: 120px;
  }

  .dynamics_user .userhead_img {
    position: absolute;
    top: 64px;
    right: 56px;
    background: red;
    width: 105px;
    height: 105px;
  }

  .dynamics_user .dy_text {
    top: 109px;
  }

  .dynamics_label {
    height: 60px;
    position: relative;
  }

  .dynamics_label .dy_text {
    bottom: 21px;
  }

  .dynamics_label .label_text {
    position: absolute;
    bottom: 21px;
    left: 135px;
  }

  .dynamics_label .label_time {
    color: rgb(167, 167, 167);
    position: absolute;
    bottom: 21px;
    right: 56px;
  }

  .dynamics_imgs {
    position: relative;
    width: 100%;
    min-height: 40px;
    padding: 12px 0;
    background: rgb(245, 245, 245);
  }

  .dynamics_imgs .dy_text {
    top: 20px;
  }

  .dynamics_imgs .dynamics_imgBox {
    font-size: 0;
    position: relative;
    width: 351px;
    margin-right: 48px;
    margin-top: 3px;
    float: right;
  }

  .show_imgs {
    display: inline-block;
    margin: 6px;
    width: 360px;
    height: 360px;
    background: #ccc;
  }

  .dynamics_num {
    height: 80px;
    color: rgba(167, 167, 167, 1);
    position: relative;
  }
  .box-card {
    position: absolute;
    z-index: 9999;
    right: 0;
    top: 0;
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

  .user_info {
    position: relative;
    width: 360px;
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
</style>
