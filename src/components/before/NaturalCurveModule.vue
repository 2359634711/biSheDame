<template>
   <div class="naturalCurveModule">
        <el-form class="form" :model="options" ref="form" label-width="100px">
            <el-form-item label="起始的井斜角">
                <el-input placeholder="请输入起始的井斜角alp0" v-model="options.alp0"></el-input>
            </el-form-item>
            <el-form-item label="起始的方位角">
                <el-input placeholder="请输入起始的井斜角alp0" v-model="options.fai0"></el-input>
            </el-form-item>
            <el-form-item label="Kalp">
                <el-input placeholder="请输入Kalp" v-model="options.Kalp"></el-input>
            </el-form-item>
            <el-form-item label="Kfai">
                <el-input placeholder="请输入Kfai" v-model="options.Kfai"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">创建算例</el-button>
            </el-form-item>
        </el-form>
        </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
    data(){
        return {
            msg: 'Im Before',
            changeVisible: true,
            options: {
                count: null,
                step: null,
                maxL: null,
                alp0: null,
                Kalp: null,
                fai0: null,
                Kfai: null
            }
        }
    },
    methods: {
        ...mapActions([
            'incrementAsync',
            'setoptionsAsync'
            ]),
        onSubmit () {
            this.setoptionsAsync(this.options).then(res => {
                this.$alert('提交成功')
                this.$router.push('/runtime')
            })
        },
        changeModule(){
            this.changeVisible = true
        },
        closeChange(){
            this.changeVisible = false
        },
    },
    mounted () {
        this.options = this.$store.getters.options
    }
}
</script>

<style lang='scss' scoped>
.naturalCurveModule{
    border: 1px solid #ccc;
}
.form{
    margin: 10px;
}
</style>