import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import admin from './modules/admin'
import permission from './modules/permission'
import tag from './modules/tag'
import order from './modules/order'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    tag,
    app,
    admin,
    order,
    permission
  },
})

