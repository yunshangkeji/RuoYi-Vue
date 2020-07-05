import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/public/login_admin',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/admin/user_info',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/admin/user_logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/public/captcha_image',
    method: 'get'
  })
}