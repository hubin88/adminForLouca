<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <!--      搜索      -->
      <el-tab-pane label="咖豆统计" name="first">
        <div class="search_box">
          <div class="searchText" style="width:auto">
            <el-select v-model="selectScope.areaId" clearable placeholder="选择商圈" @change="selectAreas">
              <el-option
                v-for="item in selectScope.groupOptions"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="selectKey.group" filterable clearable placeholder="选择社区">
              <el-option
                v-for="item in selectScope.groups"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="searchText" style="width:auto;">
            <el-date-picker
              v-model="selectKey.time"
              type="datetimerange"
              align="right"
              placeholder="选择时间范围"
              @change="changeTime"
              :picker-options="selectScope.pickerOptions">
            </el-date-picker>
          </div>
          <div class="searchText" style="width:200px;">
            <el-input placeholder="请输入用户名" v-model="selectKey.name"></el-input>
          </div>
          <div class="searchText" style="width:200px;">
            <el-input placeholder="请输入用户手机号" v-model="selectKey.tel"></el-input>
          </div>
          <el-button type="primary" @click="resetCountData">搜索</el-button>
        </div>

        <div class="table_handle">
          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="exportExcel('taLouca')">导出表格
          </el-button>
        </div>

        <!--    列表    -->
        <div class="table_box">
          <table class="table" id="taLouca">
            <thead>
            <tr>
              <th>
                <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll"
                             @change="checkAll($event.target.checked)"> ID
                </el-checkbox>
              </th>
              <th>用户名</th>
              <th>社区</th>
              <th>咖豆总计</th>
              <th>今日新增</th>
              <th>{{randomTime}}天内新增</th>
              <th>本月新增</th>
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
              <td>{{item.name}}</td>
              <td>{{item.groupName}}</td>
              <td>{{item.total}}</td>
              <td>{{item.today}}</td>
              <td>{{randomTime === 7 ? item.sevenDay : item.randomTimeData}}</td>
              <td>{{item.month}}</td>
              <td class="operation">
                <a href="javascript:void(0)" @click="addBeen(item.id)"
                   v-if="hasPrivileges('been_add')">添加咖豆</a>
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
      <!--添加咖豆-->
      <el-dialog title="添加咖豆" v-model="addBeenGroup.showAddBeen">
        <el-form :model="addBeenGroup">
          <el-form-item label="添加数量" label-width="100px">
            <el-input-number v-model="addBeenGroup.number"></el-input-number>
          </el-form-item>
          <el-form-item label="添加原因" label-width="100px">
            <el-input v-model="addBeenGroup.reason" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addBeenGroup.showAddBeen = false">取 消</el-button>
          <el-button type="primary" @click="submitAddBeen">确 定</el-button>
        </div>
      </el-dialog>
      <!--      咖豆明细      -->
      <el-tab-pane label="咖豆明细" name="second">
        <div class="search_box">
          <el-date-picker
            v-model="detail.selectKey.time"
            type="datetimerange"
            placeholder="选择时间范围">
          </el-date-picker>
          <div class="searchText" style="width:auto;">
            <el-select v-model="detail.areaId" clearable placeholder="选择商圈" @change="selectArea">
              <el-option
                v-for="item in detail.areas"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="detail.selectKey.groupId" filterable clearable placeholder="选择社区">
              <el-option
                v-for="item in detail.groups"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="searchText" style="width:200px;">
            <el-input placeholder="请输入行为" v-model="detail.selectKey.behavior"></el-input>
          </div>
          <el-select v-model="detail.selectKey.type" clearable placeholder="选择类型">
            <el-option
              v-for="item in detail.selectScope.type"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="searchText" style="width:200px;">
            <el-input placeholder="请输入昵称" v-model="detail.selectKey.name"></el-input>
          </div>
          <div class="searchText" style="width:200px;">
            <el-input placeholder="请输入手机号" v-model="detail.selectKey.tel"></el-input>
          </div>
          <el-button type="primary" @click="resetDetailData">搜索</el-button>
        </div>

        <div class="table_handle">
          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="exportExcel('beenDetail')">导出表格</el-button>
        </div>

        <!--    列表    -->
        <div class="table_box" id="beenDetail">
          <table class="table">
            <thead>
            <tr>
              <th>
                <el-checkbox :indeterminate="detail.isIndeterminate" v-model="detail.isCheckedAll"
                             @change="checkAllDetail($event.target.checked)"> ID
                </el-checkbox>
              </th>
              <th>用户名</th>
              <th>社区</th>
              <th>行为</th>
              <th>咖豆增减</th>
              <th>数量</th>
              <th>时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in detail.data">
              <td>
                <el-checkbox
                  v-model="detail.data[index].isChecked"
                  class="check_btn" @change="checkOneDetail($event.target.checked,item.id)">
                  {{item.id}}
                </el-checkbox>
              </td>
              <td>{{item.name}}</td>
              <td>{{item.groupName}}</td>
              <td>{{item.behavior}}</td>
              <td>{{item.type}}</td>
              <td>{{item.num}}</td>
              <td>{{item.time}}</td>
            </tr>
            </tbody>
          </table>
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
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  export default {
    name: 'Loucabeen',
    data() {
      return {
        activeName: 'first',
        page: {
          currentPage: 1,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          total: 0
        },
        addBeenGroup: {
          showAddBeen: false,
          number: 0,
          reason: '',
          id: '',
        },
        isIndeterminate: false,
        isCheckedAll: false,
        checked: [],
        selectKey: {
          name: '',
          tel: '',
          group: '',
          time: '',
        },
        selectScope: {
          groupOptions: [],
          group: [],
          areaId: "",
          groups: [],
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
            }],
            disabledDate(value) {
              return new Date().getTime() - value.getTime() < 0;
            }
          },
        },
        data: [],
        randomTime: 7,
        detail: {
          createTheme: false,
          isIndeterminate: false,
          isCheckedAll: false,
          page: {
            currentPage: 1,
            pageSizes: [10, 20, 50, 100, 200, 500, 1000],
            pageSize: 10,
            total: 0
          },
          checked: [],
          groups: [],
          groupId: '',
          areas: [],
          areaId: '',
          selectKey: {
            time: '',
            groupId: '',
            behavior: '',
            type: '',
            name: '',
            tel: '',
          },
          selectScope: {
            type: [{
              value: '增加咖豆',
              label: '增加咖豆'
            }, {
              value: '减少咖豆',
              label: '减少咖豆'
            }]
          },
          data: [],
        }
      }
    },
    mounted: function () {
      var that = this;
      this.$http.get('http://' + global.URL + '/v1/integral/count/list?page=' + that.page.currentPage + '&limit=' + that.page.pageSize).then((response) => {
        if (response.body.code == 200 || response.body.code == 201) {
          var arr = response.body.list;
          that.page.total = response.body.total
          for (let i = 0; i < arr.length; i++) {
            let o = {
              id: arr[i].author.userId,
              name: arr[i].author.name,
              groupName: arr[i].author.groupName,
              total: arr[i].integralTotal,
              today: arr[i].todayData,
              sevenDay: arr[i].sevenDayData,
              month: arr[i].monthData,
              isChecked: false,
            }
            that.data.push(o)
          }
        } else {
          this.$message.error(res.body.message);
        }
      });

      this.$http.get('http://' + global.URL + '/v1/integral/list?page=' + that.detail.page.currentPage + '&limit=' + that.detail.page.pageSize).then((response) => {
        if (response.body.code == 200 || response.body.code == 201) {
          var arr = response.body.list;
          that.detail.page.total = response.body.total;
          for (let i = 0; i < arr.length; i++) {
            let o = {
              id: arr[i].author ? arr[i].author.userId : 0,
              name: arr[i].author ? arr[i].author.name : '',
              groupName: arr[i].author ? arr[i].author.groupName : '',
              behavior: arr[i].behavior,
              type: arr[i].type,
              num: arr[i].number,
              time: arr[i].createTime,
              isChecked: false,
            }
            that.detail.data.push(o)
          }
        } else {
          this.$message.error(res.body.message);
        }
      });
      this.$http.get('http://' + global.URL + '/v1/region?page=1&limit=999').then((res) => {
        if (res.body.code == 200 || res.body.code == 201) {
          for (let i = 0; i < res.body.list.length; i++) {
            let o = {
              value: res.body.list[i].circleId,
              label: res.body.list[i].name,
            };
            this.selectScope.groupOptions.push({
              value: res.body.list[i].circleId,
              label: res.body.list[i].name,
            });
            this.detail.areas.push({
              value: res.body.list[i].circleId,
              label: res.body.list[i].name,
            });
          }
        } else {
          this.$message.error(res.body.message);
        }
      });

      (function init() {
        $('.el-tabs__header').css({
          background: 'white'
        })
        $('.searchText .el-input-group__prepend .el-input__inner').css({
          width: '120px'
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
      selectGroup() {
        this.selectKey.group = this.selectScope.group[1];
      },
      addBeen(id) {
        this.addBeenGroup.id = id;
        this.addBeenGroup.showAddBeen = true;
      },
      submitAddBeen() {
        const obj = {
          "content": this.addBeenGroup.reason,
          "number": this.addBeenGroup.number,
          "targetId": JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).userId,
          "userId": this.addBeenGroup.id,
        };
        this.$http.post('http://' + global.URL + '/v1/integral/add', obj).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.addBeenGroup.showAddBeen = false;
            this.$message({
              type: 'success',
              message: '添加成功'
            });
            this.$http.get('http://' + global.URL + '/v1/integral/list?page=' + this.detail.page.currentPage + '&limit=' + this.detail.page.pageSize).then((response) => {
              if (response.body.code == 200 || response.body.code == 201) {
                var arr = response.body.list;
                this.detail.page.total = response.body.total;
                this.detail.data = [];
                for (let i = 0; i < arr.length; i++) {
                  let o = {
                    id: arr[i].author ? arr[i].author.userId : 0,
                    name: arr[i].author ? arr[i].author.name : '',
                    groupName: arr[i].author ? arr[i].author.groupName : '',
                    behavior: arr[i].behavior,
                    type: arr[i].type,
                    num: arr[i].number,
                    time: arr[i].createTime,
                    isChecked: false,
                  }
                  this.detail.data.push(o)
                }
              } else {
                this.$message.error(res.body.message);
              }
            });
          } else {
            this.$message.error(res.body.message);
          }
        })
      },
      selectArea() {
        this.detail.groups = [];
        this.detail.selectKey.groupId = '';
        this.$http.get('http://' + global.URL + '/v1/region/' + this.detail.areaId + '/group').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            for (let i = 0; i < res.body.list.length; i++) {
              let o = {
                value: res.body.list[i].groupId,
                label: res.body.list[i].name
              }
              this.detail.groups.push(o);
            }
          }
        })
      },
      selectAreas() {
        this.selectScope.groups = [];
        this.selectKey.group = '';
        this.$http.get('http://' + global.URL + '/v1/region/' + this.selectScope.areaId + '/group').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            for (let i = 0; i < res.body.list.length; i++) {
              let o = {
                value: res.body.list[i].groupId,
                label: res.body.list[i].name
              }
              this.selectScope.groups.push(o);
            }
          }
        })
      },
      changeTime(value) {
        if (!value) {
          this.randomTime = 7
        } else {
          this.getDifferDay()
        }
      },
      getDifferDay() {
        const time = this.selectKey.time[1].getTime() - this.selectKey.time[0].getTime();
        this.randomTime = parseInt(time / 1000 / 3600 / 24);
      },
      resetCountData() {
        this.data = [];
        this.checked = [];
        this.isIndeterminate = false;
        this.isCheckedAll = false;
        var that = this;
        var parameter = '';
        if (this.selectKey.group) {
          parameter += '&groupId=' + this.selectKey.group;
        }
        if (this.selectKey.time) {
          if (Boolean(this.selectKey.time[0])) {
            parameter += '&startTime=' + this.formatTime(this.selectKey.time[0]) + '&endTime=' + this.formatTime(this.selectKey.time[1]);
          }
        }
        if (this.selectKey.name) {
          parameter += '&name=' + this.selectKey.name;
        }
        if (this.selectKey.tel) {
          parameter += '&phoneNum=' + this.selectKey.tel;
        }
        this.$http.get('http://' + global.URL + '/v1/integral/count/list?page=' + that.page.currentPage + '&limit=' + that.page.pageSize + parameter).then((response) => {
          if (response.body.code == 200 || response.body.code == 201) {
            var arr = response.body.list;
            that.page.total = response.body.total;
            for (let i = 0; i < arr.length; i++) {
              let o = {
                id: arr[i].author.userId,
                name: arr[i].author.name,
                groupName: arr[i].author.groupName,
                total: arr[i].integralTotal,
                today: arr[i].todayData,
                sevenDay: arr[i].sevenDayData,
                randomTimeData: arr[i].randomTimeData,
                month: arr[i].monthData,
                isChecked: false,
              }
              that.data.push(o)
            }
          } else {
            this.$message.error(res.body.message);
          }
        });
      },
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.resetCountData();
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.resetCountData();
      },
      resetDetailData() {
        this.detail.data = [];
        this.detail.checked = [];
        this.detail.isIndeterminate = false;
        this.detail.isCheckedAll = false;
        var that = this;
        var parameter = '';
//            if(this.detail.selectKey.type){
//                let state;
//                if(this.detail.selectKey.state == '进行中'){
//                    state = '1'
//                }else if(this.detail.selectKey.state == '已结束'){
//                    state = '0'
//                }
//                parameter += '&state=' + state;
//            }
        if (this.detail.selectKey.groupId) {
          parameter += '&groupId=' + this.detail.selectKey.groupId;
        }
        if (this.detail.selectKey.name) {
          parameter += '&name=' + this.detail.selectKey.name;
        }
        if (this.detail.selectKey.tel) {
          parameter += '&phoneNum=' + this.detail.selectKey.tel;
        }
        if (this.detail.selectKey.behavior) {
          var str = '';
          switch (this.detail.selectKey.behavior) {
            case '启动APP':
              str = 1;
              break;
            case '完成注册':
              str = 2;
              break;
            case '完善个人资料':
              str = 3;
              break;
            case '完成认证':
              str = 4;
              break;
            case '第一条动态':
              str = 5;
              break;
            case '第一条查令街':
              str = 6;
              break;
            case '第一条楼咖秀':
              str = 7;
              break;
            case '签到':
              str = 8;
              break;
            case '分享':
              str = 9;
              break;
            case '被点赞':
              str = 10;
              break;
            case '被评论':
              str = 11;
              break;
            case '点赞':
              str = 12;
              break;
            case '评论':
              str = 13;
              break;
            case '发布聚会':
              str = 14;
              break;
            case '评价他人':
              str = 15;
              break;
            case '被评价':
              str = 16;
              break;
          }
          parameter += '&behavior=' + str;
        }
        if (this.detail.selectKey.time) {
          if (Boolean(this.detail.selectKey.time[0])) {
            parameter += '&startTime=' + this.formatTime(this.detail.selectKey.time[0]) + '&endTime=' + this.formatTime(this.detail.selectKey.time[1]);
          }
        }
        this.$http.get('http://' + global.URL + '/v1/integral/list?page=' + that.detail.page.currentPage + '&limit=' + that.detail.page.pageSize + parameter).then((response) => {
          if (response.body.code == 200 || response.body.code == 201) {
            var arr = response.body.list;
            that.detail.page.total = response.body.total
            for (let i = 0; i < arr.length; i++) {
              let o = {
                id: arr[i].author ? arr[i].author.userId : 0,
                name: arr[i].author ? arr[i].author.name : '',
                groupName: arr[i].author ? arr[i].author.groupName : '',
                behavior: arr[i].behavior,
                type: arr[i].type,
                num: arr[i].number,
                time: arr[i].createTime,
                isChecked: false,
              }
              that.detail.data.push(o)
            }
          } else {
            this.$message.error(response.body.message);
          }
        });
      },
      handleSizeChangeDetail(val) {
        this.detail.page.pageSize = val;
        this.resetDetailData();
      },
      handleCurrentChangeDetail(val) {
        this.detail.page.currentPage = val;
        this.resetDetailData();
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
      checkAllDetail: function (isChecked) {
        this.detail.checked = [];
        if (isChecked) {
          for (let i = 0; i < this.detail.data.length; i++) {
            this.detail.data[i].isChecked = true;
            this.detail.checked.push(this.detail.data[i].id)
          }
        } else {
          for (let i = 0; i < this.detail.data.length; i++) {
            this.detail.data[i].isChecked = false;
          }
        }
        this.detail.isIndeterminate = false;

      },
      checkOneDetail: function (isChecked, id) {
        if (isChecked) {
          this.detail.checked.push(id)
        } else {
          for (let i = 0; i < this.detail.checked.length; i++) {
            if (this.detail.checked[i] == id) {
              this.detail.checked.splice(i, 1)
            }
          }
        }
        if (this.detail.checked.length == this.detail.data.length) {
          this.detail.isIndeterminate = false;
          this.detail.isCheckedAll = true;
        } else if (this.detail.checked.length == 0) {
          this.detail.isIndeterminate = false;
          this.detail.isCheckedAll = false;
        } else {
          this.detail.isIndeterminate = true;
        }
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
