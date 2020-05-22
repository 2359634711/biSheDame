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
            <el-table v-show="tabActive == 0" :data="solution.dataAll" border stripe>
                <el-table-column v-for="(col, index) in columns"
                    :prop="col.id"
                    :key="col.id"
                    :label="col.label">
                    <template slot-scope="scope">
                        <div class="tableItem">{{Math.round(scope.row[index] * 1000) / 1000}}</div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="canvas" v-show="tabActive != 0" ref="chart">
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
import makeOption from './makeOption'
export default {
    data(){
        return {
            msg: 'Im Solution',
            // columns: ['detaL m', 'α (°)', 'fai (°)', 'detaN m', 'detaE m', 'detaH m', 'detaS m', 'Kv (°)/30m', 'Kh (°)/30m', 'K (°)/30m', 'tao (°)/30m'],
            columns: ['L', 'alph', 'fai', 'H', 'N', 'E', 'S', 'Kalph', 'Kfai'],
            tabs: [{
                id: '0',
                label: '数据'
            },{
                id: '1',
                label: '三维井眼轨道图'
            },{
                id: '2',
                label: '二维(N-H)井眼轨道图'
            },{
                id: '3',
                label: '二维(N-E)井眼轨道图'
            },{
                id: '4',
                label: '二维(E-H)井眼轨道图'
            },{
                id: '5',
                label: '二维(s-H)井眼轨道图'
            }],
            tabActive: 0
        }
    },
    mounted() {
        myChart = this.$echarts.init(this.$refs.chart) 
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
            myChart.setOption(makeOption('3d', this.solution.data3D, ['N坐标', 'E坐标', 'H深度']), true)
        },
        load2dChart(type) { 
            if(type == 'N-H'){
                myChart.setOption(makeOption('2d', this.solution.data3D.map(v => [v[0], v[2]]), ['N坐标', 'H深度']), true)
            }
            if(type == 'N-E'){
                myChart.setOption(makeOption('2d', this.solution.data3D.map(v => [v[0], v[1]]), ['N坐标', 'E坐标']), true)
            }
            if(type == 'E-H'){
                myChart.setOption(makeOption('2d', this.solution.data3D.map(v => [v[1], v[2]]), ['E坐标', 'H深度']), true)
            }
            if(type == 'S-H'){
                myChart.setOption(makeOption('2d', this.solution.data3D.map(v => [v[3], v[2]]), ['s水平位移', 'H深度']), true)
            }
        }
    },
    watch: {
        tabActive(val) {
            if(val == 1) {
                this.$nextTick(() => { 
                myChart.resize(true)
                    this.load3dChart()
                })
            }
            if(val == 2) {
                this.$nextTick(() => {
                myChart.resize(true)
                    this.load2dChart('N-H')
                })
            }
            if(val == 3) {
                this.$nextTick(() => {
                myChart.resize(true)
                    this.load2dChart('N-E')
                })
            }
            if(val == 4) {
                this.$nextTick(() => {
                myChart.resize(true)
                    this.load2dChart('E-H')
                })
            }
            if(val == 5) {
                this.$nextTick(() => {
                myChart.resize(true)
                    this.load2dChart('S-H')
                })
            }
        }
        // ,
        // solution:{
        //     handler(newValue){
        //         this.columns = newValue.shift()
        //         console.log(`dataChange:${newValue}`)
        //         return newValue
        //     },
        //     deep: true
        // }
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