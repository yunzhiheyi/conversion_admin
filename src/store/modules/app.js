const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
const SET_NOTIFICATION = 'SET_NOTIFICATION'
const GET_SIDEBAR = 'GET_SIDEBAR'
const SET_PASSOWROD = 'SET_PASSOWROD'
const SET_ISMSG = 'SET_ISMSG'
const state = {
  sidebar: {
    opened: true
  },
  isBell: false,
  isEditPassword: false,
  notification: false,
  msgData: {
    isMsg: false,
    type: null,
  },
  notificationB: false
}

const getters = {
  sidebar: state => state.sidebar,
  isBell: state => state.isBell,
  msgData: state => state.msgData,
  notification: state => state.notification,
  isEditPassword: state => state.isEditPassword
}

const actions = {
  toggleSideBar({ commit }) {
    commit(TOGGLE_SIDEBAR)
  },
  togglePassword({ commit }, data) {
    commit(SET_PASSOWROD, data)
  },
  setMsg({ commit }, data) {
    commit(SET_ISMSG, data)
  },
  async getNotification({ commit }, data) {
    commit(GET_SIDEBAR, data)
  },
  toggleNotification({ commit }, data) {
    commit(SET_NOTIFICATION, data)
  }
}

const mutations = {
  [SET_ISMSG] (state, data) {
    state.msgData = {
      isMsg: data.isMsg,
      type: data.type,
    }
  },
  [TOGGLE_SIDEBAR](state) {
    state.sidebar.opened = !state.sidebar.opened
  },
  [GET_SIDEBAR](state, data) {
    state.isBell = data
  },
  [SET_PASSOWROD](state, data) {
    if (data) {
      state.isEditPassword = false
    } else {
      state.isEditPassword = !state.isEditPassword
    }
  },
  [SET_NOTIFICATION](state, data) {
    if (data) {
      state.notification = false
    } else {
      state.notification = !state.notification
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
