<template>
<!--
    <div>
       <my-unload :onSuccess="success" action="http://admin.api.hboffice.cn/v1/file/upload?kind=1"></my-unload>
    </div>
-->
    
</template>
<script>
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false
      };
    },
    mounted: function(){
       
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      success(o){
          console.log(o);
      }
    }
  }
</script>

<style scoped>
</style>


























