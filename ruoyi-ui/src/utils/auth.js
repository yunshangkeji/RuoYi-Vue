import Cookies from 'js-cookie'
import { setting_get, setting_del } from '@/utils/setting'
const TokenKey = 'Admin-Token'

export function getToken() {
  return setting_get('common_token')
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  setting_del('common_token')
  // return Cookies.remove(TokenKey)
}
