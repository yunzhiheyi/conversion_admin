import admin from "@/api/admin";
const SET_TOTAL = "SET_TOTAL";
const SET_SHIPPING = "SET_SHIPPING";
const state = {
  total: {},
  orderData: {},
  userData: {},
  user: {},
  totalAmount: {},
  shipping: {},
};

const getters = {
  total: (state) => state.total,
  user: (state) => state.user,
  orderData: (state) => state.orderData,
  userData: (state) => state.userData,
  totalAmount: (state) => state.totalAmount,
  shipping: (state) => state.shipping,
};

const actions = {
  async dashboardTotal({ commit, getters }) {
    const res = await admin.dashboardQuery();
    commit(SET_TOTAL, res.data);
  },
  setShipping({ commit, getters }, data) {
    commit(SET_SHIPPING, data);
  },
};

const mutations = {
  [SET_TOTAL](state, RES) {
    state.total = {
      w: RES && RES.orderState.w,
      y: RES && RES.orderState.y,
      f: RES && RES.orderState.f,
    };
    state.user = RES.user;
    state.orderData = RES.orderData;
    state.userData = RES.userData;
    state.totalAmount = RES.totalAmount;
  },
  [SET_SHIPPING](state, data) {
    state.shipping = data;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
