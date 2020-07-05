import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/admin/system/menu_list',
    method: 'get',
    data: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/admin/system/menu',
    method: 'get',
    data: {menuId}
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/admin/system/menu_treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/admin/system/menu_roleMenuTreeselect',
    method: 'get',
    data: {roleId}
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/admin/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/admin/system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/admin/system/menu',
    method: 'delete',
    data: {menuId}
  })
}