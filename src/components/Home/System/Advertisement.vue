<template>
    <div class="box">
        <el-tabs v-model="activeName">
            <!--      放大图片      -->
            <el-dialog v-model="cAScope.dialogVisible" size="tiny">
                <img width="100%" :src="cAContent.url" alt="">
            </el-dialog>
            <!--      搜索      -->
            <el-tab-pane label="全部广告" name="全部广告">
                <div class="search_box">
<!--
                    <el-select v-model="selectKey.type" clearable placeholder="选择类型">
                        <el-option
                            v-for="item in selectScope.type"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
-->
                    <el-select v-model="selectKey.state" clearable placeholder="状态">
                        <el-option
                            v-for="item in selectScope.state"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
<!--
                    <div class="searchText">
                        <el-input placeholder="搜索广告名称" v-model="selectKey.content"></el-input>
                    </div>
-->
                    <el-button type="primary" @click="resetAdvertisementData">搜索</el-button>
                </div>

                <div class="table_handle">
                    <el-button type="danger" @click="changeStateAD(checked,'7')"  v-if="hasPrivileges('place_manage')">删除</el-button>
                    <el-button style="visibility:hidden">占位</el-button>
                    <el-button type="success" style="float:right" @click="exportExcel('advertisement')">导出表格</el-button>
                    <el-button type="" style="float:right" @click="createAdvertisement=true" v-if="hasPrivileges('plan_add')">创建广告</el-button>
                </div>

                <el-dialog title="创建广告" v-model="createAdvertisement">
                    <div class="list_box">
                        <div class="list_label">投放位置</div>
                        <div class="list_content">
                            <el-select v-model="cAContent.type" clearable placeholder="广告位">
                                <el-option
                                    v-for="item in cAScope.type"
                                    :label="item.label"
                                    :value="item.value">
                                    <span style="float:left">{{ item.label }}</span>
                                    <span style="float:right;color:#ccc">{{ item.value }}</span>
                                </el-option>
                            </el-select>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label img_label">投放计划</div>
                        <div class="list_content">
                            <el-input v-model="cAContent.name" placeholder="广告投放计划标题" style="width:240px"></el-input>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label img_label">广告物料</div>
                        <div class="list_content">
                          <el-select v-model="cAContent.material" clearable placeholder="请选择广告材料">
                            <el-option
                              v-for="item in cAContent.materials"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                    	<div class="list_label">全部平台</div>
                    	<div class="list_content"></div>
                            <el-switch
							  v-model="cAContent.scope.all"
							  on-text=""
							  off-text="">
							</el-switch>
                        <div class="clear"></div>
                    </div>
                    <div class="list_box" v-show="cAContent.scope.all == false">
                        <div class="list_label">投放区域</div>
                        <div class="list_content"></div>
                        <el-select v-model="selectScope.value" multiple placeholder="选择投放商圈" style="width:240px;">
                                                    <el-option
                                                        v-for="item in selectScope.area"
                                                        :label="item.label"
                                                        :value="item.value">
                                                    </el-option>
                                                </el-select>
