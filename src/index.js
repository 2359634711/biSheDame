import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import store from './store'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import './utils/echart.gl'
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.use(VueRouter)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')