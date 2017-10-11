<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="全部魅力" name="全部魅力">
        <div class="search_box">
          <div class="searchText" style="width:auto">
            <el-select v-model="area" clearable placeholder="选择商圈" @change="selectArea">
              <el-option
                v-for="item in areas"
                :label="item.name"
                :value="item.circleId">
              </el-option>
            </el-select>
            <el-select v-model="group" filterable clearable placeholder="选择社区">
              <el-option
                v-for="item in groups"
                :label="item.name"
                :value="item.groupId">
              </el-option>
            </el-select>
          </div>
          <div class="searchText" style="width:auto;">
            <el-date-picker
              v-model="pickerTime"
              type="datetimerange"
              placeholder="选择时间范围"
              @change="changeTime"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="searchText" style="width:200px;">
            <el-input placeholder="请输入用户名" v-model="nickname"></el-input>
          </div>
          <div class="searchText" style="width:200px;">
            <el-input placeholder="请输入用户手机号" v-model="mobile"></el-input>
          </div>
          <el-button type="primary" @click="resetData">搜索</el-button>
        </div>
        <el-table
          class="table"
          :data="charmList"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="userId"
            label="ID"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="用户名"
          ></el-table-column>
          <el-table-column
            prop="titleName"
            label="社区"
          ></el-table-column>
          <el-table-column
            prop="num"
            label="魅力值总计"
          ></el-table-column>
          <el-table-column
            prop="numOfMonth"
            label="本月新增"
          ></el-table-column>
          <el-table-column
            :prop="getTimeProp"
            :label="getTime"
          ></el-table-column>
          <el-table-column
            prop="numOfDay"
            label="今日新增"
          ></el-table-column>
          <el-table-column
            label="操作"
          >
            <template scope="scope">
              <span class="operation">
              <a href="javascript:void(0)" @click="showCharmDetails(scope.row.userId)">查看</a>
              <a href="javascript:void(0)" @click="addCharm(scope.row.userId)">添加魅力值</a>
              </span>
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
      </el-tab-pane>
      <el-tab-pane label="魅力值详情" name="魅力值详情">
        <el-table
          class="table"
          :data="details.data"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="userId"
            label="ID"
          ></el-table-column>
          <el-table-column
            prop="num"
            label="魅力值"
          ></el-table-column>
          <el-table-column
            label="方式"
          >
            <template scope="scope">
              {{getType(scope.row.motion)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="relatedId"
            label="关联ID"
          ></el-table-column>
          <el-table-column
            prop="time"
            label="时间"
          ></el-table-column>
        </el-table>
        <div class="table_control">
          <el-pagination
            @size-change="detailshandleSizeChange"
            @current-change="detailshandleCurrentChange"
            :current-page="details.page.currentPage"
            :page-sizes="details.page.pageSizes"
            :page-size="details.page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="details.page.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'charm',
    data() {
      return {
        activeName: '全部魅力',
        motion: {
          1: '被关注',
          2: '被邀约',
          3: '邀约成功',
          4: '加入社群',
          5: '完成认证',
        },
        charmList: [],
        page: {
          currentPage: 1,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          total: 0
        },
        areas: [],
        area: '',
        groups: [],
        group: '',
        nickname: '',
        mobile: '',
        randomTime: 7,
        pickerTime: '',
        formatTime: [],
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
        details: {
          detailId: '',
          data: [],
          page: {
            currentPage: 1,
            pageSizes: [10, 20, 50, 100, 200, 500, 1000],
            pageSize: 10,
            total: 0
          },
        },
      }
    },
    mounted: function () {
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
      })();
      this.resetData();
      this.getRegions();
    },
    computed: {
      getTimeProp() {
        return this.formatTime[0] && this.formatTime[1] ? 'numOfTime' : 'numOfWeek';
      },
      getTime() {
        return this.randomTime + '天新增';
      },
    },
    methods: {
      getType(type) {
        return this.motion[type];
      },
      selectArea() {
        this.groups = [];
        this.group = '';
        this.$http.get('http://' + global.URL + '/v1/region/' + this.area + '/group').then((res) => {
          if (res.body.code == 200) {
            this.groups = res.body.list || [];
          }
        })
      },
      getRegions() {
        this.$http.get('http://' + global.URL + '/v1/region?page=1&limit=999').then(res => {
          if (res.body.code === 200) {
            this.areas = res.body.list || [];
          }
        });
      },
      changeTime(value) {
        this.formatTime = value.split(' - ');
        if (!value) {
          this.randomTime = 7;
        } else {
          this.getDifferDay();
          this.charmList.map(item => item.numOfTime = '');
        }
      },
      getDifferDay() {
        const time = this.pickerTime[1].getTime() - this.pickerTime[0].getTime();
        this.randomTime = parseInt(time / 1000 / 3600 / 24);
      },
      showCharmDetails(id) {
        this.activeName = '魅力值详情';
        this.details.detailId = id;
        this.resetDetailsData();
      },
      addCharm(id) {
        console.log(id);
      },
      resetDetailsData() {
        const id = this.details.detailId;
        this.$http.get(`http://${global.URL}/v1/user/charm/value/${id}?&page=${this.details.page.currentPage}&limit=${this.details.page.pageSize}`).then(res => {
          if (res.body.code === 200) {
            this.details.data = res.body.list || [];
            this.details.page.total = res.body.total;
          }
        });
      },
      resetData() {
        let search = '';
        this.group && (search += '&groupId=' + this.group);
        this.nickname && (search += '&nickname=' + this.nickname);
        this.mobile && (search += '&mobile=' + this.mobile);
        this.formatTime && this.formatTime[0] && this.formatTime[1] && (search += '&start=' + this.formatTime[0] + '&end=' + this.formatTime[1]);
        this.$http.get(`http://${global.URL}/v1/user/charm/advanced?&page=${this.page.currentPage}&limit=${this.page.pageSize}${search}`).then(res => {
          if (res.body.code === 200) {
            this.charmList = res.body.list || [];
            this.page.total = res.body.total;
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
      detailshandleSizeChange(val) {
        this.details.page.pageSize = val;
        this.resetDetailsData()
      },
      detailshandleCurrentChange(val) {
        this.details.page.currentPage = val;
        this.resetDetailsData()
      },

    },
  }
</script>

<style scoped>
  .table_control {
    position: relative;
    box-sizing: border-box;
    border: 1px solid rgb(222, 222, 222);
    border-top: none;
    padding: 12px 24px;
    text-align: right;
    background: #fff;
  }

  .search_box {
    padding: 12px 36px;
    text-align: right;
  }

  .searchText {
    display: inline-block;
  }

  .operation > a {
    color: #20a0ff;
    padding: 0 2px;
  }
</style>
