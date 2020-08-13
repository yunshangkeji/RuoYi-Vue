import { login, logout } from '@/api/login'
import { getToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          commit('SET_TOKEN', '1')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }, data) {
      const user = data.user
      const avatar = (function () {
        if (typeof (user.avatar) === 'string' && user.avatar.length > 0) {
          return user.avatar
        }
        return require("@/assets/image/profile.jpg")
      })()
      if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
        commit('SET_ROLES', data.roles)
        commit('SET_PERMISSIONS', data.permissions)
      } else {
        commit('SET_ROLES', ['ROLE_DEFAULT'])
      }
      commit('SET_NAME', user.userName)
      commit('SET_AVATAR', avatar)
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', null)
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', null)
        removeToken()
        resolve()
      })
    }
  }
}

export default user
