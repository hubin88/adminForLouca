<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <!--      搜索      -->
      <el-tab-pane label="全部公告" name="全部公告">
        <div class="search_box">
          <el-select v-model="selectKey.state" clearable placeholder="选择发布状态">
            <el-option
              v-for="item in selectScope.state"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" @click="resetData">搜索</el-button>
        </div>

        <div class="table_handle">
          <el-button type="danger" @click="changeState(checked,'7')"
                     v-if="hasPrivileges('announce_manage')">删除
          </el-button>
          <el-button type="primary" @click="changeState(checked,'1')"
                     v-if="hasPrivileges('announce_manage')">上线
          </el-button>
          <el-button type="primary" @click="changeState(checked,'0')"
                     v-if="hasPrivileges('announce_manage')">下线
          </el-button>
          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="exportExcel('announcement')">导出表格
          </el-button>
        </div>

        <!--    列表    -->
        <div class="table_box">
          <table class="table" id="announcement">
            <thead>
            <tr>
              <th>
                <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll"
                             @change="checkAll($event.target.checked)"> ID
                </el-checkbox>
              </th>
              <th>公告</th>
              <th>目标用户</th>
              <th>排序</th>
              <th>状态</th>
              <th>发布时间</th>
              <th>过期时间</th>
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
              <td style="max-width:300px;">{{item.content}}</td>
              <td>{{item.target}}</td>
              <td>{{item.sort}}</td>
              <td>{{item.state}}</td>
              <td>{{item.createTime}}</td>
              <td>{{item.overdueTime}}</td>
              <td class="operation">
                <a href="javascript:void(0)" @click="showDetailNow(item.id)">查看</a>
                <a href="javascript:void(0)" @click="showEditNow(item.id)"
                   v-if="hasPrivileges('announce_edit')">编辑</a>
                <a href="javascript:void(0)" @click="changeState(item.id,'0')"
                   v-if="hasPrivileges('announce_manage')">下线</a>
                <a href="javascript:void(0)" @click="changeState(item.id,'1')"
                   v-if="hasPrivileges('announce_manage')">上线</a>
                <a href="javascript:void(0)" @click="changeState(item.id,'7')"
                   v-if="hasPrivileges('announce_manage')">删除</a>
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
        <delete v-if="showDelete" :checked="checked" :cancel="cancelDelete"
                :confirm="confirmDelete"></delete>
        <!--       详情页         -->
        <el-card class="dynamics_show" v-show="showDetail">
          <div class="dynamics_header">
            <span class="dynamics_title">公告详情</span>
            <i class="el-icon-close" @click="showDetail=false"></i>
          </div>
          <div class="dynamics_user">
            <span class="dy_text">发布人</span>
            <span class="username">
                            <span
                              v-if="announceDetail.publisher">{{announceDetail.publisher.name}}</span>
                        </span>
            <div class="userhead_box">
              <div v-if="announceDetail.publisher" class="userhead_img"
                   :style="{backgroundImage: 'url('+ announceDetail.publisher.headPic +')',backgroundSize:'cover'}"></div>
            </div>
          </div>
          <div class="dynamics_label">
            <span class="dy_text">发布时间</span>
            <span class="label_text">
                            <span v-if="announceDetail.sendTime">{{announceDetail.sendTime}}</span>
                        </span>
          </div>
          <div class="dynamics_label">
            <span class="dy_text">过期时间</span>
            <span class="label_text">
                            <span
                              v-if="announceDetail.expiredTime">{{announceDetail.expiredTime}}</span>
                        </span>
          </div>
          <div class="dynamics_label">
            <span class="dy_text">目标用户</span>
            <span class="label_text">
                            <span>{{announceDetail.platform ? '全平台' : '指定社群'}}</span>
                        </span>
          </div>
          <div class="dynamics_contentBox">
            <div class="dynamics_content">
              <span class="dy_text">内容</span>
              <p v-if="announceDetail.content">{{announceDetail.content}}</p>
              <div class="clear"></div>
            </div>
            <div class="dynamics_imgs">
              <span class="dy_text">图片</span>
              <div class="dynamics_imgBox">
                <div v-if="announceDetail.photo">
                  <div class="show_imgs" v-for="(item,index) in announceDetail.photo"
                       :style="{backgroundImage: 'url('+ item +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                </div>
              </div>
              <div class="clear"></div>
            </div>
          </div>

          <div class="dynamics_num">
            <span class="praise_text">点赞数量<span
              class="praise_num">{{announceDetail.likedNum}}</span></span>
            <span class="comment_text">评论数量<span
              class="comment_num">{{announceDetail.commentNum}}</span></span>
          </div>
        </el-card>

        <!--        编辑公告        -->
        <el-dialog title="提示" v-model="showEdit">
          <el-form :model="issue" :label-width="formLabelWidth">
            <el-form-item class="edit_label" label="内容">
              <el-input v-model="edit.content" type="textarea" auto-complete="off"
                        :rows="4"></el-input>
            </el-form-item>
            <el-form-item class="edit_label" label="图片">
              <my-unload mId="editAnnounce" :onSuccess="successEditUnload" :action="action"
                         :onDelete="deleteEditUnload" :img="edit.img"></my-unload>
            </el-form-item>
            <el-form-item class="edit_label" label="URL"
                          style="position: relative">
              <el-tooltip class="item" effect="dark" content="目标URL,限http:// https:// louca://"
                          placement="right" style="position: absolute;left:-60px;top: 11px;">
                <i class="el-icon-information"></i>
              </el-tooltip>
              <el-input v-model="edit.url"></el-input>
            </el-form-item>
            <el-form-item class="edit_label" label="全商圈">
              <el-switch
                v-model="edit.all"
                on-text=""
                off-text="">
              </el-switch>
            </el-form-item>
            <el-form-item class="edit_label" label="商圈"
                          v-show="edit.all==false">
              <el-select v-model="edit.regionId" multiple placeholder="请选择商圈" style="width: 100%">
                <el-option
                  v-for="item in selectScope.group"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="edit_label" label="排序">
              <el-input-number v-model="edit.sort" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item class="edit_label" label="时间">
              <el-date-picker
                v-model="edit.time"
                type="datetimerange"
                placeholder="选择时间范围"
                align="right">
              </el-date-picker>
            </el-form-item>

          </el-form>

          <span slot="footer" class="dialog-footer">
                    <el-button @click="showEdit = false">取 消</el-button>
                    <el-button type="primary" @click="editNow">确 定</el-button>
                    </span>
        </el-dialog>

      </el-tab-pane>

      <el-tab-pane label="创建公告" name="创建公告" v-if="hasPrivileges('announce_add')">
        <div class="block">
          <div class="list_box">
            <div class="issue_list">内容</div>
            <el-input
              style="width:500px"
              class="issue_content"
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="issue.content">
            </el-input>
          </div>
          <div class="list_box">
            <div class="issue_list">图片</div>
            <div class="img_list">
              <my-unload mId="issueAnnounce" :onSuccess="successUnload" :action="action"
                         :onDelete="deleteUnload" :img="issue.img"></my-unload>
            </div>
          </div>
          <div class="list_box">
            <div class="issue_list">
              <span>URL</span>
              <el-tooltip class="item" effect="dark" content="公告外链URL,限http:// https:// louca://"
                          placement="right">
                <i class="icon el-icon-information"></i>
              </el-tooltip>
            </div>
            <div class="issue_url" style="width:400px">
              <el-input v-model="issue.url" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="list_box">
            <div class="issue_list">全平台</div>
            <div class="issue_url" style="width:400px">
              <el-switch
                v-model="issue.all"
                on-text=""
                off-text="">
              </el-switch>
            </div>
          </div>
          <div class="list_box" v-show="issue.all == false">
            <div class="issue_list">目标商圈</div>
            <div class="issue_url" style="width:500px">
              <el-select v-model="issue.regionId" multiple placeholder="请选择商圈" style="width: 100%">
                <el-option
                  v-for="item in selectScope.group"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="list_box">
            <div class="issue_list">时间</div>
            <el-date-picker
              v-model="issue.time"
              type="datetimerange"
              placeholder="选择时间范围"
              align="right">
            </el-date-picker>
          </div>
          <div class="list_box">
            <div class="issue_list"></div>
            <el-button type="primary" @click="issueAnnounce">发布</el-button>
          </div>
        </div>

      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  export default {
    name: 'Annoucement',
    data () {
      return {
        formLabelWidth: '60px',
        showDetail: false,
        showEdit: false,
        announceDetail: {},
        activeName: '全部公告',
        page: {
          currentPage: 1,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          total: 100
        },
        showDelete: false,
        isIndeterminate: false,
        isCheckedAll: false,
        checked: [],
        selectKey: {
          createTime: '',
          group: '',
          state: '',
          content: '',
        },
        selectScope: {
          group: [],
          state: [{
            value: '下线',
            label: '下线'
          }, {
            value: '上线',
            label: '上线'
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
        issue: {
          content: '',
          img: [],
          label: '',
          url: '',
          regionId: '',
          sort: '',
          time: '',
          all: true,
        },
        edit: {
          id: '',
          content: '',
          img: [],
          label: '',
          url: '',
          regionId: '',
          all: true,
          sort: '',
          time: '',
        },
        action: '',
      }
    },
    mounted: function () {
      this.action = 'http://' + global.URL + '/v1/file/upload?kind=1'
      var that = this;
      this.$http.get('http://' + global.URL + '/v1/announce/list?page=' + that.page.currentPage + '&limit=' + that.page.pageSize).then((response) => {
        var arr = response.body.list;
        var YN = ['下线', '上线', 2, 3, 4, 5, 6, '删除'];
        that.page.total = response.body.total?response.body.total:that.page.total;
        for (let i = 0, length = arr.length; i < length; i++) {
          let areaStr = '商圈'
          if (arr[i].scope.all) {
            areaStr = '全部商圈'
          } else {
            let kArr = [];
            for (let k = 0; k < arr[i].scope.region.length; k++) {
              kArr.push(arr[i].scope.region[k].name);
            }
            areaStr = kArr.join(' , ');
          }

          let o = {
            id: arr[i].announceId,
            content: arr[i].content,
            target: areaStr,
            sort: arr[i].sort,
            state: YN[arr[i].state],
            createTime: arr[i].sendTime,
            overdueTime: arr[i].expiredTime,
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
            };
            this.selectScope.group.push(o);
          }
        }else{
          this.$message.error(res.body.message);
        }
      });
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
      resetData(){
        this.data = [];
        this.checked = [];
        this.isIndeterminate = false;
        this.isCheckedAll = false;
        this.showDelete = false;
        var that = this;
        var parameter = '';
        if (this.selectKey.group) {
          parameter += '&group=' + this.selectKey.group;
        }
        if (this.selectKey.state) {
          let str;
          if (this.selectKey.state == '下线') {
            str = '0';
          } else if (this.selectKey.state == '上线') {
            str = '1';
          }
          parameter += '&state=' + str;
        }
        if (this.selectKey.createTime) {
          if (Boolean(this.selectKey.createTime[0])) {
            console.log(this.selectKey.createTime)
            let sDate = new Date(this.selectKey.createTime[0]);
            let sYear = sDate.getFullYear();
            let sMonth = sDate.getMonth() + 1;
            let sDay = sDate.getDate();
            let sHours = sDate.getHours();
            let sMinutes = sDate.getMinutes();
            let sSeconds = sDate.getSeconds();
            var sStr = sYear + '-' + sMonth + '-' + sDay + ' ' + sHours + ':' + sMinutes + ':' + sSeconds;

            let eDate = new Date(this.selectKey.createTime[1]);
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
        this.$http.get('http://' + global.URL + '/v1/announce/list?page=' + that.page.currentPage + '&limit=' + that.page.pageSize + parameter).then((response) => {

          if (!response.body.list) {
            return false;
          }
          console.log(response)
          var arr = response.body.list;
          var YN = ['下线', '上线']
          that.page.total = response.body.total

          for (let i = 0, length = arr.length; i < length; i++) {
            let areaStr = '商圈'
            if (arr[i].scope.all) {
              areaStr = '全部商圈'
            } else {
              let kArr = [];
              for (let k = 0; k < arr[i].scope.region.length; k++) {
                kArr.push(arr[i].scope.region[k].name);
              }
              areaStr = kArr.join(' , ');
            }

            let o = {
              id: arr[i].announceId,
              content: arr[i].content,
              target: areaStr,
              sort: arr[i].sort,
              state: YN[arr[i].state],
              createTime: arr[i].sendTime,
              overdueTime: arr[i].expiredTime,
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
      checkAll(isChecked){
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
      showDetailNow(o){
        this.showDetail = true;
        this.$http.get('http://' + global.URL + '/v1/announce/' + o + '/detail').then((res) => {
          this.announceDetail = res.body.data
        })
      },
      showEditNow(o){
        this.showEdit = true;
        var arr = [];
        this.edit.id = o;
        this.edit.regionId = [];
        this.$http.get('http://' + global.URL + '/v1/announce/' + o + '/detail').then((res) => {
          this.edit.content = res.body.data.content;
          this.edit.img = res.body.data.photo ? res.body.data.photo : [];
          this.edit.label = '';
          this.edit.url = res.body.data.url,
            this.edit.all = res.body.data.scope.all;
//				this.edit.regionId += res.body.data.scope.region[i].circleId;
          if (res.body.data.scope.all == false) {
            for (let i = 0; i < res.body.data.scope.region.length; i++) {
              arr.push(res.body.data.scope.region[i].circleId);
            }
            this.edit.regionId = arr;
          }
          this.edit.sort = '50';
          this.edit.time = ''
        })
      },
      editNow(){
        var that = this;

        if (this.edit.time) {
          if (Boolean(this.edit.time[0])) {
            console.log(this.edit.time)
            let sDate = new Date(this.edit.time[0]);
            let sYear = sDate.getFullYear();
            let sMonth = sDate.getMonth() + 1;
            let sDay = sDate.getDate();
            let sHours = sDate.getHours();
            let sMinutes = sDate.getMinutes();
            let sSeconds = sDate.getSeconds();
            var sStr = sYear + '-' + sMonth + '-' + sDay + ' ' + sHours + ':' + sMinutes + ':' + sSeconds;

            let eDate = new Date(this.edit.time[1]);
            let eYear = eDate.getFullYear();
            let eMonth = eDate.getMonth() + 1;
            let eDay = eDate.getDate();
            let eHours = eDate.getHours();
            let eMinutes = eDate.getMinutes();
            let eSeconds = eDate.getSeconds();
            var eStr = eYear + '-' + eMonth + '-' + eDay + ' ' + eHours + ':' + eMinutes + ':' + eSeconds;

          }
        }

        var obj = {
          "announceId": this.edit.id,
          "content": this.edit.content,
          "expiredTime": eStr,
          "photo": this.edit.img,
          "scope": {
            all: this.edit.all
          },
          "sendTime": sStr,
          "sort": this.edit.sort,
          "state": "1",
          "url": this.edit.url
        }

        if (this.edit.all == false) {
          obj.scope.regionId = this.edit.regionId;
        } else {
          obj.scope.regionId = [];
        }

        this.$http.put('http://' + global.URL + '/v1/announce', obj).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.resetData();
            this.$message('操作成功');
          }else{
            this.$message.error(res.body.message);
          }
        });

        this.showEdit = false;
      },
      successUnload(img, arr){
        console.log(arr)
        this.issue.img = arr;
      },
      deleteUnload(img, arr){
        console.log(arr)
        this.issue.img = arr;
      },
      successEditUnload(img, arr){
        this.edit.img = arr;
      },
      deleteEditUnload(img, arr){
        this.edit.img = arr;
        console.log(this.edit.img)
      },
      changeState(o, state){
        this.checked = [];
        if (typeof o == 'object' && o.length > 0) {
          this.checked = o
        } else if (typeof o == 'number') {
          this.checked.push(o.toString());
        }
        var obj = {
          announceIds: this.checked,
          state: state
        }
        if (state === '7') {
          if (this.checked.length > 0) {
            this.showDelete = true;
          }
        } else {
          this.$http.put('http://' + global.URL + '/v1/announce/change/state', obj).then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              this.resetData();
              this.$message('操作成功');
            }
          })
        }
        //this.resetData();
      },
      cancelDelete(){
        this.resetData();
      },
      confirmDelete(id){
        var obj = {
          announceIds: id,
          state: '7'
        };
        this.$http.put('http://' + global.URL + '/v1/announce/change/state', obj).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.resetData();
            this.$message('删除成功');
          }
        })
      },
      issueAnnounce(){

        if (this.issue.time) {
          if (Boolean(this.issue.time[0])) {
            console.log(this.issue.time)
            let sDate = new Date(this.issue.time[0]);
            let sYear = sDate.getFullYear();
            let sMonth = sDate.getMonth() + 1;
            let sDay = sDate.getDate();
            let sHours = sDate.getHours();
            let sMinutes = sDate.getMinutes();
            let sSeconds = sDate.getSeconds();
            var sStr = sYear + '-' + sMonth + '-' + sDay + ' ' + sHours + ':' + sMinutes + ':' + sSeconds;

            let eDate = new Date(this.issue.time[1]);
            let eYear = eDate.getFullYear();
            let eMonth = eDate.getMonth() + 1;
            let eDay = eDate.getDate();
            let eHours = eDate.getHours();
            let eMinutes = eDate.getMinutes();
            let eSeconds = eDate.getSeconds();
            var eStr = eYear + '-' + eMonth + '-' + eDay + ' ' + eHours + ':' + eMinutes + ':' + eSeconds;

          }
        }
        var userStr = window.sessionStorage.getItem('loginLoucaUser')
        var userObj = JSON.parse(userStr)
        var sender = userObj.userId;
        console.log(userObj)
        var o = {
          content: this.issue.content,
          expiredTime: eStr,
          photo: this.issue.img,
          scope: {
            all: this.issue.all
          },
          sendTime: sStr,
          sender: sender,
          state: "1"
        }

        if (this.issue.url) {
          o.url = this.issue.url
        }
        if (this.issue.all == false) {
          o.scope.regionId = this.issue.regionId
        }
        console.log(o)
        this.$http.post('http://' + global.URL + '/v1/announce', o).then((res) => {
          console.log(res)
          if (res.body.code == 201 || res.body.code == 200) {
            this.$message('发布成功')
          } else {
            this.$message(res.body.message)
          }
        })
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
    width: 340px;
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
    word-wrap: break-word;
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

  .list_box {
    width: 96%;
    padding: 6px 2%;
  }

  .list_label {
    width: 10%;
    line-height: 36px;
    float: left;
  }

  .img_label {
    vertical-align: top;
  }

  .list_content {
    width: 86%;
    float: left;
    line-height: 36px;
  }

  .event_list {
    margin: 12px 0;
  }
</style>
