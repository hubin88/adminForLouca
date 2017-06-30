<template>
  <div>
    <el-tabs v-model="activeName" class="tabBox">
      <el-tab-pane label="全部动态" name="first" class="el-tab-pane">
        <!--        图片预览       -->
        <el-dialog v-model="issue.imgVisible" size="tiny">
          <img width="100%" :src="issue.url" alt="">
        </el-dialog>
        <!--        筛选区         -->
        <div class="search_box">
          <el-switch
            v-model="swtichRe"
            on-text="关闭"
            off-text="推荐"
            @change="resetData">
          </el-switch>
          <el-select v-model="selectKey.area" multiple placeholder="选择商圈" @change="selectArea"
                     style="width:160px">
            <el-option
              v-for="item in selectScope.area"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="selectKey.group" multiple placeholder="选择社区" style="width:160px;">
            <el-option
              v-for="item in selectScope.group"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="selectKey.label" clearable placeholder="请选择标签" style="width:160px;">
            <el-option
              v-for="item in selectKey.labels"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="selectKey.createTime"
            type="datetimerange"
            align="right"
            placeholder="发布时间"
            :picker-options="selectScope.pickerOptions">
          </el-date-picker>
          <el-select v-model="selectKey.selectUser" clearable placeholder="发起人" @change="choseType"
                     style="width: 100px">
            <el-option label="昵称" value="昵称"></el-option>
            <el-option label="手机号" value="手机号"></el-option>
          </el-select>
          <div v-if="selectKey.selectUser==='昵称'" class="searchUser">
            <el-select
              v-model="selectKey.issuer"
              filterable
              remote
              clearable
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
              style="width: 160px"
            >
              <el-option
                v-for="item in selectKey.users"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div v-else-if="selectKey.selectUser==='手机号'" class="searchUser">
            <el-input v-model="selectKey.telphone" placeholder="请输入手机号"
                      @blur="choseTelphone"></el-input>
          </div>
          <div v-else class="searchUser">
            <el-input v-model="selectKey.issuer" placeholder="请输入"></el-input>
          </div>
          <el-input class="search_text" v-model="selectKey.content" placeholder="内容"></el-input>
          <el-button type="primary" @click="resetData">搜索</el-button>
        </div>

        <!--       操作区         -->
        <div class="table_handle">
          <el-button type="danger" @click="deleteNews(checked)" v-if="hasPrivileges('newsletter_manage')">
            删除
          </el-button>

          <el-button style="visibility:hidden">占位</el-button>
          <el-button type="success" style="float:right" @click="exportExcel('newsletter')">导出表格
          </el-button>
          <el-button style="float:right" @click="issueVisible=true" :disabled="false" v-if="hasPrivileges('newsletter_add')">发布动态
          </el-button>
        </div>

        <!--       发布动态         -->
        <el-dialog title="发布动态" v-model="issueVisible">
          <div class="block">
            <div class="issue_list_box">
              <div class="issue_list_label">内容</div>
              <div class="issue_list_content">
                <el-input
                  class="issue_content"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="issue.content">
                </el-input>
              </div>
              <div class="clear"></div>
            </div>
            <div class="issue_list_box">
              <div class="issue_list_label">图片</div>
              <div class="issue_list_content">
                <my-unload mId="issueNews" :onSuccess="successUnload" :action="action"
                           :onDelete="deleteUnload" :img="issue.img"></my-unload>
              </div>
              <div class="clear"></div>
            </div>
            <div class="issue_list_box">
              <div class="issue_list_label">标签</div>
              <div class="issue_list_content">
                <div class="issuer">
                  <el-select v-model="issue.label" clearable placeholder="请选择标签">
                    <el-option
                      v-for="item in selectKey.labels"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="clear"></div>
            </div>
            <div class="issue_list_box">
              <div class="issue_list_label">社区</div>
              <div class="issue_list_content">
                <div class="issuer">
                  <el-cascader
                    v-model="addIssueOptions.groupId"
                    :options="addIssueOptions.groups"
                    :show-all-levels="false"
                    clearable
                    @active-item-change="handleItemChangeGroups"
                    @change="selectGroup"
                    placeholder="请选择社区"
                  ></el-cascader>
                </div>
              </div>
              <div class="clear"></div>
            </div>
            <div class="issue_list_box">
              <div class="issue_list_label">发布人</div>
              <div class="issue_list_content">
                <div class="issuer">
                  <el-select
                    v-model="issue.issuer"
                    filterable
                    remote
                    clearable
                    placeholder="请输入发起人"
                    :remote-method="remoteMethodIssuer"
                    :loading="loading"
                    style="width: 160px"
                  >
                    <el-option
                      v-for="item in selectKey.filterUsers"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="clear"></div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="issueVisible = false">取 消</el-button>
                        <el-button type="primary" @click="issueNews">发 布</el-button>
                    </span>
        </el-dialog>

        <!--        编辑动态        -->
        <el-dialog title="编辑动态" v-model="showEdit">
          <div class="block">
            <div class="issue_list_box">
              <div class="issue_list_label">内容</div>
              <div class="issue_list_content">
                <el-input
                  class="issue_content"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="edit.content">
                </el-input>
              </div>
              <div class="clear"></div>
            </div>
            <div class="issue_list_box">
              <div class="issue_list_label">图片</div>
              <div class="issue_list_content">
                <my-unload mId="editNews" :onSuccess="successUnload" :action="action"
                           :onDelete="deleteUnload" :img="edit.img"></my-unload>
              </div>
              <div class="clear"></div>
            </div>
            <div class="issue_list_box">
              <div class="issue_list_label">标签</div>
              <div class="issue_list_content">
                <div class="issuer">
                  <el-input v-model="edit.label" placeholder="请输入标签 id"></el-input>
                </div>
              </div>
              <div class="clear"></div>
            </div>
            <div class="issue_list_box">
              <div class="issue_list_label">发布人</div>
              <div class="issue_list_content">
                <div class="issuer">
                  <el-input v-model="edit.issuer" placeholder="请输入发布人"></el-input>
                </div>
              </div>
              <div class="clear"></div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="showEdit = false">取 消</el-button>
                        <el-button type="primary" @click="editNews">确 定</el-button>
                    </span>
        </el-dialog>
        <el-dialog title="用户互动" v-model="interaction.showInteraction">
          <div class="block">
            <div class="issue_list_box">
              <div class="issue_list_label">类型</div>
              <div class="issue_list_content">
                <el-radio-group v-model="interaction.interactionType"
                                @change="interactionTypeChange">
                  <el-radio :label="1">评论</el-radio>
                  <el-radio :label="2">点赞</el-radio>
                  <el-radio :label="3">打招呼</el-radio>
                  <el-radio :label="4">关注</el-radio>
                </el-radio-group>
              </div>
              <div class="clear"></div>
              <el-input
                v-show="interaction.isComment"
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="interaction.commentContent">
              </el-input>
              <el-input
                v-show="interaction.isMessage"
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="interaction.messageContent">
              </el-input>
            </div>
            <div class="issue_list_box">
              <div class="issue_list_label">社区</div>
              <div class="issue_list_content">
                <div class="issuer">
                  <el-cascader
                    v-model="interaction.groupId"
                    :options="interaction.groups"
                    :show-all-levels="false"
                    clearable
                    @active-item-change="interactionChangeGroups"
                    @change="interactionSelectGroup"
                    placeholder="请选择社区"
                  ></el-cascader>
                </div>
              </div>
              <div class="clear"></div>
            </div>
            <div class="issue_list_box">
              <div class="issue_list_label">选择账户</div>
              <div class="issue_list_content">
                <el-select v-model="interaction.userId" placeholder="请输入账户">
                  <el-option
                    v-for="item in interaction.users"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="clear"></div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="interaction.showInteraction = false">取 消</el-button>
                        <el-button type="primary" @click="interactionSuccess">确 定</el-button>
                    </span>
        </el-dialog>
        <delete v-if="showDelete" :checked="checked" :cancel="cancelDelete"
                :confirm="confirmDelete"></delete>
        <!--        表格        -->
        <!--点击个人的时候查询个人的动态-->
        <el-dialog title="个人动态" v-model="showPersonalNewsletter" size="large" @close="closeOverLay">
          <div class="table_box">
            <table class="table">
              <thead>
              <tr>
                <th>ID</th>
                <th>内容</th>
                <th>发布人</th>
                <th>图片</th>
                <th>匿名</th>
                <th>推荐</th>
                <th>标签</th>
                <th>写字楼</th>
                <th>点赞</th>
                <th>评论</th>
                <th>访问</th>
                <th>发布时间</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in userData">
                <td>
                  {{item.id}}
                </td>
                <td class="table_content">{{item.content}}</td>
                <td><span class="issuerPic"><img
                  :src="item.issuer.pic+'?x-oss-process=image/resize,w_50,limit_0'"></span><span
                  class="issuerName">{{item.issuer.name}}</span></td>
                <td>{{item.pics.num}}</td>
                <td>{{item.anonymity}}</td>
                <td>{{item.recommendation}}</td>
                <td>{{item.label}}</td>
                <td>{{item.officeBuilding}}</td>
                <td>{{item.praises.num}}</td>
                <td>{{item.comments.num}}</td>
                <td>{{item.visitors.num}}</td>
                <td>{{item.time.create}}</td>
              </tr>
              </tbody>
            </table>
            <div class="table_control" v-if="overlaypage.total>overlaypage.pageSize">
              <el-pagination
                @current-change="handleCurrentChangePersonal"
                :current-page="overlaypage.currentPage"
                :page-sizes="overlaypage.pageSizes"
                :page-size="overlaypage.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="overlaypage.total">
              </el-pagination>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeOverLay">确 定</el-button>
          </span>
        </el-dialog>
        <div class="table_box">
          <table class="table" id="newsletter">
            <thead>
            <tr>
              <th>
                <el-checkbox v-model="isCheckedAll" :indeterminate="isIndeterminate"
                             @change="checkAll($event.target.checked)"></el-checkbox>
                &nbsp;ID
              </th>
              <th>内容</th>
              <th>发布人</th>
              <th>图片</th>
              <th>匿名</th>
              <th>推荐</th>
              <th>标签</th>
              <th>写字楼</th>
              <th>点赞</th>
              <th>评论</th>
              <th>访问</th>
              <th>发布时间</th>
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
              <td class="table_content">{{item.content}}</td>
              <td class="issuer_content" @click="searchNameList(item.issuer.userId,true)"
                  style="color: #20a0ff;">
                <span v-if="!!item.issuer.pic" class="issuerPic">
                  <img :src="item.issuer.pic+'?x-oss-process=image/resize,w_50,limit_0'">
                </span>
                <span class="issuerName">
                  <div style="display: table">
                    <span style="display: table-row">{{item.issuer.name}}</span>
                    <span style="display: table-row">{{item.issuer.userId}}</span>
                  </div>
                </span>
              </td>
              <td>{{item.pics.num}}</td>
              <td>{{item.anonymity}}</td>
              <td>{{item.recommendation}}</td>
              <td @click="showChangeLabelNow(item.id)" style="cursor:pointer">{{item.label}}</td>
              <td>{{item.officeBuilding}}</td>
              <td>{{item.praises.num}}</td>
              <td>{{item.comments.num}}</td>
              <td>{{item.visitors.num}}</td>
              <td>{{item.time.create}}</td>
              <td class="operation">
                <a href="javascript:void(0)" @click="showDynamic(item.id)">查看</a>
                <!--                                    <a href="javascript:void(0)" @click="showChangeLabelNow(item.id)">标签</a>-->
                <a href="javascript:void(0)"
                   @click="showRecommend=true;recommend.singlo=item.id" v-if="hasPrivileges('newsletter_manage')">推荐</a>
                <a href="javascript:void(0)" @click="deleteNews(item.id)" v-if="hasPrivileges('newsletter_manage')">删除</a>
                <a href="javascript:void(0)" @click="interact(item.id,item.issuer.userId)" v-if="hasPrivileges('newsletter_manage')">互动</a>
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

        <!--       详情页         -->
        <el-card class="dynamics_show" v-show="showDetail">
          <div class="dynamics_header">
            <span class="dynamics_title">用户动态内容</span>
            <i class="el-icon-close" @click="showDetail=false"></i>
          </div>
          <div class="dynamics_user">
            <span class="dy_text">用户</span>
            <span class="username">
                            <span v-if="newsdetail.author">{{newsdetail.author.name}}</span>
                        </span>
            <div class="userhead_box">
              <div v-if="newsdetail.author" class="userhead_img"
                   :style="{backgroundImage: 'url('+ newsdetail.author.headPic +')',backgroundSize:'cover'}"></div>
            </div>
          </div>
          <div class="dynamics_label">
            <span class="dy_text">标签</span>
            <span class="label_text">
                            <span v-if="newsdetail.tag">{{newsdetail.tag.tagWord}}</span>
                        </span>
            <span class="label_time">时间：<span class="time_text" v-if="newsdetail.latestTime">{{newsdetail.latestTime}}</span></span>
          </div>
          <div class="dynamics_contentBox">
            <div class="dynamics_content">
              <span class="dy_text">内容</span>
              <p v-if="newsdetail.content">{{newsdetail.content}}</p>
              <div class="clear"></div>
            </div>
            <div class="dynamics_imgs">
              <span class="dy_text">图片</span>
              <div class="dynamics_imgBox">
                <div v-if="newsdetail.photo">
                  <div class="show_imgs" v-for="(item,index) in newsdetail.photo"
                       :style="{backgroundImage: 'url('+ item +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                </div>
              </div>
              <div class="clear"></div>
            </div>
          </div>

          <div class="dynamics_num">
            <span class="praise_text">点赞数量<span
              class="praise_num">{{newsdetail.likeNum}}</span></span>
            <span class="comment_text">评论数量<span class="comment_num">{{newsdetail.replyNum}}</span></span>
          </div>
        </el-card>

        <!--      推荐      -->
        <el-dialog title="推荐信息" v-model="showRecommend" size="tiny">
          <el-input-number v-model="recommendValue" :min="1" :max="100"></el-input-number>
          <el-tooltip class="item" effect="dark" content="填入1~100之间的数字，越小越靠前"
                      placement="right">
            <i class="icon el-icon-information"></i>
          </el-tooltip>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="showRecommend = false">取 消</el-button>
                        <el-button type="primary" @click="recommendNow">确 定</el-button>
                    </span>
        </el-dialog>

        <!--      更改标签      -->
        <el-dialog title="更改标签" v-model="showChangeLabel" size="tiny">
          <el-input v-model="change.labelId" placeholder="请输入标签 id"></el-input>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="showChangeLabel = false">取 消</el-button>
                        <el-button type="primary" @click="changeLabelNow">确 定</el-button>
                    </span>
        </el-dialog>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>
  export default {
    name: 'dynamics',
    data () {
      return {
        action: '',
        loading: false,
        activeName: 'first',
        page: {
          currentPage: 1,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 10,
          total: 100
        },
        overlaypage: {
          currentPage: 1,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000],
          pageSize: 5,
          total: 0
        },
        currentUserId: '',
        showPersonalNewsletter: false,
        userData: [],
        issueVisible: false,
        showEdit: false,
        swtichRe: false,
        addIssueOptions: {
          groupId: [],
          groups: [],
        },

        issue: {
          content: '',
          url: '',
          label: '',
          issuer: '',
          img: [],
          groupId: '',
        },
        edit: {
          id: '',
          content: '',
          url: '',
          label: '',
          issuer: '',
          img: [],
          groupId: '',
        },
        change: {
          labelId: '',
          newsletterId: '',
          name: '',
          content: '',
        },
        selectKey: {
          filterUsers: [],
          telphone: '',
          issuer: '',
          issuers: [],
          groupId: '',
          createTime: '',
          labels: [],
          label: '',
          selectUser: '',
          users: [],
          isVest: false,
          content: '',
          area: [],
          group: [],
        },
        selectScope: {
          area: [],
          group: [],
          officeBuilding: [
            {
              value: '选项1',
              label: '吃饭'
            }, {
              value: '选项2',
              label: '喝水'
            }, {
              value: '选项3',
              label: '跑步'
            }
          ],
          label: [
            {
              value: '选项1',
              label: '吃饭'
            }, {
              value: '选项2',
              label: '喝水'
            }, {
              value: '选项3',
              label: '跑步'
            }
          ],
          isVest: [
            {
              value: '选项1',
              label: '吃饭'
            }, {
              value: '选项2',
              label: '喝水'
            }, {
              value: '选项3',
              label: '跑步'
            }
          ],
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
        interaction: {
          isComment: false,
          isMessage: false,
          interactionType: 4,
          showInteraction: false,
          commentContent: '',
          messageContent: '',
          account: '',
          groups: [],
          groupId: [],
          users: [],
          userId: '',
          filterUsers: [],
          newsletterId: '',
        },
        checked: [],
        isIndeterminate: false,
        isCheckedAll: false,
        showDelete: false,
        showDetail: false,
        showRecommend: false,
        showChangeLabel: false,
        recommendValue: 50,
        data: [],
        newsdetail: {},
        recommend: {
          singlo: ''
        }
      };
    },
    props: {
      privileges: Array
    },
    mounted: function () {
      var that = this;
      this.action = 'http://' + global.URL + '/v1/file/upload?kind=1';
      this.$http.get('http://' + global.URL + '/v1/newsletter/list?page=' + that.page.currentPage + '&limit=' + that.page.pageSize).then((response) => {
        var arr = response.body.list;
        var YN = ['否', '是']
        that.page.total = response.body.total

        for (let i = 0, length = arr.length; i < length; i++) {
          let o = {
            id: arr[i].id,
            content: arr[i].content,
            issuer: {
              name: arr[i].author ? arr[i].author.name : '',
              pic: arr[i].author ? arr[i].author.headPic : '',
              userId: arr[i].author ? arr[i].author.userId : ''
            },
            pics: {
              num: arr[i].photoNum
            },
            anonymity: YN[arr[i].anonymous],
            recommendation: arr[i].recommend,
            label: arr[i].tag.tagWord,
            officeBuilding: arr[i].groupName,
            praises: {
              num: arr[i].applaudNumber
            },
            comments: {
              num: arr[i].commentNumber
            },
            visitors: {
              num: arr[i].visitNumber
            },
            time: {
              create: arr[i].createdTime
            },
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
            }
            this.selectScope.area.push(o);
            this.addIssueOptions.groups.push({
              value: res.body.list[i].circleId,
              label: res.body.list[i].name,
              children: [],
            });
            this.interaction.groups.push({
              value: res.body.list[i].circleId,
              label: res.body.list[i].name,
              children: [],
            });
          }
        }
      });
      this.$http.get('http://' + global.URL + '/v1/tag/newsletter/list').then((res) => {
        if (res.body.code == 200 || res.body.code == 201) {
          for (let i = 0; i < res.body.list.length; i++) {
            let o = {
              value: res.body.list[i].tagId,
              label: res.body.list[i].name,
            }
            this.selectKey.labels.push(o);
          }
        }
      });
      function init() {
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
      }

      init();
    },
    methods: {
      remoteMethodInteraction(name){
        this.interaction.filterUsers = [];
        if (name !== '') {
          this.loading = true;
          setTimeout(()=> {
            this.loading = false;
            this.interaction.filterUsers = this.interaction.users.filter(item => {
              return item.label.toLowerCase()
                  .indexOf(name.toLowerCase()) > -1;
            });
          }, 500);
        } else {
          this.interaction.filterUsers = [];
        }
      },
      remoteMethodIssuer(name){
        this.selectKey.filterUsers = [];
        if (name !== '') {
          this.loading = true;
          setTimeout(()=> {
            this.loading = false;
            this.selectKey.filterUsers = this.selectKey.issuers.filter(item => {
              return item.label.toLowerCase()
                  .indexOf(name.toLowerCase()) > -1;
            });
          }, 500);
        } else {
          this.selectKey.filterUsers = [];
        }
      },
      closeOverLay(){
        this.showPersonalNewsletter = false
      },
      searchNameList(id, flag){
        if (!id) return;
        const that = this;
        this.currentUserId = id;
        that.userData = [];
        let page;
        if (flag) {
          page = 1;
        } else {
          page = this.overlaypage.currentPage;
        }
        this.$http.get('http://' + global.URL + '/v1/newsletter/list?page=' + page + '&limit=' + that.overlaypage.pageSize + '&userId=' + id).then((response) => {
          if (response.body.code == 200) {
            const YN = ['否', '是']
            that.overlaypage.total = response.body.total
            response.body.list.forEach((item)=> {
              let o = {
                id: item.id,
                content: item.content,
                issuer: {
                  name: item.author ? item.author.name : '',
                  pic: item.author ? item.author.headPic : '',
                  userId: item.author ? item.author.userId : ''
                },
                pics: {
                  num: item.photoNum
                },
                anonymity: YN[item.anonymous],
                recommendation: item.recommend,
                label: item.tag.tagWord,
                officeBuilding: item.groupName,
                praises: {
                  num: item.applaudNumber
                },
                comments: {
                  num: item.commentNumber
                },
                visitors: {
                  num: item.visitNumber
                },
                time: {
                  create: item.createdTime
                },
                isChecked: false
              }
              that.userData.push(o)
            });
            this.showPersonalNewsletter = true;
          }
        });
      },
      remoteMethod(name){
        this.selectKey.users = [];
        if (name !== '') {
          this.loading = true;
          setTimeout(()=> {
            this.loading = false;
            this.$http.get('http://' + global.URL + '/v1/user/find?name=' + name).then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                let arr = res.body.list || [];
                arr.forEach((item)=> {
                  this.selectKey.users.push({
                    value: item.userId,
                    label: item.name,
                  })
                });
              }
            })
          }, 500);
        }
      },
      choseTelphone(e){
        let value = e.target.value;
        if (value !== '') {
          this.$http.get('http://' + global.URL + '/v1/user/find?phone=' + value).then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              this.selectKey.issuer = res.body.list[0].userId;
            }
          })
        }
      },
      choseType(){
        this.selectKey.users = [];
        this.selectKey.issuer = '';
      },
      interactionChangeGroups(val){
        let obj = this.interaction.groups.filter((item)=>item.value === val[0])[0];
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
        });
      },
      handleItemChangeGroups(val){
        let obj = this.addIssueOptions.groups.filter((item)=>item.value === val[0])[0];
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
        });
      },
      getUserId(id, flag){
        this.$http.get('http://' + global.URL + '/v1/user/list/by/group/' + id + '?isVestUser=1').then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            for (let i = 0; i < res.body.list.length; i++) {
              let o = {
                value: res.body.list[i].userId,
                label: res.body.list[i].name,
              }
              if (flag === "issuer") {
                this.selectKey.issuers.push(o);
              } else {
                this.interaction.users.push(o);
              }
            }
          }
        });
      },
      // 按商圈选择
      selectArea(){
        this.selectScope.group = [];
        for (let i = 0; i < this.selectKey.area.length; i++) {
          this.$http.get('http://' + global.URL + '/v1/region/' + this.selectKey.area[i] + '/group').then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              for (let i = 0; i < res.body.list.length; i++) {
                let o = {
                  value: res.body.list[i].groupId,
                  label: res.body.list[i].name
                }
                this.selectScope.group.push(o);
              }
            }
          })
        }

      },
      interactionSelectGroup(ids){
        this.interaction.users = [];
        this.interaction.userId = '';
        this.getUserId(ids[1], "interaction");
      },
      selectGroup(ids){
        this.selectKey.issuers = [];
        this.getUserId(ids[1], "issuer");
      },
      interactionSuccess(){
        const type = this.interaction.interactionType;
        switch (type) {
          case 1:
            const obj1 = {
              content: this.interaction.commentContent,
              object: "1",
              objectId: this.interaction.newsletterId,
              userId: this.interaction.userId
            };
            this.$http.post('http://' + global.URL + '/v1/comment', obj1).then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                this.$message('评论成功');
              }
            });
            break;
          case 2:
            const obj2 = {
              newsletterId: this.interaction.newsletterId,
              userId: this.interaction.userId
            };
            this.$http.post('http://' + global.URL + '/v1/applaud/newsletter/' + obj2.newsletterId + '/user/' + obj2.userId).then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                this.$message('点赞成功');
              }
            });
            break;
          case 3:
            const obj3 = {
              receiver: this.interaction.publisherId,
              sender: this.interaction.userId,
              content: this.interaction.messageContent,
            };
            this.$http.post('http://' + global.URL + '/v1/user/send/im/message', obj3).then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                this.$message('打招呼成功');
              }
            });
            break;
          case 4:
            const obj4 = {
              userAId: this.interaction.userId,
              userBId: this.interaction.publisherId,
            };
            this.$http.post('http://' + global.URL + '/v1/user/' + obj4.userAId + '/follow/' + obj4.userBId).then((res) => {
              if (res.body.code == 200 || res.body.code == 201) {
                this.$message('关注成功');
              }
            });
            break;
        }
        this.interaction.showInteraction = false;
      },
      recommendNow(){
        var obj = {
          newsletterId: this.recommend.singlo,
          sorting: this.recommendValue.toString()
        }
        this.showRecommend = false;
        this.$http.put('http://' + global.URL + '/v1/newsletter/updated', obj).then((res) => {
          if (res.body.code == 200) {
            this.$message('推荐成功');
            this.resetData();
          } else {
            this.$message({
              message: '推荐有误',
              type: 'warning'
            });
          }
        })
      },
      interactionTypeChange(label){
        if (label === 1) {
          this.interaction.isComment = true
        } else {
          this.interaction.isComment = false
        }
        if (label === 3) {
          this.interaction.isMessage = true
        } else {
          this.interaction.isMessage = false
        }
      },
      deleteNews(o){
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
        this.resetData();
      },
      confirmDelete(id){
        this.$http.delete('http://' + global.URL + '/v1/newsletter/?ids=' + id).then((res) => {
          if (res.body.code == 200) {
            this.resetData();
            this.$message('删除成功');
          }
        })
      },
      resetData(){
        this.data = [];
        this.checked = [];
        this.deleteId = '';
        this.showDelete = false;
        this.interaction.commentContent = '';
        this.interaction.account = '';
        this.isIndeterminate = false;
        this.isCheckedAll = false;
        var that = this;
        var parameter = '';
        if (this.selectKey.createTime) {
          if (Boolean(this.selectKey.createTime[0])) {
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
        if (this.selectKey.content) {
          parameter += '&content=' + this.selectKey.content;
        }
        if (this.selectKey.issuer) {
          parameter += '&userId=' + this.selectKey.issuer;
        }

        if (this.selectKey.group && this.selectKey.group.length != 0) {
          parameter += '&groups=' + this.selectKey.group.join(',');
        } else if (this.selectKey.area && this.selectKey.area.length != 0) {
          var strArr = []
          for (let i = 0; i < this.selectScope.group.length; i++) {
            strArr.push(this.selectScope.group[i].value)
          }

          parameter += '&groups=' + strArr.join(',');
        }

        if (this.selectKey.label) {
          parameter += '&tagId=' + this.selectKey.label;
        }
        if (this.swtichRe) {
          parameter += '&recommend=1'
        }

        this.$http.get('http://' + global.URL + '/v1/newsletter/list?page=' + that.page.currentPage + '&limit=' + that.page.pageSize + parameter).then((response) => {
          if (!response.body.list) {
            return false;
          }
          var arr = response.body.list;
          var YN = ['否', '是']
          that.page.total = response.body.total;

          for (let i = 0, length = arr.length; i < length; i++) {
            let o = {
              id: arr[i].id,
              content: arr[i].content,
              issuer: {
                name: arr[i].author ? arr[i].author.name : '',
                pic: arr[i].author ? arr[i].author.headPic : '',
                userId: arr[i].author ? arr[i].author.userId : ''
              },
              pics: {
                num: arr[i].photoNum
              },
              anonymity: YN[arr[i].anonymous],
              recommendation: arr[i].recommend,
              label: arr[i].tag.tagWord,
              officeBuilding: arr[i].groupName,
              praises: {
                num: arr[i].applaudNumber
              },
              comments: {
                num: arr[i].commentNumber
              },
              visitors: {
                num: arr[i].visitNumber
              },
              time: {
                create: arr[i].createdTime
              },
              isChecked: false
            }
            that.data.push(o)
          }

        });
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
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.resetData()
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.resetData()
      },
      handleCurrentChangePersonal(val){
        this.overlaypage.currentPage = val;
        this.searchNameList(this.currentUserId, false);
      },
      showDynamic(o){
        this.showDetail = this.showDetail ? false : true;
        this.$http.get('http://' + global.URL + '/v1/newsletter/' + o).then((res) => {
          this.newsdetail = res.body.data;
        })
      },
      interact(newsletterId, publisherId){
        this.interaction.showInteraction = true;
        this.interaction.newsletterId = newsletterId;
        this.interaction.publisherId = publisherId;
      },
      issueNews(){
        var userStr = window.sessionStorage.getItem('loginLoucaUser')
        var userObj = JSON.parse(userStr)
        var sender = userObj.userId;
        var o = {
          "content": this.issue.content,
          "groupId": this.addIssueOptions.groupId[1],
          "photo": this.issue.img,
          "sign": "0",
          "tag": this.issue.label,
          "userId": this.issue.issuer
        }
        this.$http.post('http://' + global.URL + '/v1/newsletter', o).then((res) => {
          if (res.body.code == 200) {
            this.$message('发布成功');
            this.issueVisible = false;
            this.resetData();
          }else{
            this.$message(res.body.message);
          }
        })
      },
      editNews(){
        var o = {
          "content": "string",
          "floor": "string",
          "photo": [
            "string"
          ],
          "sign": "string",
          "state": "string",
          "tag": 0,
          "userId": 0
        }
      },
      successUnload(img, arr){
        this.issue.img = arr;
      },
      deleteUnload(img, arr){
        this.issue.img = arr;
      },
      //更改标签
      showChangeLabelNow(o){
        this.showChangeLabel = true;
        this.change.newsletterId = o;
      },
      changeLabelNow(){
        this.showChangeLabel = false;
        var o = {
          "newsletterId": this.change.newsletterId,
          "tagId": this.change.labelId
        }
        this.$http.put('http://' + global.URL + '/v1/newsletter', o).then((res) => {
          if (res.body.code == 200 || res.body.code == 201) {
            this.$message('操作成功')
          } else {
            this.$message(res.body.message)
          }
        })
        this.resetData();
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*
      createAdvertisement
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
    width: 220px;
  }

  /*******************/
  .search_box {
    padding: 12px 36px;
    text-align: right;
  }

  .search_text {
    width: 200px;
  }

  .block {
    margin: 12px 0;
  }

  /*
      动态
  */
  .dynamics_show {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 520px;
    font-size: 18px;
    color: rgba(0, 0, 0, .8);
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

  /*
      Table
  */
  .table_box {
    padding: 0 35px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    background: white;
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
    padding: 8px 12px;
    text-align: center;
  }

  .table th {
    background: rgb(238, 248, 249);
  }

  .table tr:hover {
    background: rgb(255, 253, 252);
  }

  .table_content {
    max-width: 200px;
  }

  .operation a {
    color: #20a0ff;
    padding: 0 2px;
  }

  .table_handle {
    padding: 12px 35px;
  }

  .searchUser {
    display: inline-block;
    width: 160px;
  }

  .issuer_content {
    text-align: left;
  }

  .issuer_content:hover {
    cursor: pointer;
  }

  .issuerPic {
    display: inline-block;
    width: 50px;
    height: 50px;
    float: left;
  }

  .issuerName {
    display: inline-block;
    height: 50px;
  }

  .issuerPic img {
    width: 100%;
    height: 100%;
  }
  .icon{
    display: inline-block;
    width: 20px;
    height: 25px;
    font-size: 20px;
    line-height: 20px;
    position: absolute;
    top:77px;
    margin-left: 5px;
  }
</style>
/**
*                    .::::.
*                  .::::::::.
*                 :::::::::::
*             ..:::::::::::'
*           '::::::::::::'
*             .::::::::::
*        '::::::::::::::..
*             ..::::::::::::.
*           ``::::::::::::::::
*            ::::``:::::::::'        .:::.
*           ::::'   ':::::'       .::::::::.
*         .::::'      ::::     .:::::::'::::.
*        .:::'       :::::  .:::::::::' ':::::.
*       .::'        :::::.:::::::::'      ':::::.
*      .::'         ::::::::::::::'         ``::::.
*  ...:::           ::::::::::::'              ``::.
* ```` ':.          ':::::::::'                  ::::..
*                    '.:::::'                    ':'````..
*/
