<template>
    <div id="userBox">
        <div id="userText">{{msg}}</div>
        <button @click="func()">asd</button>
    </div>
</template>

<script>
import {setTheme} from '../../utils/style'
export default {
    data(){
        return{
            msg: 'Im User',
            theme: 'white'
        }
    },
    methods: {
        func(){
            this.theme = this.theme == 'white' ? 'black' : 'white'
            setTheme(this.theme)
        }
    }
}
</script>

<style lang="scss">
#userBox{
    background: $backC;
}
</style>
