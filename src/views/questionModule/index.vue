<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>模块管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" style="margin-top: 20px">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleSave()">添加</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button size="small" icon="el-icon-back" @click="backToModule()">返回</el-button>
      </el-form-item>
      <div style="clear: both"></div>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border
              element-loading-text="加载中">
      <el-table-column sortable prop="questionNo" label="编号">
      </el-table-column>
      <el-table-column sortable label="问题类型">
        <template slot-scope="scope">
          <div v-if="scope.row.optType === 'INPUT'">输入</div>
          <div v-if="scope.row.optType === 'TEXT'">文本</div>
          <div v-if="scope.row.optType === 'RADIO'">单选</div>
          <div v-if="scope.row.optType === 'CHECKBOX'">多选</div>
        </template>
      </el-table-column>
      <el-table-column sortable prop="issue" label="问题" width="600" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="handleStatus === 1?'添加':handleStatus === 2?'修改':'查看'" :visible.sync="editFormVisible"
               width="60%" @click="closeDialog" @close="dialogClosed()">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <!--prop用作检索rules校验规则-->
        <el-form-item label="编号" prop="questionNo">
          <el-input size="small" v-model="editForm.questionNo" auto-complete="off"
                    placeholder="输入问题编号"></el-input>
        </el-form-item>
        <el-form-item label="归类" prop="queType">
          <el-radio v-model="editForm.queType" label="0">问题</el-radio>
          <el-radio v-model="editForm.queType" label="1">诊断框</el-radio>
          <el-radio v-model="editForm.queType" label="2">附属诊断框</el-radio>
        </el-form-item>
        <el-form-item label="题目类型" prop="optType">
          <el-radio v-model="editForm.optType" label="INPUT">输入</el-radio>
          <el-radio v-model="editForm.optType" label="RADIO">单选</el-radio>
          <el-radio v-model="editForm.optType" label="CHECKBOX">多选</el-radio>
          <el-radio v-model="editForm.optType" label="TEXT">文本</el-radio>
        </el-form-item>
        <el-form-item label="问题内容" prop="issue">
          <el-input size="small" v-model="editForm.issue" auto-complete="off" placeholder="输入题目文本"></el-input>
        </el-form-item>
        <el-form-item label="补充信息">
          <el-input size="small" v-model="editForm.note" auto-complete="off" placeholder="输入补充信息"></el-input>
        </el-form-item>
        <el-form-item label="由谁作答" prop="answers">
          <el-radio v-model="editForm.answers" label="0">管理员</el-radio>
          <el-radio v-model="editForm.answers" label="1">受试者</el-radio>
        </el-form-item>
        <el-form-item label="排序序号" prop="serialNum">
          <el-input-number v-model="editForm.serialNum" :min="1" step-strictly
                           label="问题将按序号展示"></el-input-number>
        </el-form-item>
        <el-form-item label="选项">
          <el-button type="primary" icon="el-icon-edit" v-if="handleStatus === 1 || handleStatus === 2" circle
                     @click="openOptionDialog"></el-button>
          <span v-if="!this.editForm.opData.options.length">无</span>
          <span v-for="(item,i) in editForm.opData.options" :key="i">
            <el-tag v-if="item.label" v-text="item.label" style="margin: auto 3px"></el-tag>
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" v-if="handleStatus === 1 || handleStatus === 2" type="primary" :loading="loading"
                   @click="submitForm('editForm')">保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="在此页面编辑选项" :visible.sync="optionDialogVisible" width="50%" style="text-align: center"
               @click="closeOptionDialog" @close="transferOption()" id="optionFormDialog">
      <div v-if="!editForm.opData.options.length">点击 + 号编辑选项</div>
      <el-form v-for="(item ,i) in editForm.opData.options" :key="i" label-width="60px" ref="optionForm">
        <el-form-item :label="`选项${i+1}`">
          <el-input size="small" v-model="editForm.opData.options[i].label" auto-complete="off" placeholder="输入选项文本">
            <el-input-number size="small" v-model="editForm.opData.options[i].value" step-strictly auto-complete="off"
                             slot="append"
                             placeholder="取值">
            </el-input-number>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" icon="el-icon-plus" circle style="float: left" @click="addOption()"></el-button>
        <el-button type="danger" icon="el-icon-minus" circle style="float: left" @click="minusOption()"></el-button>
        <el-button size="small" @click="closeOptionDialog()">关闭</el-button>
        <div style="clear: both"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {saveQuestion, updateQuestion, deleteQuestion} from '../../api/question'

