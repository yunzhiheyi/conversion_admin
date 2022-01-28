import { getStore, setStore} from '../../utils/store'
// 添加查看过的视图到标签栏
const ADD_VISITED_VIEWS = 'tags/ADD_VISITED_VIEWS'

// 从标签栏删除单个视图
const DEL_VISITED_VIEWS = 'tags/DEL_VISITED_VIEWS'

// 从标签栏删除其他视图
const DEL_OTHERS_VIEWS = 'tags/DEL_OTHERS_VIEWS'

// 从标签栏删除所有视图
const DEL_ALL_VIEWS = 'tags/DEL_ALL_VIEWS'

const state = {
  visitedViews:getStore({ name: "tagList" }) || [],
}

const getters = {
  visitedViews: state => state.visitedViews,
}

const actions = {
  addVisitedViews({ commit }, view) {
    commit(ADD_VISITED_VIEWS, view)
  },
  delVisitedViews({ commit, state }, view) {
    return new Promise((resolve) => {
      commit(DEL_VISITED_VIEWS, view)
      resolve([...state.visitedViews])
    })
  },
  delOthersViews({ commit, state }, view) {
    return new Promise((resolve) => {
      commit(DEL_OTHERS_VIEWS, view)
      resolve([...state.visitedViews])
    })
  },
  delAllViews({ commit, state }) {
    return new Promise((resolve) => {
      commit(DEL_ALL_VIEWS)
      resolve([...state.visitedViews])
    })
  }
}

const mutations = {
  [ADD_VISITED_VIEWS](state, view) {
    if (state.visitedViews.some(v => v.name === view.name && v.path === view.path)) return
    // 用于通用路由根据Params参数显示不同数据实现Tag保存 routerParameterDescribe
    var isParams = Object.keys(view.params).length === 0
    var routerParameterDescribe = view.meta.parames && JSON.parse(view.meta.parames);
    state.visitedViews.push({
      name: view.name,
      path: view.path,
      query: view.query, // 地址栏传参数
      title: isParams ? view.meta.title : routerParameterDescribe[view.params.name]
    })
    setStore({ name: "tagList", content: state.visitedViews, type: "session" });
  },
  [DEL_VISITED_VIEWS](state, view) {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
    setStore({ name: "tagList", content: state.visitedViews, type: "session" });
  },
  [DEL_OTHERS_VIEWS](state, view) {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews = state.visitedViews.slice(i, i + 1)
        break
      }
    }
    setStore({ name: "tagList", content: state.visitedViews, type: "session" });
  },
  [DEL_ALL_VIEWS](state) {
    state.visitedViews = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
