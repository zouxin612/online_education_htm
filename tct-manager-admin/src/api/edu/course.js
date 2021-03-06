import request from '@/utils/request'

// 定义一个常量路径值
const api_name = '/edu/course'

export default{
    saveCourseInfo(courseInfoVo){
        return request({
            url:`${api_name}/addCourseInfo`,
            method:'post',
            data:courseInfoVo
        })
    },
    // 根据课程id查询信息
    getCourseInfoById(id){
        return request({
            url:`${api_name}/getCourseInfoById/`+id,
            method:'get'
        })
    },
    // 修改课程信息
    updateCourseInfo(courseInfoVo){
        return request({
            url:`${api_name}/updateCourseInfo`,
            method:'put',
            data:courseInfoVo
        })
    },
     // 查询要发布的信息
     findCoursePublishInfoById(id){
        return request({
            url:`${api_name}/getCoursePublishInfo/` + id,
            method:'get'
        })
    },
    // 根据课程id发布课程信息
    publishCourse(id) {
        return request({
          url: `${api_name}/publishCourseInfo/` + id,
          method: 'put'
        })
    }
}