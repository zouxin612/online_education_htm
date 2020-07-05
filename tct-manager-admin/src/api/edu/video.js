import request from '@/utils/request'

// 定义一个常量路径值
const api_name = '/edu/video'

export default {

    saveVideoInfo(videoInfo) {
      return request({
        url: `${api_name}/addVideoInfo`,
        method: 'post',
        data: videoInfo
      })
    },
  
    getVideoInfoById(videoId) {
      return request({
        url: `${api_name}/get/` + videoId,
        method: 'get'
      })
    },
  
    updateVideoInfoById(videoInfo) {
      return request({
        url: `${api_name}/update/`,
        method: 'put',
        data: videoInfo
      })
    },
  
    removeById(videoId) {
      return request({
        url: `${api_name}/delete/` + videoId,
        method: 'delete'
      })
    }
  }