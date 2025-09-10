import { createRouter, createWebHistory } from "vue-router";
let homeComponent = () => import("@/view/home.vue");

let routes = [
  // 主页
  {
    path: "/",
    component: homeComponent,
  },
  {
    path: "/index",
    component: homeComponent,
  },
  {
    path: "/home",
    name: "home",
    component: homeComponent,
  },
  // 单元选择页
  {
    path: "/topic_bank",
    name: "topicBank",
    //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    component: () => import("@/view/topicBank.vue"),
  },
  // 单元学习页
  {
    path: "/unit_learn",
    name: "unitLearn",
    component: () => import("@/view/unitLearn.vue"),
  },
  // 对照阅读页
  {
    path: "/reference_read",
    name: "referenceRead",
    component: () => import("@/view/referenceRead.vue"),
  },
  //{
  //配置404页面
  //path: '/:catchAll(.*)',
  //name: '404',
  //component: () => import(''),
  //}
];
// 路由
const router = createRouter({
  history: createWebHistory(),
  routes,
});
// 导出
export default router;
