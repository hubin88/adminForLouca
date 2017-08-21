<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <!--      搜索      -->
      <el-tab-pane label="全部商圈" name="全部商圈">
        <div class="search_box">
          <el-select v-model="selectKey.city" clearable placeholder="选择城市" disabled>
            <el-option
              v-for="item in selectScope.city"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="searchText">
            <el-input placeholder="搜索商圈名称" v-model="selectKey.content" disabled></el-input>
          </div>
          <el-button type="primary" @click="resetData">搜索</el-button>
        </div>

        <div class="table_handle">
          <el-button type="primary" @click="deleteArea(checked)"
                     v-if="hasPrivileges('circle_manage')">删除
          </el-button>
          <el-button style="float:right" @click="showCreate=true"
                     v-if="hasPrivileges('circle_add')">新建商圈
          </el-button>
        </div>

        <!--    列表    -->
        <div class="table_box">
          <table class="table">
            <thead>
            <tr>
              <th>
                <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll"
                             @change="checkAll($event.target.checked)"> ID
                </el-checkbox>
              </th>
              <th>商圈名称</th>
              <th>成员数量</th>
              <th>社区数量</th>
              <th>城市</th>
              <th>客服</th>
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
              <td>{{item.tradingArea.name}}</td>
              <td>{{item.members.total}}</td>
              <td>{{item.community.total}}</td>
              <td>{{item.city}}</td>
              <td>{{item.customName}}</td>
              <td class="operation">
                <a href="javascript:void(0)" @click="showEditNow(item.id)"
                   v-if="hasPrivileges('circle_edit')">编辑</a>
                <a href="javascript:void(0)" @click="deleteArea(item.id)"
                   v-if="hasPrivileges('circle_manage')">删除</a>
                <a href="javascript:void(0)" @click="addServer(item.id)"
                   v-if="hasPrivileges('circle_manage')">{{item.customName ? '变更客服' : '添加客服'}} </a>
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
        <el-dialog title="设置商圈客服" v-model="service.showService" size="tiny">
          <el-select
            v-model="service.organiser"
            filterable
            remote
            clearable
            placeholder="请输入客服昵称"
            :remote-method="remoteMethodService"
            :loading="loading"
            style="width: 160px"
          >
            <el-option
              v-for="item in service.organisers"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="service.showService = false">取 消</el-button>
            <el-button type="primary" @click="sureAddservice">确 定</el-button>
          </span>
        </el-dialog>

        <!--      创建商圈      -->
        <el-dialog title="创建商圈" v-model="showCreate">
          <div class="issue_list_box">
            <div class="issue_list_label">全称</div>
            <div class="issue_list_content">
              <div class="issuer">
                <el-input v-model="create.fullName" placeholder="请输入商圈全称"></el-input>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          <div class="issue_list_box">
            <div class="issue_list_label">介绍</div>
            <div class="issue_list_content">
              <div class="issuer">
                <el-input type="textarea" :rows="4" v-model="create.introduce"
                          placeholder="请输入商圈介绍"></el-input>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          <div class="issue_list_box">
            <div class="issue_list_label">名称</div>
            <div class="issue_list_content">
              <div class="issuer">
                <el-input v-model="create.name" placeholder="请输入商圈名称"></el-input>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          <div class="issue_list_box">
            <div class="issue_list_label">拼音</div>
            <div class="issue_list_content">
              <div class="issuer">
                <el-input v-model="create.pinyin" placeholder="请输入商圈拼音"></el-input>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="showCreate = false">取 消</el-button>
                        <el-button type="primary" @click="createNow">确 定</el-button>
                    </span>
        </el-dialog>

        <!--      编辑商圈      -->
        <el-dialog title="编辑商圈" v-model="showEdit">
          <div class="issue_list_box">
            <div class="issue_list_label">全称</div>
            <div class="issue_list_content">
              <div class="issuer">
                <el-input v-model="edit.fullName" placeholder="请输入商圈全称"></el-input>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          <div class="issue_list_box">
            <div class="issue_list_label">介绍</div>
            <div class="issue_list_content">
              <div class="issuer">
                <el-input type="textarea" :rows="4" v-model="edit.introduce"
                          placeholder="请输入商圈介绍"></el-input>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          <div class="issue_list_box">
            <div class="issue_list_label">名称</div>
            <div class="issue_list_content">
              <div class="issuer">
                <el-input v-model="edit.name" placeholder="请输入商圈名称"></el-input>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          <div class="issue_list_box">
            <div class="issue_list_label">拼音</div>
            <div class="issue_list_content">
              <div class="issuer">
                <el-input v-model="edit.pinyin" placeholder="请输入商圈拼音"></el-input>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          <div class="issue_list_box">
            <div class="issue_list_label">状态</div>
            <div class="issue_list_content">
              <el-radio class="radio" v-model="edit.state" label="0">停用</el-radio>
              <el-radio class="radio" v-model="edit.state" label="1">正常</el-radio>
            </div>
            <div class="clear"></div>
          </div>

          <div class="issue_list_box">
            <div class="selectedTrading">
              <div class="groupTitle">包含社区</div>
              <span class="groupList"
                    v-for="(item,index) in edit.group">{{item.name}}&nbsp;&nbsp;{{item.groupId}}<span
                class="icon" style="float:right;font-size:18px;cursor: pointer"
                @click="removeGroup(edit.id,item.groupId)">×</span></span>
            </div>
            <div class="groupAdd">
              <div>
                <el-select
                  v-model="edit.addId"
                  filterable
                  remote
                  clearable
                  multiple
                  placeholder="请输入社区"
                  :remote-method="remoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in edit.communitys"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button type="primary" @click="addGroup(edit.id,edit.addId)">添加</el-button>
              </div>
            </div>
          </div>

          <span slot="footer" class="dialog-footer">
                        <el-button @click="showEdit = false">取 消</el-button>
                        <el-button type="primary" @click="editNow">确 定</el-button>
                    </span>
        </el-dialog>

      </el-tab-pane>
    </el-tabs>
    <delete v-if="showDelete" :checked="checked" :cancel="cancelDelete"
            :confirm="confirmDelete"></delete>
  </div>
