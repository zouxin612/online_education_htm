// 导入需要的js
import request from '@/utils/request'

// 定义一个常量路径值
const api_name = '/edu/teacher'

export default {
    getPageTeacherList(page, limit, teacherQueryVo) {
        return request({
            url: `${api_name}/wrapper/${page}/${limit}`,
            method: 'post',
            data: teacherQueryVo
        })
    },
    // 删除讲师
    deleteTeacherById(id) {
        return request({
            url: `${api_name}/delete/${id}`,
            method: 'delete'
        })
    },
    // 添加讲师信息
    addTeacherInfo(teacher){
        return request({
            url:`${api_name}/save`,
            method:'post',
            data:teacher
        })
    },
    // 根据id查询数据为了点击编辑回显数据使用
    getTeacherInfoById(id){
        return request({
            url:`${api_name}/get/${id}`,
            method:'get'
        })
    },
    // 编辑讲师信息
    editTeacherInfo(teacher){
        return request({
            url:`${api_name}/update/${teacher.id}`,
            method:'put',
            data:teacher
        })
    },
    // 查询所有讲师信息
    findAllTeacherInfo(){
        return request({
            url:`${api_name}/getAll`,
            method:'get'
        })
    }
}
