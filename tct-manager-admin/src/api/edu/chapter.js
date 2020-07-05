import request from '@/utils/request'

// 定义一个常量路径值
const api_name = '/edu/chapter'

export default {
    // 查询章节所有节点信息
    getNestedTreeList(couserId) {
        return request({
            url: `${api_name}/getChapterInfoList/` + couserId,
            method: 'get'
        })
    },
    // 添加章节信息
    saveChapterInfo(chapter) {
        return request({
            url: `${api_name}/addChapterInfo`,
            method: 'post',
            data: chapter
        })
    },
    // 修改章节信息
    updateChapterInfo(chapter) {
        return request({
            url: `${api_name}/update`,
            method: 'put',
            data: chapter
        })
    },
    // 根据章节id查询信息
    getChaperInfoById(chapterId) {
        return request({
            url: `${api_name}/get/` + chapterId,
            method: 'get'
        })
    },
    // 删除章节信息
    deleteChapterId(chapterId) {
        return request({
            url: `${api_name}/delete/` + chapterId,
            method: 'delete'
        })
    }

}