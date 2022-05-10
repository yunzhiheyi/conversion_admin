import { errorRouterMap, defaultRouterMap } from "@/router";
import componentConfig from "@/utils/config.view.router";
// 设置权限路由
const GENERATE_ROUTERS = "permission/GENERATE_ROUTERS";
// 设置权限路由
const GENERATE_SIDEBARMENU = "permission/GENERATE_SIDEBARMENU";
// 清除权限路由
const CLEAR_ROUTERS = "permission/CLEAR_ROUTERS";

/**
 * 递归构建前端路由配置
 * @param tree
 */
function filterAsyncRouter(tree) {
  // 这里为啥要区分开，是因为导航与路由是没有直接关系，但是又不能影响路由的跳转
  return tree.map((item, key) => {
    var _options = {
      title: item.name,
      level: item.level,
      parames: item.routerParameterDescribe,
    };
    //如果是通用路由
    var _path =
      item.routerName && item.routerName.indexOf("/:") > -1
        ? item.routerPath
        : item.routerName;
    // 注册路由
    const routerTree = {
      meta: _options,
      path: "/" + _path,
      name: item.name,
      redirect: item.routerUrl,
      meta: _options,
    };
    // 递归时判断路由该添加哪一层级
    routerTree.component =
      item.isChild === "1" && componentConfig[item.routerName]
        ? componentConfig[item.routerName]
        : componentConfig.layout;
    if (item.children && item.children.length > 0) {
      routerTree.children = filterAsyncRouter(item.children);
    } else {
      // 如果是一级路由，判断是否有children且是不是1级，就给他添加children，这里是因为全局能用路由是有2级
      if (item.level === "1") {
        routerTree.children = [
          {
            path: "/" + _path,
            name: item.name,
            meta: _options,
            component: componentConfig[item.routerName],
          },
        ];
      }
    }
    // 路由按钮权限列表
    _options["btnList"] = {};
    if (item.btnListArr && item.btnListArr.length > 0) {
      item.btnListArr.map((res, index) => {
        if (res.btnId && res._id) {
          _options["btnList"][res.label] = res._id;
        }
      });
    }
    // 判断是否是子菜单，是就让父级跳到子菜单，routerUrl字段在后台设置
    if (
      item.level === "1" &&
      item.routerUrl &&
      item.children &&
      item.children.length > 0
    ) {
      routerTree.redirect = item.routerUrl;
    }
    return routerTree;
  });
}

/**
 * 递归构建前端菜单导航配置
 * @param tree
 */
function filterAsyncMenu(tree) {
  // 这里为啥要区分开，是因为导航与路由是没有直接关系，但是又不能影响路由的跳转
  return tree.map((item, key) => {
    var _path =
      item.routerName && item.routerName.indexOf("/:") > -1
        ? item.routerPath
        : item.routerName;
    // 注册导航
    const menuTree = {
      path: "/" + _path,
      name: item.name,
      icon: item.icon,
      level: item.level,
      isShow: item.isMenu,
      routerUrl: item.routerUrl,
      routerParameter: item.routerParameter,
      id: item._id,
    };
    if (item.children && item.children.length > 0) {
      menuTree.children = filterAsyncMenu(item.children);
    }
    return menuTree;
  });
}

// initial state
const state = {
  routers: [],
  extendRoutes: [],
  sideBarMenu: [],
};

// getters
const getters = {
  extendRoutes: (state) => state.extendRoutes,
  sideBarMenu: (state) => state.sideBarMenu,
  routers: (state) => state.routers,
};

// actions
const actions = {
  generateRoutes({ commit }, tree) {
    return new Promise((resolve) => {
      const accessedRouters = filterAsyncRouter(tree);
      const accessedMenu = filterAsyncMenu(tree);
      commit(GENERATE_ROUTERS, accessedRouters);
      commit(GENERATE_SIDEBARMENU, accessedMenu);
      resolve();
    });
  },
  clearPermissionRouter({ commit }) {
    commit(CLEAR_ROUTERS);
  },
};
// mutations
const mutations = {
  [GENERATE_ROUTERS](state, routers) {
    state.extendRoutes = routers.concat(errorRouterMap);
    state.routers = routers;
  },
  [GENERATE_SIDEBARMENU](state, barMenu) {
    state.sideBarMenu = barMenu;
  },
  [CLEAR_ROUTERS](state) {
    state.routers = [];
    state.extendRoutes = [];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
