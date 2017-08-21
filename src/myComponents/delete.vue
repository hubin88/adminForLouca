<template>
    <el-dialog v-model="showDelete" title="删除" size="tiny" @close="canceldelete">
      <span>您确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canceldelete">取 消</el-button>
        <el-button type="primary" @click="confirmdelete">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        showDelete: true,
      };
    },
    props: ["checked", "deleteId", "cancel", "confirm"],
    methods: {
      canceldelete(){
        this.cancel();
      },
      confirmdelete () {
        this.confirm(this.checked);
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