<!--                 <el-input v-model="cAContent.scope.regionId" style="width:240px;" placeholder="请输入投放商圈 id，以逗号分隔"></el-input>
                        -->
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">时间</div>
                        <div class="list_content">
                            <el-date-picker
                              v-model="cAContent.time"
                              type="datetimerange"
                              placeholder="选择时间范围">
                            </el-date-picker>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">排序</div>
                        <div class="list_content">
                            <el-input-number v-model="cAContent.sort" :min="1" :max="9"></el-input-number>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">状态</div>
                        <div class="list_content">
                            <el-radio class="radio" v-model="cAContent.state" label="1">上线</el-radio>
                            <el-radio class="radio" v-model="cAContent.state" label="0">下线</el-radio>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div slot="footer" class="dialog-footer">
                        <el-button @click="createAdvertisement = false">取 消</el-button>
                        <el-button type="primary" @click="createAD">发 布</el-button>
                    </div>
                </el-dialog>
              <delete v-if="showDelete" :checked="checked" :cancel="cancelDelete"
                      :confirm="confirmDelete"></delete>
                <!--        编辑广告        -->
                <el-dialog title="编辑广告" v-model="showEditAD">
                    <div class="list_box">
                        <div class="list_label">投放位置</div>
                        <div class="list_content">
                            <el-select v-model="editAContent.type" clearable placeholder="广告位">
                                <el-option
                                    v-for="item in cAScope.type"
                                    :label="item.label"
                                    :value="item.value">
                                    <span style="float:left">{{ item.label }}</span>
                                    <span style="float:right;color:#ccc">{{ item.value }}</span>
                                </el-option>
                            </el-select>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label img_label">投放计划</div>
                        <div class="list_content">
                            <el-input v-model="editAContent.name" placeholder="广告投放计划标题" style="width:240px"></el-input>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label img_label">广告物料</div>
                        <div class="list_content">
                            <el-input v-model="editAContent.material" placeholder="请输入材料 id" style="width:240px"></el-input>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                    	<div class="list_label">全部平台</div>
                    	<div class="list_content"></div>
                            <el-switch
							  v-model="editAContent.scope.all"
							  on-text=""
							  off-text="">
							</el-switch>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box" v-show="editAContent.scope.all == false">
                        <div class="list_label">投放区域</div>
                        <div class="list_content"></div>
                        <el-select v-model="selectScope.value" multiple placeholder="选择投放商圈" style="width:240px;">
                            <el-option
                                v-for="item in selectScope.area"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
 <!--                           <el-input v-model="editAContent.regionId" style="width:240px;" placeholder="请输入投放商圈 id,以逗号分隔"></el-input>
