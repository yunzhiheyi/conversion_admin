import Vue from "vue";
import "normalize.css/normalize.css";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import draggable from "vuedraggable";
import "@/styles/index.less"; // global css
import ToLink from "@/components/ToLink";
import App from "./App";
import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { getToken } from "@/utils/auth"; // 验权
import tools from "@/utils/tools";
import filters from "@/utils/filters"; // 过滤器
import "@/icons"; // icon
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
// 创建websocket

// Vue.prototype.$socket = new WebSocket(
//   "ws://junr.mynatapp.cc/websocket"
// );
// // use
Vue.use(mavonEditor);
Vue.use(ElementUI, {
  size: "small",
});
Vue.config.productionTip = false;
Vue.component("ToLink", ToLink); // 通用注册点击跳转
Vue.component("draggable", draggable); // 通用注册点击跳转
Object.keys(filters).forEach((k) => Vue.filter(k, filters[k]));
Vue.prototype.$tools = tools;
var EventBus = new Vue();
Vue.prototype.$eventBus = EventBus;
//     Event.$emit(事件名,数据);
//     Event.$on(事件名,data => {});

const whiteList = ["/login"]; // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    console.log(to.name);
    if (to.name !== "login") {
      if (!store.getters.userInfo) {
        store
          .dispatch("fetchUserInfo")
          .then((res) => {
            const tree = res.data.powerTree;
            store.dispatch("generateRoutes", tree).then(() => {
              router.addRoutes(store.getters.extendRoutes); // 动态添加可访问路由表
              next({ ...to });
            });
          })
          .catch(() => {
            next({ path: "/login" });
          });
        next();
      } else {
        next();
      }
    } else {
      next("/dashboard");
      NProgress.done();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next("/login");
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App },
});
