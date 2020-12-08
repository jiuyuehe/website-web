import request from '@/utils/request'

export function entStatList(params) {
  return request({
    url: '/site/ent/list/stat',
    method: 'get',
    params
  })
}

