import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/admin/system/notice_list',
    method: 'get',
    data: query
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/admin/system/notice',
    method: 'get',
    data: {noticeId}
  })
}

// 新增公告
export function addNotice(data) {
  return request({
    url: '/admin/system/notice',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateNotice(data) {
  return request({
    url: '/admin/system/notice',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delNotice(noticeId) {
  return request({
    url: '/admin/system/notice',
    method: 'delete',
    data: {noticeId}
  })
}