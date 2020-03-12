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
        solutions: {

        }
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
        }
    },
    mutations,
    actions
})

export default store