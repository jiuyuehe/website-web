import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/site/pub/sign',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/site/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
