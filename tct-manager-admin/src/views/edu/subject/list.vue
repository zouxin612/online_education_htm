<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>
<script>
import subjectApi from "@/api/edu/subject.js";

export default {
  data() {
    return {
      filterText: "",
      subjectList: [],
      defaultProps: {
        children: "subjectChildrenList",// 对应后台返回数据的对象属性
        label: "title"
      }
    };
  },
  created() {
      // 调用定义的方法
      this.getSubjectNodeList()
  },
  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val);
    }
  },
  methods: {
    // 获取课程树形结构数据
    getSubjectNodeList() {
      subjectApi.getSubjectTreeList().then(response => {
        if (response.success === true) {
          this.subjectList = response.data.items;
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true
      // 为了转换大小写匹配的问题
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
};
</script>