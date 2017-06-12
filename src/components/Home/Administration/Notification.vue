<template>
    <div class="notification">
        <el-tabs v-model="activeName" @tab-click="handleClick">
           
            <!--发布通知-->
            <el-tab-pane label="发布通知" name="issue">
                <div class="issue_box">
                    <div class="list_box">
                        <div class="issue_list">推送设备</div>
                        <el-radio-group v-model="issueContent.equipment">
                            <el-radio-button label="全部"></el-radio-button>
                            <el-radio-button label="android"></el-radio-button>
                            <el-radio-button label="iOS"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="list_box">
                        <div class="issue_list">目标对象</div>
                        <el-radio-group v-model="issueContent.target">
                            <el-radio-button label="所有人"></el-radio-button>
                            <el-radio-button label="选择商圈/楼"></el-radio-button>
                        </el-radio-group>
                        <div class="trading_area" v-if="issueContent.target=='选择商圈/楼'">
                            <el-tag
                              v-for="tag in allLabels"
                              :closable="true"
                              :close-transition="false"
                              @close="handleClose(tag)"
                            >
                            {{tag}}
                            </el-tag>
                            <el-input
                              class="input-new-tag"
                              v-if="inputVisible"
                              v-model="inputValue"
                              ref="saveTagInput"
                              size="mini"
                              @keyup.enter.native="handleInputConfirm"
                              @blur="handleInputConfirm"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                        </div>
                    </div>
                    <div class="list_box">
                        <div class="issue_list">发送时间</div>
                        <el-radio-group v-model="time">
                            <el-date-picker
                                v-model="time"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-radio-group>
                    </div>
                    <div class="list_box">
                        <div class="issue_list">推送内容</div>
                        <el-input class="issue_content" type="textarea" :autosize="{minRows: 4,maxRows: 10}" auto-complete="off"></el-input>
                    </div>
                    <el-button class="issue_btn" type="primary">立即发送</el-button>
                </div>
            </el-tab-pane>
            
            <!--定时消息-->
            <el-tab-pane label="定时消息" name="timer">
                <div class="timer_box">
                    <div class="search_box">
                        <el-date-picker
                            v-model="searchTime"
                            type="daterange"
                            align="right"
                            placeholder="选择日期范围"
                            :picker-options="searchRange">
                        </el-date-picker>
                        <el-button class="searchTime_btn" type="primary">查询</el-button>
                    </div>
                    <table>
                        <tr>
                            <th>预订发送时间</th>
                            <th>内容</th>
                            <th>目标对象</th>
                            <th>操作</th>
                        </tr>
                        <tr>
                            <td>2017.10.24 10:24</td>
                            <td>亲爱的程序员们，节日快乐！</td>
                            <td>龙岗中心城商圈；南联商圈</td>
                            <td><a class="cancel" href="javascript:void(0)">取消</a></td>
                        </tr>
                        <tr>
                            <td>2017.10.24 10:24</td>
                            <td>亲爱的程序员们，节日快乐！</td>
                            <td>龙岗中心城商圈；南联商圈</td>
                            <td><a class="cancel" href="javascript:void(0)">取消</a></td>
                        </tr>
                    </table>
                </div>
            </el-tab-pane>
            
            <!--推送历史-->
            <el-tab-pane label="推送历史" name="history">
                <div class="history_box">
                    <div class="search_box">
                        <el-select v-model="historyKey" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-date-picker
                            v-model="searchTime"
                            type="daterange"
                            align="right"
                            placeholder="选择日期范围"
                            :picker-options="searchRange">
                        </el-date-picker>
                        <el-button class="searchTime_btn" type="primary">查询</el-button>
                    </div>
                    <table>
                        <tr>
                            <th>发送时间</th>
                            <th>内容</th>
                            <th>类型</th>
                            <th>目标对象</th>
                        </tr>
                        <tr>
                            <td>2017.10.24 10:24</td>
                            <td>亲爱的程序员们，节日快乐！</td>
                            <td>即时推送</td>
                            <td>所有人</td>
                        </tr>
                        <tr>
                            <td>2017.10.24 10:24</td>
                            <td>亲爱的程序员们，节日快乐！</td>
                            <td>龙岗中心城商圈；南联商圈</td>
                            <td>南联商圈</td>
                        </tr>
                    </table>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: 'notification',
        data () {
            return {
                activeName: 'issue',
                target: '所有人',
                allLabels: ['标签一', '标签二', '标签三'],
                inputVisible: false,
                inputValue: '',
                value1: '',
                time:'',
                searchTime:'',
                issueContent:{
                    equipment:'iOS',
                    target:'',
                    time:'',
                    content:'',
                },
                searchRange:{
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
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                historyKey:''
            }
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            handleClose(tag) {
                this.allLabels.splice(this.allLabels.indexOf(tag), 1);
            },
            
            showInput() {
                this.inputVisible = true;
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                  this.allLabels.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
            
        },
        watch: {
            target: function(){
                //console.log(this.target)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .notification{
        background: rgb(251,251,251);
    }
    
    table{
        text-align: center;
        margin: 0 auto;
        border-collapse: collapse;
    }
    tr{
        border-bottom: 1px solid #ccc;
    }
    th,td{
        padding: 12px 36px;
        min-width: 220px;
    }
    /*
        发布通知
    */
    .issue_box,.timer_box,.history_box{
        padding: 12px;
        padding-left: 36px;
    }
    .list_box{
        vertical-align: top;
        margin-bottom: 12px;
    }
    .issue_list{
        display: inline-block;
        vertical-align: top;
        font-size: 18px;
        line-height: 36px;
        margin-right: 12px;
    }
    .trading_area{
        padding: 12px;
        margin: 12px 0px 12px 88px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .block{
        margin: 12px 0;
    }
    .issue_content{
        width: 1475px;
    }
    .issue_btn{
        margin-left: 86px;
    }
    
    /*
        定时查询
    */
    .search_box{
        margin: 12px;
        text-align: right;
    }
    .cancel{
        color:#20a0ff;
    }
</style>
