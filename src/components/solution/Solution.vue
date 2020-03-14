<template>
    <div class="solution">
        <div class="nav">
            <el-tabs v-model="tabActive"
                tab-position='top'>
                <el-tab-pane v-for="item in tabs"
                    :key="item.id"
                    :label = "item.label"
                    :name="item.id">
                </el-tab-pane>
            </el-tabs>
            
        </div>

        <div class="wrap">
            <el-table v-if="tabActive == 0" :data="solution.dataAll" border stripe>
                <el-table-column v-for="(col, index) in columns"
                    :prop="col.id"
                    :key="col.id"
                    :label="col.label">
                    <template slot-scope="scope">
                        <div class="tableItem">{{Math.round(scope.row[index] * 1000) / 1000}}</div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="canvas" v-else-if="tabActive == 1" ref="chart3d">
            </div>
            <div class="canvas" ref="chart2d" v-else>
            </div>
        </div>
        
        
    </div>
</template>

<script>
let myChart
window.onresize = () => {
    myChart.resize(true)
}
import {mapGetters} from 'vuex'
export default {
    data(){
        return {
            msg: 'Im Solution',
            columns: ['detaL m', 'α (°)', 'fai (°)', 'detaN m', 'detaE m', 'detaH m', 'detaS m', 'Kv (°)/30m', 'Kh (°)/30m', 'K (°)/30m', 'tao (°)/30m'],
            tabs: [{
                id: '0',
                label: '数据'
            },{
                id: '1',
                label: '三维井眼轨道图'
            },{
                id: '2',
                label: '二维井眼轨道图'
            }],
            tabActive: 0
        }
    },
    mounted() {
        this.columns = this.columns.map((v, i) => {
            return {
                id: ''+i,
                label: v
            }
        })
    },
    computed: {
        ...mapGetters(['solution'])
    },
    methods: {
        load3dChart() {
                myChart = this.$echarts.init(this.$refs.chart3d)
                myChart.setOption(this.solution.option)
        }
    },
    watch: {
        tabActive(val) {
            if(val == 1) {
                this.$nextTick(() => {
                    this.load3dChart()
                })
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.solution{
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
}
.nav{
    padding: 0 10px;
}
.wrap{
    flex-grow: 1;
    overflow-y: scroll;
}

.canvas{
    width: 100%;
    height: 100%;
    background: #ccc;
}
</style>