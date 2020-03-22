import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import mutations from './mutations'
import actions from './actions'
const store = new Vuex.Store({
    state: {
        options: {
            count: null,
            step: null,
            maxL: null,
            alp0: null,
            Kalp: null,
            fai0: null,
            Kfai: null
        },
        moduleList:[{
            id: 0,
            name: '自然曲线模型'
        },{
            id: 1,
            name: '直——增——稳——降——稳型定向井眼轨道设计'
        }],
        currentModuleIndex: 0,
        solution: {},
        log: []
    },
    getters: {
        count(state) {
            return state.count
        },
        options (state) {
            return {...state.options}
        },
        optionsList (state) {
            let options = {...state.options}
            let optionsLsit = []
            for (const key in options) {
                if (options.hasOwnProperty(key)) {
                    const element = options[key];
                    optionsLsit.push({
                        title: key,
                        value: element
                    })
                }
            }
            return optionsLsit
        },
        solution (state) {
            return state.solution
        },
        log (state) {
            console.log(state.log)
            return state.log
        },
        currentModuleIndex(state) {
            return state.currentModuleIndex
        },
        moduleList(state) {
            return state.moduleList
        }
    },
    mutations,
    actions
})

export default store