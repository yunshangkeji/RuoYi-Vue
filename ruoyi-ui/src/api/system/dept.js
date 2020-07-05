import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/admin/system/dept_list',
    method: 'get',
    data: query
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/admin/system/dept_list_exclude',
    method: 'get',
    data: {deptId}
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/admin/system/dept',
    method: 'get',
    data: {deptId}
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/admin/system/dept_treeselect',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/admin/system/dept_roleDeptTreeselect',
    method: 'get',
    data: {roleId}
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/admin/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/admin/system/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/admin/system/dept',
    method: 'delete',
    data: {deptId}
  })
}