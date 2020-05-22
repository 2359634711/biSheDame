
import types from './mutation-types'

const mutations = {
    [types.INCREMENT](state) {
        state.count++
    },
    [types.SETOPTIONS](state, options) {
        state.moduleList[state.currentModuleIndex].options = { ...options }
    },
    [types.SETSOLUTION](state, solution) {
        console.log(solution)
        state.moduleList[state.currentModuleIndex].solution = { ...solution }
    },
    [types.ADDLOG](state, message) {
        state.log.push(message)
    },
    [types.SETCURRENTMODULEINDEX](state, index) {
        state.currentModuleIndex = index
    }
}


export default mutations