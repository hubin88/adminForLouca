<template>
    <div class="myComponents_unload">
        <input :id="mId+'_unload_file'" type="file" class="myComponents_unload_fileInp" @change="canUnload=true">
        <div class="myComponents_unload_imgList">
            <div class="myComponents_unload_imgBox" v-for="(item,index) in img" :style="{backgroundImage: 'url('+ item +')',backgroundSize:'cover',backgroundPosition:'center'}" @click="deleteImg(item,index)"></div>
            <div class="myComponents_unload_addImg" :id="mId+'_unload_addImg'">
                <i class="myComponents_unload_icon el-icon-plus"></i>
            </div>
        </div>
        <div class="myComponents_unload_controls">
            <el-button type="primary" class="myComponents_unload_select" :id="mId+'_unload_select'">选择文件</el-button>
            <el-button type="primary" class="myComponents_unload_btn" v-show="canUnload" :id="mId+'_unload_btn'">上传</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                file:'',
                canUnload:false
            }
        },
        props:['action','onSuccess','onDelete','mId','img'],
        mounted(){
            var that = this;
            $('#'+that.mId+'_unload_btn').on('click', function() {
                var fd = new FormData();
                fd.append("uploadFile", $('#'+that.mId+'_unload_file').get(0).files[0]);
                $.ajax({
                    url: that.action,
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: fd,
                    success: function(res) {
                        if(res.code == 200 || res.code == 201){
                            that.onSuccess(res.data,that.img)
                            that.img.push(res.data)
                        }
                    }
                });
                that.canUnload = false;
            });

            $('#'+that.mId+'_unload_select').click(function(){
                $('#'+that.mId+'_unload_file').trigger("click");
            })

            $('#'+that.mId+'_unload_addImg').click(function(){
                $('#'+that.mId+'_unload_file').trigger("click");
            })
        },
        methods:{
            deleteImg(url,index){
                this.$http.delete('http://'+ global.URL +'/v1/file/delete?url='+ url).then((res) => {
                    this.$message(res.body.message)
                    this.img.splice(index,1)
                    this.onDelete(url,this.img)
                })
            },
        }
    }
</script>

<style scoped="true">
    .myComponents_unload{
        display: inline-block;
    }
    .myComponents_unload_fileInp{
        display: none;
    }
    .myComponents_unload_imgBox{
        display: inline-block;
        position: relative;
        width: 148px;
        height: 148px;
        border-radius: 6px;
        border: 1px dashed #ccc;
        margin: 6px;
        background: rgb(240,244,253);
        cursor: pointer;
    }
    .myComponents_unload_imgBox:hover::before{
        content: '×';
        font-size: 48px;
        position: absolute;
        color: rgb(155,155,155);
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        -o-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
    }
    .myComponents_unload_addImg{
        display: inline-block;
        position: relative;
        width: 148px;
        height: 148px;
        border-radius: 6px;
        border: 1px dashed #ccc;
        margin: 6px;
        background: rgb(240,244,253);
        cursor: pointer;
    }
    .myComponents_unload_icon{
        font-size: 32px;
        color: rgb(155,155,155);
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        -o-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
    }
    .myComponents_unload_controls{
        margin: 0 6px;
    }
</style>


























