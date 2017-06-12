<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <!--      全部服务      -->
      <el-tab-pane label="全部服务" name="first">
        <div class="search_box">

          <el-input class="organiser" v-model="serviceSelectKey.name" placeholder="服务名称"></el-input>
          <el-date-picker
            v-model="serviceSelectKey.time"
            type="datetimerange"
            align="right"
            placeholder="发布时间"
            :picker-options="serviceSelectScope.pickerOptions">
          </el-date-picker>
          <!--                    <el-input class="organiser" v-model="serviceSelectKey.type" placeholder="服务类型"></el-input>-->
          <el-button type="primary" @click="resetserviceData">搜索</el-button>
        </div>

        <div class="table_handle">
          <el-button type="danger" @click="deleteservice(checked)" v-if="hasPrivileges('service_delete')">删除</el-button>
          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="exportExcel('service')">导出表格
          </el-button>
        </div>
        <!--    服务列表    -->
        <div class="table_box">
          <table class="table" id="service">
            <thead>
            <tr>
              <th>
                <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll"
                             @change="checkAll($event.target.checked)"> ID
                </el-checkbox>
              </th>
              <th>服务名称</th>
              <th>发布人</th>
              <th>价格</th>
              <th>单位</th>
              <th>推荐</th>
              <th>评论</th>
              <th>访问</th>
              <th>刷新次数</th>
              <th>发布时间</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in data">
              <td>
                <el-checkbox
                  v-model="data[index].isChecked"
                  class="check_btn" @change="checkOne($event.target.checked,item.serviceId)">
                  {{item.serviceId}}
                </el-checkbox>
              </td>
              <td>{{item.serviceName}}</td>
              <td>{{item.userName}}</td>
              <td>{{item.cost}}</td>
              <td>{{item.unit}}</td>
              <td>{{item.recommmendNum}}</td>
              <td>{{item.commentNum}}</td>
              <td>{{item.visitNum}}</td>
              <td>{{item.refreshedNum}}</td>
              <td>{{item.createdTime}}</td>
              <td class="operation">
                <a href="javascript:void(0)" @click="showservice(item.serviceId)">查看</a>
                <a href="javascript:void(0)" @click="deleteservice(item.serviceId)" v-if="hasPrivileges('service_delete')">删除</a>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="table_control">
            <el-pagination
              @size-change="handleSizeChangeservice"
              @current-change="handleCurrentChangeservice"
              :current-page="servicePage.currentPage"
              :page-sizes="servicePage.pageSizes"
              :page-size="servicePage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="servicePage.total">
            </el-pagination>
          </div>
        </div>
        <delete v-if="showDelete" :checked="checked" :cancel="cancelDelete"
                :confirm="confirmDelete"></delete>
        <!--       详情页         -->
        <el-card class="dynamics_show" v-show="showserviceDetail">
          <div class="dynamics_header">
            <span class="dynamics_title">服务详情</span>
            <i class="el-icon-close" @click="showserviceDetail=false"></i>
          </div>
          <div class="dynamics_user">
            <span class="dy_text">用户</span>
            <span class="username">
                            <span v-if="serviceDetail.author">{{serviceDetail.author.name}}</span>
                        </span>
            <div class="userhead_box">
              <div v-if="serviceDetail.author" class="userhead_img"
                   :style="{backgroundImage: 'url('+ serviceDetail.author.headPic +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
            </div>
          </div>
          <div class="dynamics_label">
            <span class="dy_text">时间</span>
            <span class="label_text">
                            <span
                              v-if="serviceDetail.createdTime">{{serviceDetail.createdTime}}</span>
                        </span>
          </div>
          <div class="dynamics_contentBox">
            <div class="dynamics_content">
              <span class="dy_text">内容</span>
              <p v-if="serviceDetail.content">{{serviceDetail.content}}</p>
              <div class="clear"></div>
            </div>
            <div class="dynamics_imgs">
              <span class="dy_text">图片</span>
              <div class="dynamics_imgBox">
                <div v-if="serviceDetail.photo">
                  <div class="show_imgs" v-for="(item,index) in serviceDetail.photo"
                       :style="{backgroundImage: 'url('+ item +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                </div>
              </div>
              <div class="clear"></div>
            </div>
          </div>

          <div class="dynamics_num">
            <span class="praise_text">推荐<span
              class="praise_num">{{serviceDetail.recommmendNum}}</span></span>
            <span class="comment_text">评论<span
              class="comment_num">{{serviceDetail.commentNum}}</span></span>
          </div>
        </el-card>
      </el-tab-pane>

      <!--     全部服务者       -->
      <el-tab-pane label="全部服务者" name="second">
        <div class="search_box">
          <el-select v-model="servant.selectKey.timeType" clearable placeholder="时间类型">
            <el-option
              v-for="item in servant.selectScope.timeType"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="servant.selectKey.time"
            type="datetimerange"
            align="right"
            placeholder="选择时间"
            :picker-options="servant.selectScope.pickerOptions">
          </el-date-picker>
          <el-input class="organiser" v-model="servant.selectKey.phone"
                    placeholder="输入手机号"></el-input>
          <el-input class="organiser" v-model="servant.selectKey.name"
                    placeholder="输入服务者"></el-input>
          <el-select v-model="servant.selectKey.tagId" clearable  placeholder="请选择标签">
            <el-option
              v-for="item in servant.tagIds"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!--<el-input class="organiser" v-model="servant.selectKey.tagId"-->
                    <!--placeholder="输入标签Id"></el-input>-->
          <el-button type="primary" @click="resetservantData">搜索</el-button>
        </div>

        <div class="table_handle">
          <!--<el-button type="danger" @click="deleteservant(servant.checked)">删除</el-button>-->
          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="exportExcel('servant')">导出表格
          </el-button>
        </div>

        <div class="table_box">
          <table class="table" id="servant">
            <thead>
            <tr>
              <th>
                <el-checkbox :indeterminate="servant.isIndeterminate" v-model="servant.isCheckedAll"
                             @change="checkAllServant($event.target.checked)"> ID
                </el-checkbox>
              </th>
              <th>服务者</th>
              <th>服务类型</th>
              <th>手机号</th>
              <th>评价</th>
              <th>评价人数</th>
              <th>排序</th>
              <th>最后登录时间</th>
              <th>更新时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in servant.data">
              <td>
                <el-checkbox
                  v-model="servant.data[index].isChecked"
                  class="check_btn"
                  @change="checkOneServant($event.target.checked,item.providerId)">
                  {{item.providerId}}
                </el-checkbox>
              </td>
              <td>{{ item.providerName }}</td>
              <td>{{ item.tagName }}</td>
              <td>{{ item.phoneNum }}</td>
              <td>{{ item.avg }}</td>
              <td>{{ item.gradeNum }}</td>
              <td>{{ item.sort }}</td>
              <td>{{ item.lastTime }}</td>
              <td>{{ item.createdTime }}</td>
              <td>{{ serviceState(item.state) }}</td>
              <td class="operation">
                <a href="javascript:void(0)" @click="showServantDetail(item.providerId)">查看</a>
                <a href="javascript:void(0)" @click="showSortNow(item.providerId)" v-if="hasPrivileges('service_manage')">排序</a>
                <!--<a href="javascript:void(0)" @click="deleteservant(item.providerId)">删除</a>-->
                <a href="javascript:void(0)" @click="changeService(item.providerId,item.state)" v-if="hasPrivileges('service_manage')">{{changeState(item.state)}}</a>
                <!--<a href="javascript:void(0)" @click="remarks(item.providerId)">备注</a>-->
                <a href="javascript:void(0)" @click="addCommunity(item.providerId)" v-if="hasPrivileges('service_manage')">添加社区</a>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="table_control">
            <el-pagination
              @size-change="handleSizeChangeServant"
              @current-change="handleCurrentChangeServant"
              :current-page="servantPage.currentPage"
              :page-sizes="servantPage.pageSizes"
              :page-size="servantPage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="servantPage.total">
            </el-pagination>
          </div>
        </div>

        <!--        排序服务者        -->
        <el-dialog title="服务者排序" v-model="servant.showSort" size="tiny">
          <el-form :model="servant.sort">
            <el-form-item label="排序数值" :label-width="'80px'">
              <el-input-number :min="0" :max="100" v-model="servant.sort.sort"
                               auto-complete="off"></el-input-number>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
					<el-button @click="servant.showSort = false">取 消</el-button>
					<el-button type="primary" @click="sortNow">确 定</el-button>
				  </span>
        </el-dialog>
        <!--关闭服务-->
        <el-dialog title="确认关闭服务" v-model="servant.showClose" size="tiny">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入关闭服务原因，50字以内"
            v-model="servant.closeReason">
          </el-input>
          <span slot="footer" class="dialog-footer">
					<el-button @click="servant.showClose = false">取 消</el-button>
					<el-button type="primary" @click="submitCloseReason">确 定</el-button>
				  </span>
        </el-dialog>
        <!--开启服务-->
        <el-dialog title="开启服务" v-model="servant.showOpen" size="tiny">
          <span>是否开启该服务者的服务功能？</span>
          <span slot="footer" class="dialog-footer">
					<el-button @click="servant.showOpen = false">取 消</el-button>
					<el-button type="primary" @click="submitOpen">确 定</el-button>
				  </span>
        </el-dialog>
        <!--受理-->
        <el-dialog title="受理服务" v-model="servant.acceptance" size="tiny">
          <el-radio-group v-model="servant.isOpenType"
                          @change="isOpenTypeChange">
            <el-radio :label="1">同意开启</el-radio>
            <el-radio :label="2">拒绝开启</el-radio>
          </el-radio-group>
          <el-input
            v-show="servant.isComment"
            type="textarea"
            :rows="3"
            placeholder="请输入拒绝原因，50字以内"
            v-model="servant.closeReason">
          </el-input>
          <span slot="footer" class="dialog-footer">
					<el-button @click="servant.acceptance = false">取 消</el-button>
					<el-button type="primary" @click="submitAcceptance(servant.isOpenType)">确 定</el-button>
				  </span>
        </el-dialog>
        <el-dialog title="添加社区" v-model="servant.showCommunity" size="tiny">
          <el-select v-model="community" @change="choseCommunity" clearable placeholder="请选择社区">
            <el-option
              v-for="item in communityList"
              :key="item.groupId"
              :label="item.name"
              :value="item.groupId.toString()">
            </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
					<el-button @click="servant.showCommunity = false">取 消</el-button>
					<el-button type="primary" @click="submitCommunity">确 定</el-button>
				  </span>
        </el-dialog>
        <!--       详情页         -->
        <el-card class="dynamics_show" v-show="servant.showDetail">
          <div class="dynamics_header">
            <span class="dynamics_title">服务者详情</span>
            <i class="el-icon-close" @click="servant.showDetail=false"></i>
          </div>
          <div class="dynamics_user">
            <span class="dy_text">用户</span>
            <span class="username">
                            <span v-if="servant.detail.user">{{servant.detail.user.name}}</span>
                        </span>
            <div class="userhead_box">
              <div v-if="servant.detail.user" class="userhead_img"
                   :style="{backgroundImage: 'url('+ servant.detail.user.headPic +')',backgroundSize:'cover',backgroundPositon:'center'}"></div>
            </div>
          </div>
          <div class="dynamics_contentBox" style="max-height:300px;background:rgb(250,250,250)">
            <div class="dynamics_label">
              <span class="dy_text">手机号</span>
              <span class="label_text">
								<span v-if="servant.detail.user">{{servant.detail.user.phoneNum}}</span>
							</span>
            </div>
            <div class="dynamics_label">
              <span class="dy_text">评价</span>
              <span class="label_text">
								<span v-if="servant.detail">{{servant.detail.avg}}</span>
							</span>
            </div>
            <div class="dynamics_label">
              <span class="dy_text">评价人数</span>
              <span class="label_text">
								<span
                  v-if="servant.detail">&nbsp;&nbsp;&nbsp;&nbsp;{{servant.detail.gradeNum}}</span>
							</span>
            </div>
            <div class="dynamics_label">
              <span class="dy_text">服务数量</span>
              <span class="label_text">
								<span
                  v-if="servant.detail">&nbsp;&nbsp;&nbsp;&nbsp;{{servant.detail.serviceNum}}</span>
							</span>
            </div>
            <div class="dynamics_label">
              <span class="dy_text">注册时间</span>
              <span class="label_text">
								<span v-if="servant.detail.createdTime">&nbsp;&nbsp;&nbsp;&nbsp;{{servant.detail.createdTime}}</span>
							</span>
            </div>
            <div class="dynamics_label">
              <span class="dy_text">最后登录</span>
              <span class="label_text">
								<span v-if="servant.detail.lastTime">&nbsp;&nbsp;&nbsp;&nbsp;{{servant.detail.lastTime}}</span>
							</span>
            </div>
          </div>
          <div class="dynamics_header">
            <span class="dynamics_title">服务资料</span>
          </div>
          <div class="dynamics_contentBox" style="max-height:300px">
            <div class="dynamics_label">
              <span class="dy_text">服务类型</span>
              <span class="label_text">
								<span v-if="servant.detail.tagName">&nbsp;&nbsp;&nbsp;&nbsp;{{servant.detail.tagName}}</span>
							</span>
            </div>
            <!--
                                    <div class="dynamics_label">
                                        <span class="dy_text">服务范围</span>
                                        <span class="label_text">
                                            <span v-if="servant.detail.address">{{servant.detail.createTime}}</span>
                                        </span>
                                    </div>
            -->
            <div class="dynamics_label">
              <span class="dy_text">公司名称</span>
              <span class="label_text">
								<span v-if="servant.detail.companyName">&nbsp;&nbsp;&nbsp;&nbsp;{{servant.detail.companyName}}</span>
							</span>
            </div>
            <div class="dynamics_label">
              <span class="dy_text">职位</span>
              <span class="label_text">
								<span v-if="servant.detail.job">{{servant.detail.job}}</span>
							</span>
            </div>
            <div class="dynamics_label">
              <span class="dy_text">自我介绍</span>
              <span class="label_text">
								<span v-if="servant.detail.referral">&nbsp;&nbsp;&nbsp;&nbsp;{{servant.detail.referral}}</span>
							</span>
            </div>
            <div class="dynamics_imgs">
              <span class="dy_text">图片</span>
              <div class="dynamics_imgBox">
                <div v-if="servant.detail.photo">
                  <div class="show_imgs" v-for="(item,index) in servant.detail.photo"
                       :style="{backgroundImage: 'url('+ item +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                </div>
              </div>
              <div class="clear"></div>
            </div>
          </div>

        </el-card>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  export default {
    name: 'service',
    data () {
      return {
        activeName: 'first',
        servicePage: {
          currentPage: 1,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          total: 100
        },
        servantPage: {
          currentPage: 1,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          total: 100
        },
        showDelete:false,
        showserviceDetail: false,
        serviceDetail: {},
        isIndeterminate: false,
        isCheckedAll: false,
        checked: [],
        serviceSelectKey: {
          type: '',
          name: '',
          time: '',
        },
        serviceSelectScope: {
          cost: [{
            value: '免费',
            label: '免费'
          }, {
            value: '发起人请客',
            label: '发起人请客'
          }, {
            value: 'AA',
            label: 'AA'
          }],
          state: [{
            value: '未发布',
            label: '未发布'
          }, {
            value: '正常',
            label: '正常'
          }, {
            value: '关闭',
            label: '关闭'
          }, {
            value: '结束报名',
            label: '结束报名'
          }, {
            value: '正常结束',
            label: '正常结束'
          }],
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
          }
        },
        data: [],
        communityList: [],
        community: '',
        servant: {
          showCommunity: false,
          showClose: false,
          showOpen: false,
          acceptance: false,
          isOpenType: 1,
          isComment: false,
          currentId: '',
          closeReason: '',

          providerId: '',
          tagIds:[],
          selectKey: {
            tagId: '',
            phone: '',
            name: '',
            time: '',
            timeType: ''
          },
          selectScope: {
            timeType: [{
              value: '1',
              label: '发布时间'
            }, {
              value: '2',
              label: '登录时间'
            }],
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
            }
          },
          isCheckedAll: false,
          isIndeterminate: false,
          showSort: false,
          showDetail: false,
          checked: [],
          data: [],
          detail: {},
          sort: {
            providerId: '',
            sort: '',
          },
        }
      }
    },
    mounted: function () {
      var that = this;

      this.$http.get('http://' + global.URL + '/v1/service/service/list?page=' + that.servicePage.currentPage + '&limit=' + that.servicePage.pageSize).then((res) => {
        //console.log(res);
        if (res.body.code == 200 || res.body.code == 201) {
          console.log(res);
          this.servicePage.total = res.body.total;
          that.data = res.body.list;
          for (let i = 0; i < that.data.length; i++) {
            that.data[i].isChecked = false;
          }
        }
      });

      this.$http.get('http://' + global.URL + '/v1/service/provider/list?page=' + that.servantPage.currentPage + '&limit=' + that.servantPage.pageSize).then((res) => {
        console.log(res);
        if (res.body.code == 200 || res.body.code == 201) {
          this.servantPage.total = res.body.total;
          that.servant.data = res.body.list;
          console.log(that.servant.data);
          for (let i = 0; i < that.servant.data.length; i++) {
            that.servant.data[i].isChecked = false;
          }
        }
      });

      this.$http.get('http://' + global.URL + '/v1/tag/service/list').then((res) => {
        console.log(res);
        if (res.body.code == 200 || res.body.code == 201) {
          res.body.list.forEach((item)=>{
            this.servant.tagIds.push({
              label:item.name,
              value:item.tagId,
            })
          });
        }
      });
      (function init() {
        $('.dynamics_show .el-card__body').css({
          padding: 0
        })
        $('.search_btn').css({
          color: 'red'
        })
        $('.select_inp').css({
          width: '100px'
        })
        $('.el-tabs__header').css({
          background: 'white'
        })
        $('.el-tabs__content').css({
          overflow: 'visible'
        })
      })()
    },
    methods: {
      serviceState(type){
        var state = "";
        switch (type) {
          case 0:
            state = "关闭";
            break;
          case 1:
            state = "正常";
            break;
          case 2:
            state = "申请重启";
            break;
          case 3:
            state = "同意重启";
            break;
          case 4:
            state = "拒绝重启";
            break;
        }
        return state;
      },
      changeState(type){
        var state = "";
        switch (type) {
          case 0:
            state = "开启服务";
            break;
          case 1:
            state = "关闭服务";
            break;
          case 2:
          case 3:
          case 4:
            state = "受理";
            break;
        }
        return state;
      },
      resetserviceData(){
        this.data = [];
        this.checked = [];
        this.showDelete = false;
        this.isIndeterminate = false;
        this.isCheckedAll = false;
        var that = this;
        var parameter = '';

        if (this.serviceSelectKey.time) {
          if (Boolean(this.serviceSelectKey.time[0])) {
            console.log(this.serviceSelectKey.time)
            let sDate = new Date(this.serviceSelectKey.time[0]);
            let sYear = sDate.getFullYear();
            let sMonth = sDate.getMonth() + 1;
            let sDay = sDate.getDate();
            let sHours = sDate.getHours();
            let sMinutes = sDate.getMinutes();
            let sSeconds = sDate.getSeconds();
            var sStr = sYear + '-' + sMonth + '-' + sDay + ' ' + sHours + ':' + sMinutes + ':' + sSeconds;

            let eDate = new Date(this.serviceSelectKey.time[1]);
            let eYear = eDate.getFullYear();
            let eMonth = eDate.getMonth() + 1;
            let eDay = eDate.getDate();
            let eHours = eDate.getHours();
            let eMinutes = eDate.getMinutes();
            let eSeconds = eDate.getSeconds();
            var eStr = eYear + '-' + eMonth + '-' + eDay + ' ' + eHours + ':' + eMinutes + ':' + eSeconds;

            parameter += '&startTime=' + sStr + '&endTime=' + eStr;
          }
        }

        if (this.serviceSelectKey.name) {
          parameter += '&serviceName=' + this.serviceSelectKey.name;
        }
        console.log(parameter)
        this.$http.get('http://' + global.URL + '/v1/service/service/list?page=' + that.servicePage.currentPage + '&limit=' + that.servicePage.pageSize + parameter).then((res) => {
//				console.log(res);
          if(res.body.code == 200 || res.body.code == 201
      )
        {
//					console.log(res);
          this.servicePage.total = res.body.total;
          that.data = res.body.list;
          for (let i = 0; i < that.data.length; i++) {
            that.data[i].isChecked = false;
          }
        }
      })
        ;
      },
      resetservantData(){
        this.data = [];
        this.checked = [];
        this.isIndeterminate = false;
        this.isCheckedAll = false;
        var that = this;
        var parameter = '';

        if (this.servant.selectKey.timeType) {
          if (this.servant.selectKey.time) {
            parameter += '&timeState' + this.servant.selectKey.timeType;
          }
        }

        if (this.servant.selectKey.time) {
          if (Boolean(this.serviceSelectKey.time[0])) {
            console.log(this.serviceSelectKey.time)
            let sDate = new Date(this.serviceSelectKey.time[0]);
            let sYear = sDate.getFullYear();
            let sMonth = sDate.getMonth() + 1;
            let sDay = sDate.getDate();
            let sHours = sDate.getHours();
            let sMinutes = sDate.getMinutes();
            let sSeconds = sDate.getSeconds();
            var sStr = sYear + '-' + sMonth + '-' + sDay + ' ' + sHours + ':' + sMinutes + ':' + sSeconds;

            let eDate = new Date(this.serviceSelectKey.time[1]);
            let eYear = eDate.getFullYear();
            let eMonth = eDate.getMonth() + 1;
            let eDay = eDate.getDate();
            let eHours = eDate.getHours();
            let eMinutes = eDate.getMinutes();
            let eSeconds = eDate.getSeconds();
            var eStr = eYear + '-' + eMonth + '-' + eDay + ' ' + eHours + ':' + eMinutes + ':' + eSeconds;

            parameter += '&startTime=' + sStr + '&endTime=' + eStr;
          }
        }

        if (this.servant.selectKey.tagId) {
          parameter += '&tagId=' + this.servant.selectKey.tagId;
        }

        if (this.servant.selectKey.phone) {
          parameter += '&phoneNum=' + this.servant.selectKey.phone;
        }

        if (this.servant.selectKey.name) {
          parameter += '&name=' + this.servant.selectKey.name;
        }

        console.log(parameter)
        this.$http.get('http://' + global.URL + '/v1/service/provider/list?page=' + that.servantPage.currentPage + '&limit=' + that.servantPage.pageSize + parameter)
          .then((res)=>{
          console.log(res);
          if (res.body.code == 200 || res.body.code == 201) {
            console.log(res);
            this.servantPage.total = res.body.total;
            that.servant.data = res.body.list;
            for (let i = 0; i < that.servant.data.length; i++) {
              that.servant.data[i].isChecked = false;
            }
          }
        }
      );},
      handleSizeChangeservice(val) {
        this.servicePage.pageSize = val;
        this.resetserviceData();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChangeservice(val) {
        this.servicePage.currentPage = val;
        this.resetserviceData();
        console.log(`当前页: ${val}`);
      },
      showservice(o){
        console.log(o)
        this.showserviceDetail = true;
        this.$http.get('http://' + global.URL + '/v1/service/service/' + o).then((res)=>
        {
          console.log(res)
          if (res.body.code == 200) {
            this.serviceDetail = res.body.data;
          } else {
            this.$message('网络错误')
          }
        }
      )
      },
      showServantDetail(o){
        console.log(o)
        this.servant.showDetail = true;
        this.$http.get('http://' + global.URL + '/v1/service/provider/' + o).then((res)=>
        {
          console.log(res)
          if (res.body.code == 200) {
            this.servant.detail = res.body.data;
          } else {
            this.$message('网络错误')
          }
        }
      )
      },
      deleteservice(o){
        this.checked = []
        if (typeof o == 'object' && o.length > 0) {
          this.checked = o.join(",")
          this.showDelete = true
        } else if (typeof o == 'number') {
          this.checked = o
          this.showDelete = true
        }
      },
      cancelDelete(){
        this.resetserviceData();
      },
      confirmDelete(id){
        this.$http.delete('http://' + global.URL + '/v1/service/service?ids=' + id).then((res) => {
          if(res.body.code == 200){
          this.resetserviceData();
          this.$message('删除成功');
        }else{
          this.$message(res.body.message)
        }
        this.resetserviceData();
      })},
      deleteservant(o){
        console.log(o)
        var ids;
        if (typeof o == 'object') {
          ids = o.join(',');
        } else if (typeof o == 'number') {
          ids = o.toString();
        }

        this.$http.delete('http://' + global.URL + '/v1/service?ids=' + ids).then((res) => {
          if(res.body.code == 200)
        {
          this.resetservantData();
          this.$message('删除成功');
        }
      });
        this.resetserviceData();
      },
      handleSizeChangeServant(val){
        this.servantPage.pageSize = val;
        this.resetservantData();
      },
      handleCurrentChangeServant(val){
        this.servantPage.currentPage = val;
        this.resetservantData();
      },
      checkAll(isChecked){
        this.checked = [];
        if (isChecked) {
          console.log('aaa')
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
      checkOne(isChecked, id){
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
        console.log(this.checked)
      },
      checkAllServant(isChecked){
        this.servant.checked = [];
        if (isChecked) {
          for (let i = 0; i < this.servant.data.length; i++) {
            this.servant.data[i].isChecked = true;
            this.servant.checked.push(this.data[i].providerId)
          }
        } else {
          for (let i = 0; i < this.servant.data.length; i++) {
            this.servant.data[i].isChecked = false;
          }
        }
        this.servant.isIndeterminate = false;
      },
      checkOneServant(isChecked, id){
        if (isChecked) {
          this.servant.checked.push(id)
        } else {
          for (let i = 0; i < this.servant.checked.length; i++) {
            if (this.servant.checked[i] == id) {
              this.servant.checked.splice(i, 1)
            }
          }
        }
        if (this.servant.checked.length == this.servant.data.length) {
          this.servant.isIndeterminate = false;
          this.servant.isCheckedAll = true;
        } else if (this.servant.checked.length == 0) {
          this.servant.isIndeterminate = false;
          this.servant.isCheckedAll = false;
        } else {
          this.servant.isIndeterminate = true;
        }
      },
      addCommunity(id){
        this.$http.get('http://' + global.URL + '/v1/group/list?limit=1000').then((res) => {
          console.log(res)
        if (res.body.code == 200) {
          this.servant.showCommunity = true;
          this.servant.providerId = id;
          this.communityList = res.body.list;
          console.log(this.communityList)
        } else {
          this.$message(res.body.message)
        }
      })
      },
      choseCommunity(groupId){
        console.log(groupId);
        this.servant.community = groupId;
      },
      submitCommunity(){
        this.$http.put('http://' + global.URL + '/v1/service/provider/' + this.servant.providerId + '/group/' + this.servant.community).then((res) => {
          console.log(res)
        if (res.body.code == 200) {
          this.$message('操作成功');
          this.servant.showCommunity = false;
          this.resetservantData();
        } else {
          this.$message(res.body.message)
        }
      });
      },
      showSortNow(id){
        this.servant.sort.providerId = id;
        this.servant.showSort = true;
      },
      isOpenTypeChange(label){
        console.log(this.servant.isOpenType);
        if (label === 2) {
          this.servant.isComment = true
        } else {
          this.servant.isComment = false
        }
      },
      changeService(id, type){
        this.servant.currentId = id;
        this.servant.isOpenType = 1;
        this.servant.closeReason = '';
        if (type == 0) {
          this.servant.showOpen = true
        } else if (type == 1) {
          this.servant.showClose = true
        } else {
          this.servant.acceptance = true
        }
      },
      submitCloseReason(){
        var obj = {
          "providerId": this.servant.currentId,
          "remark": this.servant.closeReason,
          "state": "0",
          "userId": JSON.parse(window.sessionStorage.getItem("loginLoucaUser")).userId,
        };
        if (obj.remark.length == '' || obj.remark.length > 50) {
          return this.$message('请输入关闭服务原因，50字以内!');
        }
        this.$http.put('http://' + global.URL + '/v1/service/provider/manage', obj).then((res) => {
          if (res.body.code == 200
      )
        {
          this.$message('操作成功');
          this.servant.showClose = false;
          this.resetservantData();
        }
      else
        {
          this.$message(res.body.message)
        }
      })
      },
      submitOpen(){
        var obj = {
          "providerId": this.servant.currentId,
          "state": "1",
          "userId": JSON.parse(window.sessionStorage.getItem("loginLoucaUser")).userId,
        };
        console.log(obj);
        this.$http.put('http://' + global.URL + '/v1/service/provider/manage', obj).then((res) => {
          console.log(res)
        if (res.body.code == 200) {
          this.$message('操作成功');
          this.servant.showOpen = false;
          this.resetservantData();
        } else {
          this.$message(res.body.message)
        }
      })
      },
      submitAcceptance(type){
        if (type == 1) {
          var obj = {
            "providerId": this.servant.currentId,
            "state": "3",
            "userId": JSON.parse(window.sessionStorage.getItem("loginLoucaUser")).userId,
          };
          this.$http.put('http://' + global.URL + '/v1/service/provider/manage', obj).then((res) => {
            console.log(res)
          if (res.body.code == 200) {
            this.$message('操作成功');
            this.servant.acceptance = false;
            this.resetservantData();
          } else {
            this.$message(res.body.message)
          }
        })
        } else {
          var obj = {
            "providerId": this.servant.currentId,
            "state": "4",
            "remark": this.servant.closeReason,
            "userId": JSON.parse(window.sessionStorage.getItem("loginLoucaUser")).userId,
          };
          if (obj.remark.length == '' || obj.remark.length > 50) {
            return this.$message('请输入拒绝原因，50字以内!');
          }
          this.$http.put('http://' + global.URL + '/v1/service/provider/manage', obj).then((res) => {
            console.log(res)
          if (res.body.code == 200) {
            this.$message('操作成功');
            this.servant.acceptance = false;
            this.resetservantData();
          } else {
            this.$message(res.body.message)
          }
        })
        }
      },
      sortNow(){
        this.$http.put('http://' + global.URL + '/v1/service', this.servant.sort).then((res) =>
        {
          console.log(res)
        if (res.body.code == 200) {
          this.$message('操作成功');
          this.servant.showSort = false;
          this.resetservantData();
        } else {
          this.$message(res.body.message)
        }
      })
      },
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .title {
    font-size: 20px;
  }

  .search_box {
    padding: 12px 36px;
    text-align: right;
  }

  .organiser {
    width: 200px;
  }

  /*
      Table
  */
  .table_box {
    padding: 0 35px;
  }

  .table {
    width: 100%;
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

  .page_group {
    position: absolute;
    top: 30px;
    width: 940px;
    text-align: center;
  }

  .table_control .page_group li {
    display: inline-block;
    padding: 0 12px;
    cursor: pointer;
  }

  .table_control .page_group li:hover {
    color: rgb(84, 184, 183);
  }

  .table_control .page_group .omit:hover {
    color: #000;
  }

  .page_group .control_li {
    color: rgb(84, 184, 183);
  }

  .table_control .total {
    position: absolute;
    right: 100px;
    top: 30px;
  }

  .table_control .total .total_block {
    padding: 0 10px;
  }

  .table_control .go_page {
    text-align: center;
    width: 60px;
  }

  .table_control .total .confirm {
    color: rgb(84, 184, 183);
  }

  .table {
    border-collapse: collapse;
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
    padding: 0 2px;
    color: #20a0ff;
  }

  /*
      服务详情页
  */
  .dynamics_show {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 520px;
    font-size: 18px;
    color: rgba(0, 0, 0, 80%);
    box-shadow: -10px 10px 5px #ccc;
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

  .detail_list {
    height: 60px;
    position: relative;
  }

  .dynamics_label .dy_text {
    bottom: 21px;
  }

  .detail_list .dy_text {
    bottom: 21px;
  }

  .label_text {
    position: absolute;
    bottom: 21px;
    left: 120px;
  }

  .dynamics_label .label_time {
    color: rgb(167, 167, 167);
    position: absolute;
    bottom: 21px;
    right: 56px;
  }

  .dynamics_content {
    width: 100%;
    height: auto;
    min-height: 40px;
    padding: 12px 0;
    background: rgb(245, 245, 245);
    position: relative;
    border-bottom: 1px solid #ccc;
  }

  .dynamics_content .dy_text {
    top: 20px;
  }

  .dynamics_content p {
    position: relative;
    width: 349px;
    margin-right: 46px;
    line-height: 40px;
    float: right;
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
    width: 105px;
    height: 105px;
    background: red;
  }

  .dynamics_contentBox {
    width: 100%;
    max-height: 470px;
    overflow: auto;
  }

  .dynamics_contentBox::-webkit-scrollbar {
    width: 10px;
    height: 4px;
    position: absolute;
    background-color: rgb(248, 248, 250);
    background: #ddd;
  }

  .dynamics_contentBox::-webkit-scrollbar-track {
    background: #ddd;
  }

  /*定义滑块 内阴影+圆角*/
  .dynamics_contentBox::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #ccc;
  }

  .dynamics_contentBox::-webkit-scrollbar-thumb:hover {
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: rgba(7, 170, 247, 1);
  }

  .dynamics_num {
    height: 80px;
    color: rgba(167, 167, 167, 1);
    position: relative;
  }

  .dynamics_num .praise_text {
    position: absolute;
    left: 50px;
    top: 28px;
  }

  .dynamics_num .comment_text {
    position: absolute;
    left: 275px;
    top: 28px;
  }

  .dynamics_num .praise_text .praise_num, .dynamics_num .comment_text .comment_num {
    margin-left: 28px;
    color: #000;
  }
</style>


























