import Vue from "vue"
import Vuex from "vuex"
import api from "./modules/api"
import app from "./modules/app"
import user from "./modules/user"
import tagsView from "./modules/tagsView"
import permission from "./modules/permission"
import settings from "./modules/settings"
import getters from "./getters"

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    api,
    app,
    user,
    tagsView,
    permission,
    settings
  },
  getters
})

export default store
