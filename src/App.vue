<template>
    <div id="root" class="whiteTheme">
        <Header/>
        <router-link to='/home'>Go Home</router-link>
        <router-link to='/user'>Go User</router-link>
        <router-view></router-view>
        <div>{{msg}}</div>
        <Footer/>
    </div>
</template>
<script>
import Header from './components/header/Header.vue'
import Footer from './components/footer/Footer.vue'
import {RouterLink, RouterVue} from 'vue-router'
export default {
    data(){
        return {
            msg: 'Im App.vue'
        }
    },
    components: {
        Header,
        Footer
    }
}
</script>

<style lang="scss">

</style>