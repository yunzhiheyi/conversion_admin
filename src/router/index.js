/*
* 路由
*
*/
import Vue from 'vue'
import Router from 'vue-router'
import componentConfig from '@/utils/config.view.router'
Vue.use(Router)
export const constantRouterMap = [{
  name: 'login',
  path: '/login',
  hidden: true,
  component: componentConfig.login
}, {
  path: '/',
  hidden: true,
  component: componentConfig.layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    name: 'dashboard',
    component: componentConfig.dashboard,
    meta: {
      title: '控制台'
    }
  }]
}]
export const asyncRouterMap = []
export const errorRouterMap = [{
  name: '404',
  path: '/404',
  hidden: true,
  component: componentConfig.error
}, {
  name: 'default',
  path: '*',
  redirect: '/404',
  hidden: true
}]
// 添加默认路由值  key为父路由Id
export const defaultRouterMap = {
  'efnXTIA7o': [{
    'path': '/article/info/:name',
    'name': '添加文章',
    'routerUrl': '',
    'icon': '',
    'isShow': '2',
    'routerParameter': '',
    'component': componentConfig['article/info/:name'],
    'meta': {
      'title': '添加文章',
      'parames': '{"add":"添加文章","update":"更新文章"}'
    }
  }],
  'jDLiNeKp3': [{
    'path': '/product/info/:name',
    'name': '添加商品',
    'routerUrl': '',
    'icon': '',
    'isShow': '2',
    'routerParameter': '',
    'component': componentConfig['product/info/:name'],
    'meta': {
      'title': '添加商品',
      'parames': '{"add":"添加商品","update":"更新商品"}'
    }
  }]
}

const router = new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export default router
