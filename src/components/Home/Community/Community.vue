<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <!--      搜索      -->
      <el-tab-pane label="社区管理" name="社区管理">
        <div class="search_box">
          <!--
                              <el-select v-model="selectKey.tradingArea" clearable placeholder="选择商圈">
                                  <el-option
                                      v-for="item in selectScope.tradingArea"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                              </el-select>
          -->
          <div class="searchText">
            <el-input placeholder="搜索写字楼名称" v-model="selectKey.name"></el-input>
          </div>
          <el-button type="primary" @click="resetData">搜索</el-button>
        </div>

        <div class="table_handle">
          <!--
                              <el-button type="primary">删除</el-button>
          -->
          <el-button type="primary" @click="showAdd=true" v-if="hasPrivileges('group_manage')">
            合并社区
          </el-button>
          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="exportExcel('group')">导出表格
          </el-button>
          <el-button type="default" style="float:right" @click="creatCommity"
                     v-if="hasPrivileges('group_add')">创建社区
          </el-button>
          <!--                    <el-button type="" style="float:right">新建社区</el-button>-->
        </div>

        <!--    列表    -->
        <div class="table_box">
          <table class="table" id="group">
            <thead>
            <tr>
              <th>
                <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll"
                             @change="checkAll($event.target.checked)"> ID
                </el-checkbox>
              </th>
              <th>社区名称</th>
              <th>成员数量</th>
              <th>动态数量</th>
              <th>经度</th>
              <th>纬度</th>
              <!--<th>城市</th>-->
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
              <td>{{item.community.name}}</td>
              <td>{{item.members.total}}</td>
              <td>{{item.dynamics.total}}</td>
              <td>{{item.longitude}}</td>
              <td>{{item.latitude}}</td>
              <!--<td>{{item.city}}</td>-->
              <td class="operation">
                <!--                                    <a href="javascript:void(0)">查看</a>-->
                <a href="javascript:void(0)" @click="showEditNow(item.id)"
                   v-if="hasPrivileges('group_edit')">编辑</a>
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

        <el-dialog title="合并社区" v-model="showAdd">
          <div style="font-size:16px;">
            <span>合并</span>
            <el-input-number v-model="add.fromGroupId" :min="10000" :max="100000"></el-input-number>
            <span>社区到</span>
            <el-input-number v-model="add.toGroupId" :min="10000" :max="100000"></el-input-number>
            <span>社区</span>
          </div>
          <p style="color:red;float:right">最终保留后面社区的id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <span slot="footer" class="dialog-footer">
					<el-button @click="showAdd = false">取 消</el-button>
					<el-button type="primary" @click="addNow()">确 定</el-button>
				  </span>
        </el-dialog>

        <el-dialog title="创建社区" v-model="showCreate" top="20px">
          <iframe src="../../../../static/map.html" width="100%"
                  height="400"></iframe>
          <el-form :model="create">
            <el-form-item label="社区名称" :label-width="'80px'">
              <el-input v-model="create.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="社区介绍" :label-width="'80px'">
              <el-input type="textarea" :row="2" v-model="create.introduce"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="纬度" :label-width="'80px'">
              <el-input v-model="create.latitude" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="经度" :label-width="'80px'">
              <el-input v-model="create.longitude" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="社区地址" :label-width="'80px'">
              <el-input v-model="create.address" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
					<el-button @click="showCreate = false">取 消</el-button>
					<el-button type="primary" @click="createNow()">确 定</el-button>
				  </span>
        </el-dialog>

        <el-dialog title="编辑社区" v-model="showEdit"  top="20px">
          <iframe src="../../../../static/map.html" width="100%"
                  height="400" id="editIframe"></iframe>
          <el-form :model="edit">
            <el-form-item label="社区名称" :label-width="'80px'">
              <el-input v-model="edit.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="社区介绍" :label-width="'80px'">
              <el-input type="textarea" :row="3" v-model="edit.introduce"></el-input>
            </el-form-item>
            <el-form-item label="经度" :label-width="'80px'" style="width:220px">
              <el-input v-model="edit.longitude"></el-input>
            </el-form-item>
            <el-form-item label="纬度" :label-width="'80px'" style="width:220px">
              <el-input v-model="edit.latitude"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
					<el-button @click="showEdit = false">取 消</el-button>
					<el-button type="primary" @click="editNow()">确 定</el-button>
				  </span>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  export default {
    name: 'community',
    data () {
      return {
        activeName: '社区管理',
        showAdd: false,
        showCreate: false,
        showEdit: false,
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
          tradingArea: '',
          content: '',
        },
        add: {
          fromGroupId: '',
          toGroupId: ''
        },
        create: {
          address: "",
          introduce: "",
          latitude: '',
          longitude: '',
          name: ""
        },
        editImg: [],
        edit: {
          groupId: "",
          introduce: "",
          name: "",
          longitude: "",
          latitude: ""
        },
        selectScope: {
          tradingArea: []
        },
        data: [],
        action: '',
      }
    },
    mounted: function () {
      var that = this;
      this.action = 'http://' + global.URL + '/v1/file/upload?kind=2';
      this.$http.get('http://' + global.URL + '/v1/group/list?page=' + that.page.currentPage + '&limit=' + that.page.pageSize).then((response) => {
        console.log(response)
        var arr = response.body.list;
        that.page.total = response.body.total;
        for (let i = 0, length = arr.length; i < length; i++) {
          let o = {
            id: arr[i].groupId,
            community: {
              name: arr[i].name
            },
            members: {
              total: arr[i].memberNum
            },
            dynamics: {
              total: arr[i].newsletterNum
            },
            longitude: arr[i].longitude,
            latitude: arr[i].latitude,
            city: arr[i].city,
            isChecked: false,
          }
          that.data.push(o)
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
      const _this = this;
      window.setCommity = function (obj) {
        _this.setCreateData(obj);
      }
    },
    methods: {
      creatCommity(){
        this.showCreate = true;
      },
      setCreateData(obj){
        console.log(obj);
        if(this.showCreate){
          Object.assign(this.create, {
            address: obj.address,
            introduce:`基于${obj.name}建立的聊天群，只有本公社成员方可进入。`,
            latitude: obj.location.lat,
            longitude: obj.location.lng,
            name: obj.name,
            city:obj.cityname,
          });
        }else{
          Object.assign(this.edit, {
            latitude: obj.location.lat,
            longitude: obj.location.lng,
            name: obj.name,
          });
        }
      },
      resetData(){
        this.data = [];
        this.checked = [];
        this.isIndeterminate = false;
        this.isCheckedAll = false;
        var that = this;
        var parameter = '';

        if (this.selectKey.name) {
          parameter += '&name=' + this.selectKey.name;
        }

        this.$http.get('http://' + global.URL + '/v1/group/list?page=' + that.page.currentPage + '&limit=' + that.page.pageSize + parameter).then((response) => {
          //console.log(response)
          if (!response.body.list) {
            return false;
          }
          var arr = response.body.list;
          that.page.total = response.body.total;

          for (let i = 0, length = arr.length; i < length; i++) {
            let o = {
              id: arr[i].groupId,
              community: {
                name: arr[i].name
              },
              members: {
                total: arr[i].memberNum
              },
              dynamics: {
                total: arr[i].newsletterNum
              },
              longitude: arr[i].longitude,
              latitude: arr[i].latitude,
              city: arr[i].city,
              isChecked: false,
            }
            that.data.push(o);
          }

        }, (response) => {

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
      addNow(){
        this.$http.put('http://' + global.URL + '/v1/group/from/' + this.add.fromGroupId + '/to/' + this.add.toGroupId).then((res) => {
          console.log(res)
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message('操作成功')
          } else {
            this.$message(res.body.message);
          }

        });
      },
      createNow(){
        this.$http.post('http://' + global.URL + '/v1/group', this.create).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message('操作成功');
            this.showCreate=false;
          } else {
            this.$message(res.body.message)
          }
          this.showAdd = false;
          this.resetData();
        })
      },
      showEditNow(o){
        this.edit.groupId = o;
        this.$http.get('http://' + global.URL + '/v1/group/' + o).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.showEdit = true;
            this.edit.name = res.body.data.name;
            this.edit.introduce = res.body.data.introduce;
            this.edit.longitude = res.body.data.longitude;
            this.edit.latitude = res.body.data.latitude;
          }
        });
      },
      editNow(){
        this.$http.put('http://' + global.URL + '/v1/group', this.edit).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message('操作成功');
          } else {
            this.$message(res.body.message);
          }
          this.resetData();
        });
        this.showEdit = false;
      },
      successUnload(img, arr){
        this.editImg = arr;
      },
      deleteUnload(img, arr){
        this.editImg = arr;
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
