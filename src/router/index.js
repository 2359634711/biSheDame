import VueRouter from "vue-router";
import Before from '../components/before/Before.vue'
import Runtime from '../components/runtime/Runtime.vue'
import Solution from '../components/solution/Solution.vue'
const routes = [
    {
        path: '/before',
        component: Before
    },{
        path: '/runtime',
        component: Runtime
    },{
        path: '/solution',
        component: Solution
    }
]

const router = new VueRouter({
    routes
})

export default router