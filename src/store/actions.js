import types from './mutation-types'

const actions = {
    incrementAsync ({commit}) {
        commit({type: types.INCREMENT})
    },
    setoptionsAsync ({commit}, options) {
        commit(types.SETOPTIONS, options)
    },
    setSolutionAsync ({commit}, solution) {
        commit(types.SETSOLUTION, solution)
    },
    addLogAsync ({commit}, message) {
        return new Promise(resolve => {
            commit(types.ADDLOG, message)
            resolve()
        })
    },
    setCurrentModuleIndexAsync({commit}, index) {
        commit(types.SETCURRENTMODULEINDEX, index)
    }
}

export default actions