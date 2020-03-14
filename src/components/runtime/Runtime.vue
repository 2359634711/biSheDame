<template>
  <div class="box">
    <div class="left">
      <div class="options">
        <el-table :data="optionsList" border stripe>
          <el-table-column
            v-for="col in columns"
            :prop="col.id"
            :key="col.id"
            :label="col.label"
            :width="col.width"
          ></el-table-column>
        </el-table>
      </div>
      <el-button class="btn" type="primary" @click="run()">运行</el-button>
    </div>
    <div class="right">
      <canvas></canvas>
      <div class="loggerBox">
        <div v-for="(item, index) in log" :key="index">
          <br />
          <span :class="item.type">[{{item.type}}]</span>
          {{item.message}}
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import calculate from "./runtime";
export default {
  data() {
    return {
      msg: "Im Runtime",
      columns: [
        {
          id: "title",
          label: "变量名",
          width: 80
        },
        {
          id: "value",
          label: "值",
          width: 150
        }
      ]
    };
  },
  methods: {
    ...mapActions(["setSolutionAsync", "addLogAsync"]),
    run() {
      calculate(this.addLogAsync).then(res => {
        this.setSolutionAsync(res).then(res => {
          this.$alert("计算完成");
          this.$router.push("/solution");
        });
      });
    }
  },
  computed: {
    ...mapGetters(["log"]),
    optionsList() {
      return this.$store.getters.optionsList;
    }
  }
};
</script>


<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.left {
  position: relative;
  width: 250px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .options {
    overflow: scroll;
    margin-bottom: 40px;
  }
  .btn {
    position: absolute;
    bottom: 0px;
    width: 100%;
    border-radius: 0px;
  }
}
.right {
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.Successed {
  color: green;
}
.Running {
  color: rgb(87, 87, 87);
}
.Failed {
  color: red;
}
.loggerBox{
    height: 200px;
    overflow-y: scroll;
    width: calc(100% - 30px); 
    background: #eee;
    margin-left: 10px;
    padding: 10px;
}
canvas{
    flex-grow: 1;
}
</style>