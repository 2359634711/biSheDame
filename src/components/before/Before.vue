<template>
    <div class="before">
        <el-dialog
            title="更换模式"
            :visible.sync="changeVisible"
            @close="closeChange">
            <change-module 
                :close="closeChange" 
            ></change-module>
        </el-dialog>
        
        <div class="currentModule">
            当前选择的是：
            <span class="moduleName">{{moduleList[currentModuleIndex].name}}
            </span>
            <el-button class="changeBtn" type="text" @click="changeModule">点击更换模式</el-button>
        </div>

        <natural-curve-module 
            v-if="currentModuleIndex == 0"  
        />

       
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import ChangeModule from './ChangeModule.vue'
import NaturalCurveModule from './NaturalCurveModule.vue'
export default {
    components: {
        ChangeModule,
        NaturalCurveModule
    },
    data() {
        return {
            changeVisible: false
        }
    },
    methods: {
        changeModule(){
            this.changeVisible = true
        },
        closeChange(){
            this.changeVisible = false
        }
    },
    computed: {
        ...mapGetters(['currentModuleIndex', 'moduleList'])
    }
}
</script>


<style lang="scss" scoped>
.before{
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.currentModule{
    margin-top: 20px;
    height: 50px;
}
.moduleName{
    padding: 10px;
    background: $successC;
    color: #fff;
}
.changeBtn{
    display: inline-block;
}
</style>