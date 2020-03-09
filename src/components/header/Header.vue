<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-submenu index="1">
        <template slot="title">文件</template>
        <el-menu-item index="1-1">导入数据</el-menu-item>
        <el-menu-item index="1-2">导出数据</el-menu-item>
        <el-menu-item index="1-3">保存</el-menu-item>
      </el-submenu>
      <el-menu-item index="2">参数调整</el-menu-item>
      <el-menu-item index="3">
          软件运行
      </el-menu-item>
      <el-menu-item index="4">
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
      activeIndex2: "1",
      pages: ['before', 'runtime', 'solution']
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      if(key > 1) {
          this.$router.push(`/${this.pages[key - 2]}`)
          return 
        }
    }
  }
};
</script>