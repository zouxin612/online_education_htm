<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

          <!-- 头衔缩略图 -->
          <pan-thumb :image="teacher.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">上传头像
          </el-button>

          <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调 
        <input type="file" name="file"/>
      -->
          <image-cropper
                        v-show="imagecropperShow"
                        :width="100"
                        :height="100"
                        :key="imagecropperKey"
                        :url="BASE_API+'oss/file/upload'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<!--添加讲师js-->
<script>
// 调用实际调用后台的js
import teacherApi from "@/api/edu/teacher"
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  // 包含组件
  components: { ImageCropper, PanThumb },
  // 定义存放数据的变量
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: ""
      },
      //上传弹框组件是否显示
      imagecropperShow:false,
      imagecropperKey:0,//上传组件key值
      BASE_API:process.env.BASE_API, //获取dev.env.js里面地址
      saveBtnDisabled: false // 保存按钮是否禁用
    };
  },
  created() {
    // 在此处判断是编辑操作还是添加操作
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      this.getTeacherInfoById(id);
    }
  },
  methods: {
    saveOrUpdate() {
      this.saveBtnDisabled = true;
      // 根据是否带有id判断是新增还是编辑操作
      if(this.teacher.id){
        this.editTeacherById()
      }else{
        this.addTeacherInfo()
      }
    },
    // 添加讲师信息
    addTeacherInfo() {
      teacherApi
        .addTeacherInfo(this.teacher)
        .then(response => {
          return this.$message({
            type: "success",
            message: "保存成功"
          });
        })
        .then(response => {
          // 保存成功后跳转到列表界面的路由
          this.$router.push({ path: "/edu/teacher/list" });
        })
        .catch(response => {
          // console.log(response)
          this.$message({
            type: "error",
            message: "保存失败"
          });
        });
    },
    // 根据讲师id查询讲师
    getTeacherInfoById(id) {
      teacherApi
        .getTeacherInfoById(id)
        .then(response => {
          this.teacher = response.data.item;
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: "获取数据失败"
          });
        });
    },
    // 根据讲师id编辑讲师信息
    editTeacherById() {
      this.saveBtnDisabled = true;
      teacherApi
        .editTeacherInfo(this.teacher)
        .then(response => {
          return this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .then(response => {
          // 编辑成功后跳转到列表界面的路由
          this.$router.push({ path: "/edu/teacher/list" });
        })
        .catch(response => {
          // console.log(response)
          this.$message({
            type: "error",
            message: "保存失败"
          });
        });
    },
    // 上传成功的函数
    cropSuccess(data){
      this.imagecropperShow = false
      this.teacher.avatar = data.url
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    },
    // 关闭上传组件
    close() {
      this.imagecropperShow = false
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    }

  }
};
</script>