// 导入需要的js
import request from '@/utils/request'

// 定义一个常量路径值
const api_name = '/edu/subject'

export default{
    // 获取课程树形结构数据
    getSubjectTreeList(){
        return request ({
            url:`${api_name}/treeList`,
            method:'get'
        })
    }
}