</template>

<script>
  export default {
    name: 'tradingArea',
    data() {
      return {
        activeName: '全部商圈',
        page: {
          currentPage: 1,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          total: 10
        },
        loading: false,
        showDelete: false,
        isIndeterminate: false,
        isCheckedAll: false,
        checked: [],
        selectKey: {
          city: '',
          content: '',
        },
        service: {
          showService: false,
          organisers: [],
          organiser: '',
          tradingAreaId: '',
        },
        selectScope: {
          city: [{
            value: '选项1',
            label: '北京'
          }, {
            value: '选项2',
            label: '上海'
          }, {
            value: '选项3',
            label: '深圳'
          }]
        },
        data: [],
        showCreate: false,
        showEdit: false,
        create: {
          fullName: '',
          introduce: '',
          name: '',
          pinyin: ''
        },
        edit: {
          id: '',
          fullName: '',
          introduce: '',
          name: '',
          pinyin: '',
          state: '1',
          group: [],
          addId: [],
          communitys: [],
          options: [],
        }
      }
    },
    mounted: function () {
      var that = this;
      this.$http.get('http://' + global.URL + '/v1/region?page=' + that.page.currentPage + '&limit=' + that.page.pageSize).then((response) => {
        var arr = response.body.list;
        that.page.total = response.body.total;
        if (arr) {
          for (let i = 0, length = arr.length; i < length; i++) {
            let o = {
              id: 0,
              tradingArea: {
                name: arr[i].name
              },
              members: {
                total: '???'
              },
              community: {
                total: arr[i].groupNum
              },
              customName: arr[i].customName,
              city: '深圳',
              isChecked: false,
            }
            that.data.push(o)
          }
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
      addServer(id) {
        this.service.organisers = [];
        this.service.organiser = '';
        this.service.showService = true;
        this.service.tradingAreaId = id;
      },
      remoteMethodService(name) {
        this.service.organisers = [];
        if (name !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$http.get('http://' + global.URL + '/v1/user/find?name=' + name).then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                let arr = res.body.list || [];
                arr.forEach((item) => {
                  this.service.organisers.push({
                    value: item.userId,
                    label: item.name,
                  })
                });
              }
            })
          }, 500);
        }
      },
      sureAddservice() {
        const obj = {
          regionId: this.service.tradingAreaId,
          userId: this.service.organiser,
        };
        this.$http.post('http://' + global.URL + '/v1/region/custom/', obj).then((res) => {
          if (res.body.code == 200) {
            this.service.showService = false;
            this.resetData();
          }else{
            this.$message.error(res.body.message);
          }
        });
      },
      remoteMethod(name) {
        this.edit.communitys = [];
        if (name !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.edit.communitys = this.edit.options.filter(item => item.label.includes(name))
          }, 500);
        }
      },
      resetData() {
        this.data = [];
        this.checked = [];
        this.isIndeterminate = false;
        this.isCheckedAll = false;
        this.showDelete = false;
        var that = this;
        var parameter = '';

        this.$http.get('http://' + global.URL + '/v1/region?page=' + that.page.currentPage + '&limit=' + that.page.pageSize + parameter).then((response) => {

          var arr = response.body.list;
          that.page.total = response.body.total;
          if (arr) {

            for (let i = 0, length = arr.length; i < length; i++) {
              let o = {
                id: arr[i].circleId,
                tradingArea: {
                  name: arr[i].name
                },
                members: {
                  total: '???'
                },
                community: {
                  total: arr[i].groupNum
                },
                customName: arr[i].customName,
                city: '深圳',
                isChecked: false,
              }
              that.data.push(o)
            }
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
      createNow() {
        var o = {
          "fullName": this.create.fullName,
          "introduce": this.create.introduce,
          "name": this.create.name,
          "pinyin": this.create.pinyin
        }
        this.$http.post('http://' + global.URL + '/v1/region', o).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message('操作成功')
            this.resetData();
          } else {
            this.$message(res.body.message)
          }
        })
        this.showCreate = false;
      },
      deleteArea(o) {
        this.checked = [];
        if (typeof o == 'object' && o.length > 0) {
          this.checked = o
          this.showDelete = true
        } else if (typeof o == 'number') {
          this.checked.push(o)
          this.showDelete = true
        }
      },
      cancelDelete() {
        this.resetData();
      },
      confirmDelete(id) {
        var obj = {
          "regionIds": id,
          "state": "7"
        };

        this.$http.put('http://' + global.URL + '/v1/region/delete', obj).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.resetData();
            this.$message('删除成功');
          } else {
            this.$message(res.body.message)
          }
        })
      },
      getCommunity() {
        this.edit.options = [];
        this.$http.get('http://' + global.URL + '/v1/group/list?page=1&limit=999999999').then(res => {
          if (res.body.code == 200 || res.body.code == 201) {
            const arr = res.body.list;
            arr.filter(item => !item.circle).forEach(val => {
              this.edit.options.push({
                value: val.groupId,
                label: val.name,
              });
            });
          }else{
            this.$message.error(res.body.message);
          }
        });
      },
      showEditNow(o) {
        this.showEdit = true;
        this.edit.id = o;
        this.getCommunity();
        this.$http.get('http://' + global.URL + '/v1/region/' + o).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.edit.fullName = res.body.data.fullName;
            this.edit.introduce = res.body.data.introduce;
            this.edit.name = res.body.data.name;
            this.edit.pinyin = res.body.data.pinyin;
            this.edit.state = res.body.data.state + '';
          }else{
            this.$message.error(res.body.message);
          }
        });
        this.$http.get('http://' + global.URL + '/v1/region/' + o + '/group').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.edit.group = res.body.list ? res.body.list : [];
          } else {
            this.edit.group = [];
          }
        })
      },
      editNow() {
        var o = {
          fullName: this.edit.fullName,
          introduce: this.edit.introduce,
          name: this.edit.name,
          pinyin: this.edit.pinyin,
          state: this.edit.state,
          regionId: this.edit.id,
        };
        this.$http.put('http://' + global.URL + '/v1/region/', o).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message('操作成功');
            this.showEdit = false;
            this.resetData();
          } else {
            this.$message(res.body.message);
          }
        })
      },
      removeGroup(rid, gid) {
        var o = {
          groupIds: [gid],
          regionId: rid
        };

        this.$http.put('http://' + global.URL + '/v1/region/bind/group', o).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message('操作成功');
            this.getCommunity();
            this.$http.get('http://' + global.URL + '/v1/region/' + rid + '/group').then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                this.edit.group = res.body.list;
              } else {
                this.edit.group = [];
              }
            });
          } else {
            this.$message(res.body.message);
          }
        })
      },
      addGroup(rid, gid) {
        var o = {
          groupIds: gid,
          regionId: rid
        };
        this.$http.post('http://' + global.URL + '/v1/region/bind/group', o).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message('操作成功');
            this.edit.options = [];
            this.edit.communitys = [];
            this.edit.addId = [];
            this.getCommunity();
            this.$http.get('http://' + global.URL + '/v1/region/' + rid + '/group').then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                this.edit.group = res.body.list;
              }
            });
          } else {
            this.$message(res.body.message);
          }
        })
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*
        AddGroup
    */
  .groupTitle {
    text-align: center;
    padding: 12px 0;
    font-family: "黑体";
    color: #000;
  }

  .groupList {
    padding: 6px 12px;
    margin: 4px 0;
    display: block;
    background: white;
    border-radius: 6px;
    transition: all ease 0.5s;
  }

  .groupList:hover {
    box-shadow: 1px 1px 1px #ccc;
    transition: all ease 0.5s;
  }

  .groupAdd {
    width: 80%;
    margin: 0 10%;
    border-radius: 8px;
  }

  .selectedTrading {
    background: #eee;
    width: 60%;
    margin: 0 10%;
    height: 180px;
    padding: 10px;
    border-radius: 8px;
    transition: all ease 0.5s;
    overflow: auto;
  }

  .selectedTrading:hover {
    box-shadow: 1px 1px 6px #999;
    transition: all ease 0.5s;
  }

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

  .userKey {
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
      Create
  */
  .issue_list_box {
    width: 96%;
    padding: 6px 2%;
    font-size: 18px;
  }

  .issue_list_label {
    width: 10%;
    line-height: 36px;
    float: left;
  }

  .issue_img_label {
    vertical-align: top;
  }

  .issue_list_content {
    width: 86%;
    float: left;
    line-height: 36px;
  }

  .issue_list_content .issuer {
    width: 320px;
  }

</style>
