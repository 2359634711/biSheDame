<template>
  <div class="designDrill">
      <el-form :model="options" class="form" ref="form" label-width="80px">
          <el-form-item label="Ht">
              <el-input placeholder="请输入垂深Ht" v-model="options.Ht"></el-input>
          </el-form-item>
          <el-form-item label="At">
              <el-input placeholder="请输入水平位移At" v-model="options.At"></el-input>
          </el-form-item>
          <el-form-item label="faiShe">
              <el-input placeholder="请输入平移方位faiShe" v-model="options.faiShe"></el-input>
          </el-form-item>
          <el-form-item label="Ha">
              <el-input placeholder="请输入造斜点Ha" v-model="options.Ha"></el-input>
          </el-form-item>
          <el-form-item label="K2">
              <el-input placeholder="请输入增斜率K2" v-model="options.K2"></el-input>
          </el-form-item>
          <el-form-item label="K4">
              <el-input placeholder="请输入降斜率K4" v-model="options.K4"></el-input>
          </el-form-item>
          <el-form-item label="a5">
              <el-input placeholder="请输入井斜角a5" v-model="options.a5"></el-input>
          </el-form-item>
          <el-form-item label="deltaH5">
              <el-input placeholder="请输入垂深增量deltaH5" v-model="options.deltaH5"></el-input>
          </el-form-item>
          <el-form-item label="deltaHtf">
              <el-input placeholder="请输入口袋深度deltaHtf" v-model="options.deltaHtf"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
          </el-form-item>
      </el-form>
      
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
    data() {
        return {
            options: {
                Ht: null,
                faiShe: null,
                Ha: null,
                K2: null,
                K4: null,
                a5: null,
                deltaH5: null,
                deltaHtf: null
            }
        }
    },
    methods: {
        ...mapActions(['setoptionsAsync']),
        onSubmit () {
            this.setoptionsAsync(this.options).then(res => {
                this.$alert('提交成功')
                this.$router.push('/runtime')
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.designDrill{
    border: 1px solid #ccc;
}
.form{
    margin: 10px;
}

</style>