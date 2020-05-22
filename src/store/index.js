import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import mutations from './mutations'
import actions from './actions'
import getters from './getters'
const store = new Vuex.Store({
    state: {
        moduleList: [{
            id: 0,
            name: '自然曲线模型',
            options: {
                count: null,
                step: null,
                maxL: null,
                alp0: null,
                Kalp: null,
                fai0: null,
                Kfai: null
            },
            solution: {}
        }, {
            id: 1,
            name: '5段式定向井数值计算',
            options: {
                Ht: null,
                faiShe: null,
                Ha: null,
                K2: null,
                K4: null,
                a5: null,
                deltaH5: null,
                deltaHtf: null
            },
            solution: {
            }
        }, {
            id: 2,
            name: '5段式定向井自然曲线模型',
            options: {
                Ht: null,
                faiShe: null,
                Ha: null,
                K2: null,
                K4: null,
                a5: null,
                deltaH5: null,
                deltaHtf: null
            },
            solution: {
            }
        }, {
            id: 3,
            name: 'target to a point 自然曲线模型',
            options: {
                Ht: null,
                faiShe: null,
                Ha: null,
                K2: null,
                K4: null,
                a5: null,
                deltaH5: null,
                deltaHtf: null
            },
            solution: {
            }
        }],
        currentModuleIndex: 0,
        log: []
    },
    getters,
    mutations,
    actions
})

export default store