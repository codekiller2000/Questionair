<template>
  <div>



    <el-row>
      <el-col>
        <!-- 从空白创建问卷 -->
        <el-card>
          <el-col>
            从空白创建
          </el-col>

          <el-col>
            <el-input v-model="createTile" placeholder="请输入标题"></el-input>
            <el-input v-model="description" placeholder="请输入描述"></el-input>
          </el-col>

          <el-col>
            <el-button type="primary" @click="toCreateQn">创建问卷</el-button>
          </el-col>
        </el-card>
      </el-col>

      <el-col>

        <el-card>
          显示问卷模板列表

          <el-table
            :data="allTemplateData"
            style="width: 100%">
            <el-table-column
              label="模板名称"
              prop="templateName">
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
                  @click="handleDelete(scope.$index, allTemplateData)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

      </el-col>
    </el-row>
  </div>
</template>

<script>
// 导入组件
// import headerComponent from "./head.vue";
// import Tree from "./Tree.vue";
// 导出模块
import QnFill from "./QnFill.vue";

export default {
  // 模块名字
  name: "QnFill",
  // 模块数据
  data() {
    //数据
    return {
      createTile:'',
      description:'',
      allTemplateData:[],
    };
  },
  // 注册组件
  components: {
    // headerComponent
    // Tree,
  },
  // 监听指定值，只有指定值变化，才会触发
  watch: {},
  // 里面的函数只有调用才会执行（实时计算）里面是定义的方法
  methods: {
    addFun() {},
    submitFun() {},
    toCreateQn(){
      if (this.createTile === '') {
        this.$message.error('问卷标题不能为空')
        return
      }
      let obj={
        title:this.createTile,
        templateData:{},
      }

      axios.post('http://192.168.31.150:8999/que-api/psyquestioner/template',{templateName:this.createTile,description:this.description})
        .then(response => {

          this.$message.success('创建成功')
          this.$store.commit('addAllTemplateData',obj)

          this.$router.push({
            name:'EditQn',
            params:{
              title:this.createTile,
              id:response.data,
            }
          })

          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });


    },
    handleEdit(index, row1) {
      // console.log('wwwwwwwwwwww',index, row1);
      this.$router.push({
        name:'EditQn',
        params: {
          id:row1.id
        },
      })

    },
    handleDelete(index, row) {
      // console.log('我来瞅一瞅',row)
      axios.delete('http://192.168.31.150:8999/que-api/psyquestioner/template/'+row[index].id)
        .then(response => {
          this.getAllTemplate()


          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });


      // console.log(index, row);
    },
    getAllTemplate(){
      axios.get('http://192.168.31.150:8999/que-api/psyquestioner/template')
        .then(response => {
          // console.log(response)
          this.allTemplateData=response.data.data
          // console.log(this.allTemplateData)
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  // 创建前状态(里面是操作)
  beforeCreate() {},
  // 创建完毕状态(里面是操作)
  created() {},
  // 挂载前状态(里面是操作)
  beforeMount() {},
  // 挂载结束状态(里面是操作)
  mounted() {
   this.getAllTemplate()


    this.allTemplateData=this.$store.state.allTemplateData
  },
  // 更新前状态(里面是操作)
  beforeUpdate() {},
  // 更新完成状态(里面是操作)
  updated() {},
  // 销毁前状态(里面是操作)
  beforeDestroy() {},
  // 销毁完成状态(里面是操作)
  destroyed() {}
};
</script>
// scoped 样式只在本组件使用
<style scoped>
/**
 * 导入css样式组件
 * @import "../assets/css/components/index.css";
 */
</style>
