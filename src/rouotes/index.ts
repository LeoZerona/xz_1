import { createRouter, createWebHistory } from "vue-router";
 
 
let routes= [
    {
        path: '/home',
        name: 'home',
        component: ()=>import('@/view/home.vue')
    },
    {
        path: '/topic_bank',
        name: 'topicBank',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: ()=>import('@/view/topicBank.vue')
    },
    {
        path: '/unit_learn',
        name: 'unitLearn',
        component: ()=> import('@/view/unitLearn.vue')
    }
    //{
        //配置404页面
        //path: '/:catchAll(.*)',
        //name: '404',
        //component: () => import(''),
    //}
]
// 路由
const router = createRouter({
    history: createWebHistory(),
    routes
})
// 导出
export default router 