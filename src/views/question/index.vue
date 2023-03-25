<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="javascript:void(0)" @click="backToTemplate()">模板管理</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="javascript:void(0)" @click="backToModule()">模块管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>问题管理</el-breadcrumb-item>
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
      <el-table-column align="center" label="操作" width="350">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="openSkipDialog(scope.$index, scope.row)">跳转规则</el-button>
          <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="handleStatus === 1?'添加':handleStatus === 2?'修改':'查看'" :visible.sync="editFormVisible"
               width="60%" @click="closeDialog" v-loading="editFormLoading">
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
          <span v-if="!this.editForm.optData.options.length">无</span>
          <span v-for="(item,i) in editForm.optData.options" :key="i">
            <el-tag v-if="item.label" v-text="item.label" style="margin: auto 3px"></el-tag>
          </span>
        </el-form-item>
        <el-form-item label="参考题目">
          <el-cascader size="small" placeholder="参考题目" :options="moduleSimplifiedCascader"
                       v-model="refIdsForCascader"
                       :props="defaultCascaderProps" ref="refIdsCascader" popper-class="cascader-multi"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" v-if="handleStatus === 1 || handleStatus === 2" type="primary"
                   @click="submitForm('editForm')">保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="在此页面编辑选项" :visible.sync="optionDialogVisible" width="50%"
               @click="closeOptionDialog" @close="transferOption()" id="optionFormDialog">
      <div style="text-align: center" v-if="!editForm.optData.options.length">点击 + 号编辑选项</div>
      <el-form v-for="(item ,i) in editForm.optData.options" :key="i" label-width="60px" ref="optionForm">
        <el-form-item :label="`选项${i+1}`">
          <el-input size="small" v-model="item.label" auto-complete="off"
                    placeholder="输入选项文本">
            <el-input-number size="small" v-model="item.value" step-strictly auto-complete="off" slot="append"
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
    <el-dialog title="在此页面设置跳转规则" :visible.sync="skipDialogVisible" width="40%"
               @click="closeSkipDialog()" v-loading="skipLoading" id="skipFormDialog">
      <div style="text-align: center" v-if="!skipRulesForDialog.length">点击 + 号新增一条规则</div>
      <el-divider v-if="skipRulesForDialog.length"></el-divider>
      <el-form v-for="(skip ,i) in skipRulesForDialog" :key="i">
        <el-form-item :label="`${i+1}、符合以下条件时跳转到`">
          <el-cascader size="small" placeholder="题目" :options="moduleSimplifiedCascader" v-model="skip.target"
                       :props="defaultSkipCascaderProps" ref="" popper-class="cascader-skip"></el-cascader>
          <el-select v-model="skip.type" size="small" placeholder="请选择类型">
            <el-option label="按各题选项跳转" value="1"></el-option>
            <el-option label="按答题分数跳转" value="2"></el-option>
            <el-option label="按选中数量跳转" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="skip.type === '1'" v-for="(condition,j) in skip.conditionJson.conditions" :key="j">
          <!--          condition.questionId是[mid,qid]的数组-->
          <el-cascader size="small" placeholder="题目" :options="moduleSimplifiedCascaderForSkip"
                       v-model="condition.questionId"
                       :props="defaultSkipCascaderProps" popper-class="cascader-skip-condition"></el-cascader>
          <el-select v-model="condition.value" size="small" placeholder="请选择">
            <el-option
              v-for="(option, k) in condition.questionId && condition.questionId.length === 2 ? moduleSimplifiedCascaderForSkip[moduleIdIndexMap[condition.questionId[0]]].questions[questionIdIndexMap[condition.questionId[1]]].optData.options:[{}]"
              :label="option.label" :key="k" :value="option.value"></el-option>
          </el-select>
          <div style="width: 180px;float: right">
            <el-button size="small" type="text">
              <i style="color: #ff4949;font-size: 24px" class="el-icon-circle-plus-outline"
                 @click="addCondition(i)"></i>
            </el-button>
            <el-button size="small" type="text">
              <i style="color: #409eff;font-size: 24px" class="el-icon-remove-outline" @click="minusCondition(i,j)"></i>
            </el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="skip.type === '2'">
          <!--          questions是questionId的数组-->
          <el-cascader size="small" placeholder="题目" :options="moduleSimplifiedCascaderForSkip"
                       v-model="skip.conditionJson.questions" :props="defaultCascaderProps"
                       popper-class="cascader-multi"></el-cascader>
          <span style="padding: 0 0 0 20px">分数应达到</span>
          <el-input-number size="small" v-model="skip.conditionJson.score" step-strictly auto-complete="off"
                           placeholder="取值">
          </el-input-number>
        </el-form-item>
        <el-form-item v-if="skip.type === '3'">
          <span style="padding: 0 0 0 22px">符合的数量应达到</span>
          <el-input-number size="small" v-model="skip.conditionJson.count" step-strictly auto-complete="off"
                           placeholder="取值">
          </el-input-number>
        </el-form-item>
        <el-form-item v-if="skip.type === '3'" v-for="(support,j) in skip.conditionJson.supports" :key="j">
          <!--          opt.questionId是[mid,qid]的数组-->
          <el-cascader size="small" placeholder="题目" :options="moduleSimplifiedCascaderForSkip"
                       v-model="support.questionId"
                       :props="defaultSkipCascaderProps" popper-class="cascader-skip-condition"></el-cascader>
          <el-select v-model="support.value" size="small" placeholder="请选择">
            <el-option
              v-for="(option, k) in support.questionId && support.questionId.length === 2 ? moduleSimplifiedCascaderForSkip[moduleIdIndexMap[support.questionId[0]]].questions[questionIdIndexMap[support.questionId[1]]].optData.options:[{}]"
              :label="option.label" :key="k" :value="option.value"></el-option>
          </el-select>
          <div style="width: 180px;float: right">
            <el-button size="small" type="text">
              <i style="color: #ff4949;font-size: 24px" class="el-icon-circle-plus-outline"
                 @click="addSupport(i)"></i>
            </el-button>
            <el-button size="small" type="text">
              <i style="color: #409eff;font-size: 24px" class="el-icon-remove-outline" @click="minusSupport(i,j)"></i>
            </el-button>
          </div>
        </el-form-item>
        <el-divider></el-divider>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" icon="el-icon-plus" circle style="float: left" @click="addSkip()"></el-button>
        <el-button type="danger" icon="el-icon-minus" circle style="float: left" @click="minusSkip()"></el-button>
        <el-button size="small" @click="commitSkip()">保存</el-button>
        <el-button size="small" @click="closeSkipDialog()">关闭</el-button>
        <div style="clear: both"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  saveQuestion,
  updateQuestion,
  deleteQuestion,
  querySimplifiedTree,
  questionList,
  saveSkip
} from '../../api/question'

