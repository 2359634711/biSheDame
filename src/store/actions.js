import types from './mutation-types'

const actions = {
    incrementAsync ({commit}) {
        commit({type: types.INCREMENT})
    },
    setoptionsAsync ({commit}, options) {
        commit(types.SETOPTIONS, options)
    }
}

export default actions