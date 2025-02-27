import { axiosInstance } from '@/utils/request'
import posts6 from '@/assets/data/posts6.json'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axiosInstance)


let allRecommendVideos = posts6.map((v: any) => {
  v.type = 'recommend-video'
  return v
})

export async function startMock() {
  mock.onGet(/video\/recommended/).reply(async (config) => {
    const { start, pageSize } = config.params
    // console.log('allRecommendVideos', cloneDeep(allRecommendVideos.length), config.params)
    return [
      200,
      {
        data: {
          total: 844,
          list: allRecommendVideos.slice(start, start + pageSize) // list: allRecommendVideos.slice(0, 6),
        },
        code: 200,
        msg: ''
      }
    ]
  })
}