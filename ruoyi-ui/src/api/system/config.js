import request from '@/utils/request'

// 查询参数列表
export function listConfig(query) {
  return request({
    url: '/admin/system/config_list',
    method: 'get',
    data: query
  })
}

// 查询参数详细
export function getConfig(configId) {
  return request({
    url: '/admin/system/config',
    method: 'get',
    data: {configId}
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: '/admin/system/config_configKey',
    method: 'get',
    data: {configKey}
  })
}

// 新增参数配置
export function addConfig(data) {
  return request({
    url: '/admin/system/config',
    method: 'post',
    data: data
  })
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: '/admin/system/config',
    method: 'put',
    data: data
  })
}

// 删除参数配置
export function delConfig(configId) {
  return request({
    url: '/admin/system/config',
    method: 'delete',
    data: {configId}
  })
}

// 清理参数缓存
export function clearCache() {
  return request({
    url: '/admin/system/config_clearCache',
    method: 'delete'
  })
}

// 导出参数
export function exportConfig(query) {
  return request({
    url: '/admin/system/config_export',
    method: 'get',
    data: query
  })
}