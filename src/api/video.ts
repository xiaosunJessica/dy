import { request } from '@/utils/request'

export function recommendedVideo(params?: any, data?: any) {
  return request({ url: '/video/recommended', method: 'get', params, data })
}