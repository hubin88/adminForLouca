<template>
    <div class="box">
        <!--        创建标签        -->
        <el-dialog title="创建标签" v-model="showCreate" size="tiny">
            <div class="list_box">
                <div class="list_label">标签名称</div>
                <div class="list_content">
                    <el-input v-model="create.words" style="width:240px;" placeholder="请输入标签名称"></el-input>
                </div>
                <div class="clear"></div>
            </div>

            <div class="list_box">
                <div class="list_label">标签分类</div>
                <div class="list_content">
                    <b>{{ create.kindWords[create.kind] }}</b>
                </div>
                <div class="clear"></div>
            </div>

            <div class="list_box" v-show="create.kind == '5'">
				<div class="list_label">图片</div>
				<div class="list_content">
					<my-unload mId="addLabelImg" :onSuccess="successUnload" :action="action" :onDelete="deleteUnload" :img="create.img"></my-unload>
				</div>
				<div class="clear"></div>
			</div>

            <div class="list_box" v-show="create.kind == '5'">
            	<div class="list_label">父标签ID</div>
            	<div class="list_content">
                    <el-input v-model="create.fatherId" style="width:240px;" placeholder="请输入父标签ID，没有为0"></el-input>
                </div>
                <div class="clear"></div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="showCreate = false">取 消</el-button>
                <el-button type="primary" @click="createNow">添 加</el-button>
            </div>
        </el-dialog>
        <delete v-if="showDelete" :checked="checked" :cancel="cancelDelete"
              :confirm="confirmDelete"></delete>
        <!--        标签排序        -->
        <el-dialog title="标签排序" v-model="showSort" size="tiny">
            <div class="list_box">
                <div class="list_label">排序数值</div>
                <div class="list_content">
                    <el-input-number v-model="sort.sort" :min="1" :max="100"></el-input-number>
                </div>
                <div class="clear"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showSort = false">取 消</el-button>
                <el-button type="primary" @click="sortNow">确 定</el-button>
            </div>
        </el-dialog>

        <el-tabs v-model="activeName">
            <!--      普通动态标签      -->
            <el-tab-pane label="普通动态标签" name="普通动态标签">
                <div class="search_box">
                    <div class="searchText">
                        <el-input placeholder="搜索标签名称" v-model="commonDL.selectKey.content"></el-input>
                    </div>
                    <el-button type="primary" @click="resetCommonDLData">搜索</el-button>
                </div>

                <div class="table_handle">
                    <el-button type="primary" @click="deleteLabel(commonDL.checked,'普通动态')" v-if="hasPrivileges('tag_delete')">删除</el-button>
                    <el-button style="visibility:hidden">占位</el-button>
                    <el-button type="success" style="float:right" @click="exportExcel('commonNews')">导出表格</el-button>
                    <el-button type="" style="float:right" @click="showCreateNow('3')" v-if="hasPrivileges('tag_add')">新建普通动态标签</el-button>
                </div>

                <!--    列表    -->
                <div class="table_box">
                    <table class="table" id="commonNews">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="commonDL.isIndeterminate" v-model="commonDL.isCheckedAll" @change="checkAllCommonDL($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>普通动态标签</th>
                                <th>关联动态标签</th>
                                <th>排序</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in commonDL.data">
                                <td>
                                    <el-checkbox
                                        v-model="commonDL.data[index].isChecked"
                                        class="check_btn" @change="checkOneCommonDL($event.target.checked,item.id)">
                                        {{item.id}}
                                    </el-checkbox>
                                </td>
                                <td>{{item.name}}</td>
                                <td>{{item.news}}</td>
                                <td>{{item.sort}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="showSortNow(item.id,'普通动态')" v-if="hasPrivileges('tag_update')">排序</a>
                                    <a href="javascript:void(0)" @click="deleteLabel(item.id,'普通动态')" v-if="hasPrivileges('tag_delete')">删除</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_control">
                        <el-pagination
                          @size-change="handleSizeChangeCommonDL"
                          @current-change="handleCurrentChangeCommonDL"
                          :current-page="commonDL.page.currentPage"
                          :page-sizes="commonDL.page.pageSizes"
                          :page-size="commonDL.page.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="commonDL.page.total">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>

            <!--      推荐动态标签      -->
            <el-tab-pane label="推荐动态标签" name="推荐动态标签" disabled>
                <div class="search_box">
                    <div class="searchText">
                        <el-input placeholder="搜索标签名称" v-model="recommendDL.selectKey.content"></el-input>
                    </div>
                    <el-button type="primary">搜索</el-button>
                </div>

                <div class="table_handle">
                    <el-button type="primary" v-if="hasPrivileges('tag_delete')">删除</el-button>
                    <el-button type="" style="float:right" v-if="hasPrivileges('tag_add')">新建推荐动态标签</el-button>
                </div>

                <!--    列表    -->
                <div class="table_box">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="recommendDL.isIndeterminate" v-model="recommendDL.isCheckedAll" @change="checkAllRecommendDL($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>推荐动态标签</th>
                                <th>简介</th>
                                <th>关联动态数量</th>
                                <th>排序</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in recommendDL.data">
                                <td>
                                    <el-checkbox
                                        v-model="recommendDL.data[index].isChecked"
                                        class="check_btn" @change="checkOneRecommendDL($event.target.checked,item.id)">
                                        {{item.id}}
                                    </el-checkbox>
                                </td>
                                <td>{{item.name}}</td>
                                <td>{{item.info}}</td>
                                <td>{{item.news}}</td>
                                <td>{{item.sort}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)">简介</a>
                                    <a href="javascript:void(0)" v-if="hasPrivileges('tag_update')">排序</a>
                                    <a href="javascript:void(0)" v-if="hasPrivileges('tag_delete')">删除</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_control">
<!--
                        <el-pagination
                          @size-change="handleSizeChangeCommonDL"
                          @current-change="handleCurrentChangeCommonDL"
                          :current-page="commonDL.page.currentPage"
                          :page-sizes="commonDL.page.pageSizes"
                          :page-size="commonDL.page.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="commonDL.page.total">
                        </el-pagination>
-->
                    </div>
                </div>
            </el-tab-pane>

            <!--      技能标签      -->
            <el-tab-pane label="技能标签" name="技能标签">
                <div class="search_box">
                    <div class="searchText">
                        <el-input placeholder="搜索标签名称" v-model="skillLabel.selectKey.content"></el-input>
                    </div>
                    <el-button type="primary">搜索</el-button>
                </div>

                <div class="table_handle">
                    <el-button type="primary" @click="deleteLabel(skillLabel.checked,'技能标签')" v-if="hasPrivileges('tag_delete')">删除</el-button>
                    <el-button style="visibility:hidden">占位</el-button>
                    <el-button type="success" style="float:right" @click="exportExcel('skill')">导出表格</el-button>
                    <el-button type="" style="float:right" @click="showCreateNow('2')" v-if="hasPrivileges('tag_add')">新建技能标签</el-button>
                </div>

                <!--    列表    -->
                <div class="table_box">
                    <table class="table" id="skill">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="skillLabel.isIndeterminate" v-model="skillLabel.isCheckedAll" @change="checkAllSkillLabel($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>技能标签</th>
                                <th>当前关联人数</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in skillLabel.data">
                                <td>
                                    <el-checkbox
                                        v-model="skillLabel.data[index].isChecked"
                                        class="check_btn" @change="checkOneSkillLabel($event.target.checked,item.id)">
                                        {{item.id}}
                                    </el-checkbox>
                                </td>
                                <td>{{item.name}}</td>
                                <td>{{item.members}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="deleteLabel(item.id,'技能标签')">删除</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_control">
                        <el-pagination
                          @size-change="handleSizeChangeSkillLabel"
                          @current-change="handleCurrentChangeSkillLabel"
                          :current-page="skillLabel.page.currentPage"
                          :page-sizes="skillLabel.page.pageSizes"
                          :page-size="skillLabel.page.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="skillLabel.page.total">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>

            <!--      兴趣标签      -->
            <el-tab-pane label="兴趣标签" name="兴趣标签">
                <div class="search_box">
                    <div class="searchText">
                        <el-input placeholder="搜索标签名称" v-model="interestLabel.selectKey.content"></el-input>
                    </div>
                    <el-button type="primary">搜索</el-button>
                </div>

                <div class="table_handle">
                    <el-button type="primary" @click="deleteLabel(interestLabel.checked,'兴趣标签')"  v-if="hasPrivileges('tag_delete')">删除</el-button>
                    <el-button style="visibility:hidden">占位</el-button>
                    <el-button type="success" style="float:right" @click="exportExcel('interest')">导出表格</el-button>
                    <el-button type="" style="float:right" @click="showCreateNow('1')"  v-if="hasPrivileges('tag_add')">新建兴趣标签</el-button>
                </div>

                <!--    列表    -->
                <div class="table_box">
                    <table class="table" id="interess">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="interestLabel.isIndeterminate" v-model="interestLabel.isCheckedAll" @change="checkAllInterestLabel($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>兴趣标签</th>
                                <th>当前关联人数</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in interestLabel.data">
                                <td>
                                    <el-checkbox
                                        v-model="interestLabel.data[index].isChecked"
                                        class="check_btn" @change="checkOneInterestLabel($event.target.checked,item.id)">
                                        {{item.id}}
                                    </el-checkbox>
                                </td>
                                <td>{{item.name}}</td>
                                <td>{{item.members}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="deleteLabel(item.id,'兴趣标签')"  v-if="hasPrivileges('tag_delete')">删除</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_control">
                       <el-pagination
                          @size-change="handleSizeChangeInterestLabel"
                          @current-change="handleCurrentChangeInterestLabel"
                          :current-page="interestLabel.page.currentPage"
                          :page-sizes="interestLabel.page.pageSizes"
                          :page-size="interestLabel.page.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="interestLabel.page.total">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>

            <!--      聚会标签      -->
            <el-tab-pane label="聚会标签" name="聚会标签">
                <div class="search_box">
                    <div class="searchText">
                        <el-input placeholder="搜索标签名称" v-model="partyLabel.selectKey.content"></el-input>
                    </div>
                    <el-button type="primary">搜索</el-button>
                </div>

                <div class="table_handle">
                    <el-button type="primary" @click="deleteLabel(partyLabel.checked,'聚会标签')"  v-if="hasPrivileges('tag_delete')">删除</el-button>
                    <el-button style="visibility:hidden">占位</el-button>
                    <el-button type="success" style="float:right" @click="exportExcel('party')">导出表格</el-button>
                    <el-button type="" style="float:right" @click="showCreateNow('4')"  v-if="hasPrivileges('tag_add')">新建聚会标签</el-button>
                </div>

                <!--    列表    -->
                <div class="table_box">
                    <table class="table" id="party">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="partyLabel.isIndeterminate" v-model="partyLabel.isCheckedAll" @change="checkAllPartyLabel($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>聚会标签</th>
                                <th>关联聚会数量</th>
                                <th>排序</th>
                                <th>聚会口号</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in partyLabel.data">
                                <td>
                                    <el-checkbox
                                        v-model="partyLabel.data[index].isChecked"
                                        class="check_btn" @change="checkOnePartyLabel($event.target.checked,item.id)">
                                        {{item.id}}
                                    </el-checkbox>
                                </td>
                                <td>{{item.name}}</td>
                                <td>{{item.partyNum}}</td>
                                <td>{{item.sort}}</td>
                                <td style="max-width:300px;">
                                    <el-tag
                                      :type="tagType[Math.floor(tag.id%4+2)]"
                                      :key="tag"
                                      v-for="tag in item.slogans"
                                      :closable="true"
                                      :close-transition="false"
                                      style="margin:2px 4px;fontSize: 16px;"
                                      @close="closeSloganNow(tag.id)"
                                    >
                                    {{tag.slogan}}
                                    </el-tag>
                                </td>
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="showSortNow(item.id,'聚会标签')"  v-if="hasPrivileges('tag_update')">排序</a>
                                    <a href="javascript:void(0)" @click="showAddSloganNow(item.id)"  v-if="hasPrivileges('tag_update')">添加口号</a>
                                    <a href="javascript:void(0)" @click="deleteLabel(item.id,'聚会标签')"  v-if="hasPrivileges('tag_delete')">删除</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_control">
                        <el-pagination
                          @size-change="handleSizeChangePartyLabel"
                          @current-change="handleCurrentChangePartyLabel"
                          :current-page="partyLabel.page.currentPage"
                          :page-sizes="partyLabel.page.pageSizes"
                          :page-size="partyLabel.page.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="partyLabel.page.total">
                        </el-pagination>
                    </div>
                    <!--        添加口号        -->
                    <el-dialog title="添加口号" v-model="showAddSlogan" size="tiny">
                        <div class="list_box">
                            <div class="list_label">口号</div>
                            <div class="list_content">
                                <el-input v-model="slogan.content" placeholder="输入口号内容"></el-input>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="showAddSlogan = false">取 消</el-button>
                            <el-button type="primary" @click="addSloganNow">确 定</el-button>
                        </div>
                    </el-dialog>
                </div>
            </el-tab-pane>

            <!--      服务标签      -->
            <el-tab-pane label="服务标签" name="服务标签">
                <div class="search_box">
                    <div class="searchText">
                        <el-input placeholder="搜索标签名称" v-model="serviceLabel.selectKey.content"></el-input>
                    </div>
                    <el-button type="primary" @click="resetServiceLabelData">搜索</el-button>
                </div>

                <div class="table_handle">
                    <el-button type="danger" @click="deleteLabel(serviceLabel.checked,'服务标签')"  v-if="hasPrivileges('tag_delete')">删除</el-button>
                    <el-button style="visibility:hidden">占位</el-button>
                    <el-button type="success" style="float:right" @click="exportExcel('interest')">导出表格</el-button>
                    <el-button type="" style="float:right" @click="showCreateNow('5')"  v-if="hasPrivileges('tag_add')">新建服务标签</el-button>
                </div>

                <!--    列表    -->
                <div class="table_box">
                    <table class="table" id="interes">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="serviceLabel.isIndeterminate" v-model="serviceLabel.isCheckedAll" @change="checkAllServiceLabel($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>服务标签</th>
								<th>当前关联人数</th>
								<th>子标签数</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in serviceLabel.data">
                                <td>
                                    <el-checkbox
                                        v-model="serviceLabel.data[index].isChecked"
                                        class="check_btn" @change="checkOneServiceLabel($event.target.checked,item.id)">
                                        {{item.id}}
                                    </el-checkbox>
                                </td>
                                <td>{{item.name}}</td>
                                <td>{{item.members}}</td>
                                <td>{{item.contain}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="showChildrenNow(item.id)">查看</a>
                                    <a href="javascript:void(0)" @click="deleteLabel(item.id,'服务标签')" v-if="hasPrivileges('tag_delete')">删除</a>
<!--                                    <a href="javascript:void(0)" @click="editLabel(item.id)">编辑</a>-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_control">
                       <el-pagination
                          @size-change="handleSizeChangeServiceLabel"
                          @current-change="handleCurrentChangeServiceLabel"
                          :current-page="serviceLabel.page.currentPage"
                          :page-sizes="serviceLabel.page.pageSizes"
                          :page-size="serviceLabel.page.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="serviceLabel.page.total">
                        </el-pagination>
                    </div>
                </div>

				<!--        子标签        -->
           		<el-dialog title="服务子标签" v-model="showChildren">
				  <el-table :data="children">
					<el-table-column property="tagId" label="ID" width="150"></el-table-column>
					<el-table-column property="name" label="名称" width="200"></el-table-column>
					<el-table-column property="" label="操作">
						<template scope="scope">
							<a href="javascript:void(0)" style="color:#20A0FF" @click="deleteLabel(children[scope.$index].tagId,'服务子标签')" v-if="hasPrivileges('tag_delete')">删除</a>
						</template>
					</el-table-column>
				  </el-table>
				</el-dialog>



            </el-tab-pane>
        </el-tabs>


    </div>
</template>

<script>
export default {
    name: 'label',
    data () {
        return {
          deleteKind:"",
          checked:[],
            tagType:['','gray','primary','success','warning','danger'],
			children:[],
            activeName:'普通动态标签',
            // 添加口号
            showAddSlogan:false,
          showDelete:false,
			showChildren: false,
			showEditChildren: false,
            slogan:{
                tagId:'',
                content:'',
            },
            // 创建标签
            showCreate:false,
            showSort:false,
            create:{
                kind: '1',
                userId: '',
                words: '',
				img:[],
				fatherId:'',
                kindWords: ['错误','兴趣','技能','动态','聚会','服务']
            },
            sort:{
                id:'',
                sort:'',
                kind:'',
            },
			action:'',
            // 普通动态标签 commonDynamicsLabel
            commonDL:{
                page:{
                    currentPage:1,
                    pageSizes:[10,20,50,100,200,500,1000],
                    pageSize:10,
                    total:0
                },
                isIndeterminate:false,
                isCheckedAll:false,
                checked:[],
                selectKey:{
                    content:'',
                },
                selectScope:{},
                data:[],
            },
            // 推荐动态标签 recommendDynamicsLabel
            recommendDL:{
                page:{
                    currentPage:1,
                    pageSizes:[10,20,50,100,200,500,1000],
                    pageSize:10,
                    total:0
                },
                isIndeterminate:false,
                isCheckedAll:false,
                checked:[],
                selectKey:{
                    content:'',
                },
                selectScope:{},
                data:[
                    {
                        id: 0,
                        name: '《你的名字》',
                        info: '《你的名字》是由新海诚执导的一部日本动画...',
                        news: 1132,
                        sort: 9,
                        isChecked:false,
                    },
                ],
            },

            // 技能标签 skillLabel
            skillLabel:{
                page:{
                    currentPage:1,
                    pageSizes:[10,20,50,100,200,500,1000],
                    pageSize:10,
                    total:0
                },
                isIndeterminate:false,
                isCheckedAll:false,
                checked:[],
                selectKey:{
                    content:'',
                },
                selectScope:{},
                data:[],
            },

            // 兴趣标签 interestLabel
            interestLabel:{
                page:{
                    currentPage:1,
                    pageSizes:[10,20,50,100,200,500,1000],
                    pageSize:10,
                    total:0
                },
                isIndeterminate:false,
                isCheckedAll:false,
                checked:[],
                selectKey:{
                    content:'',
                },
                selectScope:{},
                data:[],
            },

            // 聚会标签 partyLabel
            partyLabel:{
                page:{
                    currentPage:1,
                    pageSizes:[10,20,50,100,200,500,1000],
                    pageSize:10,
                    total:0
                },
                isIndeterminate:false,
                isCheckedAll:false,
                checked:[],
                selectKey:{
                    content:'',
                },
                selectScope:{},
                data:[],
            },


            // 服务标签 service
            serviceLabel:{
                page:{
                    currentPage:1,
                    pageSizes:[10,20,50,100,200,500,1000],
                    pageSize:10,
                    total:0
                },
                isIndeterminate:false,
                isCheckedAll:false,
                checked:[],
                selectKey:{
                    content:'',
                },
                selectScope:{},
                data:[],
            },
        }
    },
    mounted: function(){
        var that = this;
        this.action = 'http://'+global.URL+'/v1/file/upload?kind=11';
        this.create.userId = JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).userId;
        //普通动态标签
        this.$http.get('http://'+ global.URL +'/v1/tag/newsletter/list?page='+ that.commonDL.page.currentPage+'&limit='+ that.commonDL.page.pageSize).then((response) => {
            if(response.body.code == 200 || response.body.code == 201){
                    var arr = response.body.list;
                    that.commonDL.page.total = response.body.total;

                    for(let i = 0, length = arr.length;i < length; i++){
                        let o = {
                            id: arr[i].tagId,
                            name: arr[i].name,
                            news: arr[i].usages,
                            sort: arr[i].sort,
                            isChecked: false,
                        }
                        this.commonDL.data.push(o)
                    }
                }
        });

        //技能标签
        this.$http.get('http://'+ global.URL +'/v1/tag/skil/list?page='+ that.skillLabel.page.currentPage+'&limit='+ that.skillLabel.page.pageSize).then((response) => {
            if(response.body.code == 200 || response.body.code == 201){
                var arr = response.body.list;
                that.skillLabel.page.total = response.body.total;

                for(let i = 0, length = arr.length;i < length; i++){
                    let o = {
                        id: arr[i].tagId,
                        name: arr[i].name,
                        members: arr[i].usages,
                        isChecked: false,
                    }
                    this.skillLabel.data.push(o)
                }
            }
        });

        //兴趣标签
        this.$http.get('http://'+ global.URL +'/v1/tag/intersty/list?page='+ that.interestLabel.page.currentPage+'&limit='+ that.interestLabel.page.pageSize).then((response) => {
            if(response.body.code == 200 || response.body.code == 201){
                var arr = response.body.list;
                that.interestLabel.page.total = response.body.total;

                for(let i = 0, length = arr.length;i < length; i++){
                    let o = {
                        id: arr[i].tagId,
                        name: arr[i].name,
                        members: arr[i].usages,
                        isChecked:false,
                    }
                    this.interestLabel.data.push(o)
                }
            }
        });

        //聚会标签
        this.$http.get('http://'+ global.URL +'/v1/tag/partying/list?page='+ that.partyLabel.page.currentPage+'&limit='+ that.partyLabel.page.pageSize).then((response) => {
            if(response.body.code == 200 || response.body.code == 201){
                var arr = response.body.list;
                that.partyLabel.page.total = response.body.total;
                for(let i = 0, length = arr.length;i < length; i++){
                    let o = {
                        id: arr[i].tagId,
                        name: arr[i].name,
                        partyNum: arr[i].usages,
                        sort: arr[i].sort,
                        slogans: arr[i].slogans?arr[i].slogans:[],
                        isChecked:false,
                    }
                    this.partyLabel.data.push(o)
                }
            }
        });

		//服务标签
        this.$http.get('http://'+ global.URL +'/v1/tag/service/list?page='+ that.serviceLabel.page.currentPage+'&limit='+ that.serviceLabel.page.pageSize).then((response) => {
            if(response.body.code == 200 || response.body.code == 201){
                var arr = response.body.list;
                that.serviceLabel.page.total = response.body.total;
                for(let i = 0, length = arr.length;i < length; i++){
                    let o = {
                        id: arr[i].tagId,
                        name: arr[i].name,
                        members: arr[i].usages,
						sort: arr[i].sort,
						contain: arr[i].subTagNum,
                        isChecked:false,
                    }
                    this.serviceLabel.data.push(o)
                }
            }
        });

        (function init(){
            $('.el-tabs__header').css({
                background:'white'
            })
            $('.searchText .el-input-group__prepend .el-input__inner').css({
                width:'100px'
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
        //删除标签
        deleteLabel(o,kind){
          this.deleteKind=kind;
          this.checked=[];
          if (typeof o == 'object' && o.length > 0) {
            this.checked = o.join(',');
            this.showDelete = true
          } else if (typeof o == 'number') {
            this.checked = o.toString();
            this.showDelete = true
          }
        },
      cancelDelete(){
          this.showDelete=false;
        switch(this.deleteKind){
          case '普通动态':this.resetCommonDLData();break;
          case '推荐动态':;break;
          case '技能标签':this.resetSkillLabelData();break;
          case '兴趣标签':this.resetInterestLabelData();break;
          case '聚会标签':this.resetPartyLabelData();break;
          case '服务标签':this.resetServiceLabelData();break;
          case '服务子标签':this.showChildren = false;break;
          default:;
        }
      },
      confirmDelete(id){
        this.$http.delete('http://'+ global.URL +'/v1/tag?ids='+id).then((res) => {
          console.log(res)
        if(res.body.code == 200){
          this.showDelete=false;
          this.$message('删除成功');
          switch(this.deleteKind){
            case '普通动态':this.resetCommonDLData();break;
            case '推荐动态':;break;
            case '技能标签':this.resetSkillLabelData();break;
            case '兴趣标签':this.resetInterestLabelData();break;
            case '聚会标签':this.resetPartyLabelData();break;
            case '服务标签':this.resetServiceLabelData();break;
            case '服务子标签':this.showChildren = false;break;
            default:;
          }
        }
      })
      },
        resetCommonDLData(){
            this.commonDL.data = [];
            this.commonDL.checked = [];
            this.commonDL.isIndeterminate = false;
            this.commonDL.isCheckedAll = false;
            var that = this;
            var parameter = '';

            //console.log(parameter)
            this.$http.get('http://'+ global.URL +'/v1/tag/newsletter/list?page='+ that.commonDL.page.currentPage+'&limit='+ that.commonDL.page.pageSize + parameter).then((response) => {
                if(response.body.code == 200 || response.body.code == 201){
                    var arr = response.body.list;
                    that.commonDL.page.total = response.body.total;

                    for(let i = 0, length = arr.length;i < length; i++){
                        let o = {
                            id: arr[i].tagId,
                            name: arr[i].name,
                            news: arr[i].usages,
                            sort: arr[i].sort,
                            isChecked: false,
                        }
                        this.commonDL.data.push(o)
                    }
                }
            })
        },
        resetSkillLabelData(){
            this.skillLabel.data = [];
            this.skillLabel.checked = [];
            this.skillLabel.isIndeterminate = false;
            this.skillLabel.isCheckedAll = false;
            var that = this;
            var parameter = '';
            console.log(parameter)
            this.$http.get('http://'+ global.URL +'/v1/tag/skil/list?page='+ that.skillLabel.page.currentPage+'&limit='+ that.skillLabel.page.pageSize + parameter).then((response) => {
                console.log(response)
                if(response.body.code == 200 || response.body.code == 201){
                    var arr = response.body.list;
                    that.skillLabel.page.total = response.body.total;

                    for(let i = 0, length = arr.length;i < length; i++){
                        let o = {
                            id: arr[i].tagId,
                            name: arr[i].name,
                            members: arr[i].usages,
                            isChecked: false,
                        }
                        this.skillLabel.data.push(o)
                    }
                }
            })
        },
        resetInterestLabelData(){
            this.interestLabel.data = [];
            this.interestLabel.checked = [];
            this.interestLabel.isIndeterminate = false;
            this.interestLabel.isCheckedAll = false;
            var that = this;
            var parameter = '';

            console.log(parameter)
            this.$http.get('http://'+ global.URL +'/v1/tag/intersty/list?page='+ that.interestLabel.page.currentPage+'&limit='+ that.interestLabel.page.pageSize + parameter).then((response) => {
            console.log(response)
                if(response.body.code == 200 || response.body.code == 201){
                    var arr = response.body.list;
                    that.interestLabel.page.total = response.body.total;

                    for(let i = 0, length = arr.length;i < length; i++){
                        let o = {
                            id: arr[i].tagId,
                            name: arr[i].name,
                            members: arr[i].usages,
                            isChecked:false,
                        }
                        this.interestLabel.data.push(o)
                    }
                }
            })
        },
        resetPartyLabelData(){
            this.partyLabel.data = [];
            this.partyLabel.checked = [];
            this.partyLabel.isIndeterminate = false;
            this.partyLabel.isCheckedAll = false;
            var that = this;
            var parameter = '';

            console.log(parameter)
            this.$http.get('http://'+ global.URL +'/v1/tag/partying/list?page='+ that.partyLabel.page.currentPage+'&limit='+ that.partyLabel.page.pageSize + parameter).then((response) => {
            console.log(response)
                if(response.body.code == 200 || response.body.code == 201){
                    var arr = response.body.list;
                    that.partyLabel.page.total = response.body.total;

                    for(let i = 0, length = arr.length;i < length; i++){
                        let o = {
                            id: arr[i].tagId,
                            name: arr[i].name,
                            partyNum: arr[i].usages,
                            sort: arr[i].sort,
                            slogans: arr[i].slogans?arr[i].slogans:'',
                            isChecked:false,
                        }
                        this.partyLabel.data.push(o)
                    }
                }
            })
        },
        resetServiceLabelData(){
            this.serviceLabel.data = [];
            this.serviceLabel.checked = [];
            this.serviceLabel.isIndeterminate = false;
            this.serviceLabel.isCheckedAll = false;
            var that = this;
            var parameter = '';

            console.log(parameter)
            this.$http.get('http://'+ global.URL +'/v1/tag/service/list?page='+ that.serviceLabel.page.currentPage+'&limit='+ that.serviceLabel.page.pageSize + parameter).then((response) => {
            console.log(response)
                if(response.body.code == 200 || response.body.code == 201){
                    var arr = response.body.list;
                    that.serviceLabel.page.total = response.body.total;

                    for(let i = 0, length = arr.length;i < length; i++){
                        let o = {
                            id: arr[i].tagId,
                            name: arr[i].name,
                            members: arr[i].usages,
							contain: arr[i].subTagNum,
                            isChecked:false,
                        }
                        this.serviceLabel.data.push(o)
                    }
                }
            })
        },

        checkAllCommonDL:function(isChecked){
            this.commonDL.checked = [];
            if(isChecked){
                console.log('aaa')
                for(let i = 0; i < this.commonDL.data.length; i++){
                    this.commonDL.data[i].isChecked = true;
                    this.commonDL.checked.push(this.commonDL.data[i].id)
                }
            }else{
                for(let i = 0; i < this.commonDL.data.length; i++){
                    this.commonDL.data[i].isChecked = false;
                }
            }
            this.commonDL.isIndeterminate = false;

        },
        checkOneCommonDL:function(isChecked,id){
            if(isChecked){
                this.commonDL.checked.push(id)
            }else{
                for(let i = 0; i < this.commonDL.checked.length; i++){
                    if(this.commonDL.checked[i] == id){
                        this.commonDL.checked.splice(i,1)
                    }
                }
            }
            if(this.commonDL.checked.length == this.commonDL.data.length){
                this.commonDL.isIndeterminate = false;
                this.commonDL.isCheckedAll = true;
            }else if(this.commonDL.checked.length == 0){
                this.commonDL.isIndeterminate = false;
                this.commonDL.isCheckedAll = false;
            }else{
                this.commonDL.isIndeterminate = true;
            }
            console.log(this.commonDL.checked)
        },
        checkAllRecommendDL:function(isChecked){
            this.recommendDL.checked = [];
            if(isChecked){
                console.log('aaa')
                for(let i = 0; i < this.recommendDL.data.length; i++){
                    this.recommendDL.data[i].isChecked = true;
                    this.recommendDL.checked.push(this.recommendDL.data[i].id)
                }
            }else{
                for(let i = 0; i < this.recommendDL.data.length; i++){
                    this.recommendDL.data[i].isChecked = false;
                }
            }
            this.recommendDL.isIndeterminate = false;

        },
        checkOneRecommendDL:function(isChecked,id){
            if(isChecked){
                this.recommendDL.checked.push(id)
            }else{
                for(let i = 0; i < this.recommendDL.checked.length; i++){
                    if(this.recommendDL.checked[i] == id){
                        this.recommendDL.checked.splice(i,1)
                    }
                }
            }
            if(this.recommendDL.checked.length == this.recommendDL.data.length){
                this.recommendDL.isIndeterminate = false;
                this.recommendDL.isCheckedAll = true;
            }else if(this.recommendDL.checked.length == 0){
                this.recommendDL.isIndeterminate = false;
                this.recommendDL.isCheckedAll = false;
            }else{
                this.recommendDL.isIndeterminate = true;
            }
            console.log(this.recommendDL.checked)
        },
        checkAllSkillLabel:function(isChecked){
            this.skillLabel.checked = [];
            if(isChecked){
                console.log('aaa')
                for(let i = 0; i < this.skillLabel.data.length; i++){
                    this.skillLabel.data[i].isChecked = true;
                    this.skillLabel.checked.push(this.skillLabel.data[i].id)
                }
            }else{
                for(let i = 0; i < this.skillLabel.data.length; i++){
                    this.skillLabel.data[i].isChecked = false;
                }
            }
            this.skillLabel.isIndeterminate = false;

        },
        checkOneSkillLabel:function(isChecked,id){
            if(isChecked){
                this.skillLabel.checked.push(id)
            }else{
                for(let i = 0; i < this.skillLabel.checked.length; i++){
                    if(this.skillLabel.checked[i] == id){
                        this.skillLabel.checked.splice(i,1)
                    }
                }
            }
            if(this.skillLabel.checked.length == this.skillLabel.data.length){
                this.skillLabel.isIndeterminate = false;
                this.skillLabel.isCheckedAll = true;
            }else if(this.skillLabel.checked.length == 0){
                this.skillLabel.isIndeterminate = false;
                this.skillLabel.isCheckedAll = false;
            }else{
                this.skillLabel.isIndeterminate = true;
            }
            console.log(this.skillLabel.checked)
        },
        checkAllInterestLabel:function(isChecked){
            this.interestLabel.checked = [];
            if(isChecked){
                console.log('aaa')
                for(let i = 0; i < this.interestLabel.data.length; i++){
                    this.interestLabel.data[i].isChecked = true;
                    this.interestLabel.checked.push(this.interestLabel.data[i].id)
                }
            }else{
                for(let i = 0; i < this.interestLabel.data.length; i++){
                    this.interestLabel.data[i].isChecked = false;
                }
            }
            this.interestLabel.isIndeterminate = false;

        },
        checkOneInterestLabel:function(isChecked,id){
            if(isChecked){
                this.interestLabel.checked.push(id)
            }else{
                for(let i = 0; i < this.interestLabel.checked.length; i++){
                    if(this.interestLabel.checked[i] == id){
                        this.interestLabel.checked.splice(i,1)
                    }
                }
            }
            if(this.interestLabel.checked.length == this.interestLabel.data.length){
                this.interestLabel.isIndeterminate = false;
                this.interestLabel.isCheckedAll = true;
            }else if(this.interestLabel.checked.length == 0){
                this.interestLabel.isIndeterminate = false;
                this.interestLabel.isCheckedAll = false;
            }else{
                this.interestLabel.isIndeterminate = true;
            }
            console.log(this.interestLabel.checked)
        },
        checkAllPartyLabel:function(isChecked){
            this.partyLabel.checked = [];
            if(isChecked){
                console.log('aaa')
                for(let i = 0; i < this.partyLabel.data.length; i++){
                    this.partyLabel.data[i].isChecked = true;
                    this.partyLabel.checked.push(this.partyLabel.data[i].id)
                }
            }else{
                for(let i = 0; i < this.partyLabel.data.length; i++){
                    this.partyLabel.data[i].isChecked = false;
                }
            }
            this.partyLabel.isIndeterminate = false;

        },
        checkOnePartyLabel:function(isChecked,id){
            if(isChecked){
                this.partyLabel.checked.push(id)
            }else{
                for(let i = 0; i < this.partyLabel.checked.length; i++){
                    if(this.partyLabel.checked[i] == id){
                        this.partyLabel.checked.splice(i,1)
                    }
                }
            }
            if(this.partyLabel.checked.length == this.partyLabel.data.length){
                this.partyLabel.isIndeterminate = false;
                this.partyLabel.isCheckedAll = true;
            }else if(this.partyLabel.checked.length == 0){
                this.partyLabel.isIndeterminate = false;
                this.partyLabel.isCheckedAll = false;
            }else{
                this.partyLabel.isIndeterminate = true;
            }
            console.log(this.partyLabel.checked)
        },
		checkAllServiceLabel:function(isChecked){
            this.serviceLabel.checked = [];
            if(isChecked){
                console.log('aaa')
                for(let i = 0; i < this.serviceLabel.data.length; i++){
                    this.serviceLabel.data[i].isChecked = true;
                    this.serviceLabel.checked.push(this.serviceLabel.data[i].id)
                }
            }else{
                for(let i = 0; i < this.serviceLabel.data.length; i++){
                    this.serviceLabel.data[i].isChecked = false;
                }
            }
            this.serviceLabel.isIndeterminate = false;

        },
        checkOneServiceLabel:function(isChecked,id){
            if(isChecked){
                this.serviceLabel.checked.push(id)
            }else{
                for(let i = 0; i < this.serviceLabel.checked.length; i++){
                    if(this.serviceLabel.checked[i] == id){
                        this.serviceLabel.checked.splice(i,1)
                    }
                }
            }
            if(this.serviceLabel.checked.length == this.serviceLabel.data.length){
                this.serviceLabel.isIndeterminate = false;
                this.serviceLabel.isCheckedAll = true;
            }else if(this.serviceLabel.checked.length == 0){
                this.serviceLabel.isIndeterminate = false;
                this.serviceLabel.isCheckedAll = false;
            }else{
                this.serviceLabel.isIndeterminate = true;
            }
            console.log(this.serviceLabel.checked)
        },
        // 换页函数
        handleSizeChangeCommonDL(val){
            this.commonDL.page.pageSize = val;
            this.resetCommonDLData();
        },
        handleCurrentChangeCommonDL(val){
            this.commonDL.page.currentPage = val;
            this.resetCommonDLData();
        },
        //
        handleSizeChangeSkillLabel(val){
            this.skillLabel.page.pageSize = val;
            this.resetSkillLabelData();
        },
        handleCurrentChangeSkillLabel(val){
            this.skillLabel.page.currentPage = val;
            this.resetSkillLabelData();
        },
        //
        handleSizeChangeInterestLabel(val){
            this.interestLabel.page.pageSize = val;
            this.resetInterestLabelData();
        },
        handleCurrentChangeInterestLabel(val){
            this.interestLabel.page.currentPage = val;
            this.resetInterestLabelData();
        },
        //
        handleSizeChangePartyLabel(val){
            this.partyLabel.page.pageSize = val;
            this.resetPartyLabelData();
        },
        handleCurrentChangePartyLabel(val){
            this.partyLabel.page.currentPage = val;
            this.resetPartyLabelData();
        },
        //
        handleSizeChangeServiceLabel(val){
            this.serviceLabel.page.pageSize = val;
            this.resetServiceLabelData();
        },
        handleCurrentChangeServiceLabel(val){
            this.serviceLabel.page.currentPage = val;
            this.resetServiceLabelData();
        },

        // 创建标签
        showCreateNow(o){
            this.create.kind = o;
            this.showCreate = true;
        },
        createNow(){
            var o = {
                kind: this.create.kind,
                userId: this.create.userId,
                words: this.create.words,
				photo: this.create.img[0]
            }
			if(this.create.fatherId != ''){
				o.parentId = this.create.fatherId;
			}
            console.log(o)
            this.$http.post('http://'+global.URL+'/v1/tag',o).then((res) => {
                console.log(res)
                if(res.body.code == 200 || res.body.code == 201){
                    this.$message('操作成功');
                    switch(this.create.kind){
                        case '3':this.resetCommonDLData();break;
                        case '2':this.resetSkillLabelData();break;
                        case '1':this.resetInterestLabelData();break;
                        case '4':this.resetPartyLabelData();break;
                        case '5':this.resetServiceLabelData();break;
                        default:;
                    }
                }else{
                    this.$message(res.body.message)
                }
            })
            this.showCreate = false;
        },
        // 标签排序
        showSortNow(id,kind){
            this.showSort = true;
            this.sort.id = id;
            this.sort.kind = kind;
        },
        sortNow(){
            var o = {
              "sort": this.sort.sort,
              "tagId": this.sort.id
            }
            this.$http.put('http://'+ global.URL +'/v1/tag',o).then((res) => {
                if(res.body.code == 200 || res.body.code == 201){
                    this.$message('操作成功');
                    switch(this.sort.kind){
                        case '普通动态':this.resetCommonDLData();break;
                        case '推荐动态':;break;
                        case '技能标签':this.resetSkillLabelData();break;
                        case '兴趣标签':this.resetInterestLabelData();break;
                        case '聚会标签':this.resetPartyLabelData();break;
                        default:;
                    }
                }else{
                    this.$message(res.body.message)
                }
            })
            this.showSort = false;
        },
        // 删除口号
        closeSloganNow(id){
            console.log(id);
            this.$http.delete('http://'+ global.URL +'/v1/tag?ids='+ id).then((res) => {
                if(res.body.code == 200 || res.body.code == 201){
                    this.$message('操作成功')
                }else{
                    this.$message(res.body.message)
                }
            })
            this.resetPartyLabelData();
        },
        // 添加口号
        addSloganNow(){
            var sender = JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).userId;
            console.log(sender)
            var o = {
              "contents": [
                this.slogan.content
              ],
              "tagId": this.slogan.tagId,
              "userId": sender
            }

            this.$http.post('http://'+ global.URL +'/v1/Slogan',o).then((res) => {
                if(res.body.code == 200 || res.body.code == 201){
                    this.$message('添加成功');
                }else{
                    this.$message(res.body.message)
                }
            })
            this.showAddSlogan = false;
            this.resetPartyLabelData();
        },
        showAddSloganNow(o){
            this.showAddSlogan = true;
            this.slogan.tagId = o;
        },
        successUnload(img,arr){
            console.log(arr)
            this.create.img = arr;
        },
        deleteUnload(img,arr){
            console.log(arr)
            this.create.img = arr;
        },

		// 查看服务子标签
		showChildrenNow(o){
			this.showChildren = true;
			this.$http.get('http://'+ global.URL + '/v1/tag/service/subTag/list?limit=999&tagId='+ o).then( res => {
				if(res.body.code == 200 || res.body.code == 201){
					this.children = res.body.list;
				}
			})
		},
		showEidtChildren(o){
			console.log(o)
		}

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
        width:340px;
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
        createLabel
    */

    .list_box{
        width: 96%;
        padding: 6px 2%;
    }
    .list_label{
        line-height: 36px;
        width: 80px;
        float:left;
    }
    .list_content{
        width: 240px;
        float:left;
        line-height: 36px;
    }
</style>
