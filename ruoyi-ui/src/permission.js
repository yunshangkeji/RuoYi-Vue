import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { getRouters } from '@/api/menu'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (!getToken()) {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
    return
  }
  /* has token*/
  if (to.path === '/login') {
    next({ path: '/' })
    NProgress.done()
    return
  }
  if (store.getters.roles.length !== 0) {
    next()
    // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
    // if (hasPermission(store.getters.roles, to.meta.roles)) {
    //   next()
    // } else {
    //   next({ path: '/401', replace: true, query: { noGoBack: true }})
    // }
    // 可删 ↑
    return
  }
  // 向后端请求路由数据
  getRouters().then(data => {
    store.dispatch('GetInfo', data)
    store.dispatch('GenerateRoutes', data)
    router.addRoutes(data.accessedRoutes) // 动态添加可访问路由表
    next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
  }).catch(() => {
    store.dispatch('FedLogOut').then(() => {
      // Message.error(err)
      next({ path: '/' })
    })
  })
})

router.afterEach(() => {
  NProgress.done()
})
