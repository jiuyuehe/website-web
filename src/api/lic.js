import request from '@/utils/request'

export function updateLic(data) {
  return request({
    url: '/site/lic/update',
    method: 'post',
    data
  })
}

