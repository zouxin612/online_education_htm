<template>
  <div class="app-container">
    讲师列表
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQueryVo.name" placeholder="讲师名" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="teacherQueryVo.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQueryVo.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQueryVo.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getTeacherList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!--讲师列表表格展示-->
    <!-- 表格 -->
    <el-table :data="teacherList" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">{{ scope.row.level===1?'高级讲师':'首席讲师' }}</template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160" />

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页显示-->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getTeacherList"
    />
  </div>
</template>

<!--讲师列表数据调用-->
<script>
// 引入teacher.js
import teacherApi from "@/api/edu/teacher";

export default {
  // 定义变量模块
  data() {
    return {
      teacherList: null, // 数据列表
      page: 1, // 页码
      limit: 10, // 每页记录数
      total: 0, // 总记录数
      teacherQueryVo: {} //查询条件
    };
  },
  // 调用函数
  created() {
    this.getTeacherList();
  },
  // 自定义函数调用外部函数
  methods: {
    // 查询讲师列表函数
    getTeacherList(page = 1) {
      this.page = page; //默认不传入page的时候显示第一页
      // 调用teacher.js定义好的函数获取数据
      teacherApi
        .getPageTeacherList(this.page, this.limit, this.teacherQueryVo)
        .then(response => {
          if (response.success === true) {
            this.teacherList = response.data.rows;
            this.total = response.data.total;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 清空查询条件
    resetData() {
      this.teacherQueryVo = {};
      this.getTeacherList();
    },
    // 删除讲师功能
    removeDataById(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return teacherApi.deleteTeacherById(id)
      }).then(() => {
        // 刪除成功后查询列表数据进行回显数据
        this.getTeacherList()
        this.$message({
            type: 'success',
            message: '删除成功!'
        })
      }).catch(response => {
        if(response === 'cancel'){
            this.$message({
              type:'info',
              message:'取消删除'
            })
          }
          else{
            this.$message({
              type:'error',
              message:'删除失败'
            })
          }
      })
    }
  }
};
</script>