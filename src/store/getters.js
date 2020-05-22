const getters = {
    count(state) {
        return state.count
    },
    options(state, getters) {
        return { ...getters.currentModule.options }
    },
    currentModule(state) {
        return { ...state.moduleList[state.currentModuleIndex] }
    },
    optionsList(state, getters) {
        let options = getters.options
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
    solution(state, getters) {
        return getters.currentModule.solution
    },
    log(state) {
        console.log(state.log)
        return state.log
    },
    currentModuleIndex(state) {
        return state.currentModuleIndex
    },
    moduleList(state) {
        return state.moduleList
    }
}

export default getters