import {INCREMENT_ASYNC} from './mutation-types'

const mutations = {
    ['INCREMENT'] (state) {
        state.count++
    },
    ['SETOPTIONS'] (state, options) {
        state.options = {...options}
    },
    ['SETSOLUTION'] (state, solution) {
        state.solution = {...solution}
    },
    ['ADDLOG'] (state, message) {
        state.log.push(message)
    }
}


export default mutations