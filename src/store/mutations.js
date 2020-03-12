import {INCREMENT_ASYNC} from './mutation-types'

const mutations = {
    ['INCREMENT'] (state) {
        state.count++
    },
    ['SETOPTIONS'] (state, options) {
        console.log(options)
        state.options = {...options}
    }
}


export default mutations