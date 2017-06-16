<template>
    <div class="box">
        <el-tabs v-model="activeName">
            <!--      搜索      -->
            <el-tab-pane label="全部楼咖秀" name="全部楼咖秀">
                <div class="search_box">
                    <div class="searchText" style="width:200px;">
                      <el-select
                        v-model="selectKey.topicId"
                        filterable
                        remote
                        clearable
                        placeholder="请输入主题"
                        :remote-method="remoteMethodTop"
                        :loading="loading"
                      >
                        <el-option
                          v-for="item in selectScope.topicIds"
                          :key="item.id"
                          :label="item.topic"
                          :value="item.id">
                        </el-option>
                      </el-select>
                        <!--<el-input placeholder="请输入主题 id" v-model="selectKey.topicId"></el-input>-->
                    </div>
                    <div class="searchText" style="width:200px;">
                      <el-cascader
                        v-model="selectKey.groupId"
                        :options="selectScope.groups"
                        :show-all-levels="false"
                        @active-item-change="handleItemChangeGroups"
                        placeholder="请选择社区"
                      ></el-cascader>
                        <!--<el-input placeholder="请输入社区 id" v-model="selectKey.groupId"></el-input>-->
                    </div>
                    <el-date-picker
                        v-model="selectKey.time"
                        type="datetimerange"
                        placeholder="选择时间范围">
                    </el-date-picker>
                    <div class="searchText">
                      <el-select
                        v-model="selectKey.userId"
                        filterable
                        remote
                        clearable
                        placeholder="请输入用户"
                        :remote-method="remoteMethod"
                        :loading="loading"
                      >
                        <el-option
                          v-for="item in selectScope.users"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <el-button type="primary" @click="resetShowData">搜索</el-button>
                </div>

                <div class="table_handle">
                    <el-button type="danger" @click="deleteShow(checked)" v-if="hasPrivileges('showtime_manage')">删除</el-button>
                    <el-button style="visibility:hidden">占位</el-button>
                    <el-button type="success" style="float:right" @click="exportExcel('show')">导出表格</el-button>
                </div>

                <!--    列表    -->
                <div class="table_box">
                    <table class="table" id="show">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll" @change="checkAll($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>发布人</th>
                                <th>主题</th>
                                <th>写字楼</th>
                                <th>赞</th>
                                <th>评论</th>
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
                                <td>{{item.name}}</td>
                                <td>{{item.topicName}}</td>
                                <td>{{item.groupName}}</td>
                                <td>{{item.applaudNum}}</td>
                                <td>{{item.commentNum}}</td>
                                <td>{{item.publishTime}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="showDetailNow(item.id)">查看</a>
                                    <a href="javascript:void(0)" @click="deleteShow(item.id)" v-if="hasPrivileges('showtime_manage')">删除</a>
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
              <delete v-if="showDelete" :checked="checked" :cancel="cancelDelete" :confirm="confirmDelete"></delete>
                <!--       详情页         -->
                <el-card class="dynamics_show" v-show="showDetail">
                    <div class="dynamics_header">
                        <span class="dynamics_title">详细内容</span>
                        <i class="el-icon-close" @click="showDetail=false"></i>
                    </div>
                    <div class="dynamics_user">
                        <span class="dy_text">用户</span>
                        <span class="username">
                            <span v-if="detail.author">{{detail.author.name}}</span>
                        </span>
                        <div class="userhead_box">
                            <div v-if="detail.author" class="userhead_img" :style="{backgroundImage: 'url('+ detail.author.headPic +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                        </div>
                    </div>
                    <div class="dynamics_label">
                        <span class="dy_text">时间</span>
                        <span class="label_text">
                            <span v-if="detail.publishTime">{{detail.publishTime}}</span>
                        </span>
<!--                        <span class="label_time">发布时间：<span class="time_text">{{partyDetail.createTime}}</span></span>-->
                    </div>
                    <div class="dynamics_label">
                        <span class="dy_text">主题</span>
                        <span class="label_text">
                            <span v-if="detail.topicName">{{detail.topicName}}</span>
                        </span>
                    </div>
                    <div class="dynamics_contentBox">
                        <div class="dynamics_content">
                            <span class="dy_text">内容</span>
                            <p v-if="detail.content">{{detail.content}}</p>
                            <div class="clear"></div>
                        </div>
                        <div class="dynamics_imgs">
                            <span class="dy_text">图片</span>
                            <div class="dynamics_imgBox">
                                <div v-if="detail.photo">
                                    <div class="show_imgs" v-for="(item,index) in detail.photo" :style="{backgroundImage: 'url('+ item +')',backgroundSize:'cover',backgroundPosition:'center'}"></div>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
                    </div>

                    <div class="dynamics_num">
                        <span class="praise_text">点赞数量<span class="praise_num">{{detail.applaudNum}}</span></span>
                        <span class="comment_text">评论数量<span class="comment_num">{{detail.commentNum}}</span></span>
                    </div>
                </el-card>

            </el-tab-pane>

            <el-tab-pane label="全部主题" name="全部主题">
                <div class="search_box">
                    <el-select v-model="themes.selectKey.state" clearable placeholder="选择状态">
                        <el-option
                            v-for="item in themes.selectScope.state"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="resetThemesData">搜索</el-button>
                </div>

                <div class="table_handle">
                    <el-button type="danger" @click="changeThemeState(themes.checked,7)" v-if="hasPrivileges('showtime_manage')">删除</el-button>
                    <el-button type="primary" @click="changeThemeState(themes.checked,0)" v-if="hasPrivileges('showtime_manage')">结束</el-button>
                    <el-button style="visibility:hidden">占位</el-button>
                    <el-button type="success" style="float:right" @click="exportExcel('themes')">导出表格</el-button>
                    <el-button type="" style="float:right" @click="showCreate" v-if="hasPrivileges('showtime_add')">创建主题</el-button>
                </div>
              <delete v-if="themes.showDelete" :checked="themes.checked" :cancel="cancelDeleteThemes" :confirm="confirmDeleteThemes"></delete>

                <!--       发布主题         -->
                <el-dialog title="创建主题" v-model="themes.createTheme">
                    <div class="block">
                        <div class="issue_list_box">
                            <div class="issue_list_label">主题</div>
                            <div class="issue_list_content">
                                <el-input
                                  style="width: 300px"
                                  class="issue_content"
                                  type="textarea"
                                  :rows="4"
                                  placeholder="请输入内容"
                                  v-model="themes.create.content">
                                </el-input>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="issue_list_box">
                            <div class="issue_list_label">缩略图</div>
                            <div class="issue_list_content">
                                <my-unload mId="createSL" :onSuccess="successUnloadSL" :action="action" :onDelete="deleteUnloadSL" :img="themes.create.thumbnail"></my-unload>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="issue_list_box">
                            <div class="issue_list_label">主题图片</div>
                            <div class="issue_list_content">
                                <div class="issuer">
                                    <my-unload mId="createZT" :onSuccess="successUnloadZT" :action="action" :onDelete="deleteUnloadZT" :img="themes.create.topicPhoto"></my-unload>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="issue_list_box">
                            <div class="issue_list_label">排序</div>
                            <div class="issue_list_content">
                                <el-input-number v-model="themes.create.sort" :min="1" :max="99"></el-input-number>
                            </div>
                            <div class="clear"></div>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="themes.createTheme = false">取 消</el-button>
                        <el-button type="primary" @click="createThemeNow()">创 建</el-button>
                    </span>
                </el-dialog>

                <!--    列表    -->
                <div class="table_box">
                    <table class="table" id="themes">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="themes.isIndeterminate" v-model="themes.isCheckedAll" @change="checkAllThemes($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>主题</th>
                                <th>状态</th>
                                <th>楼咖秀数量</th>
                                <th>排序</th>
                                <th>发布时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in themes.data">
                                <td>
                                    <el-checkbox
                                        v-model="themes.data[index].isChecked"
                                        class="check_btn" @change="checkOneThemes($event.target.checked,item.id)">
                                        {{item.id}}
                                    </el-checkbox>
                                </td>
                                <td>{{item.topic}}</td>
                                <td>{{item.state}}</td>
                                <td>{{item.num}}</td>
                                <td>{{item.sort}}</td>
                                <td>{{item.time}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="changeThemeState(item.id,7)" v-if="hasPrivileges('showtime_manage')">删除</a>
<!--                                    <a href="javascript:void(0)">编辑</a>-->
                                    <a href="javascript:void(0)" @click="changeThemeState(item.id,0)" v-if="hasPrivileges('showtime_manage')">结束</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_control">
                        <el-pagination
                          @size-change="handleSizeChangeThemes"
                          @current-change="handleCurrentChangeThemes"
                          :current-page="themes.page.currentPage"
                          :page-sizes="themes.page.pageSizes"
                          :page-size="themes.page.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="themes.page.total">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
export default {
    name: 'floorShow',
    data () {
        return {
          loading:false,
            activeName:'全部楼咖秀',
            page:{
                currentPage:1,
                pageSizes:[10,20,50,100,200,500,1000],
                pageSize:10,
                total:0
            },
          showDelete:false,
            showDetail:false,
            isIndeterminate:false,
            isCheckedAll:false,
            checked:[],
            selectKey:{
                userId:'',
                groupId:[],
                topicId:'',
                time:'',
            },
            selectScope:{
                users:[],
                groups:[],
              topicIds:[],
                community:[{
                  value: '选项1',
                  label: '荣超英隆大厦'
                }],
                theme:[{
                  value: '选项1',
                  label: '家乡年味'
                },{
                  value: '选项2',
                  label: '水电费从'
                }]
            },
            data:[],
            detail:[],
            action:'',
            themes:{
                showDelete:false,
                createTheme:false,
                isIndeterminate:false,
                isCheckedAll:false,
                page:{
                    currentPage:1,
                    pageSizes:[10,20,50,100,200,500,1000],
                    pageSize:10,
                    total:0
                },
                checked:[],
                selectKey:{
                    state:''
                },
                create:{
                    sort:'',
                    content:'',
                    thumbnail:[],
                    topicPhoto:[]
                },
                selectScope:{
                    state:[{
                      value: '进行中',
                      label: '进行中'
                    },{
                      value: '已结束',
                      label: '已结束'
                    }]
                },
                data:[],
            }
        }
    },
    mounted: function(){
        this.action = 'http://'+global.URL+'/v1/file/upload?kind=5';
        var that = this;
        this.$http.get('http://'+ global.URL +'/v1/showtime/list?page='+ that.page.currentPage+'&limit='+ that.page.pageSize).then((response) => {
                console.log(response)
                if(response.body.code == 200 || response.body.code == 201){
                    var arr = response.body.list;
                    that.page.total = response.body.total
                    //that.data = response.body.list;
                    for(let i = 0; i < arr.length; i++){
                        let o = {
                            id : arr[i].showId,
                            name : arr[i].author.name,
                            topicName : arr[i].topicName,
                            groupName : arr[i].groupName,
                            applaudNum : arr[i].applaudNum,
                            commentNum : arr[i].commentNum,
                            publishTime : arr[i].publishTime,
                            isChecked : false,
                        }
                        that.data.push(o)
                    }

                }
        });

        this.$http.get('http://'+ global.URL +'/v1/showtime?page='+ that.themes.page.currentPage+'&limit='+ that.themes.page.pageSize).then((response) => {
                if(response.body.code == 200 || response.body.code == 201){
                    var arr = response.body.list;
                    var ZT = ['已结束','进行中',2,3,4,5,6,'已删除']
                    that.themes.page.total = response.body.total
                    that.page.total = response.body.total
                    //that.data = response.body.list;
                    for(let i = 0; i < arr.length; i++){
                        let o = {
                            id : arr[i].topicId,
                            topic : arr[i].content,
                            state : ZT[arr[i].state],
                            num : arr[i].publishNum,
                            sort : arr[i].sortby,
                            time : arr[i].publichTime,
                            isChecked : false,
                        }
                        that.themes.data.push(o)
                    }

                }
        });

          this.$http.get('http://' + global.URL + '/v1/region?page=1&limit=999').then((res) => {
            if (res.body.code == 200 || res.body.code == 201) {
              for (let i = 0; i < res.body.list.length; i++) {
                let o = {
                  value: res.body.list[i].circleId,
                  label: res.body.list[i].name,
                }
                this.selectScope.groups.push({
                  value: res.body.list[i].circleId,
                  label: res.body.list[i].name,
                  children:[],
                });
              }
            }
          });
        (function init(){
            $('.el-tabs__header').css({
                background:'white'
            })
            $('.searchText .el-input-group__prepend .el-input__inner').css({
                width:'120px'
            })
            $('.el-card__header').css({
                background:'rgb(65,65,73)'
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
        remoteMethodTop(val){
          this.selectScope.topicIds=[];
          if(val!==''){
            this.loading = true;
            setTimeout(()=>{
              this.loading = false;
              this.selectScope.topicIds=this.themes.data.filter((item)=>item.topic.indexOf(val)>-1);
            },500);
          }
        },
        handleItemChangeGroups(val){
          let obj=this.selectScope.groups.filter((item)=>item.value===val[0])[0];
          obj.children=[];
          this.$http.get('http://'+ global.URL +'/v1/region/'+ val[0] +'/group').then( (res) => {
            if(res.body.code == 200 || res.body.code == 201){
              for(let i = 0; i < res.body.list.length; i ++){
                let o = {
                  value: res.body.list[i].groupId,
                  label: res.body.list[i].name
                }
                obj.children.push(o);
              }
            }
          })
        },
        remoteMethod(name){
          this.selectScope.users=[];
          if(name!==''){
            this.loading = true;
            setTimeout(()=>{
              this.loading = false;
              this.$http.get('http://'+ global.URL +'/v1/user/find?name='+name).then( (res) => {
                if(res.body.code == 200 || res.body.code == 201){
                  let arr=res.body.list||[];
                  arr.forEach((item)=>{
                    this.selectScope.users.push({
                      value:item.userId,
                      label:item.name,
                    })
                  });
                }
              })
            },500);
          }
        },
        //上传图片
        successUnloadSL(img,arr){
            console.log(arr)
            this.themes.create.thumbnail = arr;
        },
        deleteUnloadSL(img,arr){
            console.log(arr)
            this.themes.create.thumbnail = arr;
        },
        successUnloadZT(img,arr){
            console.log(arr)
            this.themes.create.topicPhoto = arr;
        },
        deleteUnloadZT(img,arr){
            console.log(arr)
            this.themes.create.topicPhoto = arr;
        },
        //
        resetShowData(){
            this.data = [];
            this.checked = [];
            this.isIndeterminate = false;
            this.isCheckedAll = false;
            this.showDelete=false;
            var that = this;
            var parameter = '';
            if(this.selectKey.topicId){
                parameter += '&topicId=' + this.selectKey.topicId;
            }
            if(this.selectKey.groupId.length>0){
                parameter += '&groupId=' + this.selectKey.groupId.pop();
            }
            if(this.selectKey.userId){
                parameter += '&userId=' + this.selectKey.userId;
            }
            if(this.selectKey.time){
                if(Boolean(this.selectKey.time[0])){
                    let sDate = new Date(this.selectKey.time[0]);
                    let sYear = sDate.getFullYear();
                    let sMonth = sDate.getMonth()+1;
                    let sDay = sDate.getDate();
                    let sHours = sDate.getHours();
                    let sMinutes = sDate.getMinutes();
                    let sSeconds = sDate.getSeconds();
                    var sStr = sYear+'-'+sMonth+'-'+sDay+' '+sHours+':'+sMinutes+':'+sSeconds;

                    let eDate = new Date(this.selectKey.time[1]);
                    let eYear = eDate.getFullYear();
                    let eMonth = eDate.getMonth()+1;
                    let eDay = eDate.getDate();
                    let eHours = eDate.getHours();
                    let eMinutes = eDate.getMinutes();
                    let eSeconds = eDate.getSeconds();
                    var eStr = eYear+'-'+eMonth+'-'+eDay+' '+eHours+':'+eMinutes+':'+eSeconds;

                    parameter += '&startTime=' + sStr + '&endTime=' + eStr;
                }
            }
            console.log(parameter);
            this.$http.get('http://'+ global.URL +'/v1/showtime/list?page='+ that.page.currentPage+'&limit='+ that.page.pageSize + parameter).then((response) => {
                console.log(response)
                if(response.body.code == 200 || response.body.code == 201){
                    var arr = response.body.list;
                    that.page.total = response.body.total
                    //that.data = response.body.list;
                    for(let i = 0; i < arr.length; i++){
                        let o = {
                            id : arr[i].showId,
                            name : arr[i].author.name,
                            topicName : arr[i].topicName,
                            groupName : arr[i].groupName,
                            applaudNum : arr[i].applaudNum,
                            commentNum : arr[i].commentNum,
                            publishTime : arr[i].publishTime,
                            isChecked : false,
                        }
                        that.data.push(o)
                    }

                }
            });
        },
        showDetailNow(o){
            this.showDetail = true;
            this.$http.get('http://'+ global.URL +'/v1/showtime/detail/'+ o).then((res) => {
                if(res.body.code == 200 || res.body.code == 201){
                    this.detail = res.body.data;
                }else{
                    this.$message(res.body.message)
                }
            })
        },
      cancelDelete(){
        this.resetShowData();
      },
      confirmDelete(id){
        this.$http.delete('http://'+global.URL+'/v1/showtime?ids='+ id).then((res) => {
                if(res.body.code == 200){
                    this.resetShowData();
                    this.$message('删除成功');
                }
            })
      },
        deleteShow(o){
          this.checked = []
          if (typeof o == 'object'&&o.length>0) {
            this.checked = o.join(",")
            this.showDelete = true
          } else if (typeof o == 'number') {
            this.checked = o
            this.showDelete = true
          }
        },
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.resetShowData();
        },
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.resetShowData();
        },
        resetThemesData(){
            this.themes.data = [];
            this.themes.checked = [];
            this.themes.showDelete=false;
            this.themes.isIndeterminate = false;
            this.themes.isCheckedAll = false;
            var that = this;
            var parameter = '';
            if(this.themes.selectKey.state){
                let state;
                if(this.themes.selectKey.state == '进行中'){
                    state = '1'
                }else if(this.themes.selectKey.state == '已结束'){
                    state = '0'
                }
                parameter += '&state=' + state;
            }
            console.log(parameter);
            this.$http.get('http://'+ global.URL +'/v1/showtime?page='+ that.themes.page.currentPage+'&limit='+ that.themes.page.pageSize + parameter).then((response) => {
                console.log(response)
                if(response.body.code == 200 || response.body.code == 201){
                    var arr = response.body.list;
                    var ZT = ['已结束','进行中',2,3,4,5,6,'已删除']
                    that.themes.page.total = response.body.total
                    that.page.total = response.body.total
                    //that.data = response.body.list;
                    for(let i = 0; i < arr.length; i++){
                        let o = {
                            id : arr[i].topicId,
                            topic : arr[i].content,
                            state : ZT[arr[i].state],
                            num : arr[i].publishNum,
                            sort : arr[i].sortby,
                            time : arr[i].publichTime,
                            isChecked : false,
                        }
                        that.themes.data.push(o)
                    }

                }
            });
        },
        handleSizeChangeThemes(val) {
            this.themes.page.pageSize = val;
            console.log(`每页 ${val} 条`);
            this.resetThemesData();
        },
        handleCurrentChangeThemes(val) {
            this.themes.page.currentPage = val;
            console.log(`当前页: ${val}`);
            this.resetThemesData();
        },
        checkAll(isChecked){
            this.checked = [];
            if(isChecked){
                for(let i = 0; i < this.data.length; i++){
                    this.data[i].isChecked = true;
                    this.checked.push(this.data[i].id)
                }
            }else{
                for(let i = 0; i < this.data.length; i++){
                    this.data[i].isChecked = false;
                }
            }
            this.isIndeterminate = false;

        },
        checkOne(isChecked,id){
            if(isChecked){
                this.checked.push(id)
            }else{
                for(let i = 0; i < this.checked.length; i++){
                    if(this.checked[i] == id){
                        this.checked.splice(i,1)
                    }
                }
            }
            if(this.checked.length == this.data.length){
                this.isIndeterminate = false;
                this.isCheckedAll = true;
            }else if(this.checked.length == 0){
                this.isIndeterminate = false;
                this.isCheckedAll = false;
            }else{
                this.isIndeterminate = true;
            }
            console.log(this.checked)
        },
        showCreate(){
            this.themes.createTheme = true;
        },
        createThemeNow(){
            var o = {
              sortby: this.themes.create.sort,
              topicContent: this.themes.create.content,
              thumbnail: this.themes.create.thumbnail[0],
              topicPhoto: this.themes.create.topicPhoto[0],
            }
            console.log(o)
            this.$http.post('http://'+ global.URL +'/v1/showtime/topic',o).then((res) => {
                console.log(res);
                if(res.body.code == 200 || res.body.code == 201){
                    this.$message('添加成功');
                }else{
                    this.$message(res.body.message)
                }
            })
            this.themes.createTheme = false;
            this.resetThemesData();

        },
        checkAllThemes(isChecked){
            this.themes.checked = [];
            if(isChecked){
                console.log('aaa')
                for(let i = 0; i < this.themes.data.length; i++){
                    this.themes.data[i].isChecked = true;
                    this.themes.checked.push(this.themes.data[i].id)
                }
            }else{
                for(let i = 0; i < this.themes.data.length; i++){
                    this.themes.data[i].isChecked = false;
                }
            }
            this.themes.isIndeterminate = false;

        },
        checkOneThemes(isChecked,id){
            if(isChecked){
                this.themes.checked.push(id)
            }else{
                for(let i = 0; i < this.themes.checked.length; i++){
                    if(this.themes.checked[i] == id){
                        this.themes.checked.splice(i,1)
                    }
                }
            }
            if(this.themes.checked.length == this.themes.data.length){
                this.themes.isIndeterminate = false;
                this.themes.isCheckedAll = true;
            }else if(this.themes.checked.length == 0){
                this.themes.isIndeterminate = false;
                this.themes.isCheckedAll = false;
            }else{
                this.themes.isIndeterminate = true;
            }
            console.log(this.themes.checked)
        },
        changeThemeState(o,state){
          if(state==7){
            if (typeof o == 'object'&&o.length>0) {
              this.themes.checked = o.join(",")
              this.themes.showDelete = true
            } else if (typeof o == 'number') {
              this.themes.checked = o
              this.themes.showDelete = true
            }
          }else{
            console.log(o);
            if(typeof o == 'object'){
              o = o.join(',');
            }else if(typeof o == 'number'){
              o = o.toString();
            }
            this.$http.delete('http://'+global.URL+'/v1/showtime/topic?ids='+ o +'&state='+ state).then((res) => {
              if(res.body.code == 200){
                this.resetThemesData();
                this.$message('操作成功');
              }
            })
          }
        },
        cancelDeleteThemes(){
          this.resetThemesData();
        },
        confirmDeleteThemes(id){
          this.$http.delete('http://'+global.URL+'/v1/showtime/topic?ids='+ id +'&state=7').then((res) => {
                if(res.body.code == 200){
                    this.resetThemesData();
                    this.$message('删除成功');
                }
            })
        }

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*
        创建
    */
    .issue_list_box{
        width: 96%;
        padding: 6px 2%;
        font-size: 18px;
    }
    .issue_list_label{
        width: 10%;
        line-height: 36px;
        float:left;
    }
    .issue_list_content{
        width: 86%;
        float:left;
        line-height: 36px;
    }
    .issue_list_content .issuer{
        width:220px;
    }
    /*
        Search
    */
    .title{
        font-size: 20px;
    }
    .search_box{
        padding: 12px 36px;
        text-align: right;
    }
    .searchText{
        display: inline-block;
    }

    /*
        Table
    */
    .table_box{
        padding: 0 35px;
    }
    .table{
        width: 100%;
        border-collapse: collapse;
    }
    .table_control{
        position: relative;
        box-sizing: border-box;
        border:1px solid rgb(222,222,222);
        border-top: none;
        padding: 12px 24px;
        text-align: right;
        background: #fff;
    }
    .table td,.table th{
        border: 1px solid rgb(222,222,222);
        padding: 12px;
        text-align: center;
    }
    .table td{
        background: #fff;
    }
    .table th{
        padding: 12px;
        background: rgb(238,248,249);
    }
    .table_handle{
        padding: 12px 35px;
    }
    .operation>a{
        color:#20a0ff;
        padding: 0 2px;
    }
    /*
        详情页
    */
    .dynamics_show{
        display: block;
        position: absolute;
        top:0;
        right:0;
        width: 520px;
        font-size: 18px;
        color:rgba(0,0,0,80%);
        box-shadow: -10px 10px 5px #ccc;
    }
    .dy_text{
        position: absolute;
        left: 50px;
        color:rgba(167,167,167,1);
    }
    .dynamics_header{
        position: relative;
        height: 65px;
        background: rgb(65,65,73);
        font-size: 24px;
        color: rgb(177,177,185);
    }
    .dynamics_title{
        position: absolute;
        left: 46px;
        top: 20px;
    }
    .dynamics_header i{
        font-size: 20px;
        position: absolute;
        right: 32px;
        top: 24px;
    }
    .dynamics_header i:hover{
        cursor: pointer;
        color: rgb(84,179,183);
    }
    .dynamics_user{
        width: 100%;
        height: 200px;
        position: relative;
    }
    .dynamics_user .username{
        position: relative;
        top: 109px;
        left: 120px;
    }
    .dynamics_user .userhead_img{
        position: absolute;
        top: 64px;
        right: 56px;
        background: red;
        width: 105px;
        height: 105px;
    }
    .dynamics_user .dy_text{
        top: 109px;
    }

    .dynamics_label{
        height: 60px;
        position: relative;
    }
    .detail_list{
        height: 60px;
        position: relative;
    }
    .dynamics_label .dy_text{
        bottom: 21px;
    }
    .detail_list .dy_text{
        bottom: 21px;
    }
    .label_text{
        position: absolute;
        bottom: 21px;
        left: 120px;
    }
    .dynamics_label .label_time{
        color:rgb(167,167,167);
        position: absolute;
        bottom: 21px;
        right: 56px;
    }
    .dynamics_content{
        width: 100%;
        height: auto;
        min-height: 40px;
        padding: 12px 0;
        background: rgb(245,245,245);
        position: relative;
        border-bottom: 1px solid #ccc;
    }
    .dynamics_content .dy_text{
        top:20px;
    }
    .dynamics_content p{
        position: relative;
        width: 349px;
        margin-right: 46px;
        line-height: 40px;
        float: right;
    }
    .dynamics_imgs{
        position: relative;
        width: 100%;
        min-height: 40px;
        padding: 12px 0;
        background: rgb(245,245,245);
    }
    .dynamics_imgs .dy_text{
        top: 20px;
    }
    .dynamics_imgs .dynamics_imgBox{
        font-size: 0;
        position: relative;
        width:351px;
        margin-right: 48px;
        margin-top: 3px;
        float: right;
    }
    .show_imgs{
        display: inline-block;
        margin: 6px;
        width: 105px;
        height: 105px;
        background: red;
    }
    .dynamics_contentBox{
        width: 100%;
        max-height: 470px;
        overflow: auto;
    }
    .dynamics_contentBox::-webkit-scrollbar {
        width: 10px;
        height: 4px;
        position: absolute;
        background-color: rgb(248,248,250);
        background: #ddd;
    }
    .dynamics_contentBox::-webkit-scrollbar-track {
        background: #ddd ;
    }
    /*定义滑块 内阴影+圆角*/
    .dynamics_contentBox::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color:#ccc;
    }
    .dynamics_contentBox::-webkit-scrollbar-thumb:hover {
        border-radius: 3px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color:rgba(7, 170, 247, 1);
    }

    .dynamics_num{
        height: 80px;
        color:rgba(167,167,167,1);
        position: relative;
    }
    .dynamics_num .praise_text{
        position: absolute;
        left: 50px;
        top: 28px;
    }
    .dynamics_num .comment_text{
        position: absolute;
        left: 275px;
        top: 28px;
    }
    .dynamics_num .praise_text .praise_num,.dynamics_num .comment_text .comment_num{
        margin-left: 28px;
        color: #000;
    }
</style>
