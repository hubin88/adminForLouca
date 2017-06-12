<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <!--      搜索      -->
      <el-tab-pane label="咖豆统计" name="咖豆统计">
        <div class="search_box">
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
              <th>7天内新增</th>
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
              <td>{{item.sevenDay}}</td>
              <td>{{item.month}}</td>
              <td class="operation">
                <a href="javascript:void(0)" @click="addBeen(item.id)" v-if="hasPrivileges('been_add')">添加咖豆</a>
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
      <el-tab-pane label="咖豆明细" name="咖豆明细">
        <div class="search_box">
          <el-date-picker
            v-model="detail.selectKey.time"
            type="datetimerange"
            placeholder="选择时间范围">
          </el-date-picker>
          <div class="searchText" style="width:200px;">
            <el-cascader
              clearable
              v-model="detail.groupId"
              :options="detail.groups"
              :show-all-levels="false"
              @active-item-change="handleItemChangeGroups"
              @change="changeGroupId"
              placeholder="请选择社区"
            ></el-cascader>
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
          <el-button type="success" style="float:right">导出表格</el-button>
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
    data () {
      return {
        activeName: '咖豆统计',
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
        },
        selectScope: {},
        data: [],
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
          groupId: [],
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
        console.log(response)
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

        }
      });

      this.$http.get('http://' + global.URL + '/v1/integral/list?page=' + that.detail.page.currentPage + '&limit=' + that.detail.page.pageSize).then((response) => {
        if (response.body.code == 200 || response.body.code == 201) {
          var arr = response.body.list;
          that.detail.page.total = response.body.total
          console.log(arr);
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

        }
      });
      this.$http.get('http://' + global.URL + '/v1/region?page=1&limit=999').then((res) => {
        console.log('商圈选择:' + res)
        if (res.body.code == 200 || res.body.code == 201) {
          for (let i = 0; i < res.body.list.length; i++) {
            let o = {
              value: res.body.list[i].circleId,
              label: res.body.list[i].name,
            }
            this.detail.groups.push({
              value: res.body.list[i].circleId,
              label: res.body.list[i].name,
              children: [],
            });
          }
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
      addBeen(id){
        this.addBeenGroup.id = id;
        this.addBeenGroup.showAddBeen = true;
      },
      submitAddBeen(){
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
                this.detail.data=[];
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
              }
            });
          }
        })
      },
      handleItemChangeGroups(val){
        let obj = this.detail.groups.filter((item) => item.value === val[0])[0];
        obj.children = [];
        this.$http.get('http://' + global.URL + '/v1/region/' + val[0] + '/group').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            for (let i = 0; i < res.body.list.length; i++) {
              let o = {
                value: res.body.list[i].groupId,
                label: res.body.list[i].name
              }
              obj.children.push(o);
            }
          }
        })
      },
      changeGroupId(){
        this.detail.selectKey.groupId = this.detail.groupId.pop();
      },
      resetCountData(){
        this.data = [];
        this.checked = [];
        this.isIndeterminate = false;
        this.isCheckedAll = false;
        var that = this;
        var parameter = '';
        if (this.selectKey.name) {
          parameter += '&name=' + this.selectKey.name;
        }
        if (this.selectKey.tel) {
          parameter += '&tel=' + this.selectKey.tel;
        }
        console.log(parameter);
        this.$http.get('http://' + global.URL + '/v1/integral/count/list?page=' + that.page.currentPage + '&limit=' + that.page.pageSize + parameter).then((response) => {
          console.log(response)
          if (response.body.code == 200 || response.body.code == 201) {
            var arr = response.body.list;
            that.page.total = response.body.total
            //that.data = response.body.list;
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

          }
        });
      },
      handleSizeChange(val) {
        this.page.pageSize = val;
        console.log(`每页 ${val} 条`);
        this.resetCountData();
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        console.log(`当前页: ${val}`);
        this.resetCountData();
      },
      resetDetailData(){
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
            console.log(this.detail.selectKey.time)
            let sDate = new Date(this.detail.selectKey.time[0]);
            let sYear = sDate.getFullYear();
            let sMonth = sDate.getMonth() + 1;
            let sDay = sDate.getDate();
            let sHours = sDate.getHours();
            let sMinutes = sDate.getMinutes();
            let sSeconds = sDate.getSeconds();
            var sStr = sYear + '-' + sMonth + '-' + sDay + ' ' + sHours + ':' + sMinutes + ':' + sSeconds;

            let eDate = new Date(this.detail.selectKey.time[1]);
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
        console.log(parameter);

        this.$http.get('http://' + global.URL + '/v1/integral/list?page=' + that.detail.page.currentPage + '&limit=' + that.detail.page.pageSize + parameter).then((response) => {
          console.log(response)
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

          }
        });
      },
      handleSizeChangeDetail(val) {
        this.detail.page.pageSize = val;
        console.log(`每页 ${val} 条`);
        this.resetDetailData();
      },
      handleCurrentChangeDetail(val) {
        this.detail.page.currentPage = val;
        console.log(`当前页: ${val}`);
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
        console.log(this.checked)
      },
      checkAllDetail: function (isChecked) {
        this.detail.checked = [];
        if (isChecked) {
          console.log('aaa')
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
        console.log(this.detail.checked)
      },

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
