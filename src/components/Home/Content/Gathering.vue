<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <!--      全部聚会      -->
      <el-tab-pane label="全部聚会" name="first">
        <div class="search_box">
          <!--
                              <el-select v-model="partySelectKey.type" clearable placeholder="聚会类型">
                                  <el-option
                                      v-for="item in partySelectScope.type"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                              </el-select>
          -->
          <el-select v-model="partySelectKey.type" clearable placeholder="请选择聚会类型"
                     class="organiser">
            <el-option
              v-for="item in partySelectType"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!--<el-input class="organiser" v-model="partySelectKey.type"-->
          <!--placeholder="请输入聚会类型 id"></el-input>-->
          <el-select v-model="partySelectKey.cost" clearable placeholder="费用类型">
            <el-option
              v-for="item in partySelectScope.cost"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="partySelectKey.state" clearable placeholder="聚会状态">
            <el-option
              v-for="item in partySelectScope.state"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="partySelectKey.createTime"
            type="datetimerange"
            align="right"
            placeholder="发布时间"
            :picker-options="partySelectScope.pickerOptions">
          </el-date-picker>
          <el-select
            v-model="partySelectKey.organiser"
            filterable
            remote
            clearable
            placeholder="请输入发起人"
            :remote-method="remoteMethod"
            :loading="loading"
            style="width: 160px"
          >
            <el-option
              v-for="item in partySelectScope.organisers"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!--<el-input class="organiser" v-model="partySelectKey.organiser"-->
          <!--placeholder="发起人 id"></el-input>-->
          <el-button type="primary" @click="resetPartyData">搜索</el-button>
        </div>

        <div class="table_handle">
          <el-button type="danger" @click="deleteParty(checked)"
                     v-if="hasPrivileges('partying_manage')">删除
          </el-button>
          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="exportExcel('party')">导出表格
          </el-button>
        </div>
        <el-dialog title="置顶聚会" v-model="setTop.isShow" size="tiny">
          <el-form ref="form" :model="setTop" label-width="80px">
            <el-form-item label="置顶时长:">
              <el-select v-model="setTop.selected" clearable placeholder="选择时长">
                <el-option
                  v-for="item in setTop.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="setTop.isShow = false">取 消</el-button>
                        <el-button type="primary" @click="sureSetTop">确 定</el-button>
                    </span>
        </el-dialog>
        <!--    聚会列表    -->
        <div class="table_box">
          <table class="table" id="party">
            <thead>
            <tr>
              <th>
                <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll"
                             @change="checkAll($event.target.checked)"> ID
                </el-checkbox>
              </th>
              <th>类型</th>
              <th>发起人</th>
              <th>发布时间</th>
              <th>聚会时间</th>
              <th>聚会地点</th>
              <th>费用</th>
              <th>状态</th>
              <th>报名人数</th>
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
              <td>{{item.type}}</td>
              <td>{{item.issuer.name}}</td>
              <td>{{item.time.created}}</td>
              <td>{{item.time.party}}</td>
              <td>{{item.place}}</td>
              <td>{{item.expenses}}</td>
              <td>{{item.state}}</td>
              <td>{{item.applicant.num}}</td>
              <td class="operation">
                <a href="javascript:void(0)" @click="showParty(item.id)">查看</a>
                <a href="javascript:void(0)" @click="deleteParty(item.id)"
                   v-if="hasPrivileges('partying_manage')">删除</a>
                <a href="javascript:void(0)" @click="setTopFun(item)"
                   v-if="hasPrivileges('partying_manage')">{{item.stick ? "取消置顶" : "置顶"}}</a>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="table_control">
            <el-pagination
              @size-change="handleSizeChangeParty"
              @current-change="handleCurrentChangeParty"
              :current-page="partyPage.currentPage"
              :page-sizes="partyPage.pageSizes"
              :page-size="partyPage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="partyPage.total">
            </el-pagination>
          </div>
        </div>
        <delete v-if="showDelete" :checked="checked" :cancel="cancelDelete"
                :confirm="confirmDelete"></delete>
        <!--       详情页         -->
        <el-card class="dynamics_show" v-show="showPartyDetail">
          <div class="dynamics_header">
            <span class="dynamics_title">用户聚会内容</span>
            <i class="el-icon-close" @click="showPartyDetail=false"></i>
          </div>
          <div class="dynamics_user">
            <span class="dy_text">用户</span>
            <span class="username">
                            <span v-if="partyDetail.author">{{partyDetail.author.name}}</span>
                        </span>
            <div class="userhead_box">
              <div v-if="partyDetail.author" class="userhead_img"
                   :style="{backgroundImage: 'url('+ partyDetail.author.headPic +')',backgroundSize:'cover'}"></div>
            </div>
          </div>
          <div class="dynamics_label">
            <span class="dy_text">类型</span>
            <span class="label_text">
                            <span v-if="partyDetail.keyword">{{partyDetail.keyword}}</span>
                        </span>
            <span class="label_time">发布时间：<span class="time_text">{{partyDetail.createTime}}</span></span>
          </div>
          <div class="dynamics_label">
            <span class="dy_text">地点</span>
            <span class="label_text">
                            <span v-if="partyDetail.address">{{partyDetail.address}}</span>
                        </span>
          </div>
          <div class="dynamics_label">
            <span class="dy_text">费用</span>
            <span class="label_text">
                            <span v-if="partyDetail.cost">{{partyDetail.cost}}</span>
                        </span>
            <span class="label_time">聚会时间：<span
              class="time_text">{{partyDetail.partyTime}}</span></span>
          </div>
          <div class="dynamics_contentBox">
            <div class="dynamics_content">
              <span class="dy_text">内容</span>
              <p v-if="partyDetail.content">{{partyDetail.content}}</p>
              <div class="clear"></div>
            </div>
            <div class="detail_list"
                 style="background:rgb(245,245,245);border-bottom:1px solid #ccc">
              <span class="dy_text">口号</span>
              <span class="label_text">
                                <span v-if="partyDetail.slogan">{{partyDetail.slogan}}</span>
                            </span>
            </div>
            <div class="dynamics_imgs">
              <span class="dy_text">图片</span>
              <div class="dynamics_imgBox">
                <div v-if="partyDetail.photo">
                  <div class="show_imgs" v-for="(item,index) in partyDetail.photo"
                       :style="{backgroundImage: 'url('+ item +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                </div>
              </div>
              <div class="clear"></div>
            </div>
          </div>

          <div class="dynamics_num">
            <span class="praise_text">评论数量<span
              class="praise_num">{{partyDetail.commentNumber}}</span></span>
            <span class="comment_text">报名数量<span
              class="comment_num">{{partyDetail.registerNumber}}</span></span>
          </div>
        </el-card>
      </el-tab-pane>

      <!--     聚会类型       -->
      <el-tab-pane label="聚会类型" name="second">
        <div class="search_box">
          <el-input class="organiser" v-model="partySelectKey.organiser"
                    placeholder="搜素聚会类型"></el-input>
          <el-button type="primary">搜索</el-button>
        </div>
        <el-dialog title="提示" v-model="createTypeShow" size="tiny">
          <p class="create_text">输入聚会类型</p>
          <div class="create_input_box">
            <el-input v-model="createType.name"></el-input>
          </div>
          <p class="create_text">排序（数字越大排序越靠前） </p>
          <el-input-number v-model="createType.num" :min="1" :max="10"></el-input-number>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="createTypeShow = false">取 消</el-button>
                        <el-button type="primary" @click="createTypeShow = false">确 定</el-button>
                    </span>
        </el-dialog>

        <div class="table_handle">
          <el-button type="primary" @click="deletePartyType(partyType.checked)"
                     v-if="hasPrivileges('partying_manage')">删除
          </el-button>
          <el-button type="" @click="createTypeShow = true" style="float:right"
                     v-if="hasPrivileges('partying_add')">新建聚会类型
          </el-button>
        </div>
        <delete v-if="partyType.showDelete" :checked="partyType.checked" :cancel="cancelDeleteType"
                :confirm="confirmDelete"></delete>
        <!--                    类型列表    -->
        <div class="table_box">
          <table class="table">
            <thead>
            <tr>
              <th>
                <el-checkbox :indeterminate="partyType.isIndeterminate"
                             v-model="partyType.isCheckedAll"
                             @change="checkAllType($event.target.checked)"> ID
                </el-checkbox>
              </th>
              <th>聚会类型</th>
              <th>关联聚会数量</th>
              <th>排序</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in partyType.data">
              <td>
                <el-checkbox
                  v-model="partyType.data[index].isChecked"
                  class="check_btn" @change="checkOneType($event.target.checked,item.id)">
                  {{item.id}}
                </el-checkbox>
              </td>
              <td>{{ item.type }}</td>
              <td>{{ item.num }}</td>
              <td>{{ item.range }}</td>
              <td class="operation">
                <a href="javascript:void(0)" @click="sortParty(item.id)"
                   v-if="hasPrivileges('partying_manage')">排序</a>
                <a href="javascript:void(0)" @click="deletePartyType(item.id)"
                   v-if="hasPrivileges('partying_manage')">删除</a>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="table_control">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="typePage.currentPage"
              :page-sizes="typePage.pageSizes"
              :page-size="typePage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="typePage.total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import ElTabPane from '../../../../node_modules/element-ui/packages/tabs/src/tab-pane';
  export default {
    components: { ElTabPane },
    name: 'gathering',
    data () {
      return {
        loading: false,
        activeName: 'first',
        partyPage: {
          currentPage: 1,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          total: 100
        },
        typePage: {
          currentPage: 1,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          total: 100
        },
        createTypeShow: false,
        createType: {
          name: '',
          num: '',
        },
        setTop: {
          isShow: false,
          selected: 3,
          id: "",
          options: [{
            value: 1,
            label: "1天",
          }, {
            value: 2,
            label: "2天",
          }, {
            value: 3,
            label: "3天",
          }, {
            value: 4,
            label: "4天",
          }, {
            value: 5,
            label: "5天",
          }, {
            value: 6,
            label: "6天",
          },{
            value: 7,
            label: "7天",
          }, {
            value: 8,
            label: "8天",
          }, {
            value: 9,
            label: "9天",
          },{
            value: 10,
            label: "10天",
          }, {
            value: 15,
            label: "15天",
          },],
        },
        showDelete: false,
        showPartyDetail: false,
        partyDetail: {},
        isIndeterminate: false,
        isCheckedAll: false,
        checked: [],
        partySelectType: [],
        partySelectKey: {
          type: '',
          cost: '',
          state: '',
          createTime: '',
          organiser: '',
        },
        partySelectScope: {
          organisers: [],
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
        partyType: {
          showDelete: false,
          isCheckedAll: false,
          isIndeterminate: false,
          checked: [],
          data: []
        }
      }
    },
    mounted: function () {
      var that = this;
      this.$http.get('http://' + global.URL + '/v1/party/list?page=' + that.partyPage.currentPage + '&limit=' + that.partyPage.pageSize).then((response) => {
        var arr = response.body.list || [];
        that.partyPage.total = response.body.total;
        for (let i = 0, length = arr.length; i < length; i++) {
          let o = {
            id: arr[i].partyId,
            type: arr[i].tag.tagWord,
            issuer: {
              name: arr[i].author ? arr[i].author.name : ''
            },
            time: {
              created: arr[i].createTime,
              party: arr[i].partyTime
            },
            place: arr[i].address,
            expenses: arr[i].cost,
            state: arr[i].state,
            stick: arr[i].stick,
            stickId:arr[i].stickId,
            applicant: {
              num: arr[i].registerNumber,
            },
            isChecked: false
          }
          that.data.push(o)
        }

      });

      this.$http.get('http://' + global.URL + '/v1/party/tag/list?page=' + that.typePage.currentPage + '&limit=' + that.typePage.pageSize).then((response) => {
        var arr = response.body.list;
        that.typePage.total = response.body.total;
        for (let i = 0, length = arr.length; i < length; i++) {
          let o = {
            id: arr[i].tagId,
            type: arr[i].name,
            num: arr[i].usages,
            range: arr[i].sort,
            isChecked: false
          }
          that.partyType.data.push(o);
          this.partySelectType.push({
            label: o.type,
            value: o.id,
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

      formatTime(time){
        function add0(val) {
          if (val < 10) {
            return "0" + val;
          }
          return val;
        }

        const eDate = time;
        const eYear = eDate.getFullYear();
        const eMonth = eDate.getMonth() + 1;
        const eDay = eDate.getDate();
        const eHours = eDate.getHours();
        const eMinutes = eDate.getMinutes();
        const eSeconds = eDate.getSeconds();
        const eStr = eYear + '-' + add0(eMonth) + '-' + add0(eDay) + ' ' + add0(eHours) + ':' + add0(eMinutes) + ':' + add0(eSeconds);
        return eStr;
      },
      setTopFun(item){
        if (item.stick) {
          this.$http.delete('http://' + global.URL + '/v1/party/cancel/stick/' + item.stickId).then(res => {
            if (res.body.code == 200 || res.body.code == 201) {
              this.$message('已取消置顶');
              this.resetPartyData();
            }
          });
        } else {
          this.setTop.isShow = true;
          this.setTop.id = item.id;
          this.setTop.selected = 3;
        }
      },
      sureSetTop(){
        this.setTop.isShow = false;
        const time = new Date().getTime() + this.setTop.selected * 24 * 3600 * 1000;
        const obj = {
          end: this.formatTime(new Date(time)),
          partyingId: this.setTop.id,
          sort: "50",
        };
        this.$http.put('http://' + global.URL + '/v1/party/stick', obj).then(res => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message('置顶成功');
            this.resetPartyData();
          }
        });
      },
      remoteMethod(name){
        this.partySelectScope.organisers = [];
        if (name !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$http.get('http://' + global.URL + '/v1/user/find?name=' + name).then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                let arr = res.body.list || [];
                arr.forEach((item) => {
                  this.partySelectScope.organisers.push({
                    value: item.userId,
                    label: item.name,
                  })
                });
              }
            })
          }, 500);
        }
      },
      resetTypeData(){
        this.partyType.data = [];
        this.partyType.checked = [];
        this.partyType.showDeconste = false;
        this.partyType.isIndeterminate = false;
        this.partyType.isCheckedAll = false;
        var that = this;

        this.$http.get('http://' + global.URL + '/v1/party/tag/list?page=' + that.typePage.currentPage + '&limit=' + that.typePage.pageSize).then((response) => {
          console.log(response)
          var arr = response.body.list;
          that.typePage.total = response.body.total;
          for (let i = 0, length = arr.length; i < length; i++) {
            const o = {
              id: arr[i].tagId,
              type: arr[i].name,
              num: arr[i].usages,
              range: arr[i].sort,
              isChecked: false
            }
            that.partyType.data.push(o)
          }

        });
      },
      resetPartyData(){
        this.data = [];
        this.checked = [];
        this.isIndeterminate = false;
        this.isCheckedAll = false;
        this.showDelete = false;
        var that = this;
        var parameter = '';
        if (this.partySelectKey.type) {
          parameter += '&tagId=' + this.partySelectKey.type;
        }
        if (this.partySelectKey.cost) {
          let costArr = ['免费', '发起人请客', 'AA'], id;
          for (let i = 0; i < costArr.length; i++) {
            if (this.partySelectKey.cost == costArr[i]) {
              id = i;
              break;
            }
          }
          parameter += '&cost=' + id;
        }
        if (this.partySelectKey.state) {
          let stateArr = ['未发布', '正常', '关闭', '结束报名', '正常结束'], id;
          for (let i = 0; i < stateArr.length; i++) {
            if (this.partySelectKey.state == stateArr[i]) {
              id = i;
              break;
            }
          }
          parameter += '&state=' + id;
        }
        if (this.partySelectKey.createTime) {
          if (Boolean(this.partySelectKey.createTime[0])) {
            console.log(this.partySelectKey.createTime)
            let sDate = new Date(this.partySelectKey.createTime[0]);
            let sYear = sDate.getFullYear();
            let sMonth = sDate.getMonth() + 1;
            let sDay = sDate.getDate();
            let sHours = sDate.getHours();
            let sMinutes = sDate.getMinutes();
            let sSeconds = sDate.getSeconds();
            var sStr = sYear + '-' + sMonth + '-' + sDay + ' ' + sHours + ':' + sMinutes + ':' + sSeconds;

            let eDate = new Date(this.partySelectKey.createTime[1]);
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
        if (this.partySelectKey.organiser) {
          parameter += '&userId=' + this.partySelectKey.organiser
        }

        this.$http.get('http://' + global.URL + '/v1/party/list?page=' + that.partyPage.currentPage + '&limit=' + that.partyPage.pageSize + parameter).then((response) => {
          if (!response.body.list) {
            return false;
          }
          var arr = response.body.list;
          that.partyPage.total = response.body.total

          for (let i = 0, length = arr.length; i < length; i++) {
            let o = {
              id: arr[i].partyId,
              type: arr[i].tag.tagWord,
              issuer: {
                name: arr[i].author ? arr[i].author.name : ''
              },
              time: {
                created: arr[i].createTime,
                party: arr[i].partyTime
              },
              place: arr[i].address,
              expenses: arr[i].cost,
              state: arr[i].state,
              stick: arr[i].stick,
              stickId:arr[i].stickId,
              applicant: {
                num: arr[i].registerNumber,
              },
              isChecked: false
            }
            that.data.push(o);
          }
        });
      },
      handleSizeChangeParty(val) {
        this.partyPage.pageSize = val;
        this.resetPartyData();
      },
      handleCurrentChangeParty(val) {
        this.partyPage.currentPage = val;
        this.resetPartyData();
      },
      showParty(o){
        this.showPartyDetail = true;
        this.$http.get('http://' + global.URL + '/v1/party/detail/' + o).then((res) => {
          console.log(res)
          if (res.body.code == 200) {
            this.partyDetail = res.body.data;
          } else {
            this.$message('网络错误')
          }
        })
      },
      sortParty(id){

      },
      deletePartyType(o){
        this.partyType.checked = [];
        if (typeof o == 'object' && o.length > 0) {
          this.partyType.checked = o.join(",")
          this.partyType.showDelete = true
        } else if (typeof o == 'number') {
          this.partyType.checked = o
          this.partyType.showDelete = true
        }
      },
      deleteParty(o){
        this.checked = []
        if (typeof o == 'object' && o.length > 0) {
          this.checked = o.join(",")
          this.showDelete = true
        } else if (typeof o == 'number') {
          this.checked = o
          this.showDelete = true
        }
      },
      cancelDeleteType(){
        this.resetTypeData();
      },
      cancelDelete(){
        this.resetPartyData();
      },
      confirmDelete(id){
        this.$http.delete('http://' + global.URL + '/v1/party?ids=' + id).then((res) => {
          if (res.body.code == 200) {
            this.resetPartyData();
            this.$message('删除成功');
          }
        })
      },
      handleSizeChange(val) {
        this.typePage.pageSize = val;
        this.resetTypeData();
      },
      handleCurrentChange(val) {
        this.typePage.currentPage = val;
        this.resetTypeData();
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
      checkAllType(isChecked){
        this.partyType.checked = [];
        if (isChecked) {
          for (let i = 0; i < this.partyType.data.length; i++) {
            this.partyType.data[i].isChecked = true;
            this.partyType.checked.push(this.data[i].id)
          }
        } else {
          for (let i = 0; i < this.partyType.data.length; i++) {
            this.partyType.data[i].isChecked = false;
          }
        }
        this.partyType.isIndeterminate = false;
      },
      checkOneType(isChecked, id){
        if (isChecked) {
          this.partyType.checked.push(id)
        } else {
          for (let i = 0; i < this.partyType.checked.length; i++) {
            if (this.partyType.checked[i] == id) {
              this.partyType.checked.splice(i, 1)
            }
          }
        }
        if (this.partyType.checked.length == this.partyType.data.length) {
          this.partyType.isIndeterminate = false;
          this.partyType.isCheckedAll = true;
        } else if (this.partyType.checked.length == 0) {
          this.partyType.isIndeterminate = false;
          this.partyType.isCheckedAll = false;
        } else {
          this.partyType.isIndeterminate = true;
        }
      }
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
      聚会详情页
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


























