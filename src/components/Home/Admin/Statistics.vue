<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="社群统计" name="社群统计">
        <div class="search_box">
          <div style="float:left;line-height: 40px">活跃用户总数: {{total}}</div>
          <el-input placeholder="请输入天数" v-model="beforDays" style="width:200px"></el-input>
          <el-date-picker
            style="width:200px"
            v-model="time"
            type="datetimerange"
            :picker-options="pickerOptions"
            placeholder="起止时间"
            align="right"
          >
          </el-date-picker>
          <el-button type="primary" @click="check">搜索</el-button>
        </div>
        <div class="table_box">
          <table class="table" id="material">
            <thead>
            <tr>
              <th>社群ID</th>
              <th>社群名称</th>
              <th>当前成员数量</th>
              <th>活跃用户数量</th>
              <th>当天动态数量</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in userList">
              <td>{{item.groupId}}</td>
              <td>{{item.name}}</td>
              <td>{{item.memberNum}}</td>
              <td>{{item.activeUserNum}}</td>
              <td>{{item.newsletterNum}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'statistics',
    data () {
      return {
        activeName: '社群统计',
        userList: [],
        beforDays: '',
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
        total:0,
        time: [],
      };
    },
    mounted: function () {
      this.$http.get('http://' + global.URL + '/v1/statistic/active/user').then((response) => {
        if (response.body.code == 200) {
          this.userList = response.body.list;
          this.total=response.body.total;
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
      })();
    },
    methods: {
      check(){
        var obj = {
          days: this.beforDays,
          startTime: this.time[0]?this.formatTime(this.time[0]):"",
          endTime: this.time[1]?this.formatTime(this.time[1]):"",
        };
        var str = ((obj.days || obj.startTime || obj.endTime) ? '?' : '') + (obj.days ? 'days=' + obj.days : '') + (obj.startTime ? '&startTime=' + obj.startTime : '') + (obj.endTime ? '&endTime=' + obj.endTime : '');
        this.$http.get('http://' + global.URL + '/v1/statistic/active/user' + str).then((response) => {
          if (response.body.code == 200) {
            this.userList = response.body.list;
            this.total=response.body.total;
          }
        });
      },
      formatTime(time){
        let eDate = time;
        let eYear = eDate.getFullYear();
        let eMonth = eDate.getMonth()+1;
        let eDay = eDate.getDate();
        let eHours = eDate.getHours();
        let eMinutes = eDate.getMinutes();
        let eSeconds = eDate.getSeconds();
        var eStr = eYear+'-'+eMonth+'-'+eDay+' '+eHours+':'+eMinutes+':'+eSeconds;
        return eStr;
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
