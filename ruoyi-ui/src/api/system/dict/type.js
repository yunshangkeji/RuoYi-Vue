import request from '@/utils/request'

// 查询字典类型列表
export function listType(query) {
  return request({
    url: '/admin/system/dict_type_list',
    method: 'get',
    data: query
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: '/admin/system/dict_type',
    method: 'get',
    data: {dictId}
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/admin/system/dict_type',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/admin/system/dict_type',
    method: 'put',
    data: data
  })
}

// 删除字典类型
export function delType(dictId) {
  return request({
    url: '/admin/system/dict_type',
    method: 'delete',
    data: {dictId}
  })
}

// 清理参数缓存
export function clearCache() {
  return request({
    url: '/admin/system/dict_type_clearCache',
    method: 'delete'
  })
}

// 导出字典类型
export function exportType(query) {
  return request({
    url: '/admin/system/dict_type_export',
    method: 'get',
    data: query
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/admin/system/dict_type_optionselect',
    method: 'get'
  })
}