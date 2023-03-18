<template>
  <div>

    <hr />
    <h3 style="text-align: center">{{ qnFillName }}</h3>
    <hr />

    <el-button type="primary" plain @click="savaTemplate()" style="float: right">保存模板</el-button>

    <el-col>
      <!-- 创建问卷子模块 -->
      <el-row>
        <el-card>
          <el-col> 从空白创建子模块 </el-col>

          <el-col>
            <el-input v-model="createTile" placeholder="请输入子模块名称"></el-input>
          </el-col>

          <el-col>
            <el-button type="primary" @click="toCreateSubQn" >创建子模块</el-button>
          </el-col>
        </el-card>
      </el-row>


      <!-- 查看已编辑子模块部分 -->
      <el-row>
          <el-card>
              显示已编辑子模块
            <el-table
              :data="templateData"
              style="width: 100%">
              <el-table-column
                label="子模板名称"
                prop="moduleName">
              </el-table-column>
              <el-table-column
                align="right">
                <template slot="header" slot-scope="scope">
                  <el-input
                    v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, templateData)">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>

<!--            <test></test>-->
          </el-card>
      </el-row>
    </el-col>
  </div>
</template>

<script>
// 导入组件
// import headerComponent from "./head.vue";
import test from "./test.vue";

// 导出模块
export default {
  // 模块名字
  name: "EditQn",
  // 模块数据
  data() {
    //数据
    return {
      currentId:'',
      qnFillName:'',
      createTile:"",
      subQnList:[],
      templateData:[],
      tableData: [{
        name: '王小虎',
      }, {
        name: '王小虎',
      },],
      search: '',
    };
  },
  // 注册组件
  components: {
    // headerComponent
    test,
  },
  // 监听指定值，只有指定值变化，才会触发
  watch: {},
  // 里面的函数只有调用才会执行（实时计算）里面是定义的方法
  methods: {
    addFun() {},
    submitFun() {},
    toCreateSubQn(){
      if (this.createTile === '') {
        this.$message.error('子问卷标题不能为空')
        return
      }
      this.$router.push({
        name:'SubQnFill',
        params: {
          title:this.createTile,
          row:{"widgetList":[],"formConfig":{"modelName":"formData","refName":"vForm","rulesName":"rules","labelWidth":80,"labelPosition":"top","size":"","labelAlign":"label-left-align","cssCode":"","customClass":"","functions":"","layoutType":"PC","onFormCreated":"","onFormMounted":"","onFormDataChange":""}}
        },
      });

    },
    handleEdit(index, row1) {
      console.log(row1)
      this.$router.push({
        name:'SubQnFill',
        params: {
          row:row1,
          title:row1.subTitle
        },
      })
      // this.$refs.mychild1.clickParent2("嘿嘿嘿",row);
      console.log(index, row1);

    },
    handleDelete(index, templateData) {
      templateData.splice(index, 1);
      console.log(index, templateData);
    },
    queryTemplateById(){

      axios.get(`http://192.168.31.150:8999/que-api/psyquestioner/module?templateId=${this.currentId}`)
        .then(response => {
          // console.log(response)
          this.templateData=response.data.data
          // console.log(this.allTemplateData)
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });


    },
    savaTemplate(){



    },

    // clickParent1(){
    //   this.$refs.mychild1.clickParent2("嘿嘿嘿");
    // },

  },
  // 创建前状态(里面是操作)
  beforeCreate() {},
  // 创建完毕状态(里面是操作)
  created() {},
  // 挂载前状态(里面是操作)
  beforeMount() {},
  // 挂载结束状态(里面是操作)
  mounted() {
    this.currentId=this.$route.params.id
    // console.log(this.currentId)
    this.queryTemplateById(this.currentId)


    this.templateData=this.$store.state.allTemplateData.templateData


    this.qnFillName=this.$route.params. title
    // let nameArr=this.templateData.subTitle
    // this.tableData=nameArr
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
// scoped 样式只在本组件使用
<style scoped>
/**
 * 导入css样式组件
 * @import "../assets/css/components/index.css";
 */
</style>
