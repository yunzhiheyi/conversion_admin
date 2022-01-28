import admin from "@/api/admin";

import { removeToken, setToken } from "@/utils/auth";
import Cookies from "js-cookie";

const RECEIVE_USER_INFO = "auth/RECEIVE_USER_INFO";
const UPDATE_USER_INFO = "auth/UPDATE_USER_INFO";
const UPDATE_USER_INFO_POWER = "auth/UPDATE_USER_INFO_POWER";
const RECEIVE_USER_SYS_INFO = "auth/RECEIVE_USER_SYS_INFO";

const state = {
  userInfo: null,
  menuTree: null,
  token: null,
  SYS: null,
};

const getters = {
  userInfo: (state) => state.userInfo,
  menuTree: (state) => state.menuTree,
  SYS: (state) => state.SYS,
};

const actions = {
  // 登录
  Login({ commit }, userInfo) {
    const username = userInfo.username.trim();
    return new Promise((resolve, reject) => {
      admin
        .login({
          password: userInfo.password,
          username: username,
          verifyCode: userInfo.verifyCode,
        })
        .then((response) => {
          if (response.data) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 信息
  setSysInfo({ commit }, sysInfo) {
    commit(RECEIVE_USER_SYS_INFO, sysInfo);
  },
  // 登出
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      admin
        .logout()
        .then(() => {
          removeToken();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async fetchUserInfo({ commit }) {
    try {
      const res = await admin.getInfo(Cookies.get("user_id"));
      commit(RECEIVE_USER_INFO, res);
      // commit(UPDATE_USER_INFO_POWER, res.userInfo.power);
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  updateUserInfoAction(context, userData) {
    context.commit(UPDATE_USER_INFO, userData);
  },
  // 更新用户权限
  updateUserPower(context, data) {
    admin.getInfo(state.userInfo.uid).then((data) => {
      context.commit(UPDATE_USER_INFO_POWER, data.userInfo.power);
    });
  },
};

const mutations = {
  [RECEIVE_USER_INFO](state, res) {
    state.userInfo = res.data.userInfo;
    state.SYS = res.data.SYS;
    state.menuTree = res.data.powerTree;
  },
  [RECEIVE_USER_SYS_INFO](state, sysInfo) {
    // 更新系统信息
    for (const key in sysInfo) {
      state.SYS[key] = sysInfo[key];
    }
  },
  [UPDATE_USER_INFO](state, userInfo) {
    // 更新运行时用户信息
    for (const key in userInfo) {
      state.userInfo[key] = userInfo[key];
    }
  },
  // 更新用户权限
  [UPDATE_USER_INFO_POWER](state, data) {
    state.userInfo.power = data.data;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
