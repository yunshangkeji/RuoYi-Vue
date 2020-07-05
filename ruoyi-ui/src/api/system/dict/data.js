import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/admin/system/dict_data_list',
    method: 'get',
    data: query
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/admin/system/dict_data',
    method: 'get',
    data: {dictCode}
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/admin/system/dict_data_type',
    method: 'get',
    data: {dictType}
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/admin/system/dict_data',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/admin/system/dict_data',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/admin/system/dict_data',
    method: 'delete',
    data: {dictCode}
  })
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: '/admin/system/dict_data_export',
    method: 'get',
    data: query
  })
}