export default {
  data() {
    return {
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      optionDialogVisible: false,
      handleStatus: 3,
      templateId: '',
      questionId: '',
      editForm: {
        moduleId: '',
        moduleNo: '',
        questionNo: '',//问题编号
        queType: '',//0 问题，1 诊断框，2 诊断框下属
        optType: '',//TEXT INPUT RADIO CHECKBOX
        issue: '',//问题内容
        note: '',//问题补充
        answers: '',//该题目由谁做答 todo
        serialNum: '',//排序序号
        opData: {options: []}
      },
      // rules表单验证
      rules: {
        questionNo: [
          {required: true, message: '请输入问题编号', trigger: 'blur'}
        ], queType: [
          {required: true, message: '请选择问题归类', trigger: 'blur'}
        ], optType: [
          {required: true, message: '请选择问题类型', trigger: 'blur'}
        ], issue: [
          {required: true, message: '问题内容不能为空', trigger: 'blur'}
        ], answers: [
          {required: true, message: '请指定由谁做答', trigger: 'blur'}
        ], serialNum: [
          {required: true, message: '请输入排序序号', trigger: 'blur'}
        ]
      },
      //用户数据
      listData: []
    }
  },
  created() {
    this.getData();
    //本页需要moduleId/moduleNo
    this.editForm.moduleId = this.$route.params.moduleId
    this.editForm.moduleNo = this.$route.params.moduleNo
    //返回上一页需要templateId
    this.templateId = this.$route.params.templateId
  },
  methods: {
    backToModule() {
      this.$router.push({
        path: '/EditQn',
        params: {
          templateId: this.templateId
        }
      })
    },
    backToTemplate() {
      this.$router.push({
        path: '/QnFill'
      })
    },
    // 不分页获取列表
    getData() {
      this.loading = true
      // 模拟数据开始
      let res = {
        code: 0,
        msg: null,
        count: 5,
        data: [
          {
            "id": "q10001",
            "questionNo": "2e",
            "queType": 1,
            "optType": "RADIO",
            "issue": "测试一下问题(接口更新1)长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长",
            "note": "补充说明1",
            "answers": 1,
            "optData": {
              "options": [
                {
                  "label": "否",
                  "value": 0
                },
                {
                  "label": "是",
                  "value": 1
                },
                {
                  "label": "不知道",
                  "value": 2
                }
              ]
            },
            "skipRule": null,
            "refIds": [
              "1636340836291145729",
              "q10003"
            ],
            "serialNum": 1
          }
        ]
      }
      this.loading = false
      this.listData = res.data
      // 模拟数据结束

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      // deptList(parameter)
      //   .then(res => {
      //     this.loading = false
      //     if (res.success == false) {
      //       this.$message({
      //         type: 'info',
      //         message: res.msg
      //       })
      //     } else {
      //       this.listData = res.data
      //     }
      //   })
      //   .catch(err => {
      //     this.loading = false
      //     this.$message.error('菜单加载失败，请稍后再试！')
      //   })
    },
    //显示查看界面
    handleCheck: function (index, row) {
      this.questionId = row.id;
      this.editFormVisible = true
      this.handleStatus = 3;
      this.editForm.questionNo = row.questionNo;
      this.editForm.queType = row.queType;
      this.editForm.optType = row.optType;
      this.editForm.issue = row.issue;
      this.editForm.note = row.note;
      this.editForm.answers = row.answers;
      this.editForm.serialNum = row.serialNum;
      this.editForm.opData.options = row.opData.options;
    },
    //显示添加界面
    handleSave: function () {
      this.questionId = '';
      this.editFormVisible = true
      this.handleStatus = 1;
      this.editForm.questionNo = '';
      this.editForm.queType = '';
      this.editForm.optType = '';
      this.editForm.issue = '';
      this.editForm.note = '';
      this.editForm.answers = '';
      this.editForm.serialNum = '';
      this.editForm.opData.options = [];
    },
    //显示编辑界面
    handleUpdate: function (index, row) {
      this.questionId = row.id;
      this.editFormVisible = true
      this.handleStatus = 2;
      this.editForm.questionNo = row.questionNo;
      this.editForm.queType = row.queType;
      this.editForm.optType = row.optType;
      this.editForm.issue = row.issue;
      this.editForm.note = row.note;
      this.editForm.answers = row.answers;
      this.editForm.serialNum = row.serialNum;
      this.editForm.opData.options = row.opData.options;
    },
    // 编辑、增加页面保存方法
    submitForm(formRefsName) {
      this.$refs[formRefsName].validate(valid => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        if (this.handleStatus === 1) {
          saveQuestion(this.editForm).then(res => {
            this.editFormVisible = false
            this.loading = false
            if (res.data.code === "000000") {
              this.getData()
              this.$message.success("保存成功")
            } else {
              this.$message.warning(res.data.msg)
            }
          }).catch(err => {
            this.editFormVisible = false
            this.loading = false
            this.$message.error('系统出错，保存失败')
          })
        } else if (this.handleStatus === 2) {
          updateQuestion(this.questionId, this.editForm).then(res => {
            this.editFormVisible = false
            this.loading = false
            if (res.data.code === "000000") {
              this.getData()
              this.$message.success("保存成功")
            } else {
              this.$message.warning(res.data.msg)
            }
          }).catch(err => {
            this.editFormVisible = false
            this.loading = false
            this.$message.error('系统出错，保存失败')
          })
        }
      })
    },
    // 删除
    deleteItem(index, row) {
      this.$confirm('确定要删除吗？', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteQuestion(row.id).then(res => {
          this.loading = true;
          if (res.data.code === "000000") {
            this.$message.success("操作成功")
            this.getData();
          } else {
            this.$message.warning(res.data.msg)
          }
        }).catch(err => {
          this.loading = false
          this.$message.error('系统错误，操作失败')
        })
      }).catch(err => {
        console.log(err)
      })
    },
    closeDialog() {
      this.editFormVisible = false
    },
    openOptionDialog() {
      this.optionDialogVisible = true;
    },
    closeOptionDialog() {
      this.optionDialogVisible = false;
    },
    addOption() {
      this.editForm.opData.options.push({label: '', value: 0})
    },
    minusOption() {
      this.editForm.opData.options.pop()
    },
    transferOption() {
      let arr = [];
      this.editForm.opData.options.forEach(item => {
        if (item.label) {
          if (!item.value) {
            item.value = 0;
          }
          arr.push(item);
        }
      })
      this.editForm.opData.options = arr;
    }
  }
}
</script>
<style>
#optionFormDialog .el-input-group__append {
  border: 0;
  padding: 0;
}

#optionFormDialog .el-dialog__body {
  padding: 30px 20px 0 20px;
}
</style>
