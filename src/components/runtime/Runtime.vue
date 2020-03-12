<template>
    <div class="box">
        <div class="left">
            <div class="options">
                <el-table :data="optionsList" border stripe>
                    <el-table-column v-for="col in columns"
                        :prop="col.id"
                        :key="col.id"
                        :label="col.label"
                        :width="col.width">
                    </el-table-column>
                </el-table>                
            </div>
            <el-button class="btn" type="primary" @click="run">运行</el-button>
        </div>
        <div class="right">
            <canvas></canvas>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data(){
        return {
            msg: 'Im Runtime',
            columns: [
                {
                    id: 'title',
                    label: '变量名',
                    width: 80
                },{
                    id: 'value',
                    label: '值',
                    width: 150
                }
            ]
        }
    },
    methods: {
        run(){

        }
    },
    computed: {
        optionsList(){
            return this.$store.getters.optionsList
        }
    }
}
</script>


<style lang="scss" scoped>

.box{
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
.left{
    position: relative;
    width: 250px;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .options{
        overflow: scroll;
        margin-bottom: 40px;
    }
    .btn{
        position: absolute;
        bottom: 0px;
        width: 100%;
        border-radius: 0px;
    }
}
.right{
    flex-grow: 1;
    height: 100%;
    background: rgb(255, 129, 71);
}

</style>