<template>
  <div>
    <el-tabs class="tabs_box" v-model="activeName">
      <el-tab-pane label="角色" name="total">
        <el-button class="create" type="primary" @click="createRole=true">创建角色</el-button>
        <table class="total table">
          <tr>
            <th>角色名称</th>
            <th>账户数量</th>
            <th style="width:60%;">操作</th>
          </tr>
          <tr v-for="(item,index) in role">
            <td>{{item.name}}</td>
            <td>{{item.amount}}</td>
            <td class="operation">
              <a href="javascript:void(0)" @click="showAuthorityList(item.roleId)">查看和编辑角色权限</a>
              <a href="javascript:void(0)" @click="showRoleList(item.roleId)">查看和编辑用户</a>
              <a href="javascript:void(0)" @click="delteRole(item.roleId)">删除角色</a>
            </td>
          </tr>
        </table>
      </el-tab-pane>
      <!--查看角色权限-->
      <el-dialog v-model="showRoleAuthority" title="角色权限" @close="closeAuthorityList" size="tiny">
        <div class="el-tree roleAuthority-tree">
          <div class="el-tree-node" :class="{'is-expanded':item.isShowChildren}"
               v-for="item in roleAuthorityList">
            <div class="el-tree-node__content" :class="{'paddingLeft':!item.hasChildren}">
              <span
                :class="{'el-tree-node__expand-icon':item.hasChildren,'expanded':item.isShowChildren}"
                @click="item.isShowChildren=!item.isShowChildren"></span>
              <label class="el-checkbox">
                <span class="el-checkbox__input"
                      :class="{'is-checked':item.isCheck}">
                  <span class="el-checkbox__inner" @click="checkAllRoleAuthority(item)"></span>
                  <input type="checkbox" class="el-checkbox__original" value="">
                </span>
              </label>
              <span class="el-tree-node__label"
                    @click="item.isShowChildren=!item.isShowChildren">{{item.label}}</span>
            </div>
            <div class="el-tree-node__children">
              <div class="el-tree-node is-expanded" v-for="val in item.children">
                <div class="el-tree-node__content" style="padding-left: 16px;">
                  <span class="el-tree-node__expand-icon is-leaf"></span>
                  <label class="el-checkbox">
                    <span class="el-checkbox__input" :class="{'is-checked':val.isCheck}">
                      <span class="el-checkbox__inner" @click="checkOneRoleAuthority(val)"></span>
                      <input type="checkbox" class="el-checkbox__original" value="">
                    </span>
                  </label>
                  <span class="el-tree-node__label">{{val.label}}</span>
                </div>
                <div class="el-tree-node__children"></div>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeAuthorityList">取 消</el-button>
            <el-button type="primary" @click="submitRoleAuthority">确 定</el-button>
          </span>
      </el-dialog>
      <!--用户列表-->
      <el-dialog title="角色下成员" v-model="showUsers" @close="closeUsersList">
        <div class="table_handle">
          <el-button style="float:right" @click="showAddUser">添加用户</el-button>
        </div>
        <table class="table">
          <tr>
            <th>用户ID</th>
            <th>用户昵称</th>
            <th>用户电话</th>
            <th>操作</th>
          </tr>
          <tr v-for="item in usersList">
            <td>{{item.userId}}</td>
            <td>{{item.name}}</td>
            <td>{{item.phone}}</td>
            <td class="operation">
              <a href="javascript:void(0)" @click="deleteUser(item.userId)">删除用户</a>
            </td>
          </tr>
        </table>
      </el-dialog>
      <!--      权限列表      -->
      <el-tab-pane label="权限" name="权限管理">
        <el-button class="create" type="primary" @click="addItem(0)">添加父级权限</el-button>
        <div class="el-tree">
          <div class="el-tree-node" :class="{'is-expanded':item.isShowChildren}"
               v-for="item in authorityList">
            <div class="el-tree-node__content" :class="{'paddingLeft':!item.hasChildren}">
              <span
                :class="{'el-tree-node__expand-icon':item.hasChildren,'expanded':item.isShowChildren}"
                @click="item.isShowChildren=!item.isShowChildren"></span>
              <label class="el-checkbox">
                <span class="el-checkbox__input"
                      :class="{'is-checked':item.isCheck}">
                  <span class="el-checkbox__inner" @click="checkAllRoleAuthority(item)"></span>
                  <input type="checkbox" class="el-checkbox__original" value="">
                </span>
              </label>
              <span class="el-tree-node__label"
                    @click="item.isShowChildren=!item.isShowChildren">{{item.label}}/{{item.id}}/{{item.symbol}}</span>
              <el-button size="mini">停用</el-button>
              <el-button size="mini" @click="deleteItem(item)">删除</el-button>
              <el-button size="mini" @click="edit(item)">编辑</el-button>
              <el-button size="mini" @click="addItem(item.id)">添加子权限</el-button>
            </div>
            <div class="el-tree-node__children">
              <div class="el-tree-node is-expanded" v-for="val in item.children">
                <div class="el-tree-node__content" style="padding-left: 16px;">
                  <span class="el-tree-node__expand-icon is-leaf"></span>
                  <label class="el-checkbox">
                    <span class="el-checkbox__input" :class="{'is-checked':val.isCheck}">
                      <span class="el-checkbox__inner" @click="checkOneItem(val)"></span>
                      <input type="checkbox" class="el-checkbox__original" value="">
                    </span>
                  </label>
                  <span class="el-tree-node__label">{{val.label}}/{{val.id}}/{{val.symbol}}</span>
                  <el-button size="mini">停用</el-button>
                  <el-button size="mini" @click="deleteItem(val)">删除</el-button>
                  <el-button size="mini" @click="edit(val)">编辑</el-button>
                </div>
                <div class="el-tree-node__children"></div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--禁用权限-->
    <el-dialog
      title="提示"
      v-model="stop.isShowShop"
      size="small"
    >
      <span>
        <el-date-picker
          v-model="stop.time"
          type="datetimerange"
          placeholder="选择被禁起止时间"
          :picker-options="stop.pickerOptions"></el-date-picker>
          <el-select v-model="stop.level" clearable placeholder="请选择被禁级别">
         <el-option label="禁发布" value="1"></el-option>
         <el-option label="禁发布和发言" value="2"></el-option>
       </el-select>
      </span>
      <el-input type="textarea" v-model="stop.reason" placeholder="请输入被禁原因"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stop.isShowShop=false">取 消</el-button>
        <el-button type="primary" @click="sureStop">确 定</el-button>
      </span>
    </el-dialog>
    <!--给角色添加用户-->
    <el-dialog
      title="请输入手机号码"
      v-model="addUser.isShowAdd"
      size="small"
    >
      <span>
        <el-input v-model="addUser.phone" placeholder="请输入手机号码" style="width: 150px"></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUser.isShowAdd=false">取 消</el-button>
        <el-button type="primary" @click="sureAddUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--创建角色-->
    <el-dialog
      title="创建角色"
      v-model="createRole"
      size="tiny"
    >
      <el-form label-width="100px" :model="newRole">
        <el-form-item label="角色名称">
          <el-input v-model="newRole.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="newRole.description"></el-input>
        </el-form-item>
        <el-form-item label="角色英文标识">
          <el-input v-model="newRole.symbol"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createRole=false">取 消</el-button>
        <el-button type="primary" @click="sureCreate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'authority',
    data () {
      return {
        roleId: '',
        userId: JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).userId,
        activeName: 'total',
        createRole: false,
        showUsers: false,
        usersList: [],
        showRoleAuthority: false,
        roleAuthorityList: [],
        isShowAuthorityChildren: true,
        noCheckAllRoleAuthority: false,
        isCheckedAuthority: [],
        isCheckedId: [],
        isShowChildren: true,
        authorityList: [],
        addUser: {
          isShowAdd: false,
          userId: '',
          roleId: '',
          phone: ''
        },
        stop: {
          isShowShop: false,
          time: [],
          stopId: '',
          level: '',
          reason: '',
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
        newRole: {
          name: '',
          description: '',
          symbol: ''
        },
        role: []
      }
    },
    beforeCreate: function () {
      this.$http.get('http://' + global.URL + '/v1/permission/role/list').then((res) => {
        if (res.body.code == 200) {
          this.role = res.body.list;
        }
      });
      this.$http.get('http://' + global.URL + '/v1/permission/list').then((res) => {
        if (res.body.code == 200) {
          const arr = res.body.list || [];
          arr.forEach(item => {
            if (item.parentId === 0) {
              this.authorityList.push({
                id: item.privilegeId,
                label: item.name,
                symbol: item.symbol,
                parentId: item.parentId,
                isCheck: false,
                children: [],
                isShowChildren: false,
                hasChildren: false,
              });
            }
          });
          arr.forEach(item => {
            if (item.parentId > 0) {
              this.authorityList.forEach(val => {
                if (val.id === item.parentId) {
                  Object.assign(val, { isShowChildren: false, hasChildren: true });
                  val.children.push({
                    id: item.privilegeId,
                    label: item.name,
                    symbol: item.symbol,
                    parentId: item.parentId,
                    isCheck: false,
                  });
                }
              });
            }
          });
        }
      });
    },
    mounted: function () {
      (function init() {
        $('.el-tabs__header').css({
          background: 'white'
        })
        $('.searchText .el-input-group__prepend .el-input__inner').css({
          width: '100px'
        })
        $('.tabs_box').css({
          background: 'white'
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
      deleteUser(id){
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const deleteObj = {
            roleId: this.addUser.roleId,
            userId: id,
          };
          this.$http.delete('http://' + global.URL + '/v1/permission/role/' + deleteObj.roleId + '/user/' + deleteObj.userId).then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.usersList = this.usersList.filter((item) => item.userId !== id);
            } else {
              this.$message({
                type: 'info',
                message: res.body.message
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delteRole(id){
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('http://' + global.URL + '/v1/permission/role/' + id).then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.role = this.role.filter((item) => item.roleId !== id);
            } else {
              this.$message({
                type: 'info',
                message: res.body.message
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      showAddUser(){
        this.addUser.phone = '';
        this.addUser.groupId = [];
        this.addUser.isShowAdd = true;
      },
      sureAddUser(){
        this.$http.get('http://' + global.URL + '/v1/user/find/phone/' + this.addUser.phone).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            const obj = {
              "roleId": this.addUser.roleId,
              "userId": res.body.data.userId
            };
            this.$http.post('http://' + global.URL + '/v1/permission/role/relevance/user', obj).then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                this.addUser.isShowAdd = false;
                this.$message({
                  type: 'success',
                  message: '添加成功'
                });
                this.$http.get('http://' + global.URL + '/v1/permission/role/' + this.addUser.roleId + '/member').then((res) => {
                  if (res.body.code == 200) {
                    this.usersList = res.body.list || [];
                  } else {
                    this.$message({
                      type: 'info',
                      message: res.body.message
                    });
                  }
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.body.message
                });
              }
            });
          } else {
            this.$message({
              type: 'info',
              message: res.body.message
            });
          }
        });
      },
      sureCreate(){
        let obj = {
          name: this.newRole.name,
          symbol: this.newRole.symbol,
          userId: this.userId
        };
        if (this.newRole.description) {
          Object.assign(obj, { remark: this.newRole.description })
        }
        this.$http.post('http://' + global.URL + '/v1/permission/role', obj).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.createRole = false;
            this.$message({
              type: 'success',
              message: '创建成功'
            });
            this.newRole.name = '';
            this.newRole.symbol = '';
            this.newRole.description = '';
            this.$http.get('http://' + global.URL + '/v1/permission/role/list').then((res) => {
              if (res.body.code == 200) {
                this.role = res.body.list;
              }
            });
          }
        });
      },
      formatTime(time){
        let eDate = time;
        let eYear = eDate.getFullYear();
        let eMonth = eDate.getMonth() + 1;
        let eDay = eDate.getDate();
        let eHours = eDate.getHours();
        let eMinutes = eDate.getMinutes();
        let eSeconds = eDate.getSeconds();
        var eStr = eYear + '-' + eMonth + '-' + eDay + ' ' + eHours + ':' + eMinutes + ':' + eSeconds;
        return eStr;
      },
      sureStop(){
        let obj = {
          handler: this.userId,
          userId: this.stop.stopId
        };
        const time = this.stop.time;
        if (time[0]) {
          Object.assign(obj, { startLockTime: this.formatTime(time[0]) });
        }
        if (time[1]) {
          Object.assign(obj, { endLockTime: this.formatTime(time[1]) });
        }
        if (this.stop.level) {
          Object.assign(obj, { level: this.stop.level });
        }
        if (this.stop.reason) {
          Object.assign(obj, { reason: this.stop.reason });
        }
        this.$http.post('http://' + global.URL + '/v1/user/locked', obj).then((res) => {
          console.log(res);
        });
      },
      stopAuthority(id){
        this.stop.isShowShop = true;
        this.stop.time = [];
        this.stop.level = '';
        this.stop.reason = '';
        this.stop.stopId = id;
      },
      edit(item){
        this.$prompt('请依次输入权限名称、上级id、权限描述和角色状态(0禁用，1启用),用","隔开', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          const val = value.replace(/[,，]/g, ',').split(',');
          let obj = {
            "name": val[0] || item.label,
            "privilegeId": item.id,
            "parentId": parseInt(val[1]) || item.parentId,
          };
          if (!!val[2]) {
            Object.assign(obj, { remark: val[1] })
          }
          if (!!val[3]) {
            Object.assign(obj, { state: val[2] })
          }
          const flag = this.authorityList.some(val => val.id === obj.parentId);
          if (!flag && obj.parentId !== 0) {
            this.$message({
              type: 'info',
              message: '父级id不正确'
            });
            return false;
          }
          this.$http.put('http://' + global.URL + '/v1/permission', obj).then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              this.authorityList = [];
              this.$http.get('http://' + global.URL + '/v1/permission/list').then((res) => {
                if (res.body.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  });
                  this.$http.get('http://' + global.URL + '/v1/permission/list').then((res) => {
                    if (res.body.code == 200) {
                      const arr = res.body.list || [];
                      arr.forEach(item => {
                        if (item.parentId === 0) {
                          this.authorityList.push({
                            id: item.privilegeId,
                            label: item.name,
                            symbol: item.symbol,
                            parentId: item.parentId,
                            isCheck: false,
                            children: [],
                            isShowChildren: false,
                            hasChildren: false,
                          });
                        }
                      });
                      arr.forEach(item => {
                        if (item.parentId > 0) {
                          this.authorityList.forEach(val => {
                            if (val.id === item.parentId) {
                              Object.assign(val, { isShowChildren: false, hasChildren: true });
                              val.children.push({
                                id: item.privilegeId,
                                label: item.name,
                                symbol: item.symbol,
                                parentId: item.parentId,
                                isCheck: false,
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消添加'
          });
        });
      },
      deleteItem(item){
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const id = item.id;
          this.$http.delete('http://' + global.URL + '/v1/permission/' + id).then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              if (item.parentId === 0) {
                this.authorityList = this.authorityList.filter(val => id !== val.id);
              } else {
                this.authorityList.forEach(val => {
                  if (val.id === item.parentId) {
                    val.children = val.children.filter(i => id !== i.id);
                  }
                });
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          });
        });

      },
      addItem(id){
        this.$prompt('请依次输入权限名称、角色英文标识(只允许小写字母与下划线),权限描述,用","隔开', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          const val = value.replace(/[,，]/g, ',').split(',');
          const obj = {
            "name": val[0],
            "remark": val[2] || "",
            "symbol": val[1],
            "parentId": id,
            "userId": this.userId,
          };
          this.$http.post('http://' + global.URL + '/v1/permission', obj).then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              const id = res.body.data;
              if (obj.parentId === 0) {
                this.authorityList.push({
                  id,
                  label: obj.name,
                  symbol: obj.symbol,
                  parentId: 0,
                  isCheck: false,
                  children: [],
                  isShowChildren: false,
                  hasChildren: false,
                });
              } else {
                this.authorityList.forEach(item => {
                  if (item.id === obj.parentId) {
                    Object.assign(item, { isShowChildren: false, hasChildren: true });
                    item.children.push({
                      id,
                      label: obj.name,
                      symbol: obj.symbol,
                      parentId: obj.parentId,
                      isCheck: false,
                    });
                  }
                });
              }
              this.$message({
                type: 'success',
                message: '添加成功'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消添加'
          });
        });
      },
      checkAllRoleAuthority(item){
        item.isCheck = !item.isCheck;
        if (item.hasChildren) {
          item.children.forEach((val) => {
            val.isCheck = item.isCheck;
          })
        }
      },
      checkOneRoleAuthority(val){
        val.isCheck = !val.isCheck;
        this.checkedAuthority();
      },
      checkedAuthority(){
        this.roleAuthorityList.forEach((item) => {
          if (item.hasChildren) {
            item.isCheck = item.children.every(val => val.isCheck);
          }
        });
      },
      checkOneItem(val){
        val.isCheck = !val.isCheck;
        this.authorityList.forEach(item => {
          if (item.hasChildren) {
            item.isCheck = item.children.every(val => val.isCheck);
          }
        });
      },
      showRoleList(id){
        this.showUsers = true;
        this.addUser.roleId = id;
        this.$http.get('http://' + global.URL + '/v1/permission/role/' + id + '/member').then((res) => {
          if (res.body.code == 200) {
            this.usersList = res.body.list || [];
          }
        });
      },
      submitRoleAuthority(){
        const privilegesArr = [];
        this.roleAuthorityList.forEach(item => {
          if (item.hasChildren) {
            item.isCheck && privilegesArr.push(item.symbol)
            item.children.forEach(val => {
              val.isCheck && privilegesArr.push(val.symbol)
            })
          } else {
            item.isCheck && privilegesArr.push(item.symbol)
          }
        });
        this.showRoleAuthority = false;
        const obj = {
          privileges: privilegesArr || [],
          roleId: this.roleId
        };
        this.$http.put('http://' + global.URL + '/v1/permission/role', obj).then((res) => {
          if (res.body.code == 200) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            });
          }
//          this.$emit("change-privileges",privilegesArr);
        });
      },
      closeUsersList(){
        this.usersList = [];
        this.addUser.roleId = '';
        this.showUsers = false;
      },
      closeAuthorityList(){
        this.roleAuthorityList = [];
        this.isCheckedAuthority = [];
        this.showRoleAuthority = false;
      },
      showAuthorityList(id){
        this.$http.get('http://' + global.URL + '/v1/permission/' + id + '/permission/list').then((res) => {
          if (res.body.code == 200) {
            const arr = res.body.list || [];
            arr.forEach(item => {
              if (item.endow) {
                this.isCheckedAuthority.push(item.privilegeId)
              }
              if (item.parentId === 0) {
                this.roleAuthorityList.push({
                  id: item.privilegeId,
                  label: item.name,
                  symbol: item.symbol,
                  parentId: item.parentId,
                  isCheck: item.endow,
                  children: [],
                  isShowChildren: false,
                  hasChildren: false,
                });
              }
            });
            arr.forEach(item => {
              if (item.parentId > 0) {
                this.roleAuthorityList.forEach(val => {
                  if (val.id === item.parentId) {
                    Object.assign(val, { isShowChildren: false, hasChildren: true });
                    val.children.push({
                      id: item.privilegeId,
                      label: item.name,
                      symbol: item.symbol,
                      parentId: item.parentId,
                      isCheck: item.endow,
                    });
                  }
                })
              }
            });
            this.roleId = id;
            this.checkedAuthority();
            this.showRoleAuthority = true;
          }
        });
      },
    },
    components: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*
      标签页
  */
  .tabs_box {
    background: #efefef;
  }

  .create {
    margin: 12px;
  }

  /*
      列表复位
  */
  table {
    border-collapse: collapse;
    text-align: center;
    width: 100%;
  }

  /*tr:not(:last-child){*/
  /*border-bottom: 1px solid #ccc;*/
  /*}*/
  td, th {
    border: 1px solid rgb(222, 222, 222);
    padding: 12px;
    text-align: center;
  }

  .operation a {
    padding: 0 8px;
    color: #1D8CE0;
  }

  /*
      全部角色
  */
  .total .tf {
    text-align: right;
  }

  /*
      创建角色
  */
  .authority_name {
    background: #ccc;
    padding-left: 12px;
  }

  .create_name {
    width: 200px;
  }

  .authority_list_box {
    max-height: 400px;
    overflow: auto;
  }

  .authority_content {
    padding: 6px 12px;
  }

  /*
      角色内容复位
  */
  .role_name {
    font-size: 24px;
    margin: 12px;
  }

  .role_description {
    margin: 12px;
    text-indent: 32px;
    font-size: 16px;
  }

  /*
      活动运营
  */
  .list_content div {
    display: inline-block;
  }

  .OM_list {
    margin: 12px auto;
  }

  .el-tree-node.is-expanded > .el-tree-node__children {
    display: block;
  }

  .el-tree-node > .el-tree-node__children {
    display: none;
  }

  .roleAuthority-tree {
    max-height: 600px;
    overflow: auto;
  }

  .paddingLeft {
    padding-left: 28px;
  }
</style>












