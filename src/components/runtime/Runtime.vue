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
      <div class="title">当前模式:{{currentModule.name}}</div>
      <!-- <canvas></canvas> -->
      <div class="loggerBox" ref="loggerBox">
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
import { naturalCurveModule } from "./module/naturalCurve";
import { designDrill } from "./module/designDrill";
import { targetToPointLS } from "./module/targetToPointLS";
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
    logger(arg) {
      return new Promise(resolve => {
        this.addLogAsync(arg).then(() => {
          this.scrollBottom(false);
          resolve();
        });
      });
    },
    async scrollBottom(imidient = true) {
      let { loggerBox } = this.$refs;
      let { scrollTop: min, scrollHeight: max } = loggerBox;
      for (let i = min; i < max; i += 1) {
        loggerBox.scrollTop = i;
        if (!imidient) await this.delay(500 / (max - min));
      }
    },
    delay(t) {
      return new Promise(r => setTimeout(r, t));
    },
    async run() {
      let res = {};
      switch (this.currentModule.id) {
        case 0: {
          //自然曲线
          res = await naturalCurveModule(this.logger, this.options);
          break;
        }
        case 1: {
          //井轨设计
          console.log(this.options)
          res = await designDrill(this.logger, this.options);
          break;
        }
        case 3: {
          //targetToPoint
          console.log(this.options)
          res = await targetToPointLS(this.logger, this.options);
          break;
        }
        default: {
          break;
        }
      }
      await this.setSolutionAsync(res);

      this.$alert("计算完成");
      this.$router.push("/solution");
    }
  },
  mounted() {
    this.scrollBottom();
  },
  computed: {
    ...mapGetters(["log", "currentModule", "options", "optionsList"]),
    // optionsList() {
    //   return this.$store.getters.optionsList;
    // }
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
.loggerBox {
  // height: 200px;
  flex-grow: 1;
  overflow-y: scroll;
  width: calc(100% - 30px);
  background: #eee;
  margin-left: 10px;
  padding: 10px;
  transition: all 1s;
}
.title {
  margin: 10px;
}
// canvas {
//   flex-grow: 1;
// }
</style>