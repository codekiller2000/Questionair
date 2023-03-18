<template>
  <div>
    <el-col>
      <!-- 添加题型部分 -->

      <el-button @click="addSingle">添加单选题</el-button>
      <el-button plain @click="addMulti">添加多选题</el-button>
      <el-button type="primary" plain @click="addFill">添加填写信息题</el-button>
      <el-button type="primary" plain @click="addSingleScore">添加单选并设置分数</el-button>
      <el-button type="primary" @click="addLogic">添加跳转逻辑</el-button>
      <el-button type="primary" @click="addDiagnose">添加诊断框</el-button>

      <el-button type="primary" plain @click="deletSubQn" style="float: right">删除该子问卷</el-button>
      <el-button type="primary" plain @click="submitSubQn" style="float: right">创建子问卷</el-button>

      <hr />
      <h3 style="text-align: center">{{moduleName}}</h3>
      <hr />
      <!-- 查看已编辑题目部分 -->
      <test ref="mychild"></test>
    </el-col>

    <!-- 以下是单选题的创建框 -->
    <el-dialog title="创建单选框" :visible.sync="dialogFormVisibleSingle">
      <el-button type="primary" @click="addTrueFalse">添加是否</el-button>
      <el-button type="primary" @click="addOption">添加选项</el-button>
      <hr>
      <el-form :model="form">
        <el-form-item label="问题编号" :label-width="formLabelWidth">
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题子编号" :label-width="formLabelWidth">
          <el-input v-model="form.subId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题描述" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="答案选项" :label-width="formLabelWidth" v-for="(desc,index) in form.descs" key="index" v-if="desc">
          <el-input v-model="form.descs[index]" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSingle = false;this.form.descs=['']">取 消</el-button>
        <el-button type="primary" @click="addSureSingle">确 定</el-button>
      </div>
    </el-dialog>

    <!--    以下是添加多选的对话框-->
    <el-dialog title="创建多选框" :visible.sync="dialogFormVisibleMultiple">
<!--      <el-button type="primary" @click="addTrueFalse">添加是否</el-button>-->
      <el-button type="primary" @click="addOption">添加选项</el-button>
      <hr>
      <el-form :model="form">
        <el-form-item label="问题编号" :label-width="formLabelWidth">
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题子编号" :label-width="formLabelWidth">
          <el-input v-model="form.subId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题描述" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="答案选项" :label-width="formLabelWidth" v-for="(desc,index) in form.descs" key="index" v-if="desc">
          <el-input v-model="form.descs[index]" autocomplete="off"></el-input>
        </el-form-item>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleMultiple = false;this.form.descs=['']">取 消</el-button>
        <el-button type="primary" @click="addSureMultiple">确 定</el-button>
      </div>
    </el-dialog>

    <!--以下是添加跳转逻辑1-->
    <el-dialog title="创建跳转逻辑" :visible.sync="dialogFormVisibleLogic111">
      <!--      <el-button type="primary" @click="addTrueFalse">添加是否</el-button>-->
      <el-button type="primary" @click="addOption">添加选项</el-button>
      <hr>

      <div class="block">
        <span class="demonstration">这些题目</span>
        <el-cascader
          :options="options"
          :props="props"
          clearable></el-cascader>
        选
        <el-select v-model="value1" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        至少
        <el-input-number></el-input-number>
        跳至
        <el-cascader
          :options="options"
          :props="props"
          clearable></el-cascader>
      </div>

      <div class="block">
        <span class="demonstration">或</span>
        <el-cascader
          :options="options"
          :props="props"
          clearable></el-cascader>
        选
        <el-select v-model="value2" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        至少
        <el-input-number></el-input-number>
        跳至
        <el-cascader
          :options="options"
          :props="props"
          clearable></el-cascader>
      </div>

      <div class="block">
        <span class="demonstration">和</span>
        <el-cascader
          :options="options"
          :props="props"
          clearable></el-cascader>
        选
        <el-select v-model="value2" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        至少
        <el-input-number></el-input-number>
        跳至
        <el-cascader
          :options="options"
          :props="props"
          clearable></el-cascader>
      </div>

      <div class="block">
        <span class="demonstration">这些题目</span>
        <el-cascader
          :options="options"
          :props="props"
          clearable></el-cascader>
        分数至少
        <el-input-number></el-input-number>
        跳至
        <el-cascader
          :options="options"
          :props="props"
          clearable></el-cascader>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleLogic = false;this.form.descs=['']">取 消</el-button>
        <el-button type="primary" @click="addSureLogic">确 定</el-button>
      </div>
    </el-dialog>

    <!--以下是添加跳转逻辑2-->
    <el-dialog title="创建跳转逻辑" :visible.sync="dialogFormVisibleLogic"  :append-to-body="true">
      <!--      <el-button type="primary" @click="addTrueFalse">添加是否</el-button>-->