-->
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">时间</div>
                        <div class="list_content">
                            <el-date-picker
                              v-model="editAContent.time"
                              type="datetimerange"
                              placeholder="选择时间范围">
                            </el-date-picker>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">排序</div>
                        <div class="list_content">
                            <el-input-number v-model="editAContent.sort" :min="1" :max="9"></el-input-number>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">状态</div>
                        <div class="list_content">
                            <el-radio class="radio" v-model="editAContent.state" label="1">上线</el-radio>
                            <el-radio class="radio" v-model="editAContent.state" label="0">下线</el-radio>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div slot="footer" class="dialog-footer">
                        <el-button @click="showEditAD = false">取 消</el-button>
                        <el-button type="primary" @click="eidtADNow">编 辑</el-button>
                    </div>
                </el-dialog>

                <!--    列表    -->
                <div class="table_box">
                    <table class="table" id="advertisement">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckedAll" @change="checkAll($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>广告名称</th>
                                <th>类型</th>
                                <th>UV</th>
                                <th>状态</th>
                                <th>发布时间</th>
                                <th>过期时间</th>
                                <th>操作人</th>
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
                                <td>{{item.type}}</td>
                                <td>{{item.UV}}</td>
                                <td>{{item.state}}</td>
                                <td>{{item.createTime}}</td>
                                <td>{{item.overdueTime}}</td>
                                <td>{{item.creator}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="showEditADNow(item.id)" v-if="hasPrivileges('place_edit')">编辑</a>
                                    <a href="javascript:void(0)" @click="changeStateAD(item.id,'7')" v-if="hasPrivileges('place_manage')">删除</a>
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




            <el-tab-pane label="广告物料管理" name="广告物料管理">
                <!--        搜索区        -->
                <div class="search_box">
<!--
                    <el-select v-model="material.selectKey.type" clearable placeholder="选择类型">
                        <el-option
                            v-for="item in material.selectScope.type"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
-->
                    <el-select v-model="material.selectKey.state" clearable placeholder="状态">
                        <el-option
                            v-for="item in material.selectScope.state"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="resetMaterialData">搜索</el-button>
                </div>

                <!--        操作区        -->
                <div class="table_handle">
                    <el-button type="primary" @click="changeStateMaterial(material.checked,'7')" v-if="hasPrivileges('place_manage')">删除</el-button>
                    <el-button style="visibility:hidden">占位</el-button>
                    <el-button type="success" style="float:right" @click="exportExcel('material')">导出表格</el-button>
                    <el-button type="" style="float:right" @click="material.addMaterial=true" v-if="hasPrivileges('material_add')">添加物料</el-button>
                    <el-button type="" style="float:right" @click="material.showLocation=true" v-if="hasPrivileges('place_add')">新增广告位</el-button>
                </div>

                <!--        添加物料        -->
                <el-dialog title="添加物料" v-model="material.addMaterial">
                    <div class="list_box">
                        <div class="list_label">物料名称</div>
                        <div class="list_content">
                            <el-input v-model="material.addContent.name" style="width:240px;" placeholder="请输入物料名称"></el-input>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">广告类型</div>
                        <div class="list_content">
                            <el-radio class="radio" v-model="material.addContent.type" label="1">图片</el-radio>
                            <el-radio class="radio" v-model="material.addContent.type" label="3">文字</el-radio>
                        </div>
                        <div class="list_content">
                            <my-unload v-if="material.addContent.type=='1'" mId="issueAnnounce" :onSuccess="successUnload" :action="action" :onDelete="deleteUnload" :img="material.addContent.img"></my-unload>
                            <el-input
                              v-if="material.addContent.type=='3'"
                              type="textarea"
                              :rows="2"
                              placeholder="请输入内容"
                              v-model="material.addContent.text">
                            </el-input>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">目标地址</div>
                        <div class="list_content"></div>
                            <el-input v-model="material.addContent.content" style="width:240px;" placeholder="请输入目标地址"></el-input>

                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">状态</div>
                        <div class="list_content">
                            <el-radio class="radio" v-model="material.addContent.state" label="1">上线</el-radio>
                            <el-radio class="radio" v-model="material.addContent.state" label="0">下线</el-radio>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div slot="footer" class="dialog-footer">
                        <el-button @click="addMaterial = false">取 消</el-button>
                        <el-button type="primary" @click="addMaterialNow">添 加</el-button>
                    </div>
                </el-dialog>

                <!--        新增广告位        -->
                <el-dialog title="新增广告位" v-model="material.showLocation">
                    <div class="list_box">
                        <div class="list_label">名称</div>
                        <div class="list_content">
                            <el-input v-model="material.location.name" style="width:240px;" placeholder="请输入广告位名称"></el-input>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">状态</div>
                        <div class="list_content">
                            <el-radio class="radio" v-model="material.location.state" label="0">禁用</el-radio>
                            <el-radio class="radio" v-model="material.location.state" label="1">启用</el-radio>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">描述</div>
                        <div class="list_content"></div>
                            <el-input type="textarea" v-model="material.location.remark" style="width:480px;" placeholder="请输入广告位描述"></el-input>

                        <div class="clear"></div>
                    </div>

                    <div slot="footer" class="dialog-footer">
                        <el-button @click="material.showLoucation = false">取 消</el-button>
                        <el-button type="primary" @click="addLoucationNow()">添 加</el-button>
                    </div>
                </el-dialog>

              <delete v-if="material.showDelete" :checked="material.checked" :cancel="cancelDeleteMaterial"
                      :confirm="confirmDeleteMaterial"></delete>
                <!--        列表区        -->
                <div class="table_box">
                    <table class="table" id="material">
                        <thead>
                            <tr>
                                <th>
                                   <el-checkbox :indeterminate="material.isIndeterminate" v-model="material.isCheckedAll" @change="checkAllMaterial($event.target.checked)"> ID</el-checkbox>
                                </th>
                                <th>物料名称</th>
                                <th>物料内容</th>
                                <th>类型</th>
                                <th>目标地址</th>
                                <th>状态</th>
                                <th>添加时间</th>
                                <th>操作人</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in material.data">
                                <td>
                                    <el-checkbox
                                        v-model="material.data[index].isChecked"
                                        class="check_btn" @change="checkOneMaterial($event.target.checked,item.id)">
                                        {{item.id}}
                                    </el-checkbox>
                                </td>
                                <td>{{item.name}}</td>
                                <td>{{item.content}}</td>
                                <td>{{item.type}}</td>
                                <td>{{item.event}}</td>
                                <td>{{item.state}}</td>
                                <td>{{item.createTime}}</td>
                                <td>{{item.creator}}</td>
                                <td class="operation">
                                    <a href="javascript:void(0)" @click="showEditMaterialNow(item.id)" v-if="hasPrivileges('place_edit')">编辑</a>
                                    <a href="javascript:void(0)" @click="changeStateMaterial(item.id,'7')" v-if="hasPrivileges('place_manage')">删除</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_control">
                        <el-pagination
                          @size-change="handleSizeChangeMaterial"
                          @current-change="handleCurrentChangeMaterial"
                          :current-page="material.page.currentPage"
                          :page-sizes="material.page.pageSizes"
                          :page-size="material.page.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="material.page.total">
                        </el-pagination>
                    </div>
                </div>

                <!--        编辑广告物料        -->
                <el-dialog title="编辑广告物料" v-model="material.showEdit">
                    <div class="list_box">
                        <div class="list_label">物料名称</div>
                        <div class="list_content">
                            <el-input v-model="material.editContent.name" style="width:240px;" placeholder="请输入物料名称"></el-input>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">投放位置</div>
                        <div class="list_content">
                            <el-radio class="radio" v-model="material.editContent.type" label="1">图片</el-radio>
                            <el-radio class="radio" v-model="material.editContent.type" label="3">文字</el-radio>
                        </div>
                        <div class="list_content">
                            <my-unload v-if="material.editContent.type=='1'" mId="issueAnnounce" :onSuccess="successUnload" :action="action" :onDelete="deleteUnload" :img="material.editContent.img"></my-unload>
                            <el-input
                              v-if="material.editContent.type=='3'"
                              type="textarea"
                              :rows="2"
                              placeholder="请输入内容"
                              v-model="material.editContent.text">
                            </el-input>
                        </div>
                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">目标地址</div>
                        <div class="list_content"></div>
                            <el-input v-model="material.editContent.content" style="width:240px;" placeholder="请输入目标地址"></el-input>

                        <div class="clear"></div>
                    </div>

                    <div class="list_box">
                        <div class="list_label">状态</div>
                        <div class="list_content">
                            <el-radio class="radio" v-model="material.editContent.state" label="1">上线</el-radio>
                            <el-radio class="radio" v-model="material.editContent.state" label="0">下线</el-radio>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="showEdit = false">取 消</el-button>
                        <el-button type="primary" @click="editMaterialNow">编 辑</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
export default {
    name: 'advertisement',
    data () {
        return {
            action:'',
            createAdvertisement:false,
            cAWidth:'120px',
            cAContent: {
                name:'',
                type:'',
                url:'',
                material:'',
              materials:[],
                time:'',
                sort:'',
                scope:{
              all: true,
              regionId:''
            },
                state:'',
            },
            cAScope:{
                type:[],
                dialogVisible:false,
            },
            showDelete:false,
            showEditAD:false,
            editAContent:{
                id:'',
                name:'',
                type:'',
                material:'',
                time:'',
                sort:'',
                scope:{
					all: true,
					regionId:''
				},
                state:'1',
            },
            activeName:'全部广告',
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
                name:'',
                type:'',
                state:'',
                content:'',
            },
            selectScope:{
                type:[],
                area:[],
                value:[],
                state:[{
                  value: '上线',
                  label: '上线'
                },{
                  value: '下线',
                  label: '下线'
                }]
            },
            data:[],
            material:{
                showDelete:false,
                showEdit:false,
                showLocation:false,
                location:{
                    name:'',
                    remark:'',
                    state:'',
                },
                addMaterial:false,
                isIndeterminate:false,
                isCheckedAll:false,
                checked:[],
                addContent:{
                    type:'1',
                    state:'',
                    content:'',
                    img:[],
                    text:'',
                    name:'',
                },
                editContent:{
                    id:'',
                    type:'1',
                    state:'',
                    content:'',
                    img:[],
                    text:'',
                    name:'',
                },
                page:{
                    currentPage:1,
                    pageSizes:[10,20,50,100,200,500,1000],
                    pageSize:10,
                    total:0
                },
                selectKey:{
                    type:'',
                    state:'',
                },
                selectScope:{
                    type:[{
                      value: '选项1',
                      label: '图片'
                    },{
                      value: '选项2',
                      label: '文字'
                    }],
                    state:[{
                      value: '上线',
                      label: '上线'
                    },{
                      value: '下线',
                      label: '下线'
                    }]
                },
                data:[],
            }
        }
    },
    mounted: function(){
        this.action = 'http://'+global.URL+'/v1/file/upload?kind=9';
        var that = this;
        this.$http.get('http://'+ global.URL +'/v1/advert/schedule/list?page='+ that.page.currentPage+'&limit='+ that.page.pageSize).then((response) => {
            if(response.body.code == 200 || response.body.code == 201){
                var arr = response.body.list;
                var YN = ['下线','上线',2,3,4,5,6,'删除']
                that.page.total = response.body.total

                for(let i = 0, length = arr.length;i < length; i++){
                    let o = {
                        id: arr[i].scheduleId,
                        name: arr[i].name,
                        type: arr[i].location.name,
                        UV: arr[i].clicks,
                        state: YN[arr[i].state],
                        createTime: arr[i].startTime,
                        overdueTime: arr[i].endTime,
                        creator: arr[i].creator.name,
                        isChecked: false,
                    }
                    this.data.push(o)
                }
            }
        });
         this.$http.get('http://'+ global.URL +'/v1/region?page=1&limit=999').then( (res) => {
            console.log('商圈选择:'+ res)
            if(res.body.code == 200 || res.body.code == 201){
              for(let i = 0; i < res.body.list.length; i++){
                let o = {
                  value: res.body.list[i].circleId,
                  label: res.body.list[i].name,
                }
                this.selectScope.area.push(o);
              }
            }
          });
      this.$http.get('http://'+ global.URL +'/v1/advert/choose/material').then( (res) => {
      if(res.body.code == 200 || res.body.code == 201){
        for(let i = 0; i < res.body.list.length; i++){
          let o = {
            value: res.body.list[i].materialId,
            label: res.body.list[i].name,
          }
          this.cAContent.materials.push(o);
        }
      }
    });
		this.$http.get('http://'+ global.URL +'/v1/advert/location/list').then((res) => {
			if(res.body.code == 200){
				for(let i = 0; i < res.body.list.length; i++){
					if(res.body.list[i].state == 1){
						let o = {
							value: res.body.list[i].locationId,
							label: res.body.list[i].name
						}
						this.cAScope.type.push(o)
					}
				}

			}
		});

        this.$http.get('http://'+ global.URL +'/v1/advert/material/list?page='+ that.material.page.currentPage+'&limit='+ that.material.page.pageSize).then((response) => {

            if(response.body.code == 200 || response.body.code == 201){
                var arr = response.body.list;
                var YN = ['下线','上线',2,3,4,5,6,'删除']
                var TYPE = ['无','图片','视频','文本','富文本']
                that.material.page.total = response.body.total;

                for(let i = 0, length = arr.length;i < length; i++){
                    let o = {
                        id: arr[i].materialId,
                        name: arr[i].name,
                        content: arr[i].resource,
                        type: TYPE[arr[i].kind],
                        event: arr[i].url,
                        state: YN[arr[i].state],
                        createTime: arr[i].createTime,
                        creator: arr[i].creator.name,
                        isChecked: false,
                    }
                    this.material.data.push(o)
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
        resetAdvertisementData(){
            this.data = [];
            this.checked = [];
            this.showDelete=false;
            this.isIndeterminate = false;
            this.isCheckedAll = false;
            this.selectScope.value=[];
            var that = this;
            var parameter = '';
            if(this.selectKey.state){
                let str;
                if(this.selectKey.state == '下线'){
                    str = '0';
                }else if(this.selectKey.state == '上线'){
                    str = '1';
                }
                parameter += '&state=' + str;
            }

            console.log(parameter)
            this.$http.get('http://'+ global.URL +'/v1/advert/schedule/list?page='+ that.page.currentPage+'&limit='+ that.page.pageSize + parameter).then((response) => {
                console.log(response)
                var arr = response.body.list;
                var YN = ['下线','上线',2,3,4,5,6,'删除']
                that.page.total = response.body.total

                for(let i = 0, length = arr.length;i < length; i++){
                    let o = {
                        id: arr[i].scheduleId,
                        name: arr[i].name,
                        type: arr[i].location.name,
                        UV: arr[i].clicks,
                        state: YN[arr[i].state],
                        createTime: arr[i].startTime,
                        overdueTime: arr[i].endTime,
                        creator: arr[i].creator.name,
                        isChecked: false,
                    }
                    this.data.push(o)
                }


            },(response) => {

            });
        },
        resetMaterialData(){
            this.material.data = [];
            this.material.checked = [];
          this.material.showDelete=false;
            this.material.isIndeterminate = false;
            this.material.isCheckedAll = false;
            var that = this;
            var parameter = '';
            if(this.material.selectKey.state){
                let str;
                if(this.material.selectKey.state == '下线'){
                    str = '0';
                }else if(this.material.selectKey.state == '上线'){
                    str = '1';
                }
                parameter += '&state=' + str;
            }

            console.log(parameter)
                this.$http.get('http://'+ global.URL +'/v1/advert/material/list?page='+ that.material.page.currentPage+'&limit='+ that.material.page.pageSize + parameter).then((response) => {
                console.log(response)
                var arr = response.body.list;
                var YN = ['下线','上线',2,3,4,5,6,'删除']
                var TYPE = ['无','图片','视频','文本','富文本']
                that.material.page.total = response.body.total;

                for(let i = 0, length = arr.length;i < length; i++){
                    let o = {
                        id: arr[i].materialId,
                        name: arr[i].name,
                        content: arr[i].resource,
                        type: TYPE[arr[i].kind],
                        event: arr[i].url,
                        state: YN[arr[i].state],
                        createTime: arr[i].createTime,
                        creator: arr[i].creator.name,
                        isChecked: false,
                    }
                    this.material.data.push(o)
                }

            },(response) => {

            });
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.page.pageSize = val;
            this.resetAdvertisementData();
        },
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.resetAdvertisementData();
            console.log(`当前页: ${val}`);
        },
        handleSizeChangeMaterial(val) {
            console.log(`每页 ${val} 条`);
            this.material.page.pageSize = val;
            this.resetMaterialData();
        },
        handleCurrentChangeMaterial(val) {
            this.material.page.currentPage = val;
            this.resetMaterialData();
            console.log(`当前页: ${val}`);
        },
        changeStateAD(o,state){
          if(state=="7"){
            this.checked = []
            if (typeof o == 'object' && o.length > 0) {
              this.checked = o;
              this.showDelete = true
            } else if (typeof o == 'number') {
              this.checked.push(o)
              this.showDelete = true
            }
          }
        },
        cancelDelete(){
          this.resetAdvertisementData();
        },
        confirmDelete(id){
          var obj = {
            adScheduleIds:id,
            state: "7"
          };
          this.$http.put('http://'+global.URL+'/v1/advert/schedule/change',obj).then((res) => {
            if(res.body.code == 200 || res.body.code == 201){
              this.resetAdvertisementData();
              this.$message('删除成功');
            }
          });
        },
        changeStateMaterial(o,state){
          if(state=="7"){
            this.material.checked=[];
            if (typeof o == 'object' && o.length > 0) {
              this.material.checked = o;
              this.material.showDelete = true
            } else if (typeof o == 'number') {
              this.material.checked.push(o)
              this.material.showDelete = true
            }
          }else{
            var arr = [];
            if(typeof o == 'object'){
              arr = o;
            }else if(typeof o == 'number'){
              arr.push(o);
            }
            var obj = {
              "adMaterialIds": arr,
              "state": state
            }
            this.$http.put('http://'+global.URL+'/v1/advert/material/change',obj).then((res) => {
              if(res.body.code == 200 || res.body.code == 201){
                this.resetMaterialData();
                this.$message('操作成功');
              }
            })
          }
        },
        cancelDeleteMaterial(){
          this.resetMaterialData();
        },
      confirmDeleteMaterial(id){
        var obj = {
          "adMaterialIds": id,
          "state": "7"
        }
        this.$http.put('http://'+global.URL+'/v1/advert/material/change',obj).then((res) => {
          if(res.body.code == 200 || res.body.code == 201){
            this.resetMaterialData();
            this.$message('删除成功');
          }
        })
      },
        showEditADNow(o){
            this.showEditAD = true;
            this.editAContent.id = o;
            this.$http.get('http://'+ global.URL +'/v1/advert/schedule/'+ o +'/detail').then((res) => {

                if(res.body.code == 200){
                    this.editAContent.name = res.body.data.name;
                    this.editAContent.type = res.body.data.location.locationId;
                    this.editAContent.material = res.body.data.content.materialId;
                    this.editAContent.scope.all = res.body.data.scope.all;
					if(res.body.data.scope.all == false){
						let arr = [];
						for(let i = 0; i < res.body.data.scope.region.length; i++){
							arr.push(res.body.data.scope.region[i].circleId);
						}

						this.editAContent.regionId = arr.join(',');
					}else{
						this.editAContent.regionId = [];
					}
                }
            })
        },
        showEditMaterialNow(o){
            console.log(o)
            this.material.editContent.id = o;
            this.$http.get('http://'+ global.URL +'/v1/advert/material/'+ o +'/detail').then((res) => {
                console.log(res)
                this.material.editContent.state = res.body.data.state;
                this.material.editContent.type = res.body.data.kind;
                this.material.editContent.content = res.body.data.url;
                if(res.body.data.kind == '1'){
                    this.material.editContent.img = [];
                    this.material.editContent.img.push(res.body.data.resource);
                }else if(res.body.data.kind == '3'){
                    this.material.editContent.text = res.body.data.resource;
                    console.log(this.material.editContent.text)
                }
                this.material.editContent.name = res.body.data.name;
            })

            this.material.showEdit = true;
        },
        eidtADNow(){
            var sStr = '',eStr = '';
            if(this.editAContent.time){
                if(Boolean(this.editAContent.time[0])){
                    console.log(this.editAContent.time)
                    let sDate = new Date(this.editAContent.time[0]);
                    let sYear = sDate.getFullYear();
                    let sMonth = sDate.getMonth()+1;
                    let sDay = sDate.getDate();
                    let sHours = sDate.getHours();
                    let sMinutes = sDate.getMinutes();
                    let sSeconds = sDate.getSeconds();
                    sStr = sYear+'-'+sMonth+'-'+sDay+' '+sHours+':'+sMinutes+':'+sSeconds;

                    let eDate = new Date(this.editAContent.time[1]);
                    let eYear = eDate.getFullYear();
                    let eMonth = eDate.getMonth()+1;
                    let eDay = eDate.getDate();
                    let eHours = eDate.getHours();
                    let eMinutes = eDate.getMinutes();
                    let eSeconds = eDate.getSeconds();
                    eStr = eYear+'-'+eMonth+'-'+eDay+' '+eHours+':'+eMinutes+':'+eSeconds;


                }
            }
            var o = {
              "adScheduleId": this.editAContent.id,
              "contentId": this.editAContent.material,
              "endTime": eStr,
              "locationId": this.editAContent.type,
              "name": this.editAContent.name,
              "rank": this.editAContent.sort,
              "scope": {
				  all: this.editAContent.scope.all
			  },
              "startTime": sStr,
              "state": this.editAContent.state,
            }
			if(this.editAContent.scope.all == false){
				console.log(this.editAContent)
				o.scope.regionId = this.selectScope.value.filter(function(item){
            return typeof item=='number'
			  })
			}else{
				o.scope.regionId = [];
			}
			console.log(o)
            this.$http.put('http://'+ global.URL +'/v1/advert/schedule',o).then((res) => {
                console.log(res);
                this.resetAdvertisementData();
            })
            this.showEditAD = false;
        },
        editMaterialNow(){
            var content = '';
            if(this.material.editContent.type == '1'){
                content = this.material.editContent.img[0];
            }else if(this.material.editContent.type == '3'){
                content = this.material.editContent.text;
            }
            var obj = {
              "adMaterialId": this.material.editContent.id,
              "content": content,
              "kind": this.material.editContent.type,
              "name": this.material.editContent.name,
              "state": this.material.editContent.state,
              "url": this.material.editContent.content,
            }
            console.log(obj)
            this.$http.put('http://'+ global.URL +'/v1/advert/material',obj).then((res) => {
                console.log(res);
                if(res.body.code == 200 || res.body.code == 201){
                    this.$message('编辑成功')
                    this.resetMaterialData();
                }else{
                    this.$message(res.body.message)
                }
            })
            this.material.showEdit = false;
        },
        createAD(){
            if(this.cAContent.time){
                if(Boolean(this.cAContent.time[0])){
                    console.log(this.cAContent.time)
                    let sDate = new Date(this.cAContent.time[0]);
                    let sYear = sDate.getFullYear();
                    let sMonth = sDate.getMonth()+1;
                    let sDay = sDate.getDate();
                    let sHours = sDate.getHours();
                    let sMinutes = sDate.getMinutes();
                    let sSeconds = sDate.getSeconds();
                    var sStr = sYear+'-'+sMonth+'-'+sDay+' '+sHours+':'+sMinutes+':'+sSeconds;

                    let eDate = new Date(this.cAContent.time[1]);
                    let eYear = eDate.getFullYear();
                    let eMonth = eDate.getMonth()+1;
                    let eDay = eDate.getDate();
                    let eHours = eDate.getHours();
                    let eMinutes = eDate.getMinutes();
                    let eSeconds = eDate.getSeconds();
                    var eStr = eYear+'-'+eMonth+'-'+eDay+' '+eHours+':'+eMinutes+':'+eSeconds;


                }
            }
            var userStr = window.sessionStorage.getItem('loginLoucaUser')
            var userObj = JSON.parse(userStr)
            var sender = userObj.userId;
            var o = {
              "contentId": this.cAContent.material,
              "endTime": eStr,
              "locationId": this.cAContent.type,
              "name": this.cAContent.name,
              "rank": this.cAContent.sort,
              "scope": {
				  all: this.cAContent.scope.all,
			  },
              "startTime": sStr,
              "state": this.cAContent.state,
              "userId": sender
            }
			if(this.cAContent.scope.all == false){
				o.scope.regionId = this.selectScope.value.filter(function(item){
                    return typeof item=='number'
        			  })
			}else{
				o.scope.regionId = [];
			}

            console.log(o)
            this.$http.post('http://'+ global.URL +'/v1/advert/schedule',o).then((res) => {
                console.log(res);
                this.resetAdvertisementData();
            })
            this.createAdvertisement = false;

        },
        addMaterialNow(){
            var userStr = window.sessionStorage.getItem('loginLoucaUser')
            var userObj = JSON.parse(userStr)
            var sender = userObj.userId;

            var content;
            if(this.material.addContent.type == '1'){
                content = this.material.addContent.img[0];
            }else if(this.material.addContent.type == '3'){
                content = this.material.addContent.text;
            }
            var obj = {
              "content": content,
              "kind": this.material.addContent.type,
              "name": this.material.addContent.name,
              "state": this.material.addContent.state,
              "url": this.material.addContent.content,
              "userId": sender
            }

            this.$http.post('http://'+global.URL+'/v1/advert/material',obj).then((res) => {
                console.log(res)
                if(res.body.code == 200 || res.body.code == 201){
                    this.$message('操作成功');
                }else{
                    this.$message(res.body.message)
                }
            })
            this.resetMaterialData();
            this.material.addMaterial = false;
        },
        checkAll:function(isChecked){
            this.checked = [];
            if(isChecked){
                console.log('aaa')
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
        checkOne:function(isChecked,id){
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
        checkAllMaterial:function(isChecked){
            this.material.checked = [];
            if(isChecked){
                console.log('aaa')
                for(let i = 0; i < this.material.data.length; i++){
                    this.material.data[i].isChecked = true;
                    this.material.checked.push(this.material.data[i].id)
                }
            }else{
                for(let i = 0; i < this.material.data.length; i++){
                    this.material.data[i].isChecked = false;
                }
            }
            this.material.isIndeterminate = false;

        },
        checkOneMaterial:function(isChecked,id){
            if(isChecked){
                this.material.checked.push(id)
            }else{
                for(let i = 0; i < this.material.checked.length; i++){
                    if(this.material.checked[i] == id){
                        this.material.checked.splice(i,1)
                    }
                }
            }
            if(this.material.checked.length == this.material.data.length){
                this.material.isIndeterminate = false;
                this.material.isCheckedAll = true;
            }else if(this.material.checked.length == 0){
                this.material.isIndeterminate = false;
                this.material.isCheckedAll = false;
            }else{
                this.material.isIndeterminate = true;
            }
            console.log(this.material.checked)
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.cAContent.url = file.url;
            this.cAScope.dialogVisible = true;
        },
        successUnload(img,arr){
            console.log(arr)
            this.material.addContent.img = arr;
        },
        deleteUnload(img,arr){
            console.log(arr)
            this.material.addContent.img = arr;
        },
        addLoucationNow(){
            var userId = JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).userId;
            var obj = {
                name: this.material.location.name,
                remark: this.material.location.remark,
                state: this.material.location.state,
                userId: userId
            }
            console.log(obj)
            this.$http.post('http://'+global.URL+'/v1/advert/location',obj).then((res) => {
                console.log(res)
                if(res.body.code == 200 || res.body.code == 201){
                    this.$message('操作成功');
                }else{
                    this.$message(res.body.message)
                }
            })
            this.material.showLocation = false;
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
        createAdvertisement
    */

    .list_box{
        width: 96%;
        padding: 6px 2%;
    }
    .list_label{
        width: 10%;
        line-height: 36px;
        float:left;
    }
    .img_label{
        vertical-align: top;
    }
    .list_content{
        width: 86%;
        float:left;
        line-height: 36px;
    }
    .event_list{
        margin: 12px 0;
    }
</style>


























