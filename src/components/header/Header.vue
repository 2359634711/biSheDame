<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-submenu index="0">
        <template slot="title">文件</template>
        <el-menu-item index="0-1">导入数据</el-menu-item>
        <el-menu-item index="0-2">导出数据</el-menu-item>
        <el-menu-item index="0-3">保存</el-menu-item>
      </el-submenu>
      <el-menu-item index="1">参数调整</el-menu-item>
      <el-menu-item index="2">
          软件运行
      </el-menu-item>
      <el-menu-item index="3">
          结果分析
      </el-menu-item>
    </el-menu>
    <div class="line"></div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      pages: ['before', 'runtime', 'solution']
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      if(key > 0) {
        let path = this.pages[key - 1]
        if(key == this.activeIndex) return 
          this.$router.push('/' + path)
          this.activeIndex = key + ''
        }
    }
  },
  watch: {
    $route(val){
      let path = val.path.replace(/^\//, '')
      this.activeIndex = this.pages.indexOf(path) + 1 + ''
    }
  }
};
</script>