export default {
  data() {
    return {
      loading: false, //是显示加载
      editFormLoading: false, //是显示加载
      skipLoading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      optionDialogVisible: false,
      skipDialogVisible: false,
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
        optData: {options: []},
        refIds: []
      },
      skipRules: {},
      refIdsForCascader: [],
      skipRulesForDialog: [],
      moduleIdIndexMap: [],
      questionIdIndexMap: [],
      defaultCascaderProps: {
        label: 'no',
        children: 'questions',
        multiple: true,
        value: 'id'
      },
      defaultSkipCascaderProps: {
        label: 'no',
        children: 'questions',
        value: 'id'
      },
      moduleSimplifiedCascader: [],
      //只有单选，包含选项
      moduleSimplifiedCascaderForSkip: [],
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

    //本页需要moduleId/moduleNo
    this.editForm.moduleId = this.$route.params.moduleId;
    this.editForm.moduleNo = this.$route.params.moduleNo;
    //返回上一页需要templateId
    this.templateId = this.$route.params.templateId;

    this.getData();
  },
  methods: {
    backToModule() {
      this.$router.push({
        name: 'questionModule',
        params: {
          templateId: this.templateId
        }
      })
    },
    backToTemplate() {
      this.$router.push({
        path: '/questionTemplate/index'
      })
    },
    // 不分页获取列表
    getData() {
      this.loading = true;
      questionList(this.editForm.moduleId)
        .then(res => {
          this.loading = false
          if (res.data.code === "000000") {
            this.listData = res.data.data
          } else {
            this.$message.warning(res.data.msg)
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('菜单加载失败，请稍后再试！')
        })
    },
    //显示查看界面
    handleCheck: function (index, row) {
      this.handleStatus = 3;
      //先请求服务器数据
      this.editFormOpened(row);
      //然后填充
      this.loadEditForm(row);
    },
    //显示添加界面
    handleSave: function () {
      this.handleStatus = 1;
      //先请求服务器数据
      this.editFormOpened();
      //然后填充
      this.loadEditForm();
    },
    //显示编辑界面
    handleUpdate: function (index, row) {
      this.handleStatus = 2;
      //先请求服务器数据
      this.editFormOpened(row);
      //然后填充
      this.loadEditForm(row);
    },
    // 编辑、增加页面保存方法
    submitForm(formRefsName) {
      this.$refs[formRefsName].validate(valid => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        this.editForm.refIds = this.transferMQList2QList(this.refIdsForCascader);
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
        //这个只是点击了取消
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
      this.editForm.optData.options.push({label: '', value: 0})
    },
    minusOption() {
      this.editForm.optData.options.pop()
    },
    transferOption() {
      let arr = [];
      this.editForm.optData.options.forEach(item => {
        if (item.label) {
          if (!item.value) {
            item.value = 0;
          }
          arr.push(item);
        }
      })
      this.editForm.optData.options = arr;
    },
    //开启editFormDialog前
    editFormOpened(row) {
      this.editFormLoading = true;
      querySimplifiedTree(this.templateId).then(res => {
        if (res.data.code === "000000") {
          this.moduleSimplifiedCascader = res.data.data.data1;
          //  因为cascader需要，需要一个新的map,key为question,value为module,方便根据question找module
          this.createQuestion2ModuleMap();
          //需要上面的q2mMap 所以回显只能写这里
          this.refIdsForCascader = row && row.refIds ? this.transferQList2MQList(row.refIds) : [];

          let moduleList = res.data.data.data2;
          this.moduleSimplifiedCascaderForSkip = moduleList;
          //需要{mid,mindex}和{qid,qindex}的两个map,用于cascader查找options
          let mIdIndexMap = {};
          let qIdIndexMap = {};
          for (let i in moduleList) {
            let module = moduleList[i];
            mIdIndexMap[module.id] = i;
            for (let j in module.questions) {
              let question = module.questions[j];
              qIdIndexMap[question.id] = j;
            }
          }
          this.moduleIdIndexMap = mIdIndexMap;
          this.questionIdIndexMap = qIdIndexMap;
        } else {
          this.$message.warning(res.data.msg)
        }
        this.editFormLoading = false
      }).catch(err => {
        console.log(err)
        this.editFormLoading = false
        this.editFormVisible = false;
        this.$message.error('系统错误，操作失败')
      })
    },
    openSkipDialog(index, row) {
      this.skipDialogVisible = true;
      this.skipLoading = true;
      this.queId4Skip = row.id;
      querySimplifiedTree(this.templateId).then(res => {
        if (res.data.code === "000000") {
          this.moduleSimplifiedCascader = res.data.data.data1;
          //  因为cascader需要，需要一个新的map,key为question,value为module,方便根据question找module
          this.createQuestion2ModuleMap();
          //需要上面的q2mMap 所以回显只能写这里
          if (row && row.skipRules) {
            this.transfer2SkipCascader(row.skipRules)
          } else {
            this.skipRulesForDialog = [];
          }
          let moduleList = res.data.data.data2;
          this.moduleSimplifiedCascaderForSkip = moduleList;
          //需要{mid,mindex}和{qid,qindex}的两个map,用于cascader查找options
          let mIdIndexMap = {};
          let qIdIndexMap = {};
          for (let i in moduleList) {
            let module = moduleList[i];
            mIdIndexMap[module.id] = i;
            for (let j in module.questions) {
              let question = module.questions[j];
              qIdIndexMap[question.id] = j;
            }
          }
          this.moduleIdIndexMap = mIdIndexMap;
          this.questionIdIndexMap = qIdIndexMap;
        } else {
          this.$message.warning(res.data.msg)
        }
        this.skipLoading = false;
      }).catch(err => {
        console.log(err)
        this.skipDialogVisible = false;
        this.skipLoading = false;
        this.$message.error('系统错误，操作失败')
      })
    },
    closeSkipDialog() {
      this.skipDialogVisible = false;
    },
    //如果参数校验通过，则返回true
    transfer2Skip() {
      let tempList = [];
      for (let i in this.skipRulesForDialog) {
        let s = this.skipRulesForDialog[i];
        if (s.target && s.target.length === 2 && s.type) {
          let temp = {
            target: s.target[1],
            type: s.type,
            queId: this.queId4Skip,
            "serialNum": i
          };
          let cj = s.conditionJson;
          if (s.type === "1") {
            let tempConditions = [];
            for (let i in cj.conditions) {
              let c = cj.conditions[i];
              if (!c.value || !c.questionId[1]) {
                return false;
              }
              tempConditions.push({value: c.value, questionId: c.questionId[1]})
            }
            temp.conditionJson = {"conditions": tempConditions};
          } else if (s.type === "2") {
            if (!cj.questions || cj.questions.length === 0 || (!cj.score && cj.score !== 0)) {
              return false;
            }
            let tempQuestions = [];
            for (let i in cj.questions) {
              let q = cj.questions[i];
              tempQuestions.push(q[1]);
            }
            temp.conditionJson = {"questions": tempQuestions, "score": cj.score};
          } else {
            let tempSupports = [];
            for (let i in cj.supports) {
              let c = cj.supports[i];
              if (!c.value || !c.questionId[1] || (!cj.count && cj.count !== 0)) {
                return false;
              }
              tempSupports.push({value: c.value, questionId: c.questionId[1]})
            }
            temp.conditionJson = {"supports": tempSupports, "count": cj.count};
          }
          tempList.push(temp)
        } else {
          return false;
        }
      }
      this.skipRules = tempList;
      return true;
    },
    transfer2SkipCascader(skipRules) {
      let tempList = [];
      skipRules.forEach(s => {
        let temp = {
          target: [this.question2ModuleMap[s.target], s.target],
          type: s.type + ''
        };
        let cj = s.conditionJson;
        if (s.type === 1) {
          let tempConditions = [];
          cj.conditions.forEach(c => {
            tempConditions.push({value: c.value, questionId: [this.question2ModuleMap[c.questionId], c.questionId]})
          })
          temp.conditionJson = {"conditions": tempConditions};
        } else if (s.type === 2) {
          let tempQuestions = [];
          cj.questions.forEach(q => {
            tempQuestions.push([this.question2ModuleMap[q], q]);
          })
          temp.conditionJson = {"questions": tempQuestions, "score": cj.score};
        } else {
          let tempSupports = [];
          cj.supports.forEach(c => {
            tempSupports.push({value: c.value, questionId: [this.question2ModuleMap[c.questionId], c.questionId]})
          })
          temp.conditionJson = {"supports": tempSupports, "count": cj.count};
        }
        tempList.push(temp)
      });
      this.skipRulesForDialog = tempList;
    },
    loadEditForm(row) {
      if (row) {
        this.questionId = row.id;
        this.editForm.questionNo = row.questionNo;
        this.editForm.queType = row.queType || row.queType === 0 ? row.queType + '' : '';
        this.editForm.optType = row.optType;
        this.editForm.issue = row.issue;
        this.editForm.note = row.note;
        this.editForm.answers = row.answers || row.answers === 0 ? row.answers + '' : '';
        this.editForm.serialNum = row.serialNum;
        //深拷贝
        this.editForm.optData.options = row.optData && row.optData.options ? JSON.parse(JSON.stringify(row.optData.options)) : {}
        //还有一个refIds skiprules，因为需要异步请求的数据，所以写在了异步请求里
      } else {
        this.questionId = '';
        this.editForm.questionNo = '';
        this.editForm.queType = '';
        this.editForm.optType = '';
        this.editForm.issue = '';
        this.editForm.note = '';
        this.editForm.answers = '';
        this.editForm.serialNum = '';
        this.editForm.optData.options = [];
      }
      this.editFormVisible = true;
    },
    // elementUI的cascader必须要上一级的id，所以在这转换
    transferQList2MQList(qList) {
      let mqList = [];
      qList.forEach(q => mqList.push([this.question2ModuleMap[q], q]));
      return mqList;
    },
    transferMQList2QList(mqList) {
      let qList = [];
      mqList.forEach(mq => qList.push(mq[1]));
      return qList;
    },
    createQuestion2ModuleMap() {
      let q2mMap = {};
      let mqList = this.moduleSimplifiedCascader;
      mqList.forEach(m => {
        m.questions.forEach(q => q2mMap[q.id] = m.id)
      })
      this.question2ModuleMap = q2mMap;
    },
    addSkip() {
      this.skipRulesForDialog.push({
        conditionJson: {
          conditions: [{}],
          supports: [{}],
          questions: [],
          count: 0,
          score: 0
        }
      })
    },
    minusSkip() {
      this.skipRulesForDialog.pop()
    },
    addCondition(i) {
      this.skipRulesForDialog[i].conditionJson.conditions.push({})
    },
    minusCondition(i, j) {
      if (this.skipRulesForDialog[i].conditionJson.conditions.length > 1) {
        this.skipRulesForDialog[i].conditionJson.conditions.splice(j, 1)
      }
    },
    addSupport(i) {
      this.skipRulesForDialog[i].conditionJson.supports.push({})
    },
    minusSupport(i, j) {
      if (this.skipRulesForDialog[i].conditionJson.supports.length > 1) {
        this.skipRulesForDialog[i].conditionJson.supports.splice(j, 1)
      }
    },
    commitSkip() {
      this.skipLoading = true;
      let isValid = this.transfer2Skip();
      if (!isValid) {
        this.$message.warning("未填写必填项");
        this.skipLoading = false;
        return;
      }
      saveSkip(this.skipRules).then(res => {
        if (res.data.code === "000000") {
          this.getData()
          this.$message.success("保存成功")
        } else {
          this.$message.warning(res.data.msg)
        }
        this.skipDialogVisible = false;
        this.skipLoading = false;
      }).catch(err => {
        this.skipDialogVisible = false;
        this.skipLoading = false;
        this.$message.error('系统出错，保存失败')
      })
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

.cascader-multi .el-cascader-panel .el-scrollbar:first-child .el-checkbox {
  display: none;
}

#skipFormDialog .el-dialog__header, #optionFormDialog .el-dialog__header {
  text-align: center;
}

#skipFormDialog .el-input {
  width: 180px;
}

#skipFormDialog .el-input-number .el-input {
  width: 130px;
}


#skipFormDialog .el-form-item {
  margin-bottom: 0;
}

#skipFormDialog .el-button--text {
  margin-left: 10px;
}
</style>
