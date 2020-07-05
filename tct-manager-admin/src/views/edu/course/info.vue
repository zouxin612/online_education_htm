<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="课程发布" />
    </el-steps>

    <!--课程发布第一步的页面列表-->
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类 使用change函数实现级别联动效果-->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/oss/file/upload'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import courseApi from "@/api/edu/course";
import subjectApi from "@/api/edu/subject";
import teacherApi from "@/api/edu/teacher";
import Tinymce from "@/components/Tinymce"; //引入富文本组件

// 定义页面需要使用的参数
const defaultForm = {
  title: "",
  subjectId: "",
  subjectParentId: "",
  teacherId: "",
  lessonNum: 0,
  description: "",
  cover: "/static/default.jpg", // 初始定义一个默认图片为了可以显示出来
  price: 0
};

export default {
  // 引入富文本组件
  components: { Tinymce },
  data() {
    return {
      courseInfo: defaultForm,
      teacherList: [], // 定义讲师数据列表
      subjectOneList: [], // 定义一级课程列表分类数据集合
      subjectTwoList: [], // 定义二级课程列表分类数据集合
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId:'', //课程id
      BASE_API: process.env.BASE_API // 接口API地址
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        // 根据课程id获取课程基本信息
        this.fetchCourseInfoById();
      } else {
        this.courseInfo = { ...defaultForm };
        // 查询所有一级分类课程数据
        this.findAllOneSubjectInfo();
        // 查询所有讲师信息
        this.findAllTeacherInfo();
      }
  },
  methods: {
    // 根据课程id获取课程基本信息
    fetchCourseInfoById() {
      // 调用外部函数
      courseApi.getCourseInfoById(this.courseId).then(response => {
        this.courseInfo = response.data.items;
        // 初始化分类列表
        subjectApi.getSubjectTreeList().then(responseSubject => {
          this.subjectOneList = responseSubject.data.items;
          for (let i = 0; i < this.subjectOneList.length; i++) {
            if (this.subjectOneList[i].id === this.courseInfo.subjectParentId) {
              this.subjectTwoList = this.subjectOneList[i].subjectChildrenList;
            }
          }
        });
        // 获取所有讲师列表
        this.findAllTeacherInfo();
      });
    },
    //上传封面成功调用的方法
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url;
    },
    //上传之前调用的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 根据一级分类查询二级分类数据  value是框架将一级分类的id自动封装过来
    subjectLevelOneChanged(value) {
      // 遍历所有的分类，包含一级和二级
      for (var i = 0; i < this.subjectOneList.length; i++) {
        // 获取查询出来的数据id
        var subjectId = this.subjectOneList[i].id;
        if (value === subjectId) {
          // 表示选中了该分类的一级分类
          this.subjectTwoList = this.subjectOneList[i].subjectChildrenList;
          // 清空二级分类绑定的id
          this.courseInfo.subjectId = "";
        }
      }
    },
    // 查询所有一级分类课程数据
    findAllOneSubjectInfo() {
      subjectApi.getSubjectTreeList().then(response => {
        this.subjectOneList = response.data.items;
      });
    },
    // 查询所有讲师信息
    findAllTeacherInfo() {
      teacherApi.findAllTeacherInfo().then(response => {
        this.teacherList = response.data.items;
      });
    },
    // 点击下一步添加操作
    addCourseInfo(){
       // 调用外部定义的函数
      courseApi
        .saveCourseInfo(this.courseInfo)
        .then(response => {
          // 提示信息
          this.$message({
            type: "success",
            message: "添加课程信息成功!"
          });
          return response; // 将响应结果传递给then
        })
        .then(response => {
          // 点击下一步，跳转到下一步
          this.$router.push({
            path: "/edu/course/chapter/" + response.data.cid
          });
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: response.message
          });
        });
    },
    updateCourseInfo(){
      this.saveBtnDisabled = true
      courseApi.updateCourseInfo(this.courseInfo).then(response => {
        this.$message({
            type: 'success',
            message: '修改成功!'
        })
        return response
      }).then(response => {
        // 点击下一步，跳转到下一步
          this.$router.push({
            path: "/edu/course/chapter/" + this.courseId
          });
      }).catch(response => {
        this.$message({
            type: 'error',
            message: response.message
        })
      })
    },
    // 点击下一步
    saveOrUpdate() {
      if(this.$route.params && this.$route.params.id){
        // 路径中有id
        this.updateCourseInfo()
      }else{
        this.addCourseInfo()
      }
    }
  }
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>