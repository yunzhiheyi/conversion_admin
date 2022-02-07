/*
 * 路由
 *
 */
import Vue from "vue";
import Router from "vue-router";
import componentConfig from "@/utils/config.view.router";
Vue.use(Router);
export const constantRouterMap = [
  {
    name: "login",
    path: "/login",
    hidden: true,
    component: componentConfig.login,
  },
  {
    path: "/",
    hidden: true,
    component: componentConfig.layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: componentConfig.dashboard,
        meta: {
          title: "控制台",
        },
      },
    ],
  },
];
export const asyncRouterMap = [];
export const errorRouterMap = [
  {
    name: "404",
    path: "/404",
    hidden: true,
    component: componentConfig.error,
  },
  {
    name: "default",
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];

const router = new Router({
  mode: "history", // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});
export default router;
