<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>图书管理</el-breadcrumb-item>
        <el-breadcrumb-item>图书分类</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
     <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
       <el-form :inline="true"  :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="书名" @keyup.enter.native="handleSearch">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="showAddDialog">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="category" highlight-current-row @selection-change="selsChange"
      style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="[分类简介]">
              <span>{{ props.row.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="书名" sortable></el-table-column>
      <el-table-column prop="createDate" label="创建日期" width="150"></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="showAddDialog(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" @click="delCategory(scope.$index, scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
      style="float:right;">
    </el-pagination>
  </el-col>

  <!--新增界面-->
  <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
    <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model="addForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input type="textarea" v-model="addForm.description" :rows="8"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
    </div>
  </el-dialog>

</el-col>
</el-col>

</el-row>
</template>
<script>

import util from '../../common/util'
import API from '../../api/api_category'

export default{ 
  data(){
    return {
      loading: false,
      filters: {
        name: ''
      },
      category: [],
      sels: [], //列表选中列
      total: 0,
      page: 1,
      limit: 10,
      addFormRules: {
        name: [
        {required: true, message: '请输入书名', trigger: 'blur'}
        ], 
        description: [
        {required: true, message: '请输入简介', trigger: 'blur'}
        ]
      },
      addFormVisible: false,
      addLoading: false,
      addForm: {
        name: '',
        description: ''
      } 
    }

  },
  methods: {
    handleSearch() { 
      this.page = 1;
      this.total = 0;
      this.search();
    },
    selsChange(sels) {
      this.sels = sels;
    },
    search() {
      let that = this;
      let params = {
        page: that.page,
        limit: 10,
        name: that.filters.name
      };
      that.loading = true;
      API.findList(params).then(function (result) {
        that.loading = false;
        if(result && result.data){
          that.total = result.total;
          that.category = result.data;
        }
      }, function (err) {
        that.loading = false;
        that.$message.error({
          showClose: true,
          message: err.toString(),
          duration: 2000
        });
      }).catch(function (err) {
        that.loading = false;
        that.$message.error({
          showClose: true,
          message: '请求出现异常',
          duration: 2000
        });
      });
    },
    batchDeleteBook() {

    },
    handleCurrentChange(val) {
      this.page = val;
      this.search();
    },
    showAddDialog(index, row) { 
      //当row存在的时候是编辑
      if(typeof row !== 'undefined'){
        this.addFormVisible = true;
        this.addForm = Object.assign({}, row);
      }else{
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          description: ''
        };
      }
    },
    addSubmitHandler(params) {
     let that = this;
     API.add(params).then(function (result) {
      that.loading = false;
      if (result && parseInt(result.errcode) === 0) {
        that.$message.success({
          showClose: true,
          message: '新增成功',
          duration: 2000
        });
        that.$refs['addForm'].resetFields();
        that.addFormVisible = false;
        that.search();
      } else {
        that.$message.error({
          showClose: true,
          message: '新增失败',
          duration: 2000
        });
      }

    }, function (err) {
      that.$message.error({
        showClose: true,
        message: err.toString(),
        duration: 2000
      });
    }).catch(function (error) {
     that.loading = false;
     that.$message.error({
      showClose: true, 
      message: '请求出现异常', 
      duration: 2000
    });
   });
  },
  editSubmitHandler(params) {
   let that = this;
   API.update(params.id, params).then(function (result) {
    that.loading = false;
    if (result && parseInt(result.errcode) === 0) {
      that.$message.success({
        showClose: true,
        message: '修改成功',
        duration: 2000
      });
      that.$refs['addForm'].resetFields();
      that.addFormVisible = false;
      that.search();
    } else {
      that.$message.error({
        showClose: true,
        message: '修改失败',
        duration: 2000
      });
    }

  }, function (err) {
    that.$message.error({
      showClose: true,
      message: err.toString(),
      duration: 2000
    });
  }).catch(function (error) {
   that.loading = false;
   that.$message.error({
    showClose: true, 
    message: '请求出现异常', 
    duration: 2000
  });
 });
},
      addSubmit() { // 弹出层增加分类
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            let params = Object.assign({}, this.addForm);
            if(params.id){//id存在是编辑
              that.editSubmitHandler(params);
            }else{
              that.addSubmitHandler(params);
            }
          }
        });
      },
      showEditDialog(index, row) {

      },
      delCategory(index, row) {

      }

    },
    mounted() {
      this.handleSearch()
    }
  } 
  </script>