<!--      <el-button type="primary" @click="addOption">添加选项</el-button>-->
      <hr>
<!--        <tree-component></tree-component>-->
      <test-tree></test-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleLogic = false;this.form.descs=['']">取 消</el-button>
        <el-button type="primary" @click="addSureLogic">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入组件
// import headerComponent from "./head.vue";
import TreeComponent from "./TreeComponent.vue";
import test from "./test.vue";
import testTree from "./testTree.vue";

// 导出模块
export default {
  // 模块名字
  name: "SubQnFill",
  // 模块数据
  data() {
    //数据
    return {
      moduleName:'',
      ifShow:[false],
      dialogFormVisibleLogic111:false,
      dialogFormVisibleSingle: false,
      dialogFormVisibleMultiple:false,
      dialogFormVisibleLogic:false,
      form: {
        name: "",
        descs:[],
        id:'',
        subId:'',
        // '是','否'
        // region: "",
        // date1: "",
        // date2: "",
        // delivery: false,
        // type: [],
        // resource: "",
      },
      formLabelWidth: "120px",

      // 以下为包装好的规则数据
      logicRule:{
        main:{
          option:[],
          choose:'',
          // 注意以下是数值类型
          atLeast:'',
          to:{},
        },
        and:{
          option:[],
          choose:'',
          // 注意以下是数值类型
          atLeast:'',
          to:{},
        },
        or:{
          option:[],
          choose:'',
          // 注意以下是数值类型
          atLeast:'',
          to:{},
        },
        score:{
          option:[],
          // 注意以下是数值类型
          atLeast:'',
          to:{},
        },
      },
      SubQn: [
        {
          moduleId: "A",
          id: "A1",
          subId: "a",
          // 代表所选的题型
          type: 1,
          descs: ["是", "否"],
          typeScore: null,
          issue: "你是否曾经至少有两周，差不多每天的大部分时间一直觉得抑郁或情绪低落",
          subQuestioned: true,
          note: "",
          // 代表谁来回答
          answers: 0,
          skipRuleId: null,
          optRuleId: null,
        },
        {
          moduleId: "A",
          id: "A1",
          subId: "a",
          // 代表所选的题型
          type: 2,
          descs: ["是", "否","a","cc"],
          typeScore: null,
          issue: "你是否曾经至少有两周，差不多每天的大部分时间一直觉得抑郁或情绪低落",
          subQuestioned: true,
          note: "",
          // 代表谁来回答
          answers: 0,
          skipRuleId: null,
          optRuleId: null,
        },
        {
          moduleId: "A",
          id: "A1",
          subId: "a",
          // 代表所选的题型
          type: 2,
          descs: ["是", "否","a","cc"],
          typeScore: null,
          issue: "你是否曾经至少有两周，差不多每天的大部分时间一直觉得抑郁或情绪低落",
          subQuestioned: true,
          note: "",
          // 代表谁来回答
          answers: 0,
          skipRuleId: null,
          optRuleId: null,
        },
        {
          moduleId: "A",
          id: "A1",
          subId: "a",
          // 代表所选的题型
          type: 2,
          descs: ["是", "否","a","cc"],
          typeScore: null,
          issue: "你是否曾经至少有两周，差不多每天的大部分时间一直觉得抑郁或情绪低落",
          subQuestioned: true,
          note: "",
          // 代表谁来回答
          answers: 0,
          skipRuleId: null,
          optRuleId: null,
        },
      ],
    //   以下是逻辑规则的表单(在testTree中)

    };

  },
  // 注册组件
  components: {
    // headerComponent
    TreeComponent,
    test,
    testTree,
  },
  // 监听指定值，只有指定值变化，才会触发
  watch: {},
  // 里面的函数只有调用才会执行（实时计算）里面是定义的方法
  methods: {
    addFun() {},
    submitFun() {},
    addSingle() {
      this.dialogFormVisibleSingle = true;
    },
    addMulti() {
      this.dialogFormVisibleMultiple= true;
    },
    addFill() {},
    addSingleScore() {},
    addLogic() {
      this.dialogFormVisibleLogic=true;


    },
    addDiagnose() {
      this.dialogFormVisibleLogic111=true;
    },
    addTrueFalse(){
      this.form.descs.push(' 是',' 否')
    },
    addOption(){
      this.form.descs.push(' ')
    },
    addSureSingle(){
      this.SubQn.push({
        moduleId: this.form.id.charAt(0),
        id: this.form.id,
        subId: this.form.subId,
        // 代表所选的题型
        type: 1,
        descs: this.form.descs,
        typeScore: null,
        issue: this.form.name,
        subQuestioned: true,
        note: "",
        // 代表谁来回答
        answers: 0,
        skipRuleId: null,
        optRuleId: null,})

      this.dialogFormVisibleSingle = false;
      this.form.name='';
      this.form.descs=[''];
    },
    addSureMultiple(){
      this.SubQn.push({
        moduleId: this.form.id.charAt(0),
        id: this.form.id,
        subId: this.form.subId,
        // 代表所选的题型
        type: 2,
        descs: this.form.descs,
        typeScore: null,
        issue: this.form.name,
        subQuestioned: true,
        note: "",
        // 代表谁来回答
        answers: 0,
        skipRuleId: null,
        optRuleId: null,})

      this.dialogFormVisibleMultiple = false;
      this.form.name='';
      this.form.descs=[''];
    },
    addSureLogic(){

    },
    changeIfShow1(index){
      this.ifShow.splice(index,1);
      this.ifShow.splice(index,0,true)

    },
    changeIfShow2(index){
      this.ifShow.splice(index,1);
      this.ifShow.splice(index,0,false)
    },
    deleteItem(index){
      this.SubQn.splice(index,1)
      console.log(index)
    },
    editItem(index){
      if(this.SubQn[index].type==1) {
        this.dialogFormVisibleSingle=true;

      }
      if(this.SubQn[index].type==2){
        this.dialogFormVisibleMultiple=true;

      }
    },
    deletSubQn(){
      this.$store.commit('removeSubTemplateData')
      this.$router.push('/EditQn')
    },
    submitSubQn(){
      // let allData={
      //   subQN:this.SubQn,
      //   logicRUle:this.logicRule,
      // };
      let key = 'subTitle';
      let value = this.moduleName;
      let subTemplateData=this.$store.state.subTemplateData
      subTemplateData[key]=value

      this.$store.commit('addTemplateData',subTemplateData)

      this.$router.push('/EditQn')
    },
    clickParent(){
      let obj=this.$route.params.row;
      this.$refs.mychild.parentHandleclick(obj);
    },
  },
  // 创建前状态(里面是操作)
  beforeCreate() {},
  // 创建完毕状态(里面是操作)
  created() {},
  // 挂载前状态(里面是操作)
  beforeMount() {},
  // 挂载结束状态(里面是操作)
  mounted()
  {
    this.moduleName=this.$route.params.title;
    // console.log(this.$route.params.row)
    let obj=this.$route.params.row;
    // console.log(obj)

    this.$refs.mychild.parentHandleclick(obj);
    // if(this.$route.params.row!=null){
    //   let obj=this.$route.params.row;
    //   console.log(obj)
    //
    //   this.$refs.mychild.parentHandleclick(obj);
    // }
  },
  // 更新前状态(里面是操作)
  beforeUpdate() {},
  // 更新完成状态(里面是操作)
  updated() {},
  // 销毁前状态(里面是操作)
  beforeDestroy() {},
  // 销毁完成状态(里面是操作)
  destroyed() {},
};
</script>

<style scoped>
/**
 * 导入css样式组件
 * @import "../assets/css/components/index.css";
 */
</style>
